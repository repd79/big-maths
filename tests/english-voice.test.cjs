const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=source.indexOf('function selectEnglishVoice('),end=source.indexOf('/* ---------- inicio ---------- */',start);
function setup(voices=[]){
  let available=voices;const spoken=[];
  const context={window:{speechSynthesis:{getVoices:()=>available,cancel(){},speak:u=>spoken.push(u)}},SpeechSynthesisUtterance:function(text){this.text=text},WORDS:['zero','one']};
  vm.createContext(context);vm.runInContext(source.slice(start,end),context);
  return {context,spoken,setVoices:v=>available=v};
}
const voice=(name,lang='en-GB',localService=true)=>({name,lang,localService});
test('iPad British female voice wins over first-listed Daniel',()=>{
  const {context}=setup();const serena=voice('Serena');
  assert.equal(context.selectEnglishVoice([voice('Daniel'),serena,voice('Samantha','en-US')]),serena);
});
test('enhanced female British voice wins over compact version',()=>{
  const {context}=setup();const enhanced=voice('Serena (Enhanced)');
  assert.equal(context.selectEnglishVoice([voice('Serena'),enhanced]),enhanced);
});
test('female English voice wins over male British voice on other devices',()=>{
  const {context}=setup();const zira=voice('Microsoft Zira','en-US');
  assert.equal(context.selectEnglishVoice([voice('Microsoft George'),zira]),zira);
});
test('foreign and novelty voices are excluded; unnamed English fallback remains usable',()=>{
  const {context}=setup();const english=voice('Google UK English Female');
  assert.equal(context.selectEnglishVoice([voice('Serena','it-IT'),voice('Whisper','en-US'),english]),english);
  assert.equal(context.selectEnglishVoice([voice('Serena','es-ES')]),null);
});
test('voices loaded after the first tap are picked up by both speech entry points',()=>{
  const {context,spoken,setVoices}=setup();
  assert.equal(context.speakText('Ready?'),true);assert.equal(spoken[0].lang,'en-GB');
  const serena=voice('Serena');setVoices([voice('Daniel'),serena]);
  assert.equal(context.speak(1),true);assert.equal(spoken[1].voice,serena);
  assert.equal(spoken[1].text,'one');assert.equal(spoken[1].rate,.95);assert.equal(spoken[1].pitch,1.08);
});
test('devices without speech synthesis fail gracefully',()=>{
  const {context}=setup();delete context.window.speechSynthesis;
  assert.equal(context.speakText('Hello'),false);
});
