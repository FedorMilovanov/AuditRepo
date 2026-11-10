import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { ITEMS, sectionApproachDistance, itemPos, type Item } from "../data";
import { useApp, registry, openItem, get, set } from "../store";
import { plaqueTexture, paperTexture, tabletTextures, glowTexture } from "../textures";
import { Beam } from "./Center";
import { darkStone, goldMat, marble, statue } from "./Platform";

const shadowTex = glowTexture();

/** Универсальный постамент: табличка, свет, зона клика, подсветка при наведении */
function Station({ item, children }: { item: Item; children: ReactNode }) {
  const q = useApp((s) => s.quality);
  const size = useThree((state) => state.size);
  const verticalFov = useThree((state) =>
    state.camera instanceof THREE.PerspectiveCamera ? state.camera.fov : 68
  );
  // Portrait viewports see much less horizontal area than desktop at the
  // same vertical FOV. Fit the actual in-world plaque to the guaranteed
  // camera standoff, preserving its texture aspect ratio and readable type.
  // No page zoom, camera teleport, HUD overlay or screenshot-only adjustment.
  const portrait = size.width < size.height && size.width <= 520;
  const worldWidthAtStation = 2 * sectionApproachDistance(item)
    * Math.tan(THREE.MathUtils.degToRad(verticalFov / 2))
    * size.width / size.height;
  const plaqueFit = portrait ? Math.min(1, worldWidthAtStation * 0.7 / 3.5) : 1;
  const [x, z] = itemPos(item);
  const hit = useRef<THREE.Mesh>(null!);
  const plaque = useRef<THREE.Group>(null!);
  const art = useRef<THREE.Group>(null!);
  const pad = useRef<THREE.MeshBasicMaterial>(null!);
  const light = useRef<THREE.PointLight>(null!);
  const aim = useRef(0);
  const tex = useMemo(() => plaqueTexture(item), [item]);
  useEffect(() => {
    tex.needsUpdate = true;
    return () => tex.dispose();
  }, [tex]);

  useEffect(() => {
    const o = hit.current;
    registry.add(o);
    return () => {
      registry.delete(o);
    };
  }, []);

  useFrame((_, dt) => {
    const a = get().aimed === item.id ? 1 : 0;
    aim.current += (a - aim.current) * Math.min(1, dt * 8);
    plaque.current.scale.setScalar(1 + aim.current * 0.12);
    art.current.position.y = 1.95;
    pad.current.opacity = 0.045 + aim.current * 0.15;
    if (light.current) light.current.intensity = 0.3 + aim.current * 0.8;
  });

  return (
    <group position={[x, 0, z]} rotation={[0, (item.angle * Math.PI) / 180 + Math.PI, 0]}>
      {/* «ступенька» над полом: копланарные прозрачные плоскости мерцают на 16-битной глубине */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.045, 0]} renderOrder={1}>
        <planeGeometry args={[3.6, 3.6]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.06, 0]} material={darkStone}>
        <cylinderGeometry args={[0.95, 1.05, 0.12, 40]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} material={marble}>
        <cylinderGeometry args={[0.55, 0.68, 0.95, 40]} />
      </mesh>
      <mesh position={[0, 1.04, 0]} material={goldMat}>
        <cylinderGeometry args={[0.78, 0.62, 0.1, 40]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.62, 0.014, 6, 64]} />
        <meshBasicMaterial color={item.color} toneMapped={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.11, 0]} renderOrder={3}>
        <ringGeometry args={[1.28, 1.5, 64]} />
        <meshBasicMaterial ref={pad} color={item.color} transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>

      <group ref={art} position={[0, 1.95, 0]}>{children}</group>

      <Billboard position={[0, 3.95, 0]} scale={plaqueFit} lockX lockZ>
        <group ref={plaque}>
          <mesh>
            <planeGeometry args={[3.5, 3.5 * (420 / 1024)]} />
            <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} color="#d6d6d6" />
          </mesh>
        </group>
      </Billboard>

      <pointLight ref={light} position={[0, 3.1, 1.5]} color="#e8cfac" intensity={0.3} distance={4} decay={2} visible={q === "high"} />

      <mesh
        ref={hit}
        position={[0, 2.35, 0]}
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
        <cylinderGeometry args={[1.25, 1.25, 4.7, 14]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}

/* ───────────── 01 Статьи: раскрытая книга с листающимися страницами ───────────── */
function BookArt({ color }: { color: string }) {
  const paper = useMemo(() => new THREE.MeshStandardMaterial({ map: paperTexture(), roughness: 0.9, side: THREE.DoubleSide }), []);
  const cover = useMemo(() => new THREE.MeshStandardMaterial({ color: "#6b1f2c", roughness: 0.5, metalness: 0.25 }), []);
  useEffect(() => {
    if (paper.map) paper.map.needsUpdate = true;
    return () => paper.map?.dispose();
  }, [paper]);
  const flips = useRef<THREE.Group[]>([]);
  const sheets = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    flips.current.forEach((g, i) => {
      if (!g) return;
      const k = (t / 3.4 + i / 3) % 1;
      const e = k * k * (3 - 2 * k);
      g.rotation.z = 0.12 + e * (Math.PI - 0.24);
      g.position.y = 0.07 + Math.sin(e * Math.PI) * 0.0 + i * 0.002;
    });
    sheets.current.children.forEach((m, i) => {
      const a = t * 0.35 + i * 1.0472;
      m.position.set(Math.cos(a) * 1.45, 0.35 + Math.sin(t * 0.8 + i * 2) * 0.3, Math.sin(a) * 1.45);
      m.rotation.set(t * 0.5 + i, a, t * 0.3 + i);
    });
  });
  return (
    <group>
      <group scale={1.55} rotation={[0.38, 0, 0]}>
        {[1, -1].map((s) => (
          <group key={s} rotation-z={0.12 * s}>
            <mesh position={[0.43 * s, -0.04, 0]} material={cover}>
              <boxGeometry args={[0.88, 0.04, 1.12]} />
            </mesh>
            <mesh position={[0.41 * s, 0.025, 0]} material={paper}>
              <boxGeometry args={[0.8, 0.08, 1.04]} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, -0.05, 0]} material={cover}>
          <boxGeometry args={[0.1, 0.05, 1.12]} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <group key={i} ref={(g) => { if (g) flips.current[i] = g; }} position={[0, 0.07, 0]}>
            <mesh position={[0.39, 0, 0]} material={paper}>
              <boxGeometry args={[0.78, 0.006, 1.02]} />
            </mesh>
          </group>
        ))}
      </group>
      <group ref={sheets}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} material={paper}>
            <planeGeometry args={[0.3, 0.4]} />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 0.9, 0.4]} color="#ffe0b0" intensity={2.2} distance={6} decay={1.8} />
      <group position={[0, 0.1, 0]}>
        <Beam height={2.1} r0={0.7} r1={0.12} color={color} opacity={0.3} />
      </group>
    </group>
  );
}

/* ───────────── 02 Серии: спираль книг ───────────── */
const PALETTE = ["#7a1f2b", "#1f3a6b", "#c99a3a", "#2d6a5b", "#5a2d7a", "#a0482a", "#2a4d8f"];
function SeriesArt({ color }: { color: string }) {
  const g = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    g.current.rotation.y += dt * 0.55;
  });
  const pages = useMemo(() => new THREE.MeshStandardMaterial({ color: "#efe5cc", roughness: 0.9 }), []);
  return (
    <group>
      <group ref={g}>
        {PALETTE.map((c, i) => {
          const a = (i / PALETTE.length) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(a) * 0.9, (i - 3) * 0.22, Math.sin(a) * 0.9]} rotation={[0, -a - Math.PI / 2, 0]}>
              <group rotation={[0.22, 0, 0.05 * (i % 3)]}>
                <mesh>
                  <boxGeometry args={[0.8, 0.17, 0.58]} />
                  <meshStandardMaterial color={c} roughness={0.5} metalness={0.25} />
                </mesh>
                <mesh position={[0.02, 0, 0.015]} material={pages}>
                  <boxGeometry args={[0.76, 0.12, 0.58]} />
                </mesh>
                <mesh position={[0, 0.0, -0.295]} material={goldMat}>
                  <boxGeometry args={[0.6, 0.03, 0.01]} />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>
      <mesh material={goldMat}>
        <cylinderGeometry args={[0.014, 0.014, 2.0, 8]} />
      </mesh>
      <mesh position={[0, -0.9, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[1.0, 0.012, 6, 64]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.9, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[1.0, 0.012, 6, 64]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ───────────── 03 Биографии: бюст + кольцо эпох ───────────── */
function BustArt({ color }: { color: string }) {
  const g = useRef<THREE.Group>(null!);
  const ring = useRef<THREE.Group>(null!);
  const rim = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        uniforms: { uColor: { value: new THREE.Color(color) } },
        vertexShader: `varying vec3 vN; varying vec3 vV;
          void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
        fragmentShader: `uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
          void main(){ float f = pow(1.0-abs(dot(normalize(vN),normalize(vV))), 3.0); gl_FragColor = vec4(uColor*1.1, f*0.4); }`,
      }),
    [color]
  );
  useFrame(({ clock }, dt) => {
    g.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.5;
    ring.current.rotation.y += dt * 0.5;
  });
  return (
    <group>
      <group ref={g} position={[0, -0.2, 0]} scale={1.35}>
        <mesh position={[0, 0.58, 0]} scale={[0.92, 1.1, 1]} material={statue}>
          <sphereGeometry args={[0.24, 40, 32]} />
        </mesh>
        <mesh position={[0, 0.53, 0.245]} rotation-x={Math.PI / 2} material={statue}>
          <coneGeometry args={[0.035, 0.1, 12]} />
        </mesh>
        <mesh position={[0, 0.36, 0]} material={statue}>
          <cylinderGeometry args={[0.1, 0.12, 0.22, 20]} />
        </mesh>
        <mesh position={[0, 0.2, 0]} scale={[1, 0.5, 0.58]} material={statue}>
          <sphereGeometry args={[0.46, 40, 24]} />
        </mesh>
        <mesh position={[0, -0.03, 0]} material={statue}>
          <cylinderGeometry args={[0.36, 0.3, 0.18, 32]} />
        </mesh>
        <mesh position={[0, 0.69, 0]} rotation={[Math.PI / 2 - 0.15, 0, 0]} material={goldMat}>
          <torusGeometry args={[0.235, 0.02, 10, 48]} />
        </mesh>
        {/* цветной контур, чтобы силуэт читался на фоне неба */}
        <mesh position={[0, 0.58, 0]} scale={[0.92, 1.1, 1]} material={rim}>
          <sphereGeometry args={[0.245, 32, 24]} />
        </mesh>
        <mesh position={[0, 0.2, 0]} scale={[1, 0.5, 0.58]} material={rim}>
          <sphereGeometry args={[0.465, 32, 24]} />
        </mesh>
        <mesh position={[0, 0.58, -0.05]} rotation-x={0}>
          <torusGeometry args={[0.42, 0.007, 6, 64]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
      <group ref={ring} position={[0, 0.2, 0]}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 1.1, Math.sin(a * 3) * 0.12, Math.sin(a) * 1.1]}>
              <sphereGeometry args={[i % 4 === 0 ? 0.045 : 0.026, 10, 10]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
          );
        })}
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[1.1, 0.006, 6, 96]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/* ───────────── 04 Карты: голографический глобус с маршрутами ───────────── */
function fib(n: number) {
  const pts: number[] = [];
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = ga * i;
    const x = Math.cos(th) * r, z = Math.sin(th) * r;
    const f =
      Math.sin(x * 3.1 + 1.2) * Math.sin(y * 2.7 + 0.3) +
      Math.sin(z * 3.6 + x * 1.7) * Math.cos(y * 3.3 + 0.4) * 0.8 +
      Math.sin(x * 7 + z * 5) * 0.18;
    if (f > 0.1) pts.push(x * 0.6, y * 0.6, z * 0.6);
  }
  return new Float32Array(pts);
}
const ll = (lat: number, lon: number, R = 0.6) => {
  const p = (lat * Math.PI) / 180, l = (lon * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(p) * Math.sin(l) * R, Math.sin(p) * R, Math.cos(p) * Math.cos(l) * R);
};

function GlobeArt({ color }: { color: string }) {
  const g = useRef<THREE.Group>(null!);
  const sat = useRef<THREE.Mesh>(null!);
  const points = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(fib(5200), 3));
    return geo;
  }, []);
  const routes = useMemo(
    () =>
      [
        [ll(31.7, 35.2), ll(41, 29), ll(41.9, 12.5)],
        [ll(31.7, 35.2), ll(30, 31.2), ll(36.2, 37.1)],
        [ll(41, 29), ll(37.9, 23.7), ll(32, 35)],
        [ll(31.7, 35.2), ll(52, 5), ll(46, 7)],
      ].map(([a, b, c]) => {
        const mid = a.clone().add(c).multiplyScalar(0.5).normalize().multiplyScalar(1.05);
        const curve = new THREE.CatmullRomCurve3([a, a.clone().lerp(mid, 0.5).normalize().multiplyScalar(0.78), b.clone().multiplyScalar(1.22), mid, c.clone().multiplyScalar(1.02)]);
        return { geo: new THREE.TubeGeometry(curve, 64, 0.006, 6), pins: [a, c] };
      }),
    []
  );
  const arcMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } },
        vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `uniform float uTime; uniform vec3 uColor; varying vec2 vUv;
          void main(){ float d = fract(vUv.x*6.-uTime*0.7); float a = smoothstep(0.0,.1,d)*smoothstep(.7,.3,d); gl_FragColor=vec4(uColor*2.2, .25+a*.9); }`,
      }),
    [color]
  );
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    g.current.rotation.y += dt * 0.28;
    arcMat.uniforms.uTime.value = t;
    sat.current.position.set(Math.cos(t * 0.9) * 1.05, Math.sin(t * 0.9) * 0.35, Math.sin(t * 0.9) * 1.05);
  });
  return (
    <group scale={1.35}>
      <group rotation-z={0.41}>
        <group ref={g}>
          <mesh>
            <sphereGeometry args={[0.575, 48, 32]} />
            <meshStandardMaterial color="#04101f" emissive="#0b3a5c" emissiveIntensity={0.35} roughness={0.55} metalness={0.1} transparent opacity={0.97} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.6, 24, 16]} />
            <meshBasicMaterial color={color} wireframe transparent opacity={0.16} toneMapped={false} />
          </mesh>
          <points geometry={points}>
            <pointsMaterial color={color} size={0.017} sizeAttenuation transparent opacity={0.95} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
          </points>
          {routes.map((r, i) => (
            <group key={i}>
              <mesh geometry={r.geo} material={arcMat} />
              {r.pins.map((p, j) => (
                <mesh key={j} position={p}>
                  <sphereGeometry args={[0.022, 10, 10]} />
                  <meshBasicMaterial color="#fff2c8" toneMapped={false} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
        <mesh scale={1.14}>
          <sphereGeometry args={[0.6, 40, 24]} />
          <shaderMaterial
            transparent
            side={THREE.BackSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
            uniforms={{ uColor: { value: new THREE.Color(color) } }}
            vertexShader={`varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`}
            fragmentShader={`uniform vec3 uColor; varying vec3 vN; void main(){ float i=pow(max(0.62-dot(vN,vec3(0.,0.,1.)),0.),4.); gl_FragColor=vec4(uColor*1.7,1.)*i*0.95; }`}
          />
        </mesh>
      </group>
      <mesh rotation={[Math.PI / 2 + 0.3, 0, 0]}>
        <torusGeometry args={[1.05, 0.006, 6, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh ref={sat}>
        <octahedronGeometry args={[0.04]} />
        <meshBasicMaterial color="#fff2c8" toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ───────────── 05 Конфессии: скрижали ───────────── */
function tabletGeometry() {
  const w = 0.62, h = 0.9;
  const s = new THREE.Shape();
  s.moveTo(-w / 2, -h / 2);
  s.lineTo(w / 2, -h / 2);
  s.lineTo(w / 2, h / 2 - w / 2);
  s.absarc(0, h / 2 - w / 2, w / 2, 0, Math.PI, false);
  s.lineTo(-w / 2, -h / 2);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.09, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2, curveSegments: 20 });
  const p = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, (p.getY(i) + h / 2) / h);
  g.translate(0, 0, -0.045);
  return g;
}

function CreedsArt({ color }: { color: string }) {
  const geo = useMemo(tabletGeometry, []);
  const a = useMemo(() => tabletTextures("I II III IV V"), []);
  const b = useMemo(() => tabletTextures("VI VII VIII IX X"), []);
  useEffect(() => {
    const owned = [a.map, a.emissive, b.map, b.emissive];
    owned.forEach((tex) => { tex.needsUpdate = true; });
    return () => owned.forEach((tex) => tex.dispose());
  }, [a, b]);
  const side = useMemo(() => new THREE.MeshStandardMaterial({ color: "#5b5e78", roughness: 0.7 }), []);
  const mk = (t: { map: THREE.Texture; emissive: THREE.Texture }) =>
    new THREE.MeshStandardMaterial({ map: t.map, emissiveMap: t.emissive, emissive: "#ffffff", emissiveIntensity: 1.6, roughness: 0.6, metalness: 0.1 });
  const mats = useMemo(() => [[mk(a), side], [mk(b), side]], [a, b, side]);
  const g = useRef<THREE.Group>(null!);
  const halo = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    g.current.rotation.y = Math.sin(t * 0.5) * 0.35;
    halo.current.rotation.z += dt * 0.3;
  });
  return (
    <group>
      <group ref={g} scale={1.3}>
        <mesh geometry={geo} material={mats[0]} position={[-0.36, 0, 0]} rotation={[0, 0.16, 0.04]} />
        <mesh geometry={geo} material={mats[1]} position={[0.36, 0, 0]} rotation={[0, -0.16, -0.04]} />
      </group>
      <mesh ref={halo} position={[0, 0, -0.5]}>
        <torusGeometry args={[1.05, 0.012, 8, 100]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.5]} rotation-z={0.5}>
        <torusGeometry args={[0.9, 0.006, 8, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <group position={[0, -0.7, 0]}>
        <Beam height={1.6} r0={0.8} r1={0.1} color={color} opacity={0.22} />
      </group>
    </group>
  );
}

const ART: Record<string, (p: { color: string }) => ReactNode> = {
  articles: BookArt,
  series: SeriesArt,
  bio: BustArt,
  maps: GlobeArt,
  creeds: CreedsArt,
};

export function Stations() {
  const sections = ITEMS.filter((i) => i.kind === "section");
  return (
    <group>
      {sections.map((it) => {
        const Art = ART[it.id];
        return (
          <Station key={it.id} item={it}>
            <Art color={it.color} />
          </Station>
        );
      })}
    </group>
  );
}
