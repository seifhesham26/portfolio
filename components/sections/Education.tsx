import { education } from "@/lib/data";
import EducationCard from "@/components/ui/EducationCard";

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Education & Certifications
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            My academic background, bootcamps, and mandatory service records.
          </p>
          <div className="w-16 sm:w-20 h-1 bg-foreground mx-auto rounded-full mt-4" />
        </div>

        {/* Education Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-4 sm:gap-6">
          {education.map((item, index) => (
            <EducationCard
              key={index}
              degree={item.degree}
              school={item.school}
              location={item.location}
              date={item.date}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
