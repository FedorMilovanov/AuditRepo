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
  centerHeld: { k: 25, c: 9.2 },
} as const;

export function useElasticConstellation(nodes: readonly ElasticNode[], enabled: boolean) {
  const stageRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLButtonElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const pathRefs = useRef(new Map<string, SVGPathElement>());
  const innerThreadRef = useRef<SVGPathElement>(null);
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

  // The SVG viewBox is 100x100, but the discs are sized in CSS pixels and
  // Framer may scale buttons during reveal. Geometry therefore comes from
  // actual DOM circles, not magic radii or untransformed mockup positions.
  const paint = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const area = stage.getBoundingClientRect();
    if (area.width < 1 || area.height < 1) return;

    const drift = collective.current;
    const rootX = 50 + drift.x * 0.55 + center.current.x;
    const rootY = 50 + drift.y * 0.55 + center.current.y;
    if (rootRef.current) {
      rootRef.current.style.left = rootX + "%";
      rootRef.current.style.top = rootY + "%";
    }
    for (const n of nodes) {
      const own = offsets.current.get(n.id) ?? zero();
      const x = clamp(n.x + drift.x + own.x, 9, 91);
      const y = clamp(n.y + drift.y + own.y, 9, 91);
      const button = nodeRefs.current.get(n.id);
      if (button) {
        button.style.left = x + "%";
        button.style.top = y + "%";
      }
    }

    type Circle = { x: number; y: number; r: number };
    const measure = (element: Element | null): Circle | null => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      return {
        x: (rect.left + rect.width / 2 - area.left) * 100 / area.width,
        y: (rect.top + rect.height / 2 - area.top) * 100 / area.height,
        r: Math.min(rect.width / area.width, rect.height / area.height) * 50,
      };
    };
    const origin = measure(rootRef.current);
    if (!origin) return;
    const disks = new Map<string, Circle>();
    for (const n of nodes) {
      const disc = nodeRefs.current.get(n.id)?.querySelector("[data-scene-disc]") ?? null;
      const circle = measure(disc);
      if (circle) disks.set(n.id, circle);
    }

    const unit = (dx: number, dy: number) => {
      const d = Math.hypot(dx, dy) || 1;
      return { x: dx / d, y: dy / d };
    };
    const pt = (x: number, y: number) => x.toFixed(3) + " " + y.toFixed(3);
    // Let the centerline overlap the painted border by a fraction of a
    // viewBox unit, avoiding antialiasing gaps without penetrating the discs.
    const contact = (circle: Circle, toward: { x: number; y: number }) => {
      const dir = unit(toward.x - circle.x, toward.y - circle.y);
      const radius = Math.max(0, circle.r - 0.13);
      return { x: circle.x + dir.x * radius, y: circle.y + dir.y * radius };
    };

    for (const n of nodes) {
      const disc = disks.get(n.id);
      if (!disc) continue;
      const dx = disc.x - origin.x, dy = disc.y - origin.y;
      let strand: string;
      if (n.ring === "inner") {
        const start = contact(origin, disc);
        const end = contact(disc, origin);
        strand = "M" + pt(start.x, start.y) + " L" + pt(end.x, end.y);
      } else {
        // A gentle editorial curve with *radial tangencies* at both discs.
        // Contact directions derive from its moving control point; the
        // curve never ends at a stale/nominal node position.
        const d = Math.hypot(dx, dy) || 1;
        const bend = Math.min(3.7, d * 0.085);
        const control = {
          x: origin.x + dx * 0.53 - dy / d * bend,
          y: origin.y + dy * 0.53 + dx / d * bend,
        };
        const start = contact(origin, control);
        const end = contact(disc, control);
        strand = "M" + pt(start.x, start.y) + " Q" + pt(control.x, control.y)
          + " " + pt(end.x, end.y);
      }
      pathRefs.current.get(n.id)?.setAttribute("d", strand);
    }

    // The luminous inner arc must *also* follow its moving circles. Its
    // original fixed SVG arc remained behind when dragged and clipped discs.
    const inner = nodes.filter(n => n.ring === "inner").map(n => disks.get(n.id)).filter(
      (c): c is Circle => !!c,
    );
    if (inner.length === 3 && innerThreadRef.current) {
      let thread = "";
      for (let i = 0; i < inner.length - 1; i++) {
        const a = inner[i], b = inner[i + 1];
        const ra = unit(a.x - origin.x, a.y - origin.y);
        const rb = unit(b.x - origin.x, b.y - origin.y);
        const ta = { x: -ra.y, y: ra.x };
        const tb = { x: -rb.y, y: rb.x };
        const p0 = { x: a.x + ta.x * (a.r - 0.13), y: a.y + ta.y * (a.r - 0.13) };
        const p3 = { x: b.x - tb.x * (b.r - 0.13), y: b.y - tb.y * (b.r - 0.13) };
        const handle = Math.min(24, Math.hypot(b.x - a.x, b.y - a.y) * 0.47);
        const p1 = { x: p0.x + ta.x * handle, y: p0.y + ta.y * handle };
        const p2 = { x: p3.x - tb.x * handle, y: p3.y - tb.y * handle };
        thread += "M" + pt(p0.x, p0.y) + " C" + pt(p1.x, p1.y)
          + " " + pt(p2.x, p2.y) + " " + pt(p3.x, p3.y) + " ";
      }
      innerThreadRef.current.setAttribute("d", thread.trim());
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
      rootHeld ? p.x : drag?.id && drag.moved ? p.x * 0.15 : 0,
      rootHeld ? p.y : drag?.id && drag.moved ? p.y * 0.15 : 0,
      rootHeld ? TUNE.centerHeld.k : TUNE.center.k,
      rootHeld ? TUNE.centerHeld.c : TUNE.center.c);
    for (const node of nodes) {
      const spring = offsets.current.get(node.id)!;
      if (drag?.id === node.id && drag.moved) {
        run(spring, p.x, p.y, TUNE.held.k, TUNE.held.c);
      } else if (rootHeld) {
        const f = node.ring === "inner" ? 0.76 : 0.52;
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
    const stage = stageRef.current;
    const resized = new ResizeObserver(paint);
    if (stage) resized.observe(stage);
    // Initial Framer reveal / hover transitions can alter the actual disc
    // radius after mount; reconcile geometry once those have settled.
    const onTransitionEnd = () => paint();
    stage?.addEventListener("transitionend", onTransitionEnd, { passive: true });
    const fonts = document.fonts;
    void fonts.ready.then(paint);
    return () => {
      cancelAnimationFrame(raf.current);
      resized.disconnect();
      stage?.removeEventListener("transitionend", onTransitionEnd);
    };
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
    const limit = isRoot ? 4.7 : g.id === null ? 5.0 : 9.0;
    const resistance = isRoot ? 0.72 : 1;
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
    stageRef, rootRef, innerThreadRef, attachNode, attachPath, dragging, suppressClick,
    onPointerDown, onPointerMove, onPointerUp, onPointerCancel,
  };
}
