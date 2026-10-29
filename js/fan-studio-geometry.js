export const studioWrapAngle=value=>((Number(value)||0)%360+360)%360;
export const studioShortestAngle=(from,to)=>((studioWrapAngle(to)-studioWrapAngle(from)+540)%360)-180;
export const studioClamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value)||0));
export const STUDIO_VIEWS=Object.freeze({front:0,back:180,hero:205,portrait:18});
export function studioCameraDistance(kind,aspect,zoom=1,withHanger=true){const ratio=Math.max(.1,Number(aspect)||1),span=kind==='scarf'?Math.max(.35,1.2/ratio):Math.max(withHanger?.91:.72,.69/ratio);return span/2/Math.tan(Math.PI/12)/studioClamp(zoom,.7,1.8);}
