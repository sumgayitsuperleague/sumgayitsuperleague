import {Group,Mesh,MeshStandardMaterial,MeshPhysicalMaterial,PlaneGeometry,TorusGeometry,CanvasTexture,RepeatWrapping,SRGBColorSpace,Vector3,Quaternion,Color,DoubleSide} from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';
import {clamp} from './penalty-physics.js';
let templatePromise;
export function loadAthleteTemplate(){return templatePromise??=new GLTFLoader().loadAsync('/assets/arena/footballer-pro.glb?v=20261022pro').then(g=>g.scene).catch(error=>{templatePromise=null;throw error;});}
function canvasMap(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const map=new CanvasTexture(c);map.colorSpace=SRGBColorSpace;return map;}
// Two-bone IK keeps the real mesh's wrists and ankles on the recorded physics pose.
function pointBone(bone,child,target){const start=bone.getWorldPosition(new Vector3()),current=child.getWorldPosition(new Vector3()).sub(start),desired=target.clone().sub(start);if(current.lengthSq()<1e-8||desired.lengthSq()<1e-8)return;const delta=new Quaternion().setFromUnitVectors(current.normalize(),desired.normalize()),world=bone.getWorldQuaternion(new Quaternion()).premultiply(delta),parent=bone.parent.getWorldQuaternion(new Quaternion()).invert();bone.quaternion.copy(parent.multiply(world));bone.updateWorldMatrix(false,true);}
function solveLimb(a,b,c,target,pole){const start=a.getWorldPosition(new Vector3()),joint=b.getWorldPosition(new Vector3()),end=c.getWorldPosition(new Vector3()),l1=start.distanceTo(joint),l2=joint.distanceTo(end),direction=target.clone().sub(start),distance=clamp(direction.length(),Math.abs(l1-l2)+.001,l1+l2-.001);direction.normalize();const bend=pole.clone().sub(start).addScaledVector(direction,-pole.clone().sub(start).dot(direction));if(bend.lengthSq()<1e-7)bend.set(0,0,1);bend.normalize();const along=(l1*l1-l2*l2+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,l1*l1-along*along)),knee=start.clone().addScaledVector(direction,along).addScaledVector(bend,height),ankle=start.clone().addScaledVector(direction,distance);pointBone(a,b,knee);pointBone(b,c,ankle);}
export function createAthlete(template,{keeper=false,number=9}={}){
 const root=new Group(),bodySpace=new Group(),model=cloneSkeleton(template);root.add(bodySpace);bodySpace.add(model);const bones=new Map(),bind=new Map(),meshes=[],materials=[],textures=[],geometries=[],kitColor=new Color('#2b75a5'),trimColor=new Color('#e9efdf');model.updateMatrixWorld(true);
 model.traverse(o=>{if(o.isBone){bones.set(o.name,o);bind.set(o.name,{q:o.quaternion.clone(),p:o.position.clone()});}if(o.isSkinnedMesh)meshes.push(o);});
 const own=m=>(materials.push(m),m),cloth=[];
 for(const mesh of meshes){const source=mesh.material,name=mesh.name;let material=source.clone();materials.push(material);mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;
  if(name.startsWith('Jersey')||name.startsWith('Shorts')){
   material=own(new MeshPhysicalMaterial({map:source.map,normalMap:source.normalMap,normalScale:source.normalScale,roughness:.83,metalness:0,sheen:.42,sheenColor:new Color('#d2dbe4'),sheenRoughness:.8,color:name.startsWith('Jersey')?kitColor:'#152437'}));cloth.push(material);
   if(name.startsWith('Jersey')){material.color=kitColor;material.onBeforeCompile=shader=>{
    shader.uniforms.sslTrim={value:trimColor};shader.vertexShader='varying vec3 vKitRest;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvKitRest=position;');shader.fragmentShader='varying vec3 vKitRest;uniform vec3 sslTrim;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
    #ifdef USE_MAP
     float weave=clamp(dot(sampledDiffuseColor.rgb,vec3(.2126,.7152,.0722))*4.6,.79,1.05);
     diffuseColor.rgb=diffuse*weave;
    #endif
    float sidePanel=smoothstep(.15,.19,abs(vKitRest.x))*(1.-smoothstep(1.32,1.4,vKitRest.y));
    diffuseColor.rgb*=1.-sidePanel*.38;
    if(vKitRest.y>1.448&&vKitRest.y<1.463&&abs(vKitRest.x)>.18)diffuseColor.rgb=mix(diffuseColor.rgb,sslTrim,.8);
   `);};material.customProgramCacheKey=()=>keeper?'ssl-tailored-keeper-v1':'ssl-tailored-player-v1';}
  }else if(name.startsWith('Skin')||name.startsWith('Hands')){material.roughness=.62;material.metalness=0;if(keeper&&name.startsWith('Hands')){material=own(new MeshPhysicalMaterial({color:'#deebaf',roughness:.52,clearcoat:.15,clearcoatRoughness:.6}));mesh.geometry=mesh.geometry.clone();geometries.push(mesh.geometry);const p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal;for(let i=0;i<p.count;i++)p.setXYZ(i,p.getX(i)+n.getX(i)*.006,p.getY(i)+n.getY(i)*.006,p.getZ(i)+n.getZ(i)*.006);p.needsUpdate=true;}}
  else if(name.startsWith('Eyes')){material.roughness=.2;material.metalness=0;}
  else if(name.startsWith('Hair')||name.startsWith('Eyebrows')||name.startsWith('Lashes')){material.roughness=.85;material.alphaTest=.35;material.depthWrite=true;}
  else if(name.startsWith('Boots')||name.startsWith('Studs')){material.roughness=.38;material.metalness=.06;}
  mesh.material=material;
 }
 const detailMaterial=options=>own(new MeshStandardMaterial({color:'#fff',transparent:true,depthWrite:false,roughness:.85,side:DoubleSide,...options}));
 const numberMap=canvasMap(256,320,(x,w,h)=>{x.clearRect(0,0,w,h);x.textAlign='center';x.font='900 242px Arial';x.lineWidth=5;x.strokeStyle='#0b142c';x.strokeText(String(number),w/2,263);x.fillStyle='#fbfbef';x.fillText(String(number),w/2,263);});textures.push(numberMap);
 const detail=(w,h,map,x,y,z,back=false)=>{const g=new PlaneGeometry(w,h),p=new Mesh(g,detailMaterial({map}));geometries.push(g);p.position.set(x,y,z);p.rotation.y=back?Math.PI:0;bodySpace.add(p);bodySpace.updateWorldMatrix(true,true);bones.get('spine_03').attach(p);return p;};
 detail(.18,.235,numberMap,0,1.245,-.126,true);const crest=detail(.063,.069,null,-.083,1.415,.145);detail(.043,.056,numberMap,.078,1.398,.153);
 const nameMap=canvasMap(512,80,(x,w,h)=>{x.fillStyle='#fff';x.font='700 55px Arial';x.textAlign='center';x.fillText('SUMQAYIT',w/2,60);});textures.push(nameMap);detail(.24,.037,nameMap,0,1.426,-.091,true);
 // Raised collar and cuffs belong to the garment, so the skin never changes color.
 const collarG=new TorusGeometry(.071,.008,6,44),collarM=own(new MeshStandardMaterial({color:'#dfe9ed',roughness:.85})),collar=new Mesh(collarG,collarM);geometries.push(collarG);collar.rotation.x=Math.PI/2;collar.scale.set(1,1.18,1);collar.position.set(0,1.539,.03);bodySpace.add(collar);bodySpace.updateWorldMatrix(true,true);bones.get('neck').attach(collar);
 const reset=()=>{for(const [name,bone]of bones){const b=bind.get(name);bone.quaternion.copy(b.q);bone.position.copy(b.p);}root.updateWorldMatrix(true,true);};
 const world=(x,y,z)=>root.localToWorld(new Vector3(x,y,z)),limb=(side,kind,target,pole)=>{const suffix=side<0?'r':'l',a=bones.get((kind==='leg'?'thigh_':'upperarm_')+suffix),b=bones.get((kind==='leg'?'calf_':'lowerarm_')+suffix),c=bones.get((kind==='leg'?'foot_':'hand_')+suffix);solveLimb(a,b,c,target,pole);};
 if(keeper)bodySpace.position.y=-1.08;
 return {root,setKit(club,map){kitColor.set(club?.color||'#2877af');crest.material.map=map||null;crest.material.needsUpdate=true;},pose(frame,pose){
  reset();if(keeper){root.position.set(pose.x,pose.y,.32);root.rotation.set(0,0,pose.angle);root.updateWorldMatrix(true,true);
   const breathing=Math.sin((frame.idle||0)*1.8)*.008;
   for(const side of [-1,1]){const hand=pose.hold?new Vector3(pose.hold.x+side*.105,pose.hold.y,pose.hold.z):new Vector3(pose.x+side*(.41+.15*pose.reach),pose.handY+.065+breathing,.50),shoulder=bones.get('upperarm_'+(side<0?'r':'l')).getWorldPosition(new Vector3()),pole=shoulder.clone().lerp(hand,.5);pole.z+=.25;pole.y-=.12*(1-pose.reach);limb(side,'arm',hand,pole);const ankle=new Vector3(side*(.21+.15*pose.dive),-.91,.055).applyAxisAngle(new Vector3(0,0,1),pose.angle).add(new Vector3(pose.x,pose.y,.32));limb(side,'leg',ankle,world(side*.22,-.48,.3));
    if(pose.hold){const h=bones.get('hand_'+(side<0?'r':'l')),tip=bones.get('fingertip_'+(side<0?'r':'l'));pointBone(h,tip,new Vector3(pose.hold.x+side*.05,pose.hold.y-.035,pose.hold.z+.05));}
   }
  }else{const running=frame.phase==='runup'||frame.phase==='defend',duration=frame.phase==='defend'?1.5:.7,run=running?clamp((frame.runUp||0)/duration,0,1):frame.shot?1:0,clock=frame.replayFrame?.t??frame.shot?.t??0,strike=frame.shot&&clock<.38?Math.sin(clamp(clock/.32,0,1)*Math.PI):0,gait=running?Math.sin(run*Math.PI*4):0;root.position.set(.23,running?Math.abs(gait)*.018:0,7.92+(1-run));root.rotation.set(running?.065:strike*.12,Math.PI+strike*.09,0);root.updateWorldMatrix(true,true);
   for(const side of [-1,1]){const swing=side>0?strike*.59:0;limb(side,'leg',world(side*.13,.105+strike*(side>0?.18:0)+Math.max(0,-side*gait)*.065,.06+side*gait*.18+swing),world(side*.14,.5,.30));limb(side,'arm',world(side*(.30+strike*.13),1.01+Math.abs(gait)*.055,.08-side*gait*.2-strike*.08),world(side*.35,1.18,.24));}
  }
  root.updateWorldMatrix(true,true);
 },destroy(){for(const g of new Set(geometries))g.dispose();for(const m of new Set(materials))m.dispose();for(const t of textures)t.dispose();for(const s of new Set(meshes.map(m=>m.skeleton)))s.dispose();root.removeFromParent();}};
}
