const clamp=(value,min,max)=>Math.max(min,Math.min(value,max));
export function musicPosition(value){
 return value&&Number.isFinite(value.x)&&Number.isFinite(value.y)?{x:clamp(value.x,0,1),y:clamp(value.y,0,1)}:null;
}
export function musicBounds({width,height,viewportWidth,viewportHeight,dockTop}){
 const margin=12,bottom=Number.isFinite(dockTop)&&dockTop>0?Math.min(dockTop,viewportHeight):viewportHeight;
 return {left:margin,top:margin,right:Math.max(margin,viewportWidth-width-margin),bottom:Math.max(margin,bottom-height-margin)};
}
export function musicCoordinates(position,bounds){
 return {left:bounds.left+position.x*(bounds.right-bounds.left),top:bounds.top+position.y*(bounds.bottom-bounds.top)};
}
export function musicPlacement(left,top,bounds){
 return {x:clamp((left-bounds.left)/(bounds.right-bounds.left||1),0,1),y:clamp((top-bounds.top)/(bounds.bottom-bounds.top||1),0,1)};
}
