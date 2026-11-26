import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Martian Mono Variable", "ui-monospace", "monospace"],
        body: ["Atkinson Hyperlegible Next Variable", "system-ui", "sans-serif"],
      },
      colors: {
        dusk: "#1B1A2E",
        surface: "#24223A",
        ink: "#ECEAF4",
        haze: "#9C99B4",
        sky: "#75AADB",
        sand: "#E3A869",
      },
    },
  },
  plugins: [],
} satisfies Config;
