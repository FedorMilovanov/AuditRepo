// Self-hosted static WOFF2 subsets; npm versions pinned.
import "@fontsource/cormorant-garamond/cyrillic-400.css";
import "@fontsource-variable/lora/wght.css";
import "@fontsource-variable/lora/wght-italic.css";
import "@fontsource/cormorant-garamond/cyrillic-600.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/cyrillic-400-italic.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/inter/cyrillic-400.css";
import "@fontsource/inter/cyrillic-500.css";
import "@fontsource/inter/cyrillic-600.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/playfair-display/cyrillic-600.css";
import "@fontsource/playfair-display/cyrillic-700.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-700.css";
import "@fontsource/playfair-display/cyrillic-400-italic.css";
import "@fontsource/playfair-display/latin-400-italic.css";
import "@fontsource/noto-serif-hebrew/hebrew-400.css";
import "@fontsource/noto-serif-hebrew/hebrew-700.css";
import "@fontsource/noto-serif/greek-400.css";
import "@fontsource/noto-serif/greek-700.css";
import "@fontsource/noto-serif/greek-ext-400.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
