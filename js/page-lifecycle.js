// Each rendered page owns its listeners, timers and graphics resources.
// The music player and the router deliberately live outside this scope.
let active=null,current=null;
export const pageScope=()=>active||current;
export function createPageScope(){
 const stops=new Set();let disposed=false;
 const scope={get disposed(){return disposed;},run(fn){if(disposed)return;const previous=active;active=scope;try{return fn();}finally{active=previous;}},add(stop){if(typeof stop!=='function')return stop;if(disposed)stop();else stops.add(stop);return stop;},dispose(){if(disposed)return;disposed=true;for(const stop of [...stops].reverse())try{stop();}catch(error){console.error('Page cleanup failed',error);}stops.clear();}};
 current=scope;return scope;
}
export const onPageCleanup=(stop,scope=pageScope())=>{scope?.add(stop);return stop;};
export function pageListen(target,type,listener,options){
 const scope=pageScope(),handler=scope?function(event){return scope.run(()=>listener.call(this,event));}:listener;
 target.addEventListener(type,handler,options);
 return onPageCleanup(()=>target.removeEventListener(type,handler,options),scope);
}
export function pageInterval(fn,delay){const scope=pageScope(),id=setInterval(()=>scope?scope.run(fn):fn(),delay);onPageCleanup(()=>clearInterval(id),scope);return id;}
export function pageTimeout(fn,delay){const scope=pageScope(),id=setTimeout(()=>scope?scope.run(fn):fn(),delay);onPageCleanup(()=>clearTimeout(id),scope);return id;}

export function pageFrame(fn){const scope=pageScope(),id=requestAnimationFrame(t=>scope?scope.run(()=>fn(t)):fn(t));onPageCleanup(()=>cancelAnimationFrame(id),scope);return id;}
