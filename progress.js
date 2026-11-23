/* Portable, browser-local Big Maths settings and records. No account or server storage. */
const BMProgress=(()=>{
 const profileTools=typeof BMProfiles!=='undefined'?BMProfiles:require('./profiles.js');
 const bare=key=>key.replace(/^bm\.child\.p[a-z0-9]{6,40}\./,'bm.');
 const isBest=key=>bare(key).startsWith('bm.best.');
 const allowed=key=>key==='bm.profiles.v1'||key==='bm.onboarding.v1'||bare(key)==='bm.settings'||/^bm\.best\.[a-zA-Z0-9._-]{1,160}$/.test(bare(key));
 function exportData(storage){const data={};for(let i=0;i<storage.length;i++){const key=storage.key(i);if(allowed(key))data[key]=storage.getItem(key);}return{app:'big-maths',schema:1,data};}
 function validate(payload){
  if(!payload||payload.app!=='big-maths'||payload.schema!==1||!payload.data||typeof payload.data!=='object')throw Error('This is not a Big Maths backup.');
  const clean={};
  for(const [key,raw]of Object.entries(payload.data)){
   if(!allowed(key)||typeof raw!=='string'||raw.length>20000)continue;
   const value=JSON.parse(raw);
   if(isBest(key)){if(typeof value==='number'&&Number.isFinite(value)&&value>=0)clean[key]=JSON.stringify(value);}
   else if(key==='bm.profiles.v1'){const profiles=profileTools.clean(value);if(profiles)clean[key]=JSON.stringify(profiles);}
   else if(key==='bm.onboarding.v1'){if(value===true)clean[key]='true';}
   else if(value&&typeof value==='object'){
    const settings={};
    if(['rec','y1','y2','y3','y4','y5','y6','y56'].includes(value.level))settings.level=value.level;
    if(typeof value.speechVoice==='string'&&value.speechVoice.length<300)settings.speechVoice=value.speechVoice;
    if(['pencil','keypad'].includes(value.input))settings.input=value.input;
    if(['practice','exam'].includes(value.mode))settings.mode=value.mode;
    if(typeof value.auto==='boolean')settings.auto=value.auto;
    if(['course','double',0,20,30,60,90,100].includes(value.time))settings.time=value.time;
    if(value.week==='rand'||Number.isInteger(value.week)&&value.week>=1&&value.week<=10)settings.week=value.week;
    if(value.timerDefaultsVersion===1)settings.timerDefaultsVersion=1;
    if(value.timingVersion===3)settings.timingVersion=3;
    if(value.schoolSeriesVersion===1)settings.schoolSeriesVersion=1;
    if(['classic','modern'].includes(value.worksheetSeries))settings.worksheetSeries=value.worksheetSeries;
    if(value.classicLevels&&typeof value.classicLevels==='object'){settings.classicLevels={};for(const [course,n] of Object.entries(value.classicLevels))if(/^(rec|y[1-6])$/.test(course)&&Number.isInteger(n)&&n>=1&&n<=5)settings.classicLevels[course]=n;}
    if(value.clicSets&&typeof value.clicSets==='object'){settings.clicSets={};for(const [course,n]of Object.entries(value.clicSets))if(/^(rec|y[1-6])$/.test(course)&&(Number.isInteger(n)&&n>=1&&n<=20||course==='y1'&&n==='school'))settings.clicSets[course]=n;}
    clean[key]=JSON.stringify(settings);
   }
  }
  return clean;
 }
 function restore(storage,payload){const data=validate(payload);for(const [key,value]of Object.entries(data)){
  if(isBest(key)&&storage.getItem(key)!==null){const old=JSON.parse(storage.getItem(key)),next=JSON.parse(value);storage.setItem(key,JSON.stringify(bare(key).startsWith('bm.best.time.')?Math.min(old,next):Math.max(old,next)));}
  else if(key==='bm.profiles.v1'){const old=profileTools.clean(JSON.parse(storage.getItem(key)||'null')),next=JSON.parse(value);if(old){const ids=new Set(next.children.map(p=>p.id));next.children.push(...old.children.filter(p=>!ids.has(p.id)));}storage.setItem(key,JSON.stringify(next));}
  else storage.setItem(key,value);
 }return Object.keys(data).length;}
 return{exportData,restore,validate};
})();
if(typeof module!=='undefined')module.exports=BMProgress;
