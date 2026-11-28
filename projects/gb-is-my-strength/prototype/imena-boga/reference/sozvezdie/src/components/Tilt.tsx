import { useRef, useState, type ReactNode, type CSSProperties, type PointerEvent } from "react";

interface TiltProps {
  children: ReactNode;
  className?: string;
  max?: number;
}

export default function Tilt({ children, className = "", max = 9 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<CSSProperties>({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg)",
  });
  const [glare, setGlare] = useState({ x: 50, y: 50, o: 0 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -2 * max;
    const ry = (px - 0.5) * 2 * max;
    setTransform({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`,
    });
    setGlare({ x: px * 100, y: py * 100, o: 1 });
  };

  const onLeave = () => {
    setTransform({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" });
    setGlare((g) => ({ ...g, o: 0 }));
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={transform}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(236,211,154,0.16), transparent 55%)`,
          opacity: glare.o,
        }}
      />
    </div>
  );
}
