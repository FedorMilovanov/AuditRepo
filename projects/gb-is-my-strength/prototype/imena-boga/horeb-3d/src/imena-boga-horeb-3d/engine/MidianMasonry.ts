/**
 * W11C — an original modular stone well for the Midian research pilot.
 * These forms are scenic approximations: Exodus 2 names a well but does not
 * establish its material, site, masonry pattern, dimensions or period.
 * 96 individually shaped, irregular annular stones replace orthogonal bricks.
 */
import * as THREE from 'three';

export const MIDIAN_COURSE_COUNTS=[22,24,24] as const;
export const MIDIAN_COPING_COUNT=26;
export const MIDIAN_STONE_TOTAL=MIDIAN_COURSE_COUNTS.reduce((n,v)=>n+v,0)+MIDIAN_COPING_COUNT;
const pseudo=(seed:number)=>{const x=Math.sin(seed*127.19+23.72)*43758.5;return x-Math.floor(x);};

/** A physically volumetric annular wedge with separate, flat-shaded faces. */
export function makeMidianStoneGeometry(
  inner:number,outer:number,angle0:number,angle1:number,
  bottom:number,top:number,seed:number,
):THREE.BufferGeometry{
  const gap=.010+(.007*pseudo(seed+11));
  const a=angle0+gap,b=angle1-gap;
  const rInner=inner*(1+(pseudo(seed+2)-.5)*.018);
  const rOuter=outer*(1+(pseudo(seed+3)-.5)*.018);
  const base=bottom+(pseudo(seed+4)-.5)*.014;
  const upper=top+(pseudo(seed+5)-.5)*.025;
  const corner=(r:number,angle:number,y:number)=>
    [Math.cos(angle)*r,y,Math.sin(angle)*r] as const;
  // Per-corner chips break the perfect flat coping silhouette while
  // preserving the same stone course and its collision envelope.
  const topHeights=[6,7,8,9].map((k)=>upper+(pseudo(seed+k)-.5)*.039);
  const v=[
    corner(rInner,a,base),corner(rOuter,a,base),
    corner(rOuter,b,base),corner(rInner,b,base),
    corner(rInner,a,topHeights[0]),
    corner(rOuter,a,topHeights[1]),
    corner(rOuter,b,topHeights[2]),
    corner(rInner,b,topHeights[3]),
  ];
  const sides=[
    [4,5,6,7], // top
    [1,2,6,5], // outward face
    [3,0,4,7], // inward face
    [0,1,5,4], // first radial edge
    [2,3,7,6], // second radial edge
    [3,2,1,0], // bottom
  ];
  const positions:number[]=[],colors:number[]=[];
  const baseTone=new THREE.Color(0xa49b8d);
  const seedTint=.91+.15*pseudo(seed+.43);
  const factors=[1.09,.97,.78,.87,.9,.69];
  for(let face=0;face<sides.length;face++){
    const p=sides[face];
    const shade=seedTint*factors[face];
    const c=baseTone.clone().multiplyScalar(shade);
    for(const idx of [p[0],p[1],p[2],p[0],p[2],p[3]]){
      positions.push(...v[idx]);
      colors.push(c.r,c.g,c.b);
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  g.computeVertexNormals();
  return g;
}

/** Creates a hollow well, inset masonry shaft and restrained dark water. */
export function addMidianWellMasonry(parent:THREE.Group):{stones:number}{
  const material=new THREE.MeshStandardMaterial({
    color:0xffffff,vertexColors:true,roughness:1,metalness:0,
    side:THREE.DoubleSide,
  });
  let stones=0;
  const make=(r0:number,r1:number,low:number,high:number,first:number,
    count:number,course:number)=>{
    for(let i=0;i<count;i++){
      const a=2*Math.PI*(i+first)/count,b=2*Math.PI*(i+1+first)/count;
      const block=new THREE.Mesh(makeMidianStoneGeometry(
        r0,r1,a,b,low,high,course*100+i),material);
      block.name='midian-rough-hewn-ring-stone';
      block.receiveShadow=true;block.castShadow=i%4===0;
      parent.add(block);stones++;
    }
  };
  MIDIAN_COURSE_COUNTS.forEach((count,row)=>
    make(.985,1.34,.11+row*.271,.361+row*.271,row%2*.46,count,row));
  make(.94,1.41,.928,1.119,.16,MIDIAN_COPING_COUNT,4);
  // An inset hollow wall and water well below the coping create real depth.
  const interior=new THREE.Mesh(
    new THREE.CylinderGeometry(.957,.957,1.55,64,1,true),
    new THREE.MeshStandardMaterial({color:0x574e45,roughness:1,side:THREE.DoubleSide}),
  );
  interior.name='midian-well-inner-stone-shaft';
  interior.position.y=.18;parent.add(interior);
  const water=new THREE.Mesh(
    new THREE.CylinderGeometry(.95,.95,.03,64),
    new THREE.MeshStandardMaterial({color:0x263c40,roughness:.31,metalness:0}),
  );
  water.name='midian-well-recessed-water';
  water.position.y=-.565;parent.add(water);
  return {stones};
}
