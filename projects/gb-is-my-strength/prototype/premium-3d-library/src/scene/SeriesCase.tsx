import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { canvasTex } from "../textures";
import { goldMat, wood } from "./Platform";
import { SERIES_CASE as C, SERIES_VOLUMES as V, seriesShelfTop } from "./seriesCaseGeometry";

/** Quiet, unanimated period-style reference case in place of neon orbit books.
 * Each bound volume rests on a real wooden shelf. The public section plaque,
 * click volume, routes and navigation all stay owned by Station.
 */
export function SeriesCase({ color: _color }: { color: string }) {
  const spineTextures = useMemo(() => V.map((volume) =>
    canvasTex(128, 320, (c, w, h) => {
      c.fillStyle = volume.leather;
      c.fillRect(0, 0, w, h);
      const grain = c.createLinearGradient(0, 0, w, 0);
      grain.addColorStop(0, "rgba(0,0,0,0.28)");
      grain.addColorStop(0.22, "rgba(255,241,208,0.07)");
      grain.addColorStop(0.78, "rgba(255,241,208,0.025)");
      grain.addColorStop(1, "rgba(0,0,0,0.22)");
      c.fillStyle = grain;
      c.fillRect(0, 0, w, h);
      c.strokeStyle = "#ba9c67";
      c.lineWidth = 2;
      c.strokeRect(10, 13, w - 20, h - 26);
      c.strokeRect(16, 19, w - 32, h - 38);
      c.textAlign = "center";
      c.fillStyle = "#eddbb5";
      c.font = "600 20px Georgia, serif";
      c.fillText("СЕРИЯ", w / 2, 71);
      c.font = "600 54px Georgia, serif";
      c.fillText(volume.roman, w / 2, 187);
      c.font = "italic 17px Georgia, serif";
      c.fillText("TOMUS", w / 2, 262);
    })), []);
  const covers = useMemo(() => V.map(volume =>
    new THREE.MeshStandardMaterial({
      color: volume.leather, roughness: 0.88, metalness: 0,
    })), []);
  const leaves = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: "#e8dcc1", roughness: 0.95, metalness: 0,
    }), []);
  useEffect(() => {
    return () => {
      spineTextures.forEach(t => t.dispose());
      covers.forEach(m => m.dispose());
      leaves.dispose();
    };
  }, [spineTextures, covers, leaves]);

  return (
    <group>
      {/* The hardwood base contacts the actual stone pedestal y=1.09. */}
      {[
        [C.bottomShelfCenterY, C.bottomShelfThickness],
        [C.upperShelfCenterY, C.upperShelfThickness],
        [C.crownCenterY, C.crownThickness],
      ].map(([y, thickness]) => (
        <mesh key={y} position={[0, y, 0]} material={wood} castShadow receiveShadow>
          <boxGeometry args={[C.shelfWidth, thickness, C.shelfDepth]} />
        </mesh>
      ))}
      {/* Both oak sides run continuously from the stone to the cornice. */}
      {([-1, 1] as const).map(side => (
        <group key={side}>
          <mesh position={[side * C.sideRailX, C.sideRailCenterY, 0]}
            material={wood} castShadow receiveShadow>
            <boxGeometry args={[C.sideRailWidth, C.sideRailHeight, C.shelfDepth]} />
          </mesh>
          <mesh position={[side * (C.sideRailX - 0.005), C.crownCenterY + 0.01, C.shelfDepth / 2 - 0.015]}
            material={goldMat}>
            <boxGeometry args={[0.014, 0.055, 0.013]} />
          </mesh>
        </group>
      ))}
      {/* Back rails stiffen the shelf without closing it with a fake texture. */}
      {[-0.76, 0.33].map(y => (
        <mesh key={y} position={[0, y + 0.07, -C.shelfDepth / 2 + 0.045]}
          material={wood} castShadow receiveShadow>
          <boxGeometry args={[1.64, 0.085, 0.08]} />
        </mesh>
      ))}
      {V.map((v, i) => (
        <group key={v.id} position={[v.x, seriesShelfTop(v.row) + v.height / 2, 0]}>
          {/* Visible full binding, page block and two capped page edges. */}
          <mesh material={covers[i]} castShadow receiveShadow>
            <boxGeometry args={[v.width, v.height, C.bookDepth]} />
          </mesh>
          <mesh position={[v.width / 2 + 0.002, 0, -0.025]} material={leaves} receiveShadow>
            <boxGeometry args={[0.009, v.height - 0.055, C.bookDepth - 0.13]} />
          </mesh>
          <mesh position={[0, v.height / 2 + 0.002, -0.025]} material={leaves} receiveShadow>
            <boxGeometry args={[v.width - 0.045, 0.008, C.bookDepth - 0.13]} />
          </mesh>
          <mesh position={[0, 0, C.spineFaceZ]}>
            <planeGeometry args={[v.width - 0.026, v.height - 0.035]} />
            <meshStandardMaterial map={spineTextures[i]} roughness={0.94} metalness={0} />
          </mesh>
          {[-1, 1].map(end => (
            <mesh key={end} position={[
              0, end * (v.height / 2 - 0.088), C.bookDepth / 2 + 0.01,
            ]} material={goldMat}>
              <boxGeometry args={[v.width - 0.022, 0.014, 0.012]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
