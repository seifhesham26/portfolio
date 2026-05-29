"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/lib/data";
import ProjectCard from "@/components/ui/ProjectCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".projects-heading", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".projects-heading", start: "top 88%" },
      });

      gsap.from(".projects-subheading", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".projects-subheading", start: "top 90%" },
      });

      gsap.from(".projects-underline", {
        scaleX: 0,
        transformOrigin: "center center",
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".projects-underline", start: "top 92%" },
      });

      gsap.from(".project-card-wrapper", {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 85%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="section">
      <div className="container px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            className="projects-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Projects
          </h2>
          <p className="projects-subheading text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            A selection of projects I&apos;ve worked on, showcasing my skills in
            frontend development
          </p>
          <div className="projects-underline w-16 sm:w-20 h-1 bg-foreground mx-auto rounded-full mt-4" />
        </div>

        {/* Projects Grid */}
        <div className="projects-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <div key={index} className="project-card-wrapper">
              <ProjectCard
                title={project.title}
                subtitle={project.subtitle}
                description={project.description}
                image={project.image}
                liveUrl={project.liveUrl}
                githubUrl={project.githubUrl}
                tech={project.tech}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
