const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const boxSource=source.slice(source.indexOf('class Box{'),source.indexOf('window.KP={'));
function makeBox(){
  const ctx=vm.createContext({penSeen:false,session:{active:true},beginSumsEdit:()=>true,clearTimeout,settings:{auto:true},setTimeout,performance,S:{running:false}});
  vm.runInContext(boxSource+';this.Box=Box;',ctx);
  return Object.assign(Object.create(ctx.Box.prototype),{
    strokes:[],cur:null,pid:null,typed:'',expected:'5.3',kpMode:false,
    canvas:{setPointerCapture(){}},host:{hidden:false,classList:{add(){},toggle(){}}},
    pt:e=>e.point,dot(){},seg(){},setState(state){this.state=state},
    schedule(){},paintTyped(){},clear(){throw new Error('A stroke implicitly erased the answer')}
  });
}
test('adding a stroke after a doubtful check preserves the rest of the answer',()=>{
  const box=makeBox();
  box.strokes=[[[0,0],[0,20]]];
  box.state='unclear';
  const dot={pointerId:1,pointerType:'pen',point:[10,20],preventDefault(){}};
  box.down(dot);
  box.up(dot);
  assert.equal(box.strokes.length,2);
  assert.deepEqual(box.strokes[0],[[0,0],[0,20]]);
});
test('typed input and single-digit delete preserve a previously marked answer',()=>{
  const box=makeBox();
  Object.assign(box,{kpMode:true,typed:'53',state:'bad'});
  box.key('back');
  assert.equal(box.typed,'5');
  box.state='bad';
  box.key('.');
  box.key('3');
  assert.equal(box.typed,'5.3');
});
test('decimal answers require the decimal point and support leading or trailing zeroes',()=>{
  const box=makeBox();
  assert.equal(box.matches('53'),false);
  assert.equal(box.matches('05.30'),true);
  assert.equal(box.matches(''),false);
});
test('review distinguishes blank, wrong and low-confidence written answers',()=>{
  const box=makeBox();
  assert.equal(box.reviewStatus(false),'blank');
  box.strokes=[[[0,0],[0,20]]];
  box.rec=()=>({text:'1',conf:.34});
  assert.equal(box.reviewStatus(false),'review');
  box.rec=()=>({text:'1',conf:.92});
  assert.equal(box.reviewStatus(false),'incorrect');
  assert.equal(box.reviewStatus(true),'correct');
});
test('the handwriting segmenter reads a low separate dot as a decimal',()=>{
  const code=source.slice(source.indexOf('  function bbox(s)'),source.indexOf('  return { load, recognize'));
  const ctx=vm.createContext({classify:()=>({digit:5,conf:.95})});
  vm.runInContext(code+';this.recognize=recognize;',ctx);
  const digits=[[[0,0],[4,30]],[[25,0],[29,30]]];
  assert.equal(ctx.recognize(digits).text,'55');
  assert.equal(ctx.recognize([...digits,[[14,29]]]).text,'5.5');
  assert.equal(ctx.recognize([...digits,[[14,6]]]).text,'55');
});
