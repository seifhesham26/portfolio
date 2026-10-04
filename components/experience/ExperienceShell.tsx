"use client";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Menu, X, Pause, Play } from "lucide-react";

const DragonScene = dynamic(() => import("@/components/dragon/DragonScene"), {
  ssr: false,
});
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerMotion = () => true;

export default function ExperienceShell({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    getReducedMotion,
    getServerMotion,
  );
  const motionEnabled = !paused && !reduced;
  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? "on" : "off";
    gsap.registerPlugin(ScrollTrigger);
    if (!motionEnabled) return;
    const context = gsap.context(() => {
      gsap.from(".hero-reveal", {
        y: 55,
        opacity: 0,
        duration: 1.3,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from(".site-header", {
        y: -25,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: element.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      gsap.to(".hero-landscape", {
        yPercent: 15,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      const media = gsap.matchMedia();
      media.add("(min-width: 1024px)", () => {
        const rail = document.querySelector<HTMLElement>(".project-rail");
        const viewport =
          document.querySelector<HTMLElement>(".project-viewport");
        if (!rail || !viewport) return;
        const distance = () =>
          Math.max(0, rail.scrollWidth - viewport.clientWidth);
        const pan = gsap.to(rail, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: "#projects",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        let focusFrame = 0;
        const revealFocusedProject = (event: FocusEvent) => {
          const panel = (event.target as HTMLElement).closest<HTMLElement>(".project-panel");
          const trigger = pan.scrollTrigger;
          if (!panel || !trigger) return;
          const bounds = panel.getBoundingClientRect();
          const visible = viewport.getBoundingClientRect();
          if (bounds.left < visible.left - 1 || bounds.right > visible.right + 1) {
            const first = rail.querySelector<HTMLElement>(".project-panel");
            const offset = Math.min(distance(), panel.offsetLeft - (first?.offsetLeft || 0));
            window.scrollTo({ top: trigger.start + offset, behavior: "instant" });
            ScrollTrigger.update();
            trigger.getTween()?.progress(1);
          }
          viewport.scrollLeft = 0;
          cancelAnimationFrame(focusFrame);
          focusFrame = requestAnimationFrame(() => { viewport.scrollLeft = 0; });
        };
        rail.addEventListener("focusin", revealFocusedProject);
        return () => {
          rail.removeEventListener("focusin", revealFocusedProject);
          cancelAnimationFrame(focusFrame);
        };
      });
      return () => media.revert();
    }, root);
    let disposed = false;
    const refresh = () => {
      if (!disposed) ScrollTrigger.refresh();
    };
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    root.current?.addEventListener("toggle", refresh, true);
    const currentRoot = root.current;
    return () => {
      disposed = true;
      window.removeEventListener("load", refresh);
      currentRoot?.removeEventListener("toggle", refresh, true);
      context.revert();
    };
  }, [motionEnabled]);
  useEffect(() => {
    if (!menuOpen) return;
    root.current?.querySelector<HTMLAnchorElement>(".main-nav a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);
  const closeMenu = () => setMenuOpen(false);
  return (
    <div ref={root} className="experience-root">
      <a href="#portfolio-main" className="skip-link">
        Skip to content
      </a>
      <DragonScene motionEnabled={motionEnabled} />
      <header className="site-header">
        <a
          className="wordmark"
          href="#home"
          aria-label="Seif, back to home"
          onClick={closeMenu}
        >
          SEIF<span>.</span>
        </a>
        <nav
          className={`main-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
          id="main-navigation"
        >
          <a href="#projects" onClick={closeMenu}>
            Work
          </a>
          <a href="#about" onClick={closeMenu}>
            About
          </a>
          <a href="#experience" onClick={closeMenu}>
            Journey
          </a>
          <a href="#contact" onClick={closeMenu} className="nav-contact">
            Let’s talk <ArrowUpRight size={15} />
          </a>
        </nav>
        <div className="header-controls">
          <button
            className="motion-control"
            type="button"
            onClick={() => setPaused(!paused)}
            disabled={reduced}
            aria-pressed={!motionEnabled}
            aria-label={
              reduced
                ? "Motion reduced by system preference"
                : motionEnabled
                  ? "Pause animations"
                  : "Resume animations"
            }
            title={
              reduced
                ? "Reduced motion is enabled in your system settings"
                : undefined
            }
          >
            {motionEnabled ? <Pause size={12} /> : <Play size={12} />}
            <span>
              {reduced
                ? "Motion reduced"
                : motionEnabled
                  ? "Motion on"
                  : "Motion off"}
            </span>
          </button>
          <button
            ref={menuButton}
            className="menu-control"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-controls="main-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
