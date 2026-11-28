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
 // Compressed fold beneath the head: fills the previous unsupported gap.
 const pillowGeo=new THREE.SphereGeometry(1,32,16);
 const pillowPos=pillowGeo.getAttribute('position');
 for(let i=0;i<pillowPos.count;i++){
  const x=pillowPos.getX(i),y=pillowPos.getY(i),z=pillowPos.getZ(i);
  pillowPos.setXYZ(i,-.211+.097*x,.109+.011*y+.0015*Math.sin(z*7)*Math.sin(x*5),.081*z);
 }
 pillowGeo.computeVertexNormals();
 const pillow=new THREE.Mesh(pillowGeo,under);pillow.name='W33b_head_support_fold';group.add(pillow);
 // Continuous tapered longitudinal surface, not overlapping ellipsoids.
 // Stations describe the silhouette of the concealed torso and legs.
 const profile=[[-.172,.023,.024],[-.125,.087,.080],[-.060,.100,.088],
  [.035,.098,.078],[.135,.083,.069],[.219,.062,.060],[.270,.032,.035],[.286,.010,.013]];
 // Nonuniform cubic interpolation without flat tangents at each station.
 // Limit slopes at extrema, preserving the original silhouette envelope.
 const slope=(i:number,k:number)=>{
  if(i===0)return (profile[1][k]-profile[0][k])/(profile[1][0]-profile[0][0]);
  if(i===profile.length-1)return (profile[i][k]-profile[i-1][k])/(profile[i][0]-profile[i-1][0]);
  const l=(profile[i][k]-profile[i-1][k])/(profile[i][0]-profile[i-1][0]);
  const r=(profile[i+1][k]-profile[i][k])/(profile[i+1][0]-profile[i][0]);
  return l*r>0?2*l*r/(l+r):0;
 };
 const pos:number[]=[],colors:number[]=[],indices:number[]=[];
 const rings=57,sides=48;
 for(let i=0;i<rings;i++){
  const x=THREE.MathUtils.lerp(profile[0][0],profile.at(-1)![0],i/(rings-1));
  let j=0;while(j<profile.length-2&&x>profile[j+1][0])j++;
  const a=profile[j],b=profile[j+1],dx=b[0]-a[0],t=(x-a[0])/dx,t2=t*t,t3=t2*t;
  const interp=(k:number)=>THREE.MathUtils.clamp((2*t3-3*t2+1)*a[k]+(t3-2*t2+t)*dx*slope(j,k)+(-2*t3+3*t2)*b[k]+(t3-t2)*dx*slope(j+1,k),Math.min(a[k],b[k]),Math.max(a[k],b[k]));
  const ry=interp(1),rz=interp(2);
  for(let k=0;k<sides;k++){
   const angle=2*Math.PI*k/sides,cy=Math.cos(angle),sz=Math.sin(angle);
   // Broad diagonal overlap ridges and finer restrained wrinkles.
   // Integer angular harmonics close exactly around the seam. Vary the
   // spacing and strength along the fabric instead of regular ribs.
   const phase=x*45+2*angle+1.1*Math.sin(x*17);
   const taper=THREE.MathUtils.smoothstep(x,-.172,-.10)*(1-THREE.MathUtils.smoothstep(x,.22,.286));
   const fold=taper*(.0032*Math.pow(.5+.5*Math.cos(phase),7)+.0012*Math.sin(x*109+3*angle));
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
 // Project facial lines on the actual sculpted head, rather than an
 // approximate ellipsoid that can bury or float the detail.
 head.updateMatrixWorld(true);
 const faceRay=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
 const facePoint=(x:number,z:number,offset:number)=>{
  faceRay.set(new THREE.Vector3(x,.5,z),down);
  const hit=faceRay.intersectObject(head,false)[0];
  if(!hit)throw Error('Infant facial feature outside head');
  return hit.point.add(new THREE.Vector3(0,offset,0));
 };
 const lidMat=new THREE.MeshStandardMaterial({color:0x916a55,roughness:1});
 for(const sign of [-1,1]){
  const points:THREE.Vector3[]=[];
  for(let i=0;i<=12;i++){
   const z=sign*(.019+i*.0017),x=-.240+.005*Math.sin(Math.PI*i/12);
   points.push(facePoint(x,z,.00065));
  }
  const lid=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),12,.00085,5,false),lidMat);
  lid.name='W33a_closed_lid';group.add(lid);
 }
 // A short, neutral closed mouth; no stylized smile or open lips.
 const lipPoints:THREE.Vector3[]=[];
 for(let i=0;i<=12;i++){
  const t=i/12,z=(t-.5)*.026,x=-.184+.0015*Math.cos(2*Math.PI*t);
  lipPoints.push(facePoint(x,z,.00055));
 }
 const mouth=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lipPoints),12,.00075,5,false),lidMat);
 mouth.name='W33b_closed_mouth';group.add(mouth);
 group.updateMatrixWorld(true);
 return group;
}
