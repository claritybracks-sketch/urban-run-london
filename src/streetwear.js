import * as THREE from 'https://esm.sh/three@0.161.0';
const black=()=>new THREE.MeshStandardMaterial({color:0x101114,roughness:.82,metalness:.05});
const panel=()=>new THREE.MeshStandardMaterial({color:0x24262b,roughness:.76});
const rubber=()=>new THREE.MeshStandardMaterial({color:0x08090b,roughness:.97});
const seam=()=>new THREE.MeshStandardMaterial({color:0x42454c,roughness:.7});
function box(parent,w,h,d,x,y,z,mat,round=false){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m}
function ball(parent,x,y,z,sx,sy,sz,mat){const m=new THREE.Mesh(new THREE.SphereGeometry(1,20,12),mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m}
function shoe(kind){const group=new THREE.Group(),M=black(),P=panel(),R=rubber(),S=seam();const sole=ball(group,0,.15,0,.42,.15,.95,R);sole.scale.x=.42;box(group,.79,.09,1.77,0,.12,0,R);ball(group,0,.31,-.05,.37,.24,.77,M);ball(group,0,.31,.65,.34,.17,.28,M);box(group,.61,.27,.33,0,.46,-.52,M);
for(const side of [-1,1]){for(let i=0;i<5;i++){const x=side*(.32+(i%2)*.01),z=-.48+i*.27;const p=box(group,.055,.20+i*.025,.25,x,.38,z,kind==='ridge'?P:S);p.rotation.x=(kind==='ridge'?-.17:.28)}
for(let i=0;i<4;i++){const t=box(group,.03,.035,.17,side*.365,.16,-.63+i*.43,S);t.rotation.y=.08}}
for(let i=0;i<4;i++){const lace=box(group,.4,.016,.027,0,.54,-.42+i*.18,S);lace.rotation.z=i%2?.06:-.06}
if(kind==='current'){for(let i=0;i<5;i++){const rib=box(group,.07,.25,.055,-.345,.35,-.52+i*.29,P);rib.rotation.x=.36;const rr=rib.clone();rr.position.x=.345;group.add(rr)}for(let i=0;i<3;i++)box(group,.24,.095,.2,0,.13,-.55+i*.55,P)}
else for(let i=0;i<3;i++)box(group,.65,.035,.11,0,.20,-.6+i*.47,P);
group.position.y=.02;return group}
export function createRidge95(){const p=new THREE.Group();const a=shoe('ridge');a.position.x=-.51;const b=shoe('ridge');b.position.x=.51;b.rotation.y=-.18;p.add(a,b);return p}
export function createCurrent110(){const p=new THREE.Group();const a=shoe('current');a.position.x=-.51;const b=shoe('current');b.position.x=.51;b.rotation.y=-.18;p.add(a,b);return p}
function limb(parent,a,b,r1,r2,mat){const dir=new THREE.Vector3().subVectors(new THREE.Vector3(...b),new THREE.Vector3(...a));const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,dir.length(),12),mat);m.position.copy(new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize());parent.add(m);return m}
export function createCircuitTracksuit(){const g=new THREE.Group(),M=black(),P=panel(),S=seam();ball(g,0,1.95,0,.34,.45,.2,M);box(g,.56,.58,.32,0,2.11,-.07,M);const hood=ball(g,0,2.4,-.13,.29,.35,.25,P);hood.material.side=THREE.DoubleSide;
for(const k of [-1,1]){limb(g,[k*.42,2.17,0],[k*.6,1.37,0],.16,.12,M);limb(g,[k*.19,1.53,0],[k*.21,.18,0],.21,.115,M);box(g,.15,.09,.16,k*.6,1.37,0,P);box(g,.25,.1,.25,k*.21,.13,0,P);box(g,.18,.3,.09,k*.2,1.43,.16,P)}
box(g,.045,.91,.025,0,1.96,.215,S);box(g,.56,.07,.38,0,1.48,0,P);for(const k of [-1,1]){box(g,.14,.025,.018,k*.19,1.86,.212,S);box(g,.04,.18,.018,k*.32,1.97,.207,S)}return g}
