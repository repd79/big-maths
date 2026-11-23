/* Isolate a separately drawn minus sign, without using the expected answer. */
const BMSignedInk=(()=>{
 const bounds=strokes=>{const pts=strokes.flat();return {x0:Math.min(...pts.map(p=>p[0])),x1:Math.max(...pts.map(p=>p[0])),y0:Math.min(...pts.map(p=>p[1])),y1:Math.max(...pts.map(p=>p[1]))};};
 function split(strokes){
  if(strokes.length<2)return {negative:false,strokes};
  const full=bounds(strokes),height=full.y1-full.y0;if(height<12)return {negative:false,strokes};
  for(let i=0;i<strokes.length;i++){
   const bar=strokes[i];if(bar.length<2)continue;
   const b=bounds([bar]),width=b.x1-b.x0,mid=(b.y0+b.y1)/2;
   if(width<height*.15||width>height*.85||b.y1-b.y0>height*.12||mid<full.y0+height*.2||mid>full.y0+height*.8)continue;
   const rest=strokes.filter((_,j)=>i!==j),digits=bounds(rest);
   const length=bar.reduce((sum,p,j)=>j?sum+Math.hypot(p[0]-bar[j-1][0],p[1]-bar[j-1][1]):sum,0);
   if(length<=width*1.3&&b.x1<digits.x0+height*.03&&digits.y1-digits.y0>height*.85)return{negative:true,strokes:rest};
  }
  return{negative:false,strokes};
 }
 return{split};
})();
if(typeof module!=='undefined')module.exports=BMSignedInk;
