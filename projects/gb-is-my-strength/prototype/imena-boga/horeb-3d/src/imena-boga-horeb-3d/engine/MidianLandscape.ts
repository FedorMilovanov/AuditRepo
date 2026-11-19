/**
 * W11B: original low-draw-call arid terrain scenery, not an excavated
 * or geolocated reconstruction of Exodus 2.
 */
import * as THREE from 'three';
const hash=(n:number)=>{const v=Math.sin(n*127.19+23.72)*43758.5;return v-Math.floor(v);};
const UP=new THREE.Vector3(0,1,0);
const START={x:5.2,z:7.6};
export function midianApproachClearance(x:number,z:number):number{
  const t=Math.max(0,Math.min(1,(x*START.x+z*START.z)/
    (START.x*START.x+START.z*START.z)));
  return Math.hypot(x-START.x*t,z-START.z*t);
}
export function midianScrubPoint(index:number):{x:number;z:number;size:number}|null{
  const a=hash(index*3.19+16)*Math.PI*2,r=5.4+hash(index*4.9+11)*18.5;
  const x=Math.cos(a)*r,z=Math.sin(a)*r;
  if(Math.hypot(x,z)<4.2||midianApproachClearance(x,z)<2.55)return null;
  return {x,z,size:.42+hash(index*9.9+4)*.92};
}
/** W12E.2: a few broad, geographically *unclaimed* arid massifs,
 * not a continuous 360-degree mountain wall or a row of periodic peaks.
 * Wrapped angular distance guarantees identical first and last ring columns.
 * Near and far terrain must remain separated by genuine low valleys, while
 * full-circle geometry prevents an empty horizon as the visitor turns. */
const MIDIAN_RIDGE_MASSIFS=Object.freeze({
  near:Object.freeze([
    Object.freeze({angle:.25,amplitude:4.1,width:.40}),
    Object.freeze({angle:1.47,amplitude:2.8,width:.304}),
    Object.freeze({angle:2.78,amplitude:5.5,width:.416}),
    Object.freeze({angle:3.47,amplitude:3.8,width:.336}),
    Object.freeze({angle:5.20,amplitude:5.3,width:.44}),
  ]),
  far:Object.freeze([
    Object.freeze({angle:.65,amplitude:3.0,width:.44}),
    Object.freeze({angle:2.00,amplitude:4.2,width:.54}),
    Object.freeze({angle:3.93,amplitude:7.6,width:.54}),
    Object.freeze({angle:5.55,amplitude:4.9,width:.52}),
  ]),
});
export function midianRidgeProfile(angle:number,depth:number):{height:number;radius:number}{
  const distant=depth>50;
  const peaks=distant?MIDIAN_RIDGE_MASSIFS.far:MIDIAN_RIDGE_MASSIFS.near;
  let height=distant?1.25:.45;
  for(const peak of peaks){
    const delta=Math.atan2(Math.sin(angle-peak.angle),
      Math.cos(angle-peak.angle));
    height+=peak.amplitude*Math.exp(-.5*(delta/peak.width)**2);
  }
  const phase=distant?1.37:.43;
  const radius=depth+1.35*Math.sin(3*angle+phase)+
    .55*Math.cos(7*angle-.2*phase);
  return {height,radius};
}
export function midianRockTone(index:number):number{
  return .24+.64*hash(index*2.93+19.1);
}
function ridgeRing(scene:THREE.Scene,depth:number,tint:number):void{
  const count=150,vertices:number[]=[],colors:number[]=[],indices:number[]=[];
  const low=new THREE.Color(tint),crest=low.clone().lerp(new THREE.Color(0xd0bea3),.23);
  for(let i=0;i<=count;i++){
    const a=2*Math.PI*i/count;
    const profile=midianRidgeProfile(a,depth);
    for(let row=0;row<4;row++){
      const t=row/3,r=profile.radius-(4.9+.55*Math.cos(3*a+.7))*t;
      const y=row===0?-4:row===1?.17:row===2?profile.height*.57:profile.height;
      vertices.push(Math.cos(a)*r,y,Math.sin(a)*r);
      const c=low.clone().lerp(crest,t*.81);
      c.multiplyScalar(.94+.055*Math.sin(a*7+row*.4)+
        .02*Math.cos(a*13+.3*row));
      colors.push(c.r,c.g,c.b);
    }
    if(i>0)for(let row=0;row<3;row++){
      const a0=(i-1)*4+row,b0=i*4+row;
      indices.push(a0,b0,a0+1,a0+1,b0,b0+1);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  geo.setIndex(indices);geo.computeVertexNormals();
  const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({
    vertexColors:true,roughness:1,side:THREE.DoubleSide,
  }));
  mesh.name='midian-geometric-sandstone-horizon';
  mesh.receiveShadow=true;scene.add(mesh);
}
export type MidianRockInstance={index:number;x:number;z:number;k:number;sx:number;sy:number;sz:number;ry:number;rx:number;rz:number};
export function midianRockPoint(index:number):MidianRockInstance|null{
  const angle=hash(index*5.7)*Math.PI*2,r=16+hash(index*4.3+18)*13;
  const x=Math.cos(angle)*r,z=Math.sin(angle)*r*1.07;
  if(Math.abs(x)>27||Math.abs(z)>31||midianApproachClearance(x,z)<3)return null;
  const k=.34+hash(index*1.97+7)*1.35;
  const sx=k*(.9+hash(index*1.31)*.6);
  const sy=k*(.46+hash(index*3.17)*.23);
  const sz=k*(.8+hash(index*.83)*.51);
  return {index,x,z,k,sx,sy,sz,ry:hash(index*.77)*Math.PI*2,
    // Ellipse approximates the real rotated rock; conservative for walking.
    rx:sx*.68,rz:sz*.68};
}
/** Only instances near the physical walking region matter to collision. */
export const MIDIAN_ROCK_COLLIDERS=Object.freeze(
  Array.from({length:145},(_,i)=>midianRockPoint(i)).filter(
    (r):r is MidianRockInstance=>r!==null&&
      Math.abs(r.x)<19.7&&Math.abs(r.z)<23.7),
);

export function addMidianLandscape(scene:THREE.Scene,ground:(x:number,z:number)=>number):
  {ridges:number;rocks:number;scrubs:number;twigs:number}{
  // Two complete rings prevent scenery vanishing when the player turns.
  ridgeRing(scene,42,0x99816d);ridgeRing(scene,61,0xbcae9f);
  // W12E.2: un-subdivided facets avoid polished oval potato silhouettes.
  const rockGeom=new THREE.DodecahedronGeometry(1,0);
  const rockMat=new THREE.MeshStandardMaterial({color:0x9d8b75,roughness:1});
  const rocks=new THREE.InstancedMesh(rockGeom,rockMat,145);
  rocks.name='midian-detrital-rock-instances';
  const rockDark=new THREE.Color(0x98836d),rockLight=new THREE.Color(0xc5b19a);
  const instanceTone=new THREE.Color();
  const dummy=new THREE.Object3D();
  let rockCount=0;
  for(let i=0;i<145;i++){
    const rock=midianRockPoint(i);
    if(!rock)continue;
    dummy.position.set(rock.x,ground(rock.x,rock.z)+rock.k*.18,rock.z);
    dummy.rotation.set(.08*hash(i*2.6),rock.ry,.12*hash(i*1.9));
    dummy.scale.set(rock.sx,rock.sy,rock.sz);
    dummy.updateMatrix();rocks.setMatrixAt(rockCount,dummy.matrix);
    instanceTone.copy(rockDark).lerp(rockLight,midianRockTone(i));
    rocks.setColorAt(rockCount,instanceTone);
    rockCount++;
  }
  rocks.count=rockCount;rocks.instanceMatrix.needsUpdate=true;
  if(rocks.instanceColor)rocks.instanceColor.needsUpdate=true;
  rocks.receiveShadow=true;scene.add(rocks);
  // Thin woody shrubs, not trees with identical solid spherical crowns.
  const points=Array.from({length:76},(_,i)=>midianScrubPoint(i))
    .filter((v):v is NonNullable<typeof v>=>v!==null);
  const branches=6,leaves=5;
  const twig=new THREE.InstancedMesh(new THREE.CylinderGeometry(.006,.017,1,5),
    new THREE.MeshStandardMaterial({color:0x6b6250,roughness:1}),points.length*branches);
  const leaf=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),
    new THREE.MeshStandardMaterial({color:0x74755a,roughness:1,side:THREE.DoubleSide}),
    points.length*leaves);
  twig.name='midian-scrub-twigs';leaf.name='midian-scrub-tiny-leaves';
  for(let i=0;i<points.length;i++){
    const p=points[i],y=ground(p.x,p.z);
    for(let k=0;k<branches;k++){
      const angle=Math.PI*2*k/branches+.4*hash(i*3.1+k);
      const reach=p.size*(.28+.30*hash(i*7.3+k*1.8));
      const start=new THREE.Vector3(p.x,y+.05,p.z);
      const end=new THREE.Vector3(p.x+Math.cos(angle)*reach,
        y+p.size*(.34+.34*hash(i+k*2.31)),p.z+Math.sin(angle)*reach);
      const delta=end.clone().sub(start);
      dummy.position.copy(start).add(end).multiplyScalar(.5);
      dummy.quaternion.setFromUnitVectors(UP,delta.clone().normalize());
      dummy.scale.set(1,delta.length(),1);dummy.updateMatrix();
      twig.setMatrixAt(i*branches+k,dummy.matrix);
    }
    for(let k=0;k<leaves;k++){
      const angle=Math.PI*2*k/leaves+.3*hash(i+k);
      const reach=p.size*(.31+.23*hash(i*9.11+k*1.43));
      dummy.position.set(p.x+Math.cos(angle)*reach,
        y+p.size*(.37+.21*hash(i*2.7+k)),p.z+Math.sin(angle)*reach);
      dummy.rotation.set(hash(i+k*3)*.5,angle,hash(i*4+k)*.5);
      dummy.scale.set(.09*p.size,.05*p.size,.15*p.size);dummy.updateMatrix();
      leaf.setMatrixAt(i*leaves+k,dummy.matrix);
    }
  }
  twig.instanceMatrix.needsUpdate=true;leaf.instanceMatrix.needsUpdate=true;
  scene.add(twig,leaf);
  return {ridges:2,rocks:rockCount,scrubs:points.length,twigs:points.length*branches};
}