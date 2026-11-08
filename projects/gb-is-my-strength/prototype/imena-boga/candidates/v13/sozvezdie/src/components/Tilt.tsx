import { useCallback, useEffect, useRef, useState, type ReactNode, type CSSProperties, type PointerEvent } from "react";

interface TiltProps {
  children: ReactNode;
  className?: string;
  max?: number;
  enabled?: boolean;
}

const neutralTransform: CSSProperties = {
  transform: "perspective(900px) rotateX(0deg) rotateY(0deg)",
};

export default function Tilt({ children, className = "", max = 9, enabled = true }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<CSSProperties>(neutralTransform);
  const [glare, setGlare] = useState({ x: 50, y: 50, o: 0 });

  const reset = useCallback(() => {
    setTransform(neutralTransform);
    setGlare((value) => (value.o ? { ...value, o: 0 } : value));
  }, []);

  // Respect the in-app toggle immediately, even when the pointer stays over
  // the verse card. A static card must not retain an obsolete tilt or glare.
  useEffect(() => {
    if (!enabled) reset();
  }, [enabled, reset]);

  // Also handle an OS motion-setting change *while* the card is hovered.
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (preference.matches) reset();
    };
    preference.addEventListener("change", onChange);
    return () => preference.removeEventListener("change", onChange);
  }, [reset]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTransform({
      transform: `perspective(900px) rotateX(${(py - 0.5) * -2 * max}deg) rotateY(${(px - 0.5) * 2 * max}deg)`,
    });
    setGlare({ x: px * 100, y: py * 100, o: 1 });
  };

  return (
    <div
      ref={ref}
      data-reader-tilt
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`relative will-change-transform motion-reduce:transition-none ${enabled ? "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out" : "transition-none"} ${className}`}
      style={enabled ? transform : neutralTransform}
    >
      {children}
      <div
        className={`pointer-events-none absolute inset-0 rounded-[inherit] motion-reduce:transition-none ${enabled ? "motion-safe:transition-opacity motion-safe:duration-300" : "transition-none"}`}
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(236,211,154,0.16), transparent 55%)`,
          opacity: enabled ? glare.o : 0,
        }}
      />
    </div>
  );
}
