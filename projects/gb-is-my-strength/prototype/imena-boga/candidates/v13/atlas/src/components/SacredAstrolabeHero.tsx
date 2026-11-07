import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Sparkles, Compass, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface SacredAstrolabeHeroProps {
  theme: 'light' | 'sepia' | 'dark';
  onStartReading: () => void;
  onOpenAtlas: () => void;
  onSelectGlyphName: (nameId: string) => void;
}

const SACRED_GLYPHS = [
  { id: 'yhwh', script: 'יהוה', label: 'Яхве — имя Завета', lang: 'he' },
  { id: 'elohim', script: 'אֱלֹהִים', label: 'Элохим — Творец', lang: 'he' },
  { id: 'el-shaddai', script: 'אֵל שַׁדַּי', label: 'Эль-Шаддай — Всемогущий', lang: 'he' },
  { id: 'immanuel', script: 'עִמָּנוּאֵל', label: 'Иммануэль — С нами Бог', lang: 'he' },
  { id: 'abba-ho-pater', script: 'Ἀββᾶ ὁ Πατήρ', label: 'Авва, Отче — обращение к Отцу', lang: 'el' },
];

export const SacredAstrolabeHero: React.FC<SacredAstrolabeHeroProps> = ({
  theme,
  onStartReading,
  onOpenAtlas,
  onSelectGlyphName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [glyphIndex, setGlyphIndex] = useState(0);
  const [medallionHovered, setMedallionHovered] = useState(false);
  const [medallionTilt, setMedallionTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    // Keep autoplay policy synchronized with both document visibility and live OS
    // motion preferences. Re-checking only when hover changed could leave the
    // medallion rotating after a user enables reduced motion in system settings.
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let interval: number | undefined;
    const syncAutoplay = () => {
      if (interval !== undefined) {
        window.clearInterval(interval);
        interval = undefined;
      }
      if (medallionHovered || document.hidden || motionPreference.matches) return;
      interval = window.setInterval(() => {
        if (!document.hidden && !motionPreference.matches) {
          setGlyphIndex((prev) => (prev + 1) % SACRED_GLYPHS.length);
        }
      }, 4200);
    };
    motionPreference.addEventListener('change', syncAutoplay);
    document.addEventListener('visibilitychange', syncAutoplay);
    syncAutoplay();
    return () => {
      motionPreference.removeEventListener('change', syncAutoplay);
      document.removeEventListener('visibilitychange', syncAutoplay);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [medallionHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    // Cap mobile raster work without compromising desktop Retina rendering.
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.5 : 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Initial backing-store sizing is needed before the first paint.
    // ResizeObserver is registered after render() exists so a backing-store
    // reset never leaves a reduced-motion visitor with an empty scene.
    resize();

    // Golden dust particles in 3D space
    const particles = Array.from({ length: 68 }, (_, i) => {
      const angle = (i / 68) * Math.PI * 2;
      const radius = 110 + (i % 7) * 34;
      return {
        x: Math.cos(angle) * radius,
        y: ((i * 37) % 280) - 140,
        z: Math.sin(angle) * radius,
        size: 1.1 + (i % 3) * 0.75,
        speed: 0.002 + (i % 5) * 0.0007,
        phase: i * 0.5,
      };
    });

    const project3D = (x: number, y: number, z: number, cx: number, cy: number, fov = 560) => {
      const scale = fov / (fov + z);
      return {
        px: cx + x * scale,
        py: cy + y * scale,
        scale,
      };
    };

    const rotatePoint = (
      x: number,
      y: number,
      z: number,
      ax: number,
      ay: number,
      az: number
    ) => {
      // Rotate X
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;

      // Rotate Y
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;

      // Rotate Z
      const cosZ = Math.cos(az);
      const sinZ = Math.sin(az);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;

      return { x: x3, y: y3, z: z2 };
    };

    let t = 0.65;
    let lastTimestamp = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;
    let render: (timestamp?: number) => void;

    const restartAnimation = () => {
      window.cancelAnimationFrame(animationFrameId);
      if (isVisible && isPageVisible && !prefersReducedMotion) {
        animationFrameId = window.requestAnimationFrame(render);
      }
    };

    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      restartAnimation();
    };

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              isVisible = entries[0]?.isIntersecting ?? true;
              restartAnimation();
            },
            { threshold: 0.02 }
          )
        : null;
    if (observer) observer.observe(canvas);
    document.addEventListener('visibilitychange', handleVisibility);

    render = (timestamp = 0) => {
      if (!isVisible || !isPageVisible) return;
      // Time-based motion: 60 Hz and 120 Hz displays must animate at the same speed.
      // Capping the catch-up prevents dramatic jumps after background-tab pauses.
      const elapsed = lastTimestamp ? Math.min(50, Math.max(0, timestamp - lastTimestamp)) : 16.667;
      lastTimestamp = timestamp;
      const step = elapsed / 16.667;
      t += 0.006 * step;
      const p = pointerRef.current;
      const ease = 1 - Math.pow(0.94, step);
      p.x += (p.targetX - p.x) * ease;
      p.y += (p.targetY - p.y) * ease;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.43;
      const baseRadius = Math.min(width * 0.36, 250);

      const isDark = theme === 'dark';
      const goldRGB = isDark ? '212, 165, 116' : '168, 124, 72';
      const crimsonRGB = isDark ? '217, 122, 108' : '124, 45, 45';

      // Soft radial celestial halo
      const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, baseRadius * 1.45);
      halo.addColorStop(0, `rgba(${goldRGB}, ${isDark ? 0.16 : 0.14})`);
      halo.addColorStop(0.5, `rgba(${crimsonRGB}, ${isDark ? 0.07 : 0.05})`);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);

      // Draw 3D interlocking sacred astrolabe rings
      const rings = [
        { r: baseRadius * 1.04, ax: 1.15 + p.y * 0.35, ay: t * 0.45 + p.x * 0.4, az: t * 0.2, color: goldRGB, alpha: isDark ? 0.38 : 0.3, width: 1.25, ticks: 24 },
        { r: baseRadius * 0.86, ax: -0.85 + p.y * 0.25, ay: -t * 0.55 + p.x * 0.35, az: -t * 0.15, color: crimsonRGB, alpha: isDark ? 0.36 : 0.26, width: 1.1, ticks: 12 },
        { r: baseRadius * 0.68, ax: 0.45 + p.y * 0.45, ay: t * 0.7 + p.x * 0.5, az: t * 0.3, color: goldRGB, alpha: isDark ? 0.48 : 0.36, width: 1.35, ticks: 7 },
      ];

      rings.forEach((ring) => {
        const segments = 96;
        ctx.beginPath();
        for (let s = 0; s <= segments; s++) {
          const theta = (s / segments) * Math.PI * 2;
          const lx = Math.cos(theta) * ring.r;
          const ly = Math.sin(theta) * ring.r;
          const rotated = rotatePoint(lx, ly, 0, ring.ax, ring.ay, ring.az);
          const proj = project3D(rotated.x, rotated.y, rotated.z, cx, cy);
          if (s === 0) ctx.moveTo(proj.px, proj.py);
          else ctx.lineTo(proj.px, proj.py);
        }
        ctx.strokeStyle = `rgba(${ring.color}, ${ring.alpha})`;
        ctx.lineWidth = ring.width;
        ctx.stroke();

        // Sacred degree nodes around the ring
        for (let k = 0; k < ring.ticks; k++) {
          const theta = (k / ring.ticks) * Math.PI * 2;
          const lx = Math.cos(theta) * ring.r;
          const ly = Math.sin(theta) * ring.r;
          const rotated = rotatePoint(lx, ly, 0, ring.ax, ring.ay, ring.az);
          const proj = project3D(rotated.x, rotated.y, rotated.z, cx, cy);
          const depthAlpha = Math.max(0.12, Math.min(0.85, (260 - rotated.z) / 420));
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, k % 2 === 0 ? 2.1 * proj.scale : 1.3 * proj.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ring.color}, ${depthAlpha * ring.alpha * 1.9})`;
          ctx.fill();
        }
      });

      // 3D Sacred Octahedron Wireframe Core
      const octR = baseRadius * 0.44;
      const octVerts = [
        { x: 0, y: -octR, z: 0 },
        { x: octR, y: 0, z: 0 },
        { x: 0, y: 0, z: octR },
        { x: -octR, y: 0, z: 0 },
        { x: 0, y: 0, z: -octR },
        { x: 0, y: octR, z: 0 },
      ].map((v) => {
        const rot = rotatePoint(v.x, v.y, v.z, t * 0.35 + p.y * 0.4, t * 0.5 + p.x * 0.4, 0.25);
        return project3D(rot.x, rot.y, rot.z, cx, cy);
      });

      const octEdges = [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [5, 1], [5, 2], [5, 3], [5, 4],
        [1, 2], [2, 3], [3, 4], [4, 1],
      ];
      ctx.beginPath();
      octEdges.forEach(([a, b]) => {
        ctx.moveTo(octVerts[a].px, octVerts[a].py);
        ctx.lineTo(octVerts[b].px, octVerts[b].py);
      });
      ctx.strokeStyle = `rgba(${goldRGB}, ${isDark ? 0.22 : 0.16})`;
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Drifting 3D light motes
      particles.forEach((pt, idx) => {
        const angle = t * (0.4 + (idx % 4) * 0.12) + pt.phase;
        const rx = pt.x * Math.cos(angle) - pt.z * Math.sin(angle);
        const rz = pt.x * Math.sin(angle) + pt.z * Math.cos(angle);
        const ry = pt.y + Math.sin(t * 1.4 + pt.phase) * 14;
        const rotated = rotatePoint(rx, ry, rz, p.y * 0.25, p.x * 0.25, 0);
        const proj = project3D(rotated.x, rotated.y, rotated.z, cx, cy);
        const alpha = Math.max(0.1, Math.min(0.75, (280 - rotated.z) / 480));
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, pt.size * proj.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${idx % 3 === 0 ? crimsonRGB : goldRGB}, ${alpha * 0.65})`;
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animationFrameId = window.requestAnimationFrame(render);
      }
    };

    const handleMotionChange = () => {
      prefersReducedMotion = motionQuery.matches;
      window.cancelAnimationFrame(animationFrameId);
      lastTimestamp = 0;
      if (prefersReducedMotion) render();
      else restartAnimation();
    };
    motionQuery.addEventListener('change', handleMotionChange);
    // Canvas.width/height assignments clear every pixel in all browser engines.
    // Repaint immediately after a ResizeObserver or window resize when motion
    // is reduced; keep the normal RAF owner unchanged during animation.
    const handleCanvasResize = () => {
      resize();
      if (prefersReducedMotion) render();
    };
    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(handleCanvasResize)
      : null;
    window.addEventListener('resize', handleCanvasResize);
    resizeObserver?.observe(canvas);
    if (prefersReducedMotion) render();
    else animationFrameId = window.requestAnimationFrame(render);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleCanvasResize);
      resizeObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      if (observer) observer.disconnect();
    };
  }, [theme]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    pointerRef.current.targetX = nx;
    pointerRef.current.targetY = ny;
    if (medallionHovered && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMedallionTilt({ rx: -ny * 11, ry: nx * 13 });
    }
  };

  const handleMouseLeave = () => {
    pointerRef.current.targetX = 0;
    pointerRef.current.targetY = 0;
    setMedallionTilt({ rx: 0, ry: 0 });
  };

  const activeGlyph = SACRED_GLYPHS[glyphIndex];

  return (
    <header
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden border-b pt-24 pb-16 md:pt-28 md:pb-24"
      style={{
        borderColor: 'var(--gb-border)',
        background:
          theme === 'dark'
            ? 'radial-gradient(ellipse at 50% 25%, #1d1915 0%, #0e1116 72%)'
            : theme === 'sepia'
              ? 'radial-gradient(ellipse at 50% 25%, #f9f1e2 0%, #efe5d4 75%)'
              : 'radial-gradient(ellipse at 50% 25%, #ffffff 0%, #f8f5f0 75%)',
      }}
    >
      {/* Interactive 3D Sacred Astrolabe Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8 text-center">
        {/* Eyebrow */}
        <div
          className="font-ui mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wider uppercase"
          style={{
            borderColor: 'var(--gb-border-strong)',
            backgroundColor: 'var(--gb-glass)',
            color: 'var(--gb-accent)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
          <span>Экзегеза и богословие · Большое исследование</span>
        </div>

        {/* Interactive 3D Tilting Sacred Medallion with Manual Glyph Switcher */}
        <div className="mb-8 flex w-full items-center justify-center gap-1.5 sm:gap-3" style={{ perspective: '900px' }}>
          <button
            type="button"
            onClick={() =>
              setGlyphIndex((prev) => (prev - 1 + SACRED_GLYPHS.length) % SACRED_GLYPHS.length)
            }
            aria-label="Предыдущее священное имя"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gb-accent)]"
            style={{
              backgroundColor: 'var(--gb-glass)',
              borderColor: 'var(--gb-border-strong)',
              color: 'var(--gb-gold)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            onMouseEnter={() => setMedallionHovered(true)}
            onMouseLeave={(event) => {
              // Hover exit must not restart automatic glyph cycling while dots retain focus.
              if (!event.currentTarget.contains(document.activeElement)) setMedallionHovered(false);
              setMedallionTilt({ rx: 0, ry: 0 });
            }}
            onFocus={() => setMedallionHovered(true)}
            onBlur={(event) => {
              // React focus/blur bubbles from child buttons: only the last focus exit resumes cycling.
              if (!event.currentTarget.contains(event.relatedTarget)) setMedallionHovered(false);
            }}
            className="flex min-w-0 max-w-[270px] flex-1 flex-col items-center"
          >
            <button
              type="button"
              onClick={() => onSelectGlyphName(activeGlyph.id)}
              title="Нажмите, чтобы открыть глубокий разбор этого Имени"
              className="group relative w-full min-w-0 cursor-pointer rounded-2xl border px-4 py-5 transition-shadow duration-500 sm:px-8"
              style={{
                transform: `rotateX(${medallionTilt.rx}deg) rotateY(${medallionTilt.ry}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 160ms ease-out, box-shadow 400ms ease',
                backgroundColor: 'var(--gb-glass)',
                borderColor: 'var(--gb-gold)',
                boxShadow: '0 16px 44px var(--gb-gold-glow), inset 0 0 24px rgba(184, 147, 106, 0.14)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Inner double sacred border */}
              <div
                className="pointer-events-none absolute inset-1.5 rounded-xl border opacity-45"
                style={{ borderColor: 'var(--gb-gold)' }}
              />
              <div className="relative z-10 flex flex-col items-center">
                <span
                  lang={activeGlyph.lang}
                  dir={activeGlyph.lang === 'he' ? 'rtl' : 'ltr'}
                  className={`${activeGlyph.lang === 'el' ? 'font-greek' : 'font-hebrew'} text-4xl sm:text-5xl font-bold tracking-wide transition-all duration-700`}
                  style={{
                    color: 'var(--gb-ink)',
                    textShadow: '0 0 24px var(--gb-gold-glow)',
                  }}
                >
                  {activeGlyph.script}
                </span>
                <span
                  className="font-ui mt-2 text-[11px] font-medium tracking-widest uppercase transition-colors"
                  style={{ color: 'var(--gb-gold)' }}
                >
                  {activeGlyph.label}
                </span>
              </div>
            </button>

            {/* 5 Sacred Glyph Dots */}
            <div className="mt-2.5 flex items-center gap-1.5" role="group" aria-label="Выбор имени на медальоне">
              {SACRED_GLYPHS.map((g, idx) => {
                const active = idx === glyphIndex;
                return (
                  <button
                    key={g.id}
                    type="button"
                    aria-pressed={active}
                    aria-label={g.label}
                    onClick={() => setGlyphIndex(idx)}
                    className="group flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gb-accent)]"
                  >
                    <span
                      aria-hidden="true"
                      className="block h-1.5 rounded-full transition-all duration-300 group-hover:opacity-75"
                      style={{
                        width: active ? '18px' : '6px',
                        backgroundColor: active ? 'var(--gb-gold)' : 'var(--gb-border-strong)',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setGlyphIndex((prev) => (prev + 1) % SACRED_GLYPHS.length)}
            aria-label="Следующее священное имя"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gb-accent)]"
            style={{
              backgroundColor: 'var(--gb-glass)',
              borderColor: 'var(--gb-border-strong)',
              color: 'var(--gb-gold)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Main Editorial Title */}
        <h1
          className="font-serif-display mx-auto max-w-3xl text-3xl sm:text-5xl md:text-[3.35rem] font-bold leading-[1.14] tracking-tight"
          style={{ color: 'var(--gb-ink)' }}
        >
          Имена Бога в Писании:{' '}
          <span className="italic font-semibold" style={{ color: 'var(--gb-accent)' }}>
            как Творец открывает Своё сердце
          </span>{' '}
          в завете, истории и Христе
        </h1>

        {/* Lead Subtitle */}
        <p
          className="font-body-editorial mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed"
          style={{ color: 'var(--gb-ink-secondary)' }}
        >
          В Библии имя Бога — не условный ярлык и не магическая формула, а самооткровение Его
          характера, святости и верности. По мере чтения ниже по бокам страницы будут последовательно
          являться и озаряться 36 рассмотренных имён, титулов и обращений к Богу — нажмите на любое, чтобы
          открыть лексический и богословский разбор.
        </p>

        {/* Editorial Meta Strip */}
        <div
          className="font-ui mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs"
          style={{ color: 'var(--gb-muted)' }}
        >
          <span>
            Автор-редактор: <strong style={{ color: 'var(--gb-ink)' }}>Фёдор Милованов</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>36 имён (иврит, арамейский, греческий)</span>
          <span aria-hidden="true">·</span>
          <span>Пять тематических частей</span>
          <span aria-hidden="true">·</span>
          <span>Библейский текст · лексика · контекст</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onStartReading}
            className="font-ui inline-flex cursor-pointer items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:opacity-95 active:scale-[0.99]"
            style={{
              backgroundColor: 'var(--gb-accent)',
              boxShadow: '0 8px 24px var(--gb-crimson-glow)',
            }}
          >
            <BookOpen className="h-4 w-4" />
            <span>Начать последовательное чтение</span>
            <ArrowDown className="h-4 w-4 opacity-80" />
          </button>

          <button
            type="button"
            onClick={onOpenAtlas}
            className="font-ui inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition-all hover:border-amber-600/50"
            style={{
              backgroundColor: 'var(--gb-glass)',
              borderColor: 'var(--gb-border-strong)',
              color: 'var(--gb-ink)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Compass className="h-4 w-4" style={{ color: 'var(--gb-gold)' }} />
            <span>Созвездие 36 рассмотренных имён</span>
          </button>
        </div>

        <nav aria-label="Два формата исследования имён Бога" className="mt-6 flex items-center justify-center">
          <a href="/imena-boga/" className="font-ui inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors hover:opacity-80" style={{borderColor:'var(--gb-border-strong)',color:'var(--gb-accent)',backgroundColor:'var(--gb-surface)'}}>
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Другой флагман: созвездие и последовательное чтение (29 имён) →
          </a>
        </nav>

        {/* Scripture Motto Anchor */}
        <blockquote
          className="font-quote-editorial mx-auto mt-10 max-w-xl border-t pt-5 text-lg sm:text-xl italic"
          style={{
            borderColor: 'var(--gb-border)',
            color: 'var(--gb-muted)',
          }}
        >
          «И будут уповать на Тебя знающие имя Твоё, потому что Ты не оставляешь ищущих Тебя, Господи».
          <footer className="font-ui mt-1 text-xs not-italic tracking-wide" style={{ color: 'var(--gb-accent)' }}>
            — Псалом 9:11 (Синодальный перевод)
          </footer>
        </blockquote>
      </div>
    </header>
  );
};
