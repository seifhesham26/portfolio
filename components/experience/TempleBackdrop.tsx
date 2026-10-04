"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";
import gsap from "gsap";
import { useExperienceMotion } from "./MotionPreference";

function Carvings() {
  return (
    <div className="temple-reveal-core">
      <Image
        src="/images/temple-carved.webp"
        alt=""
        fill
        unoptimized
        sizes="100vw"
      />
    </div>
  );
}

export default function TempleBackdrop() {
  const stage = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const memories = useRef<(HTMLDivElement | null)[]>([]);
  const fullRevealRequested = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const motionEnabled = useExperienceMotion();
  useEffect(() => {
    const layer = reveal.current;
    const backdrop = stage.current;
    const hero = backdrop?.closest("section");
    if (!layer || !hero || !backdrop || !motionEnabled) return;
    const traces = memories.current.filter(
      (node): node is HTMLDivElement => node !== null,
    );
    const context = gsap.context(() => {
      gsap.set([layer, ...traces], {
        "--reveal-x": "0px",
        "--reveal-y": "0px",
        opacity: 0,
      });
    });
    const moveX = gsap.quickTo(layer, "--reveal-x", {
      duration: 0.32,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(layer, "--reveal-y", {
      duration: 0.32,
      ease: "power3.out",
    });
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    let lastPoint: { x: number; y: number; time: number } | undefined;
    let pointerInside = false;
    const busyTraces = new Set<HTMLDivElement>();
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || fullRevealRequested.current) return;
      clearTimeout(fadeTimer);
      if (!pointerInside) {
        pointerInside = true;
        gsap.to(layer, {
          opacity: 1,
          duration: 0.35,
          ease: "sine.out",
          overwrite: "auto",
        });
      }
      const bounds = backdrop.getBoundingClientRect();
      const x =
        ((event.clientX - bounds.left) * backdrop.clientWidth) / bounds.width;
      const y =
        ((event.clientY - bounds.top) * backdrop.clientHeight) / bounds.height;
      if (
        lastPoint &&
        event.timeStamp - lastPoint.time > 240 &&
        Math.hypot(x - lastPoint.x, y - lastPoint.y) > 65
      ) {
        // Never reposition a visible trace: let its entire dissolve finish first.
        const trace = traces.find((node) => !busyTraces.has(node));
        if (trace) {
          busyTraces.add(trace);
          gsap.set(trace, {
            "--reveal-x": lastPoint.x + "px",
            "--reveal-y": lastPoint.y + "px",
            opacity: 0.48,
          });
          gsap.to(trace, {
            opacity: 0,
            delay: 0.12,
            duration: 0.8,
            ease: "sine.inOut",
            onComplete: () => {
              busyTraces.delete(trace);
            },
          });
        }
        lastPoint = { x, y, time: event.timeStamp };
      }
      lastPoint ??= { x, y, time: event.timeStamp };
      moveX(x);
      moveY(y);
    };
    const leave = () => {
      pointerInside = false;
      lastPoint = undefined;
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => {
        gsap.to(layer, {
          opacity: 0,
          duration: 0.65,
          ease: "sine.inOut",
          overwrite: "auto",
        });
      }, 150);
    };
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", leave);
    return () => {
      clearTimeout(fadeTimer);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      moveX.tween.kill();
      moveY.tween.kill();
      gsap.killTweensOf([layer, ...traces]);
      context.revert();
    };
  }, [motionEnabled]);
  return (
    <>
      <div className="temple-backdrop" aria-hidden="true">
        <div className="temple-stage" ref={stage}>
          <Image
            className="temple-base"
            src="/images/temple-quiet.webp"
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
          />
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="temple-memory"
              ref={(node) => {
                memories.current[index] = node;
              }}
            >
              <Carvings />
            </div>
          ))}
          <div className="temple-reveal" ref={reveal}>
            <Carvings />
          </div>
          <div className="temple-full-reveal" data-revealed={revealed}>
            <Image
              src="/images/temple-carved.webp"
              alt=""
              fill
              unoptimized
              sizes="100vw"
            />
          </div>
        </div>
        <div className="temple-atmosphere" />
      </div>
      <button
        className="temple-reveal-control"
        type="button"
        aria-pressed={revealed}
        onClick={() => {
          fullRevealRequested.current = !revealed;
          setRevealed(!revealed);
        }}
      >
        {revealed ? <X size={14} /> : <Sparkles size={14} />}
        {revealed ? "Hide carvings" : "Reveal carvings"}
      </button>
    </>
  );
}
