import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { ITEMS, itemPos, type Item } from "../data";
import { get, openItem, registry, set } from "../store";
import { glowTexture, spineTexture, tomePlaque } from "../textures";
import { darkStone, goldMat } from "./Platform";

const shadowTex = glowTexture();
const _wp = new THREE.Vector3();

function Tome({ item, index }: { item: Item; index: number }) {
  const [x, z] = itemPos(item);
  const spine = useMemo(() => spineTexture(item.spine || item.title, item.color, item.n), [item]);
  const plaque = useMemo(() => tomePlaque(item), [item]);
  useEffect(() => {
    spine.needsUpdate = true;
    plaque.needsUpdate = true;
    return () => { spine.dispose(); plaque.dispose(); };
  }, [spine, plaque]);
  const leather = useMemo(
    () => new THREE.MeshStandardMaterial({ color: item.color, roughness: 0.83, metalness: 0 }),
    [item.color]
  );
  const hit = useRef<THREE.Mesh>(null!);
  const g = useRef<THREE.Group>(null!);
  const plaqueMat = useRef<THREE.MeshBasicMaterial>(null!);
  const aim = useRef(0);
  useEffect(() => {
    const o = hit.current;
    registry.add(o);
    return () => {
      registry.delete(o);
    };
  }, []);
  useFrame(({ camera }, dt) => {
    aim.current += ((get().aimed === item.id ? 1 : 0) - aim.current) * Math.min(1, dt * 8);
    const lean = 0.04 * Math.sin(index * 1.7);
    g.current.position.y = 0;
    g.current.rotation.z = lean * (1 - aim.current);
    g.current.scale.setScalar(1 + aim.current * 0.015);
    g.current.getWorldPosition(_wp);
    const dist = camera.position.distanceTo(_wp);
    // не даём табличке исчезнуть совсем: резкое появление выглядит как мерцание
    if (plaqueMat.current) plaqueMat.current.opacity = 0.35 + 0.65 * (1 - THREE.MathUtils.smoothstep(dist, 4, 12));
  });
  return (
    <group position={[x, 0, z]}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.045, 0]} renderOrder={1}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.05, 0]} material={darkStone}>
        <cylinderGeometry args={[0.32, 0.4, 0.1, 16]} />
      </mesh>
      <group ref={g} rotation={[0, (item.angle * Math.PI) / 180 + Math.PI + (index % 2 ? 0.05 : -0.04), 0]}>
        <mesh position={[0, 0.83, 0]} material={leather} castShadow={false}>
          <boxGeometry args={[0.46, 1.45, 0.98]} />
        </mesh>
        <mesh position={[0, 0.83, 0.495]}>
          <planeGeometry args={[0.4, 1.32]} />
          <meshBasicMaterial map={spine} toneMapped={false} />
        </mesh>
        {[1.34, 0.42].map((y) => (
          <mesh key={y} position={[0, y, 0.5]} material={goldMat}>
            <boxGeometry args={[0.43, 0.024, 0.01]} />
          </mesh>
        ))}
        <mesh position={[0, 0.83, -0.5]} rotation-y={Math.PI}>
          <planeGeometry args={[0.4, 1.32]} />
          <meshBasicMaterial map={spine} toneMapped={false} />
        </mesh>
        <Billboard position={[0, 1.95, 0]} lockX lockZ>
          <mesh scale={[1, 1 + aim.current * 0.02, 1]}>
            <planeGeometry args={[1.5, 0.4]} />
            <meshBasicMaterial ref={plaqueMat} map={plaque} transparent depthWrite={false} toneMapped={false} />
          </mesh>
        </Billboard>
        <mesh
          ref={hit}
          position={[0, 0.9, 0]}
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
          <boxGeometry args={[0.9, 1.85, 1.2]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>
    </group>
  );
}

export function Tomes() {
  const tomes = ITEMS.filter((i) => i.kind === "tome");
  return (
    <group>
      {tomes.map((t, i) => (
        <Tome key={t.id} item={t} index={i} />
      ))}
    </group>
  );
}
