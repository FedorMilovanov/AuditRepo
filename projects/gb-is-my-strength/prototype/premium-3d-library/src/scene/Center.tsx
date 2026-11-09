import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { canvasTex } from "../textures";
import { marble, wood, goldMat, wax } from "./Platform";

/** Backwards-compatible export, intentionally invisible in natural-light mode. */
export function Beam(_props: { height?: number; r0?: number; r1?: number; color?: string; opacity?: number; power?: number }) { return null; }

function titlePage(side: "left" | "right") {
  return canvasTex(512, 640, (c, w, h) => {
    c.fillStyle = "#efe1bc"; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 150; i++) {
      const v = Math.sin(i * 34.123 + 6.1) * 10000;
      const x = (v - Math.floor(v)) * w;
      c.fillStyle = "rgba(100,82,50,.025)";
      c.fillRect(x, (i * 43) % h, 2, 3);
    }
    c.fillStyle = "#524532";
    c.textAlign = "center";
    c.font = '600 31px Georgia, serif';
    c.fillText(side === "left" ? "ГОСПОДЬ БОГ" : "— СИЛА МОЯ", w / 2, 140);
    c.strokeStyle = "#ab956e"; c.lineWidth = 2;
    c.beginPath(); c.moveTo(85, 173); c.lineTo(w - 85, 173); c.stroke();
    c.font = '24px Georgia, serif';
    const lines = side === "left"
      ? ["Господь Бог — сила моя:", "Он сделает ноги мои", "как у оленя и на", "высоты мои возведёт меня."]
      : ["Аввакум 3:19", "", "Библиотека богословия", "и истории Церкви"];
    lines.forEach((line, i) => c.fillText(line, w / 2, 248 + i * 48));
    c.font = 'italic 20px Georgia, serif';
    c.fillStyle = "#9b866b";
    c.fillText(side === "left" ? "Откройте книгу знаний" : "gospod-bog.ru", w / 2, 548);
  });
}

/** Central reading table: a physical open book, not a floating orb. */
export function Center() {
  const left = useMemo(() => titlePage("left"), []);
  const right = useMemo(() => titlePage("right"), []);
  // Canvas textures are constructed outside R3F's JSX ownership and must be
  // released explicitly when the central exhibit unmounts.
  useEffect(() => () => { left.dispose(); right.dispose(); }, [left, right]);
  return <group>
    <mesh position={[0, 0.12, 0]} material={marble} receiveShadow>
      <cylinderGeometry args={[2.55, 2.6, 0.24, 80]} />
    </mesh>
    <mesh position={[0, 0.82, 0]} material={wood} castShadow receiveShadow>
      <cylinderGeometry args={[1.02, 1.35, 1.38, 64]} />
    </mesh>
    <mesh position={[0, 1.55, 0]} material={wood} castShadow receiveShadow>
      <cylinderGeometry args={[2.15, 2.05, 0.14, 84]} />
    </mesh>
    <mesh position={[0, 1.64, 0]} material={goldMat}>
      <torusGeometry args={[2.10, 0.024, 7, 92]} />
    </mesh>
    {/* Two wooden back supports bear the elevated edge of the lectern.
        The front edge of the tilted volume rests just above the tabletop. */}
    {[-0.86, 0.86].map((x) => (
      <mesh key={x} position={[x, 1.87, -0.43]} rotation-x={-0.24} material={wood} castShadow>
        <boxGeometry args={[0.14, 0.52, 0.15]} />
      </mesh>
    ))}
    {/* The book is angled toward the visitor's start position at +Z.
        Page planes are laid across the cover, rather than standing upright. */}
    <group position={[0, 1.95, 0.18]} rotation-x={0.35}>
      <mesh position={[0, -0.04, 0]} material={wood} castShadow><boxGeometry args={[2.3, 0.10, 1.60]} /></mesh>
      <mesh position={[0, 0.02, 0]} material={wax} castShadow><boxGeometry args={[2.19, 0.07, 1.50]} /></mesh>
      <mesh position={[-0.57, 0.078, 0]} rotation={[-Math.PI / 2, 0, 0.045]}>
        <planeGeometry args={[1.06, 1.42]} />
        <meshStandardMaterial map={left} side={THREE.DoubleSide} roughness={0.96} metalness={0} />
      </mesh>
      <mesh position={[0.57, 0.078, 0]} rotation={[-Math.PI / 2, 0, -0.045]}>
        <planeGeometry args={[1.06, 1.42]} />
        <meshStandardMaterial map={right} side={THREE.DoubleSide} roughness={0.96} metalness={0} />
      </mesh>
      <mesh position={[0, 0.065, 0]} material={goldMat}>
        <boxGeometry args={[0.017, 0.019, 1.45]} />
      </mesh>
    </group>
    <mesh position={[1.4, 1.83, -0.4]} material={wood} castShadow>
      <boxGeometry args={[0.51, 0.14, 0.72]} />
    </mesh>
    <mesh position={[1.4, 1.96, -0.4]} material={wax}>
      <boxGeometry args={[0.47, 0.13, 0.68]} />
    </mesh>
  </group>;
}
