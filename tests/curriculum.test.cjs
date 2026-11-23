const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const content=require('../curriculum.js'),sheets=require('../course-sheets.js');
const s=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const ctx={BMContent:content,BM_SHEETS:sheets};vm.createContext(ctx);vm.runInContext(s.slice(s.indexOf('const MTABS='),s.indexOf('const settings='))+';this.api={mLi,mLiAll,M_MUL,gBT,MATH_NODES};',ctx);
const normalize=f=>f.join(':');
test('course sheets retain their published lengths and correct arithmetic answers',()=>{
 for(const [course,count,seconds]of [['rec',7,20],['y1',17,30],['y2',40,90],['y3',24,60],['y4',42,60],['y5',72,100],['y6',72,100]]){
  assert.equal(sheets[course].count,count);assert.equal(sheets[course].seconds,seconds);
  for(const sheet of sheets[course].sheets){assert.equal(sheet.length,count);assert.equal(new Set(sheet.map(normalize)).size,count);}
  const qs=ctx.api.gBT(course,1);assert.equal(qs.length,count);
  for(const q of qs){const [,a,op,b]=q.q.match(/^(\d+) ([+×]) (\d+) =$/);assert.equal(Number(q.a),op==='+'?+a+ +b:a*b);}
 }
});
test('Six Fact Challenge uses the six missing facts rather than repeating the eight table',()=>{
 const canonical=arr=>arr.map(([a,b])=>[a,b].sort((x,y)=>x-y).join('×')).sort();
 assert.deepEqual(canonical(Array.from(ctx.api.M_MUL[13],a=>Array.from(a))),canonical([[6,6],[6,9],[9,9],[7,9],[7,7],[6,7]]));
});
test('Learn Its 1-15 retain complete three-step assessment sizes; Ultimate has exactly 72',()=>{
 const counts=[2,5,7,10,15,17,27,34,46,41,36,30,26,28,30];counts.forEach((count,i)=>assert.equal(ctx.api.mLi(i+1)().length,count,'Step '+(i+1)));
 const ultimate=ctx.api.mLiAll();assert.equal(ultimate.length,72);
 assert.equal(new Set(ultimate.map(q=>{const [,a,op,b]=q.q.match(/^(\d+) ([+×]) (\d+) =$/);return [op,...[a,b].map(Number).sort((x,y)=>x-y)].join(':');})).size,72);
 for(const fact of ['9 × 7 =','9 × 6 =','9 × 9 ='])assert.ok(ultimate.some(q=>q.q===fact));
});
test('every CLIC level has ten runnable skills, finite answers, and correct numeric calculations',()=>{
 for(let level=1;level<=20;level++)for(let iteration=0;iteration<30;iteration++){
  const qs=content.generate(level);assert.equal(qs.length,10);
  for(const q of qs){assert.ok(q.q&&q.say&&q.a!==undefined);assert.ok(!/NaN|Infinity|undefined/.test(q.a));
   const m=q.q.match(/^([\d.]+) ([+−×÷]) ([\d.]+) =$/);
   if(m&&!q.a.includes(' r')){const a=+m[1],b=+m[3],expected=m[2]==='+'?a+b:m[2]==='−'?a-b:m[2]==='×'?a*b:a/b;assert.ok(Math.abs(+q.a-expected)<.0011,q.q);}
   if(q.choices)assert.ok(q.answers.every(a=>q.choices.includes(a)));
   if(q.parts)q.parts.forEach(p=>assert.ok(Number.isFinite(+p.a)));
  }
 }
});
test('CLIC 6 has the ten source skills, including four-part ordering, parity and fact families',()=>{
 const qs=content.generate(6);assert.equal(qs[0].parts.length,2);assert.equal(qs[1].parts.length,4);assert.ok(qs[4].choices);assert.equal(qs[5].parts.length,3);
 assert.deepEqual(content.courses.y6,[19,20]);assert.deepEqual(content.courses.y5,[16,17,18]);
});
test('reading-number skills do not speak the number that the child must read',()=>{
 const q=content.generate(1)[2];assert.equal(q.say,'Read this number aloud.');assert.ok(!q.say.includes(q.a));
});

test('modern CLIC 19 retains decimal division and the specified column methods',()=>{for(let i=0;i<50;i++){const qs=content.generate(19);assert.match(qs[5].q,/÷/);assert.equal(qs[5].parts,undefined);assert.equal(qs[6].column,true);assert.equal(qs[7].column,true);assert.match(qs[8].q,/^[\d.]+ × \d{2} =$/);assert.equal(qs[8].column,true);assert.match(qs[9].q,/÷/);assert.equal(qs[9].column,true);}});
