import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';
import {clutchFrame} from './clutch-motion.js';
const mix=T.MathUtils.lerp,clamp=T.MathUtils.clamp;
// All materials, models and textures are first-party assets or procedural geometry.
export function createClutchScene(host,{home,away,quality='auto',reduced=false,onFrame=()=>{},onFallback=()=>{}}={}){
 let disposed=false,raf=0,pending=null,current=null,clock=0,last=0,loadedModel=null;
 const mobile=host.clientWidth<650,scene=new T.Scene(),renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.5:quality==='cinematic'?2:1.75));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.23;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.domElement.setAttribute('aria-hidden','true');renderer.domElement.className='cl-webgl';host.prepend(renderer.domElement);
 scene.background=new T.Color('#081324');scene.fog=new T.FogExp2('#0b1728',.013);
 const camera=new T.PerspectiveCamera(43,1,.2,170),cameraAim=new T.Vector3(),cameraTarget=new T.Vector3(26,32,32),aimTarget=new T.Vector3(0,0,-5),v3=new T.Vector3();
 const resources=new Set(),actors=new Map(),textures=new Set(),mat=(opts)=>{const m=new T.MeshStandardMaterial(opts);resources.add(m);return m;};
 const mesh=(geo,material,x=0,y=0,z=0,parent=scene)=>{resources.add(geo);const o=new T.Mesh(geo,material);o.position.set(x,y,z);parent.add(o);return o;};
 const box=(w,h,d,m,x,y,z,parent)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z,parent);
 const pale=mat({color:'#e3f5ed',roughness:.7}),steel=mat({color:'#879da7',metalness:.7,roughness:.38}),dark=mat({color:'#0b1425',roughness:.8});
 scene.add(new T.HemisphereLight('#c9e5ff','#143b30',2.1));
 const key=new T.DirectionalLight('#dcecff',3.8);key.position.set(-15,32,8);key.castShadow=true;key.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);Object.assign(key.shadow.camera,{left:-27,right:27,top:30,bottom:-30,near:1,far:90});key.shadow.bias=-.0006;key.shadow.normalBias=.025;key.shadow.blurSamples=4;scene.add(key);
 const fill=new T.DirectionalLight('#b4d6ff',2.1);fill.position.set(22,18,-24);scene.add(fill);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const cx=canvas.getContext('2d');cx.fillStyle='#24633f';cx.fillRect(0,0,512,512);
 let noiseSeed=190731;for(let i=0;i<58000;i++){noiseSeed=(noiseSeed*1664525+1013904223)>>>0;const a=noiseSeed/4294967296;cx.fillStyle=a<.5?'rgba(131,183,102,.17)':'rgba(5,41,24,.2)';cx.fillRect((noiseSeed>>>8)%512,(noiseSeed>>>19)%512,1,2+(noiseSeed%3));}
 const grass=new T.CanvasTexture(canvas);grass.colorSpace=T.SRGBColorSpace;grass.wrapS=grass.wrapT=T.RepeatWrapping;grass.repeat.set(9,14);grass.anisotropy=renderer.capabilities.getMaxAnisotropy();textures.add(grass);
 const turf=mat({map:grass,color:'#a1b4a0',roughness:1}),pitch=mesh(new T.PlaneGeometry(26,42),turf,0,-.04,0);pitch.rotation.x=-Math.PI/2;pitch.receiveShadow=true;
 const stripeM=mat({color:'#a5cdab',transparent:true,opacity:.075,depthWrite:false,roughness:1});for(let i=0;i<10;i+=2){const p=mesh(new T.PlaneGeometry(24,4),stripeM,0,-.025,-18+i*4);p.rotation.x=-Math.PI/2;}
 const floor=box(90,.25,90,mat({color:'#101d25',roughness:1}),0,-.3,0);floor.receiveShadow=true;
 const lines=[];const line=(points,color='#e0f0d9',opacity=.85)=>{const g=new T.BufferGeometry().setFromPoints(points.map(([x,z])=>new T.Vector3(x,.015,z))),m=new T.LineBasicMaterial({color,transparent:true,opacity});resources.add(g);resources.add(m);const l=new T.Line(g,m);scene.add(l);lines.push(l);return l;};
 const rect=(x,z,w,h)=>line([[x-w/2,z-h/2],[x+w/2,z-h/2],[x+w/2,z+h/2],[x-w/2,z+h/2],[x-w/2,z-h/2]]);
 rect(0,0,24,38);line([[-12,0],[12,0]]);line(Array.from({length:81},(_,i)=>[Math.cos(i/80*Math.PI*2)*3.4,Math.sin(i/80*Math.PI*2)*3.4]));
 for(const sign of [-1,1]){rect(0,sign*16,13,6);rect(0,sign*18,7,2);const spot=mesh(new T.CircleGeometry(.09,12),pale,0,.017,sign*13);spot.rotation.x=-Math.PI/2;}
 const post=mat({color:'#f2f5eb',metalness:.15,roughness:.35}),netM=new T.LineBasicMaterial({color:'#c9e6d7',transparent:true,opacity:.34});resources.add(netM);
 const rod=(a,b,r=.055,material=post)=>{const start=new T.Vector3(...a),end=new T.Vector3(...b),delta=end.clone().sub(start),o=mesh(new T.CylinderGeometry(r,r,delta.length(),8),material);o.position.copy(start.add(end).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return o;};
 const netGeo=new T.BufferGeometry(),netVertices=[];for(const sign of [-1,1]){
  const front=19*sign,back=21*sign;rod([-3,0,front],[-3,2.4,front]);rod([3,0,front],[3,2.4,front]);rod([-3,2.4,front],[3,2.4,front]);
  for(const x of [-3,3]){rod([x,2.4,front],[x,2.2,back],.035,steel);rod([x,0,back],[x,2.2,back],.035,steel);}
  const segment=(a,b)=>netVertices.push(...a,...b);for(let x=-3;x<=3.01;x+=.3){segment([x,0,back],[x,2.2,back]);segment([x,2.2,back],[x,2.4,front]);}for(let y=0;y<=2.21;y+=.25){segment([-3,y,back],[3,y,back]);for(const x of [-3,3])segment([x,y,back],[x,y,front]);}
 }
 netGeo.setAttribute('position',new T.Float32BufferAttribute(netVertices,3));resources.add(netGeo);const nets=new T.LineSegments(netGeo,netM);scene.add(nets);
 // Low grandstands, a continuous LED rail and lit gantries give a real sense of scale.
 const seats=mat({color:'#153c64',roughness:.7}),led=mat({color:'#426dff',emissive:'#1b49e2',emissiveIntensity:1.1,roughness:.4});
 for(const x of [-18,18])for(let row=0;row<5;row++)box(5,.65,52,seats,x+Math.sign(x)*row*.6,.35+row*.6,0);
 for(const z of [-26,26])for(let row=0;row<4;row++)box(32,.65,3,seats,0,.35+row*.6,z+Math.sign(z)*row*.6);
 for(const x of [-13.5,13.5])box(.18,.56,43,led,x,.32,0);for(const z of [-22.5,22.5])box(27,.56,.18,led,0,.32,z);
 const crowdM=mat({color:'#c7d3da',roughness:1}),count=mobile?800:1600,crowd=new T.InstancedMesh(new T.BoxGeometry(.23,.47,.22),crowdM,count),dummy=new T.Object3D();resources.add(crowd.geometry);
 const colors=['#bcc6d2','#3962b8','#e2e0c9','#6e84a2','#c99c72','#233b5d'];for(let i=0;i<count;i++){const side=i%2?-1:1,row=Math.floor(i/2)%5,offset=((i*7.31)%48)-24;dummy.position.set(side*(16.8+row*.6),1+row*.58,offset);dummy.rotation.y=side*Math.PI/2;dummy.updateMatrix();crowd.setMatrixAt(i,dummy.matrix);crowd.setColorAt(i,new T.Color(colors[i%colors.length]));}scene.add(crowd);
 const lampM=mat({color:'#fffef3',emissive:'#d8eeff',emissiveIntensity:4.5});
 for(const x of [-18,18])for(const z of [-20,20]){box(.16,17,.16,steel,x,8.5,z);const lights=new T.Group();lights.position.set(x,17,z);lights.lookAt(0,0,0);scene.add(lights);for(let col=-2;col<=2;col++)for(let row=0;row<2;row++)box(.43,.25,.08,lampM,col*.55,row*.36,0,lights);}
 const boardCanvas=document.createElement('canvas');boardCanvas.width=1024;boardCanvas.height=128;const bx=boardCanvas.getContext('2d');bx.fillStyle='#183cba';bx.fillRect(0,0,1024,128);bx.fillStyle='#fff';bx.font='900 47px Arial';bx.textAlign='center';bx.fillText('SUMQAYIT SUPER LIQASI',512,78);const boardTex=new T.CanvasTexture(boardCanvas);boardTex.colorSpace=T.SRGBColorSpace;textures.add(boardTex);const boardM=mat({map:boardTex,emissiveMap:boardTex,emissive:'#ffffff',emissiveIntensity:.6,roughness:.6});
 for(const z of [-22.7,22.7]){const b=box(16,1,.08,boardM,0,.65,z);if(z>0)b.rotation.y=Math.PI;}
 const sphere=new T.Group(),ballMaterial=mat({color:'#f7f5e6',roughness:.48,metalness:.03}),ballMesh=mesh(new T.IcosahedronGeometry(.2,2),ballMaterial,0,0,0,sphere),patchM=mat({color:'#101825',roughness:.65});
 for(let i=0;i<12;i++){const phi=Math.acos(1-2*(i+.5)/12),theta=i*2.39996,patch=mesh(new T.CircleGeometry(.065,5),patchM,Math.sin(phi)*Math.cos(theta)*.199,Math.cos(phi)*.199,Math.sin(phi)*Math.sin(theta)*.199,sphere);patch.lookAt(patch.position.clone().multiplyScalar(2));}ballMesh.castShadow=true;scene.add(sphere);
 const ringM=new T.MeshBasicMaterial({color:'#edda9a',transparent:true,opacity:.85,side:T.DoubleSide});resources.add(ringM);const ring=mesh(new T.RingGeometry(.48,.57,48),ringM,0,.03,0);ring.rotation.x=-Math.PI/2;
 const shadowM=new T.MeshBasicMaterial({color:'#061b13',transparent:true,opacity:.21,depthWrite:false});resources.add(shadowM);const blobs=[];
 const placeholder=(p,color)=>{const root=new T.Group(),body=new T.Group();root.add(body);const kit=mat({color,roughness:.8}),skin=mat({color:'#bd9072',roughness:.8}),shorts=mat({color:p.side==='home'?'#172b54':'#e9ebdf',roughness:.8});const torso=mesh(new T.CapsuleGeometry(.22,.4,4,8),kit,0,1.15,0,body),head=mesh(new T.SphereGeometry(.145,12,10),skin,0,1.67,0,body),legs=[],arms=[];for(const sign of [-1,1]){const hip=new T.Group();hip.position.set(sign*.12,.82,0);body.add(hip);mesh(new T.CapsuleGeometry(.08,.53,3,7),shorts,0,-.27,0,hip);legs.push(hip);const shoulder=new T.Group();shoulder.position.set(sign*.26,1.37,0);body.add(shoulder);mesh(new T.CapsuleGeometry(.065,.42,3,7),skin,sign*.015,-.23,0,shoulder);arms.push(shoulder);}body.traverse(o=>{if(o.isMesh)o.castShadow=true;});return {root,body,legs,arms,bones:null};};
 const colorFor=p=>p.keeper?(p.side==='home'?'#dca63d':'#ed8d5a'):p.side==='home'?(home?.color||'#2651d8'):(away?.color||'#f1efdf');
 function setupActors(state){for(const p of state.players){if(actors.has(p.id))continue;const a=placeholder(p,colorFor(p));a.root.position.set(p.x,0,p.z);scene.add(a.root);actors.set(p.id,a);const sh=mesh(new T.CircleGeometry(.39,16),shadowM,p.x,.005,p.z);sh.rotation.x=-Math.PI/2;blobs.push({id:p.id,mesh:sh});}}
 async function loadModels(){try{const asset=await new GLTFLoader().loadAsync('/assets/arena/footballer-pro.glb?v=20261022pro');loadedModel=asset.scene;if(disposed){releaseTemplate();return;}for(const [id,a]of actors){const p=current.players.find(p=>p.id===id),model=cloneSkeleton(asset.scene),bones=new Map(),bind=new Map(),ownMaterials=[];
    model.traverse(o=>{if(o.isBone){bones.set(o.name,o);bind.set(o.name,o.quaternion.clone());}if(o.isMesh){o.castShadow=true;o.receiveShadow=false;if(/^(Studs|Eyes|Eyebrows|Lashes|Teeth)/.test(o.name)){o.visible=false;o.castShadow=false;}const m=o.material.clone();ownMaterials.push(m);if(/^(Jersey|Socks)/.test(o.name)){m.color.set(colorFor(p));m.map=null;m.normalMap=null;m.roughness=.85;}if(o.name.startsWith('Shorts')){m.color.set(p.side==='home'?'#172b54':'#e7e9df');m.map=null;}o.material=m;}});
    a.body.visible=false;a.root.add(model);a.model=model;a.bones=bones;a.bind=bind;a.ownMaterials=ownMaterials;host.dataset.clutchAthletes=String([...actors.values()].filter(a=>a.model).length);
    // The shared rig has a neutral pose. Shoulder rotations lower both arms.
   }
  }catch{/* The fully articulated local models remain available while offline. */}}
 function releaseTemplate(){loadedModel?.traverse(o=>{if(o.isMesh){o.geometry?.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();}}});loadedModel=null;}
 function drawFrame(frame,dt=0){
  if(!frame)return;const defensive=current?.mission==='protect',end=defensive?1:-1,w=host.clientWidth,h=host.clientHeight,portrait=w/h<1.2;
  const focus=frame.ball;cameraTarget.set(portrait?20:16,portrait?29:20,defensive?-(portrait?25:17):(portrait?25:17));aimTarget.set(focus.x*.2,0,end*6.5+focus.z*.26);
  if(pending&&!reduced){cameraTarget.x-=Math.sin(frame.progress*Math.PI)*2;cameraTarget.y-=Math.sin(frame.progress*Math.PI)*2.8;}
  camera.position.lerp(cameraTarget,dt?Math.min(1,dt*3):1);cameraAim.lerp(aimTarget,dt?Math.min(1,dt*3):1);camera.lookAt(cameraAim);
  for(const p of frame.players){const a=actors.get(p.id);if(!a)continue;a.root.position.set(p.x,p.moving?Math.abs(Math.sin(clock*12))*.025:0,p.z);const target=frame.ball,heading=Math.atan2(target.x-p.x,target.z-p.z);a.root.rotation.y=heading;const gait=p.moving?Math.sin(clock*11):Math.sin(clock*1.8)*.025;
   if(a.bones){for(const [name,bone]of a.bones)bone.quaternion.copy(a.bind.get(name));for(const side of ['l','r']){const sign=side==='l'?1:-1,thigh=a.bones.get('thigh_'+side),calf=a.bones.get('calf_'+side),arm=a.bones.get('upperarm_'+side),fore=a.bones.get('lowerarm_'+side);thigh?.rotateX(gait*.43*sign);calf?.rotateX(Math.max(0,-gait*sign)*.65);arm?.rotateZ(sign*.2);arm?.rotateX(-gait*.28*sign);fore?.rotateX(-.16);if(frame.shot&&p.id===frame.owner&&side==='r')thigh?.rotateX(-frame.strike*.9);if(frame.celebrate&&p.side==='home'){arm?.rotateZ(-sign*1.9);fore?.rotateX(-.3);}}
   }else{a.legs.forEach((l,i)=>l.rotation.x=gait*.5*(i?1:-1));a.arms.forEach((arm,i)=>{arm.rotation.x=-gait*.3*(i?1:-1);arm.rotation.z=frame.celebrate&&p.side==='home'?(i?-2:2):0;});}
  }
  for(const a of blobs){const p=frame.players.find(p=>p.id===a.id);a.mesh.position.set(p.x,.005,p.z);}
  sphere.position.set(frame.ball.x,frame.ball.y,frame.ball.z);if(pending){sphere.rotation.x-=dt*9;sphere.rotation.z+=dt*4;}
  const owner=frame.players.find(p=>p.id===frame.owner);if(owner)ring.position.set(owner.x,.03,owner.z);ring.material.opacity=pending?.25:.85;ring.rotation.z=clock*.4;
  renderer.render(scene,camera);v3.copy(sphere.position).project(camera);const screen={x:(v3.x*.5+.5)*w,y:(-.5*v3.y+.5)*h};onFrame(frame,screen);
 }
 function setState(state){current=state;setupActors(state);drawFrame({...state,progress:0,shot:false},0);}
 function animate(step,{replay=false}={}){if(disposed)return Promise.resolve();pending?.resolve();return new Promise(resolve=>{pending={step,elapsed:0,baseDuration:reduced?400:step.duration*(replay?1.35:1),duration:(reduced?400:step.duration*(replay?1.35:1))+(step.terminal==='goal'&&!reduced?850:0),resolve};});}
 const resize=()=>{if(disposed)return;const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();drawFrame(pending?clutchFrame(pending.step,pending.elapsed/pending.duration):current?{...current,progress:0}:null);};
 const ro=new ResizeObserver(resize);ro.observe(host);resize();
 const lost=event=>{event.preventDefault();pending?.resolve();pending=null;onFallback();};renderer.domElement.addEventListener('webglcontextlost',lost);
 const loop=t=>{if(disposed)return;const elapsed=last?Math.max(0,t-last):16,dt=Math.min(.05,elapsed/1000);last=t;if(!document.hidden){clock+=dt;if(pending){pending.elapsed=Math.min(pending.duration,pending.elapsed+elapsed);const frame=clutchFrame(pending.step,Math.min(1,pending.elapsed/pending.baseDuration));drawFrame(frame,dt);if(pending.elapsed>=pending.duration){const finish=pending.resolve;pending=null;finish();}}else if(current&&!reduced)drawFrame({...current,progress:0},dt);}raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);const visibility=()=>{last=performance.now();};document.addEventListener('visibilitychange',visibility);
 return {setState,animate,loadModels,dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);ro.disconnect();pending?.resolve();pending=null;renderer.domElement.removeEventListener('webglcontextlost',lost);document.removeEventListener('visibilitychange',visibility);for(const a of actors.values()){a.model?.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.dispose();});a.ownMaterials?.forEach(m=>m.dispose());}releaseTemplate();for(const r of resources)r.dispose();for(const t of textures)t.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();actors.clear();scene.clear();}};
}
