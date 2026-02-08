import Image from "next/image";
import Link from "next/link";
import { featuredProject } from "@/lib/data";

export default function FeaturedProject() {
  return (
    <section className="section bg-card/50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm mb-4">
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
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {featuredProject.title}
          </h2>
          <p className="text-muted-foreground mt-2">
            {featuredProject.subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          {/* Project Image */}
          <div className="relative aspect-video rounded-xl overflow-hidden mb-12 border border-border">
            <Image
              src={featuredProject.image}
              alt={featuredProject.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Description */}
            <div>
              <h3 className="text-xl font-semibold mb-4">The Challenge</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {featuredProject.description}
              </p>

              <h3 className="text-xl font-semibold mb-4">My Role</h3>
              <p className="text-muted-foreground leading-relaxed">
                As the{" "}
                <span className="text-foreground font-medium">
                  {featuredProject.role}
                </span>
                , I was responsible for building the frontend architecture,
                implementing complex UI components, managing state with Zustand
                and TanStack Query, and ensuring the application maintained high
                performance with real-time features.
              </p>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  href={featuredProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
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
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right: Metrics & Tech */}
            <div>
              {/* Key Metrics */}
              <h3 className="text-xl font-semibold mb-4">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {featuredProject.highlights.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-card rounded-lg border border-border text-center"
                  >
                    <div
                      className="text-2xl font-bold text-foreground mb-1"
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
              <div className="flex flex-wrap gap-2">
                {featuredProject.tech.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-card rounded-lg border border-border text-sm"
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
