// Calibrated UV render data: every angle comes from the same real sewn 3D garment.
export const STUDIO_FRAME_COUNT=48;
export const STUDIO_ROOT='/assets/fan-studio/v3/';
export const studioWrapAngle=value=>((Number(value)||0)%360+360)%360;
export function studioFrameBlend(angle,count=STUDIO_FRAME_COUNT){const position=studioWrapAngle(angle)/360*count,lower=Math.floor(position);return {lower:lower%count,upper:(lower+1)%count,mix:position-lower};}
export function studioDecodeUV(r,g,b){return [(r*16+(b>>>4))/4095,(g*16+(b&15))/4095];}
export const STUDIO_LINEAR=Float32Array.from({length:256},(_,i)=>(i/255)**2.2);
export const STUDIO_DISPLAY=Uint8ClampedArray.from({length:8193},(_,i)=>Math.round(Math.min(1,i/4096)**(1/2.2)*255));
export function studioShadeChannel(value,diffuse,specular,scale=2){const linear=STUDIO_LINEAR[value]*STUDIO_LINEAR[diffuse]*scale+STUDIO_LINEAR[specular]*scale;return STUDIO_DISPLAY[Math.min(8192,Math.max(0,Math.round(linear*4096)))];}
export function studioCompileFrame(uv,light,width,height,textureWidth=2048,textureHeight=1024){
 if(!(uv instanceof Uint8ClampedArray)||!(light instanceof Uint8ClampedArray)||uv.length!==width*height*4||light.length!==uv.length)throw Error('Invalid studio surface data');
 let count=0;for(let i=3;i<uv.length;i+=4)if(uv[i])count++;
 const pixels=new Uint32Array(count),texels=new Uint32Array(count),diffuse=new Uint8Array(count),specular=new Uint8Array(count),alpha=new Uint8Array(count),weightX=new Uint8Array(count),weightY=new Uint8Array(count);let at=0;
 for(let i=0;i<uv.length;i+=4){if(!uv[i+3])continue;let ref=i;if(uv[i+3]<245){const x=(i/4)%width,y=Math.floor(i/4/width);let found=false;for(let radius=1;radius<=2&&!found;radius++)for(const [dx,dy] of [[-radius,0],[radius,0],[0,-radius],[0,radius],[-radius,-radius],[radius,radius]]){const xx=x+dx,yy=y+dy;if(xx<0||xx>=width||yy<0||yy>=height)continue;const n=(yy*width+xx)*4;if(uv[n+3]>=250){ref=n;found=true;break;}}}const [u,v]=studioDecodeUV(uv[ref],uv[ref+1],uv[ref+2]),x=Math.min(textureWidth-1.001,Math.max(0,u*(textureWidth-1))),y=Math.min(textureHeight-1.001,Math.max(0,(1-v)*(textureHeight-1)));pixels[at]=i;texels[at]=(Math.floor(y)*textureWidth+Math.floor(x))*4;weightX[at]=Math.round((x%1)*255);weightY[at]=Math.round((y%1)*255);diffuse[at]=light[i];specular[at]=light[i+1];alpha[at]=uv[i+3];at++;}
 return {width,height,textureWidth,pixels,texels,diffuse,specular,alpha,weightX,weightY};
}
export function studioPaintPixels(frame,texture){
 const out=new Uint8ClampedArray(frame.width*frame.height*4),linear=STUDIO_LINEAR,display=STUDIO_DISPLAY;
 for(let n=0;n<frame.pixels.length;n++){const index=frame.pixels[n],texel=frame.texels[n],below=texel+frame.textureWidth*4,wx=frame.weightX[n]/255,wy=frame.weightY[n]/255,d=linear[frame.diffuse[n]]*2,s=linear[frame.specular[n]]*2;for(let c=0;c<3;c++)out[index+c]=display[Math.min(8192,Math.round((((linear[texture[texel+c]]*(1-wx)+linear[texture[texel+4+c]]*wx)*(1-wy)+(linear[texture[below+c]]*(1-wx)+linear[texture[below+4+c]]*wx)*wy)*d+s)*4096))];out[index+3]=frame.alpha[n];}
 return out;
}
