"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function CursorGlow() {
  useEffect(() => {
    // Only on non-touch devices
    if (!window.matchMedia("(hover: hover)").matches) return;

    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(glow, {
        x: e.clientX - 300,
        y: e.clientY - 300,
        duration: 1.1,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      glow.remove();
    };
  }, []);

  return null;
}
