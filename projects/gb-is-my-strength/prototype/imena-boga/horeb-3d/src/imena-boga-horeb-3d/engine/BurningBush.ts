import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { rng, glowTexture } from './procedural';
import { BUSH } from './nav';

// Небольшой настоящий куст (≈1.4 м), объятый пламенем, ветви которого НЕ меняются — не сгорают.
export function buildBurningBush(low: boolean) {
  const group = new THREE.Group();
  group.position.set(BUSH.x, 0, BUSH.z);
  const r = rng(1931);
  const parts: THREE.BufferGeometry[] = [];
  const spawn: THREE.Vector3[] = [];
  // Live branch tips remain part of the shrub, not fuel consumed by fire.
  const tips: THREE.Vector3[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const branch = (start: THREE.Vector3, dir: THREE.Vector3, len: number, rad: number, depth: number) => {
    const end = start.clone().addScaledVector(dir, len);
    const g = new THREE.CylinderGeometry(rad * 0.62, rad, len, 5, 1);
    g.translate(0, len / 2, 0);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, dir));
    g.translate(start.x, start.y, start.z);
    parts.push(g);
    for (let i = 1; i <= 3; i++) spawn.push(start.clone().lerp(end, i / 3));
    if (depth <= 0) { spawn.push(end.clone(), end.clone()); tips.push(end.clone()); return; }
    const kids = depth > 2 ? 3 : 2 + (r() < 0.5 ? 1 : 0);
    for (let k = 0; k < kids; k++) {
      const d = dir.clone().add(new THREE.Vector3((r() - 0.5) * 1.3, 0.35 + r() * 0.3, (r() - 0.5) * 1.3)).normalize();
      branch(end, d, len * (0.6 + r() * 0.2), rad * 0.62, depth - 1);
    }
  };
  for (let s = 0; s < 4; s++) {
    const a = (s / 4) * Math.PI * 2 + r();
    branch(new THREE.Vector3(Math.cos(a) * 0.08, 0, Math.sin(a) * 0.08), new THREE.Vector3(Math.cos(a) * 0.35, 1, Math.sin(a) * 0.35).normalize(), 0.42, 0.045, 4);
  }
  const wood = new THREE.MeshStandardMaterial({ color: 0x2b211a, roughness: 0.9, emissive: new THREE.Color(0x3a1404), emissiveIntensity: 0.4 });
  const branches = new THREE.Mesh(mergeGeometries(parts), wood);
  group.add(branches);

  // A non-species-specific, leaf-bearing shrub silhouette. Static dark olive
  // foliage stays intact while only the flame shader animates (Exodus 3:2).
  // Instancing adds ONE draw call instead of one mesh per small leaf.
  const leavesPerTip = low ? 1 : 2;
  const leafGeometry = new THREE.SphereGeometry(1, 5, 3);
  const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x686044, roughness: 1, side: THREE.DoubleSide,
    emissive: 0x251708, emissiveIntensity: 0.12,
  });
  const foliage = new THREE.InstancedMesh(leafGeometry, leafMaterial, tips.length * leavesPerTip);
  foliage.name = 'bush-foliage';
  const leafTransform = new THREE.Object3D();
  const leafColor = new THREE.Color();
  for (let i = 0; i < foliage.count; i++) {
    const tip = tips[Math.floor(i / leavesPerTip)];
    leafTransform.position.set(tip.x + (r() - 0.5) * 0.09,
      tip.y + (r() - 0.5) * 0.07, tip.z + (r() - 0.5) * 0.09);
    leafTransform.rotation.set(r() * Math.PI, r() * Math.PI * 2, r() * Math.PI);
    leafTransform.scale.set(0.032 + r() * 0.025, 0.072 + r() * 0.052, 0.012 + r() * 0.008);
    leafTransform.updateMatrix();
    foliage.setMatrixAt(i, leafTransform.matrix);
    leafColor.setHex(i % 3 === 0 ? 0x6b6644 : 0x4c5238);
    foliage.setColorAt(i, leafColor);
  }
  foliage.instanceMatrix.needsUpdate = true;
  foliage.instanceColor!.needsUpdate = true;
  group.add(foliage);

  // каменистый бугорок
  const moundGeo = new THREE.SphereGeometry(1.1, 24, 9, 0, Math.PI * 2, 0, Math.PI / 2);
  const mp = moundGeo.attributes.position;
  for (let i = 0; i < mp.count; i++) {
    const x = mp.getX(i), z = mp.getZ(i);
    const angle = Math.atan2(z, x);
    const variation = 1 + 0.09 * Math.sin(angle * 3 + 0.6) + 0.05 * Math.sin(angle * 7 - 0.7);
    mp.setXYZ(i, x * variation, mp.getY(i), z * variation);
  }
  moundGeo.computeVertexNormals();
  // Keep the base close to the stems: it must read as natural soil,
  // not as a wide illuminated ceremonial pedestal around the bush.
  const mound = new THREE.Mesh(moundGeo, new THREE.MeshStandardMaterial({ color: 0x3e332a, roughness: 1 }));
  mound.name = 'bush-soil-base';
  mound.scale.set(0.72, 0.09, 0.78); group.add(mound);

  // Пламя
  const N = low ? 380 : 1100;
  const geo = new THREE.BufferGeometry();
  const base = new Float32Array(N * 3), seed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const p = spawn[Math.floor(r() * spawn.length)];
    base[i * 3] = p.x + (r() - 0.5) * 0.08; base[i * 3 + 1] = p.y; base[i * 3 + 2] = p.z + (r() - 0.5) * 0.08;
    seed[i] = r();
  }
  geo.setAttribute('position', new THREE.BufferAttribute(base, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const fireMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uT: { value: 0 }, uScale: { value: 300 }, uSpeed: { value: 1 } },
    vertexShader: `attribute float aSeed; uniform float uT; uniform float uScale; uniform float uSpeed; varying float vL; varying float vS;
      void main(){ float life = fract(uT*uSpeed*(0.9+aSeed*0.8) + aSeed*17.0); vL = life; vS = aSeed;
        vec3 p = position;
        p.y += life*(0.28 + aSeed*0.3);
        p.x += sin(uT*3.0 + aSeed*40.0)*0.05*life; p.z += cos(uT*2.6 + aSeed*31.0)*0.05*life;
        vec4 mv = modelViewMatrix*vec4(p,1.0);
        gl_PointSize = (1.0-life)*(0.11+aSeed*0.08)*uScale / -mv.z;
        gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `varying float vL; varying float vS;
      void main(){ vec2 c = gl_PointCoord-0.5; float d = length(c); if(d>0.5) discard;
        float a = smoothstep(0.5,0.0,d) * (1.0 - vL) * smoothstep(0.0,0.08,vL);
        vec3 hot = vec3(1.0,0.93,0.7); vec3 mid = vec3(1.0,0.55,0.15); vec3 cool = vec3(0.7,0.15,0.03);
        vec3 col = mix(hot, mid, smoothstep(0.0,0.4,vL)); col = mix(col, cool, smoothstep(0.4,1.0,vL));
        gl_FragColor = vec4(col*a*0.55, 1.0); }`,
  });
  const fire = new THREE.Points(geo, fireMat);
  fire.frustumCulled = false;
  group.add(fire);

  // Редкие искры
  const SN = low ? 30 : 80;
  const sg = new THREE.BufferGeometry();
  const sb = new Float32Array(SN * 3), ss = new Float32Array(SN);
  for (let i = 0; i < SN; i++) { const p = spawn[Math.floor(r() * spawn.length)]; sb.set([p.x, p.y, p.z], i * 3); ss[i] = r(); }
  sg.setAttribute('position', new THREE.BufferAttribute(sb, 3));
  sg.setAttribute('aSeed', new THREE.BufferAttribute(ss, 1));
  const sparkMat = fireMat.clone();
  sparkMat.vertexShader = fireMat.vertexShader.replace('p.y += life*(0.28 + aSeed*0.3);', 'p.y += life*(1.4 + aSeed*1.6); p.x += sin(aSeed*90.0)*life*0.5;').replace('(0.11+aSeed*0.08)', '0.025');
  sparkMat.uniforms = { uT: { value: 0 }, uScale: { value: 300 }, uSpeed: { value: 0.25 } };
  const sparks = new THREE.Points(sg, sparkMat);
  sparks.frustumCulled = false;
  group.add(sparks);

  // Свет пламени и отсвет на земле
  const light = new THREE.PointLight(0xff8a3a, 30, 70, 1.4);
  light.position.set(0, 0.9, 0); group.add(light);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: glowTexture('rgba(255,140,60,0.32)', 'rgba(255,80,20,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.rotation.x = -Math.PI / 2; glow.position.y = 0.03; group.add(glow);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(255,170,90,0.35)', 'rgba(255,90,20,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.position.y = 0.8; halo.scale.set(3.4, 3.4, 1); group.add(halo);

  return {
    group, fire, sparks, foliage,
    update(t: number, motion: boolean, pixelH: number) {
      const sp = motion ? 1 : 0.35;
      fireMat.uniforms.uT.value = t; fireMat.uniforms.uSpeed.value = sp; fireMat.uniforms.uScale.value = pixelH * 0.5;
      sparkMat.uniforms.uT.value = t; sparkMat.uniforms.uSpeed.value = 0.25 * sp; sparkMat.uniforms.uScale.value = pixelH * 0.5;
      const f = motion ? 0.82 + 0.1 * Math.sin(t * 13.1) + 0.08 * Math.sin(t * 7.7 + 1) : 0.9;
      light.intensity = 30 * f;
      wood.emissiveIntensity = 0.3 + 0.25 * f; // отблеск на ветвях; форма и цвет древесины неизменны
    },
  };
}
