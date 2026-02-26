import React from "react";

interface EducationCardProps {
  degree: string;
  school: string;
  location: string;
  date: string;
}

export default function EducationCard({
  degree,
  school,
  location,
  date,
}: EducationCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors shadow-sm group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-foreground">
          {degree}
        </h3>
        <span className="text-xs sm:text-sm font-medium px-3 py-1 bg-muted text-muted-foreground rounded-full whitespace-nowrap w-fit">
          {date}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="text-primary font-medium">{school}</span>
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-border" />
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
    </div>
  );
}
