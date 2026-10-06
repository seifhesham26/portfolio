import { Cache, FileLoader, ImageLoader } from "three";
import { assetProgress } from "./intro-geometry";

const images = [
  "/images/temple-quiet.webp", "/images/temple-carved.webp",
  "/textures/wyvern-pearl-scales.webp", "/textures/wyvern-wing-membrane.webp",
];

/** Warm the same Three cache used by the dragon, instead of downloading it twice. */
export async function warmIntroAssets(report: (progress: number) => void) {
  Cache.enabled = true;
  const weights = [0.65, ...images.map(() => 0.05), 0.05, 0.1];
  const progress = weights.map(() => 0);
  const update = (index: number, value: number) => {
    progress[index] = Math.max(progress[index], value);
    report(assetProgress(progress, weights));
  };
  const model = new Promise<void>((resolve) => {
    const done = () => { update(0, 1); resolve(); };
    new FileLoader().setResponseType("arraybuffer").load("/models/ice-wyvern.glb", done,
      (event) => { if (event.total > 0) update(0, event.loaded / event.total); }, done);
  });
  const pictures = images.map((url, i) => new Promise<void>((resolve) => {
    const done = () => { update(i + 1, 1); resolve(); };
    new ImageLoader().load(url, done, undefined, done);
  }));
  const fonts = document.fonts.ready.then(() => update(5, 1));
  const scene = import("@/components/dragon/DragonScene").then(() => update(6, 1), () => update(6, 1));
  let timeout: ReturnType<typeof setTimeout> | undefined;
  await Promise.race([
    Promise.allSettled([model, ...pictures, fonts, scene]),
    new Promise<void>((resolve) => { timeout = setTimeout(resolve, 10000); }),
  ]);
  clearTimeout(timeout);
  // A failed asset must not trap navigation behind the introduction.
  report(1);
}
