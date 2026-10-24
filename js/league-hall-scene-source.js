import * as THREE from 'three';
// Real, lightweight WebGL geometry. Club emblems remain the owner's original files.
export function createLeagueHall(root,clubs,{selected=0,autoRotate=true,onSelect=()=>{},onActivity=()=>{}}={}){
 let renderer;
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});}catch{throw Error('WebGL unavailable');}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(43,1,.1,100),ring=new THREE.Group(),clock=new THREE.Clock(),ray=new THREE.Raycaster(),mouse=new THREE.Vector2(),targets=[],resources=new Set();
 let disposed=false,frame=0,visible=true,angle=-selected*Math.PI*2/clubs.length,current=angle,automatic=autoRotate&&!reduced,pointer=null,moved=false;
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor('#071b51');renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 root.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');scene.background=new THREE.Color('#0a2055');scene.fog=new THREE.Fog('#0a2055',23,48);scene.add(ring);
 camera.position.set(0,5.7,18.6);camera.lookAt(0,2,0);scene.add(new THREE.HemisphereLight('#e7f1ff','#1b3582',3));const key=new THREE.DirectionalLight('#ffffff',4);key.position.set(5,12,8);scene.add(key);const rim=new THREE.DirectionalLight('#7aa9ff',3);rim.position.set(-8,5,-7);scene.add(rim);
 const mat=(color,metalness=0,roughness=.6)=>new THREE.MeshStandardMaterial({color,metalness,roughness}),white=mat('#e8efff',.15,.35),blue=mat('#1c44be',.2,.45),deep=mat('#102e76',.15,.4),gold=mat('#d7bf85',.65,.35),glass=mat('#213e82',.4,.25);
 const mesh=(geometry,material,parent=scene)=>{const m=new THREE.Mesh(geometry,material);parent.add(m);return m;};
 const floor=mesh(new THREE.CylinderGeometry(11,11,.25,64),deep);floor.position.y=-.22;
 for(const radius of [3.7,8.8,10.7]){const line=mesh(new THREE.TorusGeometry(radius,.035,6,96),gold);line.rotation.x=Math.PI/2;line.position.y=-.07;}
 const centre=mesh(new THREE.CylinderGeometry(1.7,1.9,.24,48),blue);centre.position.y=.02;
 // A sculpted central football built from native geometry, no remote model download.
 const ball=mesh(new THREE.IcosahedronGeometry(.85,1),white);ball.position.y=1.55;
 const wire=mesh(new THREE.IcosahedronGeometry(.856,1),new THREE.MeshBasicMaterial({color:'#1c44be',wireframe:true}));wire.position.copy(ball.position);
 const pedestal=mesh(new THREE.CylinderGeometry(.5,.8,1,32),gold);pedestal.position.y=.63;
 const roof=mesh(new THREE.TorusGeometry(10.8,.14,8,96),white);roof.rotation.x=Math.PI/2;roof.position.y=7.7;
 const roof2=mesh(new THREE.TorusGeometry(8.7,.055,6,80),gold);roof2.rotation.x=Math.PI/2;roof2.position.y=7.8;
 for(let i=0;i<16;i++){const theta=(i+.5)*Math.PI/8,p=mesh(new THREE.CylinderGeometry(.07,.12,7.9,8),glass);p.position.set(Math.sin(theta)*10.8,3.8,Math.cos(theta)*10.8);}
 const loader=new THREE.TextureLoader();
 clubs.forEach((club,index)=>{
  const theta=index*Math.PI*2/clubs.length,g=new THREE.Group();g.position.set(Math.sin(theta)*7.4,0,Math.cos(theta)*7.4);g.rotation.y=theta;ring.add(g);
  const plinth=mesh(new THREE.CylinderGeometry(1.04,1.22,.45,8),white,g);plinth.position.y=.15;
  const stem=mesh(new THREE.BoxGeometry(.32,1.1,.32),gold,g);stem.position.y=.92;
  const shield=mesh(new THREE.BoxGeometry(1.95,2.5,.23),blue,g);shield.position.y=2.45;shield.userData.club=index;targets.push(shield);
  const surround=mesh(new THREE.BoxGeometry(2.04,2.59,.15),gold,g);surround.position.set(0,2.45,-.1);
  const face=mesh(new THREE.PlaneGeometry(1.78,2.3),white,g);face.position.set(0,2.45,.125);face.userData.club=index;targets.push(face);
  const texture=loader.load('/assets/logos/'+club.logo,()=>{if(disposed)texture.dispose();else texture.colorSpace=THREE.SRGBColorSpace;});resources.add(texture);texture.colorSpace=THREE.SRGBColorSpace;
  const emblem=mesh(new THREE.PlaneGeometry(1.53,1.53),new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.FrontSide,depthWrite:false}),g);emblem.position.set(0,2.56,.14);emblem.userData.club=index;targets.push(emblem);
  const bar=mesh(new THREE.BoxGeometry(.9,.07,.04),gold,g);bar.position.set(0,1.55,.16);
 });
 const resize=()=>{if(disposed)return;const {width,height}=root.getBoundingClientRect();renderer.setSize(Math.max(1,width),Math.max(1,height),false);camera.aspect=width/Math.max(1,height);camera.position.z=width<480?22:18.6;camera.updateProjectionMatrix();};
 const observer=new ResizeObserver(resize);observer.observe(root);resize();const intersection=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting!==false;});intersection.observe(root);
 const activity=()=>{automatic=false;onActivity();};
 const down=e=>{if(!e.isPrimary||e.button>0)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,angle};moved=false;renderer.domElement.setPointerCapture(e.pointerId);};
 const move=e=>{if(pointer?.id!==e.pointerId)return;const dx=e.clientX-pointer.x;if(Math.abs(dx)>5){moved=true;activity();angle=pointer.angle+dx*.008;}};
 const up=e=>{if(pointer?.id!==e.pointerId)return;const cancelled=e.type==='pointercancel',origin=pointer;pointer=null;try{renderer.domElement.releasePointerCapture(origin.id);}catch{}if(cancelled)return;activity();if(moved){onSelect(((Math.round(-angle/(Math.PI*2/clubs.length))%clubs.length)+clubs.length)%clubs.length);return;}const box=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-box.left)/box.width*2-1,-(e.clientY-box.top)/box.height*2+1);ray.setFromCamera(mouse,camera);const hit=ray.intersectObjects(targets,false)[0];if(hit)onSelect(hit.object.userData.club);};
 renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',up);
 const loop=()=>{if(disposed)return;frame=requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05);if(!visible||document.hidden)return;if(automatic&&!pointer)angle+=dt*.09;current=reduced?angle:THREE.MathUtils.damp(current,angle,5,dt);ring.rotation.y=current;ball.rotation.y=current*.2;wire.rotation.y=ball.rotation.y;renderer.render(scene,camera);};loop();
 return {select(index){const target=-index*Math.PI*2/clubs.length;angle=target+Math.round((angle-target)/(Math.PI*2))*Math.PI*2;},setAuto(value){automatic=!!value&&!reduced;},dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();for(const [name,fn] of [['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up]])renderer.domElement.removeEventListener(name,fn);scene.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])resources.add(m);});for(const item of resources)item.dispose();renderer.dispose();renderer.domElement.remove();}};
}
