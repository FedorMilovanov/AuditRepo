import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { ENTRANCE_GEOMETRY as E } from "./entranceGeometry";

/**
 * Genuine, distant 3D landforms beyond the open garden loggia.
 * No background image, opaque rectangle, unlicensed asset, magic lighting
 * or inaccessible navigation path. Terrain sits outside the hall/player
 * boundary and receives the shared daylight + distance fog.
 */
export function ExteriorLandscape() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(136, 90, 56, 24);
    g.rotateX(-Math.PI / 2);
    const positions = g.getAttribute("position") as THREE.BufferAttribute;
    const colors = new Float32Array(positions.count * 3);
    const low = new THREE.Color("#77816e");
    const high = new THREE.Color("#5b6d62");
    const tint = new THREE.Color();
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const worldZ = E.radius + 54 + z;
      const t = THREE.MathUtils.clamp((worldZ - 31) / 80, 0, 1);
      const undulation = (2.5 * Math.sin(x * 0.105 + z * 0.055)
        + 1.1 * Math.cos(x * 0.25 - z * 0.025)) * t;
      const height = -0.62 + 19 * Math.pow(t, 0.76) + undulation;
      positions.setY(i, height);
      tint.copy(low).lerp(high, t * 0.82);
      const grain = 0.92 + 0.08 * Math.sin(x * 0.16 + z * 0.21);
      colors[i * 3] = tint.r * grain;
      colors[i * 3 + 1] = tint.g * grain;
      colors[i * 3 + 2] = tint.b * grain;
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    positions.needsUpdate = true;
    g.computeVertexNormals();
    g.computeBoundingSphere();
    return g;
  }, []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 1, metalness: 0,
    side: THREE.DoubleSide,
  }), []);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  return <mesh
    name="exterior-landscape"
    geometry={geometry}
    material={material}
    position={[0, 0, E.radius + 54]}
    receiveShadow={false}
    castShadow={false}
  />;
}
