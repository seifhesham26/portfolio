// Portfolio data - All content centralized here for easy editing

export const personalInfo = {
  name: "Seif El-Den Hesham",
  title: "Frontend Developer",
  location: "Cairo, Egypt",
  bio: "Frontend Developer who owned the entire frontend of a real estate SaaS CRM used by 1,000+ active users across Egypt and UAE — a 60,000-line production codebase, zero errors or warnings. Experienced building real-time systems, AI-integrated interfaces, and complex business dashboards with Next.js and TypeScript. Promoted from intern to full-time based on delivery.",
  email: "seiffmuhammad199@gmail.com",
  phone: "+20 100 052 0888",
};

export const socialLinks = {
  linkedin: "https://linkedin.com/in/seifelden-hesham/",
  github: "https://github.com/seifXXII",
  instagram: "https://www.instagram.com/dawwud1_/",
  facebook: "https://www.facebook.com/profile.php?id=100005168138500",
};

export const stats = [
  { label: "Months Experience", value: 14, suffix: "+" },
  { label: "Frontend Projects", value: 24, suffix: "+" },
  { label: "Team Collaborations", value: 4, suffix: "+" },
  { label: "Components Built", value: 600, suffix: "+" },
];

export const skills = {
  core: [
    { name: "HTML", icon: "/images/logos/html.png" },
    { name: "CSS", icon: "/images/logos/css.png" },
    { name: "JavaScript", icon: "/images/logos/javascript.png" },
    { name: "TypeScript", icon: "/images/logos/ts.png" },
  ],
  frameworks: [
    { name: "React", icon: "/images/logos/react.png" },
    { name: "Next.js", icon: "/images/logos/nextjs.jpg" },
    { name: "GSAP", icon: "/images/logos/gsap.png" },
    { name: "TanStack Query", icon: "/images/logos/tanstack.png" },
    { name: "tRPC", icon: null },
  ],
  tools: [
    { name: "Tailwind CSS", icon: null },
    { name: "Framer Motion", icon: null },
    { name: "Zustand", icon: null },
    { name: "React Hook Form", icon: null },
    { name: "Supabase", icon: null },
    { name: "Prisma", icon: null },
    { name: "Stripe", icon: null },
    { name: "Zod", icon: null },
    { name: "Three.js", icon: null },
    { name: "shadcn/ui", icon: null },
    { name: "Git", icon: "/images/logos/git.svg" },
  ],
};

export const featuredProject = {
  title: "Whispyr AI",
  subtitle: "SaaS CRM Platform",
  role: "Frontend Developer",
  image: "/images/WhispyrAi.png", // Assuming this remains the correct image path
  liveUrl: "https://www.whispyrai.com/",
  description:
    "Sole frontend owner of a real estate SaaS CRM serving 1,000+ active users across Egypt and UAE. Built a real-time WhatsApp chat system and an AI-powered property matching feature based on conversation history.",
  tech: [
    "Next.js 15",
    "TypeScript",
    "Tailwind CSS",
    "Zustand",
    "TanStack Query",
    "Supabase Realtime",
    "whatsapp-web.js",
  ],
  highlights: [
    { metric: "1,000+", label: "Active Users" },
    { metric: "60k", label: "Lines of Code" },
    { metric: "Zero", label: "Errors/Warnings" },
    { metric: "Real-time", label: "WhatsApp Chat" },
  ],
};

export const experiences = [
  {
    role: "Frontend Developer (Intern → Full-time)",
    company: "Whispyr AI",
    location: "Cairo, Egypt",
    period: "May 2025 – Dec 2025",
    description: [
      "Sole frontend owner of a real estate SaaS CRM serving 1,000+ active users across Egypt and UAE; promoted from intern to full-time based on consistent delivery",
      "Owned and maintained a 60,000-line TypeScript/Next.js codebase end-to-end — zero ESLint errors or warnings, with user testing and Sentry-monitored production stability",
      "Built a real-time WhatsApp chat system using Supabase Realtime and whatsapp-web.js, enabling agents to manage live client conversations directly within the CRM",
      "Developed the frontend for an AI-powered property matching feature — ingesting WhatsApp conversation history, notes, and agent interactions to surface ranked property recommendations for agent review",
      "Collaborated in a lean 3-person team (kept as one of two remaining developers after team reduction), defining API contracts with the backend developer and shipping complex features independently",
    ],
  },
  {
    role: "Solo Developer (Founder)",
    company: "Valkyrie",
    location: "Remote",
    period: "Jan 2025 – Feb 2026",
    liveUrl: "https://val-store.vercel.app",
    description: [
      "Built a production-ready e-commerce platform with a fully customizable storefront and landing pages, warehouse management, and order tracking",
      "Integrated secure payment flows via Stripe and Cash on Delivery; used tRPC and Zod for type-safe forms throughout",
      "Achieved LCP of 2.11s (Google Lighthouse) through image optimization, code splitting, and route prefetching",
      "Architected for maintainability with reusable component library, enabling rapid weekly content updates",
    ],
  },
  {
    role: "Frontend / Full-Stack Developer",
    company: "Darelkola",
    location: "Remote",
    period: "Jan 2026 – Present",
    liveUrl: "https://darelkola.vercel.app",
    description: [
      "Developed a bilingual (Arabic/English) CRM for multi-branch clinics managing patients, appointments, and prescriptions",
      "Implemented hybrid appointment scheduling and role-based access control (RBAC) for doctors and staff using Supabase and Prisma",
      "Delivered responsive dark/light mode UI with Tailwind CSS and shadcn/ui; achieved LCP of 2.13s on a data-heavy dashboard",
      "Used React Query and Zod for type-safe server state; added full i18n support via next-intl",
    ],
  },
];

export const education = [
  {
    degree: "Meta Front-End Developer Certificate",
    school: "Meta via Coursera",
    location: "Online",
    date: "Completed Feb 2026",
  },
  {
    degree: "Front-End Web Development Bootcamp",
    school: "Sprints.ai",
    location: "Online",
    date: "Completed Feb 2025",
  },
  {
    degree: "Web Development Fundamentals Course",
    school: "Self-directed / Structured Course",
    location: "Online",
    date: "2024",
  },
  {
    degree: "B.Sc. in Computer Science",
    school: "New Cairo Academy",
    location: "Cairo, Egypt",
    date: "Graduated 2022",
  },
  {
    degree: "Mandatory Military Service",
    school: "Egyptian Armed Forces",
    location: "Egypt",
    date: "May 2023 – June 2024",
  },
];

export const projects = [
  {
    title: "Valkyrie",
    subtitle: "Premium E-Commerce Platform",
    description:
      "A production-ready e-commerce platform with a fully customizable storefront, warehouse management, and order tracking. Features Stripe integration, type-safe forms, and optimized performance.",
    image: "/images/val-store.png",
    liveUrl: "https://val-store.vercel.app",
    githubUrl: "",
    tech: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "Stripe",
      "PostgreSQL",
      "tRPC",
    ],
  },
  {
    title: "Darelkola CRM",
    subtitle: "Multi-branch Clinic Management",
    description:
      "A bilingual (Arabic/English) CRM for multi-branch clinics. Features hybrid appointment scheduling, role-based access control, and complete patient/prescription management.",
    image: "/images/darelkola.svg",
    liveUrl: "https://darelkola.vercel.app",
    githubUrl: "",
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Prisma",
      "React Query",
      "next-intl",
    ],
  },
  {
    title: "iPhone 15 Pro Showcase",
    subtitle: "Immersive Product Experience",
    description:
      "Interactive product showcase with scroll-triggered animations and responsive design.",
    image: "/images/project1.png",
    liveUrl: "https://apple-iphone15pro-psi.vercel.app/",
    githubUrl: "",
    tech: ["React", "Vite", "GSAP", "Tailwind CSS", "Three.js"],
  },
];

export const certificates = [
  {
    title: "Advanced React",
    issuer: "Meta",
    file: "/Certificates/Coursera 60X6QY17J6BU.pdf",
    credentialId: "60X6QY17J6BU",
    verifyUrl: "https://www.coursera.org/verify/60X6QY17J6BU",
  },
  {
    title: "React Basics",
    issuer: "Meta",
    file: "/Certificates/Coursera BBXAB4S3RZM5.pdf",
    credentialId: "BBXAB4S3RZM5",
    verifyUrl: "https://www.coursera.org/verify/BBXAB4S3RZM5",
  },
  {
    title: "Programming with JavaScript",
    issuer: "Meta",
    file: "/Certificates/Coursera Q87LV1R2K67O.pdf",
    credentialId: "Q87LV1R2K67O",
    verifyUrl: "https://www.coursera.org/verify/Q87LV1R2K67O",
  },
  {
    title: "HTML and CSS in depth",
    issuer: "Meta",
    file: "/Certificates/Coursera RMZEBNK1QQIF.pdf",
    credentialId: "RMZEBNK1QQIF",
    verifyUrl: "https://www.coursera.org/verify/RMZEBNK1QQIF",
  },
  {
    title: "Introduction to Front-End Development",
    issuer: "Meta",
    file: "/Certificates/Coursera SAVQU5HBFHQJ.pdf",
    credentialId: "SAVQU5HBFHQJ",
    verifyUrl: "https://www.coursera.org/verify/SAVQU5HBFHQJ",
  },
  {
    title: "Coding Interview Preparation",
    issuer: "Meta",
    file: "/Certificates/Coursera VZQ9ITC8EZ5I.pdf",
    credentialId: "VZQ9ITC8EZ5I",
    verifyUrl: "https://www.coursera.org/verify/VZQ9ITC8EZ5I",
  },
  {
    title: "Front-End Developer Capstone",
    issuer: "Meta",
    file: "/Certificates/Coursera XH1Y16E4AXBV.pdf",
    credentialId: "XH1Y16E4AXBV",
    verifyUrl: "https://www.coursera.org/verify/XH1Y16E4AXBV",
  },
  {
    title: "Version Control",
    issuer: "Meta",
    file: "/Certificates/Coursera Z4VFI84FFVFW.pdf",
    credentialId: "Z4VFI84FFVFW",
    verifyUrl: "https://www.coursera.org/verify/Z4VFI84FFVFW",
  },
  {
    title: "Principles of UX/UI Design",
    issuer: "Meta",
    file: "/Certificates/Coursera ZF8N98YCN6A6.pdf",
    credentialId: "ZF8N98YCN6A6",
    verifyUrl: "https://www.coursera.org/verify/ZF8N98YCN6A6",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];
