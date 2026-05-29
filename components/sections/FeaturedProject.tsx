"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { featuredProject } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FeaturedProject() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Badge + header
      gsap.from(".fp-badge", {
        opacity: 0,
        scale: 0.8,
        y: -10,
        duration: 0.5,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".fp-badge", start: "top 88%" },
      });

      gsap.from(".fp-heading", {
        opacity: 0,
        y: 35,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".fp-heading", start: "top 88%" },
      });

      gsap.from(".fp-subtitle", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".fp-subtitle", start: "top 90%" },
      });

      // Image: clip-path reveal + parallax
      gsap.from(".fp-image-wrapper", {
        clipPath: "inset(12% 0 12% 0 round 12px)",
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: ".fp-image-wrapper", start: "top 85%" },
      });

      // Parallax on the image itself
      gsap.to(".fp-image-inner", {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: ".fp-image-wrapper",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Description text
      gsap.from(".fp-desc-block", {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: ".fp-desc-block", start: "top 85%" },
      });

      // Metric cards count up + stagger
      gsap.from(".fp-metric", {
        opacity: 0,
        scale: 0.7,
        stagger: 0.1,
        duration: 0.55,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: ".fp-metrics",
          start: "top 85%",
        },
      });

      // Tech tags stagger
      gsap.from(".fp-tech-tag", {
        opacity: 0,
        y: 12,
        stagger: 0.06,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: { trigger: ".fp-tech-tags", start: "top 88%" },
      });

      // CTA button
      gsap.from(".fp-cta", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: ".fp-cta", start: "top 90%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-card/50">
      <div className="container px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <span className="fp-badge inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-yellow-500"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Featured Project
          </span>
          <h2
            className="fp-heading text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {featuredProject.title}
          </h2>
          <p className="fp-subtitle text-muted-foreground mt-2">
            {featuredProject.subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          {/* Project Image */}
          <div className="fp-image-wrapper featured-image-wrapper relative aspect-video rounded-xl mb-10 md:mb-14 border border-border overflow-hidden">
            <div className="fp-image-inner absolute inset-[-8%] top-[-4%] bottom-[-4%]">
              <Image
                src={featuredProject.image}
                alt={featuredProject.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Left: Description */}
            <div className="space-y-6">
              <div className="fp-desc-block">
                <h3 className="text-xl font-semibold mb-3">The Challenge</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {featuredProject.description}
                </p>
              </div>

              <div className="fp-desc-block">
                <h3 className="text-xl font-semibold mb-3">My Role</h3>
                <p className="text-muted-foreground leading-relaxed">
                  As the{" "}
                  <span className="text-foreground font-medium">
                    {featuredProject.role}
                  </span>
                  , I was responsible for building the frontend architecture,
                  implementing complex UI components, managing state with Zustand
                  and TanStack Query, and ensuring the application maintained
                  high performance with real-time features.
                </p>
              </div>

              {/* CTA */}
              <Link
                href={featuredProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fp-cta btn btn-primary inline-flex group"
              >
                View Live Site
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </Link>
            </div>

            {/* Right: Metrics & Tech */}
            <div>
              {/* Key Metrics */}
              <h3 className="text-xl font-semibold mb-4">Key Metrics</h3>
              <div className="fp-metrics grid grid-cols-2 gap-4 mb-8">
                {featuredProject.highlights.map((item, index) => (
                  <div
                    key={index}
                    className="fp-metric p-4 bg-card rounded-xl border border-border text-center stat-card card-glow"
                  >
                    <div
                      className="text-2xl font-bold text-foreground mb-1 gradient-text"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {item.metric}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech Stack */}
              <h3 className="text-xl font-semibold mb-4">Tech Stack</h3>
              <div className="fp-tech-tags flex flex-wrap gap-2">
                {featuredProject.tech.map((tech, index) => (
                  <span
                    key={index}
                    className="fp-tech-tag px-3 py-1.5 bg-card rounded-lg border border-border text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
