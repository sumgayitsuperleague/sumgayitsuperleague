// A true 32-panel football and pitch, projected from 3D coordinates.
// This renderer needs Canvas 2D rather than a GPU, so the entrance is consistent.
const add=(a,b)=>a.map((v,i)=>v+b[i]),mul=(a,s)=>a.map(v=>v*s),dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>mul(a,1/Math.hypot(...a));
export function footballPanels(){
 const p=(1+Math.sqrt(5))/2,vertices=[];
 for(const a of [-1,1])for(const b of [-p,p])vertices.push(unit([0,a,b]),unit([a,b,0]),unit([b,0,a]));
 const distance=(a,b)=>Math.hypot(...add(a,mul(b,-1))),edge=Math.min(...vertices.flatMap((a,i)=>vertices.slice(i+1).map(b=>distance(a,b))));
 const neighbours=vertices.map((a,i)=>vertices.map((b,j)=>j!==i&&Math.abs(distance(a,b)-edge)<1e-5?j:-1).filter(j=>j>=0));
 const cut=(i,j)=>unit(add(mul(vertices[i],2),vertices[j]));
 const faces=vertices.map((normal,i)=>{const u=unit(cross(normal,Math.abs(normal[1])<.9?[0,1,0]:[1,0,0])),v=cross(normal,u);return {black:true,points:neighbours[i].map(j=>cut(i,j)).sort((a,b)=>Math.atan2(dot(a,v),dot(a,u))-Math.atan2(dot(b,v),dot(b,u)))};});
 for(let a=0;a<12;a++)for(const b of neighbours[a].filter(b=>b>a))for(const c of neighbours[b].filter(c=>c>b&&neighbours[a].includes(c)))faces.push({black:false,points:[cut(a,b),cut(b,a),cut(b,c),cut(c,b),cut(c,a),cut(a,c)]});
 return faces.map(face=>({...face,normal:unit(face.points.reduce(add,[0,0,0])),edge:face.points.flatMap((a,i)=>Array.from({length:7},(_,j)=>unit(add(mul(a,1-j/7),mul(face.points[(i+1)%face.points.length],j/7)))))}));
}
export function rotatePoint([x,y,z],yaw,pitch){const cy=Math.cos(yaw),sy=Math.sin(yaw),cx=Math.cos(pitch),sx=Math.sin(pitch),u=x*cy+z*sy,v=-x*sy+z*cy;return [u,y*cx-v*sx,y*sx+v*cx];}
export function renderProjectedFrame(g,width,height,{time=0,view='stand',pointer=0}={}){
 const mobile=width<620,scale=width/17,angle=view==='touchline'?.32:view==='aerial'?.78:.5;
 g.clearRect(0,0,width,height);
 const project=(x,z,y=0)=>{const depth=1+z*.055;return [width/2+(x+z*.10+pointer*.12)*scale/depth,height*.80+(z*angle-y)*scale/depth];};
 const path=points=>{g.beginPath();points.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();};
 const rect=(x,z,w,h,color)=>{path([[x,z],[x+w,z],[x+w,z+h],[x,z+h]].map(([x,z])=>project(x,z)));g.fillStyle=color;g.fill();};
 rect(-8.4,-4.6,16.8,9.2,'#164d49');
 for(let i=0;i<12;i++)rect(-8.4+i*1.4,-4.6,1.4,9.2,i%2?'#19554e':'#1c5e54');
 g.strokeStyle='#b6e4d28c';g.lineWidth=mobile?1:1.3;
 const line=points=>{g.beginPath();points.forEach(([x,z,y],i)=>i?g.lineTo(...project(x,z,y||0)):g.moveTo(...project(x,z,y||0)));g.stroke();};
 line([[-7.7,-4],[7.7,-4],[7.7,4],[-7.7,4],[-7.7,-4]]);line([[0,-4],[0,4]]);
 for(const sign of [-1,1]){line([[sign*7.7,-2.1],[sign*5.3,-2.1],[sign*5.3,2.1],[sign*7.7,2.1]]);line([[sign*7.7,-1],[sign*8.2,-1,1.25],[sign*8.2,1,1.25],[sign*7.7,1]]);for(let n=-1;n<=1;n+=.25)line([[sign*7.7,n],[sign*8.2,n,1.25]]);}
 line(Array.from({length:81},(_,i)=>[Math.cos(i/80*Math.PI*2)*1.5,Math.sin(i/80*Math.PI*2)*1.5]));
 const r=mobile?Math.min(67,width*.165):Math.min(114,width*.095),cx=width/2+pointer*3,cy=height*(mobile?.60:.57)+Math.sin(time*.7)*3;
 g.save();g.translate(cx,height*.87);g.scale(1,.22);const shadow=g.createRadialGradient(0,0,r*.1,0,0,r*1.4);shadow.addColorStop(0,'#010c1dda');shadow.addColorStop(1,'#010c1d00');g.fillStyle=shadow;g.fillRect(-r*1.5,-r*1.5,r*3,r*3);g.restore();
 const yaw=time*.28+.32+pointer*.06,pitch=.23+Math.sin(time*.2)*.12,light=unit([-.6,.8,1.2]);
 const faces=PANELS.map(f=>({...f,n:rotatePoint(f.normal,yaw,pitch),points:f.edge.map(p=>rotatePoint(p,yaw,pitch))})).filter(f=>f.n[2]>-.18).sort((a,b)=>a.n[2]-b.n[2]);
 g.save();g.beginPath();g.arc(cx,cy,r,0,Math.PI*2);g.clip();g.fillStyle='#e2e9ed';g.fillRect(cx-r,cy-r,r*2,r*2);
 for(const f of faces){const brightness=Math.max(0,dot(f.n,light)),v=Math.round(f.black?13+brightness*24:147+brightness*107);path(f.points.map(([x,y,z])=>{const k=5/(5-z);return [cx+x*r*.98*k,cy-y*r*.98*k];}));g.fillStyle=`rgb(${v},${Math.min(255,v+5)},${Math.min(255,v+8)})`;g.fill();g.strokeStyle=f.black?'#07111d':'#9aa9b3';g.lineWidth=Math.max(.65,r/160);g.stroke();}
 const shine=g.createRadialGradient(cx-r*.35,cy-r*.45,r*.05,cx,cy,r);shine.addColorStop(0,'#ffffff33');shine.addColorStop(.5,'#ffffff00');shine.addColorStop(1,'#03132660');g.fillStyle=shine;g.fillRect(cx-r,cy-r,r*2,r*2);g.restore();
}
const PANELS=footballPanels();
export function installProjectedStadium(carousel,options,{reduced=false}={}){
 const hosts=[...carousel.querySelectorAll('[data-stadium-canvas]')];if(!hosts.length)return ()=>{};
 const host=hosts[0],canvas=document.createElement('canvas'),g=canvas.getContext?.('2d');if(!g)return ()=>{};
 canvas.setAttribute('aria-hidden','true');canvas.className='stadium-projected-canvas';host.append(canvas);carousel.dataset.sceneEngine='projected-3d';
 let width=0,height=0,visible=true,disposed=false,frame=0,last=0,time=0,view=options.scene||'stand',pointer=0;
 const query=window.matchMedia?.('(prefers-reduced-motion: reduce)'),mobile=window.matchMedia?.('(max-width:760px)');
 const allowed=()=>!reduced&&!query?.matches&&options.depth!==false&&(options.mobile3d!==false||!mobile?.matches)&&carousel.dataset.scenePaused!=='true';
 const active=()=>carousel.querySelector('.stadium-slide.is-current [data-stadium-canvas]');
 const draw=()=>{if(width&&height)renderProjectedFrame(g,width,height,{time,view,pointer});};
 const resize=()=>{const r=host.getBoundingClientRect();width=r.width;height=r.height;if(!width||!height)return;const dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);g.setTransform(dpr,0,0,dpr,0,0);draw();};
 const run=now=>{frame=0;if(disposed||!visible||document.hidden||!active()||!allowed())return;if(now-last>=33){time+=Math.min((now-last)/1000,.05);last=now;draw();}frame=requestAnimationFrame(run);};
 const sync=()=>{const next=active();if(next&&canvas.parentNode!==next){next.append(canvas);resize();}cancelAnimationFrame(frame);frame=0;if(visible&&!document.hidden&&next&&allowed()){last=performance.now();frame=requestAnimationFrame(run);}else draw();};
 const move=e=>{if(!allowed()||e.pointerType==='touch')return;const r=carousel.getBoundingClientRect();pointer=(e.clientX-r.left)/r.width-.5;};
 const camera=e=>{view=e.detail?.scene||options.scene||'stand';draw();};
 carousel.addEventListener('pointermove',move,{passive:true});carousel.addEventListener('ssl-scene-camera',camera);carousel.addEventListener('ssl-slide-change',sync);carousel.addEventListener('ssl-scene-pause',sync);document.addEventListener('visibilitychange',sync);query?.addEventListener?.('change',sync);mobile?.addEventListener?.('change',sync);
 const ro=typeof ResizeObserver==='function'?new ResizeObserver(resize):null;ro?.observe(host);window.addEventListener('resize',resize,{passive:true});
 const io=typeof IntersectionObserver==='function'?new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync();},{threshold:.01}):null;io?.observe(carousel);
 const dispose=()=>{disposed=true;cancelAnimationFrame(frame);ro?.disconnect();io?.disconnect();window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',sync);query?.removeEventListener?.('change',sync);mobile?.removeEventListener?.('change',sync);carousel.removeEventListener('pointermove',move);carousel.removeEventListener('ssl-scene-camera',camera);carousel.removeEventListener('ssl-slide-change',sync);carousel.removeEventListener('ssl-scene-pause',sync);};
 window.addEventListener('pagehide',e=>{if(!e.persisted)dispose();});window.addEventListener('pageshow',sync);resize();sync();return dispose;
}
