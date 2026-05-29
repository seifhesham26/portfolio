"use client";

import { useEffect, useRef } from "react";
import { experiences } from "@/lib/data";
import ExperienceCard from "@/components/ui/ExperienceCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header
      gsap.from(".exp-heading", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".exp-heading", start: "top 88%" },
      });

      gsap.from(".exp-subheading", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".exp-subheading", start: "top 90%" },
      });

      gsap.from(".exp-underline", {
        scaleX: 0,
        transformOrigin: "center center",
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".exp-underline", start: "top 92%" },
      });

      // Timeline line draws itself as you scroll
      gsap.from(".timeline-line-draw", {
        scaleY: 0,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top 75%",
          end: "bottom 25%",
          scrub: 0.8,
        },
      });

      // Each card slides in from the correct side
      gsap.utils.toArray<HTMLElement>(".exp-card-wrapper").forEach((wrapper, i) => {
        const isLeft = i % 2 !== 0;
        gsap.from(wrapper, {
          opacity: 0,
          x: isLeft ? -60 : 60,
          y: 20,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 87%",
          },
        });

        // Timeline dot pops in
        const dot = wrapper.querySelector(".exp-dot-inner");
        if (dot) {
          gsap.from(dot, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: "back.out(3)",
            scrollTrigger: {
              trigger: wrapper,
              start: "top 87%",
            },
          });
        }

        // Bullet points stagger in
        const bullets = wrapper.querySelectorAll(".exp-bullet");
        if (bullets.length) {
          gsap.from(bullets, {
            opacity: 0,
            x: -15,
            stagger: 0.07,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: wrapper,
              start: "top 82%",
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="section bg-card/30">
      <div className="container px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2
            className="exp-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Professional Experience
          </h2>
          <p className="exp-subheading text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            My career journey and the companies I&apos;ve helped build scalable
            frontend solutions with.
          </p>
          <div className="exp-underline w-16 sm:w-20 h-1 bg-foreground mx-auto rounded-full mt-4" />
        </div>

        {/* Timeline Container */}
        <div className="timeline-container max-w-4xl mx-auto relative pt-4">
          {/* Vertical Timeline Line — animates scaleY on scroll */}
          <div className="absolute left-0 sm:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
            {/* Static background line */}
            <div className="absolute inset-0 bg-border/30" />
            {/* Animated draw line on top */}
            <div className="timeline-line-draw absolute inset-0 bg-border" />
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={index} className={`exp-card-wrapper`}>
                <ExperienceCard
                  role={exp.role}
                  company={exp.company}
                  location={exp.location}
                  period={exp.period}
                  description={exp.description}
                  liveUrl={exp.liveUrl}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
