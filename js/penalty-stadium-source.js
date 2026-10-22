import {Mesh,Group,BufferGeometry,Float32BufferAttribute,InstancedBufferAttribute,BoxGeometry,CylinderGeometry,PlaneGeometry,MeshStandardMaterial,MeshBasicMaterial,CanvasTexture,SRGBColorSpace,InstancedMesh,Object3D,Color,Vector3,DoubleSide} from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {randomSequence} from './penalty-physics.js';
// Static architecture is batched by material. The crowd atlas is one instanced draw.
export function buildPenaltyStadium(scene,{crowdMap,ownedG,ownedM,ownedT,mobile}){
 const batches=new Map(),rng=randomSequence(7523),center=8.5;
 const material=(color,more={})=>{const m=new MeshStandardMaterial({color,roughness:.86,...more});ownedM.push(m);return m;};
 const concrete=material('#63707b'),risers=material('#354656'),steel=material('#728697',{metalness:.68,roughness:.45}),roof=material('#c3ccd0',{metalness:.32,roughness:.62}),dark=material('#102133'),blue=material('#185a9b',{roughness:.54}),glass=material('#365168',{metalness:.55,roughness:.28}),light=new MeshBasicMaterial({color:'#b6dcf4',toneMapped:false});ownedM.push(light);
 function add(g,m){if(g.index){const flat=g.toNonIndexed();g.dispose();g=flat;}if(!batches.has(m))batches.set(m,[]);batches.get(m).push(g);}
 function box(w,h,d,m,x,y,z,ry=0){const g=new BoxGeometry(w,h,d);g.rotateY(ry);g.translate(x,y,z);add(g,m);}
 const up=new Vector3(0,1,0);
 function beam(a,b,r=.032,m=steel){const v=new Vector3(...a),w=new Vector3(...b),axis=w.clone().sub(v),g=new CylinderGeometry(r,r,axis.length(),6);g.applyQuaternion(new Object3D().quaternion.setFromUnitVectors(up,axis.normalize()));g.translate((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);add(g,m);}
 const pos=(rx,rz,a,y)=>[Math.cos(a)*rx,y,center+Math.sin(a)*(rz+3)];
 function ring(rx,rz,width,y,m,vertical=0){const points=[],normals=[],uv=[],n=128;for(let i=0;i<n;i++){const a=i/n*Math.PI*2,b=(i+1)/n*Math.PI*2,p=pos(rx,rz,a,y),q=pos(rx,rz,b,y),r=pos(rx+width,rz+width,b,y+vertical),s=pos(rx+width,rz+width,a,y+vertical);for(const v of [p,q,s,q,r,s]){points.push(...v);normals.push(0,1,0);uv.push(v[0]*.15,v[2]*.15);}}const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(points,3));g.setAttribute('normal',new Float32BufferAttribute(normals,3));g.setAttribute('uv',new Float32BufferAttribute(uv,2));if(vertical)g.computeVertexNormals();add(g,m);}
 const seats=[],fans=[];
 for(let row=0;row<13;row++){
  const upper=row>=7,offset=upper?1.6:0,rx=12.1+row*.73+offset,rz=14.4+row*.73+offset,y=.24+row*.44+(upper?.75:0);
  ring(rx,rz,.76,y,concrete);ring(rx,rz,.005,y,risers,-.44);
  const count=168+row*8;
  for(let col=0;col<count;col++){
   const a=(col+.5*(row%2))/count*Math.PI*2,sector=Math.floor(a/(Math.PI/8)),lane=col%Math.round(count/16);
   if(lane===0||lane===1)continue;
   const [x,,z]=pos(rx+.25,rz+.25,a,y),angle=Math.atan2(-x,center-z),seat={x,y:y+.2,z,angle};seats.push(seat);
   if(rng()>(upper?.09:.045))fans.push({...seat,y:y+.76,variant:Math.floor(rng()*8),scale:.9+rng()*.13,light:.65+rng()*.32,phase:rng()*Math.PI*2});
  }
 }
 // Continuous concourse, glazed hospitality strip, exit tunnels and guardrails.
 ring(17.15,19.45,2.3,3.6,concrete);ring(17.15,19.45,.005,4.1,glass,.62);ring(17.15,19.45,.13,4.1,steel);
 for(let i=0;i<16;i++){
  const a=i/16*Math.PI*2,p=pos(12.5,14.8,a,0),ang=Math.atan2(-p[0],center-p[2]);box(1.15,1.65,.22,dark,p[0],.8,p[2],ang);box(1.22,.12,.28,blue,p[0],1.66,p[2],ang);
  const p1=pos(17.2,19.5,a,4.2),p2=pos(17.2,19.5,a+.02,4.8);beam(p1,p2,.028);
 }
 // Cantilever roof with radial trusses and a thin continuous light ribbon.
 ring(17.6,19.9,5.0,8.65,roof,.45);ring(17.6,19.9,.035,8.52,blue,.13);ring(17.55,19.85,.04,8.50,light);
 for(let i=0;i<40;i++){
  const a=i/40*Math.PI*2,inner=pos(17.65,19.95,a,8.57),outer=pos(22.6,24.9,a,9.1),low=pos(22.6,24.9,a,7.7);
  beam(inner,outer,.045);beam(inner,low,.04);beam(low,outer,.05);
  if(i%2===0){const foot=pos(22.5,24.8,a,0);beam(foot,outer,.13);}
  for(let n=1;n<4;n++){const t=n/4,p=inner.map((v,j)=>v+(outer[j]-v)*t),q=inner.map((v,j)=>v+(low[j]-v)*t);beam(p,q,.02);}
 }
 // Floodlight modules live on the roof rather than glowing floating planes.
 for(let i=0;i<24;i++){
  const a=i/24*Math.PI*2,p=pos(17.5,19.75,a,8.2),ry=Math.atan2(-p[0],center-p[2]);box(1.1,.28,.3,dark,...p,ry);for(let j=-1;j<=1;j++){const x=p[0]+Math.cos(ry)*j*.31,z=p[2]-Math.sin(ry)*j*.31;box(.25,.16,.31,light,x,p[1]-.025,z,ry);}
 }
 const rail=(rx,rz,y)=>{for(let i=0;i<80;i++){const a=i/80*Math.PI*2,b=(i+1)/80*Math.PI*2;beam(pos(rx,rz,a,y),pos(rx,rz,b,y),.018);if(i%2===0)beam(pos(rx,rz,a,y-.65),pos(rx,rz,a,y),.015);}};rail(11.8,14.1,.84);rail(17.2,19.5,4.55);
 for(const [m,geometries]of batches){const merged=mergeGeometries(geometries,false);for(const g of geometries)g.dispose();ownedG.push(merged);const o=new Mesh(merged,m);o.receiveShadow=true;scene.add(o);}
 const seatBottom=new BoxGeometry(.39,.07,.38);seatBottom.translate(0,0,.025);const seatBack=new BoxGeometry(.39,.38,.055);seatBack.translate(0,.20,-.16);const seatG=mergeGeometries([seatBottom,seatBack]);seatBottom.dispose();seatBack.dispose();ownedG.push(seatG);const seatM=material('#286ca6',{roughness:.6}),seatMesh=new InstancedMesh(seatG,seatM,seats.length),dummy=new Object3D();
 seats.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(0,p.angle,0);dummy.scale.setScalar(1);dummy.updateMatrix();seatMesh.setMatrixAt(i,dummy.matrix);seatMesh.setColorAt(i,new Color(i%9<2?'#c9d3d9':i%19===0?'#0f3154':'#4f93c6'));});scene.add(seatMesh);
 const crowdG=new PlaneGeometry(.95,1.34);crowdG.setAttribute('sslAtlas',new InstancedBufferAttribute(new Float32Array(fans.flatMap(p=>[p.variant%4,Math.floor(p.variant/4)])),2));crowdG.setAttribute('sslPhase',new InstancedBufferAttribute(new Float32Array(fans.map(p=>p.phase)),1));ownedG.push(crowdG);crowdMap.colorSpace=SRGBColorSpace;const crowdM=new MeshBasicMaterial({map:crowdMap,color:'#d7e1eb',alphaTest:.5,side:DoubleSide,fog:true});ownedM.push(crowdM);const crowdUniform={value:0},cheerUniform={value:0};
 crowdM.onBeforeCompile=shader=>{shader.uniforms.sslTime=crowdUniform;shader.uniforms.sslCheer=cheerUniform;shader.vertexShader='attribute vec2 sslAtlas;attribute float sslPhase;uniform float sslTime;uniform float sslCheer;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nvMapUv=(vMapUv+sslAtlas)*vec2(.25,.5);');shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.y+=sin(sslTime*1.6+sslPhase)*.007+sin(sslTime*9.+sslPhase)*sslCheer;');};crowdM.customProgramCacheKey=()=> 'ssl-photographic-crowd-atlas-v1';const crowd=new InstancedMesh(crowdG,crowdM,fans.length);
 fans.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(0,p.angle,0);dummy.scale.set(p.scale,p.scale,1);dummy.updateMatrix();crowd.setMatrixAt(i,dummy.matrix);crowd.setColorAt(i,new Color().setRGB(p.light,p.light,p.light));});scene.add(crowd);
 const c=document.createElement('canvas');c.width=1536;c.height=512;const sign=new CanvasTexture(c);sign.colorSpace=SRGBColorSpace;ownedT.push(sign);const displayM=new MeshBasicMaterial({color:'#fff',map:sign,toneMapped:false});ownedM.push(displayM);const signG=new PlaneGeometry(5.4,1.8);ownedG.push(signG);const screen=new Mesh(signG,displayM);screen.position.set(0,6.65,-11.2);scene.add(screen);
 const frame=new Group();scene.add(frame);const frameG=new BoxGeometry(5.6,2,.22);ownedG.push(frameG);const frameMesh=new Mesh(frameG,dark);frameMesh.position.copy(screen.position);frameMesh.position.z-=.15;frame.add(frameMesh);
 const updateMatch=match=>{const x=c.getContext('2d'),w=c.width,h=c.height;x.fillStyle='#091d2c';x.fillRect(0,0,w,h);x.fillStyle='#70b8d9';x.fillRect(0,0,w,9);x.textAlign='center';x.fillStyle='#c9d8df';x.font='600 34px Arial';x.fillText('SUMQAYIT SUPER LİQASI',w/2,86);x.fillStyle='#fff';x.font='900 142px Arial';x.fillText((match.home?.code||'SSL')+'  '+(match.homeScore||0)+' : '+(match.awayScore||0)+'  '+(match.away?.code||'SSL'),w/2,292,w-120);x.fillStyle='#b6d296';x.font='600 30px Arial';x.fillText('PENALTI ARENASI',w/2,426);sign.needsUpdate=true;};updateMatch({});
 return {updateMatch,animate(time,cheer){crowdUniform.value=time;cheerUniform.value=cheer;},spectators:fans.length};
}
