import Image from "next/image";
import {
  ArrowUpRight,
  ArrowDownRight,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Download,
  ArrowUp,
} from "lucide-react";
import ExperienceShell from "@/components/experience/ExperienceShell";
import ContactForm from "@/components/experience/ContactForm";
import {
  personalInfo,
  socialLinks,
  featuredProject,
  projects,
  experiences,
  education,
  certificates,
  skills,
} from "@/lib/data";

const portfolioProjects = [featuredProject, ...projects];
const cleanText = (value: string) =>
  value
    .replace(/\s*—\s*/g, ", ")
    .replaceAll("–", "-")
    .replaceAll("→", "to");

export default function Home() {
  return (
    <ExperienceShell>
      <main id="portfolio-main" tabIndex={-1}>
        <section id="home" className="hero">
          <div className="hero-landscape">
            <Image
              src="/images/frozen-landscape.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hero-shade" />
          <div className="hero-content page-container">
            <p className="hero-eyebrow hero-reveal">
              SEIF EL-DEN HESHAM <span>FRONTEND DEVELOPER</span>
            </p>
            <h1 className="hero-reveal">
              Beyond
              <br />
              <span>ordinary.</span>
            </h1>
            <p className="hero-description hero-reveal">
              I build fast, intuitive web experiences with React, Next.js, and a
              little imagination.
            </p>
            <div className="hero-actions hero-reveal">
              <a className="button button-primary" href="#projects">
                Explore work <ArrowDownRight size={18} />
              </a>
              <a
                className="text-link"
                href="/CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                View résumé <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section id="projects" className="work-section content-section">
          <div className="page-container work-heading">
            <p className="section-intro" data-reveal>
              From imagination to production
            </p>
            <h2 data-reveal>
              Ideas made <span>real.</span>
            </h2>
          </div>
          <div className="project-viewport">
            <div className="project-rail">
              {portfolioProjects.map((project, index) => (
                <article
                  key={project.title}
                  className={`project-panel project-panel-${index}`}
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-image"
                    aria-label={`Visit ${project.title}`}
                  >
                    <Image
                      src={project.image}
                      alt={`${project.title} website preview`}
                      width={1600}
                      height={950}
                      sizes="(max-width: 1023px) 92vw, 68vw"
                    />
                    <span className="project-open" aria-hidden="true">
                      <ArrowUpRight size={28} />
                    </span>
                  </a>
                  <div className="project-caption">
                    <div>
                      <p>{project.subtitle}</p>
                      <h3>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.title} <ArrowUpRight size={24} />
                        </a>
                      </h3>
                    </div>
                    <div className="project-technologies">
                      {project.tech.slice(0, 3).map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  </div>
                  <p className="project-description">{project.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="about-section content-section page-container"
        >
          <div className="about-statement" data-reveal>
            <h2>
              A developer.
              <br />
              <span>A little restless.</span>
            </h2>
            <ArrowDownRight
              className="statement-arrow"
              size={64}
              strokeWidth={1}
            />
          </div>
          <div className="about-grid">
            <div className="portrait-frame" data-reveal>
              <Image
                data-parallax
                src="/images/arctic-detail.webp"
                alt="Translucent glacial ice with fine frost and deep blue shadows"
                width={650}
                height={800}
                sizes="(max-width: 767px) 85vw, 32vw"
              />
              <span className="portrait-caption">
                Curiosity is part of the process.
              </span>
            </div>
            <div className="about-copy" data-reveal>
              <p className="large-copy">
                Good interfaces should feel effortless. Getting them there is
                the part I love.
              </p>
              <p>{cleanText(personalInfo.bio)}</p>
              <p>
                I care about the details: the way a page responds, the clarity
                of a complex flow, and the small interaction that makes it feel
                alive.
              </p>
              <a
                href="/CV.pdf"
                className="text-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                View résumé <Download size={17} />
              </a>
            </div>
          </div>
          <div className="proof-strip" data-reveal>
            {featuredProject.highlights.slice(0, 3).map((item) => (
              <div key={item.label}>
                <strong>{item.metric}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="skills-section content-section">
          <div className="page-container">
            <div className="skills-heading" data-reveal>
              <h2>
                My kind
                <br />
                of <span>toolkit.</span>
              </h2>
              <p>A practical foundation for ambitious ideas.</p>
            </div>
            <div className="skill-groups">
              {Object.entries(skills).map(([group, items]) => (
                <div className="skill-group" key={group} data-reveal>
                  <h3>
                    {group === "core"
                      ? "The foundation"
                      : group === "frameworks"
                        ? "The experience"
                        : "The details"}
                  </h3>
                  <div className="skill-items">
                    {items.map((skill) => (
                      <div className="skill-item" key={skill.name}>
                        {skill.icon && (
                          <Image
                            src={skill.icon}
                            alt=""
                            width={24}
                            height={24}
                          />
                        )}
                        <span>{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="experience"
          className="journey-section content-section page-container"
        >
          <h2 data-reveal>
            The work
            <br />
            <span>behind the craft.</span>
          </h2>
          <div className="experience-list">
            {[experiences[2], experiences[0], experiences[1]].map(
              (experience) => (
                <article
                  className="experience-row"
                  key={experience.company}
                  data-reveal
                >
                  <div className="experience-time">
                    <p>{cleanText(experience.period)}</p>
                    <span>{experience.location}</span>
                  </div>
                  <div className="experience-detail">
                    <h3>{experience.company}</h3>
                    <p className="experience-role">
                      {cleanText(experience.role)}
                    </p>
                    <p>{cleanText(experience.description[0])}</p>
                    <details>
                      <summary>
                        More about this role <span>+</span>
                      </summary>
                      <ul>
                        {experience.description.slice(1).map((line) => (
                          <li key={line}>{cleanText(line)}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>

        <section id="education" className="education-section content-section">
          <div className="page-container education-grid">
            <div data-reveal>
              <p className="section-intro">Always learning</p>
              <h2>
                Built on
                <br />
                <span>curiosity.</span>
              </h2>
              <p className="education-note">
                A computer science foundation. A habit of exploring what comes
                next.
              </p>
              <a
                className="text-link"
                href="/CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                View résumé <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="education-list" data-reveal>
              {education.map((item) => (
                <div key={item.degree}>
                  <span>{cleanText(item.date)}</span>
                  <h3>{item.degree}</h3>
                  <p>{item.school}</p>
                </div>
              ))}
            </div>
          </div>
          <div
            id="certificates"
            className="page-container credentials"
            data-reveal
          >
            <details>
              <summary>
                <span>
                  Verified credentials{" "}
                  <small>{certificates.length} certificates from Meta</small>
                </span>
                <span className="disclosure-symbol">+</span>
              </summary>
              <div className="certificate-grid">
                {certificates.map((certificate) => (
                  <div
                    className="certificate-entry"
                    key={certificate.credentialId}
                  >
                    <a
                      href={certificate.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>
                        <strong>{certificate.title}</strong>
                        <small>{certificate.issuer}</small>
                      </span>
                      <Download size={18} />
                    </a>
                    <a
                      className="certificate-verify"
                      href={certificate.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Verify ${certificate.title}`}
                    >
                      Verify <ArrowUpRight size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </section>

        <section
          id="contact"
          className="contact-section content-section page-container"
        >
          <div className="contact-heading" data-reveal>
            <h2>
              Let’s make
              <br />
              <span>something matter.</span>
            </h2>
            <p>
              Have a project or an opportunity in mind? I’d love to hear about
              it.
            </p>
            <a className="contact-email" href={`mailto:${personalInfo.email}`}>
              {personalInfo.email}
              <ArrowUpRight size={18} />
            </a>
            <a
              className="contact-phone"
              href={`tel:${personalInfo.phone.replaceAll(" ", "")}`}
            >
              {personalInfo.phone}
            </a>
          </div>
          <div className="contact-form-wrapper" data-reveal>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="site-footer page-container">
        <div>
          <a className="wordmark" href="#home">
            SEIF<span>.</span>
          </a>
          <p>Made with curiosity. And a dragon.</p>
        </div>
        <div className="footer-links">
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={16} />
            GitHub
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram size={16} />
          </a>
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <Facebook size={16} />
          </a>
          <a href="#home" className="back-top">
            Back to top <ArrowUp size={16} />
          </a>
        </div>
        <p className="copyright">
          © {new Date().getFullYear()} Seif El-Den Hesham
        </p>
      </footer>
    </ExperienceShell>
  );
}
