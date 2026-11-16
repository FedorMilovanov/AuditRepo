/**
 * Nile Prelude W7B: real, self-contained Three.js diorama, not a playable
 * archaeological location. The basket STAYS among reeds beside the bank.
 * Same Three.js renderer package as the Horeb engine, with its own short-lived
 * canvas; no map coordinates, Research exhibit, or checkpoint mutations.
 */
import * as THREE from 'three';

export function createNilePrelude(canvas: HTMLCanvasElement, reducedMotion: boolean) {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: false, powerPreference: 'low-power',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.28;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa6adb0);
  scene.fog = new THREE.FogExp2(0xc6b7a0, 0.017);
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 110);
  // Shoot FROM the river side: neither reeds nor the bank obscure the chest.
  camera.position.set(-3.2, 2.4, 5.0);
  camera.lookAt(0.42, 0.25, -2.15);
  const skyGeo=new THREE.SphereGeometry(80,32,18);
  const skyPosition=skyGeo.getAttribute('position');
  const skyColors:number[]=[];
  const dawn=new THREE.Color(0xe6b98d),blue=new THREE.Color(0x91a9b5),
    lower=new THREE.Color(0x999f95);
  for(let i=0;i<skyPosition.count;i++){
    const y=skyPosition.getY(i)/80;
    const color=dawn.clone();
    if(y>0)color.lerp(blue,Math.min(1,y/0.7));
    else color.lerp(lower,Math.min(1,-y/0.6));
    skyColors.push(color.r,color.g,color.b);
  }
  skyGeo.setAttribute('color',new THREE.Float32BufferAttribute(skyColors,3));
  const sky=new THREE.Mesh(skyGeo,new THREE.MeshBasicMaterial({
    vertexColors:true,side:THREE.BackSide,depthWrite:false,fog:false,
  }));
  sky.name='nile-sunrise-sky';
  scene.add(sky);
  const hemi = new THREE.HemisphereLight(0xf7e4d4, 0x4a3c2b, 2.45);
  const sun = new THREE.DirectionalLight(0xffd6a5, 2.9);
  sun.position.set(-8, 12, -18);
  scene.add(hemi, sun);
  const material = (color: number, roughness = 0.9) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, side: THREE.DoubleSide });
  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x456c70, roughness: 0.68, metalness: 0, side: THREE.DoubleSide,
  });
  // River is a physically flat, shallow basin: no moving cradle or drift.
  const river = new THREE.Mesh(new THREE.PlaneGeometry(23, 42, 28, 36), waterMaterial);
  river.rotation.x = -Math.PI / 2;
  river.position.set(-4.8, -0.13, -9);
  river.name = 'nile-shallow-water';
  scene.add(river);
  const shoreGeo = new THREE.PlaneGeometry(11, 43, 24, 62);
  shoreGeo.rotateX(-Math.PI / 2);
  const p = shoreGeo.getAttribute('position');
  for(let i=0;i<p.count;i++){
    const x=p.getX(i), z=p.getZ(i);
    const edge = Math.sin(z * 0.34) * 0.17 + Math.sin(z * 0.13) * 0.22;
    const d=x+3.2+edge;
    p.setY(i, -0.14 + 0.12 * Math.max(0, d) + 0.016*Math.sin(x*1.8+z*.7));
  }
  shoreGeo.computeVertexNormals();
  const shore = new THREE.Mesh(shoreGeo, material(0xb7a079));
  shore.position.set(7.4, 0, -8);
  shore.name='nile-natural-bank';
  scene.add(shore);
  // Low-poly distant haze, no named palace or fabricated precise site.
  const farBank = new THREE.Mesh(new THREE.PlaneGeometry(14, 42), material(0x6f7f56));
  farBank.rotation.x=-Math.PI/2;
  farBank.position.set(-15, -0.04, -10);
  scene.add(farBank);
  // Wicker/papyrus chest: stationary, just inside the riverside growth.
  const basket = new THREE.Group();
  basket.name='moses-papyrus-cradle';
  const weave=material(0x896136);
  const darkWeave=material(0x5d3d26);
  const bowlGeo = new THREE.SphereGeometry(1, 28, 12, 0, Math.PI * 2, Math.PI/2, Math.PI/2);
  const bowl = new THREE.Mesh(bowlGeo, weave);
  bowl.scale.set(0.82, 0.36, 0.48);
  bowl.position.y=0.24;
  basket.add(bowl);
  for(const [r,y] of [[0.95,0.11],[0.88,-0.02],[0.75,-0.14]]){
    const band = new THREE.Mesh(new THREE.TorusGeometry(r, 0.019, 4, 44),darkWeave);
    band.rotation.x=Math.PI/2;
    band.scale.set(0.82,0.48,1);
    band.position.y=y+0.24;
    basket.add(band);
  }
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.052, 5, 40), weave);
  rim.rotation.x=Math.PI/2;
  rim.scale.set(0.82,0.48,1);
  rim.position.y=0.24;
  basket.add(rim);
  // A cloth-wrapped silhouette, no invented face/identity or depiction of
  // specific human anatomy. The baby is deliberately not animated.
  const cloth = new THREE.Mesh(new THREE.SphereGeometry(1,16,10), material(0xd2bda0));
  cloth.scale.set(0.46,0.19,0.27);
  cloth.position.set(0,0.16,0);
  basket.add(cloth);
  const foldedCloth = new THREE.Mesh(new THREE.SphereGeometry(1,14,8),material(0xeee0c5));
  foldedCloth.scale.set(0.19,0.13,0.22);
  foldedCloth.position.set(0.28,0.18,-0.03);
  basket.add(foldedCloth);
  basket.position.set(0.14,0.02,-2.1);
  basket.rotation.y=-0.25;
  basket.scale.setScalar(1.24);
  scene.add(basket);
  // Instanced papyrus stems and umbels, deterministic placement. Avoid
  // clustering over the cradle so the first shot has a readable focal point.
  const stems=104, fronds=6;
  const stemMat=material(0x61774c), headMat=material(0x9ba66a,0.95);
  const shaft=new THREE.InstancedMesh(new THREE.CylinderGeometry(.023,.038,1,5),stemMat,stems);
  const petals=new THREE.InstancedMesh(new THREE.ConeGeometry(.048,.75,3),headMat,stems*fronds);
  shaft.name='nile-papyrus-stems';
  petals.name='nile-papyrus-umbels';
  const dummy=new THREE.Object3D();
  for(let i=0;i<stems;i++){
    const z=-11+(i%52)*.29+Math.sin(i*1.41)*.29;
    const onBank=i<88;
    const x=onBank?1.9+1.2*Math.sin(i*3.13)*.5: -8.8+.35*Math.sin(i*2.87);
    const height=1.25+(1+Math.sin(i*3.7))*.72;
    const sway=Math.sin(i*2.7)*.13;
    dummy.position.set(x,.08+height/2,z);
    dummy.rotation.set(0,0,sway);
    dummy.scale.set(1,height,1);
    dummy.updateMatrix();
    shaft.setMatrixAt(i,dummy.matrix);
    for(let k=0;k<fronds;k++){
      const angle=(k/fronds)*Math.PI*2+i*.11;
      dummy.position.set(x+Math.cos(angle)*.19,.12+height-.18,z+Math.sin(angle)*.19);
      dummy.rotation.set(Math.sin(angle)*.86,angle,-Math.cos(angle)*.86);
      dummy.scale.set(1,1,1);
      dummy.updateMatrix();
      petals.setMatrixAt(i*fronds+k,dummy.matrix);
    }
  }
  shaft.instanceMatrix.needsUpdate=true;
  petals.instanceMatrix.needsUpdate=true;
  scene.add(shaft,petals);
  // A few gold dawn streaks on the physical water surface.
  const shimmerMat=new THREE.MeshBasicMaterial({color:0xffd2a0,transparent:true,opacity:.22,depthWrite:false});
  const strips=new THREE.Group();
  for(let i=0;i<18;i++){
    const line=new THREE.Mesh(new THREE.PlaneGeometry(.28+(i%4)*.13,.015),shimmerMat);
    line.rotation.x=-Math.PI/2;
    line.position.set(-3.9+Math.sin(i*2.8)*1.6,-.117,-9+(i%9)*1.3);
    strips.add(line);
  }
  scene.add(strips);
  let frame=0, disposed=false, visible=true, last=0;
  const resize=()=>{
    const width=Math.max(1,canvas.clientWidth),height=Math.max(1,canvas.clientHeight);
    renderer.setSize(width,height,false);
    camera.aspect=width/height;
    camera.updateProjectionMatrix();
  };
  const observer=typeof IntersectionObserver!=='undefined'
    ? new IntersectionObserver(e=>{visible=e[0]?.isIntersecting??true;},{threshold:.01}):null;
  observer?.observe(canvas);
  const resizer=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):null;
  resizer?.observe(canvas);
  window.addEventListener('resize',resize);
  resize();
  canvas.dataset.nileReady='true';
  const animate=(now:number)=>{
    if(disposed)return;
    frame=requestAnimationFrame(animate);
    if(!visible||now-last<33)return;
    last=now;
    if(!reducedMotion) {
      camera.position.x=-3.2+Math.sin(now*.00012)*.08;
      camera.lookAt(.42,.25,-2.15);
      strips.position.z=Math.sin(now*.00065)*.04;
    }
    renderer.render(scene,camera);
    canvas.dataset.nileRendered='true';
  };
  frame=requestAnimationFrame(animate);
  return ()=>{
    disposed=true;
    cancelAnimationFrame(frame);
    observer?.disconnect();resizer?.disconnect();
    window.removeEventListener('resize',resize);
    scene.traverse(o=>{
      if(o instanceof THREE.Mesh){
        o.geometry.dispose();
        const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.forEach(m=>m.dispose());
      }
    });
    renderer.dispose();
    renderer.forceContextLoss();
    delete canvas.dataset.nileReady;
  };
}
