import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createSoftwareStudioScene} from './fan-studio-software.js';
import {studioCameraDistance} from './fan-studio-geometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

export const STUDIO_MODEL='/assets/fan-studio/v4/jersey.glb';
let garmentPromise;
export function loadStudioGarment(){return garmentPromise||=(new GLTFLoader().loadAsync(STUDIO_MODEL).catch(error=>{garmentPromise=null;throw error;}));}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function clothMaterial(original,texture,base,{scarf=false}={}){
 const normal=original.normalMap?.clone(),ao=original.aoMap?.clone();if(normal)normal.channel=1;if(ao)ao.channel=1;
 const material=new THREE.MeshPhysicalMaterial({map:texture,color:0xffffff,normalMap:normal,normalScale:new THREE.Vector2(scarf?.34:.18,scarf?.34:.18),aoMap:scarf?null:ao,aoMapIntensity:.78,roughness:scarf?.9:.72,metalness:0,sheen:scarf?.6:.28,sheenColor:new THREE.Color(base),sheenRoughness:.86,specularIntensity:.32,side:THREE.DoubleSide,envMapIntensity:.48});
 const colour=new THREE.Color(base);material.onBeforeCompile=shader=>{shader.uniforms.sslInside={value:colour};shader.fragmentShader='uniform vec3 sslInside;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nif (!gl_FrontFacing) diffuseColor.rgb = sslInside;');};material.customProgramCacheKey=()=>scarf?'ssl-wool-v4':'ssl-knit-v4';material.userData.insideColour=colour;return material;
}
function hanger(){
 const group=new THREE.Group(),material=new THREE.MeshStandardMaterial({color:'#202229',metalness:.64,roughness:.32}),tube=(points,radius=.004)=>{const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,64,radius,10,false),material);mesh.castShadow=true;group.add(mesh);return mesh;};
 tube([[-.178,.238,0],[-.108,.286,0],[0,.326,0],[.108,.286,0],[.178,.238,0],[.09,.232,0],[0,.23,0],[-.09,.232,0],[-.178,.238,0]],.005);
 tube([[0,.325,0],[0,.36,0],[-.022,.379,0],[-.026,.402,0],[-.008,.418,0],[.016,.416,0],[.026,.4,0]],.003);
 const strapMat=new THREE.MeshStandardMaterial({color:'#292b31',roughness:.88});const strap=new THREE.Mesh(new THREE.BoxGeometry(.009,.24,.002),strapMat);strap.position.set(0,.54,0);group.add(strap);group.name='SSL_hanger';return group;
}
function scarfMesh(texture,original,base,accent){
 const group=new THREE.Group(),verts=[],uv=[],uv1=[],indices=[],nx=120,ny=22,side=(nx+1)*(ny+1);
 const point=(u,v,back)=>[(u-.5)*1.08,(v-.5)*.17+.022*Math.cos(u*Math.PI*2),.022*Math.sin(u*Math.PI*3.6)+.005*Math.sin(u*Math.PI*18+v*2)+(back?-.002:.002)];
 for(let back=0;back<2;back++)for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){const u=i/nx,v=j/ny;verts.push(...point(u,v,back));uv.push(back?.5+.5*(1-u):.5*u,v);uv1.push(u*1.8,v*.34);}
 for(let back=0;back<2;back++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=back*side+j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;indices.push(...(back?[a,d,b,a,c,d]:[a,b,d,a,d,c]));}
 // The woven edge is an actual thin connecting surface, not a flat image edge.
 for(let j=0;j<ny;j++)for(const i of [0,nx]){const a=j*(nx+1)+i,b=a+nx+1;indices.push(a,a+side,b+side,a,b+side,b);}
 for(let i=0;i<nx;i++)for(const j of [0,ny]){const a=j*(nx+1)+i,b=a+1;indices.push(a,b,b+side,a,b+side,a+side);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setAttribute('uv1',new THREE.Float32BufferAttribute(uv1,2));geometry.setIndex(indices);geometry.computeVertexNormals();const mat=clothMaterial(original,texture,base,{scarf:true});const mesh=new THREE.Mesh(geometry,mat);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
 const thread=new THREE.MeshPhysicalMaterial({color:accent,roughness:.95,sheen:1,sheenRoughness:.9});thread.userData.fanAccent=true;
 for(let edge=0;edge<2;edge++)for(let j=0;j<40;j++){const v=(j+.5)/40,start=point(edge,v,0),sign=edge?1:-1,p=[];for(let k=0;k<5;k++){const t=k/4;p.push(new THREE.Vector3(start[0]+sign*.033*t,start[1]-.005*t+.001*Math.sin(j+t*7),start[2]+.003*Math.sin(j*.9+t*3)));}const strand=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p),8,.00075,4,false),thread);strand.castShadow=true;group.add(strand);}
 group.name='SSL_woven_scarf';return group;
}
export async function buildGarment(kind,atlas,{base='#2449bf',accent='#ecedee',withHanger=true}={}){
 const gltf=await loadStudioGarment();const first=gltf.scene.getObjectByProperty('isMesh',true),original=first.material,texture=new THREE.CanvasTexture(atlas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=true;
 const root=new THREE.Group();let model;
 if(kind==='scarf')model=scarfMesh(texture,original,base,accent);else{model=gltf.scene.clone(true);model.traverse(mesh=>{if(!mesh.isMesh)return;mesh.material=clothMaterial(mesh.material,texture,base);mesh.castShadow=true;mesh.receiveShadow=true;});const box=new THREE.Box3().setFromObject(model),center=box.getCenter(new THREE.Vector3());model.position.sub(center);root.add(model);if(withHanger)root.add(hanger());}
 if(kind==='scarf')root.add(model);root.userData.texture=texture;root.userData.kind=kind;root.userData.model=model;return root;
}
async function createWebGLScene(canvas,{kind='kit',atlas,base='#2449bf',accent='#e7e8eb',theme='dark',withHanger=true}={}){
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.92;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0x000000,0);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(30,1,.01,15),environment=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer),envTarget=pmrem.fromScene(environment,.035);scene.environment=envTarget.texture;environment.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight('#ffffff','#8992a0',.35));
 const key=new THREE.DirectionalLight('#fff8ed',2.4);key.position.set(-1.4,2.4,2.5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-.9;key.shadow.camera.right=.9;key.shadow.camera.top=.9;key.shadow.camera.bottom=-.9;key.shadow.camera.near=.1;key.shadow.camera.far=7;key.shadow.bias=-.00012;key.shadow.normalBias=.001;key.shadow.radius=3;scene.add(key);
 const fill=new THREE.DirectionalLight('#e3edff',.75);fill.position.set(2,.5,1.5);scene.add(fill);const rim=new THREE.DirectionalLight('#ffffff',1.8);rim.position.set(0,1.8,-2);scene.add(rim);
 let garment=await buildGarment(kind,atlas,{base,accent,withHanger});scene.add(garment);const floor=new THREE.Mesh(new THREE.PlaneGeometry(3,3),new THREE.ShadowMaterial({opacity:.13}));floor.rotation.x=-Math.PI/2;floor.position.y=kind==='scarf'?-.16:-.37;floor.receiveShadow=true;scene.add(floor);
 let width=1,height=1,ratio=1,angle=-24,pitch=-5,zoom=1;
 const pose=(next={})=>{if(Number.isFinite(next.angle))angle=next.angle;if(Number.isFinite(next.pitch))pitch=clamp(next.pitch,-50,50);if(Number.isFinite(next.zoom))zoom=clamp(next.zoom,.7,1.8);garment.rotation.set(THREE.MathUtils.degToRad(pitch),THREE.MathUtils.degToRad(angle),0);const aspect=width/height,distance=studioCameraDistance(kind,aspect,zoom,withHanger);camera.position.set(0,kind==='scarf'?.012:withHanger?.08:0,distance);camera.lookAt(0,kind==='scarf'?.012:withHanger?.08:0,0);camera.aspect=aspect;camera.updateProjectionMatrix();};
 return {
  backend:'webgl',canvas,renderer,scene,camera,get garment(){return garment;},
  resize(w,h,dpr=1){width=Math.max(1,w);height=Math.max(1,h);ratio=clamp(dpr,1,2);renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);pose();},
  render(next){pose(next);renderer.render(scene,camera);},
  setHanger(value){withHanger=Boolean(value);const item=garment.getObjectByName('SSL_hanger');if(item)item.visible=withHanger;pose();},
  async update(next){if(next.kind&&next.kind!==kind){scene.remove(garment);disposeGarment(garment);kind=next.kind;garment=await buildGarment(kind,next.atlas,{base:next.base||next.colour||base,accent:next.accent||accent,withHanger:true});scene.add(garment);const hook=garment.getObjectByName('SSL_hanger');if(hook)hook.visible=withHanger;floor.position.y=kind==='scarf'?-.16:-.37;}else{garment.userData.texture.image=next.atlas;garment.userData.texture.needsUpdate=true;garment.traverse(o=>{if(o.isMesh&&o.material.userData.insideColour)(o.material.userData.insideColour.set(next.base||next.colour||base),o.material.sheenColor.set(next.base||next.colour||base));if(o.isMesh&&o.material.userData.fanAccent)o.material.color.set(next.accent||accent);});}pose();},
  dispose(){disposeGarment(garment);floor.geometry.dispose();floor.material.dispose();key.shadow.map?.dispose();envTarget.dispose();renderer.dispose();renderer.forceContextLoss();}
 };
}
function disposeGarment(root){const textures=new Set(),materials=new Set();root.traverse(o=>{if(!o.isMesh)return;materials.add(o.material);if(root.userData.kind==='scarf'||o.parent?.name==='SSL_hanger')o.geometry.dispose();});for(const m of materials){for(const k of ['map','normalMap','aoMap'])if(m[k])textures.add(m[k]);m.dispose();}for(const t of textures)t.dispose();}

export async function createStudioScene(canvas,options={}){let context;try{context=canvas.getContext('webgl2',{alpha:true,antialias:true,preserveDrawingBuffer:true});}catch{}if(!context)return createSoftwareStudioScene(canvas,options,buildGarment);return createWebGLScene(canvas,options);}
