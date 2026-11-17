/**
 * Nile W10: self-contained Three.js shoreline with a bounded first-person
 * walk mode and optional original cinematic shots. Not an archaeologically
 * identified site. The basket STAYS among reeds beside the bank.
 * Same Three.js renderer package as the Horeb engine, with its own short-lived
 * canvas; no map coordinates, Research exhibit, or checkpoint mutations.
 */
import * as THREE from 'three';
import { NILE_CRADLE, NILE_WALK, nileCanWalk, nileGroundY, nilePapyrusRoot, nileShoreX, nileHash } from './NileTerrain';

export type NileMoment = 'basket' | 'discovery';
export type NileView = 'wide' | 'close';
export type NileDirection = 'forward' | 'backward' | 'left' | 'right';
export type NilePreludeControl = {
  dispose: () => void;
  setView: (view: NileView) => void;
  setExplore: (enabled: boolean) => void;
  setMovement: (direction: NileDirection, active: boolean) => void;
  rotateView: (dx: number, dy: number) => void;
};
export function createNilePrelude(canvas: HTMLCanvasElement, reducedMotion: boolean, moment: NileMoment = 'basket'): NilePreludeControl {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: false, powerPreference: 'low-power',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa6adb0);
  scene.fog = new THREE.FogExp2(0xc6b7a0, 0.017);
  const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 110);
  // Shoot FROM the river side: neither reeds nor the bank obscure the chest.
  const wideShot = moment === 'discovery'
    ? { x: -1.55, y: 2.15, z: 3.2, focusX: 1.85, focusY: .92, focusZ: -2.0 }
    : { x: -1.8, y: 1.75, z: 1.15, focusX: 0.55, focusY: 0.32, focusZ: -2.3 };
  // W8C second, closer cinematographic angle: the same real scene and
  // stationary cradle, never a new physical path or false location.
  const closeShot = { x: -.82, y: 1.82, z: 1.06, focusX: 1.44, focusY: .80, focusZ: -2.20 };
  camera.position.set(wideShot.x, wideShot.y, wideShot.z);
  camera.lookAt(wideShot.focusX,wideShot.focusY,wideShot.focusZ);
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
  const hemi = new THREE.HemisphereLight(0xf6e4cd, 0x4c5142, 1.95);
  const sun = new THREE.DirectionalLight(0xffdbb0, 2.25);
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
    const worldZ=z-8;
    // One coast curve and one height function serve the mesh AND collisions.
    // No independent hidden "wall" on the wet alluvial shore.
    const coastX=nileShoreX(worldZ)-4.45;
    const x=coastX+((rawX+5.5)/11)*(5.5-coastX);
    const worldX=x+4.45;
    p.setX(i,x);
    const d=worldX-nileShoreX(worldZ);
    p.setY(i,nileGroundY(worldX,worldZ));
    const t=THREE.MathUtils.smoothstep(d,.1,3.8);
    const color=wetSand.clone().lerp(drySand,t);
    // Layered sediment gradients are deterministic, never texture jitter.
    const mottling=.92+.07*(.5+.5*Math.sin(x*2.2+z*1.37))
      +.025*Math.sin(x*4.1-z*2.9)*Math.cos(x*1.9+z*1.4);
    color.multiplyScalar(mottling);
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
  // Far shore: sculpted alluvial surface rather than a flat green rectangle.
  // This is scenic context, NOT a geolocated Nile settlement or monument.
  const farGeo=new THREE.PlaneGeometry(19,43,26,68);
  farGeo.rotateX(-Math.PI/2);
  const fp=farGeo.getAttribute('position'),farColors:number[]=[];
  const farWet=new THREE.Color(0x6f795d),farDry=new THREE.Color(0x9b9276);
  for(let i=0;i<fp.count;i++){
    const fx=fp.getX(i),fz=fp.getZ(i);
    const inward=Math.max(0,-fx+9.5);
    fp.setY(i,-.08+.06*inward+
      .10*Math.sin(fz*.24+fx*.19)*THREE.MathUtils.smoothstep(inward,0,4));
    const c=farWet.clone().lerp(farDry,THREE.MathUtils.smoothstep(inward,1,12));
    c.multiplyScalar(.95+.045*Math.sin(fz*.9+fx*.7));
    farColors.push(c.r,c.g,c.b);
  }
  farGeo.setAttribute('color',new THREE.Float32BufferAttribute(farColors,3));
  farGeo.computeVertexNormals();
  const farBank=new THREE.Mesh(farGeo,
    new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide}));
  farBank.rotation.set(0,0,0);
  farBank.position.set(-25.1,0,-8);
  farBank.name='nile-far-bank-relief';
  scene.add(farBank);
  // Wicker/papyrus chest: stationary, just inside the riverside growth.
  const basket = new THREE.Group();
  basket.name='moses-papyrus-cradle';
  const weave=material(0x80613d);
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
  // Approximate readable scale only; Scripture gives no basket dimensions.
  // The base intersects the shallow water by a few centimetres, not mid-air.
  basket.position.set(NILE_CRADLE.x,-.03,NILE_CRADLE.z);
  basket.rotation.y=-0.25;
  basket.scale.setScalar(.88);
  scene.add(basket);
  // W10B: papyrus (Cyperus papyrus), informed by Met 30.4.60:
  // fine, drooping branched umbels and tiny ochre seed-bearing tips,
  // not cartoon spherical fruit on thick star-shaped plastic arms.
  // Original geometry, no third-party meshes or textures.
  const stems=104,rays=9,branchesPerRay=3;
  const stemMat=material(0x556e53),headMat=material(0x6e7950),
    spikeletMat=material(0x89784e);
  const shaft=new THREE.InstancedMesh(new THREE.CylinderGeometry(.012,.024,1,5),stemMat,stems);
  const spokes=new THREE.InstancedMesh(new THREE.CylinderGeometry(.003,.005,1,3),headMat,stems*rays);
  const spikelets=new THREE.InstancedMesh(new THREE.ConeGeometry(.011,.075,4),
    spikeletMat,stems*rays);
  const crowns=new THREE.InstancedMesh(new THREE.SphereGeometry(.023,6,4),headMat,stems);
  const fineBranches=new THREE.InstancedMesh(new THREE.CylinderGeometry(.0015,.0025,1,3),
    headMat,stems*rays*branchesPerRay);
  shaft.name='nile-papyrus-stems';
  spokes.name='nile-papyrus-umbels';
  spikelets.name='nile-papyrus-spikelets';
  crowns.name='nile-papyrus-crowns';
  fineBranches.name='nile-papyrus-fine-branches';
  const hash=nileHash;
  const dummy=new THREE.Object3D();
  const up=new THREE.Vector3(0,1,0);
  const origin=new THREE.Vector3(), tip=new THREE.Vector3();
  const sideStart=new THREE.Vector3(),sideTip=new THREE.Vector3();
  for(let i=0;i<stems;i++){
    const {x,z,height,sway}=nilePapyrusRoot(i,moment);
    const baseY=nileGroundY(x,z)-.045;
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
      const reach=.30+hash(i*13.7+k*3.7)*.34;
      tip.set(
        origin.x+Math.cos(angle)*reach,
        origin.y-.12-hash(i*11+k)*.15,
        origin.z+Math.sin(angle)*reach);
      const direction=tip.clone().sub(origin);
      dummy.position.copy(origin).add(tip).multiplyScalar(.5);
      dummy.quaternion.setFromUnitVectors(up,direction.clone().normalize());
      dummy.scale.set(1,direction.length(),1);
      dummy.updateMatrix();
      spokes.setMatrixAt(i*rays+k,dummy.matrix);
      dummy.position.copy(tip);
      dummy.position.y-=.038;
      dummy.quaternion.identity();
      dummy.scale.setScalar(.65+hash(i*11+k)*.55);
      dummy.updateMatrix();
      spikelets.setMatrixAt(i*rays+k,dummy.matrix);
      for(let j=0;j<branchesPerRay;j++){
        const offset=(j-1)*.30;
        sideStart.copy(origin).lerp(tip,.48+j*.16);
        sideTip.set(
          sideStart.x+Math.cos(angle+offset)*(.11+j*.035),
          sideStart.y-.085-hash(i*19+k*7+j)*.07,
          sideStart.z+Math.sin(angle+offset)*(.11+j*.035),
        );
        const vec=sideTip.clone().sub(sideStart);
        dummy.position.copy(sideStart).add(sideTip).multiplyScalar(.5);
        dummy.quaternion.setFromUnitVectors(up,vec.clone().normalize());
        dummy.scale.set(1,vec.length(),1);
        dummy.updateMatrix();
        fineBranches.setMatrixAt((i*rays+k)*branchesPerRay+j,dummy.matrix);
      }
    }
  }
  for(const mesh of [shaft,spokes,spikelets,crowns,fineBranches])
    mesh.instanceMatrix.needsUpdate=true;
  scene.add(shaft,spokes,spikelets,crowns,fineBranches);
  // Natural bank detail: small dry sedges and scattered eroded pebbles.
  // These are low-cost instances, not a uniform modern landscaped lawn.
  const bankHeight=nileGroundY;
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

  // W8A: the SAME river and basket, a second staged moment (Exod. 2:5–6).
  // Three anonymous, restrained figures: Pharaoh's unnamed daughter,
  // one maid approaching the reeds, and another attendant on the bank.
  // They are sculptural narrative silhouettes, NOT portraits, period-
  // identified costumes, or a reenactment of an identified historical site.
  const figures = new THREE.Group();
  figures.name = 'nile-discovery-figures';
  if (moment === 'discovery') {
    const skin = material(0xb68b70,.96);
    const darkHair = material(0x302d27);
    const linenPale = material(0xdde2d3);
    const linenOchre = material(0xb7a487);
    const linenBlue = material(0x7d9190);
    const collar = material(0xb29858,.65);
    // Warm reflected light near the cradle and a cooler edge light on
    // the garments create readable depth without a speculative palace.
    const riverBounce=new THREE.PointLight(0xffe6c4,1.0,10,2);
    riverBounce.position.set(-1.1,2.3,.2);
    const rim=new THREE.DirectionalLight(0xadc9d8,.52);
    rim.position.set(5,4,-5);
    scene.add(riverBounce,rim);

    const addLimb = (
      root: THREE.Group, start: THREE.Vector3, end: THREE.Vector3,
      radius: number, mat: THREE.Material,
    ) => {
      const delta=end.clone().sub(start);
      const limb=new THREE.Mesh(new THREE.CylinderGeometry(radius*.84,radius,delta.length(),7),mat);
      limb.position.copy(start).add(end).multiplyScalar(.5);
      limb.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
      root.add(limb);
    };

    function createFigure(
      name:string, x:number, z:number, height:number,
      garment:THREE.MeshStandardMaterial, gesture:'point'|'reach'|'rest',
      royal:boolean,
    ){
      const fig=new THREE.Group();
      fig.name=name;
      const body=new THREE.Group();
      body.name=gesture==='reach'?'reaching-attendant-pose':'upright-silhouette-pose';
      fig.add(body);
      // W8B: pleated linen sculpted as a smooth, subtly irregular cloth
      // surface instead of a sharp 14-sided mannequin cone. Fold color is
      // derived from the same local material, never an imported texture.
      const gownGeo=new THREE.CylinderGeometry(.23,.43,1.12,36,12);
      const gownPos=gownGeo.getAttribute('position');
      const gownColors:number[]=[];
      for(let k=0;k<gownPos.count;k++){
        const x=gownPos.getX(k), y=gownPos.getY(k), z=gownPos.getZ(k);
        const angle=Math.atan2(z,x);
        const fold=Math.sin(angle*12+.27)*.033+Math.cos(angle*7-.5)*.022;
        const flare=THREE.MathUtils.smoothstep(.5-y,.26,1.06);
        gownPos.setX(k,x*(1+fold*flare));
        gownPos.setZ(k,z*(1+fold*flare));
        const shade=1+fold*.85-.085*flare+.026*Math.sin(angle*6+y*3.4);
        const c=new THREE.Color(shade,shade*.993,shade*.974);
        gownColors.push(c.r,c.g,c.b);
      }
      gownGeo.setAttribute('color',new THREE.Float32BufferAttribute(gownColors,3));
      gownGeo.computeVertexNormals();
      const gownMat=new THREE.MeshStandardMaterial({
        color:garment.color.clone(),vertexColors:true,roughness:.96,
        side:THREE.DoubleSide,
      });
      const gown=new THREE.Mesh(gownGeo,gownMat);
      gown.name='linen-pleats';
      gown.position.y=.62;
      body.add(gown);
      const upper=new THREE.Mesh(new THREE.SphereGeometry(1,24,14),garment);
      upper.scale.set(.25,.31,.21);
      upper.position.y=1.28;
      body.add(upper);
      // A visible cross-fold at the waist joins fabric sections smoothly.
      const waistband=new THREE.Mesh(new THREE.TorusGeometry(.245,.024,5,28),garment);
      waistband.rotation.x=Math.PI/2;
      waistband.scale.set(1,.80,1);
      waistband.position.y=1.04;
      body.add(waistband);
      const neck=new THREE.Mesh(new THREE.CylinderGeometry(.095,.11,.18,8),skin);
      neck.position.y=1.59;
      body.add(neck);
      const head=new THREE.Mesh(new THREE.SphereGeometry(.205,14,10),skin);
      head.position.y=1.78;
      body.add(head);
      const hair=new THREE.Mesh(
        new THREE.SphereGeometry(.218,14,10,0,Math.PI*2,0,Math.PI*.59),
        darkHair);
      hair.position.set(0,1.82,-.012);
      body.add(hair);
      // Small hair locks flank the face without detailed facial features.
      for(const side of [-1,1]){
        const lock=new THREE.Mesh(new THREE.CylinderGeometry(.057,.078,.29,7),darkHair);
        lock.position.set(side*.18,1.63,-.045);
        body.add(lock);
      }
      // Two-segment arms and small hands convey deliberate, readable
      // gestures. The attendant bends toward the cradle rather than
      // pointing a stiff cylinder directly at the baby.
      const leftFrom=new THREE.Vector3(-.22,1.43,.02);
      const rightFrom=new THREE.Vector3(.22,1.43,.02);
      const leftElbow=gesture==='reach'
        ? new THREE.Vector3(-.35,1.04,.08)
        : gesture==='point'
          ? new THREE.Vector3(-.38,1.27,.12)
          : new THREE.Vector3(-.36,1.03,.01);
      const leftWrist=gesture==='reach'
        ? new THREE.Vector3(-.66,.80,.39)
        : gesture==='point'
          ? new THREE.Vector3(-.61,1.11,.24)
          : new THREE.Vector3(-.36,.93,.06);
      const rightElbow=new THREE.Vector3(.36,1.15,0);
      const rightWrist=new THREE.Vector3(.38,.93,.10);
      const sleeve=material(garment.color.getHex(),.95);
      for(const [shoulder,elbow,wrist] of [
        [leftFrom,leftElbow,leftWrist],[rightFrom,rightElbow,rightWrist],
      ]){
        addLimb(body,shoulder,elbow,.115,sleeve);
        addLimb(body,elbow,wrist,.061,skin);
        const hand=new THREE.Mesh(new THREE.SphereGeometry(.071,10,8),skin);
        hand.position.copy(wrist);
        hand.scale.set(.72,1.15,.48);
        body.add(hand);
      }
      // Exposed feet ground the silhouette on the uneven bank.
      for(const side of [-1,1]){
        const foot=new THREE.Mesh(new THREE.SphereGeometry(1,10,7),skin);
        foot.scale.set(.105,.048,.155);
        foot.position.set(side*.18,.075,.09);
        body.add(foot);
      }
      if(gesture==='reach'){
        body.rotation.z=.13;
        body.position.x=-.06;
      }
      if(royal){
        const necklace=new THREE.Mesh(new THREE.TorusGeometry(.20,.035,5,20),collar);
        necklace.position.set(0,1.47,.09);
        necklace.rotation.x=-.20;
        body.add(necklace);
        // A pleated shoulder wrap distinguishes the daughter from
        // attendants without using a fabricated dynasty, crown or emblem.
        const wrapGeo=new THREE.CylinderGeometry(.255,.35,.37,32,5,true);
        const wrapPos=wrapGeo.getAttribute('position');
        for(let i=0;i<wrapPos.count;i++){
          const x=wrapPos.getX(i),z=wrapPos.getZ(i);
          const angle=Math.atan2(z,x);
          const fold=1+.048*Math.cos(angle*9+.3);
          wrapPos.setX(i,x*fold);
          wrapPos.setZ(i,z*fold);
        }
        wrapGeo.computeVertexNormals();
        const wrap=new THREE.Mesh(wrapGeo,linenBlue);
        wrap.name='linen-shoulder-drape';
        wrap.position.y=1.34;
        body.add(wrap);
        const hairBand=new THREE.Mesh(new THREE.TorusGeometry(.208,.024,5,24),collar);
        hairBand.rotation.x=Math.PI/2;
        hairBand.position.y=1.87;
        body.add(hairBand);
      }
      // Soft contact shading keeps the staged figures on the sloping
      // shore. A simple translucent disk avoids costly mobile shadow maps.
      const contactShadow=new THREE.Mesh(
        new THREE.CircleGeometry(.42,20),
        new THREE.MeshBasicMaterial({
          color:0x27342f,transparent:true,opacity:.16,
          depthWrite:false,side:THREE.DoubleSide,
        }));
      contactShadow.name='shore-contact-shadow';
      contactShadow.rotation.x=-Math.PI/2;
      contactShadow.position.y=.023;
      fig.add(contactShadow);
      fig.position.set(x,bankHeight(x,z),z);
      fig.scale.setScalar(height/1.95);
      figures.add(fig);
    }
    createFigure('daughter-of-pharaoh-silhouette',3.05,-2.4,2.15,linenPale,'point',true);
    createFigure('attendant-fetching-basket',2.08,-1.9,1.83,linenOchre,'reach',false);
    createFigure('attendant-walking-bank',3.72,-1.1,1.87,linenBlue,'rest',false);
  }
  scene.add(figures);

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
  // One physical scene, two user-selectable camera compositions. Camera
  // interpolation never moves the basket, figures or research witnesses.
  let frame=0, disposed=false, visible=true, last=0;
  const fromShot={...wideShot}, toShot={...wideShot};
  let currentShot={...wideShot};
  let moveStart:number|null=null;
  let selectedView:NileView='wide';
  const applyShot=(now:number)=>{
    if(moveStart!==null){
      const t=Math.min(1,Math.max(0,(now-moveStart)/1050));
      const eased=t*t*(3-2*t);
      currentShot={
        x:THREE.MathUtils.lerp(fromShot.x,toShot.x,eased),
        y:THREE.MathUtils.lerp(fromShot.y,toShot.y,eased),
        z:THREE.MathUtils.lerp(fromShot.z,toShot.z,eased),
        focusX:THREE.MathUtils.lerp(fromShot.focusX,toShot.focusX,eased),
        focusY:THREE.MathUtils.lerp(fromShot.focusY,toShot.focusY,eased),
        focusZ:THREE.MathUtils.lerp(fromShot.focusZ,toShot.focusZ,eased),
      };
      if(t>=1)moveStart=null;
    }
    const microDrift=reducedMotion?0:Math.sin(now*.00012)*.025;
    camera.position.set(currentShot.x+microDrift,currentShot.y,currentShot.z);
    camera.lookAt(currentShot.focusX,currentShot.focusY,currentShot.focusZ);
    canvas.dataset.nileCameraPhase=moveStart===null?'settled':'moving';
    canvas.dataset.nileCameraX=camera.position.x.toFixed(3);
    canvas.dataset.nileCameraZ=camera.position.z.toFixed(3);
  };
  const setView=(view:NileView)=>{
    if(disposed||moment!=='discovery'||view===selectedView)return;
    selectedView=view;
    Object.assign(fromShot,currentShot);
    Object.assign(toShot,view==='close'?closeShot:wideShot);
    if(reducedMotion){
      currentShot={...toShot};
      moveStart=null;
      applyShot(performance.now());
    }else{
      moveStart=performance.now();
      // Do not allow test readers or UI to mistake the previous shot's
      // "settled" status for the new shot before the first RAF.
      canvas.dataset.nileCameraPhase='moving';
    }
    canvas.dataset.nileView=view;
  };
  // W10: the same physical shoreline is now a navigable region. A grounded
  // foot position is derived from the actual bank height function used by
  // the visible mesh. Never allow the camera to enter the water or figures.
  const walk:{x:number;z:number;yaw:number;pitch:number}={
    x:NILE_WALK.startX,z:NILE_WALK.startZ,
    yaw:NILE_WALK.startYaw,pitch:NILE_WALK.startPitch};
  let exploring=false, previousWalkTime=0, dragPointer:number|null=null;
  let dragX=0,dragY=0;
  const directions:Record<NileDirection,boolean>={
    forward:false,backward:false,left:false,right:false,
  };
  const setMovement=(direction:NileDirection,active:boolean)=>{
    directions[direction]=exploring&&active;
  };
  const rotateView=(dx:number,dy:number)=>{
    if(!exploring)return;
    walk.yaw-=THREE.MathUtils.clamp(dx,-140,140)*.0037;
    walk.pitch=THREE.MathUtils.clamp(walk.pitch-THREE.MathUtils.clamp(dy,-120,120)*.0031,-.85,.62);
  };
  const allowed=(x:number,z:number)=>nileCanWalk(x,z,moment);
  const setExplore=(enabled:boolean)=>{
    if(disposed)return;
    exploring=enabled;
    Object.keys(directions).forEach(key=>directions[key as NileDirection]=false);
    previousWalkTime=0;
    if(enabled){
      walk.x=NILE_WALK.startX;walk.z=NILE_WALK.startZ;
      walk.yaw=NILE_WALK.startYaw;walk.pitch=NILE_WALK.startPitch;
      canvas.dataset.nileMode='walk';
    }else{
      canvas.dataset.nileMode='shot';
      moveStart=null;
      currentShot={...(selectedView==='close'?closeShot:wideShot)};
    }
  };
  const keyDirection=(key:string):NileDirection|null=>{
    switch(key.toLowerCase()){
      case 'w':case 'arrowup':return 'forward';
      case 's':case 'arrowdown':return 'backward';
      case 'a':case 'arrowleft':return 'left';
      case 'd':case 'arrowright':return 'right';
      default:return null;
    }
  };
  const keyDown=(e:KeyboardEvent)=>{
    if(!exploring)return;
    const direction=keyDirection(e.key);
    if(!direction||e.altKey||e.ctrlKey||e.metaKey)return;
    e.preventDefault();directions[direction]=true;
  };
  const keyUp=(e:KeyboardEvent)=>{
    const direction=keyDirection(e.key);
    if(!direction||!exploring)return;
    e.preventDefault();directions[direction]=false;
  };
  const clearMovement=()=>Object.keys(directions).forEach(key=>directions[key as NileDirection]=false);
  const pointerDown=(e:PointerEvent)=>{
    if(!exploring||e.button!==0)return;
    dragPointer=e.pointerId;dragX=e.clientX;dragY=e.clientY;
    canvas.setPointerCapture(e.pointerId);
  };
  const pointerMove=(e:PointerEvent)=>{
    if(!exploring||e.pointerId!==dragPointer)return;
    rotateView(e.clientX-dragX,e.clientY-dragY);
    dragX=e.clientX;dragY=e.clientY;
  };
  const pointerUp=(e:PointerEvent)=>{
    if(e.pointerId!==dragPointer)return;
    dragPointer=null;
    if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
  };
  window.addEventListener('keydown',keyDown);
  window.addEventListener('keyup',keyUp);
  window.addEventListener('blur',clearMovement);
  canvas.addEventListener('pointerdown',pointerDown);
  canvas.addEventListener('pointermove',pointerMove);
  canvas.addEventListener('pointerup',pointerUp);
  canvas.addEventListener('pointercancel',pointerUp);
  const updateWalking=(now:number)=>{
    const elapsed=previousWalkTime?Math.min(.06,Math.max(0,(now-previousWalkTime)/1000)):0;
    previousWalkTime=now;
    const forward=Number(directions.forward)-Number(directions.backward);
    const right=Number(directions.right)-Number(directions.left);
    const magnitude=Math.hypot(forward,right);
    if(magnitude>0){
      const step=NILE_WALK.speed*elapsed/magnitude;
      const dx=(-Math.sin(walk.yaw)*forward+Math.cos(walk.yaw)*right)*step;
      const dz=(-Math.cos(walk.yaw)*forward-Math.sin(walk.yaw)*right)*step;
      if(allowed(walk.x+dx,walk.z))walk.x+=dx;
      if(allowed(walk.x,walk.z+dz))walk.z+=dz;
    }
    const height=bankHeight(walk.x,walk.z)+NILE_WALK.eyeHeight;
    camera.position.set(walk.x,height,walk.z);
    camera.lookAt(walk.x-Math.sin(walk.yaw)*Math.cos(walk.pitch),
      height+Math.sin(walk.pitch),walk.z-Math.cos(walk.yaw)*Math.cos(walk.pitch));
    canvas.dataset.nileCameraX=walk.x.toFixed(3);
    canvas.dataset.nileCameraZ=walk.z.toFixed(3);
    canvas.dataset.nileWalkY=height.toFixed(3);
    canvas.dataset.nileShoreDistance=(walk.x-nileShoreX(walk.z)).toFixed(3);
    canvas.dataset.nileGroundHeight=bankHeight(walk.x,walk.z).toFixed(3);
    canvas.dataset.nileLookYaw=walk.yaw.toFixed(3);
    canvas.dataset.nileLookPitch=walk.pitch.toFixed(3);
    canvas.dataset.nileCameraPhase='walk';
  };
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
  canvas.dataset.nileShoreOffset=(nileShoreX(basket.position.z)-basket.position.x).toFixed(3);
  canvas.dataset.nilePapyrusCount=String(shaft.count);
  canvas.dataset.nileUmbelRays=String(spokes.count);
  canvas.dataset.nileMoment=moment;
  canvas.dataset.nileFigures=String(figures.children.length);
  // Physical-art witnesses: actual, nested fabric and pose meshes.
  canvas.dataset.nilePleatedFigures=String(figures.children.filter(f=>
    !!f.getObjectByName('linen-pleats')).length);
  canvas.dataset.nileRoyalDrapes=String(figures.children.filter(f=>
    !!f.getObjectByName('linen-shoulder-drape')).length);
  canvas.dataset.nileReachingPose=String(figures.children.some(f=>
    !!f.getObjectByName('reaching-attendant-pose')));
  canvas.dataset.nileReady='true';
  canvas.dataset.nileView='wide';
  canvas.dataset.nileCameraPhase='settled';
  canvas.dataset.nileMode='shot';
  canvas.dataset.nileWalkBounds=`shore+${NILE_WALK.shoreClearance},${NILE_WALK.maxX},${NILE_WALK.minZ},${NILE_WALK.maxZ}`;
  canvas.dataset.nilePapyrusFineBranches=String(fineBranches.count);
  const animate=(now:number)=>{
    if(disposed)return;
    frame=requestAnimationFrame(animate);
    if(!visible||now-last<33)return;
    last=now;
    if(exploring)updateWalking(now);else applyShot(now);
    if(!reducedMotion) {
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
  return {setView,setExplore,setMovement,rotateView,dispose:()=>{
    disposed=true;
    window.removeEventListener('keydown',keyDown);
    window.removeEventListener('keyup',keyUp);
    window.removeEventListener('blur',clearMovement);
    canvas.removeEventListener('pointerdown',pointerDown);
    canvas.removeEventListener('pointermove',pointerMove);
    canvas.removeEventListener('pointerup',pointerUp);
    canvas.removeEventListener('pointercancel',pointerUp);
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
    delete canvas.dataset.nileMoment;
    delete canvas.dataset.nileFigures;
    delete canvas.dataset.nilePleatedFigures;
    delete canvas.dataset.nileRoyalDrapes;
    delete canvas.dataset.nileReachingPose;
    delete canvas.dataset.nileRendered;
    delete canvas.dataset.nileShoreOffset;
    delete canvas.dataset.nilePapyrusCount;
    delete canvas.dataset.nileUmbelRays;
    delete canvas.dataset.nileView;
    delete canvas.dataset.nileCameraPhase;
    delete canvas.dataset.nileCameraX;
    delete canvas.dataset.nileCameraZ;
    delete canvas.dataset.nileWalkY;
    delete canvas.dataset.nileGroundHeight;
    delete canvas.dataset.nileShoreDistance;
    delete canvas.dataset.nilePapyrusFineBranches;
    delete canvas.dataset.nileLookYaw;
    delete canvas.dataset.nileLookPitch;
    delete canvas.dataset.nileWalkBounds;
    delete canvas.dataset.nileMode;
  }} satisfies NilePreludeControl;
}
