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
  const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 110);
  // Shoot FROM the river side: neither reeds nor the bank obscure the chest.
  camera.position.set(-1.8, 1.75, 1.15);
  camera.lookAt(0.55, 0.32, -2.3);
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
    color: 0xffffff, vertexColors: true, roughness: 0.5,
    metalness: 0.04, side: THREE.DoubleSide,
  });
  // Lightly animated surface, but the cradle never drifts or changes position.
  // The wet bank must physically join the same shoreline as the basket.
  const waterGeo = new THREE.PlaneGeometry(23, 42, 44, 58);
  waterGeo.rotateX(-Math.PI / 2);
  const waterPosition = waterGeo.getAttribute('position');
  const waterColors:number[]=[];
  const deep = new THREE.Color(0x426a75), shallow=new THREE.Color(0x82917a);
  for(let i=0;i<waterPosition.count;i++){
    const worldX=waterPosition.getX(i)-4.8;
    const waveTint=0.5+0.5*Math.sin(worldX*.8+waterPosition.getZ(i)*.45);
    const color=deep.clone().lerp(shallow,THREE.MathUtils.smoothstep(worldX,-2.0,1.2)*.65);
    color.multiplyScalar(.94+.07*waveTint);
    waterColors.push(color.r,color.g,color.b);
  }
  waterGeo.setAttribute('color',new THREE.Float32BufferAttribute(waterColors,3));
  const river = new THREE.Mesh(waterGeo,waterMaterial);
  river.position.set(-4.8, -0.13, -9);
  river.name = 'nile-shallow-water';
  scene.add(river);
  const shoreGeo = new THREE.PlaneGeometry(11, 43, 24, 62);
  shoreGeo.rotateX(-Math.PI / 2);
  const p = shoreGeo.getAttribute('position');
  const bankColors:number[]=[];
  const wetSand=new THREE.Color(0x777862),drySand=new THREE.Color(0xc4a881);
  for(let i=0;i<p.count;i++){
    const rawX=p.getX(i),z=p.getZ(i);
    const edge=Math.sin(z*.34)*.17+Math.sin(z*.13)*.22;
    // Start the bank at the actual waterline. Earlier the submerged part
    // flickered through the waves as large triangular sandy islands.
    const coastX=-3.2-edge;
    const x=coastX+((rawX+5.5)/11)*(5.5-coastX);
    p.setX(i,x);
    const d=x+3.2+edge;
    p.setY(i,-0.14+0.12*d+0.032*Math.sin(x*1.8+z*.7)*Math.min(1,d));
    const t=THREE.MathUtils.smoothstep(d,.1,3.8);
    const color=wetSand.clone().lerp(drySand,t);
    color.multiplyScalar(.92+.07*(.5+.5*Math.sin(x*2.2+z*1.37)));
    bankColors.push(color.r,color.g,color.b);
  }
  shoreGeo.setAttribute('color',new THREE.Float32BufferAttribute(bankColors,3));
  shoreGeo.computeVertexNormals();
  const shore = new THREE.Mesh(shoreGeo,
    new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide}));
  // Previously this was 7.4: the chest sat FOUR METERS out in the river.
  // x=4.45 places the gently sloped wet edge at world x~1.25.
  shore.position.set(4.45, 0, -8);
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
  // The older basket read as a smooth plastic bowl. Small woven strands and
  // elliptical hoops reveal a hand-woven structure without image textures.
  const fiber = material(0x5d4229);
  const fiberLight = material(0xb08b56);
  for(let row=0;row<8;row++){
    const depth=.07+row*.11;
    const radius=Math.sqrt(1-depth*depth);
    const hoop=new THREE.Mesh(new THREE.TorusGeometry(1,.009,3,56),
      row%2===0?fiber:fiberLight);
    hoop.rotation.x=Math.PI/2;
    hoop.scale.set(.82*radius,.48*radius,1);
    hoop.position.y=.24-.36*depth;
    basket.add(hoop);
  }
  for(let strand=0;strand<30;strand++){
    const angle=2*Math.PI*strand/30;
    const points:THREE.Vector3[]=[];
    for(let step=0;step<=9;step++){
      const depth=.01+step*.102;
      const radius=Math.sqrt(1-depth*depth);
      const twisted=angle+depth*(strand%2===0?.10:-.10);
      points.push(new THREE.Vector3(
        .82*radius*Math.cos(twisted),.24-.36*depth,
        .48*radius*Math.sin(twisted)));
    }
    const curve=new THREE.CatmullRomCurve3(points);
    basket.add(new THREE.Mesh(new THREE.TubeGeometry(curve,12,.008,3,false),
      strand%3===0?fiberLight:fiber));
  }
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
  basket.position.set(0.55,0.02,-2.1);
  basket.rotation.y=-0.25;
  basket.scale.setScalar(1.24);
  scene.add(basket);
  // Egyptian papyrus forms a fine many-rayed umbrella, not the large
  // cone spikes used in the first blockout. Each stem has 9 thin rays
  // ending in small ochre spikelets. Instances keep mobile GPU cost low.
  const stems=104, rays=9;
  const stemMat=material(0x61774c), headMat=material(0x8a9a60),
    spikeletMat=material(0xaa9f68);
  const shaft=new THREE.InstancedMesh(new THREE.CylinderGeometry(.018,.034,1,3),stemMat,stems);
  const spokes=new THREE.InstancedMesh(new THREE.CylinderGeometry(.005,.009,1,3),headMat,stems*rays);
  const spikelets=new THREE.InstancedMesh(new THREE.SphereGeometry(.033,5,4),spikeletMat,stems*rays);
  const crowns=new THREE.InstancedMesh(new THREE.SphereGeometry(.056,5,4),headMat,stems);
  shaft.name='nile-papyrus-stems';
  spokes.name='nile-papyrus-umbels';
  spikelets.name='nile-papyrus-spikelets';
  crowns.name='nile-papyrus-crowns';
  // Smooth, seeded distribution: never render a picket-fence row of reeds.
  const hash=(n:number)=>{const v=Math.sin(n*127.1)*43758.5453;return v-Math.floor(v);};
  const dummy=new THREE.Object3D();
  const up=new THREE.Vector3(0,1,0);
  const origin=new THREE.Vector3(), tip=new THREE.Vector3();
  for(let i=0;i<stems;i++){
    const z=-16+hash(i*2.17+5.1)*24;
    const onBank=i<91;
    let x=onBank?1.32+hash(i*1.91+1.35)*1.55:-6+hash(i*3.13+.75)*1.3;
    // A deliberate gap gives the basket its own focus among the plants.
    if(onBank && Math.abs(z+2.1)<1.7 && x<2.25)x=2.25+hash(i+7)*.35;
    const height=1.0+hash(i*4.31+1.1)*1.8;
    const sway=(hash(i*5.81)-.5)*.16;
    const baseY=.05;
    dummy.position.set(x,baseY+height/2,z);
    dummy.rotation.set(0,0,sway);
    dummy.scale.set(1,height,1);
    dummy.updateMatrix();
    shaft.setMatrixAt(i,dummy.matrix);
    origin.set(x-height*.5*Math.sin(sway),baseY+height,z);
    dummy.position.copy(origin);
    dummy.rotation.set(0,0,0);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    crowns.setMatrixAt(i,dummy.matrix);
    for(let k=0;k<rays;k++){
      const angle=2*Math.PI*k/rays+i*.24;
      const reach=.23+hash(i*13.7+k*3.7)*.25;
      tip.set(
        origin.x+Math.cos(angle)*reach,
        origin.y-.055-hash(i*11+k)*.09,
        origin.z+Math.sin(angle)*reach);
      const direction=tip.clone().sub(origin);
      dummy.position.copy(origin).add(tip).multiplyScalar(.5);
      dummy.quaternion.setFromUnitVectors(up,direction.clone().normalize());
      dummy.scale.set(1,direction.length(),1);
      dummy.updateMatrix();
      spokes.setMatrixAt(i*rays+k,dummy.matrix);
      dummy.position.copy(tip);
      dummy.quaternion.identity();
      dummy.scale.setScalar(.7+hash(i*11+k)*.8);
      dummy.updateMatrix();
      spikelets.setMatrixAt(i*rays+k,dummy.matrix);
    }
  }
  for(const mesh of [shaft,spokes,spikelets,crowns])mesh.instanceMatrix.needsUpdate=true;
  scene.add(shaft,spokes,spikelets,crowns);
  // Natural bank detail: small dry sedges and scattered eroded pebbles.
  // These are low-cost instances, not a uniform modern landscaped lawn.
  const bankHeight=(worldX:number,worldZ:number)=>{
    const x=worldX-4.45,z=worldZ+8;
    const edge=Math.sin(z*.34)*.17+Math.sin(z*.13)*.22;
    const d=x+3.2+edge;
    return -.14+.12*Math.max(0,d)+
      .032*Math.sin(x*1.8+z*.7)*Math.min(1,Math.max(0,d));
  };
  const tufts=73, blades=3;
  const sedge=new THREE.InstancedMesh(
    new THREE.ConeGeometry(.027,.46,3),material(0x7f8050),tufts*blades);
  sedge.name='nile-shore-sedges';
  for(let i=0;i<tufts;i++){
    const x=1.6+hash(i*2.93+31)*4.7;
    const z=-14+hash(i*7.17+81)*20;
    if(Math.hypot(x-.14,z+2.1)<1.35)continue;
    for(let k=0;k<blades;k++){
      const scale=.48+hash(i*11+k)*.95;
      const angle=k*Math.PI*2/blades+hash(i*5)*.6;
      const index=i*blades+k;
      dummy.position.set(x+Math.cos(angle)*.06,bankHeight(x,z)+scale*.23,z+Math.sin(angle)*.06);
      dummy.rotation.set(Math.sin(angle)*.23,angle,Math.cos(angle)*.23);
      dummy.scale.set(1,scale,1);
      dummy.updateMatrix();
      sedge.setMatrixAt(index,dummy.matrix);
    }
  }
  sedge.instanceMatrix.needsUpdate=true;
  scene.add(sedge);
  const pebbles=90;
  const pebblesMesh=new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1,0),material(0x968976),pebbles);
  pebblesMesh.name='nile-bank-pebbles';
  const stonePalette=[0x9c8b72,0x7f7d6c,0xbaa486,0x817b67];
  for(let i=0;i<pebbles;i++){
    const x=1.8+hash(i*3.72+22)*5.7,z=-16+hash(i*6.31+9)*23;
    const size=.025+hash(i*3.9)*.065;
    dummy.position.set(x,bankHeight(x,z)+size*.4,z);
    dummy.rotation.set(hash(i*7)*Math.PI,hash(i*8.3)*Math.PI,hash(i*11.9)*Math.PI);
    dummy.scale.set(size*(1+hash(i)*1.2),size*.48,size*(.9+hash(i+11)*.8));
    dummy.updateMatrix();
    pebblesMesh.setMatrixAt(i,dummy.matrix);
    pebblesMesh.setColorAt(i,new THREE.Color(stonePalette[i%stonePalette.length]));
  }
  pebblesMesh.instanceMatrix.needsUpdate=true;
  if(pebblesMesh.instanceColor)pebblesMesh.instanceColor.needsUpdate=true;
  scene.add(pebblesMesh);
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
  // Geometry witness for browser acceptance (derived from real meshes).
  canvas.dataset.nileShoreOffset=(shore.position.x-3.2-basket.position.x).toFixed(3);
  canvas.dataset.nilePapyrusCount=String(shaft.count);
  canvas.dataset.nileUmbelRays=String(spokes.count);
  canvas.dataset.nileReady='true';
  const animate=(now:number)=>{
    if(disposed)return;
    frame=requestAnimationFrame(animate);
    if(!visible||now-last<33)return;
    last=now;
    if(!reducedMotion) {
      camera.position.x=-1.8+Math.sin(now*.00012)*.055;
      camera.lookAt(.55,.32,-2.3);
      strips.position.z=Math.sin(now*.00065)*.04;
      // A few centimetres of surface movement, no swelling waves and
      // absolutely no motion on the baby's basket.
      for(let i=0;i<waterPosition.count;i++){
        const x=waterPosition.getX(i),z=waterPosition.getZ(i);
        waterPosition.setY(i,
          .014*Math.sin(x*1.4+z*.65+now*.0008)+
          .007*Math.sin(x*2.8-z*1.1-now*.0013));
      }
      waterPosition.needsUpdate=true;
      waterGeo.computeVertexNormals();
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
    delete canvas.dataset.nileRendered;
    delete canvas.dataset.nileShoreOffset;
    delete canvas.dataset.nilePapyrusCount;
    delete canvas.dataset.nileUmbelRays;
  };
}
