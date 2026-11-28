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
  rearU:36,rearV:15,matU:28,matV:20,
});
/** W12D.7: gently draped rear wall inside existing physical rear-wall band.
 * Original artistic scene variation, NOT a reconstructed historic textile. */
export function homesteadRearDrapeOffset(x:number,v:number):number{
  const t=x+2.96;
  return .045+.061*Math.sin(t*2.8+v*.63)+
    .023*Math.sin(t*6.7-v*1.25)+.009*Math.cos(t*10.5+v*1.6);
}
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
/** W12D.6: soft aperiodic-looking yarn without a fixed checker grid.
 * All phase fields are INTEGER Fourier modes over the same 128px tile,
 * ensuring x/y edge continuity and one unchanged shared GPU texture.
 * This is visual material variation, not a specific historical fabric. */
export function homesteadWeaveIntensity(x:number,y:number):number{
  const unit=2*Math.PI/HOMESTEAD_WEAVE_DETAIL.size;
  const driftX=.85*Math.sin(unit*(x*2+y*3))+
    .35*Math.cos(unit*(x*5-y*2));
  const driftY=.68*Math.cos(unit*(y*3-x*2))+
    .23*Math.sin(unit*(y*5+x*4));
  const warp=Math.pow(.5+.5*Math.cos((x+driftX)*Math.PI/4),5);
  const weft=Math.pow(.5+.5*Math.cos((y+driftY)*Math.PI/4),5);
  const variation=.011*Math.sin(unit*(x*3+y*2))+
    .008*Math.cos(unit*(x*5-y*4))+
    .002*Math.sin(unit*(x*7+y*5));
  return Math.min(1,Math.max(.88,
    .950+.018*warp+.009*weft+variation));
}
/** W12D.5.1: fine ascending fibres following the actual curved basket body.
 * They deliberately avoid the dark horizontal metal-hoop silhouette from
 * W12D.5. Generic illustrative craft, not a dating/archaeology assertion. */
export const HOMESTEAD_BASKET_DETAIL=Object.freeze({
  strandsPerBasket:8,pathSamples:15,segments:48,tube:.011,
  skinOffset:.012,
});
/** One radius source for the lathed body and the ascending fibre detail. */
export const HOMESTEAD_BASKET_PROFILE=Object.freeze([
  {radius:.46,height:0},{radius:.75,height:.045},
  {radius:.96,height:.12},{radius:1,height:.30},
  {radius:.96,height:.78},{radius:.91,height:.97},
].map(p=>Object.freeze(p)));
/** Ascending path, not the horizontal hoop geometry rejected in W12D.5. */
export function homesteadBasketFibrePoint(t:number):{x:number;y:number;z:number}{
  const points=HOMESTEAD_BASKET_PROFILE;
  let radius=points[points.length-1].radius;
  for(let i=1;i<points.length;i++){
    const lo=points[i-1],hi=points[i];
    if(t<=hi.height){
      const f=Math.min(1,Math.max(0,(t-lo.height)/(hi.height-lo.height)));
      radius=lo.radius+(hi.radius-lo.radius)*f;break;
    }
  }
  const angle=-.17+.34*t+.025*Math.sin(t*8);
  const r=radius+HOMESTEAD_BASKET_DETAIL.skinOffset;
  return {x:r*Math.cos(angle),y:t,z:r*Math.sin(angle)};
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
  sx:number;sy:number;sz:number;tiltX:number;tiltZ:number;radius:number;
};
export function homesteadRockPoint(index:number):HomesteadRockPoint{
  const a=hash(index*7.1)*Math.PI*2,r=12+hash(index*6.2+3)*18;
  const x=Math.sin(a)*r,z=Math.cos(a)*r,size=.44+hash(index*2.14)*1.28;
  const sx=size*1.5,sy=size*.34,sz=size*.78;
  // The scaled radius-1 dodecahedron remains inside this sphere through
  // any of its three rotations; its horizontal projection is enclosed.
  return {index,x,z,a,size,sx,sy,sz,
    tiltX:.12*hash(index*2.5),tiltZ:.14*hash(index*.71),
    radius:Math.max(sx,sy,sz)};
}
export const HOMESTEAD_ROCK_COLLIDERS=Object.freeze(
  Array.from({length:HOMESTEAD_ROCK_COUNT},(_,i)=>homesteadRockPoint(i))
    // Include even edge stones whose visible footprint can reach the
    // walkable rectangle; a fixed centre-only margin silently missed some.
    .filter(r=>Math.abs(r.x)-r.radius<HOMESTEAD_WALK.maxX&&
      Math.abs(r.z)-r.radius<HOMESTEAD_WALK.maxZ)
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
/** W12E.0: one single continuous rear sheet. No rectangle/gable seam.
 * Top edge remains 55mm behind the roof silhouette; all cloth vertices
 * stay in the original rear-wall collision band. */
export function homesteadContinuousRearPoint(x:number,v:number):{x:number;y:number;z:number}{
  const t=Math.max(0,Math.min(1,v));
  const drift=homesteadRearDrapeOffset(x,Math.min(1,t*1.9));
  const lowerZ=-2.97+drift;
  const b=Math.max(0,Math.min(1,(t-.54)/.46));
  const smooth=b*b*(3-2*b);
  const z=lowerZ+((HOMESTEAD_REAR_GABLE_Z+.015)-lowerZ)*smooth;
  const floorY=homesteadGround(x,z)+.025;
  const roofY=homesteadRearGableTop(x);
  return {x,y:floorY+(roofY-floorY)*t,z};
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
    // W12F.1: the old 0.78-scaled ellipse missed visible, above-ground
    // corners on every tested boulder. This conservative world-space
    // circle encloses the actual instanced mesh under yaw/pitch/roll.
    // Small visitor clearance also avoids camera-centre edge grazing.
    if(Math.hypot(x-rock.x,z-rock.z)<rock.radius+.12)return false;
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
  // W12E.0: ONE continuous rear cloth from ground to the actual roof
  // profile. The separate rectangular curtain plus triangular gable created
  // an unavoidable hard horizontal lighting/UV seam, even after attempting
  // limited optical blending in rejected detached W12D.8.
  // The single mesh spans the entire wall with shared vertices and normals.
  const rearGeo=new THREE.BufferGeometry();
  const rearPos:number[]=[],rearColours:number[]=[],rearUV:number[]=[],rearIdx:number[]=[];
  const rearU=HOMESTEAD_TEXTILE_DETAIL.rearU,rearV=HOMESTEAD_TEXTILE_DETAIL.rearV;
  for(let i=0;i<=rearU;i++){
    const x=-2.96+5.92*i/rearU;
    for(let j=0;j<=rearV;j++){
      const v=j/rearV;
      const pt=homesteadContinuousRearPoint(x,v);
      rearPos.push(pt.x,pt.y,pt.z);
      const t=x+2.96;
      const shade=.933+.042*Math.cos(t*3.0+v*.65)+
        .020*Math.sin(t*6.8-v*1.1);
      rearColours.push(shade,shade*.985,shade*.961);
      rearUV.push(i/rearU,v*((homesteadRearGableTop(x)-
        homesteadGround(x,-2.97))/2.3));
      if(i>0&&j>0){
        const c=i*(rearV+1)+j;
        const p=c-(rearV+1);
        rearIdx.push(p-1,c-1,p,p,c-1,c);
      }
    }
  }
  rearGeo.setAttribute('position',new THREE.Float32BufferAttribute(rearPos,3));
  rearGeo.setAttribute('color',new THREE.Float32BufferAttribute(rearColours,3));
  rearGeo.setAttribute('uv',new THREE.Float32BufferAttribute(rearUV,2));
  rearGeo.setIndex(rearIdx);rearGeo.computeVertexNormals();
  const rearCanvas=new THREE.Mesh(rearGeo,woven(0xa58e77));
  rearCanvas.castShadow=true;rearCanvas.receiveShadow=true;
  rearCanvas.name='shelter-continuous-rear-canvas';
  pivot.add(rearCanvas);
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
  const storageProfile=HOMESTEAD_BASKET_PROFILE.map(
    p=>new THREE.Vector2(p.radius,p.height));
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

  // Subtle freehand ascending fibres follow each true lathe body's profile.
  // Unlike the rejected W12D.5 horizontal hoops, this is sparse, fine and
  // does not form evenly stacked rings. One shared instanced draw call.
  const strandPoints:THREE.Vector3[]=[];
  for(let i=0;i<HOMESTEAD_BASKET_DETAIL.pathSamples;i++){
    const t=.12+.79*i/(HOMESTEAD_BASKET_DETAIL.pathSamples-1);
    const p=homesteadBasketFibrePoint(t);
    strandPoints.push(new THREE.Vector3(p.x,p.y,p.z));
  }
  const strandCurve=new THREE.CatmullRomCurve3(strandPoints,false,'centripetal');
  const strandGeo=new THREE.TubeGeometry(strandCurve,
    HOMESTEAD_BASKET_DETAIL.segments,HOMESTEAD_BASKET_DETAIL.tube,5,false);
  const strandCount=HOMESTEAD_INTERIOR_STORAGE.length*
    HOMESTEAD_BASKET_DETAIL.strandsPerBasket;
  const strands=new THREE.InstancedMesh(strandGeo,mat(0x806044),strandCount);
  const fibreTransform=new THREE.Object3D();
  let fibreIndex=0;
  for(const [basketIndex,prop] of HOMESTEAD_INTERIOR_STORAGE.entries()){
    const ground=homesteadGround(prop.x,prop.z);
    for(let s=0;s<HOMESTEAD_BASKET_DETAIL.strandsPerBasket;s++){
      const angle=s*2*Math.PI/HOMESTEAD_BASKET_DETAIL.strandsPerBasket+
        .035*Math.sin(s*2.3+basketIndex);
      fibreTransform.position.set(prop.x,ground,prop.z);
      fibreTransform.rotation.set(0,angle,0);
      fibreTransform.scale.set(prop.radius,prop.height,prop.radius);
      fibreTransform.updateMatrix();
      strands.setMatrixAt(fibreIndex++,fibreTransform.matrix);
    }
  }
  strands.instanceMatrix.needsUpdate=true;
  strands.castShadow=false;strands.receiveShadow=false;
  strands.name='homestead-inner-storage-ascending-fibres';
  pivot.add(strands);

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
  let exploring=false,paused=false,disposed=false,last=0,frame=0,dragId:number|null=null,lastX=0,lastY=0;
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
    if(!exploring||paused||e.altKey||e.ctrlKey||e.metaKey)return;
    const d=key(e.key);if(!d)return;e.preventDefault();moving[d]=true;
  };
  const keyUp=(e:KeyboardEvent)=>{
    if(!exploring)return;const d=key(e.key);if(!d)return;e.preventDefault();moving[d]=false;
  };
  function setExplore(on:boolean){
    if(disposed)return;
    exploring=on;paused=false;reset();last=0;
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
  function setMovement(d:MidianDirection,on:boolean){moving[d]=on&&exploring&&!paused;}
  function setPaused(on:boolean){if(disposed)return;paused=on;reset();dragId=null;}
  function turn(dx:number,dy:number){
    if(!exploring)return;
    walk.yaw-=THREE.MathUtils.clamp(dx,-140,140)*.0038;
    walk.pitch=THREE.MathUtils.clamp(walk.pitch-THREE.MathUtils.clamp(dy,-120,120)*.003,-.68,.55);
  }
  function pointerDown(e:PointerEvent){
    if(!exploring||paused||e.button!==0||dragId!==null||
       (e.pointerType==='touch'&&!e.isPrimary))return;
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
      if(!paused&&mag>0){
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
  canvas.dataset.homesteadRearGables=String(countMesh('shelter-continuous-rear-canvas'));
  canvas.dataset.homesteadRearGableTriangles=String((rearGeo.index?.count||0)/3);
  canvas.dataset.homesteadContinuousRearPanels=String(
    countMesh('shelter-continuous-rear-canvas'));
  canvas.dataset.homesteadDiscardedRearSeamMeshes=String(
    countMesh('shelter-rear-cloth')+countMesh('shelter-solid-rear-gable'));
  // Count actual render triangles, not merely declared subdivision labels.
  canvas.dataset.homesteadRearDrapeFaces=String((rearGeo.index?.count||0)/3);
  canvas.dataset.homesteadWovenMatFaces=String((matGeo.index?.count||0)/3);
  canvas.dataset.homesteadStorageBaskets=String(
    countMesh('homestead-inner-storage-basket'));
  canvas.dataset.homesteadStorageRims=String(
    countMesh('homestead-inner-storage-rim'));
  canvas.dataset.homesteadStorageStrands=String(strands.count);
  canvas.dataset.homesteadStorageStrandDrawCalls=String(
    countMesh('homestead-inner-storage-ascending-fibres'));
  canvas.dataset.homesteadStorageRejectedHoops=String(
    countMesh('homestead-inner-storage-woven-bands'));
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
  return {setExplore,setMovement,setPaused,dispose};
}
