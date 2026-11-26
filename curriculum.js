/* Skill-based interactive adaptations of CLIC 1-20. Original questions and artwork are not redistributed. */
const BMContent=(function createCurriculum(random=Math.random){
 const r=(lo,hi)=>lo+Math.floor(random()*(hi-lo+1)),pick=a=>a[r(0,a.length-1)];
 const fmt=n=>String(Math.round(n*1000000)/1000000);
 const speech=s=>s.replace(/([=,])\s*\?/g,'$1 what ').replace(/\?(?=\s*[+−×÷])/g,'what ').replace(/−/g,' minus ').replace(/×/g,' times ').replace(/÷/g,' divided by ').replace(/\+/g,' plus ').replace(/=/g,' equals ').replace(/\s+/g,' ').trim();
 const q=(prompt,a,extra={})=>({t:'gq',q:prompt,a:fmt(a),say:speech(prompt),...extra});
 const oral=(prompt,answer)=>({t:'oral',q:prompt,a:answer,say:prompt});
 const multi=(prompt,parts)=>q(prompt,0,{parts:parts.map(([label,a])=>({label,a:fmt(a)})),a:parts.map(([label,a])=>`${label}: ${fmt(a)}`).join('; ')});
 const operation=(a,op,b,extra={})=>q(`${fmt(a)} ${op} ${fmt(b)} =`,op==='+'?a+b:op==='−'?a-b:op==='×'?a*b:a/b,extra);
 const add=(digits=2,other=digits,column=false)=>()=>operation(r(10**(digits-1),10**digits-1),'+',r(10**(other-1),10**other-1),{column});
 const sub=(digits=2,other=digits,column=false)=>()=>{let a=r(10**(digits-1),10**digits-1),b=r(10**(other-1),10**other-1);if(a<b)[a,b]=[b,a];return operation(a,'−',b,{column});};
 const mul=(digits=1,other=1,column=false)=>()=>operation(r(10**(digits-1),10**digits-1),'×',r(10**(other-1),10**other-1),{column});
 const div=(digits=2,tables=[2,3,4,5],remainder=false,column=false)=>()=>{const d=pick(tables),answer=r(Math.ceil(10**(digits-1)/d),Math.floor((10**digits-1)/d)),rem=remainder?r(1,d-1):0;return q(`${answer*d+rem} ÷ ${d} =`,answer,{a:rem?`${answer} r${rem}`:String(answer),column});};
 const tables=[2,3,4,5,6,7,8,9];
 const seq=(step=1,negative=false)=>()=>{const s=typeof step==='function'?step():step,base=negative?-r(1,10)*Math.abs(s):r(1,12)*s,k=r(1,3),ns=Array.from({length:5},(_,i)=>base+i*s);const sequence=ns.map((n,i)=>i===k?null:fmt(n));return q(`Complete the sequence: ${sequence.map(n=>n??'?').join(', ')}`,ns[k],{sequence});};
 const partition=(digits=2,dp=0)=>()=>{const scale=10**dp,n=r(10**(digits-1),10**digits-1);const raw=String(n);return multi(`Partition ${fmt(n/scale)} into place values.`,[...raw].map((v,i)=>[`10${String.fromCharCode(0x2070)} place ${i+1}`,Number(v)*10**(digits-i-1-dp)]).map(([_,a],i)=>[['Thousands','Hundreds','Tens','Ones','Tenths','Hundredths','Thousandths'][3-(digits-dp-1)+i]||`Part ${i+1}`,a]));};
 function ordering(name,values){
  const sorted=[...values].sort((a,b)=>Number(a)-Number(b));
  if(values.every((n,i)=>n===sorted[i]))values.push(values.shift());
  const prompt='Put these '+name+' in order, smallest first';
  return {...multi(prompt+': '+values.join(', '),sorted.map((n,i)=>['Number '+(i+1),Number(n)])),
    order:values.map(String),a:sorted.join(' → '),instruction:'Tap the '+name+' from smallest to largest.'};
 }
 const order=(lo,hi)=>()=>{const ns=new Set();while(ns.size<4)ns.add(r(lo,hi));const values=[...ns];return ordering('numbers',values);};
 const orderDecimals=places=>()=>{const scale=10**places;const values=[];while(values.length<3){const n=fmt(r(scale,10*scale-1)/scale);if(!values.includes(n))values.push(n);}return ordering('decimals',values);};
 const missingOnLine=step=>()=>{const first=r(-4,12)*step,missing=r(1,3),ticks=Array.from({length:5},(_,i)=>fmt(first+i*step));const answer=ticks[missing];ticks[missing]='?';return q('What number is missing on the number line?',Number(answer),{line:ticks});};
 const roundNumber=()=>{const unit=pick([10,100,1000]),n=r(1501,99999);return q(`Round ${n} to the nearest ${unit}.`,Math.round(n/unit)*unit);};
 const pairedScale=(factor,decimal=false)=>()=>{const a=decimal?r(101,950)/100:r(11,98),b=decimal?r(101,950)/100:r(11,98)*factor;return multi('Complete both calculations.',[[`${fmt(a)} × ${factor} =`,a*factor],[`${fmt(b)} ÷ ${factor} =`,b/factor]]);};
 const doubleAndHalf=()=>{const a=r(12,95),b=r(2,8)*100;return multi('Find the double and the half.',[[`Double ${a}`,2*a],[`Half of ${b}`,b/2]]);};
 const twoDigitDivision=()=>{const d=r(11,25),quotient=r(11,32);return operation(d*quotient,'÷',d);};
 const parity=()=>{const ns=new Set();while(ns.size<4)ns.add(r(11,29));const values=[...ns],odd=values.every(n=>n%2===values[0]%2)?Boolean(values[0]%2):!!r(0,1);return q(`Select every ${odd?'odd':'even'} number.`,0,{choices:values.map(n=>String(n)),answers:values.filter(n=>!!(n%2)===odd).map(String),a:values.filter(n=>!!(n%2)===odd).join(', ')});};
 const double=(lo,hi,unit=1)=>()=>{const n=r(lo,hi)*unit;return q(`Double ${fmt(n)}.`,2*n);};
 const half=(lo,hi,unit=1)=>()=>{const n=r(lo,hi)*unit;return q(`Half of ${fmt(n)}.`,n/2);};
 const pim=(unit=10)=>()=>operation(r(1,8)*unit,'+',r(1,9)*unit);
 const jigsaw=(total=100)=>()=>{const a=r(1,total-1);return q(`${a} + ? = ${total}`,total-a,{equationParts:[fmt(a),'+',null,'=',fmt(total)]});};
 const smile=(u=10,v=1)=>()=>operation(r(2,9)*u,'×',r(2,9)*v);
 const mully=(lo=20,hi=99)=>()=>{const d=r(2,9),n=r(lo,hi);return q(`Mully is behind the biggest multiple of ${d} without going past ${n}. Where is he?`,Math.floor(n/d)*d);};
 const family=(unit=1)=>()=>{const a=r(2,8)*unit,b=r(2,8)*unit,total=a+b;return multi(`Complete the other facts in the family for ${a} + ${b} = ${total}.`,[[`${b} + ${a}`,total],[`${total} − ${a}`,b],[`${total} − ${b}`,a]]);};
 const mulFamily=()=>{const a=r(2,9)*10,b=r(2,9),p=a*b;return multi(`Complete the fact family for ${a} × ${b} = ${p}.`,[[`${b} × ${a}`,p],[`${p} ÷ ${a}`,b],[`${p} ÷ ${b}`,a]]);};
 const coins=()=>{const n=r(2,9);return multi(`Complete the multiplication card for ${n}.`,[1,2,5,10,20,50,100].map(k=>[`${k} × ${n}`,k*n]));};
 const numberSense=(lo,hi)=>()=>{const n=r(lo,hi);return multi(`Find the neighbours of ${n}.`,[['One less',n-1],['One more',n+1]]);};
 const gap=(cross=false)=>()=>{const a=-r(1,60),b=cross?r(1,60):-r(61,100);return q(`What is the distance between ${a} and ${b}?`,Math.abs(a-b));};
 const decimalOp=(op='+',dpA=1,dpB=dpA)=>()=>{let a=r(11,999)/10**dpA,b=r(11,999)/10**dpB;if(op==='−'&&a<b)[a,b]=[b,a];return operation(a,op,b);};
 const countObjects=(max=10)=>()=>{const n=r(1,max);return q('How many stars are there?',n,{dots:n});};
 const readNumber=(lo,hi,unit=1)=>()=>{const n=r(lo,hi)*unit;return {...oral(`Read this number aloud: ${n}.`,String(n)),say:'Read this number aloud.'};};
 const countOral=(start,end,step=1)=>()=>oral(`Count ${step<0?'backwards ':''}from ${start} to ${end}${Math.abs(step)>1?` in ${Math.abs(step)}s`:''}.`,Array.from({length:Math.floor(Math.abs(end-start)/Math.abs(step))+1},(_,i)=>start+i*step).join(', '));
 const facts=()=>operation(r(1,5),'+',r(1,5));
 const smallAdd=(extra=3)=>()=>operation(r(10,20),'+',r(2,extra));
 const guidedSum=(op)=>()=>{const a=r(4,7),b=r(1,3);return operation(a,op,b,{line:Array.from({length:11},(_,i)=>i)});};
 const smallSub=(extra=3)=>()=>operation(r(10,20),'−',r(2,extra));
 const factors=()=>{const n=pick([12,16,18,20,24,30,36]),all=Array.from({length:n},(_,i)=>i+1).filter(k=>n%k===0);return q(`Which of these numbers are factors of ${n}?`,0,{choices:Array.from({length:12},(_,i)=>String(i+1)),answers:all.filter(k=>k<=12).map(String),a:all.filter(k=>k<=12).join(', '),say:`Which of these numbers are factors of ${n}?`});};
 const primes=()=>{const ns=[r(2,9),r(10,19),r(20,29),r(30,39)],isPrime=n=>n>1&&!Array.from({length:Math.floor(Math.sqrt(n))-1},(_,i)=>i+2).some(d=>n%d===0);if(!ns.some(isPrime))ns[0]=pick([2,3,5,7]);return q('Select all the prime numbers.',0,{choices:ns.map(String),answers:ns.filter(isPrime).map(String),a:ns.filter(isPrime).join(', ')||'None'});};
 const square=()=>{
  const first=r(3,6),second=first+2;
  const choices=[first**2,first**2+2,second**2-3,second**2].map(value=>({value,key:random()})).sort((a,b)=>a.key-b.key).map(item=>item.value).map(String);
  const answers=[String(first**2),String(second**2)];
  return q('Which of these are square numbers?',0,{choices,answers,a:answers.join(', ')});
 };
 const fractionOf=()=>{const denominator=pick([4,5,8,10]),numerator=r(2,denominator-1),quotient=r(2,8);return q(`Calculate ${numerator*quotient} ÷ ${numerator}/${denominator}.`,quotient*denominator);};
 const percentage=()=>{const denominator=pick([4,5,8,10]),numerator=r(1,denominator-1);return q(`Convert ${numerator}/${denominator} to a percentage.`,100*numerator/denominator);};
 const percentChange=sign=>()=>{const n=r(12,40),p=r(2,9)*5;return sign>0?q(`Increase £${n} by ${p}%.`,n*(100+p)/100):q(`Decrease ${n} metres by ${p}%.`,n*(100-p)/100);};
 const fraction=(op='+')=>()=>{const den=pick([3,4,6,8,9,12]),a=r(1,den-1),b=r(1,den-1);return multi(`Calculate ${a}/${den} ${op} ${b}/${den}. Keep ${den} as the denominator.`,[['Numerator',op==='+'?a+b:a-b],['Denominator',den]]);};
 // Each row follows the ten skill positions of the downloaded challenge/teacher notes.
 const levels={
  1:[countOral(1,7),countOral(1,10),readNumber(1,3),readNumber(4,5),countObjects(3),()=>oral('How many fingers do you have on both hands?','10'),double(1,2),half(1,2,2),()=>operation(1,'+',1),()=>operation(3,'+',3)],
  2:[countOral(11,17),readNumber(1,9),countObjects(6),()=>q('Which is more: 4 or 7?',7),order(1,10),countOral(10,50,10),()=>q('Five fingers and five fingers. How many fingers altogether?',10),double(1,9),()=>{const n=r(1,19);return q(`One more than ${n}.`,n+1);},()=>{const n=r(2,20);return q(`One less than ${n}.`,n-1);}],
  3:[countOral(1,20),readNumber(14,15),readNumber(11,20),countObjects(20),()=>oral('Take ten objects from a pile.','Ten objects'),countOral(10,0,-1),seq(1),seq(10),()=>{const a=r(1,5),b=r(1,5);return q(`There are ${a} red birds and ${b} blue birds. How many birds altogether?`,a+b,{dots:a+b});},()=>{const a=r(5,10),b=r(1,4);return q(`${a} birds are on a branch. ${b} fly away. How many are left?`,a-b);}],
  4:[countOral(60,69),countOral(25,35),readNumber(1,9,10),readNumber(10,99),countOral(5,25,5),seq(5),seq(2),()=>q('Which is fewer: 12 or 8?',8),jigsaw(10),countOral(20,0,-1)],
  5:[readNumber(10,99,10),numberSense(11,19),countOral(100,90,-1),seq(()=>-pick([1,2,5])),double(1,9,10),jigsaw(10),()=>oral('Read this addition aloud: 4 + 3 = 7.','Four plus three equals seven'),guidedSum('+'),()=>oral('Read this subtraction aloud: 8 − 3 = 5.','Eight minus three equals five'),guidedSum('−')],
  6:[partition(2),order(11,20),seq(2),seq(10),parity,family(),smallAdd(3),smallAdd(9),smallSub(3),smallSub(9)],
  7:[seq(100),pim(10),double(11,44),double(1,9,10),()=>{const n=pick([30,50,70,90]);return q(`Half of ${n}.`,n/2);},family(10),()=>operation(r(1,8)*10,'+',10),()=>operation(r(11,89),'+',10),()=>operation(r(2,9)*10,'−',10),()=>operation(r(11,99),'−',10)],
  8:[seq(50),pim(100),()=>{const n=r(11,89);return q(`${n} + ? = ${Math.ceil(n/10)*10}`,Math.ceil(n/10)*10-n);},mully(),add(2,1),()=>operation(r(1,4)*10,'+',r(1,5)*10),()=>operation(r(2,9)*10,'−',r(1,9)),sub(2,1),sub(2,1),sub(3,1)],
  9:[order(11,99),pim(1000),doubleAndHalf,jigsaw(100),pairedScale(10),add(2),sub(2),div(2,[2,3,4,5],true),add(2,2,true),sub(2,2,true)],
  10:[partition(3),pim(1000),doubleAndHalf,jigsaw(100),pairedScale(10),add(2),()=>operation(100,'−',r(11,99)),div(2,tables,true),add(2,2,true),sub(2,2,true)],
  11:[seq(4),double(1,9,100),double(101,999),smile(),coins,mully(100,199),add(3,2),add(3,2),add(3,2,true),add(3,2,true)],
  12:[partition(2,1),order(101,999),double(101,999),mulFamily,add(3),mul(1,2),div(2,tables,true),add(3,3,true),mul(2,1,true),div(2,[2,3,4,5],false,true)],
  13:[partition(3,2),order(1001,9999),seq(()=>pick([6,7,8])),seq(250),missingOnLine(5),jigsaw(1000),()=>operation(r(13,97),'×',100),mul(),sub(4,3,true),div(2,[2,3,4,5],false,true)],
  14:[orderDecimals(1),missingOnLine(.25),missingOnLine(5),pim(.1),half(21,79),()=>operation(r(12,95),'÷',10),add(3),mul(1,2),add(4,3,true),mul(2,1,true)],
  15:[orderDecimals(2),half(51,499,2),mully(150,999),factors,sub(3,2),div(2,tables,true),div(2,tables,true),sub(4,4,true),mul(3,1,true),div(4,tables,false,true)],
  16:[partition(2,1),missingOnLine(1),()=>operation(r(11,95)/10,'×',10),mully(150,999),pim(.1),mul(),div(2,tables,true),div(2,tables,true),sub(3,3,true),div(3,tables,false,true)],
  17:[pairedScale(100,true),smile(.01),mully(300,999),square,decimalOp('+',1),sub(3),()=>{const ns=[r(101,999),r(101,999),r(11,99)];return q(`Add in columns: ${ns.join(' + ')}`,ns.reduce((a,b)=>a+b),{column:true});},sub(5,5,true),mul(3,2,true),div(4,tables,false,true)],
  18:[partition(4,3),roundNumber,missingOnLine(25),gap(),pairedScale(1000,true),primes,decimalOp('+',2),decimalOp('−',1),twoDigitDivision,add(5,5,true)],
  19:[orderDecimals(3),gap(true),decimalOp('+',2,1),decimalOp('−',3,1),()=>operation(r(2,9),'×',r(101,999)/100),partition(4,3),decimalOp('+',3,1),decimalOp('−',3,2),pairedScale(1000,true),twoDigitDivision],
  20:[fractionOf,fraction('+'),()=>oral('Explain why 36% is less than 3/8.','3/8 = 37.5%, which is greater than 36%.'),percentage,percentChange(1),()=>oral('Give a fraction between 1/3 and 1/2.','For example 2/5.'),percentChange(-1),()=>q('A recipe for 6 people needs 750 ml of juice. How many ml are needed for 10 people?',1250),()=>q('A camera costs £140 after a 30% discount. What was its original price?',200),()=>multi('Divide 180 in the ratio 3 : 4 : 5.',[['3 parts',45],['4 parts',60],['5 parts',75]])]
 };
 const courses={rec:[1,2,3],y1:[4,5,6],y2:[7,8,9],y3:[10,11,12],y4:[13,14,15],y5:[16,17,18],y6:[19,20]};
 function generate(level){if(!levels[level])throw Error('Unknown challenge');return levels[level].map((fn,i)=>({...fn(),skill:level+'.'+(i+1)}));}
 const setCount=level=>level<=4?1:10;
 const acceptsRange=(range,text)=>/^-?\d+$/.test(text)&&Number(text)>range[0]&&Number(text)<range[1];
 function buildSet(level,set=1){
  if(!Number.isInteger(set)||set<1||set>setCount(level))throw Error('Unknown CLIC set');
  // A numeric set always contains the same exercises, including when the app is reloaded.
  let seed=(level*1000+set)*0x9e3779b1>>>0;
  const seeded=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  return createCurriculum(seeded).generate(level).map(question=>({...question,level,set}));
 }
 return{courses,generate,buildSet,setCount,acceptsRange,speech,levels};
})();
if(typeof module!=='undefined')module.exports=BMContent;
