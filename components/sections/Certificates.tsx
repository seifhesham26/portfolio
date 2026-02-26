"use client";

import Image from "next/image";
import { certificates } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Certificates() {
  return (
    <section id="certificates" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Certificates
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional certifications from Meta&apos;s Front-End Developer
            program on Coursera
          </p>
          <div className="w-20 h-1 bg-foreground mx-auto rounded-full mt-4" />
        </div>

        {/* Certificates Carousel */}
        <div className="max-w-5xl mx-auto relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full px-4 md:px-16"
          >
            <CarouselContent className="-ml-4">
              {certificates.map((cert, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div
                    onClick={() =>
                      window.open(cert.file, "_blank", "noopener noreferrer")
                    }
                    className="group block h-full cursor-pointer"
                    role="link"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        window.open(cert.file, "_blank", "noopener noreferrer");
                      }
                    }}
                  >
                    <div className="relative flex flex-col h-full min-h-[220px] p-6 rounded-2xl border border-border bg-card hover:border-foreground/30 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:-translate-y-1">
                      {/* Meta Logo */}
                      <div className="mb-4">
                        <Image
                          src="/images/logos/meta.png"
                          alt="Meta"
                          width={80}
                          height={24}
                          className="object-contain"
                        />
                      </div>

                      {/* Certificate Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-2 text-foreground group-hover:text-foreground/80 transition-colors leading-tight">
                          {cert.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-[#0081FB]">
                            {cert.issuer}
                          </span>
                          <span className="mx-2 text-foreground/20">•</span>
                          <span className="text-xs font-mono opacity-60">
                            {cert.credentialId}
                          </span>
                        </p>
                      </div>

                      {/* Action Links */}
                      <div className="flex items-center gap-4 pt-4 mt-auto border-t border-border/50">
                        <span className="text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors flex items-center gap-1.5">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                            />
                          </svg>
                          PDF
                        </span>
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-[#0081FB] hover:text-[#0064E0] transition-colors flex items-center gap-1.5"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                            />
                          </svg>
                          Verify
                        </a>
                      </div>

                      {/* Hover Indicator */}
                      <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex left-0 h-10 w-10 bg-background border-border hover:bg-accent" />
            <CarouselNext className="hidden md:flex right-0 h-10 w-10 bg-background border-border hover:bg-accent" />
          </Carousel>

          {/* Mobile Swipe Hint */}
          <p className="text-center text-xs text-muted-foreground mt-6 md:hidden">
            Swipe to see more →
          </p>
        </div>
      </div>
    </section>
  );
}
