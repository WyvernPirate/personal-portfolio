import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/** Preloads the two Latin font subsets used above the fold; their hashed names are only known at build time. */
function preloadFonts(): Plugin {
  const wanted = [/martian-mono-latin-wdth-normal/, /atkinson-hyperlegible-next-latin-wght-normal/];
  return {
    name: "preload-fonts",
    transformIndexHtml(_html, ctx) {
      if (!ctx.bundle) return [];
      return Object.keys(ctx.bundle)
        .filter((file) => wanted.some((re) => re.test(file)))
        .map((file) => ({
          tag: "link",
          attrs: { rel: "preload", as: "font", type: "font/woff2", href: `/${file}`, crossorigin: "" },
          injectTo: "head" as const,
        }));
    },
  };
}

export default defineConfig({
  server: { host: "::", port: 8080 },
  plugins: [react(), preloadFonts()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/three")) return "three";
          if (id.includes("node_modules/gsap")) return "gsap";
        },
      },
    },
  },
});
