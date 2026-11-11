import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ITEMS, byId, itemPos } from "../data";
import { get, input, openItem, registry, set } from "../store";
import { useReducedMotion } from "../motion";
import { lecternPage, verseTabletTexture } from "../textures";
import { darkStone, goldMat, marble, wood } from "./Platform";
import { READING_GEOMETRY as R } from "./readingGeometry";

function VerseTablet() {
  const tex = useMemo(() => verseTabletTexture(), []);
  useEffect(() => {
    tex.needsUpdate = true;
    return () => tex.dispose();
  }, [tex]);
  return (
    <group position={[2.35, 0, 11.55]} rotation-y={Math.atan2(1.05 - 2.35, 9.5 - 11.55)}>
      <mesh position={[0, 0.32, 0]} material={darkStone}>
        <cylinderGeometry args={[0.34, 0.4, 0.64, 18]} />
      </mesh>
      <mesh position={[0, 1.42, 0]} material={marble}>
        <boxGeometry args={[1.05, 1.55, 0.08]} />
      </mesh>
      <mesh position={[0, 1.42, 0.045]}>
        <planeGeometry args={[0.92, 1.38]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.42, -0.045]} rotation-y={Math.PI} material={goldMat}>
        <planeGeometry args={[0.7, 0.04]} />
      </mesh>
    </group>
  );
}

function Lectern() {
  const item = byId("c-about");
  const [x, z] = itemPos(item);
  const page = useMemo(() => lecternPage(item), [item]);
  useEffect(() => {
    page.needsUpdate = true;
    return () => page.dispose();
  }, [page]);
  const hit = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    const o = hit.current;
    registry.add(o);
    return () => {
      registry.delete(o);
    };
  }, []);
  return (
    <group position={[x, 0, z]} rotation={[0, (item.angle * Math.PI) / 180 + Math.PI, 0]}>
      <mesh position={[0, 0.07, 0]} material={darkStone}>
        <cylinderGeometry args={[0.32, 0.4, 0.14, 20]} />
      </mesh>
      {/* наклонная стойка кафедры */}
      <mesh position={[0, 0.66, -0.1]} rotation={[-0.24, 0, 0]} material={wood}>
        <boxGeometry args={[0.13, 1.2, 0.13]} />
      </mesh>
      <mesh position={[0, 1.06, 0.02]} rotation={[R.lecternFacingTiltX, 0, 0]} material={wood}>
        <boxGeometry args={[0.74, 0.05, 0.5]} />
      </mesh>
      {/* раскрытая книга на пюпитре */}
      <group position={[0, R.lecternPageCenterY, 0.03]} rotation={[R.lecternFacingTiltX, 0, 0]}>
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.62, 0.022, 0.44]} />
          <meshStandardMaterial color="#f7efdb" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.026, 0]} rotation-x={R.lecternPageRotationX}>
          <planeGeometry args={[0.58, 0.4]} />
          <meshBasicMaterial map={page} toneMapped={false} />
        </mesh>
      </group>
      <mesh
        ref={hit}
        position={[0, 1.05, 0]}
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
        <boxGeometry args={[0.95, 1.5, 0.7]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}

function Benches() {
  return (
    <group>
      {ITEMS.filter((i) => i.kind === "section").map((it) => {
        const a = (it.angle * Math.PI) / 180;
        const r = 6.15;
        return (
          <group key={it.id} position={[Math.sin(a) * r, 0, Math.cos(a) * r]} rotation={[0, a, 0]}>
            <mesh position={[0, 0.4, 0]} material={wood}>
              <boxGeometry args={[1.35, 0.08, 0.42]} />
            </mesh>
            {[-0.52, 0.52].map((sx) => (
              <mesh key={sx} position={[sx, 0.2, 0]} material={wood}>
                <boxGeometry args={[0.08, 0.4, 0.34]} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function DestMark() {
  const reduced = useReducedMotion();
  const m = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const d = input.dest;
    const on = !!d && get().phase === "play";
    m.current.visible = on;
    if (!d) return;
    m.current.position.set(d.x, 0.13, d.z);
    const s = reduced ? 1 : 1 + Math.sin(clock.elapsedTime * 4) * 0.08;
    m.current.scale.setScalar(s);
  });
  return (
    <mesh ref={m} rotation-x={-Math.PI / 2} visible={false} renderOrder={5}>
      <ringGeometry args={[0.26, 0.38, 32]} />
      <meshBasicMaterial color="#ffd58a" transparent opacity={0.85} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

export function Dressing() {
  return (
    <group>
      <VerseTablet />
      <Lectern />
      <Benches />
      <DestMark />
    </group>
  );
}
