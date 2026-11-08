import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useApp } from "../store";
import { floorTexture } from "../textures";

export const stone = new THREE.MeshStandardMaterial({ color: "#b6a995", roughness: 0.85, metalness: 0 });
export const darkStone = new THREE.MeshStandardMaterial({ color: "#75695d", roughness: 0.84, metalness: 0 });
export const baseStone = new THREE.MeshStandardMaterial({ color: "#a39887", roughness: 0.79, metalness: 0 });
export const goldMat = new THREE.MeshStandardMaterial({ color: "#ab8456", roughness: 0.43, metalness: 0.72 });
export const marble = new THREE.MeshStandardMaterial({ color: "#d3c6ac", roughness: 0.78, metalness: 0 });
/** Скульптура темнее архитектурного мрамора: на её поверхности не должно быть пересвета */
export const statue = new THREE.MeshStandardMaterial({ color: "#a8a094", roughness: 0.62, metalness: 0.02, envMapIntensity: 0.5 });
export const wood = new THREE.MeshStandardMaterial({ color: "#593f2d", roughness: 0.78, metalness: 0 });
export const wax = new THREE.MeshStandardMaterial({ color: "#f4ead4", roughness: 0.55, metalness: 0 });

function rockGeometry() {
  const g = new THREE.ConeGeometry(16, 36, 56, 12, true);
  g.rotateX(Math.PI);
  const p = g.attributes.position;
  const h = (x: number, y: number, z: number) => {
    const s = Math.sin(x * 1.7 + y * 0.9) * Math.cos(z * 1.3 - y * 1.1) + Math.sin(x * 0.6 - z * 0.8 + y * 2.1) * 0.6;
    return s;
  };
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const f = (18 - y) / 36; // 0 у верхнего края, 1 в нижней точке
    const r = Math.hypot(x, z) || 1;
    const k = h(x, y, z) * 1.9 * Math.min(f * 4, 1) * (1 - f * 0.4);
    p.setXYZ(i, x + (x / r) * k, y + h(z, x, y) * 0.9 * f, z + (z / r) * k);
  }
  g.computeVertexNormals();
  return g;
}

export function Platform() {
  const q = useApp((s) => s.quality);
  const floorTex = useMemo(() => floorTexture(q === "high" ? 2048 : 1024), [q]);
  // CanvasTexture is created manually; R3F does not own its lifetime. Each
  // quality switch must release the previous 4–16 MiB RGBA texture.
  useEffect(() => () => floorTex.dispose(), [floorTex]);
  const rock = useMemo(() => rockGeometry(), []);
  const N = 20;
  const R = 14.5;

  const shaft = useRef<THREE.InstancedMesh>(null!);
  const base = useRef<THREE.InstancedMesh>(null!);
  const cap = useRef<THREE.InstancedMesh>(null!);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const e = new THREE.Euler();
    const qn = new THREE.Quaternion();
    const s = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 + Math.PI / N;
      const x = Math.sin(a) * R, z = Math.cos(a) * R;
      qn.setFromEuler(e.set(0, -a, 0));
      shaft.current.setMatrixAt(i, m.compose(new THREE.Vector3(x, 4.35, z), qn, s));
      base.current.setMatrixAt(i, m.compose(new THREE.Vector3(x, 0.17, z), qn, s));
      cap.current.setMatrixAt(i, m.compose(new THREE.Vector3(x, 8.55, z), qn, s));
    }
    [shaft, base, cap].forEach((r) => (r.current.instanceMatrix.needsUpdate = true));
  }, []);

  return (
    <group>
      {/* плита */}
      <mesh position={[0, -0.3, 0]} material={darkStone} receiveShadow>
        <cylinderGeometry args={[16.2, 16.0, 0.6, 96]} />
      </mesh>
      {/* пол */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.004, 0]} receiveShadow>
        <circleGeometry args={[16, 128]} />
        <meshStandardMaterial map={floorTex} roughness={0.70} metalness={0.0} />
      </mesh>
      {/* золотой кант */}
      <mesh rotation-x={Math.PI / 2} position={[0, 0.02, 0]}>
        <torusGeometry args={[16.05, 0.06, 8, 160]} />
        <meshBasicMaterial color="#a98b61" />
      </mesh>
      {/* скальное основание */}
      <mesh geometry={rock} position={[0, -18.6, 0]}>
        <meshStandardMaterial color="#615e57" roughness={0.95} metalness={0} flatShading />
      </mesh>

      {/* колоннада */}
      <instancedMesh ref={shaft} args={[undefined, undefined, N]} material={marble} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.42, 8.2, 24]} />
      </instancedMesh>
      <instancedMesh ref={base} args={[undefined, undefined, N]} material={marble} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.7, 0.34, 24]} />
      </instancedMesh>
      <instancedMesh ref={cap} args={[undefined, undefined, N]} material={marble} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.46, 0.42, 24]} />
      </instancedMesh>
      <mesh position={[0, 9.05, 0]} rotation-x={Math.PI / 2} material={marble}>
        <torusGeometry args={[R, 0.4, 14, 160]} />
      </mesh>
      <mesh position={[0, 9.5, 0]} rotation-x={Math.PI / 2} material={goldMat}>
        <torusGeometry args={[R, 0.09, 8, 160]} />
      </mesh>
      <mesh position={[0, 8.72, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[R - 0.18, 0.045, 8, 160]} />
        <meshBasicMaterial color="#ffcf80" toneMapped={false} />
      </mesh>
    </group>
  );
}
