// GPU-independent stadium with the same recorded positions as the WebGL view.
export function createProjectedClutch(host,{getClubs,getMission,onFrame}){
 const canvas=document.createElement('canvas'),g=canvas.getContext('2d');if(!g)return null;canvas.className='cl-projected';canvas.setAttribute('aria-hidden','true');host.append(canvas);
 let width=1,height=1,frame=null,clock=0,disposed=false;
 const shade=(hex,k)=>{const n=parseInt(/^#[a-f0-9]{6}$/i.test(hex)?hex.slice(1):'315dd2',16);return '#'+[n>>16,(n>>8)&255,n&255].map(n=>Math.round(Math.max(0,Math.min(255,n*k))).toString(16).padStart(2,'0')).join('');};
 const draw=(next,time=0)=>{if(disposed||!next)return;frame=next;clock=time;const w=width,h=height,scale=Math.min(w/31,h/22)*1.2,defend=getMission()==='protect',focus=defend?6.5:-6.5,clubs=getClubs();
  const project=(x,z,y=0)=>{const q=(z-focus)*(defend?-1:1);return [w*.52+(.92*x+.38*q)*scale,h*.55+(.43*q-.19*x-y)*scale];};
  const path=points=>{g.beginPath();points.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();};
  const polygon=(points,fill,stroke)=>{path(points.map(([x,z,y])=>project(x,z,y||0)));if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.stroke();}};
  const line=(points,color='#dbe3ce',lineWidth=1)=>{g.beginPath();points.forEach(([x,z,y],i)=>i?g.lineTo(...project(x,z,y||0)):g.moveTo(...project(x,z,y||0)));g.strokeStyle=color;g.lineWidth=lineWidth;g.stroke();};
  const bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#10283b');bg.addColorStop(1,'#061524');g.fillStyle=bg;g.fillRect(0,0,w,h);
  for(const x of [w*.12,w*.87]){const glow=g.createRadialGradient(x,15,2,x,15,h*.7);glow.addColorStop(0,'#ccecff2b');glow.addColorStop(.3,'#6cc5e50b');glow.addColorStop(1,'#6cc5e500');g.fillStyle=glow;g.fillRect(0,0,w,h);}
  // Terraced stands and small silhouettes, placed deterministically.
  for(const side of [-1,1])for(let r=6;r>=0;r--){polygon([[side*(14+r*.6),-24,r*.5],[side*(17+r*.6),-24,r*.5],[side*(17+r*.6),24,r*.5],[side*(14+r*.6),24,r*.5]],r%2?'#142e43':'#163449');for(let i=0;i<43;i++){const [x,y]=project(side*(15+r*.6),i*1.1-23,r*.5+.4);g.fillStyle=['#71899b','#bfbc9b','#3b6589','#af8d7b','#bec3c0'][((i*11+r*3+side+5)%5)];g.globalAlpha=.38;g.fillRect(x,y,Math.max(1,scale*.1),scale*.22);g.globalAlpha=1;}}
  polygon([[-13.6,-20.7],[13.6,-20.7],[13.6,20.7],[-13.6,20.7]],'#0c3329');
  // Mowed strips keep the pitch depth legible even at phone sizes.
  for(let z=-19;z<19;z+=3.8)polygon([[-12,z],[12,z],[12,z+3.8],[-12,z+3.8]],Math.round((z+19)/3.8)%2?'#2c7454':'#317e5c');
  const turfShade=g.createLinearGradient(0,0,w,h);turfShade.addColorStop(0,'#b7d49a15');turfShade.addColorStop(1,'#001c253d');polygon([[-12,-19],[12,-19],[12,19],[-12,19]],turfShade);
  line([[-12,-19],[12,-19],[12,19],[-12,19],[-12,-19]],'#d6e4c890',1);line([[-12,0],[12,0]],'#d6e4c890',1);
  line(Array.from({length:65},(_,i)=>[Math.cos(i/64*Math.PI*2)*3.4,Math.sin(i/64*Math.PI*2)*3.4]),'#d6e4c890',1);
  for(const s of [-1,1]){line([[-6.5,s*19],[-6.5,s*13],[6.5,s*13],[6.5,s*19]],'#d6e4c890',1);line([[-3.5,s*19],[-3.5,s*17],[3.5,s*17],[3.5,s*19]],'#d6e4c890',1);const [px,py]=project(0,s*13);g.fillStyle='#d6e4c8';g.beginPath();g.arc(px,py,1,0,Math.PI*2);g.fill();}
  // LED boards and the league wordmark are part of the stadium, not UI text.
  for(const side of [-1,1]){polygon([[side*13.3,-21,.1],[side*13.3,21,.1],[side*13.3,21,.7],[side*13.3,-21,.7]],'#2650b9');line([[side*13.3,-21,.75],[side*13.3,21,.75]],'#78a0db90',1);}
  const goal=(s)=>{const z=19*s,back=21*s;for(let x=-3;x<=3;x+=.35){line([[x,back,0],[x,back,2.25]],'#e9f0e22a',.6);line([[x,back,2.25],[x,z,2.4]],'#e9f0e22a',.6);}for(let y=0;y<=2.3;y+=.27){line([[-3,back,y],[3,back,y]],'#e9f0e230',.6);for(const x of [-3,3])line([[x,back,y],[x,z,y]],'#e9f0e226',.6);}line([[-3,z,0],[-3,z,2.4],[3,z,2.4],[3,z,0]],'#eff3e6',Math.max(1.6,scale*.055));for(const x of [-3,3])line([[x,z,2.4],[x,back,2.25],[x,back,0]],'#b9c7c4',1);};
  goal(defend?-1:1);
  const owner=frame.players.find(p=>p.id===frame.owner);if(owner){const [x,y]=project(owner.x,owner.z);g.strokeStyle='#ead69c';g.lineWidth=1.5;g.beginPath();g.ellipse(x,y,scale*.61,scale*.26,-.12,0,Math.PI*2);g.stroke();}
  const player=p=>{const [x,y]=project(p.x,p.z),size=scale,walk=p.moving?Math.sin(clock*11+Number(p.id.slice(1))):0,team=p.side==='home'?clubs.home:clubs.away,kit=p.keeper?'#d5a34d':team?.color||'#2f62d6',skin=['#bc8e6e','#d2a17b','#9e7259','#c19576'][Number(p.id.slice(1))%4],celebrate=frame.celebrate&&p.side==='home';g.save();g.translate(x,y);
   const stroke=(x1,y1,x2,y2,color,width)=>{g.beginPath();g.moveTo(x1*size,y1*size);g.lineTo(x2*size,y2*size);g.strokeStyle=color;g.lineWidth=width*size;g.lineCap='round';g.stroke();};
   g.fillStyle='#031b2390';g.beginPath();g.ellipse(size*.1,size*.06,size*.42,size*.13,-.3,0,Math.PI*2);g.fill();
   // Boots, socks, shorts and limbs are drawn independently for each gait frame.
   for(const side of [-1,1]){const swing=walk*side*.21,footX=side*.12+swing;stroke(side*.11,-.71,footX,-.08,skin,.15);stroke(footX,-.32,footX,-.07,shade(kit,.8),.145);stroke(footX,-.05,footX+.12,-.04,'#101c27',.145);stroke(side*.105,-.84,side*.12,-.6,'#112844',.22);}
   for(const side of [-1,1]){const armX=side*(celebrate?.51:.4),armY=celebrate?-1.88:-.85+walk*side*.09;stroke(side*.23,-1.32,armX,armY,skin,.13);stroke(side*.22,-1.32,side*.29,-1.13,kit,.2);}
   const shirt=g.createLinearGradient(-size*.26,-size*1.4,size*.2,-size*.8);shirt.addColorStop(0,shade(kit,1.5));shirt.addColorStop(.5,kit);shirt.addColorStop(1,shade(kit,.68));g.fillStyle=shirt;path([[-.24,-1.4],[.24,-1.4],[.19,-.8],[-.19,-.8]].map(([a,b])=>[a*size,b*size]));g.fill();g.strokeStyle='#f0ead37a';g.lineWidth=Math.max(.5,size*.035);g.beginPath();g.moveTo(-.19*size,-1.35*size);g.lineTo(-.1*size,-1.25*size);g.moveTo(.19*size,-1.35*size);g.lineTo(.1*size,-1.25*size);g.stroke();
   g.fillStyle='#f2f0e3';g.font='800 '+Math.max(6,size*.22)+'px Arial';g.textAlign='center';g.fillText(p.keeper?'1':String(Number(p.id.slice(1))+5),0,-size*1.02);
   g.fillStyle=skin;g.beginPath();g.ellipse(0,-1.6*size,.145*size,.18*size,0,0,Math.PI*2);g.fill();g.fillStyle='#272522';g.beginPath();g.ellipse(-.01*size,-1.72*size,.145*size,.09*size,-.2,Math.PI,Math.PI*2);g.fill();g.restore();
  };
  const ordered=frame.players.slice().sort((a,b)=>project(a.x,a.z)[1]-project(b.x,b.z)[1]);for(const p of ordered)player(p);
  const [ballX,ballY]=project(frame.ball.x,frame.ball.z,frame.ball.y),[shadowX,shadowY]=project(frame.ball.x,frame.ball.z);g.fillStyle='#08252677';g.beginPath();g.ellipse(shadowX,shadowY,scale*.2,scale*.08,0,0,Math.PI*2);g.fill();const ballRadius=Math.max(2.5,scale*.2),ballGradient=g.createRadialGradient(ballX-ballRadius*.3,ballY-ballRadius*.4,0,ballX,ballY,ballRadius);ballGradient.addColorStop(0,'#fffef3');ballGradient.addColorStop(1,'#b3c5c5');g.fillStyle=ballGradient;g.beginPath();g.arc(ballX,ballY,ballRadius,0,Math.PI*2);g.fill();g.fillStyle='#273139';g.beginPath();g.arc(ballX+.3,ballY-.2,ballRadius*.36,0,Math.PI*2);g.fill();
  goal(defend?1:-1);
  onFrame?.(frame,{x:ballX,y:ballY});
 };
 const resize=()=>{width=Math.max(1,host.clientWidth);height=Math.max(1,host.clientHeight);const ratio=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);g.setTransform(ratio,0,0,ratio,0,0);if(frame)draw(frame,clock);};const ro=new ResizeObserver(resize);ro.observe(host);resize();
 return {draw,dispose(){disposed=true;ro.disconnect();canvas.remove();}};
}
