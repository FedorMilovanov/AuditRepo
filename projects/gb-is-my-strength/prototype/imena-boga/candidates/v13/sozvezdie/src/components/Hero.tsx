import { motion, useMotionValue, useReducedMotionConfig, useSpring, useTransform } from "framer-motion";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ChevronDown } from "lucide-react";
import Starfield from "./Starfield";
import { NAMES } from "../data/names";
// Canonical JPEG remains immutable in reference; Vite emits it as a URL.
import sinaiJpeg from "../../../../../reference/sozvezdie/public/images/sinai-dawn.jpg?url";
import sinaiWebp from "../assets/sinai-dawn.webp?url";

const RING_A = ["י", "ה", "ו", "ה", "א", "ל", "ש", "ד", "י", "מ", "נ", "ו"];
const RING_B = ["א", "ה", "י", "ה", "צ", "ו", "ר", "ע", "ם", "נ", "ו", "א", "ל", "ש"];

function Ring({
  glyphs,
  radius,
  spin,
  size,
}: {
  glyphs: string[];
  radius: number;
  spin: string;
  size: string;
}) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ transform: "rotateX(66deg)" }}
    >
      <div className={`preserve-3d ${spin}`}>
        {glyphs.map((g, i) => {
          const angle = (360 / glyphs.length) * i;
          return (
            <span
              key={i}
              className={`absolute left-1/2 top-1/2 font-hebrew backface-hidden ${size} font-medium text-gold-400/50`}
              style={{
                transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                textShadow: "0 0 24px rgba(212,175,55,0.5)",
              }}
            >
              {g}
            </span>
          );
        })}
      </div>
    </div>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({ motionOn }: { motionOn: boolean }) {
  const prefersReducedMotion = useReducedMotionConfig();
  const shouldAnimate = motionOn && !prefersReducedMotion;
  // pointer-driven 3D tilt of the title block
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 60, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 60, damping: 18 });
  const glowX = useSpring(useTransform(px, [-0.5, 0.5], [-40, 40]), { stiffness: 50, damping: 20 });
  const glowY = useSpring(useTransform(py, [-0.5, 0.5], [-30, 30]), { stiffness: 50, damping: 20 });

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (!shouldAnimate || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-44 pt-24 sm:pb-36 sm:pt-20"
    >
      {/* atmosphere */}
      {/* A real image request gets native decoding and LCP priority, unlike a
          CSS background with a root-absolute URL that fails in nested previews. */}
      <picture className="pointer-events-none absolute inset-0 h-full w-full">
        <source type="image/webp" srcSet={sinaiWebp} />
        <img
          src={sinaiJpeg}
          alt=""
          aria-hidden="true"
          data-sinai-backdrop
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </picture>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,5,.64)_0%,rgba(9,8,6,.48)_42%,rgba(10,9,7,.72)_76%,#0a0907_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_48%,rgba(10,9,7,.52),transparent_100%)]" />
      <div className="absolute inset-0 opacity-70"><Starfield paused={!shouldAnimate} /></div>
      <motion.div
        style={shouldAnimate ? { x: glowX, y: glowY } : undefined}
        data-hero-glow
        className={`pointer-events-none absolute left-1/2 top-1/2 -ml-[280px] -mt-[280px] h-[560px] w-[560px] rounded-full bg-gold-500/[0.08] blur-[120px] ${shouldAnimate ? "animate-glow-pulse" : ""}`}
      />

      {/* A restrained armillary motif frames the title without replacing the landscape. */}
      <div
        className="absolute inset-0 hidden opacity-60 md:block"
        style={{ perspective: "1400px" }}
        aria-hidden
      >
        <Ring glyphs={RING_A} radius={330} spin={shouldAnimate ? "animate-rotate-slow" : ""} size="text-2xl" />
      </div>
      <div
        className="absolute inset-0 hidden opacity-40 lg:block"
        style={{ perspective: "1400px" }}
        aria-hidden
      >
        <Ring glyphs={RING_B} radius={470} spin={shouldAnimate ? "animate-rotate-rev" : ""} size="text-xl" />
      </div>

      {/* content */}
      <motion.div
        style={shouldAnimate ? { rotateX, rotateY, transformPerspective: 1200 } : undefined}
        data-hero-tilt
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <motion.p
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="font-ui text-xs font-medium uppercase tracking-[0.45em] text-cream-500"
        >
          Господь Бог — Сила Моя · Богословская библиотека
        </motion.p>

        <motion.div
          initial={shouldAnimate ? { opacity: 0, scale: 0.85, filter: "blur(12px)" } : false}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 0.45, ease }}
          className="mt-6 select-none md:mt-10"
        >
          <span lang="he" dir="rtl" data-hero-divine-name className="glow-gold block font-hebrew text-6xl font-medium text-gold-300 md:text-7xl">
            יהוה
          </span>
        </motion.div>

        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.06em" }}
          transition={{ duration: 0 }}
          className="gold-text mt-6 font-display text-[12.5vw] font-semibold leading-[0.95] sm:text-7xl md:text-8xl lg:text-[7.5rem]"
        >
          ИМЕНА БОГА
        </motion.h1>

        <motion.p
          initial={shouldAnimate ? { opacity: 0, y: 24 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease }}
          className="mt-7 max-w-xl font-body text-lg italic leading-relaxed text-cream-300 md:text-xl"
        >
          От «Я есмь Сущий» у горящего куста до «с нами Бог» — вся история
          откровения через имена Писания
        </motion.p>

        <motion.div
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 font-ui text-xs uppercase tracking-[0.25em] text-cream-300 md:mt-12 md:gap-6"
        >
          {[`${NAMES.length} именований и выражений`, "4 части", "Писание и контекст"].map((s, i) => (
            <span key={s} className="flex items-center gap-3 md:gap-6">
              {i > 0 && <span className="h-1 w-1 rotate-45 bg-gold-500/70" />}
              {s}
            </span>
          ))}
        </motion.div>
        <a
          href="/imena-boga/atlas/"
          className="relative z-20 mt-7 inline-flex max-w-[90vw] items-center justify-center gap-2 rounded-full border border-gold-500/35 bg-ink-900/85 px-4 py-2 text-center font-ui text-xs uppercase tracking-[0.14em] text-gold-300 shadow-lg backdrop-blur-md transition-colors hover:border-gold-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300 sm:text-xs"
          aria-label="Открыть атлас имён Бога — интерактивное исследование 36 библейских выражений"
        >
          <span aria-hidden="true">✦</span> Атлас имён Бога · 36 исследуемых выражений →
        </a>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        type="button"
        onClick={() => {
          window.history.pushState(null, "", "#intro");
          document.getElementById("intro")?.scrollIntoView({
            behavior: !motionOn || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
            block: "start",
          });
        }}
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="group absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        aria-label="Перейти к введению"
      >
        <span className="font-ui text-xs uppercase tracking-[0.4em] text-cream-500 transition-colors group-hover:text-gold-300">
          Читать
        </span>
        <span className="relative h-12 w-px overflow-hidden bg-cream-700/40">
          <span className={`absolute left-0 top-0 h-5 w-px bg-gold-400 ${shouldAnimate ? "animate-scroll-cue" : ""}`} />
        </span>
        <ChevronDown className="h-4 w-4 text-gold-400/80" strokeWidth={1.5} />
      </motion.button>

      {/* bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
    </section>
  );
}
