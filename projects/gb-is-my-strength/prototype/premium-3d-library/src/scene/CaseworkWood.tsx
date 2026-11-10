/**
 * Source-owned casework wood, independent of the furniture and central lectern.
 *
 * One shared, color-managed PBR material under a React provider: normal/rough
 * maps follow the albedo and the same GPU textures are used across all 13
 * bookcases + decorative architectural trim. Genuine quality-specific assets
 * load only for the user-selected preset, with a real low-profile budget.
 *
 * A second shared BoxGeometry rotates UV, not object orientation. As a result,
 * horizontal shelves and tall uprights render grain along their long axes
 * without creating individual mesh draw calls or changing collision geometry.
 */
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, type ReactNode } from "react";
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
  // With no provider, show original casework (real progressive-load fallback).
  // This does not change the original shared wood used by central furniture.
  return useContext(CaseworkContext) ?? wood;
}

export function CaseworkWoodProvider({ children }: { children: ReactNode }) {
  const quality = useApp((s) => s.quality);
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
  }, [albedo, normal, roughness, quality]);

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#c2ab93"),
    map: albedo, normalMap: normal, roughnessMap: roughness,
    normalScale: new THREE.Vector2(0.20, 0.20),
    roughness: 0.94, metalness: 0,
  }), [albedo, normal, roughness]);
  useEffect(() => () => material.dispose(), [material]);
  return <CaseworkContext.Provider value={material}>{children}</CaseworkContext.Provider>;
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
