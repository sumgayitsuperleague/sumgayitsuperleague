const mix=(a,b,p)=>p===0?a:p===1?b:a+(b-a)*p;
const smooth=p=>p*p*(3-2*p);
export function clutchFrame(step,progress){
 const p=Math.max(0,Math.min(1,Number.isFinite(progress)?progress:0)),ease=smooth(p),flight=smooth(Math.max(0,Math.min(1,(p-.16)/.73))),before=step.before,after=step.after;
 const players=before.players.map(a=>{const b=after.players.find(b=>b.id===a.id)||a;return {...a,x:mix(a.x,b.x,ease),z:mix(a.z,b.z,ease),moving:Math.hypot(b.x-a.x,b.z-a.z)>.15&&p>.02&&p<.98};});
 const carry=step.kind==='carry',v=carry?ease:flight;
 const ball={x:mix(before.ball.x,after.ball.x,v),z:mix(before.ball.z,after.ball.z,v),y:mix(before.ball.y,after.ball.y,v)+(v===0||v===1?0:Math.sin(v*Math.PI)*step.arc)};
 return {players,ball,owner:p<.55?before.owner:after.owner,time:mix(before.time,after.time,ease),score:p<.91?before.score:after.score,progress:p,shot:['shot','chip','save'].includes(step.kind),strike:p>.07&&p<.36?Math.sin((p-.07)/.29*Math.PI):0,celebrate:step.terminal==='goal'&&p>.86};
}
