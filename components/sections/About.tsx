import { personalInfo, stats } from "@/lib/data";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function About() {
  return (
    <section id="about" className="section bg-card/50">
      <div className="container px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-16">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              About Me
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-foreground mx-auto rounded-full" />
          </div>

          {/* Bio */}
          <div className="mb-12 md:mb-16">
            <p className="text-base sm:text-lg text-muted-foreground text-center leading-relaxed">
              I&apos;m {personalInfo.name.split(" ")[0]}, a{" "}
              <span className="text-foreground font-medium">
                {personalInfo.title.toLowerCase()}
              </span>{" "}
              from {personalInfo.location}. I got into web development after
              completing my military service and haven&apos;t stopped building
              since. I care about code that&apos;s clean, interfaces that feel
              fast, and shipping things that actually work for real people — not
              just in demos.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground text-center leading-relaxed mt-4">
              My experience includes owning the entire frontend of a{" "}
              <span className="text-foreground font-medium">
                real estate SaaS CRM
              </span>{" "}
              serving 1,000+ active users across Egypt and UAE — building
              everything from a real-time WhatsApp chat system to an AI-powered
              property matching interface.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground text-center leading-relaxed mt-4">
              I&apos;m currently open to frontend and React/Next.js roles —
              remote worldwide or on-site in Egypt and UAE.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {stats.map((stat, index) => (
              <AnimatedCounter
                key={index}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>

          {/* Key Qualities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 md:mt-16">
            <div className="p-5 sm:p-6 bg-card rounded-xl border border-border text-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground sm:w-6 sm:h-6"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Quality Focus
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                High-quality results with attention to every detail
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-card rounded-xl border border-border text-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground sm:w-6 sm:h-6"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Clear Communication
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Transparency and clarity at every step
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-card rounded-xl border border-border text-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground sm:w-6 sm:h-6"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                On-Time Delivery
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Projects completed on schedule, every time
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
