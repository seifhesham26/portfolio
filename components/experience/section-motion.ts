import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Each section has a distinct gesture; GSAP's parent context owns all cleanup. */
export function createSectionMotion(playIntro: boolean) {
  const enter = (
    target: HTMLElement | null,
    from: gsap.TweenVars,
    trigger: Element | null = target,
    stagger = 0,
  ) => {
    if (
      !target ||
      !trigger ||
      (!playIntro && target.getBoundingClientRect().top < window.innerHeight)
    )
      return;
    const children = stagger ? Array.from(target.children) : target;
    gsap.from(children, {
      duration: 0.95,
      ease: "power3.out",
      ...from,
      stagger,
      scrollTrigger: { trigger, start: "top 85%", once: true },
    });
  };
  const find = (selector: string) =>
    document.querySelector<HTMLElement>(selector);
  enter(find(".work-heading"), { y: 32, clipPath: "inset(100% 0 0 0)" });
  gsap.to(".temple-stage", {
    scale: 1.18,
    yPercent: 8,
    ease: "none",
    scrollTrigger: {
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
  gsap.to(".hero-content", {
    y: -90,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: "#home",
      start: "top top",
      end: "bottom 25%",
      scrub: true,
    },
  });
  enter(find(".about-statement"), { x: -45, opacity: 0 });
  enter(find(".portrait-frame"), {
    clipPath: "inset(0 100% 0 0)",
    duration: 1.35,
  });
  enter(find(".about-copy"), { y: 24, opacity: 0 }, find(".about-copy"), 0.12);
  enter(
    find(".proof-strip"),
    { y: 22, opacity: 0 },
    find(".proof-strip"),
    0.16,
  );
  gsap.fromTo(
    ".portrait-frame img",
    { yPercent: -4, scale: 1.06 },
    {
      yPercent: 4,
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".portrait-frame",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );
  enter(find(".skills-heading"), { y: 30, clipPath: "inset(0 0 100% 0)" });
  gsap.utils.toArray<HTMLElement>(".skill-group").forEach((group, index) => {
    enter(group.querySelector("h3"), { opacity: 0 }, group);
    enter(
      group.querySelector(".skill-items"),
      {
        x: index % 2 ? 24 : -24,
        y: 12,
        scale: 0.94,
        opacity: 0,
        ease: "back.out(1.3)",
        duration: 0.65,
      },
      group,
      0.045,
    );
  });
  enter(find(".journey-section > h2"), {
    clipPath: "inset(0 100% 0 0)",
    x: -20,
  });
  gsap.fromTo(
    ".experience-list",
    { "--journey-progress": 0 },
    {
      "--journey-progress": 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".experience-list",
        start: "top 65%",
        end: "bottom 65%",
        scrub: true,
      },
    },
  );
  gsap.utils
    .toArray<HTMLElement>(".experience-row")
    .forEach((row) => enter(row, { x: 48, opacity: 0 }));
  enter(find(".education-grid > div:first-child"), { y: 35, opacity: 0 });
  enter(
    find(".education-list"),
    { y: 32, clipPath: "inset(0 0 100% 0)", opacity: 0 },
    find(".education-list"),
    0.15,
  );
  enter(find(".credentials"), {
    scaleX: 0.92,
    opacity: 0,
    transformOrigin: "left center",
  });
  enter(find(".contact-heading"), { x: -32, opacity: 0 });
  enter(find(".contact-form-wrapper"), { x: 32, opacity: 0, duration: 1.15 });
  const mobile = gsap.matchMedia();
  mobile.add("(max-width: 1023px)", () => {
    gsap.utils
      .toArray<HTMLElement>(".project-panel")
      .forEach((panel) => enter(panel, { y: 40, opacity: 0 }));
  });
  const media = gsap.matchMedia();
  media.add("(min-width: 1024px)", () => {
    const rail = document.querySelector<HTMLElement>(".project-rail");
    const viewport = document.querySelector<HTMLElement>(".project-viewport");
    if (!rail || !viewport) return;
    const distance = () => Math.max(0, rail.scrollWidth - viewport.clientWidth);
    const pan = gsap.to(rail, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        id: "project-pan",
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
      const panel = (event.target as HTMLElement).closest<HTMLElement>(
        ".project-panel",
      );
      const trigger = pan.scrollTrigger;
      if (!panel || !trigger) return;
      const bounds = panel.getBoundingClientRect();
      const visible = viewport.getBoundingClientRect();
      if (bounds.left < visible.left - 1 || bounds.right > visible.right + 1) {
        const first = rail.querySelector<HTMLElement>(".project-panel");
        const offset = Math.min(
          distance(),
          panel.offsetLeft - (first?.offsetLeft || 0),
        );
        window.scrollTo({
          top: trigger.start + offset,
          behavior: "instant",
        });
        ScrollTrigger.update();
        trigger.getTween()?.progress(1);
      }
      viewport.scrollLeft = 0;
      cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(() => {
        viewport.scrollLeft = 0;
      });
    };
    rail.addEventListener("focusin", revealFocusedProject);
    return () => {
      rail.removeEventListener("focusin", revealFocusedProject);
      cancelAnimationFrame(focusFrame);
    };
  });
  return () => {
    media.revert();
    mobile.revert();
  };
}
