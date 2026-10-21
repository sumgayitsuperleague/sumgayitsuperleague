// Metres and seconds. Rendering, input and device frame rate cannot change the rules.
export const PENALTY_FIELD=Object.freeze({halfWidth:2,height:2,post:.045,radius:.11,distance:7.5,gravity:9.81,keeperZ:.32});
export const PHYSICS_STEP=1/120;
export const clamp=(n,a,b)=>Math.min(b,Math.max(a,Number.isFinite(n)?n:a));
export function randomSequence(seed=1){let s=seed>>>0||1;return ()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
export function makePenaltyShot({x=0,y=1,power=.75,spin=0,difficulty='normal',streak=0,seed=1,idle=0}={}){
 const f=PENALTY_FIELD,p=clamp(power,.3,1),vz=-(13+p*10),flight=f.distance/-vz,curve=clamp(spin,-1,1)*2.8,rng=randomSequence(seed),tier={easy:{delay:.27,speed:4.8,error:1.1},normal:{delay:.21,speed:5.7,error:.5},hard:{delay:.15,speed:6.7,error:.26}}[difficulty]||{delay:.21,speed:5.7,error:.5},targetX=clamp(x,-3.3,3.3),targetY=clamp(y,.02,3.4),initialX=Math.sin(idle*1.8)*.28;
 return {t:0,position:{x:0,y:f.radius,z:f.distance},velocity:{x:(targetX-.5*curve*flight*flight)/flight,y:(targetY-f.radius+.5*f.gravity*flight*flight)/flight,z:vz},curve,result:null,resolvedAt:0,impact:null,target:{x:targetX,y:targetY},keeper:{startX:initialX,delay:Math.max(.11,tier.delay-Math.min(streak,12)*.003),speed:tier.speed,targetX:clamp(targetX+(rng()-.5)*tier.error*2,-1.85,1.85),targetY:clamp(targetY+(rng()-.5)*tier.error,.25,1.8)},history:[]};
}
export function keeperPose(shot,t=shot?.t||0,idle=0){
 if(!shot)return {x:Math.sin(idle*1.8)*.28,y:1.01,angle:0,reach:.15,dive:0,dir:0,handY:1.04};
 const k=shot.keeper,active=Math.max(0,t-k.delay),distance=k.targetX-k.startX,dir=Math.sign(distance)||1,duration=Math.max(.26,Math.abs(distance)/k.speed+.08),p=clamp(active/duration,0,1),e=1-Math.pow(1-p,2),dive=Math.min(1,Math.abs(distance)/.85)*e;
 return {x:k.startX+distance*e,y:1.01+Math.sin(p*Math.PI)*.22+(k.targetY-1)*.25*e,angle:-dir*dive*1.04,reach:e,dir,dive,handY:1.03+(k.targetY-1.03)*e};
}
function keeperHit(pos,pose){
 // The same torso and glove locations are used by the 3D and light renderers.
 const dx=pos.x-pose.x,dy=pos.y-pose.y,co=Math.cos(pose.angle),si=Math.sin(pose.angle),localX=dx*co+dy*si,localY=-dx*si+dy*co,r=PENALTY_FIELD.radius;
 if((localX/(.245+r))**2+(localY/(.43+r))**2<=1)return true;
 const hands=[{x:pose.x-.43-pose.reach*.12,y:pose.handY+.09},{x:pose.x+.43+pose.reach*.12,y:pose.handY+.09}];
 return hands.some(h=>Math.hypot(pos.x-h.x,pos.y-h.y)<.15+r)||Math.hypot(localX,localY-.56)<.18+r;
}
export function stepPenaltyShot(shot,dt=PHYSICS_STEP,{keeper=true}={}){
 const f=PENALTY_FIELD;dt=clamp(dt,0,1/30);if(!dt)return shot;
 const prev={...shot.position},p=shot.position,v=shot.velocity;shot.t+=dt;
 p.x+=v.x*dt+.5*shot.curve*dt*dt;v.x+=shot.curve*dt;p.y+=v.y*dt-.5*f.gravity*dt*dt;v.y-=f.gravity*dt;p.z+=v.z*dt;
 const crossing=z=>prev.z>z&&p.z<=z;
 const at=z=>{const a=(prev.z-z)/(prev.z-p.z);return {x:prev.x+(p.x-prev.x)*a,y:prev.y+(p.y-prev.y)*a,z};};
 const resolve=(result,hit)=>{shot.result=result;shot.resolvedAt=shot.t;shot.impact=hit;};
 if(!shot.result&&keeper&&crossing(f.keeperZ)){const hit=at(f.keeperZ),pose=keeperPose(shot);if(keeperHit(hit,pose)){resolve('save',hit);v.z=Math.abs(v.z)*.2;v.x+=(hit.x-pose.x)*5;v.y=Math.max(v.y,1.5);}}
 if(!shot.result&&crossing(0)){
  const hit=at(0),post=Math.abs(Math.abs(hit.x)-f.halfWidth)<=f.post+f.radius&&hit.y<=f.height+f.radius&&hit.y>=0,bar=Math.abs(hit.y-f.height)<=f.post+f.radius&&Math.abs(hit.x)<=f.halfWidth+f.radius;
  if(post||bar){resolve('post',hit);v.z=Math.abs(v.z)*.3;if(post)v.x=-v.x*.6;else v.y=-Math.abs(v.y)*.6;}
  else if(Math.abs(hit.x)<f.halfWidth-f.radius&&hit.y>=f.radius&&hit.y<f.height-f.radius){resolve('goal',hit);v.z*=.17;v.x*=.3;v.y*=.2;}
  else resolve('miss',hit);
 }
 if(p.y<f.radius){p.y=f.radius;v.y=Math.abs(v.y)*.38;v.x*=.92;v.z*=.92;}
 if(shot.result==='goal'&&p.z<-.9){p.z=-.9;v.z=Math.abs(v.z)*.15;}
 if(!shot.result&&shot.t>2.5)resolve('miss',{...p});
 if(shot.history.length<600)shot.history.push({t:shot.t,position:{...p},pose:keeperPose(shot)});
 return shot;
}
export function simulatePenalty(options,settings={}){const shot=makePenaltyShot(options);while(!shot.result&&shot.t<3)stepPenaltyShot(shot,PHYSICS_STEP,settings);return shot;}
export function gestureShot(points,rect){
 if(!Array.isArray(points)||points.length<2)return null;const a=points[0],b=points.at(-1),dy=a.y-b.y,length=Math.hypot(b.x-a.x,dy);if(length<Math.max(16,rect.height*.035)||dy<8)return null;
 const duration=Math.max(.08,(b.t-a.t)/1000),speed=length/Math.max(rect.height,1)/duration,middle=points[Math.floor(points.length/2)],straight=a.x+(b.x-a.x)*(middle.y-a.y)/(b.y-a.y||1);
 return {power:clamp(.38+speed*.23,.35,1),spin:clamp((middle.x-straight)/Math.max(rect.width*.16,1),-1,1)};
}
