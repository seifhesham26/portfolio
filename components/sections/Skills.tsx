import Image from "next/image";
import { skills } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Tech Stack
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Technologies I work with to build modern, performant web
            applications
          </p>
          <div className="w-16 sm:w-20 h-1 bg-foreground mx-auto rounded-full mt-4" />
        </div>

        <div className="max-w-4xl mx-auto space-y-10 md:space-y-12">
          {/* Core Technologies */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-center mb-5 sm:mb-6 text-muted-foreground">
              Core Languages
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {skills.core.map((skill, index) => (
                <div
                  key={index}
                  className="skill-badge justify-center py-3 sm:py-4 hover:border-foreground/50"
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
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-center mb-5 sm:mb-6 text-muted-foreground">
              Frameworks & Libraries
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {skills.frameworks.map((skill, index) => (
                <div
                  key={index}
                  className="skill-badge justify-center py-3 sm:py-4 hover:border-foreground/50"
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

          {/* Tools & Others */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-center mb-5 sm:mb-6 text-muted-foreground">
              Tools & Technologies
            </h3>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {skills.tools.map((skill, index) => (
                <div
                  key={index}
                  className="skill-badge hover:border-foreground/50 px-3 py-2 sm:px-4"
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
                  <span className="text-xs sm:text-sm font-medium">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
