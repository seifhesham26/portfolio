"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredProject, projects } from "@/lib/data";
import { useExperienceMotion } from "./MotionPreference";

// The two existing Vercel demos currently return DEPLOYMENT_NOT_FOUND.
// Keep their original URLs in data.ts for when the deployments are restored.
const work = [
  { ...featuredProject, demoAvailable: true },
  ...projects.map((project) => ({ ...project, demoAvailable: false })),
];

export default function ProjectShowcase() {
  const [selected, setSelected] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const motion = useExperienceMotion();
  const project = work[selected];
  const previewClass = "project-preview project-transition" +
    (selected > 0 ? " project-preview-brand" : "");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      if (motion) {
        gsap.from(".project-transition", {
          y: 18,
          opacity: 0,
          duration: 0.55,
          stagger: 0.055,
          ease: "power3.out",
        });
      }
    }, panel);
    ScrollTrigger.refresh();
    return () => context.revert();
  }, [selected, motion]);

  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      next = (index + 1) % work.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      next = (index + work.length - 1) % work.length;
    } else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = work.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  };

  const artwork = (
    <>
      <Image
        key={project.image}
        src={project.image}
        alt={project.title + (selected ? " project artwork" : " website preview")}
        width={1600}
        height={950}
        sizes="(max-width: 767px) 90vw, (max-width: 1023px) 80vw, 51vw"
      />
      {project.demoAvailable && (
        <span className="project-open" aria-hidden="true">
          <ArrowUpRight size={23} />
        </span>
      )}
    </>
  );

  return (
    <div className="project-showcase page-container">
      <div className="project-selector" role="tablist" aria-label="Selected projects">
        {work.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            id={"project-tab-" + index}
            aria-controls="project-detail"
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            ref={(element) => { tabs.current[index] = element; }}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => navigate(event, index)}
          >
            <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="project-option">
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </span>
            <ArrowUpRight className="project-select-arrow" size={20} aria-hidden="true" />
          </button>
        ))}
        <p className="project-selector-note">
          Real products.<br />From the first idea to the final detail.
        </p>
      </div>
      <div
        ref={panel}
        id="project-detail"
        className="project-detail"
        role="tabpanel"
        aria-labelledby={"project-tab-" + selected}
        tabIndex={0}
      >
        {project.demoAvailable ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={previewClass}
            aria-label={"Visit " + project.title}
          >
            {artwork}
          </a>
        ) : <div className={previewClass}>{artwork}</div>}
        <div className="project-detail-heading project-transition">
          <div><p>{project.subtitle}</p><h3>{project.title}</h3></div>
          {project.demoAvailable ? (
            <a className="text-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              Visit project <ArrowUpRight size={16} />
            </a>
          ) : <span className="project-demo-status">Public demo unavailable</span>}
        </div>
        <p className="project-description project-transition">{project.description}</p>
        <ul className="project-technologies project-transition" aria-label="Technologies">
          {project.tech.map((tech) => <li key={tech}>{tech}</li>)}
        </ul>
      </div>
    </div>
  );
}
