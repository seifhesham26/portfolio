"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { skills } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header
      gsap.from(".skills-heading", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".skills-heading", start: "top 88%" },
      });

      gsap.from(".skills-subheading", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".skills-subheading", start: "top 90%" },
      });

      gsap.from(".skills-underline", {
        scaleX: 0,
        transformOrigin: "center center",
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".skills-underline", start: "top 92%" },
      });

      // Category labels slide in
      gsap.from(".skills-category-label", {
        opacity: 0,
        x: -20,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: ".skills-core", start: "top 88%" },
      });

      // Core badges bounce in
      gsap.from(".core-badge", {
        opacity: 0,
        y: 35,
        scale: 0.85,
        stagger: 0.07,
        duration: 0.55,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".skills-core", start: "top 85%" },
      });

      // Framework badges bounce in
      gsap.from(".framework-badge", {
        opacity: 0,
        y: 35,
        scale: 0.85,
        stagger: 0.07,
        duration: 0.55,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".skills-frameworks", start: "top 85%" },
      });

      // Marquee label
      gsap.from(".tools-label", {
        opacity: 0,
        x: -20,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: ".tools-label", start: "top 90%" },
      });

      // Marquee fades in as a whole
      gsap.from(".marquee-wrapper", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".marquee-wrapper", start: "top 88%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toolItems = [...skills.tools, ...skills.tools];

  return (
    <section ref={sectionRef} id="skills" className="section">
      <div className="container px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            className="skills-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Tech Stack
          </h2>
          <p className="skills-subheading text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Technologies I work with to build modern, performant web
            applications
          </p>
          <div className="skills-underline w-16 sm:w-20 h-1 bg-foreground mx-auto rounded-full mt-4" />
        </div>

        <div className="max-w-4xl mx-auto space-y-10 md:space-y-14">
          {/* Core Languages */}
          <div className="skills-core">
            <h3 className="skills-category-label text-base sm:text-lg font-semibold text-center mb-5 sm:mb-6 text-muted-foreground">
              Core Languages
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {skills.core.map((skill, index) => (
                <div
                  key={index}
                  className="core-badge skill-badge justify-center py-3 sm:py-4 hover:border-foreground/50"
                >
                  {skill.icon && (
                    <Image
                      src={skill.icon}
                      alt={skill.name}
                      width={28}
                      height={28}
                      className="object-contain sm:w-8 sm:h-8"
                    />
                  )}
                  <span className="font-medium text-sm sm:text-base">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Frameworks & Libraries */}
          <div className="skills-frameworks">
            <h3 className="skills-category-label text-base sm:text-lg font-semibold text-center mb-5 sm:mb-6 text-muted-foreground">
              Frameworks &amp; Libraries
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {skills.frameworks.map((skill, index) => (
                <div
                  key={index}
                  className="framework-badge skill-badge justify-center py-3 sm:py-4 hover:border-foreground/50"
                >
                  {skill.icon && (
                    <Image
                      src={skill.icon}
                      alt={skill.name}
                      width={28}
                      height={28}
                      className="object-contain sm:w-8 sm:h-8"
                    />
                  )}
                  <span className="font-medium text-sm sm:text-base">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools — infinite marquee */}
          <div>
            <h3 className="tools-label text-base sm:text-lg font-semibold text-center mb-5 sm:mb-6 text-muted-foreground">
              Tools &amp; Technologies
            </h3>
            <div className="marquee-wrapper relative overflow-hidden">
              {/* Fade masks on the edges */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              <div className="marquee-inner gap-3 py-1">
                {toolItems.map((skill, index) => (
                  <div
                    key={index}
                    className="skill-badge shrink-0 hover:border-foreground/50 px-3 py-2 sm:px-4"
                  >
                    {skill.icon && (
                      <Image
                        src={skill.icon}
                        alt={skill.name}
                        width={20}
                        height={20}
                        className="object-contain sm:w-6 sm:h-6"
                      />
                    )}
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
