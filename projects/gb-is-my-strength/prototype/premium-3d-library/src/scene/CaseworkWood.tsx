/**
 * Shared, persistent PBR casework. Geometry and its material identity must
 * never be replaced while switching texture quality: the next preset is
 * loaded behind an internal Suspense boundary and applied atomically when
 * all three channels are ready.
 *
 * A single 512/1024 texture triplet serves all 13 cases and decorative trim.
 * No application-specific WebGL monkey patches or fabricated draw calls.
 */
import { Suspense, createContext, useContext, useEffect, useLayoutEffect, useMemo, type ReactNode } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useApp } from "../store";
import { wood } from "./Platform";

const highMaps = [
  new URL("../assets/pbr/wood049-1024-color.webp", import.meta.url).href,
  new URL("../assets/pbr/wood049-1024-normal.webp", import.meta.url).href,
  new URL("../assets/pbr/wood049-1024-roughness.webp", import.meta.url).href,
];
const lowMaps = [
  new URL("../assets/pbr/wood049-512-color.webp", import.meta.url).href,
  new URL("../assets/pbr/wood049-512-normal.webp", import.meta.url).href,
  new URL("../assets/pbr/wood049-512-roughness.webp", import.meta.url).href,
];

const CaseworkContext = createContext<THREE.MeshStandardMaterial | null>(null);

export function useCaseworkWood(): THREE.MeshStandardMaterial {
  // A real fallback for initial offline/slow network; never a hidden cabinet.
  return useContext(CaseworkContext) ?? wood;
}

function CaseworkMaps({ quality, material }: {
  quality: "high" | "low";
  material: THREE.MeshStandardMaterial;
}) {
  const [albedo, normal, roughness] = useLoader(THREE.TextureLoader,
    quality === "high" ? highMaps : lowMaps);
  useLayoutEffect(() => {
    for (const map of [albedo, normal, roughness]) {
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(2, 1);
      map.anisotropy = quality === "high" ? 8 : 4;
      map.needsUpdate = true;
    }
    albedo.colorSpace = THREE.SRGBColorSpace;
    normal.colorSpace = THREE.NoColorSpace;
    roughness.colorSpace = THREE.NoColorSpace;
    albedo.needsUpdate = true;

    // Apply all channels in one React commit; keep the same GPU material and
    // instanced geometry while the new quality preset is decoded/uploaded.
    material.map = albedo;
    material.normalMap = normal;
    material.roughnessMap = roughness;
    material.needsUpdate = true;
  }, [albedo, normal, roughness, quality, material]);
  return null;
}

export function CaseworkWoodProvider({ children }: { children: ReactNode }) {
  const quality = useApp((s) => s.quality);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#c2ab93"),
    normalScale: new THREE.Vector2(0.20, 0.20),
    roughness: 0.94, metalness: 0,
  }), []);
  useEffect(() => () => material.dispose(), [material]);
  return (
    <CaseworkContext.Provider value={material}>
      {children}
      {/* Only the map loader can suspend. Books, shelves, uprights and
          stonework remain mounted throughout either graphics transition. */}
      <Suspense fallback={null}>
        <CaseworkMaps key={quality} quality={quality} material={material} />
      </Suspense>
    </CaseworkContext.Provider>
  );
}

export function verticalGrainBoxGeometry(): THREE.BoxGeometry {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const uv = geometry.getAttribute("uv") as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i), v = uv.getY(i);
    uv.setXY(i, v, 1 - u);
  }
  uv.needsUpdate = true;
  return geometry;
}
