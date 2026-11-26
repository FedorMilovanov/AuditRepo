import * as THREE from 'three';

// Original, static look-development sculpture. No portrait, age diagnosis,
// medical simulation, or claim about the precise historical wrapping method.
export function createNileInfantStudy(){
 const group=new THREE.Group();group.name='W33a_wrapped_infant_study';
 const linen=new THREE.MeshStandardMaterial({color:0xc9bb9e,roughness:.98,vertexColors:true});
 const under=new THREE.MeshStandardMaterial({color:0x9e8a68,roughness:1});
 const skin=new THREE.MeshStandardMaterial({color:0xb78363,roughness:.83});
 // A supported layer over the actual woven floor (top .0862 m).
 const padGeo=new THREE.SphereGeometry(1,32,16);
 const pad=padGeo.getAttribute('position');
 for(let i=0;i<pad.count;i++){
  const x=pad.getX(i),y=pad.getY(i),z=pad.getZ(i);
  pad.setXYZ(i,.273*x,.0865+.024*(y+1)/2,.121*z);
 }
 padGeo.computeVertexNormals();
 const bedding=new THREE.Mesh(padGeo,under);bedding.name='W33a_floor_linen';group.add(bedding);
 // Continuous tapered longitudinal surface, not overlapping ellipsoids.
 // Stations describe the silhouette of the concealed torso and legs.
 const profile=[[-.172,.023,.024],[-.125,.087,.080],[-.060,.100,.088],
  [.035,.098,.078],[.135,.083,.069],[.219,.062,.060],[.270,.032,.035],[.286,.010,.013]];
 const pos:number[]=[],colors:number[]=[],indices:number[]=[];
 const rings=57,sides=48;
 for(let i=0;i<rings;i++){
  const x=THREE.MathUtils.lerp(profile[0][0],profile.at(-1)![0],i/(rings-1));
  let j=0;while(j<profile.length-2&&x>profile[j+1][0])j++;
  const a=profile[j],b=profile[j+1],t=(x-a[0])/(b[0]-a[0]),u=t*t*(3-2*t);
  const ry=THREE.MathUtils.lerp(a[1],b[1],u),rz=THREE.MathUtils.lerp(a[2],b[2],u);
  for(let k=0;k<sides;k++){
   const angle=2*Math.PI*k/sides,cy=Math.cos(angle),sz=Math.sin(angle);
   // Broad diagonal overlap ridges and finer restrained wrinkles.
   const phase=x*57+angle*1.7;
   const fold=.0042*Math.pow(.5+.5*Math.cos(phase),6)+.0015*Math.sin(x*109+angle*3);
   const y=.111+ry+(ry+fold)*cy,z=(rz+fold)*sz+.003*Math.sin(x*19);
   pos.push(x,Math.max(.110,y),z);
   const c=1-.12*Math.pow(.5+.5*Math.sin(phase),7)+.018*Math.cos(x*113+angle*5);
   colors.push(c,c*.995,c*.975);
   if(i<rings-1){const n=i*sides+k,m=i*sides+(k+1)%sides;indices.push(n,m,n+sides,m,m+sides,n+sides);}
  }
 }
 for(const i of [0,rings-1]){
  const center=pos.length/3;pos.push(profile[i===0?0:profile.length-1][0],.111+profile[i===0?0:profile.length-1][1],0);colors.push(1,1,1);
  for(let k=0;k<sides;k++){const a=i*sides+k,b=i*sides+(k+1)%sides;if(i===0)indices.push(center,b,a);else indices.push(center,a,b);}
 }
 const bodyGeo=new THREE.BufferGeometry();bodyGeo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
 bodyGeo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));bodyGeo.setIndex(indices);bodyGeo.computeVertexNormals();
 const body=new THREE.Mesh(bodyGeo,linen);body.name='W33a_folded_swaddle';group.add(body);
 // Head in supine posture. Sculpt restrained forehead, cheeks, chin and
 // nasal bridge into one surface; no adult mesh scaled down.
 const headGeo=new THREE.SphereGeometry(1,48,32),p=headGeo.getAttribute('position');
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
  const face=Math.max(0,y);
  const nose=.012*Math.exp(-((x+.05)**2/.025+z*z/.018))*face**5;
  const cheek=.004*Math.exp(-((x-.10)**2/.16+(Math.abs(z)-.50)**2/.08))*face**3;
  const chin=.005*Math.exp(-((x-.67)**2/.10+z*z/.23))*face**2;
  p.setXYZ(i,-.216+x*.081,.186+y*.073+nose+cheek+chin,z*.063*(1-.12*Math.max(0,x)));
 }
 headGeo.computeVertexNormals();
 const head=new THREE.Mesh(headGeo,skin);head.name='W33a_head_sculpt';group.add(head);
 // The overlap at the neck is intended wrapping contact. The two tiny
 // closed eyelid arcs read only in a close shot, not as open cartoon eyes.
 const lidMat=new THREE.MeshStandardMaterial({color:0x815e4c,roughness:1});
 for(const sign of [-1,1]){
  const points:THREE.Vector3[]=[];
  for(let i=0;i<=12;i++){
   const z=sign*(.019+i*.0017),x=-.240+.005*Math.sin(Math.PI*i/12);
   const qx=(x+.216)/.081,qz=z/.063,y=.186+.073*Math.sqrt(Math.max(0,1-qx*qx-qz*qz))+.0008;
   points.push(new THREE.Vector3(x,y,z));
  }
  const lid=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),12,.00085,5,false),lidMat);
  lid.name='W33a_closed_lid';group.add(lid);
 }
 group.updateMatrixWorld(true);
 return group;
}
