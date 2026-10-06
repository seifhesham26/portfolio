"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { personalInfo } from "@/lib/data";
import { monogramOuter, monogramInner, svgOutline } from "@/lib/intro-geometry";
import type { createMonogramScene } from "./monogram-scene";

type Props = { onReveal: () => void; onComplete: () => void; replay: boolean };
const seenKey = "seif-portfolio-intro-v1";

export default function BrandIntro({ onReveal, onComplete, replay }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const skipAction = useRef<() => void>(() => {});
  const clip = useId().replaceAll(":", "");
  useEffect(() => {
    const element = root.current;
    const surface = canvas.current;
    if (!element || !surface) return;
    let disposed = false;
    let finished = false;
    let scene: ReturnType<typeof createMonogramScene> | undefined;
    let sequence: gsap.core.Timeline | undefined;
    let fillTween: gsap.core.Tween | undefined;
    const fillState = { fill: 0 };
    const name = element.querySelector<HTMLElement>(".intro-name")!;
    const letters = Array.from(name.querySelectorAll<HTMLElement>("span"));
    const backdrop = element.querySelector(".intro-backdrop");
    const status = element.querySelector(".intro-status");
    const fallback = element.querySelector<SVGElement>(".intro-fallback")!;
    const fillRect = element.querySelector(".intro-fluid-level")!;
    const number = element.querySelector(".intro-percentage")!;
    const meter = element.querySelector("[role=progressbar]")!;
    const skip = element.querySelector<HTMLButtonElement>(".intro-skip")!;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const complete = () => {
      if (finished || disposed) return;
      finished = true;
      try { sessionStorage.setItem(seenKey, "1"); } catch { /* Storage is optional. */ }
      sequence?.kill(); fillTween?.kill();
      document.body.style.overflow = previousOverflow;
      onReveal(); onComplete();
      if (document.activeElement === skip) requestAnimationFrame(() => {
        const target = previousFocus?.isConnected && previousFocus !== document.body
          ? previousFocus : document.querySelector<HTMLElement>(".brand-name");
        target?.focus({ preventScroll: true });
      });
    };
    skipAction.current = complete;
    let alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem(seenKey) === "1"; } catch { /* Storage is optional. */ }
    if ((!replay && alreadySeen) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      complete();
      return () => { disposed = true; document.body.style.overflow = previousOverflow; };
    }
    skip.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") complete();
      if (event.key === "Tab") { event.preventDefault(); skip.focus({ preventScroll: true }); }
    };
    const watchdog = window.setTimeout(complete, 16000);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const preferenceChanged = () => { if (preference.matches) complete(); };
    window.addEventListener("keydown", onKey);
    preference.addEventListener("change", preferenceChanged);
    const updateFill = () => {
      if (disposed) return;
      if (scene) scene.state.fill = fillState.fill;
      fillRect.setAttribute("y", String(2.25 - fillState.fill * 4.5));
      const percent = Math.round(fillState.fill * 100);
      number.textContent = String(percent).padStart(2, "0");
      meter.setAttribute("aria-valuenow", String(percent));
    };
    const lost = () => {
      surface.style.visibility = "hidden";
      fallback.style.visibility = "visible";
      fallback.dataset.fallback = "true";
      // Keep the same fill and handoff when WebGL is unavailable.
    };
    const started = performance.now();
    const reveal = () => {
      if (disposed || finished) return;
      element.dataset.phase = "awakening";
      const first = letters[0].getBoundingClientRect();
      sequence = gsap.timeline();
      const state = scene?.state;
      if (state && surface.style.visibility !== "hidden") {
        sequence.to(state, { scale: 1.12, burst: 1, lens: 1, hue: 1, duration: 0.8, ease: "power2.inOut" })
          .to(state, { lens: 0, hue: 2, duration: 0.8, ease: "power2.inOut" }, 1)
          .to(state, { ...scene!.fit(first), rotationX: 0, rotationY: 0, burst: 0,
            hue: 0, duration: 0.95, ease: "power3.inOut" }, 1.65)
          .to(surface, { opacity: 0, duration: 0.22 }, 2.45);
      } else {
        sequence.to(fallback, { scale: 1.1, filter: "drop-shadow(0 0 24px #7cdbff)", duration: 0.45 })
          .to(fallback, { opacity: 0, scale: 0.4, duration: 0.65 }, 1.75);
      }
      sequence.to(status, { opacity: 0, y: 12, duration: 0.35 }, 0.35)
        .to(letters[0], { opacity: 1, duration: 0.22 }, 2.45)
        .fromTo(letters.slice(1), { opacity: 0, y: 16, rotateX: -65 },
          { opacity: 1, y: 0, rotateX: 0, stagger: 0.024, duration: 0.65, ease: "power3.out" }, 2.25)
        .call(() => {
          element.dataset.phase = "docking";
          onReveal();
          const source = name.getBoundingClientRect();
          const brand = document.querySelector<HTMLElement>(".brand-name");
          const destination = brand?.getBoundingClientRect();
          if (!destination || !brand) { complete(); return; }
          const scale = Math.min(destination.width / source.width, destination.height / source.height);
          gsap.to(name, { x: destination.left + destination.width / 2 - window.innerWidth / 2,
            y: destination.top + destination.height / 2 - window.innerHeight / 2,
            scale, color: getComputedStyle(brand).color,
            duration: 0.95, ease: "power3.inOut", onComplete: complete });
        }, [], 3.15)
        .to(backdrop, { opacity: 0, duration: 0.85, ease: "power2.inOut" }, 3.2)
        .to(skip, { opacity: 0, duration: 0.25 }, 3.15);
    };
    const prepare = async () => {
      try {
        const [rendererModule, assetsModule] = await Promise.all([
          import("./monogram-scene"), import("@/lib/intro-assets"),
        ]);
        if (disposed || finished) return;
        try {
          scene = rendererModule.createMonogramScene(surface, lost);
          await scene.ready;
          if (disposed || finished) return;
          fallback.style.visibility = "hidden";
        } catch { lost(); }
        await assetsModule.warmIntroAssets((value) => {
          if (disposed || finished) return;
          fillTween?.kill();
          fillTween = gsap.to(fillState, { fill: value, duration: 0.65, ease: "power1.out", onUpdate: updateFill });
        });
      } catch { lost(); }
      if (disposed || finished) return;
      fillTween?.kill();
      fillTween = gsap.to(fillState, { fill: 1,
        duration: Math.max(0.45, 2.4 - (performance.now() - started) / 1000),
        ease: "power2.inOut", onUpdate: updateFill, onComplete: reveal });
    };
    void prepare();
    return () => {
      disposed = true;
      sequence?.kill(); fillTween?.kill(); gsap.killTweensOf(name);
      scene?.dispose();
      window.clearTimeout(watchdog);
      window.removeEventListener("keydown", onKey);
      preference.removeEventListener("change", preferenceChanged);
      document.body.style.overflow = previousOverflow;
    };
  }, [onReveal, onComplete, replay]);

  return (
    <div ref={root} className="brand-intro" role="dialog" aria-modal="true" aria-label="Loading Seif El-Den Hesham’s portfolio" data-phase="loading">
      <div className="intro-backdrop" />
      <canvas ref={canvas} className="intro-canvas" aria-hidden="true" />
      <svg className="intro-fallback" viewBox="-2.3 -2.3 4.6 4.6" aria-hidden="true">
        <defs><clipPath id={clip}><path d={svgOutline(monogramInner)} /></clipPath></defs>
        <path d={`${svgOutline(monogramOuter)} ${svgOutline(monogramInner)}`} fillRule="evenodd" fill="#64717d" />
        <path d={svgOutline(monogramInner)} fill="#080d13" />
        <g clipPath={`url(#${clip})`}><rect className="intro-fluid-level" x="-2.3" y="2.25" width="4.6" height="4.6" fill="#f0fcff" /></g>
      </svg>
      <div className="intro-name" aria-hidden="true">
        {Array.from(personalInfo.name.toUpperCase()).map((letter, i) => <span key={i}>{letter === " " ? "\u00a0" : letter}</span>)}
      </div>
      <div className="intro-status">
        <span className="intro-caption">A WORLD TAKES SHAPE</span>
        <div role="progressbar" aria-label="Loading portfolio assets" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
          <span className="intro-percentage">00</span><span className="intro-percent-sign">%</span>
        </div>
        <span className="intro-loading-label">Preparing the experience</span>
      </div>
      <button className="intro-skip" type="button" onClick={() => skipAction.current()}>Skip intro <span aria-hidden="true">↗</span></button>
    </div>
  );
}
