/* One confirmed assessment per calendar week, stored separately for each child. */
const BMJourney=(()=>{
 const weekKey=(date=new Date())=>{const d=new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10)};
 const previousWeek=key=>new Date(Date.parse(key+'T00:00:00Z')-7*86400000).toISOString().slice(0,10);
 const streak=(records,level)=>{const rows=records.filter(r=>r.level===level).sort((a,b)=>b.week.localeCompare(a.week));let n=0,last=null;for(const r of rows){if(r.score!==10||(last&&r.week!==previousWeek(last)))break;n++;last=r.week;}return Math.min(3,n)};
 function record(state,{level,score,set,week=weekKey()}){const next=JSON.parse(JSON.stringify(state||{}));next.records=(next.records||[]).filter(r=>!(r.level===level&&r.week===week));next.records.push({level,score,set,week});next.records=next.records.slice(-80);const count=streak(next.records,level);next.level=count===3?Math.min(20,level+1):level;next.sets={...next.sets,[level]:level<=4?1:(set%10)+1};return{state:next,streak:count,promoted:count===3&&level<20};}
 return{weekKey,streak,record};
})();
if(typeof module!=='undefined')module.exports=BMJourney;
