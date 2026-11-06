import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
  warm: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface StarfieldProps {
  density?: number;
  paused?: boolean;
}

export default function Starfield({ density = 1, paused = false }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let inViewport = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const mouse = { x: 0.5, y: 0.5 };
    const smouse = { x: 0.5, y: 0.5 };
    let particles: Particle[] = [];
    let meteors: Meteor[] = [];
    let nextMeteor = 3000;
    let last = performance.now();

    const spawn = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: 0.25 + Math.random() * 0.75,
      r: 0.4 + Math.random() * 1.7,
      vx: (Math.random() - 0.5) * 0.06,
      vy: -0.03 - Math.random() * 0.09,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.2,
      warm: Math.random(),
    });

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(220, Math.floor(((w * h) / 9000) * density));
      particles = Array.from({ length: Math.max(0, count) }, () => spawn());
    };

    const onPointer = (e: PointerEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };

    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min(now - last, 50);
      last = now;
      smouse.x += (mouse.x - smouse.x) * 0.04;
      smouse.y += (mouse.y - smouse.y) * 0.04;
      const t = now / 1000;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        p.x += p.vx * dt * 0.06;
        p.y += p.vy * dt * 0.06;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const par = (smouse.x - 0.5) * 34 * p.z;
        const parY = (smouse.y - 0.5) * 22 * p.z;
        const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * p.speed + p.phase));
        const alpha = tw * (0.25 + 0.55 * p.z);
        const x = p.x + par;
        const y = p.y + parY;

        if (p.r > 1.4) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, p.r * 5);
          const color = p.warm > 0.5 ? "212,175,55" : "244,229,187";
          gradient.addColorStop(0, `rgba(${color},${alpha})`);
          gradient.addColorStop(1, `rgba(${color},0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, p.r * 5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${p.warm > 0.5 ? "212,175,55" : "242,235,216"},${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      nextMeteor -= dt;
      if (nextMeteor <= 0) {
        nextMeteor = 5000 + Math.random() * 6000;
        meteors.push({
          x: w * (0.2 + Math.random() * 0.6),
          y: -20,
          vx: (Math.random() - 0.5) * 0.16,
          vy: 0.28 + Math.random() * 0.2,
          life: 0,
          maxLife: 1400 + Math.random() * 800,
        });
      }
      meteors = meteors.filter((meteor) => meteor.life < meteor.maxLife);
      for (const meteor of meteors) {
        meteor.life += dt;
        meteor.x += meteor.vx * dt;
        meteor.y += meteor.vy * dt;
        const fade = 1 - meteor.life / meteor.maxLife;
        const tail = 90;
        const gradient = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          meteor.x - meteor.vx * tail,
          meteor.y - meteor.vy * tail,
        );
        gradient.addColorStop(0, `rgba(236,211,154,${0.7 * fade})`);
        gradient.addColorStop(1, "rgba(236,211,154,0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || !inViewport || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const syncRunning = () => (inViewport && !document.hidden ? start() : stop());

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        syncRunning();
      },
      { threshold: 0.01 },
    );

    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", syncRunning);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", syncRunning);
    };
  }, [density, paused]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
