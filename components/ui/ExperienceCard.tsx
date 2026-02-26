import React from "react";

interface ExperienceCardProps {
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  liveUrl?: string;
}

export default function ExperienceCard({
  role,
  company,
  location,
  period,
  description,
  liveUrl,
}: ExperienceCardProps) {
  return (
    <div className="relative pl-8 sm:pl-0">
      {/* Timeline dot (Mobile: Left, Desktop: Center) */}
      <div className="absolute left-0 sm:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 mt-1.5 sm:mt-0 z-10" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full sm:even:flex-row-reverse mb-8 group">
        {/* Empty space for symmetric staggered timeline on desktop */}
        <div className="hidden sm:block w-[calc(50%-1.5rem)]" />

        {/* Content Card */}
        <div className="w-full sm:w-[calc(50%-1.5rem)] bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h3 className="text-xl font-bold text-foreground">{role}</h3>
            <span className="text-sm font-medium px-3 py-1 bg-muted text-muted-foreground rounded-full whitespace-nowrap w-fit">
              {period}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-primary font-medium">{company}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              {location}
            </span>
          </div>

          <ul className="space-y-2 mb-4">
            {description.map((item, idx) => (
              <li
                key={idx}
                className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2"
              >
                <span className="text-primary mt-1.5 text-[10px]">▶</span>
                {item}
              </li>
            ))}
          </ul>

          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors mt-2"
            >
              View Project
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
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
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
