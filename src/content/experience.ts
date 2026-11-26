export type LogEntry = {
  hash: string;
  title: string;
  org: string;
  period: string;
  kind: "work" | "study" | "lead";
  bullets: string[];
};

// Newest first, like `git log`.
export const experience: LogEntry[] = [
  {
    hash: "a7c3e91",
    title: "Chairperson",
    org: "BIUST Innovation Club",
    period: "Aug 2025 – Aug 2026",
    kind: "lead",
    bullets: [
      "Led the club after a year as a member (Oct 2024 – Aug 2025).",
      "Open-source contributor and regular participant in hackathons and innovation programmes.",
    ],
  },
  {
    hash: "5be20d4",
    title: "Full Stack Development Intern",
    org: "Codveda Technologies (remote)",
    period: "Aug – Sep 2025",
    kind: "work",
    bullets: [
      "Completed structured full stack training with React on the frontend and Node.js services behind it.",
      "Implemented REST API integration between frontend and backend components.",
      "Built demonstration projects showing reliable frontend and backend connectivity.",
      "Worked within a remote development team.",
    ],
  },
  {
    hash: "91f4a6b",
    title: "Information Management Attaché",
    org: "Debswana Diamond Company",
    period: "Jun – Jul 2025",
    kind: "work",
    bullets: [
      "Used Qualys for endpoint monitoring, vulnerability assessment and first-response threat handling.",
      "Wrote and ran scripts to deploy updates and remediate security issues across systems.",
      "Supported Azure and Active Directory user management, including onboarding and access control.",
      "Handled front-line IT troubleshooting at the customer service centre.",
    ],
  },
  {
    hash: "3d8c07e",
    title: "IT Assistant (internship)",
    org: "The Clicking Generation, Maun",
    period: "Jun 2023 – Aug 2024",
    kind: "work",
    bullets: [
      "Gave first-line support to staff, resolving hardware and software issues onsite and remotely.",
      "Installed, configured and maintained operating systems and productivity software.",
      "Helped with IT asset maintenance, system setup and new-user onboarding.",
      "Wrote the user manual for a new internal system, which improved adoption and cut repeat support requests.",
    ],
  },
  {
    hash: "0c2b5f8",
    title: "BSc Computer Science and Software Engineering",
    org: "Botswana International University of Science and Technology",
    period: "2022 – 2026",
    kind: "study",
    bullets: [
      "Final-year project: a real-time sentiment analysis platform for Botswana's socio-political discourse.",
      "Lead developer of a 3rd-place entry at the ISACA Gaborone Chapter Hackathon (Nov 2024).",
    ],
  },
];
