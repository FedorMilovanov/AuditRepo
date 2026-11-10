import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BASE, ITEMS, byId, itemPos, type Item } from "../data";
import { useApp, registry, openItem, closeItem, get, set, xrStore } from "../store";
import { useReducedMotion } from "../motion";
import { createCardTexture, detailTexture, buttonTexture, glowTexture } from "../textures";
import { goldMat, darkStone } from "./Platform";

const shadowTex = glowTexture();
const W = 3.3;
const H = W * (660 / 1024);

function Card({ item, index }: { item: Item; index: number }) {
  const reduced = useReducedMotion();
  const [x, z] = itemPos(item);
  const tex = useMemo(() => createCardTexture(item), [item]);
  useEffect(() => {
    // A CanvasTexture is not owned by R3F's JSX material disposal.
    // StrictMode may replay effects: re-flag the source on setup.
    tex.needsUpdate = true;
    return () => tex.dispose();
  }, [tex]);
  const frame = useRef<THREE.Group>(null!);
  const hit = useRef<THREE.Mesh>(null!);
  const glow = useRef<THREE.MeshBasicMaterial>(null!);
  const aim = useRef(0);

  useEffect(() => {
    const o = hit.current;
    registry.add(o);
    return () => {
      registry.delete(o);
    };
  }, []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    aim.current += ((get().aimed === item.id ? 1 : 0) - aim.current) * (reduced ? 1 : Math.min(1, dt * 8));
    frame.current.position.y = 2.55 + (reduced ? 0 : Math.sin(t * 0.8 + index * 2) * 0.05);
    frame.current.scale.setScalar(1 + aim.current * 0.07);
    glow.current.opacity = 0.18 + aim.current * 0.6 + (reduced ? 0 : Math.sin(t * 1.4 + index) * 0.04);
  });

  return (
    <group position={[x, 0, z]} rotation={[0, (item.angle * Math.PI) / 180 + Math.PI, 0]}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.045, 0]} renderOrder={1}>
        <planeGeometry args={[4, 3]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.1, 0]} material={darkStone}>
        <cylinderGeometry args={[0.55, 0.65, 0.2, 32]} />
      </mesh>
      <mesh position={[0, 1.0, 0]} material={goldMat}>
        <cylinderGeometry args={[0.05, 0.07, 1.8, 12]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.11, 0]} renderOrder={3}>
        <ringGeometry args={[0.8, 0.9, 48]} />
        <meshBasicMaterial color={item.color} transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>

      <group ref={frame} position={[0, 2.55, 0]}>
        {/* золотая рамка */}
        <mesh position={[0, 0, -0.04]} material={goldMat}>
          <boxGeometry args={[W + 0.2, H + 0.2, 0.06]} />
        </mesh>
        <mesh position={[0, 0, -0.012]}>
          <planeGeometry args={[W + 0.06, H + 0.06]} />
          <meshBasicMaterial color="#05060f" />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[W, H]} />
          <meshBasicMaterial map={tex} toneMapped={false} color="#d4d4d4" />
        </mesh>
        {/* свечение рамки при наведении */}
        <mesh position={[0, 0, -0.07]} renderOrder={9}>
          <planeGeometry args={[W + 0.7, H + 0.7]} />
          <meshBasicMaterial ref={glow} color={item.color} transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh
          ref={hit}
          position={[0, 0, 0.1]}
          userData={{ id: item.id }}
          onClick={(e) => {
            if (get().xr) {
              e.stopPropagation();
              openItem(item.id);
            }
          }}
          onPointerOver={() => get().xr && set({ aimed: item.id })}
          onPointerOut={() => get().xr && get().aimed === item.id && set({ aimed: null })}
        >
          <boxGeometry args={[W + 0.3, H + 0.3, 0.5]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>
    </group>
  );
}

export function Cards() {
  const cards = ITEMS.filter((i) => i.kind === "card");
  return (
    <group>
      {cards.map((c, i) => (
        <Card key={c.id} item={c} index={i} />
      ))}
    </group>
  );
}

/** Панель деталей в VR: появляется перед лицом, с кнопками «Открыть на сайте» и «Закрыть» */
export function VRDetail() {
  const opened = useApp((s) => s.opened);
  const xr = useApp((s) => s.xr);
  const camera = useThree((s) => s.camera);
  const g = useRef<THREE.Group>(null!);
  const item = opened ? byId(opened) : null;
  const tex = useMemo(() => (item ? detailTexture(item) : null), [item]);
  const btnOpen = useMemo(() => buttonTexture("Открыть на сайте", true), []);
  const btnClose = useMemo(() => buttonTexture("Закрыть", false), []);
  useEffect(() => {
    if (tex) tex.needsUpdate = true;
    return () => tex?.dispose();
  }, [tex]);
  useEffect(() => {
    btnOpen.needsUpdate = true;
    btnClose.needsUpdate = true;
    return () => { btnOpen.dispose(); btnClose.dispose(); };
  }, [btnOpen, btnClose]);

  useEffect(() => {
    if (!item || !xr || !g.current) return;
    const p = new THREE.Vector3();
    const d = new THREE.Vector3();
    camera.getWorldPosition(p);
    camera.getWorldDirection(d);
    d.y = 0;
    d.normalize();
    g.current.position.set(p.x + d.x * 1.7, Math.max(p.y - 0.1, 1.1), p.z + d.z * 1.7);
    g.current.rotation.set(0, Math.atan2(-d.x, -d.z), 0);
  }, [item, xr, camera]);

  if (!item || !xr || !tex) return null;
  return (
    <group ref={g}>
      <mesh>
        <planeGeometry args={[1.4, 1.4 * (720 / 1024)]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
      <mesh
        position={[-0.36, -0.58, 0.01]}
        onClick={(e) => {
          e.stopPropagation();
          window.open(BASE + item.href, "_blank");
          xrStore.getState().session?.end();
        }}
      >
        <planeGeometry args={[0.62, 0.155]} />
        <meshBasicMaterial map={btnOpen} transparent toneMapped={false} />
      </mesh>
      <mesh
        position={[0.36, -0.58, 0.01]}
        onClick={(e) => {
          e.stopPropagation();
          closeItem(false);
        }}
      >
        <planeGeometry args={[0.5, 0.155]} />
        <meshBasicMaterial map={btnClose} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}
