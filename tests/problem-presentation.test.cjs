const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../maths-games.js'),'utf8');
function fixture(id,task){const spoken=[],ctx={task,current:{id},$ :()=>({classList:{contains:()=>true}}),BMContent:require('../curriculum.js'),speakText:t=>spoken.push(t),solids:[],shapeNames:[],shuffle:a=>a,stage:{querySelector:()=>{throw Error('Speech must not read the visual calculation');}}};vm.createContext(ctx);
 vm.runInContext(source.slice(source.indexOf(' function readProblem'),source.indexOf(' function mascot'))+';this.api={readProblem,prepareTask}',ctx);return{...ctx.api,spoken};}
test('word problems speak the question exactly once and never append their calculation',()=>{
 const task={prompt:'A toy costs 25p. The price drops by 3p. What is the new price?',answer:22,visual:'<div class="mg-equation">25p − 3p = ?</div>'},f=fixture('count-back-money',task);
 const prepared=f.prepareTask(task);assert.equal(prepared.visual,'');assert.equal(prepared.equation,'25p − 3p = ?');f.readProblem();assert.equal(f.spoken.length,1);assert.equal(f.spoken[0],task.prompt);
});
test('direct calculation still speaks the required operation once',()=>{
 const task={prompt:'Find the answer.',answer:9,visual:'<div class="mg-equation">8 + 1 = ?</div>'},f=fixture('add-subtract-one',task);f.prepareTask(task);f.readProblem();assert.equal(f.spoken.length,1);assert.equal(f.spoken[0],'8 plus 1 equals what');assert.ok(task.visual.includes('8 + 1'));
});
