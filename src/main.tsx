import { createRoot } from "react-dom/client";
import "@fontsource-variable/martian-mono/wdth.css";
import "@fontsource-variable/atkinson-hyperlegible-next/index.css";
import "./styles/base.css";
import "./styles/desktop.css";
import "./styles/sections.css";
import "./styles/gate.css";
import { initMotionFlag } from "./lib/motion";
import App from "./App";

initMotionFlag();

createRoot(document.getElementById("root")!).render(<App />);
