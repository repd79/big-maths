/* Transcribed weekly questions: CLIC 5 (2017) and CLIC 6 (2019).
   CLIC 4 has one teacher-assessed sheet, not ten weekly sets. */
const BMWeekly=(()=>{
 const sheets={"5":[{"read":[300,800,900],"range":[12,20],"count":[[49,48,47],[83,82,81]],"double":30,"missing":4,"operations":[[4,3],[5,2],[8,5],[6,4]]},{"read":[200,600,700],"range":[8,13],"count":[[37,36,35],[54,53,52]],"double":20,"missing":3,"operations":[[5,4],[6,3],[6,3],[7,2]]},{"read":[500,600,900],"range":[5,11],"count":[[28,27,26],[33,32,31]],"double":40,"missing":8,"operations":[[7,5],[2,4],[7,5],[8,5]]},{"read":[400,600,800],"range":[14,20],"count":[[56,55,54],[44,43,42]],"double":10,"missing":6,"operations":[[2,6],[5,4],[9,7],[5,3]]},{"read":[100,500,800],"range":[13,19],"count":[[77,76,75],[93,92,91]],"double":30,"missing":1,"operations":[[8,3],[2,6],[5,4],[9,2]]},{"read":[400,700,900],"range":[7,15],"count":[[87,86,85],[73,72,71]],"double":20,"missing":2,"operations":[[9,1],[1,5],[6,1],[6,3]]},{"read":[200,300,800],"range":[3,10],"count":[[69,68,67],[65,64,63]],"double":40,"missing":9,"operations":[[7,6],[3,4],[9,2],[4,2]]},{"read":[300,600,800],"range":[10,16],"count":[[59,58,57],[24,23,22]],"double":10,"missing":5,"operations":[[2,5],[8,2],[4,2],[8,6]]},{"read":[600,700,900],"range":[9,17],"count":[[46,45,44],[84,83,82]],"double":30,"missing":7,"operations":[[3,9],[3,6],[6,5],[7,4]]},{"read":[500,600,800],"range":[5,10],"count":[[98,97,96],[53,52,51]],"double":40,"missing":4,"operations":[[4,7],[5,4],[8,4],[9,7]]}],"6":[{"partition":46,"order":[13,11,17,14],"sequence":[14,null,18,20],"sequence2":[160,170,null,190,200],"parity":"odd","choices":[14,15,21,24],"family":[8,6,14],"familyOp":"+","operations":[[16,3],[16,7],[16,3],[16,7]]},{"partition":37,"order":[15,12,18,10],"sequence":[6,8,null,12,14],"sequence2":[90,100,null,120,130],"parity":"even","choices":[11,16,20,23],"family":[7,5,12],"familyOp":"+","operations":[[14,2],[14,8],[14,2],[14,8]]},{"partition":58,"order":[17,15,19,14],"sequence":[8,10,12,null,16],"sequence2":[120,130,140,null,160],"parity":"odd","choices":[6,9,17,26],"family":[9,6,15],"familyOp":"+","operations":[[12,3],[17,5],[12,3],[17,5]]},{"partition":24,"order":[11,8,15,13],"sequence":[6,8,10,null,14],"sequence2":[0,25,50,null,100],"parity":"even","choices":[16,20,27,33],"family":[5,8,13],"familyOp":"+","operations":[[11,2],[18,6],[11,2],[18,6]]},{"partition":62,"order":[12,18,15,16],"sequence":[10,12,14,null,18],"sequence2":[200,210,null,230,240],"parity":"odd","choices":[20,23,32,41],"family":[7,3,4],"familyOp":"\u2212","operations":[[15,3],[15,8],[15,3],[15,8]]},{"partition":75,"order":[14,8,15,9],"sequence":[10,null,14,16],"sequence2":[0,25,null,75,100],"parity":"even","choices":[26,35,42,47],"family":[8,2,6],"familyOp":"\u2212","operations":[[13,3],[19,5],[13,3],[19,5]]},{"partition":93,"order":[15,12,16,11],"sequence":[12,14,16,null,20],"sequence2":[130,null,150,160,170],"parity":"odd","choices":[18,24,37,49],"family":[8,9,17],"familyOp":"+","operations":[[16,2],[18,8],[16,2],[18,8]]},{"partition":34,"order":[12,20,17,15],"sequence":[10,12,null,16,null],"sequence2":[0,25,50,75,null],"parity":"odd","choices":[19,27,32,38],"family":[7,4,11],"familyOp":"+","operations":[[15,2],[15,6],[15,2],[15,6]]},{"partition":67,"order":[16,9,13,19],"sequence":[8,null,12,14,null,18],"sequence2":[80,90,100,110,null],"parity":"even","choices":[7,22,40,53],"family":[15,7,8],"familyOp":"\u2212","operations":[[9,3],[17,8],[9,3],[17,8]]},{"partition":98,"order":[14,12,19,13],"sequence":[14,16,null,null],"sequence2":[180,null,200,210],"parity":"odd","choices":[14,19,23,34],"family":[5,9,14],"familyOp":"+","operations":[[15,3],[19,7],[15,3],[19,7]]}]};
 const q=(text,a,more={})=>({t:'gq',q:text,a:String(a),...more});
 const oral=(text,a)=>({t:'oral',q:text,a:String(a),oralAssessment:true});
 const parts=(text,values)=>q(text,values.map(p=>p[1]).join(', '),{parts:values.map(([label,a])=>({label,a:String(a)}))});
 const op=(numbers,sign,line=false)=>q(`${numbers[0]} ${sign} ${numbers[1]} =`,sign==='+'?numbers[0]+numbers[1]:numbers[0]-numbers[1],line?{line:Array.from({length:11},(_,i)=>i)}:{});
 function sequence(values,step){const base=values.findIndex(v=>v!==null),answers=values.map((v,i)=>v===null?['Missing number '+(i+1),values[base]+(i-base)*step]:null).filter(Boolean);return parts('Complete the sequence: '+values.map(v=>v===null?'□':v).join(', '),answers);}
 function family(d){const[a,b,c]=d.family;return parts(`Complete the other facts in the family for ${a} ${d.familyOp} ${b} = ${c}.`,d.familyOp==='+'?[[`${b} + ${a} =`,c],[`${c} − ${a} =`,b],[`${c} − ${b} =`,a]]:[[`${a} − ${c} =`,b],[`${b} + ${c} =`,a],[`${c} + ${b} =`,a]]);}
 function single4(){return [
 oral('Count from 50 to 59.','50, 51, 52, 53, 54, 55, 56, 57, 58, 59'),
 oral('Continue counting: 35, 36, 37…','38, 39, 40'),
 oral('Read these numbers aloud: 30, 50, 70, 80.','30, 50, 70, 80'),
 oral('Read these numbers aloud: 46, 39, 21, 82.','46, 39, 21, 82'),
 oral('Count in fives from 5 to 25.','5, 10, 15, 20, 25'),
 oral('Count in fives from 5 to 50.','5, 10, 15, 20, 25, 30, 35, 40, 45, 50'),
 oral('Count in twos from 2 to 10.','2, 4, 6, 8, 10'),
 oral('With a grown-up, show that you can say who won, and who was first, second, third and last.','A grown-up checks the positions.'),
 oral('4 + □ = 10. What is the missing number?',6),
 oral('Count backwards from 20 to zero.',Array.from({length:21},(_,i)=>20-i).join(', '))];}
 function generate(level,week=1){
  if(![4,5,6].includes(level))throw Error('No transcribed worksheet for this level');
  const set=level===4?1:week==='rand'?1+Math.floor(Math.random()*10):Number(week);
  if(!Number.isInteger(set)||set<1||set>10)throw Error('Unknown worksheet set');
  let questions;
  if(level===4)questions=single4();
  if(level===5){const d=sheets[5][set-1];questions=[
   oral('Read these numbers aloud: '+d.read.join(', ')+'.',d.read.join(', ')),
   q(`Write a whole number more than ${d.range[0]} but less than ${d.range[1]}.`,d.range[0]+1,{acceptRange:d.range,a:`Any whole number from ${d.range[0]+1} to ${d.range[1]-1}`}),
   ...d.count.map(ns=>parts('Count backwards: '+ns.join(', ')+', □, □, □',[1,2,3].map(i=>['Next number '+i,ns[2]-i]))),
   q(`Double ${d.double}.`,d.double*2),q(`${d.missing} + □ = 10`,10-d.missing),
   oral(`Read aloud and answer: ${d.operations[0][0]} + ${d.operations[0][1]} = ?`,d.operations[0][0]+d.operations[0][1]),
   op(d.operations[1],'+',true),
   oral(`Read aloud and answer: ${d.operations[2][0]} − ${d.operations[2][1]} = ?`,d.operations[2][0]-d.operations[2][1]),
   op(d.operations[3],'−',true)];
  }
  if(level===6){const d=sheets[6][set-1],answers=d.choices.filter(n=>Boolean(n%2)===(d.parity==='odd')).map(String);questions=[
   parts(`Partition ${d.partition} into tens and ones.`,[['Tens',Math.floor(d.partition/10)*10],['Ones',d.partition%10]]),
   {t:'order',nums:[...d.order]},sequence(d.sequence,2),sequence(d.sequence2,d.sequence2[1]===null?d.sequence2[3]-d.sequence2[2]:d.sequence2[1]-d.sequence2[0]),
   q(`Select every ${d.parity} number.`,answers.join(', '),{choices:d.choices.map(String),answers}),family(d),
   ...d.operations.map((ns,i)=>op(ns,i<2?'+':'−'))];}
  return questions.map((d,i)=>({...d,sourceLevel:level,sourceSet:set,sourcePage:level===4?2:set+1,skill:`clic-${level}-set-${set}.${i+1}`}));
 }
 const acceptsRange=(range,text)=>/^-?\d+$/.test(text)&&Number(text)>range[0]&&Number(text)<range[1];
 return {sheets,generate,acceptsRange,has:level=>[4,5,6].includes(level),count:level=>level===4?1:10};
})();
if(typeof module!=='undefined')module.exports=BMWeekly;
