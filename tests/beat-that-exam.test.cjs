const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const logic=source.slice(source.indexOf('const S={boxes:'),source.indexOf('const fmtT='));
const finish=source.slice(source.indexOf('function stopSums(){'),source.indexOf('function paintSums(){'));
function fixture({mode='exam',limit=0}={}){
  let now=5000,next=0;const timers=new Map(),nodes=new Map(),results=[];
  const ctx={settings:{mode},performance:{now:()=>now},setTimeout:(fn,delay)=>{timers.set(++next,{fn,at:now+delay});return next;},clearTimeout:id=>timers.delete(id),cancelAnimationFrame:()=>{},session:{active:true},document:{activeElement:null},$:selector=>{if(!nodes.has(selector))nodes.set(selector,{style:{},classList:{add(){}}});return nodes.get(selector);},paintSums(){},updateSumsRecords:()=>({}),showSumsResult:(byTime,score)=>results.push({byTime,score})};
  vm.createContext(ctx);vm.runInContext(logic+finish+';this.api={S,scheduleSumsFinish,beginSumsEdit,stopSums,finishSums};',ctx);
  const api=ctx.api,S=api.S;
  S.boxes=Array.from({length:17},()=>({ink:true,cur:null,elapsed:0,hasInk(){return this.ink;},lock(){this.locked=true;},grade(){return false;}}));
  Object.assign(S,{running:true,finished:false,t0:1000,lastT:5000,lastInputAt:5000,lastTouchedBox:S.boxes[16],limit});
  return{...api,results,timers,setNow:t=>{now=t;},advance:ms=>{now+=ms;for(const [id,timer]of [...timers])if(timer.at<=now&&timers.has(id)){timers.delete(id);timer.fn();}}};
}
test('confirmation delay is excluded from the total and final answer timing',()=>{
  const f=fixture();f.scheduleSumsFinish();f.advance(1799);assert.equal(f.S.finished,false);f.advance(1);
  assert.equal(f.S.finished,true);assert.equal(f.S.elapsed,4);assert.equal(f.S.boxes[16].elapsed,0);assert.equal(f.results[0].byTime,false);
});
test('a later stroke cancels confirmation and becomes the final timestamp',()=>{
  const f=fixture();f.scheduleSumsFinish();f.advance(900);assert.equal(f.beginSumsEdit(f.S.boxes[16]),true);f.S.boxes[16].cur=[];f.advance(1500);assert.equal(f.S.finished,false);
  f.S.boxes[16].cur=null;f.S.lastInputAt=f.S.lastT=7400;f.scheduleSumsFinish();f.advance(1800);assert.equal(f.S.elapsed,6.4);
});
test('clearing an answer prevents automatic completion until it is rewritten',()=>{
  const f=fixture();f.scheduleSumsFinish();f.beginSumsEdit(f.S.boxes[0]);f.S.boxes[0].ink=false;f.scheduleSumsFinish();f.advance(3000);assert.equal(f.S.finished,false);
  f.S.boxes[0].ink=true;f.S.lastInputAt=f.S.lastT=8000;f.scheduleSumsFinish();f.advance(1800);assert.equal(f.S.elapsed,7);
});
test('practice, blank answers and an unfinished stroke cannot auto-submit',()=>{
  for(const scenario of ['practice','blank','drawing']){const f=fixture({mode:scenario==='practice'?'practice':'exam'});if(scenario==='blank')f.S.boxes[3].ink=false;if(scenario==='drawing')f.S.boxes[3].cur=[];f.scheduleSumsFinish();f.advance(3000);assert.equal(f.S.finished,false,scenario);}
});
test('finishing just before the deadline preserves the last stroke time',()=>{
  const f=fixture({limit:5});f.setNow(5900);f.S.lastInputAt=f.S.lastT=5900;f.scheduleSumsFinish();f.setNow(6100);
  assert.equal(f.beginSumsEdit(f.S.boxes[16]),false);assert.equal(f.S.elapsed,4.9);assert.equal(f.results[0].byTime,false);
});
test('a normal timeout records the deadline rather than a late animation frame',()=>{
  const f=fixture({limit:5});f.S.boxes[0].ink=false;f.setNow(7200);f.finishSums(true);assert.equal(f.S.elapsed,5);assert.equal(f.results[0].byTime,true);
});
test('manual submission of a completed sheet also uses the final stroke',()=>{
  const f=fixture();f.scheduleSumsFinish();f.setNow(5700);f.finishSums(false);assert.equal(f.S.elapsed,4);
});
test('leaving a round cancels its pending submission',()=>{
  const f=fixture();f.scheduleSumsFinish();f.stopSums();f.advance(5000);assert.equal(f.S.finished,false);assert.equal(f.results.length,0);
});
