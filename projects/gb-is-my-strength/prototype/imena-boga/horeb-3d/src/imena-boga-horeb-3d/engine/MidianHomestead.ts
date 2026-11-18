/**
 * W12A pilot: a distinct, fully three-dimensional Midian household space.
 * Exodus 2:18–21 gives a family encounter but not the plan or fabric of a
 * dwelling. This is an original artistic encampment, NOT an excavated site.
 */
import * as THREE from 'three';
import type { MidianControl,MidianDirection } from './MidianWell.js';

export const HOMESTEAD_WALK=Object.freeze({
  maxX:18,maxZ:22,eye:1.68,speed:3.1,startX:0,startZ:10,
  phoneStartZ:14.5,phoneVerticalFov:72,
});
export const HOMESTEAD_STRUCTURE=Object.freeze({
  halfWidth:3.1,back:-3.0,front:3.0,doorHalfWidth:1.42,
  hearthX:-5.35,hearthZ:1.45,hearthRadius:.94,
});
/** Author-defined mesh subdivisions, not claims about an Exodus-era textile.
 * Kept bounded to avoid shader/texture costs on software WebGL and phones. */
export const HOMESTEAD_TEXTILE_DETAIL=Object.freeze({
  roofU:36,roofV:22,sideU:24,sideV:14,
  rearU:28,rearV:14,matU:28,matV:20,
});
const hash=(n:number)=>{const v=Math.sin(n*137.19+17.2)*47358.34;return v-Math.floor(v);};
/** The very same deterministic rock instances drive visible geometry and
 * walkable-space collision, so a displayed large stone cannot be ghosted. */
/** W12C.1: geographically unclaimed original scenic eroded highlands.
 * Deliberately disconnected azimuth sectors; no closed circular bowl. */
export const HOMESTEAD_RIDGE_SECTORS=Object.freeze([
  Object.freeze({centre:2.70,halfSpan:.82,distance:47,height:7.0,seed:1.4}),
  Object.freeze({centre:3.78,halfSpan:.68,distance:53,height:8.2,seed:3.1}),
  Object.freeze({centre:1.16,halfSpan:.55,distance:55,height:4.5,seed:5.7}),
  Object.freeze({centre:5.08,halfSpan:.52,distance:52,height:5.8,seed:7.9}),
]);
export const HOMESTEAD_GROUND_DETAIL=Object.freeze({
  washDepth:.135,washHalfWidth:1.85,pebbleCount:720,
});
/** W12D.2 authored generic household storage forms; NOT a claim about
 * Exodus 2 family possessions or any excavated Midianite dwelling. */
/** W12D.3 small, self-contained repeatable natural-fibre microstructure.
 * No downloaded texture or historical claim of specific fabric technology. */
/** W12D.4 - restrained, shadowless illumination from pale sand into the
 * underside of the canopy. Roof must still cast its real shadow on the room. */
export const HOMESTEAD_SAND_BOUNCE=Object.freeze({
  intensity:.50,color:0xffdfbe,
});
export const HOMESTEAD_WEAVE_DETAIL=Object.freeze({
  size:128,repeatU:6,repeatV:4,bumpScale:.007,
});
export function homesteadWeaveIntensity(x:number,y:number):number{
  const warp=Math.pow(.5+.5*Math.cos(x*Math.PI/4),6);
  const weft=Math.pow(.5+.5*Math.cos(y*Math.PI/4),6);
  const alternate=((Math.floor(x/8)+Math.floor(y/8))%2===0)?1:-1;
  // Integer Fourier modes on the 128px tile keep opposite edges seamless.
  const unit=2*Math.PI/HOMESTEAD_WEAVE_DETAIL.size;
  const variation=.014*Math.sin(unit*(x*3+y*2))+
    .009*Math.cos(unit*(x*5-y*4));
  // A strong crossing-grid reads as graph paper in a near-wall shot.
  // Fibre relief is now anisotropic and subdued, with no high-contrast
  // alternating checker; broader fabric folds remain in vertex geometry.
  return Math.min(1,Math.max(.88,
    .946+.027*warp+.017*weft+.004*alternate*(warp-weft)+variation));
}
export const HOMESTEAD_INTERIOR_STORAGE=Object.freeze([
  Object.freeze({x:-2.06,z:-1.60,radius:.39,height:.44}),
  Object.freeze({x:2.08,z:-1.42,radius:.33,height:.36}),
]);
export function homesteadWashCenter(z:number):number{
  return 9.4+.9*Math.sin(z*.15+.9);
}
export function homesteadWashRelief(x:number,z:number):number{
  const d=(x-homesteadWashCenter(z))/HOMESTEAD_GROUND_DETAIL.washHalfWidth;
  return -HOMESTEAD_GROUND_DETAIL.washDepth*Math.exp(-d*d);
}
export const HOMESTEAD_ROCK_COUNT=64;
export type HomesteadRockPoint={
  index:number;x:number;z:number;a:number;size:number;
  sx:number;sy:number;sz:number;tiltX:number;tiltZ:number;
};
export function homesteadRockPoint(index:number):HomesteadRockPoint{
  const a=hash(index*7.1)*Math.PI*2,r=12+hash(index*6.2+3)*18;
  const x=Math.sin(a)*r,z=Math.cos(a)*r,size=.44+hash(index*2.14)*1.28;
  return {index,x,z,a,size,sx:size*1.5,sy:size*.34,sz:size*.78,
    tiltX:.12*hash(index*2.5),tiltZ:.14*hash(index*.71)};
}
export const HOMESTEAD_ROCK_COLLIDERS=Object.freeze(
  Array.from({length:HOMESTEAD_ROCK_COUNT},(_,i)=>homesteadRockPoint(i))
    .filter(r=>Math.abs(r.x)<HOMESTEAD_WALK.maxX+2&&
      Math.abs(r.z)<HOMESTEAD_WALK.maxZ+2)
);

export function homesteadGround(x:number,z:number):number{
  const outer=Math.min(1,Math.max(0,(Math.hypot(x,z)-9.8)/11));
  const slope=.045*Math.sin(x*.23+z*.13)+.048*Math.cos(z*.25-x*.1);
  const softened=slope*(.55+.45*outer);
  const terrace=.34*outer*outer;
  const micro=.016*Math.sin(x*1.12+z*.64)*Math.cos(z*.83-x*.28)+
    .007*Math.sin(x*2.17-z*.67);
  return softened+terrace-.065*Math.exp(-Math.pow((z-4.2)/2.8,2))+
    homesteadWashRelief(x,z)+micro;
}
/** Rear sheet seam is derived from the very same canopy height function.
 * The cloth is a visual reconstruction, not a historically attested tent. */
export const HOMESTEAD_GABLE_SEGMENTS=48;
export const HOMESTEAD_REAR_GABLE_Z=-3.065;
export function homesteadRoofBackHeight(x:number):number{
  const u=Math.min(1,Math.abs(x)/3.07);
  // This duplicates EXACTLY the end-row (v=0) of the actual rear roof mesh.
  const ripple=.034*Math.sin(u*32)+.017*Math.cos(u*17);
  return homesteadGround(x,-2.95)+3.07-u*1.80+ripple;
}
export function homesteadRearGableTop(x:number):number{
  return homesteadRoofBackHeight(x)+.055;
}

export function homesteadWalkable(x:number,z:number):boolean{
  if(!Number.isFinite(x)||!Number.isFinite(z)||Math.abs(x)>HOMESTEAD_WALK.maxX||
    Math.abs(z)>HOMESTEAD_WALK.maxZ)return false;
  const h=HOMESTEAD_STRUCTURE,margin=.18;
  // Canvas and supports form perimeter obstacles. Front doorway is open,
  // so the player can enter the REAL rendered interior without a teleport.
  if(Math.abs(Math.abs(x)-h.halfWidth)<margin&&z>h.back-margin&&z<h.front+margin)
    return false;
  if(Math.abs(z-h.back)<margin&&Math.abs(x)<h.halfWidth+margin)return false;
  if(Math.abs(z-h.front)<margin&&Math.abs(x)<h.halfWidth+margin&&
    Math.abs(x)>h.doorHalfWidth)return false;
  if(Math.hypot(x-h.hearthX,z-h.hearthZ)<h.hearthRadius)return false;
  if(Math.hypot(x-4.4,z+.85)<.67)return false;
  // A visitor cannot pass through the new physical basket bodies; the
  // collision derives from the same storage locations and radii as render.
  for(const prop of HOMESTEAD_INTERIOR_STORAGE)
    if(Math.hypot(x-prop.x,z-prop.z)<prop.radius+.15)return false;
  for(const rock of HOMESTEAD_ROCK_COLLIDERS){
    // Inverse of the same Y rotation applied to the rendered rock instance.
    const dx=x-rock.x,dz=z-rock.z,c=Math.cos(rock.a),sn=Math.sin(rock.a);
    const lx=c*dx-sn*dz,lz=sn*dx+c*dz;
    if((lx/(rock.sx*.78))**2+(lz/(rock.sz*.78))**2<1)return false;
  }
  return true;
}
export function createMidianHomestead(canvas:HTMLCanvasElement,reducedMotion:boolean):MidianControl{
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.07;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0xb5ada0);
  scene.fog=new THREE.FogExp2(0xb9b0a2,.010);
  const camera=new THREE.PerspectiveCamera(56,1,.08,130);
  scene.add(new THREE.HemisphereLight(0xf6e6d0,0x6a6255,1.82));
  const sun=new THREE.DirectionalLight(0xffdab1,2.08);
  sun.position.set(-10,18,13);
  sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
  sun.shadow.camera.left=-24;sun.shadow.camera.right=24;
  sun.shadow.camera.top=24;sun.shadow.camera.bottom=-24;
  sun.shadow.normalBias=.045;scene.add(sun);
  // Real-world light scatters from bright ground up into a fabric canopy.
  // One weak shadow-free fill preserves the key directional sun and keeps the
  // roof from reading as black cardboard from inside the doorway.
  const bounce=new THREE.DirectionalLight(
    HOMESTEAD_SAND_BOUNCE.color,HOMESTEAD_SAND_BOUNCE.intensity);
  bounce.position.set(1,-3.8,5.4);
  bounce.castShadow=false;
  bounce.name='midian-homestead-sand-bounce';
  scene.add(bounce);
  const mat=(color:number,roughness=1)=>new THREE.MeshStandardMaterial({color,roughness,metalness:0});
  // One 128x128 RGBA texture is shared by all fibre-covered meshes. Mipmapped
  // tiling preserves close-up yarn relief without loading external resources.
  const size=HOMESTEAD_WEAVE_DETAIL.size,texels=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const o=(y*size+x)*4;
    const v=Math.round(255*homesteadWeaveIntensity(x,y));
    texels[o]=v;texels[o+1]=Math.max(0,v-3);
    texels[o+2]=Math.max(0,v-7);texels[o+3]=255;
  }
  const weaveMap=new THREE.DataTexture(texels,size,size,THREE.RGBAFormat);
  weaveMap.colorSpace=THREE.SRGBColorSpace;
  weaveMap.wrapS=weaveMap.wrapT=THREE.RepeatWrapping;
  weaveMap.repeat.set(HOMESTEAD_WEAVE_DETAIL.repeatU,HOMESTEAD_WEAVE_DETAIL.repeatV);
  weaveMap.generateMipmaps=true;
  weaveMap.minFilter=THREE.LinearMipmapLinearFilter;
  weaveMap.magFilter=THREE.LinearFilter;
  weaveMap.needsUpdate=true;
  const woven=(color:number)=>new THREE.MeshStandardMaterial({
    color,vertexColors:true,roughness:1,side:THREE.DoubleSide,
    map:weaveMap,bumpMap:weaveMap,bumpScale:HOMESTEAD_WEAVE_DETAIL.bumpScale,
  });
  const desert=new THREE.PlaneGeometry(64,64,96,96);
  desert.rotateX(-Math.PI/2);
  const attr=desert.getAttribute('position'),colors:number[]=[];
  const sand=new THREE.Color(0xb9a488),stoneTint=new THREE.Color(0x8c7868);
  const washTint=new THREE.Color(0x857761);
  for(let i=0;i<attr.count;i++){
    const x=attr.getX(i),z=attr.getZ(i);
    attr.setY(i,homesteadGround(x,z));
    const value=Math.min(1,Math.hypot(x,z)/34);
    // Visible sediment bands and irregular, non-tiled stone/sand variation.
    // Vertex colours share the physical terrain's world-space position.
    const wash=Math.exp(-Math.pow((x-homesteadWashCenter(z))/2.5,2));
    const broad=Math.sin(x*.42+z*.27+Math.sin(z*.11)*.6)*
      Math.cos(z*.36-x*.14);
    const grain=Math.sin(x*2.19+z*.83)*Math.sin(z*1.93-x*.46);
    const col=sand.clone().lerp(stoneTint,value*.63);
    col.lerp(washTint,wash*.25);
    col.multiplyScalar(.87+.085*(.5+.5*broad)+.10*(.5+.5*grain));
    colors.push(col.r,col.g,col.b);
  }
  desert.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  desert.computeVertexNormals();
  const floor=new THREE.Mesh(desert,new THREE.MeshStandardMaterial({
    vertexColors:true,roughness:1,side:THREE.DoubleSide,
  }));
  floor.name='midian-homestead-physical-ground';floor.receiveShadow=true;scene.add(floor);

  // Four disconnected, volumetric eroded mountain masses. Every crest
  // has inner/outer foot slopes: no omnidirectional vertical "arena wall".
  // All of this lies beyond the physically traversable ground and carries
  // no claim about the geography of the biblical Midian episode.
  const rockBase=new THREE.Color(0x9a8975),rockCrest=new THREE.Color(0x786d60);
  const hillMaterial=new THREE.MeshStandardMaterial({
    vertexColors:true,roughness:1,side:THREE.DoubleSide,
  });
  for(const sector of HOMESTEAD_RIDGE_SECTORS){
    const vertices:number[]=[],triangles:number[]=[],hue:number[]=[];
    const steps=48,depth=[-13,-7,0,8,16],heights=[-.3,.32,1,.46,-1];
    for(let i=0;i<=steps;i++){
      const t=i/steps,a=sector.centre+(t*2-1)*sector.halfSpan;
      const taper=Math.pow(Math.max(0,Math.sin(Math.PI*t)),.72);
      const relief=.79+.13*Math.sin(t*9.4+sector.seed)+
        .075*Math.sin(t*23.7+sector.seed*2.1)+.045*Math.cos(t*37.2-sector.seed);
      const crest=sector.height*taper*relief;
      const wandering=1.3*Math.sin(a*5.4+sector.seed)+
        .85*Math.sin(a*11.2-sector.seed*.8);
      for(let row=0;row<depth.length;row++){
        const r=sector.distance+depth[row]+wandering;
        const y=row===0?-.38:row===4?-.8:
          crest*heights[row]+.13*Math.sin(t*15.5+row+sector.seed);
        vertices.push(Math.sin(a)*r,y,Math.cos(a)*r);
        const c=rockBase.clone().lerp(rockCrest,row===2?.65:row===1?.30:.12);
        c.multiplyScalar(.94+.055*Math.sin(t*17+row*3.4+sector.seed));
        hue.push(c.r,c.g,c.b);
      }
      if(i)for(let row=0;row<depth.length-1;row++){
        const x=(i-1)*depth.length+row,y=i*depth.length+row;
        triangles.push(x,y,x+1,x+1,y,y+1);
      }
    }
    const ridge=new THREE.BufferGeometry();
    ridge.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    ridge.setAttribute('color',new THREE.Float32BufferAttribute(hue,3));
    ridge.setIndex(triangles);ridge.computeVertexNormals();
    const distant=new THREE.Mesh(ridge,hillMaterial);
    distant.name='midian-homestead-eroded-ridge-sector';scene.add(distant);
  }

  // Low-cost authored atmosphere: a physical skydome with a subtle warmer
  // horizon, rather than one flat grey camera background. It follows the
  // camera but stays behind geometry. No network texture or GPU-heavy clouds.
  const skyGeometry=new THREE.SphereGeometry(110,32,20);
  const skyPosition=skyGeometry.getAttribute('position'),skyColors:number[]=[];
  const skyHorizon=new THREE.Color(0xc7bbae),skyUpper=new THREE.Color(0xaeb9bb);
  for(let i=0;i<skyPosition.count;i++){
    const h=THREE.MathUtils.clamp(skyPosition.getY(i)/110,0,1);
    const t=THREE.MathUtils.smoothstep(h,0,.74);
    const c=skyHorizon.clone().lerp(skyUpper,t*.82);
    skyColors.push(c.r,c.g,c.b);
  }
  skyGeometry.setAttribute('color',new THREE.Float32BufferAttribute(skyColors,3));
  const sky=new THREE.Mesh(skyGeometry,new THREE.MeshBasicMaterial({
    vertexColors:true,side:THREE.BackSide,depthWrite:false,fog:false,toneMapped:false,
  }));
  sky.name='midian-homestead-atmospheric-skydome';
  sky.renderOrder=-100;
  scene.add(sky);

  // Structural frame, actual posts and gently sagging fabric roof.
  const support=mat(0x665744),rope=mat(0xa38b6b),
    cloth=woven(0xb7a08b);
  const pivot=new THREE.Group();
  pivot.name='midian-homestead-3d-shelter';
  scene.add(pivot);
  const h=HOMESTEAD_STRUCTURE;
  function timber(x:number,z:number,height:number,radius:number){
    const g=new THREE.CylinderGeometry(radius*.88,radius,height,9);
    const post=new THREE.Mesh(g,support);
    post.position.set(x,homesteadGround(x,z)+height*.5,z);
    post.castShadow=true;post.name='shelter-structural-post';pivot.add(post);
  }
  // No centre pole at the front doorway: the original front post at x=0,
  // z=+2.85 intersected the only intended physical entry corridor while
  // homesteadWalkable() incorrectly let the visitor walk through its mesh.
  // Four corner posts plus one rear ridge post support an open A-frame portal.
  for(const z of [-2.85,2.85]){
    for(const x of [-2.95,2.95])timber(x,z,1.52,.105);
  }
  timber(0,-2.85,3.05,.125);
  function beam(from:THREE.Vector3,to:THREE.Vector3,r:number,material:THREE.Material,name:string){
    const delta=to.clone().sub(from);
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),8),material);
    mesh.position.copy(from).add(to).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
    mesh.name=name;mesh.castShadow=true;pivot.add(mesh);
  }
  beam(new THREE.Vector3(0,3.08,-2.85),new THREE.Vector3(0,3.08,2.85),
    .064,support,'shelter-ridge-beam');
  // Two actual sloping braces carry the front ridge into the existing corner
  // posts, keeping the whole 2.84 m central doorway visibly unobstructed.
  for(const x of [-2.95,2.95]){
    beam(new THREE.Vector3(x,homesteadGround(x,2.85)+1.52,2.85),
      new THREE.Vector3(0,homesteadGround(0,2.85)+3.08,2.85),
      .063,support,'shelter-open-front-truss');
  }
  // Two 24×16 fabric surfaces: actual curvature and draped side seams.
  for(const side of [-1,1]){
    const g=new THREE.PlaneGeometry(1,1,HOMESTEAD_TEXTILE_DETAIL.roofU,HOMESTEAD_TEXTILE_DETAIL.roofV);
    const p=g.getAttribute('position');const vertexColor:number[]=[];
    for(let i=0;i<p.count;i++){
      const u=p.getX(i)+.5,v=p.getY(i)+.5;
      const x=side*u*3.07;
      const z=-2.95+v*5.9;
      const sag=.17*Math.sin(Math.PI*u)*Math.sin(Math.PI*v);
      const ripple=.034*Math.sin(u*32+v*11)+.017*Math.cos(u*17-v*19);
      const y=3.07-u*1.80-sag+ripple;
      p.setXYZ(i,x,y+homesteadGround(x,z),z);
      // Longitudinal fabric bands and a modest cross-weft variation.
      // Colour variations follow actual subdivided fabric vertices.
      const bands=.96+.078*Math.sin(u*20.2+v*.72)+.033*Math.cos(u*43-v*3.9);
      const weft=.978+.027*Math.sin(v*74+u*6.2);
      const c=bands*weft;
      vertexColor.push(c,c*.979,c*.952);
    }
    g.setAttribute('color',new THREE.Float32BufferAttribute(vertexColor,3));
    g.computeVertexNormals();
    const fabric=new THREE.Mesh(g,cloth);
    // This double-sided thin roof used to shadow itself heavily from the
    // inside, producing near-black wedge surfaces. Keep its real castShadow
    // onto the walls/mat, but prevent its own GPU shadow-map self-occlusion.
    fabric.castShadow=true;fabric.receiveShadow=false;
    fabric.name='midian-shelter-woven-3d-roof';
    pivot.add(fabric);
    // The actual perimeter below the eaves is made of 3D cloth, not an
    // invisible full-height walking barrier behind roof geometry.
    const sideGeo=new THREE.PlaneGeometry(1,1,HOMESTEAD_TEXTILE_DETAIL.sideU,HOMESTEAD_TEXTILE_DETAIL.sideV);
    const sidePos=sideGeo.getAttribute('position'),sideColors:number[]=[];
    for(let i=0;i<sidePos.count;i++){
      const u=sidePos.getX(i)+.5,v=sidePos.getY(i)+.5;
      const z=-2.95+5.9*u;
      const x=side*(3.065+.025*Math.sin(u*21)*Math.sin(Math.PI*v));
      sidePos.setXYZ(i,x,homesteadGround(x,z)+.055+v*1.31,z);
      const shade=.91+.09*Math.sin(u*11+v*3)*Math.cos(u*19-v*5);
      sideColors.push(shade,shade*.986,shade*.956);
    }
    sideGeo.setAttribute('color',new THREE.Float32BufferAttribute(sideColors,3));
    sideGeo.computeVertexNormals();
    const sideCloth=new THREE.Mesh(sideGeo,cloth);
    sideCloth.name='midian-shelter-real-cloth-sidewall';
    sideCloth.castShadow=true;sideCloth.receiveShadow=true;
    pivot.add(sideCloth);
    const x=side*3.06;
    beam(new THREE.Vector3(x,1.37+homesteadGround(x,-2.85),-2.85),
      new THREE.Vector3(x,1.37+homesteadGround(x,2.85),2.85),
      .04,rope,'shelter-edge-cord');
  }
  // Rear fabric is solid; front remains genuinely open for walking.
  // The rear is a visibly draped, continuous real surface, not one
  // billboard-flat brown rectangle. Its displacement stays within the
  // already-colliding rear wall band at z=-3.0 (±0.18 m).
  const rearGeo=new THREE.PlaneGeometry(5.92,1.46,
    HOMESTEAD_TEXTILE_DETAIL.rearU,HOMESTEAD_TEXTILE_DETAIL.rearV);
  const rearPos=rearGeo.getAttribute('position'),rearColors:number[]=[];
  for(let i=0;i<rearPos.count;i++){
    const x=rearPos.getX(i),v=(rearPos.getY(i)+.73)/1.46;
    const folds=.050*Math.sin((x+2.96)*3.6+v*.8)+
      .020*Math.sin((x+2.96)*8.7-v*1.3);
    const z=-2.97+folds;
    const y=homesteadGround(x,z)+.73+rearPos.getY(i);
    rearPos.setXYZ(i,x,y,z);
    const shade=.92+.062*Math.cos((x+2.96)*4.0+v*.6)+
      .025*Math.sin((x+2.96)*10.9+v*6.1);
    rearColors.push(shade,shade*.985,shade*.963);
  }
  rearGeo.setAttribute('color',new THREE.Float32BufferAttribute(rearColors,3));
  rearGeo.computeVertexNormals();
  const rear=new THREE.Mesh(rearGeo,woven(0xa58e77));
  rear.castShadow=true;rear.receiveShadow=true;
  rear.name='shelter-rear-cloth';pivot.add(rear);
  // The previous single TRIANGLE did not follow the curved rear roof
  // edge. In interior Chromium frames, literal daylight wedges were visible
  // on both sides of the ridge. Build ONE indexed gable whose upper profile
  // derives from the roof's actual rear-row height (plus a 55mm overlap).
  const gable=new THREE.BufferGeometry();
  const gablePositions:number[]=[],gableColours:number[]=[],gableIndices:number[]=[],gableUV:number[]=[];
  for(let i=0;i<=HOMESTEAD_GABLE_SEGMENTS;i++){
    const x=-2.96+5.92*i/HOMESTEAD_GABLE_SEGMENTS;
    const upperY=homesteadRearGableTop(x);
    // Keep the closure behind all folds, avoiding material intersections.
    const baseY=Math.min(homesteadGround(x,HOMESTEAD_REAR_GABLE_Z)+1.40,
      upperY-.06);
    gablePositions.push(x,baseY,HOMESTEAD_REAR_GABLE_Z,
      x,upperY,HOMESTEAD_REAR_GABLE_Z);
    const u=(x+2.96)/5.92;
    gableUV.push(u,0,u,Math.max(.02,(upperY-baseY)/2.3));
    const shade=.91+.05*Math.cos(x*2.5);
    gableColours.push(shade,shade*.985,shade*.962,
      shade*.968,shade*.954,shade*.932);
    if(i){
      const a=(i-1)*2,b=i*2;
      gableIndices.push(a,b,a+1,a+1,b,b+1);
    }
  }
  gable.setAttribute('position',new THREE.Float32BufferAttribute(gablePositions,3));
  gable.setAttribute('color',new THREE.Float32BufferAttribute(gableColours,3));
  gable.setAttribute('uv',new THREE.Float32BufferAttribute(gableUV,2));
  gable.setIndex(gableIndices);gable.computeVertexNormals();
  const endCloth=new THREE.Mesh(gable,woven(0xa58e77));
  endCloth.castShadow=true;endCloth.receiveShadow=true;
  endCloth.name='shelter-solid-rear-gable';
  pivot.add(endCloth);
  for(const x of [-2.95,2.95]){
    beam(new THREE.Vector3(x,1.46+homesteadGround(x,2.85),2.85),
      new THREE.Vector3(x*1.32,homesteadGround(x*1.32,5.23)+.08,5.23),
      .021,rope,'shelter-real-tension-rope');
  }
  // A woven floor mat, relief from meshes rather than an image overlay.
  const matGeo=new THREE.PlaneGeometry(4.6,3.3,
    HOMESTEAD_TEXTILE_DETAIL.matU,HOMESTEAD_TEXTILE_DETAIL.matV);
  matGeo.rotateX(-Math.PI/2);
  const matPos=matGeo.getAttribute('position'),matColors:number[]=[];
  for(let i=0;i<matPos.count;i++){
    const x=matPos.getX(i),z=matPos.getZ(i)-.38;
    const relief=.007*Math.sin(x*20.6)*Math.cos(z*19.2);
    matPos.setXYZ(i,x,homesteadGround(x,z)+.027+relief,z);
    const border=Math.abs(x)>2.08||Math.abs(z+.38)>1.46;
    const weave=.935+.047*Math.sin(x*14.2)+.038*Math.sin(z*20.4+x*1.3);
    const c=weave*(border?.81:1);
    matColors.push(c,c*.959,c*.901);
  }
  matGeo.setAttribute('color',new THREE.Float32BufferAttribute(matColors,3));
  matGeo.computeVertexNormals();
  const matFloor=new THREE.Mesh(matGeo,woven(0x947b60));
  matFloor.name='shelter-3d-floor-mat';matFloor.receiveShadow=true;
  pivot.add(matFloor);

  // Small domestic forms give human scale to the otherwise blank interior.
  // This is generic hypothetical craft material, not an enacted biblical
  // interaction and not reconstructed archaeological household equipment.
  const storageProfile=[
    new THREE.Vector2(.46,0),new THREE.Vector2(.75,.045),
    new THREE.Vector2(.96,.12),new THREE.Vector2(1,.30),
    new THREE.Vector2(.96,.78),new THREE.Vector2(.91,.97),
  ];
  const storageGeo=new THREE.LatheGeometry(storageProfile,28);
  const storagePos=storageGeo.getAttribute('position'),storageColors:number[]=[];
  for(let i=0;i<storagePos.count;i++){
    const theta=Math.atan2(storagePos.getZ(i),storagePos.getX(i));
    const y=storagePos.getY(i);
    const weave=.89+.058*Math.cos(theta*9+y*21)+
      .035*Math.sin(theta*13-y*41);
    storageColors.push(weave,weave*.93,weave*.82);
  }
  storageGeo.setAttribute('color',new THREE.Float32BufferAttribute(storageColors,3));
  const storageMaterial=woven(0x9d825f);
  const rimGeo=new THREE.TorusGeometry(.94,.055,6,28);
  const rimMaterial=mat(0x6f5338),insideMaterial=mat(0x503b2c);
  const storageBottomGeo=new THREE.CircleGeometry(.80,28);
  for(const prop of HOMESTEAD_INTERIOR_STORAGE){
    const ground=homesteadGround(prop.x,prop.z);
    const body=new THREE.Mesh(storageGeo,storageMaterial);
    body.position.set(prop.x,ground,prop.z);
    body.scale.set(prop.radius,prop.height,prop.radius);
    body.castShadow=true;body.receiveShadow=true;
    body.name='homestead-inner-storage-basket';pivot.add(body);
    const rim=new THREE.Mesh(rimGeo,rimMaterial);
    rim.rotation.x=-Math.PI/2;
    rim.scale.setScalar(prop.radius);
    rim.position.set(prop.x,ground+prop.height*.97,prop.z);
    rim.name='homestead-inner-storage-rim';rim.castShadow=true;pivot.add(rim);
    const inset=new THREE.Mesh(storageBottomGeo,insideMaterial);
    inset.rotation.x=-Math.PI/2;
    inset.scale.setScalar(prop.radius);
    inset.position.set(prop.x,ground+prop.height*.73,prop.z);
    inset.name='homestead-inner-storage-opening';pivot.add(inset);
  }

  // Hearth and storing vessels: actual 3D but not a staged invented meal.
  const hearthMat=[mat(0x7a6a59),mat(0x9e8970),mat(0x8b7964)];
  const rockGeo=new THREE.DodecahedronGeometry(1,1);
  const cx=h.hearthX,cz=h.hearthZ;
  const ash=new THREE.Mesh(new THREE.CylinderGeometry(.67,.67,.028,32),
    mat(0x554d42));
  ash.position.set(cx,homesteadGround(cx,cz)+.035,cz);
  ash.name='shelter-inactive-ash-hearth';scene.add(ash);
  for(let i=0;i<14;i++){
    const a=i*Math.PI*2/14,r=.78+(hash(i*.81)-.5)*.13;
    const x=cx+Math.sin(a)*r,z=cz+Math.cos(a)*r;
    const stone=new THREE.Mesh(rockGeo,hearthMat[i%3]);
    stone.scale.set(.18+hash(i*3)*.1,.14+hash(i*2)*.06,.16+hash(i+1)*.11);
    stone.position.set(x,homesteadGround(x,z)+.08,z);
    stone.rotation.y=i*.78;stone.castShadow=i%2===0;scene.add(stone);
  }
  const jarProfile=[new THREE.Vector2(.16,0),new THREE.Vector2(.30,.09),
    new THREE.Vector2(.29,.35),new THREE.Vector2(.20,.50),
    new THREE.Vector2(.19,.62)];
  const jarGeo=new THREE.LatheGeometry(jarProfile,28),jarMat=mat(0xa17352);
  for(const [i,x,z] of [[0,4.35,-.85],[1,4.72,-1.53],[2,4.0,-1.71]]){
    const jar=new THREE.Mesh(jarGeo,jarMat);
    jar.position.set(x,homesteadGround(x,z),z);
    jar.scale.setScalar(.86+hash(i*3)*.21);
    jar.name='homestead-clay-storage-vessel';
    jar.castShadow=true;scene.add(jar);
  }
  // Sparse large stones beyond approach lines.
  const natural=mat(0x9a8872);
  const scatter=new THREE.InstancedMesh(rockGeo,natural,HOMESTEAD_ROCK_COUNT);
  const transform=new THREE.Object3D();
  let count=0;
  for(let i=0;i<HOMESTEAD_ROCK_COUNT;i++){
    const rock=homesteadRockPoint(i);
    transform.position.set(rock.x,homesteadGround(rock.x,rock.z)+rock.size*.18,rock.z);
    transform.rotation.set(rock.tiltX,rock.a,rock.tiltZ);
    transform.scale.set(rock.sx,rock.sy,rock.sz);
    transform.updateMatrix();scatter.setMatrixAt(count++,transform.matrix);
  }
  scatter.instanceMatrix.needsUpdate=true;
  scatter.name='homestead-instanced-natural-stone';
  scene.add(scatter);

  // Small scale ground breakup, using ONE instanced draw call. These 720
  // surface pebbles are under ~35mm tall; unlike the substantial visible
  // boulders above, they do not warrant blocking a walking camera.
  const pebbleGeo=new THREE.IcosahedronGeometry(1,0);
  const pebbles=new THREE.InstancedMesh(pebbleGeo,
    mat(0xb9a68b),HOMESTEAD_GROUND_DETAIL.pebbleCount);
  const pebbleShade=new THREE.Color(),pebbleLight=new THREE.Color(0xc2b196);
  for(let i=0;i<HOMESTEAD_GROUND_DETAIL.pebbleCount;i++){
    let x=(hash(i*6.37+1.8)-.5)*61;
    const z=(hash(i*4.91+8.3)-.5)*61;
    if(Math.abs(x)<3.8&&z>-3.5&&z<3.5)x+=x<0?-4.2:4.2;
    const size=.026+hash(i*3.43+2.1)*.048;
    transform.position.set(x,homesteadGround(x,z)+size*.14,z);
    transform.rotation.set(.14*hash(i*3.1),hash(i*5.4)*Math.PI*2,.11*hash(i*.37));
    transform.scale.set(size*1.65,size*.32,size*.96);
    transform.updateMatrix();pebbles.setMatrixAt(i,transform.matrix);
    pebbleShade.set(0x9f8c73).lerp(pebbleLight,hash(i*2.31));
    pebbles.setColorAt(i,pebbleShade);
  }
  pebbles.instanceMatrix.needsUpdate=true;
  if(pebbles.instanceColor)pebbles.instanceColor.needsUpdate=true;
  pebbles.name='homestead-instanced-small-ground-pebble';
  pebbles.castShadow=false;pebbles.receiveShadow=true;
  scene.add(pebbles);

  // Runtime walk coordinates are mutable numbers, not frozen start literals.
  const walk:{x:number;z:number;yaw:number;pitch:number}={
    x:HOMESTEAD_WALK.startX,z:HOMESTEAD_WALK.startZ,yaw:0,pitch:-.08,
  };
  let exploring=false,disposed=false,last=0,frame=0,dragId:number|null=null,lastX=0,lastY=0;
  const moving:Record<MidianDirection,boolean>={forward:false,backward:false,left:false,right:false};
  const reset=()=>{for(const k of Object.keys(moving) as MidianDirection[])moving[k]=false;};
  const key=(k:string):MidianDirection|null=>{
    switch(k.toLowerCase()){
      case 'w':case 'arrowup':return 'forward';
      case 's':case 'arrowdown':return 'backward';
      case 'a':case 'arrowleft':return 'left';
      case 'd':case 'arrowright':return 'right';
      default:return null;
    }
  };
  const keyDown=(e:KeyboardEvent)=>{
    if(!exploring||e.altKey||e.ctrlKey||e.metaKey)return;
    const d=key(e.key);if(!d)return;e.preventDefault();moving[d]=true;
  };
  const keyUp=(e:KeyboardEvent)=>{
    if(!exploring)return;const d=key(e.key);if(!d)return;e.preventDefault();moving[d]=false;
  };
  function setExplore(on:boolean){
    if(disposed)return;
    exploring=on;reset();last=0;
    if(on){
      walk.x=HOMESTEAD_WALK.startX;
      // On a 390 px portrait viewport, the original 10m placement cropped
      // both eaves. Start on physically navigable ground farther away.
      walk.z=window.innerWidth<=520?
        HOMESTEAD_WALK.phoneStartZ:HOMESTEAD_WALK.startZ;
      walk.yaw=0;walk.pitch=-.08;
    }
    canvas.dataset.midianMode=on?'walk':'shot';
  }
  function setMovement(d:MidianDirection,on:boolean){moving[d]=on&&exploring;}
  function turn(dx:number,dy:number){
    if(!exploring)return;
    walk.yaw-=THREE.MathUtils.clamp(dx,-140,140)*.0038;
    walk.pitch=THREE.MathUtils.clamp(walk.pitch-THREE.MathUtils.clamp(dy,-120,120)*.003,-.68,.55);
  }
  function pointerDown(e:PointerEvent){
    if(!exploring||e.button!==0)return;
    dragId=e.pointerId;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);
  }
  function pointerMove(e:PointerEvent){
    if(dragId!==e.pointerId||!exploring)return;
    turn(e.clientX-lastX,e.clientY-lastY);lastX=e.clientX;lastY=e.clientY;
  }
  function pointerUp(e:PointerEvent){
    if(dragId!==e.pointerId)return;
    dragId=null;
    if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
  }
  const resize=()=>{
    const b=canvas.getBoundingClientRect();
    const w=Math.max(1,Math.round(b.width)),h=Math.max(1,Math.round(b.height));
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.fov=window.innerWidth<=520?HOMESTEAD_WALK.phoneVerticalFov:56;
    camera.updateProjectionMatrix();
    canvas.dataset.homesteadCameraVerticalFov=String(camera.fov);
  };
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);
  window.addEventListener('blur',reset);
  canvas.addEventListener('pointerdown',pointerDown);
  canvas.addEventListener('pointermove',pointerMove);
  canvas.addEventListener('pointerup',pointerUp);
  canvas.addEventListener('pointercancel',pointerUp);
  function render(now:number){
    if(disposed)return;
    frame=requestAnimationFrame(render);
    if(exploring){
      const dt=last?Math.min(.05,Math.max(0,(now-last)/1000)):0;
      last=now;
      const f=Number(moving.forward)-Number(moving.backward);
      const s=Number(moving.right)-Number(moving.left);
      const mag=Math.hypot(f,s);
      if(mag>0){
        const step=HOMESTEAD_WALK.speed*dt/mag;
        const dx=(-Math.sin(walk.yaw)*f+Math.cos(walk.yaw)*s)*step;
        const dz=(-Math.cos(walk.yaw)*f-Math.sin(walk.yaw)*s)*step;
        if(homesteadWalkable(walk.x+dx,walk.z))walk.x+=dx;
        if(homesteadWalkable(walk.x,walk.z+dz))walk.z+=dz;
      }
      const y=homesteadGround(walk.x,walk.z)+HOMESTEAD_WALK.eye;
      camera.position.set(walk.x,y,walk.z);
      camera.lookAt(walk.x-Math.sin(walk.yaw)*Math.cos(walk.pitch),
        y+Math.sin(walk.pitch),walk.z-Math.cos(walk.yaw)*Math.cos(walk.pitch));
      sky.position.copy(camera.position);
      canvas.dataset.midianX=walk.x.toFixed(3);
      canvas.dataset.midianZ=walk.z.toFixed(3);
      canvas.dataset.midianY=y.toFixed(3);
      canvas.dataset.midianGround=homesteadGround(walk.x,walk.z).toFixed(3);
      canvas.dataset.midianYaw=walk.yaw.toFixed(3);
    }else{
      last=0;camera.position.set(9.7,6.3,12.1);
      camera.lookAt(0,1.25,0);
      sky.position.copy(camera.position);
    }
    if(!document.hidden)renderer.render(scene,camera);
    canvas.dataset.midianRendered='true';
    if(reducedMotion){ /* Static authored landscape; no artificial motion. */ }
  }
  canvas.dataset.midianWorld='homestead';
  canvas.dataset.midianMode='shot';
  const countMesh=(name:string)=>{
    let count=0;
    scene.traverse(node=>{if(node.name===name&&node instanceof THREE.Mesh)count++;});
    return count;
  };
  canvas.dataset.homesteadShelter='3d-woven-fabric-and-posts';
  canvas.dataset.homesteadDoor='walkable';
  canvas.dataset.homesteadHills='1';
  canvas.dataset.homesteadRidgeSectors=String(
    countMesh('midian-homestead-eroded-ridge-sector'));
  canvas.dataset.homesteadSky=String(countMesh('midian-homestead-atmospheric-skydome'));
  canvas.dataset.homesteadRoofPanels=String(countMesh('midian-shelter-woven-3d-roof'));
  // Witness actual Three.js shadow flags, not only a declared lighting mode.
  let roofCast=0,roofSelfShadow=0,bounceCount=0;
  scene.traverse(node=>{
    if(node instanceof THREE.Mesh&&node.name==='midian-shelter-woven-3d-roof'){
      if(node.castShadow)roofCast++;
      if(node.receiveShadow)roofSelfShadow++;
    }
    if(node instanceof THREE.DirectionalLight&&
      node.name==='midian-homestead-sand-bounce'&&!node.castShadow)bounceCount++;
  });
  canvas.dataset.homesteadRoofCastShadows=String(roofCast);
  canvas.dataset.homesteadRoofSelfShadows=String(roofSelfShadow);
  canvas.dataset.homesteadBounceLights=String(bounceCount);
  canvas.dataset.homesteadSidePanels=String(countMesh('midian-shelter-real-cloth-sidewall'));
  canvas.dataset.homesteadPosts=String(countMesh('shelter-structural-post'));
  canvas.dataset.homesteadFrontTrusses=String(countMesh('shelter-open-front-truss'));
  canvas.dataset.homesteadRockInstances=String(count);
  canvas.dataset.homesteadPebbleInstances=String(pebbles.count);
  canvas.dataset.homesteadPebbleDrawCalls=String(
    countMesh('homestead-instanced-small-ground-pebble'));
  canvas.dataset.homesteadRearGables=String(countMesh('shelter-solid-rear-gable'));
  canvas.dataset.homesteadRearGableTriangles=String((gable.index?.count||0)/3);
  // Count actual render triangles, not merely declared subdivision labels.
  canvas.dataset.homesteadRearDrapeFaces=String((rearGeo.index?.count||0)/3);
  canvas.dataset.homesteadWovenMatFaces=String((matGeo.index?.count||0)/3);
  canvas.dataset.homesteadStorageBaskets=String(
    countMesh('homestead-inner-storage-basket'));
  canvas.dataset.homesteadStorageRims=String(
    countMesh('homestead-inner-storage-rim'));
  canvas.dataset.homesteadWovenTexturePixels=String(size*size);
  canvas.dataset.homesteadWovenBumpScale=String(HOMESTEAD_WEAVE_DETAIL.bumpScale);
  // These are actual mesh/material map bindings, not declared feature flags.
  let bound=0;
  scene.traverse(o=>{
    if(o instanceof THREE.Mesh){
      for(const m of Array.isArray(o.material)?o.material:[o.material]){
        if(m instanceof THREE.MeshStandardMaterial&&m.map===weaveMap&&
          m.bumpMap===weaveMap)bound++;
      }
    }
  });
  canvas.dataset.homesteadWovenMaterialBindings=String(bound);
  frame=requestAnimationFrame(render);
  function dispose(){
    if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();reset();
    window.removeEventListener('keydown',keyDown);
    window.removeEventListener('keyup',keyUp);window.removeEventListener('blur',reset);
    canvas.removeEventListener('pointerdown',pointerDown);
    canvas.removeEventListener('pointermove',pointerMove);
    canvas.removeEventListener('pointerup',pointerUp);
    canvas.removeEventListener('pointercancel',pointerUp);
    const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
    scene.traverse(o=>{
      if(!(o instanceof THREE.Mesh))return;
      geometries.add(o.geometry);
      for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);
    });
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
    weaveMap.dispose(); // shared GPU image needs explicit cleanup on WebGL remount
    renderer.dispose();renderer.forceContextLoss();
    for(const name of Object.keys(canvas.dataset))if(name.startsWith('midian')||name.startsWith('homestead'))delete canvas.dataset[name];
  }
  return {setExplore,setMovement,dispose};
}
