"use client";

import { useEffect, useRef } from "react";
import { education } from "@/lib/data";
import EducationCard from "@/components/ui/EducationCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".edu-heading", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".edu-heading", start: "top 88%" },
      });

      gsap.from(".edu-subheading", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".edu-subheading", start: "top 90%" },
      });

      gsap.from(".edu-underline", {
        scaleX: 0,
        transformOrigin: "center center",
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".edu-underline", start: "top 92%" },
      });

      gsap.utils.toArray<HTMLElement>(".edu-card-wrapper").forEach((wrapper, i) => {
        gsap.from(wrapper, {
          opacity: 0,
          x: i % 2 === 0 ? -40 : 40,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 88%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="education" className="section">
      <div className="container px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            className="edu-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Education &amp; Certifications
          </h2>
          <p className="edu-subheading text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            My academic background, bootcamps, and mandatory service records.
          </p>
          <div className="edu-underline w-16 sm:w-20 h-1 bg-foreground mx-auto rounded-full mt-4" />
        </div>

        {/* Education Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-4 sm:gap-6">
          {education.map((item, index) => (
            <div key={index} className="edu-card-wrapper">
              <EducationCard
                degree={item.degree}
                school={item.school}
                location={item.location}
                date={item.date}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
