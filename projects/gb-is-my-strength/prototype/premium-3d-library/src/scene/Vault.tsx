import { useMemo } from "react";
import * as THREE from "three";
import { marble, wood, goldMat } from "./Platform";
import { roofLimestone } from "./ArchitecturalPolish";

const RIBS = 20;
const OC_R = 4.15;
const OC_Y = 13.15;
const COL_R = 14.45;
const COL_Y = 8.9;

function ribCurve(index: number) {
  const a = (index / RIBS) * Math.PI * 2 + Math.PI / RIBS;
  const p0 = new THREE.Vector3(Math.sin(a) * COL_R, COL_Y, Math.cos(a) * COL_R);
  const p2 = new THREE.Vector3(Math.sin(a) * OC_R, OC_Y, Math.cos(a) * OC_R);
  const pr = (COL_R + OC_R) * 0.5;
  const p1 = new THREE.Vector3(Math.sin(a) * pr, COL_Y + (OC_Y - COL_Y) * 0.9, Math.cos(a) * pr);
  return new THREE.QuadraticBezierCurve3(p0, p1, p2);
}

/** Opaque, physically shaded limestone roof replaces the transparent glowing dome. */
export function Vault() {
  const ribs = useMemo(() => Array.from({ length: RIBS }, (_, i) => new THREE.TubeGeometry(ribCurve(i), 24, 0.13, 7, false)), []);
  const shell = useMemo(() => new THREE.LatheGeometry([
    new THREE.Vector2(OC_R, OC_Y),
    new THREE.Vector2(OC_R + 0.6, OC_Y - 0.12),
    new THREE.Vector2(6.3, 12.6),
    new THREE.Vector2(9.0, 11.5),
    new THREE.Vector2(11.5, 10.15),
    new THREE.Vector2(COL_R, COL_Y),
  ], 112), []);
  return (
    <group>
      <mesh geometry={shell} material={roofLimestone} receiveShadow />
      {ribs.map((geo, i) => <mesh key={i} geometry={geo} material={marble} receiveShadow />)}
      <mesh position={[0, OC_Y, 0]} rotation-x={Math.PI / 2} material={marble}>
        <torusGeometry args={[OC_R, 0.3, 12, 96]} />
      </mesh>
      <mesh position={[0, OC_Y + 0.02, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[OC_R - 0.23, 80]} />
        <meshPhysicalMaterial color="#d8e7e4" roughness={0.12} metalness={0} transparent opacity={0.12} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* Timber and antique-brass pendant; static, no rotating orbital ornaments. */}
      <mesh position={[0, 11.72, 0]} material={goldMat}>
        <cylinderGeometry args={[0.03, 0.03, 2.5, 10]} />
      </mesh>
      <mesh position={[0, 10.35, 0]} rotation-x={Math.PI / 2} material={wood}>
        <torusGeometry args={[2.15, 0.09, 12, 84]} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <group key={i} position={[Math.sin(a) * 2.15, 10.45, Math.cos(a) * 2.15]}>
          <mesh material={goldMat}><cylinderGeometry args={[0.09, 0.095, 0.15, 12]} /></mesh>
          <mesh position={[0, 0.16, 0]}><sphereGeometry args={[0.07, 12, 10]} /><meshStandardMaterial color="#f9dfaa" roughness={0.35} emissive="#f2b86d" emissiveIntensity={0.15} /></mesh>
        </group>;
      })}
    </group>
  );
}

/** Daylight comes from the virtual sun; jewel-coloured volumetric beams are intentionally absent. */
export function StainedLight() { return null; }
