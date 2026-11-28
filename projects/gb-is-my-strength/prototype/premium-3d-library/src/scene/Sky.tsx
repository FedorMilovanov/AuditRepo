import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useApp } from "../store";

const NOISE = /* glsl */ `
float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y);
}
float fbm(vec2 p){
  float v=0., a=.5;
  for(int i=0;i<OCT;i++){ v+=a*noise(p); p=p*2.03+17.; a*=.5; }
  return v;
}
`;

/** Закатное небо: градиент, солнце за горами, северное сияние */
export function SkyDome() {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  useFrame(({ clock }) => {
    mat.current.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <sphereGeometry args={[700, 48, 32]} />
      <shaderMaterial
        ref={mat}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        defines={{ OCT: 4 }}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={/* glsl */ `
          varying vec3 vDir;
          void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime; varying vec3 vDir;
          ${NOISE}
          void main(){
            vec3 d = normalize(vDir);
            float h = d.y;
            vec3 sunDir = normalize(vec3(0.0,0.075,-1.0));
            float sd = max(dot(d,sunDir),0.);
            vec3 zenith = vec3(0.010,0.016,0.06);
            vec3 mid = vec3(0.075,0.05,0.21);
            vec3 horizon = vec3(0.92,0.42,0.30);
            vec3 col = mix(horizon, mid, smoothstep(0.0,0.30,h));
            col = mix(col, zenith, smoothstep(0.16,0.85,h));
            col = mix(col, vec3(0.10,0.07,0.17), smoothstep(0.0,-0.3,h));
            col += vec3(1.0,0.5,0.22)*pow(sd,5.)*0.6;
            col += vec3(1.0,0.74,0.42)*pow(sd,60.)*1.3;
            col += vec3(1.0,0.95,0.85)*smoothstep(0.99935,0.9998,sd)*7.;
            vec3 moonDir = normalize(vec3(-0.62,0.55,0.42));
            float md = dot(d, moonDir);
            col += vec3(0.72,0.82,1.0)*smoothstep(0.9986,0.99955,md)*2.4;
            col += vec3(0.4,0.52,0.9)*pow(max(md,0.),24.)*0.16;
            col += vec3(0.28,0.10,0.2)*exp(-abs(h)*12.)*0.5;
            // северное сияние
            vec2 ap = d.xz/(abs(h)+0.28);
            float band = fbm(vec2(ap.x*0.8+uTime*0.015, ap.y*0.45 + sin(ap.x*.7+uTime*.05)*.4));
            float au = smoothstep(0.46,0.82,band)*smoothstep(0.12,0.36,h)*smoothstep(0.9,0.5,h);
            vec3 ac = mix(vec3(0.12,1.0,0.62), vec3(0.55,0.3,1.0), fbm(ap*1.2+3.+uTime*0.02));
            col += ac*au*0.24;
            gl_FragColor = vec4(col,1.);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `}
      />
    </mesh>
  );
}

export function Stars({ count = 2600 }: { count?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const y = 0.03 + Math.pow(u, 0.8) * 0.97;
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - y * y);
      pos.set([Math.cos(a) * r * 620, y * 620, Math.sin(a) * r * 620], i * 3);
      sz[i] = 1 + Math.pow(Math.random(), 6) * 4;
      ph[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sz, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(ph, 1));
    return g;
  }, [count]);
  useFrame(({ clock }) => {
    mat.current.uniforms.uTime.value = clock.elapsedTime;
    mat.current.uniforms.uPx.value = Math.min(dpr, 2) * Math.max(size.height / 900, 0.7);
  });
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        fog={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 }, uPx: { value: 1 } }}
        vertexShader={/* glsl */ `
          attribute float aSize; attribute float aPhase; uniform float uTime; uniform float uPx;
          varying float vA;
          void main(){
            vec4 mv = modelViewMatrix*vec4(position,1.);
            gl_Position = projectionMatrix*mv;
            float tw = 0.65+0.35*sin(uTime*(0.8+aPhase*2.)+aPhase*40.);
            gl_PointSize = aSize*uPx*tw*1.6;
            vA = tw*smoothstep(0.04,0.35,normalize(position).y);
          }
        `}
        fragmentShader={/* glsl */ `
          varying float vA;
          void main(){
            float d = length(gl_PointCoord-.5);
            float a = smoothstep(.5,.0,d);
            gl_FragColor = vec4(vec3(0.8,0.88,1.0)*1.2, a*a*vA);
          }
        `}
      />
    </points>
  );
}

function ridgeGeometry(R: number, base: number, amp: number, seed: number, segs = 360) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const waves = Array.from({ length: 9 }, (_, i) => ({
    n: 2 + Math.floor(rnd() * 5) + i * 3,
    p: rnd() * 6.283,
    a: Math.pow(0.72, i) * (0.6 + rnd() * 0.6),
  }));
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= segs; i++) {
    const t = (i / segs) * Math.PI * 2;
    let h = 0;
    waves.forEach((w) => (h += (1 - Math.abs(Math.sin(w.n * t * 0.5 + w.p))) * w.a));
    h = Math.pow(h / 2.2, 1.35);
    const y = base + h * amp;
    const x = Math.sin(t) * R;
    const z = Math.cos(t) * R;
    pos.push(x, -60, z, x, y, z);
    if (i < segs) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  return g;
}

const MOUNTAIN_LAYERS = [
  { R: 330, base: -4, amp: 105, seed: 11, color: "#4a3170", fog: 0.72 },
  { R: 245, base: -8, amp: 80, seed: 29, color: "#2d2159", fog: 0.5 },
  { R: 170, base: -10, amp: 58, seed: 47, color: "#17153a", fog: 0.3 },
];

export function Mountains() {
  const layers = useMemo(
    () => MOUNTAIN_LAYERS.map((l) => ({ ...l, geo: ridgeGeometry(l.R, l.base, l.amp, l.seed) })),
    []
  );
  return (
    <group>
      {layers.map((l, i) => (
        <mesh key={i} geometry={l.geo} frustumCulled={false} renderOrder={-5 + i}>
          <shaderMaterial
            side={THREE.DoubleSide}
            fog={false}
            uniforms={{ uColor: { value: new THREE.Color(l.color) }, uFog: { value: l.fog } }}
            vertexShader={/* glsl */ `
              varying vec3 vP;
              void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }
            `}
            fragmentShader={/* glsl */ `
              uniform vec3 uColor; uniform float uFog; varying vec3 vP;
              void main(){
                vec2 dxz = normalize(vP.xz);
                float sun = pow(max(dot(dxz, vec2(0.,-1.)),0.),3.);
                vec3 haze = mix(vec3(0.17,0.10,0.30), vec3(0.95,0.46,0.30), sun);
                float hh = smoothstep(-8., 70., vP.y);
                vec3 col = mix(uColor, haze, uFog*(1.-hh*0.55));
                // снежные вершины, подсвеченные закатом
                float snow = smoothstep(40., 95., vP.y) * (0.25 + 0.75*sun);
                col += vec3(1.0,0.7,0.5)*snow*0.35;
                gl_FragColor = vec4(col,1.);
                #include <tonemapping_fragment>
                #include <colorspace_fragment>
              }
            `}
          />
        </mesh>
      ))}
    </group>
  );
}

export function CloudSea() {
  const q = useApp((s) => s.quality);
  const mats = useRef<THREE.ShaderMaterial[]>([]);
  useFrame(({ clock }) => {
    mats.current.forEach((m) => m && (m.uniforms.uTime.value = clock.elapsedTime));
  });
  const layers = q === "high" ? [{ y: -7, speed: 0.004, thr: 0.04, alpha: 0.75 }, { y: -14, speed: 0.0025, thr: -0.08, alpha: 1 }] : [{ y: -10, speed: 0.003, thr: -0.02, alpha: 0.95 }];
  return (
    <group key={q}>
      {layers.map((l, i) => (
        <mesh key={i} position={[0, l.y, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-2}>
          <planeGeometry args={[1100, 1100]} />
          <shaderMaterial
            ref={(m) => {
              if (m) mats.current[i] = m;
            }}
            transparent
            depthWrite={false}
            fog={false}
            defines={{ OCT: q === "high" ? 5 : 3 }}
            uniforms={{ uTime: { value: 0 }, uSpeed: { value: l.speed }, uThr: { value: l.thr }, uAlpha: { value: l.alpha } }}
            vertexShader={/* glsl */ `
              varying vec3 vW;
              void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }
            `}
            fragmentShader={/* glsl */ `
              uniform float uTime, uSpeed, uThr, uAlpha; varying vec3 vW;
              ${NOISE}
              void main(){
                vec2 p = vW.xz*0.011 + vec2(uTime*uSpeed*14., uTime*uSpeed*5.);
                float n = fbm(p);
                float n2 = fbm(p*2.6+7.+uTime*0.01);
                float c = smoothstep(0.36+uThr, 0.74, n*0.75+n2*0.4);
                float dist = length(vW.xz);
                float fade = 1.-smoothstep(300.,520.,dist);
                vec2 dxz = normalize(vW.xz+1e-4);
                float sun = pow(max(dot(dxz, vec2(0.,-1.)),0.),3.);
                vec3 shade = mix(vec3(0.09,0.08,0.22), vec3(0.42,0.30,0.52), n2);
                vec3 col = mix(shade, vec3(1.0,0.56,0.34), sun*0.85*(0.35+n));
                col += vec3(1.0,0.72,0.5)*sun*0.18;
                gl_FragColor = vec4(col, c*fade*uAlpha);
                #include <tonemapping_fragment>
                #include <colorspace_fragment>
              }
            `}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Светлячки / пылинки света */
export function Motes({
  count = 600,
  radius = 18,
  height = 11,
  size = 1,
  color = "#ffd58a",
  speed = 1,
}: {
  count?: number;
  radius?: number;
  height?: number;
  size?: number;
  color?: string;
  speed?: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const vh = useThree((s) => s.size.height);
  const dpr = useThree((s) => s.viewport.dpr);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const seed = new Float32Array(count * 4);
    for (let i = 0; i < count * 4; i++) seed[i] = Math.random();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4));
    return g;
  }, [count]);
  useFrame(({ clock }) => {
    mat.current.uniforms.uTime.value = clock.elapsedTime * speed;
    mat.current.uniforms.uScale.value = Math.min(dpr, 2) * (vh / 700) * size;
  });
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uScale: { value: 1 },
          uR: { value: radius },
          uH: { value: height },
          uColor: { value: new THREE.Color(color) },
        }}
        vertexShader={/* glsl */ `
          attribute vec4 aSeed; uniform float uTime, uScale, uR, uH; varying float vA;
          void main(){
            float t = uTime*(0.3+aSeed.w*0.5) + aSeed.y*6.283;
            float r = sqrt(aSeed.x)*uR;
            float ang = aSeed.y*6.283 + uTime*0.04*(aSeed.w-.5);
            vec3 p = vec3(cos(ang)*r + sin(t*0.9+aSeed.z*20.)*0.7,
                          mod(aSeed.z*uH + uTime*(0.12+aSeed.w*0.3), uH),
                          sin(ang)*r + cos(t*0.8+aSeed.x*30.)*0.7);
            vec4 mv = modelViewMatrix*vec4(p,1.);
            gl_Position = projectionMatrix*mv;
            gl_PointSize = (2.5+aSeed.x*4.)*uScale/max(-mv.z,0.5);
            vA = smoothstep(0.,1.2,p.y)*(1.-smoothstep(uH-2.5,uH,p.y))*(0.45+0.55*sin(uTime*1.7+aSeed.z*60.));
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uColor; varying float vA;
          void main(){
            float d = length(gl_PointCoord-.5);
            float a = smoothstep(.5,.0,d);
            gl_FragColor = vec4(uColor*1.6, a*a*vA);
          }
        `}
      />
    </points>
  );
}
