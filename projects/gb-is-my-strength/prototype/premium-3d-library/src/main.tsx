import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./fonts";

const root = createRoot(document.getElementById("root")!);

/**
 * The 2D personal cabinet is a separate production entry path.
 * Dynamic imports keep Three.js / WebGL / XR out of the critical route
 * rather than merely hiding the canvas under a modal. Normal builds ship
 * individually cached chunks; archival single-file builds may inline them.
 */
async function bootstrap() {
  const isCabinet = new URLSearchParams(window.location.search).get("panel") === "cabinet";
  if (isCabinet) {
    const { default: CabinetPanel } = await import("./cabinet/CabinetPanel");
    const closeCabinet = () => {
      const target = new URL(window.location.href);
      target.searchParams.delete("panel");
      window.location.assign(target.pathname + target.search + target.hash);
    };
    root.render(
      <StrictMode>
        <CabinetPanel onClose={closeCabinet} />
      </StrictMode>,
    );
    return;
  }
  const { default: App } = await import("./App");
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap().catch((error: unknown) => {
  console.error("[Library 3D] Failed to load application", error);
  root.render(
    <div role="alert" className="fixed inset-0 flex flex-col items-center justify-center bg-[#181c1a] p-8 text-center text-[#f5f1e7]">
      <p className="font-display text-2xl">Библиотека временно недоступна</p>
      <p className="mt-3 max-w-md text-sm">Не удалось загрузить интерфейс. Проверьте подключение и обновите страницу.</p>
      <button type="button" className="mt-6 min-h-11 rounded-full bg-[#d8b88d] px-5 py-2 text-[#24231f]"
        onClick={() => window.location.reload()}>Обновить страницу</button>
    </div>,
  );
});
