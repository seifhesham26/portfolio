"use client";
import {
  useEffect,
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPreference } from "./MotionPreference";
import { createSectionMotion } from "./section-motion";
import { ArrowUpRight, Menu, X, Pause, Play } from "lucide-react";
import BrandIntro from "@/components/intro/BrandIntro";
import { personalInfo } from "@/lib/data";

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
const subscribeHydration = () => () => {};
const getHydrated = () => true;
const getServerHydrated = () => false;

export default function ExperienceShell({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const introPlayed = useRef(false);
  const initialAnchorAligned = useRef(false);
  const [paused, setPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dragonEntered, setDragonEntered] = useState(false);
  const [introPhase, setIntroPhase] = useState<"loading" | "revealing" | "done">("loading");
  const [replay, setReplay] = useState(false);
  const hydrated = useSyncExternalStore(subscribeHydration, getHydrated, getServerHydrated);
  const introActive = hydrated && introPhase !== "done";
  const revealPortfolio = useCallback(() => setIntroPhase("revealing"), []);
  const completeIntro = useCallback(() => setIntroPhase("done"), []);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    getReducedMotion,
    getServerMotion,
  );
  const motionEnabled = !paused && !reduced;
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const setTemple = () => {
      const hero = document.getElementById("home");
      document.documentElement.dataset.temple = String(
        (hero?.getBoundingClientRect().bottom || 0) > 100,
      );
    };
    const headerTrigger = ScrollTrigger.create({
      trigger: "#home",
      start: "top top",
      end: "bottom 100px",
      onToggle: setTemple,
      onRefresh: setTemple,
    });
    setTemple();
    const laterSections = root.current?.querySelectorAll(".content-section");
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setDragonEntered(true);
        observer.disconnect();
      }
    });
    laterSections?.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      headerTrigger.kill();
      delete document.documentElement.dataset.temple;
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? "on" : "off";
    gsap.registerPlugin(ScrollTrigger);
    if (!motionEnabled || !hydrated || introPhase === "loading") return;
    const playIntro = !introPlayed.current;
    const context = gsap.context(() => {
      if (playIntro) {
        gsap.from(".hero-reveal", {
          y: 30,
          clipPath: "inset(0 0 100% 0)",
          opacity: 0,
          duration: 1.3,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.1,
          onStart: () => {
            introPlayed.current = true;
          },
        });
        gsap.from(".site-header", {
          y: -25,
          opacity: 0,
          duration: 0.9,
          ease: "power2.out",
        });
      }
      return createSectionMotion(playIntro);
    }, root);
    let disposed = false;
    let anchorFrame = 0;
    const refresh = () => {
      if (!disposed) ScrollTrigger.refresh();
    };
    document.fonts.ready.then(() => {
      refresh();
      if (disposed || initialAnchorAligned.current) return;
      initialAnchorAligned.current = true;
      let anchor: HTMLElement | null = null;
      try {
        anchor = document.getElementById(
          decodeURIComponent(window.location.hash.slice(1)),
        );
      } catch {
        return;
      }
      const initialAnchor = anchor;
      if (initialAnchor)
        anchorFrame = requestAnimationFrame(() => {
          if (!disposed) {
            ScrollTrigger.refresh();
            initialAnchor.scrollIntoView({
              behavior: "instant",
              block: "start",
            });
          }
        });
    });
    window.addEventListener("load", refresh);
    root.current?.addEventListener("toggle", refresh, true);
    const currentRoot = root.current;
    return () => {
      disposed = true;
      cancelAnimationFrame(anchorFrame);
      window.removeEventListener("load", refresh);
      currentRoot?.removeEventListener("toggle", refresh, true);
      context.revert();
    };
  }, [motionEnabled, hydrated, introPhase]);
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
    <MotionPreference value={motionEnabled}>
      <div ref={root} className="experience-root">
        {introActive && <BrandIntro onReveal={revealPortfolio} onComplete={completeIntro} replay={replay} />}
        <div className="portfolio-content" inert={introActive} aria-hidden={introActive ? true : undefined}>
        <a href="#portfolio-main" className="skip-link">
          Skip to content
        </a>
        {dragonEntered && !reduced && introPhase === "done" && (
          <DragonScene motionEnabled={motionEnabled} />
        )}
        <header className="site-header">
          <a
            className={`wordmark brand-name ${introActive ? "brand-awaiting" : ""}`}
            href="#home"
            aria-label={`${personalInfo.name}, back to home`}
            onClick={closeMenu}
          >
            <span>SEIF EL-DEN</span><span>HESHAM</span>
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
        <div className="intro-replay-row page-container">
          <button type="button" className="intro-replay" onClick={() => {
            setReplay(true);
            setMenuOpen(false);
            introPlayed.current = false;
            setIntroPhase("loading");
          }}>Replay introduction <ArrowUpRight size={13} /></button>
        </div>
        </div>
      </div>
    </MotionPreference>
  );
}
