// A closed two-sided cloth surface, shared by the GPU and software renderers.
export function fanClothMesh(kind,alpha,{columns=24,rows=kind==='scarf'?8:30}={}){
 const scarf=kind==='scarf',width=scarf?6.2:3.8,height=scarf?1.22:4.78,points=[],faces=[],cells=new Set(),stride=columns+1;
 const sample=(u,v)=>typeof alpha==='function'?alpha(Math.max(0,Math.min(1,u)),Math.max(0,Math.min(1,v))):255;
 for(let j=0;j<rows;j++)for(let i=0;i<columns;i++)if(sample((i+.5)/columns,(j+.5)/rows)>12||[sample(i/columns,j/rows),sample((i+1)/columns,j/rows),sample(i/columns,(j+1)/rows),sample((i+1)/columns,(j+1)/rows)].some(v=>v>100))cells.add(j*columns+i);
 const boundary=new Set();
 for(const cell of cells){const i=cell%columns,j=Math.floor(cell/columns),a=j*stride+i,b=a+1,c=a+stride,d=c+1;if(i===0||!cells.has(cell-1)){boundary.add(a);boundary.add(c);}if(i===columns-1||!cells.has(cell+1)){boundary.add(b);boundary.add(d);}if(j===0||!cells.has(cell-columns)){boundary.add(a);boundary.add(b);}if(j===rows-1||!cells.has(cell+columns)){boundary.add(c);boundary.add(d);}}
 const edgeUV=(u,v,index)=>{if(!boundary.has(index)||sample(u,v)>130)return [u,v];for(let step=1;step<=22;step++){const radius=step*.0035;for(let ray=0;ray<24;ray++){const direction=ray*Math.PI/12,x=u+Math.cos(direction)*radius,y=v+Math.sin(direction)*radius;if(x>=0&&x<=1&&y>=0&&y<=1&&sample(x,y)>150)return [x,y];}}return [u,v];};
 const surfaceUV=Array.from({length:stride*(rows+1)},(_,index)=>edgeUV((index%stride)/columns,Math.floor(index/stride)/rows,index));
 const shape=(u,v,back)=>{
  let x=(u-.5)*width,y=(.5-v)*height,z;
  if(scarf)z=.18*Math.sin(u*Math.PI*2.2)+.055*Math.sin(u*17+v*3)+(v-.5)*.2*Math.sin(u*7)+(back?-.022:.022);
  else{const radial=Math.sqrt(Math.max(0,1-((u-.51)/.34)**2)),sleeve=v<.44&&Math.abs(u-.5)>.29,depth=sleeve?.105+.035*Math.sin(v*15):.075+.18*radial,wave=.018*Math.sin(u*39+v*19)+.013*Math.cos(v*71+u*9);z=(back?-1:1)*(depth+wave);x+=.018*Math.sin(v*19)*(u-.5);}
  return {x,y,z,u:back?1-u:u,v};
 };
 for(let side=0;side<2;side++)for(let j=0;j<=rows;j++)for(let i=0;i<=columns;i++)points.push(shape(...surfaceUV[j*stride+i],side===1));
 const count=stride*(rows+1),add=(a,b,c,side)=>faces.push({a,b,c,side});
 for(const cell of cells){const i=cell%columns,j=Math.floor(cell/columns),a=j*stride+i,b=a+1,c=a+stride,d=c+1;add(a,c,b,0);add(b,c,d,0);add(a+count,b+count,c+count,1);add(b+count,d+count,c+count,1);
  const edges=[];if(i===0||!cells.has(cell-1))edges.push([c,a]);if(i===columns-1||!cells.has(cell+1))edges.push([b,d]);if(j===0||!cells.has(cell-columns))edges.push([a,b]);if(j===rows-1||!cells.has(cell+columns))edges.push([d,c]);
  for(const [v,w] of edges){add(v,w,v+count,2);add(w,w+count,v+count,2);}
 }
 return {points,faces,width,height,columns,rows};
}
export function fanProject(point,{angle=0,pitch=0,zoom=1,width=640,height=480,kind='kit'}={}){
 const c=Math.cos(angle),s=Math.sin(angle),cp=Math.cos(pitch),sp=Math.sin(pitch),x=point.x*c+point.z*s,z0=-point.x*s+point.z*c,y=point.y*cp-z0*sp,z=point.y*sp+z0*cp;
 const focal=8.5/(8.5-z),scale=Math.min(width/(kind==='scarf'?7.2:4.8),height/(kind==='scarf'?2.5:5.6))*zoom;
 return {x:width/2+x*scale*focal,y:height/2-y*scale*focal,z,u:point.u,v:point.v};
}
