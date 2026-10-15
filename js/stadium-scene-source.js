import {
 Scene,PerspectiveCamera,WebGLRenderer,Group,Mesh,MeshStandardMaterial,
 MeshBasicMaterial,PlaneGeometry,BufferGeometry,Float32BufferAttribute,
 IcosahedronGeometry,Vector3,Color,LineBasicMaterial,LineSegments,
 AmbientLight,DirectionalLight,SRGBColorSpace,ACESFilmicToneMapping,DoubleSide
} from 'three';

// A truncated icosahedron: twelve black pentagons and twenty white hexagons.
// All geometry is procedural; there are no model, font or texture requests.
export function footballGeometry(){
 const ico=new IcosahedronGeometry(1,0),source=ico.getAttribute('position'),vertices=[],faces=[];
 for(let i=0;i<source.count;i+=3){
  const face=[];
  for(let j=0;j<3;j++){
   const v=new Vector3().fromBufferAttribute(source,i+j).normalize();
   let index=vertices.findIndex(p=>p.distanceToSquared(v)<1e-8);
   if(index<0){index=vertices.length;vertices.push(v);}face.push(index);
  }faces.push(face);
 }ico.dispose();
 const neighbors=vertices.map(()=>new Set());
 for(const face of faces)for(let i=0;i<3;i++){neighbors[face[i]].add(face[(i+1)%3]);neighbors[face[(i+1)%3]].add(face[i]);}
 const cut=(a,b)=>vertices[a].clone().multiplyScalar(2).add(vertices[b]).divideScalar(3);
 const polygons=[];
 for(let i=0;i<vertices.length;i++){
  const n=vertices[i],axis=new Vector3(0,1,0);if(Math.abs(n.dot(axis))>.9)axis.set(1,0,0);
  const u=new Vector3().crossVectors(n,axis).normalize(),v=new Vector3().crossVectors(n,u).normalize();
  const points=[...neighbors[i]].map(j=>cut(i,j)).sort((a,b)=>Math.atan2(a.dot(v),a.dot(u))-Math.atan2(b.dot(v),b.dot(u)));
  polygons.push({points,black:true});
 }
 for(const [a,b,c] of faces)polygons.push({points:[cut(a,b),cut(b,a),cut(b,c),cut(c,b),cut(c,a),cut(a,c)],black:false});
 const positions=[],colors=[],normals=[],seams=[],dark=new Color('#111c2b'),white=new Color('#f3f6fc');
 for(const {points,black} of polygons){
  const middle=points.reduce((sum,p)=>sum.add(p),new Vector3()).divideScalar(points.length),color=black?dark:white;
  for(let i=0;i<points.length;i++){
   const a=middle.clone().normalize(),b=points[i].clone().normalize(),c=points[(i+1)%points.length].clone().normalize();
   const normal=new Vector3().subVectors(b,a).cross(new Vector3().subVectors(c,a));
   const triangle=normal.dot(a)>0?[a,b,c]:[a,c,b];
   // Refine each panel to make its edges follow the spherical surface.
   const [x,y,z]=triangle,detail=4;
   const point=(u,v)=>x.clone().multiplyScalar(1-u-v).addScaledVector(y,u).addScaledVector(z,v).normalize();
   const put=(p,q,r)=>{for(const v of [p,q,r]){positions.push(v.x,v.y,v.z);normals.push(v.x,v.y,v.z);colors.push(color.r,color.g,color.b);}};
   for(let row=0;row<detail;row++)for(let col=0;col<detail-row;col++){
    const p=point(row/detail,col/detail),q=point((row+1)/detail,col/detail),r=point(row/detail,(col+1)/detail);put(p,q,r);
    if(col<detail-row-1)put(q,point((row+1)/detail,(col+1)/detail),r);
   }
   for(let j=0;j<8;j++){
    const p=b.clone().lerp(c,j/8).normalize().multiplyScalar(1.003),q=b.clone().lerp(c,(j+1)/8).normalize().multiplyScalar(1.003);
    seams.push(p.x,p.y,p.z,q.x,q.y,q.z);
   }
  }
 }
 const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new Float32BufferAttribute(normals,3));geometry.setAttribute('color',new Float32BufferAttribute(colors,3));
 const seamGeometry=new BufferGeometry();seamGeometry.setAttribute('position',new Float32BufferAttribute(seams,3));
 return {geometry,seamGeometry,pentagons:12,hexagons:20};
}

export function installStadiumScene(carousel,options,engine){
 if(!carousel||carousel.dataset.sceneEngine)return;
 carousel.dataset.sceneEngine='loading';
 const scene=new Scene(),camera=new PerspectiveCamera(37,1,.1,90),objects=new Group();scene.add(objects);
 let renderer,host=null,frame=null,visible=true,disposed=false,elapsed=0,last=0,resizeObserver=null;
 let quality=window.matchMedia('(max-width: 760px)').matches?1:1.5,slowFrames=0;
 const state={entrance:options.intro===false?0:1,scroll:0,turn:0},cleanups=[];
 const pose=()=>{
  camera.position.set(10-state.scroll*1.5,13-state.scroll*2.5,18);
  camera.lookAt(0,0,0);objects.rotation.y=.06+state.turn*.1;
 };
 const release=()=>{
  if(disposed)return;disposed=true;if(frame!==null)cancelAnimationFrame(frame);frame=null;
  for(const stop of cleanups)stop?.();resizeObserver?.disconnect();
  const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])materials.add(m);});
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer?.dispose();renderer?.domElement.remove();
  host?.parentElement?.classList.remove('has-webgl');
 };
 const fallback=()=>{carousel.dataset.sceneEngine='fallback';release();};
 try{
  renderer=new WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setClearColor(0x000000,0);renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
  renderer.domElement.setAttribute('aria-hidden','true');renderer.domElement.dataset.stadiumRender='';
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback();},{once:true});
  const ambient=new AmbientLight('#cce2ff',2.2),key=new DirectionalLight('#ffffff',4),rim=new DirectionalLight('#4f9cff',3);key.position.set(-5,12,10);rim.position.set(10,6,-8);scene.add(ambient,key,rim);
  const turf=new MeshStandardMaterial({color:'#123f47',roughness:.95}),field=new Mesh(new PlaneGeometry(21,12),turf);field.rotation.x=-Math.PI/2;objects.add(field);
  const stripeMaterial=new MeshBasicMaterial({color:'#1f5357',transparent:true,opacity:.42,side:DoubleSide});
  for(let i=0;i<8;i+=2){const stripe=new Mesh(new PlaneGeometry(21/8,12),stripeMaterial);stripe.rotation.x=-Math.PI/2;stripe.position.set(-10.5+(i+.5)*21/8,.005,0);objects.add(stripe);}
  const segments=[];
  const line=(a,b)=>segments.push(a[0],a[1],a[2],b[0],b[1],b[2]);
  const rect=(x,z,w,h)=>{const p=[[x,.025,z],[x+w,.025,z],[x+w,.025,z+h],[x,.025,z+h]];for(let i=0;i<4;i++)line(p[i],p[(i+1)%4]);};
  rect(-9.5,-5.2,19,10.4);line([0,.025,-5.2],[0,.025,5.2]);rect(-9.5,-2.5,3.1,5);rect(6.4,-2.5,3.1,5);
  for(let i=0;i<64;i++){const a=i*Math.PI/32,b=(i+1)*Math.PI/32;line([Math.cos(a)*1.7,.025,Math.sin(a)*1.7],[Math.cos(b)*1.7,.025,Math.sin(b)*1.7]);}
  const lines=new BufferGeometry();lines.setAttribute('position',new Float32BufferAttribute(segments,3));objects.add(new LineSegments(lines,new LineBasicMaterial({color:'#a7d9d0',transparent:true,opacity:.48})));
  for(const sign of [-1,1]){
   const net=[];const edge=(a,b)=>net.push(...a,...b),x=sign*9.6,rear=sign*10.5;
   for(const z of [-1.5,1.5]){edge([x,0,z],[x,1.7,z]);edge([x,1.7,z],[rear,1.3,z]);edge([rear,1.3,z],[rear,0,z]);}
   edge([x,1.7,-1.5],[x,1.7,1.5]);edge([rear,1.3,-1.5],[rear,1.3,1.5]);
   for(let z=-1.5;z<=1.5;z+=.3)edge([rear,.03,z],[rear,1.3,z]);
   const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(net,3));objects.add(new LineSegments(g,new LineBasicMaterial({color:'#c9e7ee',transparent:true,opacity:.45})));
  }
  const {geometry,seamGeometry}=footballGeometry(),ball=new Group();
  ball.add(new Mesh(geometry,new MeshStandardMaterial({vertexColors:true,roughness:.46,metalness:.02})));
  ball.add(new LineSegments(seamGeometry,new LineBasicMaterial({color:'#0a1829',transparent:true,opacity:.7})));
  ball.scale.setScalar(1.05);ball.position.set(8,1.3,5);objects.add(ball);
  const shadowGeometry=new PlaneGeometry(3.3,2.2),shadowMaterial=new MeshBasicMaterial({color:'#061c2c',transparent:true,opacity:.2,depthWrite:false});
  const shadow=new Mesh(shadowGeometry,shadowMaterial);shadow.rotation.x=-Math.PI/2;shadow.position.set(8,.035,5);objects.add(shadow);
  const canRun=()=>!disposed&&visible&&!document.hidden&&!!host&&!carousel.classList.contains('is-paused')&&host.closest('[data-stadium-slide]')?.getAttribute('aria-hidden')!=='true';
  const size=()=>{if(!host||disposed)return;const r=host.getBoundingClientRect();if(r.width<1||r.height<1)return;renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,quality));renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();pose();renderer.render(scene,camera);};
  const tick=now=>{
   frame=null;if(!canRun()){last=0;return;}
   const delta=last?Math.min((now-last)/1000,.08):0;last=now;elapsed+=delta;
   if(delta>.038)slowFrames++;else slowFrames=Math.max(0,slowFrames-1);
   if(slowFrames>45&&quality>1){quality=1;slowFrames=0;size();carousel.dataset.sceneQuality='low';}
   ball.rotation.set(.18+elapsed*.16,elapsed*.38,.12);ball.position.y=1.3+Math.sin(elapsed*1.15)*.22+state.entrance*.7;
   shadow.scale.setScalar(1-state.entrance*.15);pose();renderer.render(scene,camera);
   frame=requestAnimationFrame(tick);
  };
  const wake=()=>{if(canRun()&&frame===null)frame=requestAnimationFrame(tick);else if(!canRun()&&frame!==null){cancelAnimationFrame(frame);frame=null;last=0;}};
  const mount=()=>{
   const next=carousel.querySelector('.stadium-slide.is-current [data-stadium-canvas]');
   if(next!==host){host?.parentElement?.classList.remove('has-webgl');resizeObserver?.disconnect();host=next;
    if(host){host.append(renderer.domElement);size();host.parentElement.classList.add('has-webgl');resizeObserver?.observe(host);}
   }
   wake();
  };
  resizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(size):null;
  const changed=()=>{state.turn+=1;mount();};
  carousel.addEventListener('ssl-slide-change',changed);carousel.addEventListener('ssl-slide-pause',wake);document.addEventListener('visibilitychange',wake);window.addEventListener('resize',size,{passive:true});
  cleanups.push(()=>carousel.removeEventListener('ssl-slide-change',changed),()=>carousel.removeEventListener('ssl-slide-pause',wake),()=>document.removeEventListener('visibilitychange',wake),()=>window.removeEventListener('resize',size));
  const view=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;wake();},{threshold:.01}):null;view?.observe(carousel);cleanups.push(()=>view?.disconnect());
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)'),reduced=e=>{if(e.matches)fallback();};reduce.addEventListener?.('change',reduced);cleanups.push(()=>reduce.removeEventListener?.('change',reduced));
  const hide=e=>{if(e.persisted){if(frame!==null)cancelAnimationFrame(frame);frame=null;last=0;}else release();},show=e=>{if(e.persisted)wake();};
  window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);cleanups.push(()=>window.removeEventListener('pagehide',hide),()=>window.removeEventListener('pageshow',show));
  mount();
  if(engine?.animate&&options.intro!==false){state.entrance=1;const intro=engine.animate(state,{entrance:0},{duration:.78,ease:[.23,1,.32,1]});cleanups.push(()=>intro.stop());}
  if(engine?.scroll)cleanups.push(engine.scroll(progress=>{state.scroll=Math.max(0,Math.min(1,progress));if(!canRun()&&host&&!document.hidden&&visible)size();},{target:carousel,offset:['start start','end start']}));
  carousel.dataset.sceneEngine='three-0.186.1';carousel.dataset.sceneQuality=quality===1?'low':'balanced';
  return release;
 }catch{fallback();return release;}
}
