/**
 * W11D — original rough-stone livestock trough for Exodus 2:16–17.
 * Artistic placement/material only; no archaeologically identified design.
 * The collision footprint is shared with MidianWell's walking controller.
 */
import * as THREE from 'three';

export const MIDIAN_TROUGH=Object.freeze({
  x:-2.9,z:-.35,halfX:1.9,halfZ:1.1,
});
const pseudo=(n:number)=>{const v=Math.sin(n*128.17+12.61)*43758.545;return v-Math.floor(v);};
export function makeMidianTroughStone(
  length:number,height:number,depth:number,seed:number,
):THREE.BufferGeometry{
  const x=length*.5,z=depth*.5;
  const chip=(i:number)=>(pseudo(seed*7+i*1.13)-.5)*.045;
  const v=[
    [-x,-height*.5,-z], [+x,-height*.5,-z],
    [+x,-height*.5,+z], [-x,-height*.5,+z],
    [-x+chip(1),height*.5+chip(4),-z],
    [+x+chip(2),height*.5+chip(5),-z],
    [+x+chip(3),height*.5+chip(6),+z],
    [-x+chip(7),height*.5+chip(8),+z],
  ];
  const faces=[
    [4,5,6,7],[0,3,2,1],[0,1,5,4],
    [1,2,6,5],[2,3,7,6],[3,0,4,7],
  ];
  const p:number[]=[],c:number[]=[];
  const stone=new THREE.Color(0xa49a87);
  const shades=[1.09,.7,.91,.98,.85,.94];
  for(let i=0;i<faces.length;i++){
    const f=faces[i],color=stone.clone().multiplyScalar(
      shades[i]*(.95+.11*pseudo(seed+i*.71)));
    for(const index of [f[0],f[1],f[2],f[0],f[2],f[3]]){
      p.push(...v[index]);
      c.push(color.r,color.g,color.b);
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));
  g.computeVertexNormals();
  return g;
}

export function addMidianTrough(scene:THREE.Scene,
  ground:(x:number,z:number)=>number):{stones:number}{
  const group=new THREE.Group();
  group.name='midian-rough-stone-watering-trough';
  group.position.set(MIDIAN_TROUGH.x,
    ground(MIDIAN_TROUGH.x,MIDIAN_TROUGH.z),
    MIDIAN_TROUGH.z);
  scene.add(group);
  const stoneMat=new THREE.MeshStandardMaterial({
    color:0xffffff,vertexColors:true,roughness:1,side:THREE.DoubleSide,
  });
  let count=0;
  const slab=(x:number,z:number,l:number,h:number,d:number,seed:number)=>{
    const m=new THREE.Mesh(makeMidianTroughStone(l,h,d,seed),stoneMat);
    m.position.set(x,.22+(pseudo(seed+1)-.5)*.016,z);
    m.rotation.y=(pseudo(seed+9)-.5)*.05;
    m.castShadow=count%3===0;m.receiveShadow=true;
    m.name='midian-hewn-water-trough-slab';
    group.add(m);count++;
  };
  // Eight individually shaped long-side stones and two end capitals.
  for(let side of [-1,1])for(let i=0;i<4;i++){
    slab(-1.045+i*.70,side*.395,.705,.40,.24,
      50+(side+1)*16+i);
  }
  slab(-1.45,0,.24,.41,1.02,103);
  slab(+1.45,0,.24,.41,1.02,107);
  // Separate sunken trough basin makes the water plane read as contained.
  const floor=new THREE.Mesh(new THREE.BoxGeometry(2.72,.15,.64),
    new THREE.MeshStandardMaterial({color:0x756d5e,roughness:1}));
  floor.position.set(0,-.025,0);floor.receiveShadow=true;
  floor.name='midian-trough-stone-floor';
  group.add(floor);
  const water=new THREE.Mesh(new THREE.BoxGeometry(2.59,.024,.53),
    new THREE.MeshPhysicalMaterial({color:0x526765,roughness:.39,
      metalness:0,clearcoat:.15,clearcoatRoughness:.42}));
  water.position.set(0,.12,0);
  water.name='midian-trough-contained-water';
  group.add(water);
  return {stones:count};
}
