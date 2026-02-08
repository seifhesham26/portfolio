import { projects } from "@/lib/data";
import ProjectCard from "@/components/ui/ProjectCard";

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Projects
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            A selection of projects I&apos;ve worked on, showcasing my skills in
            frontend development
          </p>
          <div className="w-16 sm:w-20 h-1 bg-foreground mx-auto rounded-full mt-4" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              subtitle={project.subtitle}
              description={project.description}
              image={project.image}
              liveUrl={project.liveUrl}
              githubUrl={project.githubUrl}
              tech={project.tech}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
