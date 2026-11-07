import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

/** Editorial physics for the single published-in-candidate constellation.
 * Inspired by the original Arena elastic galaxy, without an orbit editor,
 * user presets, exported diagrams, persistent physics, or idle animation.
 */
export interface ElasticNode {
  id: string;
  x: number;
  y: number;
  angle: number;
  ring: "inner" | "outer";
}
interface Spring { x: number; y: number; vx: number; vy: number }
interface Gesture {
  pointerId: number;
  id: string | null;
  x: number;
  y: number;
  originX: number;
  originY: number;
  moved: boolean;
}
const zero = (): Spring => ({ x: 0, y: 0, vx: 0, vy: 0 });
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const TUNE = {
  held: { k: 32, c: 7.7 },
  free: { k: 19, c: 5.7 },
  collective: { k: 15, c: 6.5 },
  center: { k: 11, c: 6.2 },
  centerHeld: { k: 15, c: 8.5 },
} as const;

export function useElasticConstellation(nodes: readonly ElasticNode[], enabled: boolean) {
  const stageRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLButtonElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const pathRefs = useRef(new Map<string, SVGPathElement>());
  const offsets = useRef(new Map<string, Spring>(nodes.map(n => [n.id, zero()])));
  const collective = useRef<Spring>(zero());
  const center = useRef<Spring>(zero());
  const gesture = useRef<Gesture | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const lastTime = useRef(0);
  const suppressClick = useRef(false);
  const enabledRef = useRef(enabled);
  const [dragging, setDragging] = useState(false);

  enabledRef.current = enabled;

  const paint = useCallback(() => {
    const drift = collective.current;
    const cx = 50 + drift.x * 0.55 + center.current.x;
    const cy = 50 + drift.y * 0.55 + center.current.y;
    if (rootRef.current) {
      rootRef.current.style.left = cx + "%";
      rootRef.current.style.top = cy + "%";
    }
    for (const n of nodes) {
      const own = offsets.current.get(n.id) ?? zero();
      // The 112px captions cannot leave the 660px stage even when pulled.
      const x = clamp(n.x + drift.x + own.x, 9, 91);
      const y = clamp(n.y + drift.y + own.y, 9, 91);
      const button = nodeRefs.current.get(n.id);
      if (button) {
        button.style.left = x + "%";
        button.style.top = y + "%";
      }
      const dx = x - cx, dy = y - cy;
      const d = Math.hypot(dx, dy) || 1;
      const ux = dx / d, uy = dy / d;
      const startX = cx + ux * 10.4, startY = cy + uy * 10.4;
      const edge = n.ring === "inner" ? 3.9 : 3.5;
      const endX = x - ux * edge, endY = y - uy * edge;
      const start = "M" + startX.toFixed(2) + " " + startY.toFixed(2);
      let strand = start + " L" + endX.toFixed(2) + " " + endY.toFixed(2);
      if (n.ring === "outer") {
        const rad = (n.angle - 14) * Math.PI / 180;
        const controlX = cx + 20.3 * Math.cos(rad);
        const controlY = cy + 20.3 * Math.sin(rad);
        strand = start + " Q" + controlX.toFixed(2) + " " + controlY.toFixed(2)
          + " " + endX.toFixed(2) + " " + endY.toFixed(2);
      }
      pathRefs.current.get(n.id)?.setAttribute("d", strand);
    }
  }, [nodes]);

  const step = (s: Spring, tx: number, ty: number, k: number, c: number, dt: number) => {
    s.vx += ((tx - s.x) * k - s.vx * c) * dt;
    s.vy += ((ty - s.y) * k - s.vy * c) * dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    const done = Math.abs(tx - s.x) < 0.008 && Math.abs(ty - s.y) < 0.008
      && Math.abs(s.vx) < 0.028 && Math.abs(s.vy) < 0.028;
    if (done) Object.assign(s, { x: tx, y: ty, vx: 0, vy: 0 });
    return !done;
  };

  const frame = useCallback((time: number) => {
    // Frame-rate independent dynamics, bounded after a suspended tab resumes.
    const dt = clamp((time - lastTime.current) / 1000 || 1 / 60, 1 / 240, 1 / 30);
    lastTime.current = time;
    const drag = gesture.current;
    const p = target.current;
    let moving = false;
    const run = (s: Spring, tx: number, ty: number, k: number, c: number) => {
      // Never use short-circuiting ||= here: every spring must integrate.
      if (step(s, tx, ty, k, c, dt)) moving = true;
    };
    const bg = drag?.id === null && drag.moved;
    run(collective.current, bg ? p.x : 0, bg ? p.y : 0, TUNE.collective.k, TUNE.collective.c);
    const rootHeld = drag?.id === "yhwh" && drag.moved;
    run(center.current,
      rootHeld ? p.x : drag?.id && drag.moved ? p.x * 0.08 : 0,
      rootHeld ? p.y : drag?.id && drag.moved ? p.y * 0.08 : 0,
      rootHeld ? TUNE.centerHeld.k : TUNE.center.k,
      rootHeld ? TUNE.centerHeld.c : TUNE.center.c);
    for (const node of nodes) {
      const spring = offsets.current.get(node.id)!;
      if (drag?.id === node.id && drag.moved) {
        run(spring, p.x, p.y, TUNE.held.k, TUNE.held.c);
      } else if (rootHeld) {
        const f = node.ring === "inner" ? 0.50 : 0.32;
        run(spring, p.x * f, p.y * f, TUNE.free.k, TUNE.free.c);
      } else if (drag?.id && drag.moved) {
        const held = nodes.find(n => n.id === drag.id);
        const d = held ? Math.abs(Math.atan2(
          Math.sin((node.angle - held.angle) * Math.PI / 180),
          Math.cos((node.angle - held.angle) * Math.PI / 180))) : Math.PI;
        const affinity = Math.max(0, 1 - d / 1.55) * (node.ring === held?.ring ? 0.24 : 0.12);
        run(spring, p.x * affinity, p.y * affinity, TUNE.free.k, TUNE.free.c);
      } else {
        run(spring, 0, 0, TUNE.free.k, TUNE.free.c);
      }
    }
    paint();
    raf.current = moving ? requestAnimationFrame(frame) : 0;
  }, [nodes, paint]);

  const start = useCallback(() => {
    if (raf.current) return;
    lastTime.current = performance.now();
    raf.current = requestAnimationFrame(frame);
  }, [frame]);

  const restore = useCallback((force = false) => {
    gesture.current = null;
    target.current = { x: 0, y: 0 };
    setDragging(false);
    if (force || !enabledRef.current) {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      collective.current = zero();
      center.current = zero();
      for (const n of nodes) offsets.current.set(n.id, zero());
      paint();
    } else start();
  }, [nodes, paint, start]);

  useEffect(() => {
    paint();
    return () => cancelAnimationFrame(raf.current);
  }, [paint]);
  useEffect(() => {
    if (!enabled) restore(true);
  }, [enabled, restore]);

  const attachNode = (id: string, element: HTMLButtonElement | null) => {
    if (element) nodeRefs.current.set(id, element);
    else nodeRefs.current.delete(id);
  };
  const attachPath = (id: string, element: SVGPathElement | null) => {
    if (element) pathRefs.current.set(id, element);
    else pathRefs.current.delete(id);
  };

  const toUnits = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current!.getBoundingClientRect();
    return { x: event.clientX * 100 / rect.width, y: event.clientY * 100 / rect.height };
  };
  const stateOf = (id: string | null): Spring =>
    id === null ? collective.current : id === "yhwh" ? center.current : offsets.current.get(id)!;

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabledRef.current || (event.pointerType === "mouse" && event.button !== 0)) return;
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-elastic-node]");
    const id = button?.dataset.elasticNode ?? null;
    // Finger scrolling on empty canvas is always native; named nodes can drag.
    if (event.pointerType !== "mouse" && id === null) return;
    const pos = toUnits(event);
    const spring = stateOf(id);
    gesture.current = { pointerId: event.pointerId, id, x: pos.x, y: pos.y,
      originX: spring.x, originY: spring.y, moved: false };
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.pointerId !== event.pointerId) return;
    const pos = toUnits(event);
    const dx = pos.x - g.x, dy = pos.y - g.y;
    if (!g.moved && Math.hypot(dx, dy) > 0.85) {
      g.moved = true;
      stageRef.current?.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    if (!g.moved) return;
    event.preventDefault();
    const isRoot = g.id === "yhwh";
    const limit = isRoot ? 4.2 : g.id === null ? 5.0 : 9.0;
    const resistance = isRoot ? 0.38 : 1;
    target.current = { x: clamp(g.originX + dx * resistance, -limit, limit),
      y: clamp(g.originY + dy * resistance, -limit, limit) };
    start();
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.pointerId !== event.pointerId) return;
    if (g.moved) {
      suppressClick.current = true;
      window.setTimeout(() => { suppressClick.current = false; }, 130);
      if (stageRef.current?.hasPointerCapture(event.pointerId)) {
        stageRef.current.releasePointerCapture(event.pointerId);
      }
    }
    restore();
  };
  const onPointerCancel = () => restore();

  return {
    stageRef, rootRef, attachNode, attachPath, dragging, suppressClick,
    onPointerDown, onPointerMove, onPointerUp, onPointerCancel,
  };
}
