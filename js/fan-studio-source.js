import {WebGLRenderer,Scene,PerspectiveCamera,Group,BufferGeometry,Float32BufferAttribute,Mesh,MeshStandardMaterial,CanvasTexture,SRGBColorSpace,AmbientLight,DirectionalLight,HemisphereLight,FrontSide,DoubleSide} from 'three';
import {fanClothMesh,fanProject} from './fan-studio-geometry.js';
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const normalAngle=a=>((a%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
function sampleAlpha(image){const ctx=image.getContext('2d',{willReadFrequently:true}),{data}=ctx.getImageData(0,0,image.width,image.height),w=image.width,h=image.height;return (u,v)=>data[(Math.min(h-1,Math.round(v*(h-1)))*w+Math.min(w-1,Math.round(u*(w-1))))*4+3];}
function geometryFor(mesh,side){const positions=[],uv=[];for(const f of mesh.faces)if(f.side===side)for(const i of [f.a,f.b,f.c]){const p=mesh.points[i],edge=side===2,reverse=i>=mesh.points.length/2,u=edge&&reverse?1-p.u:p.u,offset=edge&&reverse?.018:0;positions.push(p.x,p.y,p.z);uv.push(u+(u<.5?offset:-offset),1-(p.v+(p.v<.5?offset:-offset)));}const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.setAttribute('uv',new Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;}
function triangle(ctx,image,a,b,c){
 const u0=a.u*image.width,v0=a.v*image.height,u1=b.u*image.width,v1=b.v*image.height,u2=c.u*image.width,v2=c.v*image.height,den=u0*(v1-v2)+u1*(v2-v0)+u2*(v0-v1);if(Math.abs(den)<.00001)return;
 const aa=(a.x*(v1-v2)+b.x*(v2-v0)+c.x*(v0-v1))/den,bb=(a.y*(v1-v2)+b.y*(v2-v0)+c.y*(v0-v1))/den,cc=(a.x*(u2-u1)+b.x*(u0-u2)+c.x*(u1-u0))/den,dd=(a.y*(u2-u1)+b.y*(u0-u2)+c.y*(u1-u0))/den,ee=(a.x*(u1*v2-u2*v1)+b.x*(u2*v0-u0*v2)+c.x*(u0*v1-u1*v0))/den,ff=(a.y*(u1*v2-u2*v1)+b.y*(u2*v0-u0*v2)+c.y*(u0*v1-u1*v0))/den;
 const cx=(a.x+b.x+c.x)/3,cy=(a.y+b.y+c.y)/3,expand=p=>{const dx=p.x-cx,dy=p.y-cy,len=Math.hypot(dx,dy)||1;return {x:p.x+dx/len*.55,y:p.y+dy/len*.55};},p=expand(a),q=expand(b),r=expand(c);
 ctx.save();ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.lineTo(r.x,r.y);ctx.closePath();ctx.clip();ctx.transform(aa,bb,cc,dd,ee,ff);ctx.drawImage(image,0,0);ctx.restore();
}
export function createFanStudio(host,options){
 let kind=options.kind,front=options.front,back=options.back,colour=options.colour,angle=0,pitch=-.025,zoom=1,spinning=!matchMedia('(prefers-reduced-motion: reduce)').matches,visible=true,intersecting=true,disposed=false,frame=0,last=0,lastPaint=0,drag=null,model,renderer,scene,camera,group,software,observer,sideMap;
 const clean=[],canvas=document.createElement('canvas');canvas.className='fi-360-canvas';canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',options.label);host.append(canvas);
 const listen=(target,type,fn,opts)=>{target.addEventListener(type,fn,opts);clean.push(()=>target.removeEventListener(type,fn,opts));};
 const emit=()=>options.onChange?.({angle:Math.round(normalAngle(angle)*180/Math.PI),spinning,zoom});
 const releaseModel=()=>{if(group){for(const m of [...group.children]){m.geometry.dispose();m.material.map?.dispose();m.material.dispose();group.remove(m);}}};
 const size=()=>({width:Math.max(1,host.clientWidth),height:Math.max(1,host.clientHeight)});
 function useSoftware(){host.dataset.fiRenderer='canvas';renderer?.dispose();renderer=null;canvas.remove();const replacement=document.createElement('canvas');replacement.className='fi-360-canvas';replacement.tabIndex=0;replacement.setAttribute('role','img');replacement.setAttribute('aria-label',options.label);host.append(replacement);software=replacement;model=fanClothMesh(kind,sampleAlpha(front),{columns:kind==='scarf'?36:20,rows:kind==='scarf'?8:27});installInput(replacement);}
 try{
  const gl=canvas.getContext('webgl2',{alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'});if(!gl)throw Error('No WebGL2');
  renderer=new WebGLRenderer({canvas,context:gl,alpha:true,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.outputColorSpace=SRGBColorSpace;
  scene=new Scene();camera=new PerspectiveCamera(34,1,.1,100);camera.position.z=8.5;group=new Group();scene.add(group);scene.add(new AmbientLight(0xffffff,1.35));scene.add(new HemisphereLight(0xeef5ff,0x131b2c,.7));const key=new DirectionalLight(0xffffff,1.75);key.position.set(-3,4,6);scene.add(key);const rim=new DirectionalLight(0xbad5ff,1.5);rim.position.set(4,1,-5);scene.add(rim);
  listen(canvas,'webglcontextlost',event=>{event.preventDefault();if(!disposed){useSoftware();paint();}});
 }catch{useSoftware();}
 function makeModel(){sideMap?.remove();if(sideMap){sideMap.width=0;sideMap.height=0;}sideMap=document.createElement('canvas');sideMap.width=front.width;sideMap.height=front.height;const sideContext=sideMap.getContext('2d');sideContext.drawImage(front,0,0);sideContext.globalCompositeOperation='source-atop';sideContext.fillStyle='#00000048';sideContext.fillRect(0,0,sideMap.width,sideMap.height);model=fanClothMesh(kind,sampleAlpha(front),{columns:renderer?40:kind==='scarf'?36:20,rows:renderer?(kind==='scarf'?12:50):(kind==='scarf'?8:27)});if(!renderer)return;releaseModel();
  for(let side=0;side<3;side++){const map=new CanvasTexture(side===0?front:side===1?back:sideMap);if(map){map.colorSpace=SRGBColorSpace;map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());}const material=new MeshStandardMaterial({map,color:0xffffff,roughness:.83,metalness:.02,alphaTest:.06,side:side===2?DoubleSide:FrontSide});group.add(new Mesh(geometryFor(model,side),material));}
 }
 function drawSoftware(target,width,height){
  const context=target.getContext('2d'),ratio=target===software?Math.min(devicePixelRatio||1,1.5):1;target.width=Math.round(width*ratio);target.height=Math.round(height*ratio);context.setTransform(ratio,0,0,ratio,0,0);context.clearRect(0,0,width,height);
  const points=model.points.map(p=>fanProject(p,{angle,pitch,zoom,width,height,kind})),faces=[];
  for(const face of model.faces){const a=points[face.a],b=points[face.b],c=points[face.c],cross=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);if(face.side<2&&cross>0)continue;faces.push({...face,depth:(a.z+b.z+c.z)/3});}
  faces.sort((a,b)=>a.depth-b.depth);
  for(const face of faces){const a=points[face.a],b=points[face.b],c=points[face.c];if(face.side<2)triangle(context,face.side===0?front:back,a,b,c);else{const uv=(p,index)=>{const reverse=index>=model.points.length/2,u=reverse?1-p.u:p.u,offset=reverse?.018:0;return {...p,u:u+(u<.5?offset:-offset),v:p.v+(p.v<.5?offset:-offset)};};triangle(context,sideMap,uv(a,face.a),uv(b,face.b),uv(c,face.c));}}
 }
 function paint(){if(disposed)return;const {width,height}=size();if(renderer){renderer.setSize(width,height,false);camera.aspect=width/height;camera.fov=kind==='scarf'?28:34;camera.position.z=(kind==='scarf'?Math.max(3.8,14.8/camera.aspect):Math.max(8.5,6.3/camera.aspect))/zoom;camera.updateProjectionMatrix();group.rotation.set(pitch,angle,0);renderer.render(scene,camera);}else drawSoftware(software,width,height);host.dataset.fiAngle=String(Math.round(normalAngle(angle)*180/Math.PI));emit();}
 function tick(now){frame=0;if(disposed)return;const active=visible&&intersecting&&!document.hidden;if(active&&spinning&&!drag){angle+=Math.min((now-(last||now))/1000,.08)*.5;if(now-lastPaint>45){lastPaint=now;paint();}}last=now;if(active&&spinning)frame=requestAnimationFrame(tick);}
 const start=()=>{if(!frame&&!disposed&&visible&&intersecting&&!document.hidden&&spinning){last=0;frame=requestAnimationFrame(tick);}};
 const stop=()=>{cancelAnimationFrame(frame);frame=0;last=0;};
 function installInput(target){
  listen(target,'pointerdown',event=>{if(event.button!==0)return;drag={x:event.clientX,y:event.clientY,angle,pitch};spinning=false;target.setPointerCapture?.(event.pointerId);stop();emit();});
  listen(target,'pointermove',event=>{if(!drag)return;angle=drag.angle+(event.clientX-drag.x)*.012;pitch=clamp(drag.pitch+(event.clientY-drag.y)*.004,-.3,.3);paint();});
  const end=()=>{drag=null;emit();};listen(target,'pointerup',end);listen(target,'pointercancel',end);
  listen(target,'keydown',event=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home',' '].includes(event.key)){event.preventDefault();if(event.key===' ')spinning=!spinning;else{spinning=false;if(event.key==='Home'){angle=0;pitch=-.025;zoom=1;}if(event.key==='ArrowLeft')angle-=Math.PI/12;if(event.key==='ArrowRight')angle+=Math.PI/12;if(event.key==='ArrowUp')pitch=clamp(pitch+.05,-.3,.3);if(event.key==='ArrowDown')pitch=clamp(pitch-.05,-.3,.3);}paint();if(spinning)start();else stop();}});
 }
 if(renderer)installInput(canvas);makeModel();host.dataset.fiRenderer=renderer?'webgl':'canvas';
 if(typeof ResizeObserver==='function'){const resize=new ResizeObserver(()=>paint());resize.observe(host);clean.push(()=>resize.disconnect());}else listen(window,'resize',paint);
 if(typeof IntersectionObserver!=='undefined'){observer=new IntersectionObserver(entries=>{intersecting=entries[0]?.isIntersecting??true;if(intersecting){paint();start();}else stop();});observer.observe(host);clean.push(()=>observer.disconnect());}
 listen(document,'visibilitychange',()=>{if(document.hidden)stop();else start();});paint();start();
 return {
  setAngle(degrees){angle=Number(degrees)*Math.PI/180;spinning=false;stop();paint();},
  setZoom(value){zoom=clamp(Number(value),.8,1.65);paint();},
  setSpinning(value){spinning=Boolean(value);if(spinning)start();else stop();emit();},
  setVisible(value){visible=Boolean(value);if(visible){paint();start();}else stop();},
  update(next){if(disposed)return;kind=next.kind;(software||canvas).setAttribute('aria-label',next.label);options.club=next.club;options.season=next.season;front=next.front;back=next.back;colour=next.colour;makeModel();paint();},
  async exportPNG(width,height){
   if(disposed)throw Error('Disposed');const out=document.createElement('canvas');out.width=width;out.height=height;const ctx=out.getContext('2d'),bg=ctx.createRadialGradient(width*.5,height*.44,10,width*.5,height*.5,width*.8);bg.addColorStop(0,colour);bg.addColorStop(1,'#050b12');ctx.fillStyle='#050b12';ctx.fillRect(0,0,width,height);ctx.globalAlpha=.38;ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);ctx.globalAlpha=1;
   if(renderer){const ratio=renderer.getPixelRatio(),aspect=camera.aspect,fov=camera.fov,z=camera.position.z;renderer.setPixelRatio(1);renderer.setSize(width,height,false);camera.aspect=width/height;camera.fov=kind==='scarf'?28:34;camera.position.z=(kind==='scarf'?Math.max(3.8,14.8/camera.aspect):Math.max(8.5,6.3/camera.aspect))/zoom;camera.updateProjectionMatrix();renderer.render(scene,camera);ctx.drawImage(canvas,0,0,width,height);renderer.setPixelRatio(ratio);camera.aspect=aspect;camera.fov=fov;camera.position.z=z;camera.updateProjectionMatrix();paint();}
   else{const layer=document.createElement('canvas');drawSoftware(layer,width,height);ctx.drawImage(layer,0,0);layer.width=0;layer.height=0;}
   ctx.textAlign='center';ctx.fillStyle='#edf3ff';ctx.font=`700 ${Math.round(width*.027)}px Arial,sans-serif`;ctx.fillText(options.club,width/2,height*.075,width*.8);ctx.fillStyle='#a8bbd3';ctx.font=`${Math.round(width*.012)}px Arial,sans-serif`;ctx.fillText('SSL / FAN ATELIER / '+(options.season||'2026'),width/2,height*.955);const blob=await new Promise(resolve=>out.toBlob(resolve,'image/png'));out.width=0;out.height=0;if(!blob)throw Error('PNG unavailable');return blob;
  },
  destroy(){if(disposed)return;disposed=true;stop();for(const fn of clean)fn();releaseModel();renderer?.dispose();if(sideMap){sideMap.width=0;sideMap.height=0;}canvas.remove();software?.remove();host.remove();}
 };
}
