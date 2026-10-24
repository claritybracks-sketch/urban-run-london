import * as THREE from 'https://esm.sh/three@0.161.0';

// URBAN RUN original, brand-safe procedural footwear (concept-quality v0.2).
const mat=(c,r=.78,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const U=mat(0x161719,.94), S=mat(0x303237,.72), D=mat(0x090a0b,.96), MID=mat(0x23252a,.74), EDGE=mat(0x4b4e53,.66), LACE=mat(0x505158,.94), AIR=mat(0x181d22,.3,.15);
function add(group,geometry,material,x=0,y=0,z=0){const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);group.add(mesh);return mesh}
function tube(group,pts,r,material){return add(group,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p))),Math.max(12,pts.length*5),r,5,false),material)}
function part(group,w,h,d,x,y,z,material){return add(group,new THREE.BoxGeometry(w,h,d),material,x,y,z)}
// Cross-section mesh: z runs heel (-) to toe (+); anatomically tapered at heel/toe.
const sections=[[-.94,.18],[-.83,.31],[-.61,.39],[-.24,.415],[.14,.41],[.47,.37],[.72,.30],[.92,.16],[.97,.025]];
function shell(group,height,baseY,material,mode='upper'){
 const rings=sections.length, around=16, verts=[],uv=[],indices=[];
 for(let i=0;i<rings;i++){const [z,w]=sections[i];for(let j=0;j<around;j++){
 const a=j/around*Math.PI*2; const x=Math.cos(a)*w;
 const roof=mode==='upper' ? (height*(.55+.45*Math.sin(Math.PI*(i/(rings-1))))) : height;
 const y=baseY+(Math.sin(a)+1)*.5*roof;
 verts.push(x,y,z);uv.push(j/around,i/(rings-1));
 }}
 for(let i=0;i<rings-1;i++)for(let j=0;j<around;j++){const a=i*around+j,b=i*around+(j+1)%around,c=(i+1)*around+j,d=(i+1)*around+(j+1)%around;indices.push(a,b,c,b,d,c)}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
 return add(group,geo,material);
}
function footwear(type){
 const g=new THREE.Group(),tuned=type==='current';
 shell(g,.14,.04,D,'sole');
 shell(g,.07,.15,MID,'sole');
 shell(g,.25,.21,U,'upper');
 // Rubber outsole tread marks with side blocks
 for(const s of [-1,1]){
 for(let i=0;i<7;i++){let z=-.7+i*.235;let width=sections.reduce((a,b)=>Math.abs(b[0]-z)<Math.abs(a[0]-z)?b:a)[1];part(g,.038,.035,.095,s*(width+.005),.095,z,S)}
 // Layered side overlays or sculpted ribs: an original silhouette, no borrowed signature logos.
 if(tuned){
 for(let i=0;i<6;i++){let z=-.7+i*.235;const w=.32+(.05*Math.sin((i/6)*Math.PI));tube(g,[[s*w,.27,z-.085],[s*(w+.026),.43,z],[s*(w-.06),.48,z+.10]],.026,i%2?MID:S)}
 tube(g,[[s*.30,.22,-.82],[s*.38,.24,-.33],[s*.375,.23,.24],[s*.27,.20,.73]],.023,EDGE);
 }else{
 for(let layer=0;layer<3;layer++){let yy=.27+layer*.073;let x=.34-layer*.055;
 tube(g,[[s*.25,yy,-.79],[s*x,yy+.01,-.49],[s*(x+.025),yy+.03,-.06],[s*x,yy+.02,.39],[s*.21,yy,.76]],.027,layer===1?S:MID)}
 tube(g,[[s*.25,.25,-.84],[s*.38,.27,-.53],[s*.405,.27,-.02],[s*.35,.245,.42],[s*.21,.22,.78]],.022,EDGE);
 }
 // Heel reinforcement
 tube(g,[[s*.22,.33,-.78],[s*.26,.47,-.69],[s*.235,.48,-.51]],.033,S);
 }
 // Tongue, eyelets and individual crossed laces
 const tongue=add(g,new THREE.BoxGeometry(.29,.05,.87),MID,0,.47,-.20);tongue.rotation.x=-.09;
 for(let i=0;i<6;i++){const z=-.58+i*.14;
 const p1=[-.15,.51,z],p2=[.15,.51,z+.075],p3=[.15,.51,z],p4=[-.15,.51,z+.075];
 tube(g,[p1,p2],.012,LACE);tube(g,[p3,p4],.012,LACE);
 for(let s of [-1,1])add(g,new THREE.TorusGeometry(.016,.006,5,10),EDGE,s*.16,.505,z).rotation.x=Math.PI/2;
 }
 // Rounded toe bumper
 tube(g,[[-.22,.27,.77],[-.16,.26,.88],[0,.26,.94],[.16,.26,.88],[.22,.27,.77]],.027,S);
 if(tuned){
 // Distinct three-channel outsole windows (no branding)
 for(let i=0;i<3;i++){const z=-.59+i*.56;part(g,.18,.07,.22,-.28,.175,z,AIR);part(g,.18,.07,.22,.28,.175,z,AIR)}
 }else{
 // Midsole groove
 for(let s of [-1,1])tube(g,[[s*.24,.17,-.76],[s*.39,.17,-.30],[s*.39,.17,.20],[s*.23,.17,.78]],.012,S);
 }
 return g;
}
function pair(type){const group=new THREE.Group();const left=footwear(type);left.position.x=-.48;left.rotation.y=-.18;const right=footwear(type);right.position.x=.48;right.rotation.y=.13;group.add(left,right);return group}
export function createRidge95(){return pair('ridge')}
export function createCurrent110(){return pair('current')}
function limb(group,a,b,top,bottom,material){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),v=new THREE.Vector3().subVectors(vb,va);const mesh=add(group,new THREE.CylinderGeometry(top,bottom,v.length(),16),material);mesh.position.copy(va.add(vb).multiplyScalar(.5));mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return mesh}
export function createCircuitTracksuit(){
 const g=new THREE.Group();
 const torso=add(g,new THREE.CylinderGeometry(.36,.43,.92,16),U,0,1.96,0);torso.scale.z=.68;
 const hood=add(g,new THREE.TorusGeometry(.29,.12,12,24,Math.PI*1.65),MID,0,2.54,-.1);hood.rotation.z=Math.PI*.18;
 for(const side of [-1,1]){
  limb(g,[side*.38,2.30,0],[side*.58,1.48,0],.15,.115,U);
  limb(g,[side*.22,1.46,0],[side*.22,.16,0],.21,.12,U);
  part(g,.14,.09,.24,side*.58,1.49,0,MID);
  part(g,.24,.09,.24,side*.22,.14,0,MID);
  tube(g,[[side*.30,2.23,.12],[side*.40,1.97,.10],[side*.42,1.66,.10]],.012,S);
  part(g,.16,.035,.035,side*.22,1.20,.17,S);
 }
 part(g,.04,.75,.028,0,1.99,.275,EDGE);
 part(g,.7,.08,.35,0,1.49,0,MID);
 return g;
}
