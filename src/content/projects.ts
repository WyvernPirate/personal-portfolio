export type Device = "phone" | "laptop";

export type Project = {
  slug: string;
  name: string;
  summary: string;
  role: string;
  stack: string[];
  device: Device;
  /** Basename in /public/shots (without extension). Omit until a real screenshot exists: the mockup shows a styled placeholder and makes no request. */
  shot?: string;
  status: "live" | "in progress" | "shipped" | "hackathon";
  live?: string;
  repo?: string;
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "arrowgate",
    name: "Arrowgate",
    summary:
      "A freight exchange for SADC road transport. Shippers post loads, carriers bid, drivers run trips through to proof of delivery and invoicing.",
    role: "Full stack",
    stack: ["Node.js", "Express", "PostgreSQL", "Supabase", "Expo", "React"],
    device: "phone",
    status: "live",
    live: "https://arrowgate-app.vercel.app",
    highlights: [
      "Three apps: API, customer mobile app and an internal ops console.",
      "KYC and insurance vetting, matching engine, exception queue.",
    ],
  },
  {
    slug: "sentiment",
    name: "Botswana Sentiment Engine",
    summary:
      "Political sentiment analysis for English, Setswana and code-switched text. Detects the language first, then routes to the right model.",
    role: "Final-year project",
    stack: ["Python", "RoBERTa", "XLM-R", "SQLAlchemy", "React"],
    device: "laptop",
    status: "shipped",
    repo: "https://github.com/WyvernPirate/Sentiment_Analysis_Engine",
    highlights: [
      "Hand-curated Setswana lexicon, editable live from the UI.",
      "Batch jobs from CSV or social collectors, with CI and routing tests.",
    ],
  },
  {
    slug: "cyber-game",
    name: "Cybersecurity Awareness Game",
    summary: "A gamified platform that teaches online safety and scam awareness, with progress tracked per player.",
    role: "Lead developer",
    stack: ["React", "Firebase", "Tailwind CSS", "Cloud Functions"],
    device: "laptop",
    status: "hackathon",
    highlights: ["3rd place, ISACA Gaborone Chapter Hackathon, Nov 2024."],
  },
  {
    slug: "medisync",
    name: "MediSync",
    summary: "Find nearby doctors and book appointments, with a separate admin portal to register doctors, specialities and locations.",
    role: "Solo project",
    stack: ["Flutter", "Firebase", "Google Maps API", "React"],
    device: "phone",
    status: "live",
    live: "https://doctorappointmentapp-9f11a.web.app/#/login",
    repo: "https://github.com/WyvernPirate/MediSync-App-Flutter",
    highlights: ["Maps for discovery and navigation; Firebase for auth and data."],
  },
  {
    slug: "growth-beyond-books",
    name: "Growth Beyond Books",
    summary: "Public website and content management system for a foundation, built as a monorepo with a REST API in front of Firestore.",
    role: "Full stack",
    stack: ["React", "TypeScript", "Express", "Firestore", "pnpm workspaces"],
    device: "laptop",
    shot: "growth-beyond-books",
    status: "live",
    live: "https://growthbeyondbooks.org",
    highlights: ["All database access goes through the backend; the admin CMS edits site content."],
  },
  {
    slug: "pioneer-ventures",
    name: "Pioneer Ventures Society",
    summary: "Community site and secure admin panel with role-based moderation, event and member management, and audit logging.",
    role: "Full stack",
    stack: ["React", "TypeScript", "Firebase", "Cloudflare"],
    device: "laptop",
    shot: "pioneer-ventures",
    status: "live",
    live: "https://pioneer-ventures-society.org/",
    repo: "https://github.com/WyvernPirate/Pioneer-Ventures-Society",
    highlights: ["Every public submission is reviewed before it is published."],
  },
  {
    slug: "training-portal",
    name: "Employee Training Portal",
    summary: "Onboarding and training for an automotive spare parts company: courses, quizzes, progress tracking and an admin dashboard.",
    role: "Full stack",
    stack: ["React", "TypeScript", "Firebase"],
    device: "laptop",
    shot: "training-portal",
    status: "live",
    live: "https://employee-training-portal-6a36e.web.app/",
    repo: "https://github.com/WyvernPirate/Employee-Training-Portal",
    highlights: ["Role-based sign-in and reporting."],
  },
  {
    slug: "renta",
    name: "Renta Housing",
    summary: "A mobile-first rental marketplace for Botswana, with phone sign-in, listings, filters and landlord verification.",
    role: "Solo project",
    stack: ["Flutter", "Firebase"],
    device: "phone",
    status: "in progress",
    repo: "https://github.com/WyvernPirate/renta_housing",
    highlights: ["Replaces scattered social-media listings with structured search."],
  },
];
