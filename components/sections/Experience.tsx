import { experiences } from "@/lib/data";
import ExperienceCard from "@/components/ui/ExperienceCard";

export default function Experience() {
  return (
    <section id="experience" className="section bg-card/30">
      <div className="container px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Professional Experience
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            My career journey and the companies I&apos;ve helped build scalable
            frontend solutions with.
          </p>
          <div className="w-16 sm:w-20 h-1 bg-foreground mx-auto rounded-full mt-4" />
        </div>

        {/* Timeline Container */}
        <div className="max-w-4xl mx-auto relative pt-4">
          {/* Vertical Timeline Line */}
          <div className="absolute left-0 sm:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          {/* Cards */}
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <ExperienceCard
                key={index}
                role={exp.role}
                company={exp.company}
                location={exp.location}
                period={exp.period}
                description={exp.description}
                liveUrl={exp.liveUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
