const{test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function run(extra,userGesture=true){const spoken=[],nodes=new Map(),context={C:{spec:extra?{}:null,qs:[{d:{t:'gq',q:'A child has three apples.',say:'How many apples?'},q:{classList:{toggle(){}}},boxes:[]}]},settings:{auto:true,mode:'practice'},window:{},BMContent:require('../curriculum.js'),$:key=>{if(!nodes.has(key))nodes.set(key,{style:{}});return nodes.get(key);},updateDots(){},cancelSpeech(){},speakText:t=>spoken.push(t)};vm.createContext(context);vm.runInContext(source.slice(source.indexOf('function goQ('),source.indexOf('function updateDots(')),context);context.goQ(0,userGesture);return spoken;}
test('Big Maths automatically reads its prompt once when opening a question',()=>assert.deepEqual(run(false),['How many apples?']));
test('Extra practice stays silent until the child explicitly presses Listen',()=>assert.deepEqual(run(true),[]));
test('review navigation does not unexpectedly start speech',()=>assert.deepEqual(run(false,false),[]));
