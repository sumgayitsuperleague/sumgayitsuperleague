import {Group,Mesh,MeshStandardMaterial,MeshPhysicalMaterial,PlaneGeometry,CanvasTexture,RepeatWrapping,Vector3,Quaternion,Color,DoubleSide,Float32BufferAttribute} from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';
import {clamp} from './penalty-physics.js';
let templatePromise;
export function loadAthleteTemplate(){return templatePromise??=(new GLTFLoader().loadAsync('/assets/arena/player-base.glb?v=20261022final').then(g=>g.scene).catch(error=>{templatePromise=null;throw error;}));}
function canvasMap(w,h,paint){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;paint(canvas.getContext('2d'),w,h);return new CanvasTexture(canvas);}
function fabricNormal(){const map=canvasMap(64,64,(x,w,h)=>{const image=x.createImageData(w,h);for(let y=0;y<h;y++)for(let a=0;a<w;a++){const i=(y*w+a)*4;image.data[i]=128+Math.round(Math.sin(a*Math.PI/2)*12);image.data[i+1]=128+Math.round(Math.sin(y*Math.PI/2)*12);image.data[i+2]=253;image.data[i+3]=255;}x.putImageData(image,0,0);});map.wrapS=map.wrapT=RepeatWrapping;map.repeat.set(35,35);return map;}
// Two-bone IK keeps the real mesh's wrists and ankles on the recorded physics pose.
function pointBone(bone,child,target){const start=bone.getWorldPosition(new Vector3()),current=child.getWorldPosition(new Vector3()).sub(start),desired=target.clone().sub(start);if(current.lengthSq()<1e-8||desired.lengthSq()<1e-8)return;const delta=new Quaternion().setFromUnitVectors(current.normalize(),desired.normalize()),world=bone.getWorldQuaternion(new Quaternion()).premultiply(delta),parent=bone.parent.getWorldQuaternion(new Quaternion()).invert();bone.quaternion.copy(parent.multiply(world));bone.updateWorldMatrix(false,true);}
function solveLimb(a,b,c,target,pole){const start=a.getWorldPosition(new Vector3()),joint=b.getWorldPosition(new Vector3()),end=c.getWorldPosition(new Vector3()),l1=start.distanceTo(joint),l2=joint.distanceTo(end),direction=target.clone().sub(start),distance=clamp(direction.length(),Math.abs(l1-l2)+.001,l1+l2-.001);direction.normalize();const bend=pole.clone().sub(start).addScaledVector(direction,-pole.clone().sub(start).dot(direction));if(bend.lengthSq()<1e-7)bend.set(0,0,1);bend.normalize();const along=(l1*l1-l2*l2+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,l1*l1-along*along)),knee=start.clone().addScaledVector(direction,along).addScaledVector(bend,height),ankle=start.clone().addScaledVector(direction,distance);pointBone(a,b,knee);pointBone(b,c,ankle);}
export function createAthlete(template,{keeper=false,number=9}={}){
 const root=new Group(),bodySpace=new Group(),model=cloneSkeleton(template);root.add(bodySpace);bodySpace.add(model);model.position.y=.00951;const bones=new Map(),bind=new Map(),meshes=[],materials=[],textures=[],geometries=[];model.updateMatrixWorld(true);model.traverse(o=>{if(o.isBone){bones.set(o.name,o);bind.set(o.name,{q:o.quaternion.clone(),p:o.position.clone()});}if(o.isSkinnedMesh)meshes.push(o);});
 const fabric=fabricNormal();textures.push(fabric);const make=(properties,physical=false)=>{const m=physical?new MeshPhysicalMaterial(properties):new MeshStandardMaterial(properties);materials.push(m);return m;};
 const skin=make({color:'#bf8b67',roughness:.6,metalness:0}),kit=make({color:'#4380ae',roughness:.78,normalMap:fabric,normalScale:{x:.23,y:.23},sheen:.35,sheenRoughness:.8,sheenColor:new Color('#c8d6e5')},true),shorts=make({color:'#101926',roughness:.9,normalMap:fabric}),socks=make({color:'#e7ecec',roughness:.94,normalMap:fabric}),boots=make({color:'#131c24',roughness:.32,metalness:.08,clearcoat:.35,clearcoatRoughness:.25},true),hair=make({color:'#1d1715',roughness:.48}),gloves=make({color:'#e2f2d6',roughness:.6}),eyeWhite=make({color:'#eef0e8',roughness:.22}),iris=make({color:'#272e30',roughness:.28});

 for(const mesh of meshes){const g=mesh.geometry.clone();geometries.push(g);mesh.geometry=g;mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;mesh.material=mesh.name==='Eyebrows'?hair:mesh.name==='Eyes'?eyeWhite:skin;if(mesh.name!=='SuperHero_Male')continue;
  const position=g.getAttribute('position'),normal=g.getAttribute('normal'),weights=g.getAttribute('skinWeight'),joints=g.getAttribute('skinIndex'),zones=new Float32Array(position.count*4),rest=position.array.slice();
  for(let i=0;i<position.count;i++){let slot=0,max=-1;for(let j=0;j<4;j++){const w=weights.getComponent(i,j);if(w>max){max=w;slot=joints.getComponent(i,j);}}const name=mesh.skeleton.bones[slot]?.name||'';const category=/Head|neck/.test(name)?3:/hand|index|middle|pinky|ring|thumb/.test(name)?4:/foot|ball|thigh|calf/.test(name)?1:/arm|clavicle/.test(name)?2:0;if(category)zones[i*4+category-1]=1;
   const y=position.getY(i),cloth=category===0||category===1&&y>.63||category===2&&(keeper||Math.abs(position.getX(i))<.46),inflate=cloth?.012:0;position.setXYZ(i,position.getX(i)+normal.getX(i)*inflate,y+normal.getY(i)*inflate,position.getZ(i)+normal.getZ(i)*inflate);
  }
  g.setAttribute('sslZone',new Float32BufferAttribute(zones,4));g.setAttribute('sslRest',new Float32BufferAttribute(rest,3));g.clearGroups();position.needsUpdate=true;g.computeBoundingSphere();
  const bodyMaterial=make({color:'#ffffff',roughness:.72,sheen:.22,sheenRoughness:.85,sheenColor:new Color('#b4c2d0')},true);mesh.material=bodyMaterial;
  bodyMaterial.onBeforeCompile=shader=>{
   shader.uniforms.sslKit={value:kit.color};shader.uniforms.sslSkin={value:skin.color};shader.uniforms.sslShorts={value:shorts.color};shader.uniforms.sslSocks={value:socks.color};shader.uniforms.sslBoots={value:boots.color};shader.uniforms.sslHair={value:hair.color};shader.uniforms.sslGloves={value:gloves.color};
   shader.vertexShader='attribute vec4 sslZone;attribute vec3 sslRest;varying vec4 vSSLZone;varying vec3 vSSLRest;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSSLZone=sslZone;vSSLRest=sslRest;');
   shader.fragmentShader='uniform vec3 sslKit;uniform vec3 sslSkin;uniform vec3 sslShorts;uniform vec3 sslSocks;uniform vec3 sslBoots;uniform vec3 sslHair;uniform vec3 sslGloves;varying vec4 vSSLZone;varying vec3 vSSLRest;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
    float zone=vSSLZone.w>.45?4.:vSSLZone.z>.45?3.:vSSLZone.y>.45?2.:vSSLZone.x>.45?1.:0.;float y=vSSLRest.y,ax=abs(vSSLRest.x);vec3 surface=sslSkin;float textile=0.;
    if(zone<.5){surface=y>.925?sslKit:sslShorts;textile=1.;if(y>.925&&y<.942)surface=sslSocks;}
    else if(zone<1.5){if(y<.13){surface=sslBoots;}else if(y>.635){surface=sslShorts;textile=1.;if(y<.652)surface=sslSocks;}else if(y<.49){surface=sslSocks;textile=1.;if(y>.468)surface=sslKit;}}
    else if(zone<2.5){if(${keeper?'true':'ax<.465'}){surface=sslKit;textile=1.;if(${keeper?'ax>.63&&ax<.655':'ax>.445'})surface=sslSocks;}}
    else if(zone<3.5){if(y>1.756||(y>1.67&&vSSLRest.z<-.012))surface=sslHair;}
    else if(zone<4.5){surface=${keeper?'sslGloves':'sslSkin'};}
    else{surface=sslBoots;if(vSSLRest.z>.04&&y<.11)surface=mix(sslBoots,sslKit,.7);}
    if(textile>.5){float weave=sin(vSSLRest.x*2400.)*sin(vSSLRest.y*2100.);surface*=1.+weave*.025;if(zone<.5&&y>1.0&&y<1.49&&abs(vSSLRest.z)>.085)surface*=.94+.06*sin(vSSLRest.x*92.);}
    diffuseColor.rgb=surface;
   `);
  };bodyMaterial.customProgramCacheKey=()=>keeper?'ssl-athlete-keeper-v2':'ssl-athlete-player-v2';

 }
 // Club details follow the chest bone; every number and crest is generated locally.
 const numberMap=canvasMap(256,320,(x,w,h)=>{x.clearRect(0,0,w,h);x.fillStyle='#f4f7f7';x.textAlign='center';x.font='900 240px Arial';x.fillText(String(number),w/2,264);});textures.push(numberMap);
 const detail=(width,height,map,x,y,z,back=false)=>{const geometry=new PlaneGeometry(width,height),material=make({color:'#fff',map,transparent:true,depthWrite:false,roughness:.88,side:DoubleSide}),plane=new Mesh(geometry,material),chest=bones.get('spine_03');geometries.push(geometry);plane.position.set(x,y,z);plane.rotation.y=back?Math.PI:0;bodySpace.add(plane);bodySpace.updateWorldMatrix(true,true);chest.attach(plane);return plane;};
 const backNumber=detail(.205,.265,numberMap,0,1.28,-.145,true),crest=detail(.086,.086,null,-.09,1.37,.139),frontNumber=detail(.065,.082,numberMap,.075,1.36,.14);
 // Eyeballs have small irises rather than the featureless placeholder face.
 const eyeBone=bones.get('Head');for(const side of [-1,1]){const geometry=new PlaneGeometry(.018,.018,1,1),pupil=new Mesh(geometry,iris);geometries.push(geometry);pupil.position.set(side*.029,1.705,.083);bodySpace.add(pupil);bodySpace.updateWorldMatrix(true,true);eyeBone.attach(pupil);}
 const reset=()=>{for(const [name,bone]of bones){const b=bind.get(name);bone.quaternion.copy(b.q);bone.position.copy(b.p);}root.updateWorldMatrix(true,true);};
 const world=(x,y,z)=>root.localToWorld(new Vector3(x,y,z)),limb=(side,kind,target,pole)=>{const suffix=side<0?'r':'l',a=bones.get((kind==='leg'?'thigh_':'upperarm_')+suffix),b=bones.get((kind==='leg'?'calf_':'lowerarm_')+suffix),c=bones.get((kind==='leg'?'foot_':'hand_')+suffix);solveLimb(a,b,c,target,pole);};
 if(keeper)bodySpace.position.y=-1.08;
 return {root,setKit(club,map){kit.color.set(club?.color||'#4280ad');crest.material.map=map||null;crest.material.needsUpdate=true;skin.color.set(keeper?'#ba8969':'#c49473');},pose(frame,pose){
  reset();if(keeper){root.position.set(pose.x,pose.y,.32);root.rotation.set(0,0,pose.angle);root.updateWorldMatrix(true,true);
   for(const side of [-1,1]){const hand=pose.hold?new Vector3(pose.hold.x+side*.105,pose.hold.y,pose.hold.z):new Vector3(pose.x+side*(.43+.12*pose.reach),pose.handY+.09,.5),shoulder=bones.get('upperarm_'+(side<0?'r':'l')).getWorldPosition(new Vector3()),pole=shoulder.clone().lerp(hand,.5);pole.z+=.25;pole.y-=.12*(1-pose.reach);limb(side,'arm',hand,pole);const local=new Vector3(side*(.22+.15*pose.dive),-.92,.02).applyAxisAngle(new Vector3(0,0,1),pose.angle).add(new Vector3(pose.x,pose.y,.32));limb(side,'leg',local,world(side*.2,-.5,.25));}
  }else{const running=frame.phase==='runup'||frame.phase==='defend',duration=frame.phase==='defend'?1.5:.7,run=running?clamp((frame.runUp||0)/duration,0,1):frame.shot?1:0,clock=frame.replayFrame?.t??frame.shot?.t??0,strike=frame.shot&&clock<.38?Math.sin(clamp(clock/.32,0,1)*Math.PI):0,gait=running?Math.sin(run*Math.PI*4):0;root.position.set(.23,running?Math.abs(gait)*.012:0,7.92+(1-run));root.rotation.set(running?.045:0,Math.PI,0);root.updateWorldMatrix(true,true);
   for(const side of [-1,1]){const swing=side>0?strike*.58:0;limb(side,'leg',world(side*.115,.08+strike*(side>0?.18:0)+Math.max(0,-side*gait)*.05,side*gait*.18+swing),world(side*.13,.46,.28));limb(side,'arm',world(side*(.31+strike*.13),.95+Math.abs(gait)*.08,-side*gait*.2-strike*.06),world(side*.34,1.16,.15));}
  }
  root.updateWorldMatrix(true,true);
 },destroy(){for(const g of new Set(geometries))g.dispose();for(const m of new Set(materials))m.dispose();for(const t of textures)t.dispose();for(const s of new Set(meshes.map(m=>m.skeleton)))s.dispose();root.removeFromParent();}};
}
