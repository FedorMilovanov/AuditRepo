import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { canvasTex, fitCanvasTypeface } from "../textures";
import { SERIF, SANS } from "../fonts";
import { wood } from "./Platform";
import { CONFESSION_DOCUMENTS } from "./confessionDocuments";

/**
 * Physical museum folios replace the misleading I–X law tablets. This is
 * intentionally MODERN interpretive exhibition artwork, not a claimed
 * facsimile of any original 16th–17th-century edition.
 *
 * One shared atlas (1024×512) and one front-face material for all four books;
 * no emissive halos, moving orbits, floating law tablets, external assets,
 * continuous animation or per-frame texture work.
 */
function coverAtlas() {
  return canvasTex(1024, 512, (c) => {
    const cellWidth = 256;
    CONFESSION_DOCUMENTS.forEach((doc, index) => {
      const x = index * cellWidth;
      const fill = c.createLinearGradient(x, 0, x + cellWidth, 512);
      fill.addColorStop(0, doc.cover);
      fill.addColorStop(1, "#232626");
      c.fillStyle = fill;
      c.fillRect(x, 0, cellWidth, 512);

      // Linen-grain lines are deterministic; no pseudo-antique signatures,
      // fictional paragraphs, or photographs requiring image rights.
      for (let line = 0; line < 30; line++) {
        c.fillStyle = line % 3 === 0 ? "rgba(240,220,172,.045)" : "rgba(0,0,0,.055)";
        c.fillRect(x + 8 + line * 8, 12, 1, 488);
      }
      c.strokeStyle = "#bca277";
      c.lineWidth = 2;
      c.strokeRect(x + 17, 18, 222, 476);
      c.strokeStyle = "rgba(236,211,163,.45)";
      c.lineWidth = 1;
      c.strokeRect(x + 24, 25, 208, 462);
      c.beginPath();
      c.moveTo(x + 60, 139);
      c.lineTo(x + 196, 139);
      c.moveTo(x + 60, 384);
      c.lineTo(x + 196, 384);
      c.stroke();

      c.textAlign = "center";
      c.fillStyle = "#e7d7b8";
      const small = fitCanvasTypeface(c, doc.tradition, {
        family: SANS, weight: 600, maxPx: 17, minPx: 10, maxWidth: 210,
      });
      c.font = `600 ${small}px ${SANS}`;
      c.fillText(doc.tradition, x + 128, 92);

      c.fillStyle = "#f0e1be";
      const beginY = 224 - (doc.lines.length - 2) * 18;
      doc.lines.forEach((line, i) => {
        const px = fitCanvasTypeface(c, line, {
          family: SERIF, weight: 600, maxPx: 27, minPx: 16, maxWidth: 210,
        });
        c.font = `600 ${px}px ${SERIF}`;
        c.fillText(line, x + 128, beginY + i * 42);
      });

      c.fillStyle = "#e3c991";
      c.font = `600 31px ${SERIF}`;
      c.fillText(doc.date, x + 128, 429);
      c.fillStyle = "#d2b98d";
      c.font = `500 12px ${SANS}`;
      c.fillText("ИСТОРИЧЕСКИЙ ДОКУМЕНТ", x + 128, 465);
    });
  });
}

function atlasPlanes() {
  return CONFESSION_DOCUMENTS.map((_, index) => {
    const geometry = new THREE.PlaneGeometry(0.54, 0.84);
    const uv = geometry.getAttribute("uv") as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, (index + uv.getX(i)) / CONFESSION_DOCUMENTS.length, uv.getY(i));
    }
    uv.needsUpdate = true;
    return geometry;
  });
}

export function ConfessionArchive({ color: _color }: { color: string }) {
  const atlas = useMemo(coverAtlas, []);
  const planes = useMemo(atlasPlanes, []);
  const front = useMemo(() => new THREE.MeshStandardMaterial({
    map: atlas, color: "#ffffff", roughness: 0.88, metalness: 0,
  }), [atlas]);

  useEffect(() => () => {
    planes.forEach((geometry) => geometry.dispose());
    front.dispose();
    atlas.dispose();
  }, [planes, front, atlas]);

  return <group name="confession-archive">
    {/* The four physical volumes rest on a continuous wooden reading shelf;
        each paper block sits inside a cloth-covered binding. */}
    <mesh position={[0, -0.51, -0.03]} material={wood} castShadow receiveShadow>
      <boxGeometry args={[2.55, 0.17, 0.66]} />
    </mesh>
    <mesh position={[0, -0.615, -0.03]} material={wood} receiveShadow>
      <boxGeometry args={[2.38, 0.045, 0.58]} />
    </mesh>
    {CONFESSION_DOCUMENTS.map((doc, index) => {
      const x = (index - 1.5) * 0.61;
      const yaw = (index - 1.5) * 0.075;
      return <group key={doc.date} position={[x, 0.02, 0.01]} rotation-y={yaw}>
        <mesh position={[0, 0, -0.041]} castShadow receiveShadow>
          <boxGeometry args={[0.57, 0.88, 0.07]} />
          <meshStandardMaterial color={doc.cover} roughness={0.83} metalness={0.03} />
        </mesh>
        <mesh position={[0, 0, -0.003]} receiveShadow>
          <boxGeometry args={[0.53, 0.84, 0.095]} />
          <meshStandardMaterial color="#d9c9ad" roughness={0.93} />
        </mesh>
        <mesh geometry={planes[index]} material={front} position={[0, 0, 0.047]}
          receiveShadow castShadow={false} dispose={null} />
      </group>;
    })}
  </group>;
}
