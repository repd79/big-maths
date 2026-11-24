const{test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function run(extra,userGesture=true,type='gq'){const spoken=[],nodes=new Map(),context={C:{spec:extra?{}:null,qs:[{d:{t:type,n:7,q:'A child has three apples.',say:'How many apples?'},q:{classList:{toggle(){}}},boxes:[]}]},settings:{auto:true,mode:'practice'},UI:{i:()=>''},window:{},BMContent:require('../curriculum.js'),$:key=>{if(!nodes.has(key))nodes.set(key,{style:{}});return nodes.get(key);},updateDots(){},cancelSpeech(){},speakText:t=>spoken.push(t),speak:n=>spoken.push(String(n))};vm.createContext(context);vm.runInContext(source.slice(source.indexOf('function goQ('),source.indexOf('function updateDots(')),context);context.goQ(0,userGesture);return spoken;}
test('Big Maths written questions stay silent until Listen is pressed',()=>assert.deepEqual(run(false),[]));
test('number dictation remains the single automatically spoken question',()=>assert.deepEqual(run(false,true,'star'),['7']));
test('Extra practice stays silent until the child explicitly presses Listen',()=>assert.deepEqual(run(true),[]));
test('review navigation does not unexpectedly start speech',()=>assert.deepEqual(run(false,false),[]));
