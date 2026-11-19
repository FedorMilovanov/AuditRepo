import { lazy, Suspense, useState } from "react";
import { BASE } from "../data";

// Capability-first 2D entry: neither App nor Three.js is imported here.
// The private lab cabinet is loaded only when the user actually opens it.
const CabinetPanel = lazy(() => import("../cabinet/CabinetPanel"));

export default function NoWebGL() {
  const [showCabinet, setShowCabinet] = useState(false);
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#181c1a] p-5 text-[#f5f1e7]">
      <section role="alert" aria-labelledby="gb-no-webgl-title"
        className="w-full max-w-xl rounded-2xl border border-[#d8b88d]/40 bg-[#252a25] px-6 py-8 text-center shadow-xl">
        <h1 id="gb-no-webgl-title" className="font-display text-3xl">
          Зал закрыт на ремонт
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed">
          Этот браузер не предоставил WebGL2. 3D-зал не загружается,
          но ваши локальные материалы доступны в обычном кабинете.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => setShowCabinet(true)}
            className="min-h-11 rounded-xl bg-[#d8b88d] px-5 py-3 font-semibold text-[#24231f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Моя библиотека · без 3D
          </button>
          <a href={BASE} className="inline-flex min-h-11 items-center rounded-xl border border-[#d8b88d] px-5 py-3 font-semibold text-[#f5f1e7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Читать на обычном сайте
          </a>
        </div>
      </section>
      {showCabinet && (
        <Suspense fallback={<p role="status" className="mt-4">Открываем кабинет…</p>}>
          <CabinetPanel onClose={() => setShowCabinet(false)} />
        </Suspense>
      )}
    </main>
  );
}
