export type SkillGroup = { name: string; items: string[] };

// Mirrors the CV's skill table.
export const skillGroups: SkillGroup[] = [
  { name: "languages", items: ["JavaScript", "TypeScript", "Python", "Java", "Dart"] },
  { name: "frontend-mobile", items: ["React", "Flutter", "Expo / React Native", "Tailwind CSS"] },
  {
    name: "backend-apis",
    items: ["Node.js", "Express", "REST APIs", "PostgreSQL", "Firebase (Firestore, Functions, Hosting)", "Google Maps API"],
  },
  { name: "ai-data", items: ["RoBERTa / XLM-R", "Large language models", "Sentiment analysis pipelines"] },
  { name: "cloud-enterprise", items: ["Microsoft Azure", "Active Directory", "Qualys", "SAP"] },
  { name: "tools", items: ["Git", "GitHub Actions", "Linux (Arch / Hyprland)", "macOS", "Windows"] },
];
