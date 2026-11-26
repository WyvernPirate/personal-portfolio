export const profile = {
  name: "Phemelo Moloi",
  handle: "phemelo@kgalagadi",
  role: "Software engineer",
  tagline:
    "Software engineer in Botswana. I build full-stack products, applied AI and the secure IT that keeps them running.",
  focus: "Full stack · applied AI · enterprise IT and security",
  base: "Palapye, Botswana",
  timezone: "Africa/Gaborone",
  status: "Open to work",
  now: {
    title: "Building Arrowgate",
    detail: "A freight exchange for SADC road transport: shippers, carriers and drivers on one platform.",
    href: "https://arrowgate-app.vercel.app",
  },
  email: "moloieric80@gmail.com",
  phone: "+267 74 421 107",
  phoneHref: "tel:+26774421107",
  github: "https://github.com/WyvernPirate",
  linkedin: "https://www.linkedin.com/in/phemelo-moloi-12aa41303",
  cv: "/Phemelo_Moloi_CV.pdf",
  site: "https://phemelo.work",
} as const;

export const workspaces = [
  { id: "home", label: "~", title: "Home" },
  { id: "log", label: "log", title: "Experience" },
  { id: "work", label: "work", title: "Projects" },
  { id: "stack", label: "stack", title: "Skills" },
  { id: "crew", label: "crew", title: "Leadership" },
  { id: "mail", label: "mail", title: "Contact" },
] as const;

export type WorkspaceId = (typeof workspaces)[number]["id"];
