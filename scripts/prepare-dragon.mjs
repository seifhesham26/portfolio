import { mkdir, readFile, writeFile } from "node:fs/promises";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import {
  dedup,
  prune,
  resample,
  meshopt,
  textureCompress,
  weld,
} from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";
import sharp from "sharp";

// Source is extracted from the user's demon-dragon.zip into .cache by Python.
await mkdir("public/models", { recursive: true });
await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });
const document = await io.read(".cache/demon_dragon.glb");
for (const animation of document.getRoot().listAnimations()) {
  if (!/flying/i.test(animation.getName())) animation.dispose();
}
await document.transform(
  dedup(),
  prune(),
  weld(),
  resample(),
  textureCompress({
    encoder: sharp,
    targetFormat: "webp",
    resize: [1024, 1024],
  }),
  meshopt({ encoder: MeshoptEncoder, level: "medium" }),
);
await io.write("public/models/ice-wyvern.glb", document);
const source = await readFile(".cache/demon_dragon.glb");
const output = await readFile("public/models/ice-wyvern.glb");
console.log(
  `Wyvern: ${(source.length / 1e6).toFixed(2)} MB -> ${(output.length / 1e6).toFixed(2)} MB`,
);
console.log(
  "Animations:",
  document
    .getRoot()
    .listAnimations()
    .map((clip) => clip.getName()),
);

const imageSource = process.argv[2];
if (imageSource) {
  await sharp(imageSource)
    .resize(1920)
    .webp({ quality: 85 })
    .toFile("public/images/frozen-landscape.webp");
  console.log("Arctic landscape converted to WebP.");
}
// Keep a reproducible record of the supplied source without committing its 26 MB duplicate.
await writeFile(
  "public/models/README.md",
  `# Ice wyvern\n\nDerived from the user-supplied demon-dragon.zip (source/demon_dragon.glb).\nOriginal rig and flying animation are preserved. Unused clips are removed; geometry\nand animation use Meshopt compression and the AO texture uses WebP.\nIce materials and lighting are applied by components/dragon/DragonScene.tsx.\n\nTo rebuild, extract source/demon_dragon.glb into .cache/demon_dragon.glb and run\n\`pnpm prepare:dragon\`. The original archive did not include licensing information;\nretain any attribution or license supplied with the original download.\n`,
);
