/* Skill-based interactive adaptations of CLIC 1-20. Original questions and artwork are not redistributed. */
const BMContent=(()=>{
 const r=(lo,hi)=>lo+Math.floor(Math.random()*(hi-lo+1)),pick=a=>a[r(0,a.length-1)];
 const fmt=n=>String(Math.round(n*1000)/1000);
 const speech=s=>s.replace(/([=,])\s*\?/g,'$1 what ').replace(/\?(?=\s*[+−×÷])/g,'what ').replace(/−/g,' minus ').replace(/×/g,' times ').replace(/÷/g,' divided by ').replace(/\+/g,' plus ').replace(/=/g,' equals ').replace(/\s+/g,' ').trim();
 const q=(prompt,a,extra={})=>({t:'gq',q:prompt,a:fmt(a),say:speech(prompt),...extra});
 const oral=(prompt,answer)=>({t:'oral',q:prompt,a:answer,say:prompt});
 const multi=(prompt,parts)=>q(prompt,0,{parts:parts.map(([label,a])=>({label,a:fmt(a)})),a:parts.map(([label,a])=>`${label}: ${fmt(a)}`).join('; ')});
 const operation=(a,op,b,extra={})=>q(`${fmt(a)} ${op} ${fmt(b)} =`,op==='+'?a+b:op==='−'?a-b:op==='×'?a*b:a/b,extra);
 const add=(digits=2,other=digits,column=false)=>()=>operation(r(10**(digits-1),10**digits-1),'+',r(10**(other-1),10**other-1),{column});
 const sub=(digits=2,other=digits,column=false)=>()=>{let a=r(10**(digits-1),10**digits-1),b=r(10**(other-1),10**other-1);if(a<b)[a,b]=[b,a];return operation(a,'−',b,{column});};
 const mul=(digits=1,other=1,column=false)=>()=>operation(r(10**(digits-1),10**digits-1),'×',r(10**(other-1),10**other-1),{column});
 const div=(digits=2,tables=[2,3,4,5],remainder=false,column=false)=>()=>{const d=pick(tables),answer=r(Math.ceil(10**(digits-1)/d),Math.floor((10**digits-1)/d)),rem=remainder?r(1,d-1):0;return q(`${answer*d+rem} ÷ ${d} =`,answer,{a:rem?`${answer} r${rem}`:String(answer),column});};
 const decimalDivision=()=>{const d=pick([2,3,4,5,6,7,8,9]),answer=r(11,99)/10;return operation(answer*d,'÷',d);};
 const columnDecimalDivision=()=>operation(r(101,999),'÷',pick([2,4,5,8]),{column:true});
 const tables=[2,3,4,5,6,7,8,9];
 const seq=(step=1,negative=false)=>()=>{const s=typeof step==='function'?step():step,base=negative?-r(1,10)*Math.abs(s):r(1,12)*s,k=r(1,3),ns=Array.from({length:5},(_,i)=>base+i*s);return q(`Complete the sequence: ${ns.map((n,i)=>i===k?'?':fmt(n)).join(', ')}`,ns[k]);};
 const partition=(digits=2,dp=0)=>()=>{const scale=10**dp,n=r(10**(digits-1),10**digits-1);const raw=String(n);return multi(`Partition ${fmt(n/scale)} into place values.`,[...raw].map((v,i)=>[`10${String.fromCharCode(0x2070)} place ${i+1}`,Number(v)*10**(digits-i-1-dp)]).map(([_,a],i)=>[['Thousands','Hundreds','Tens','Ones','Tenths','Hundredths','Thousandths'][3-(digits-dp-1)+i]||`Part ${i+1}`,a]));};
 const order=(lo,hi)=>()=>{const ns=new Set();while(ns.size<4)ns.add(r(lo,hi));const values=[...ns];return multi(`Put these numbers in order, smallest first: ${values.join(', ')}`,values.sort((a,b)=>a-b).map((n,i)=>[`Number ${i+1}`,n]));};
 const parity=()=>{const ns=new Set();while(ns.size<4)ns.add(r(11,29));const values=[...ns],odd=!!r(0,1);return q(`Select every ${odd?'odd':'even'} number.`,0,{choices:values.map(n=>String(n)),answers:values.filter(n=>!!(n%2)===odd).map(String),a:values.filter(n=>!!(n%2)===odd).join(', ')});};
 const double=(lo,hi,unit=1)=>()=>{const n=r(lo,hi)*unit;return q(`Double ${fmt(n)}.`,2*n);};
 const half=(lo,hi,unit=1)=>()=>{const n=r(lo,hi)*unit;return q(`Half of ${fmt(n)}.`,n/2);};
 const pim=(unit=10)=>()=>operation(r(1,8)*unit,'+',r(1,9)*unit);
 const jigsaw=(total=100)=>()=>{const a=r(1,total-1);return q(`${a} + ? = ${total}`,total-a);};
 const scale=(factor=10,decimal=false)=>()=>{const n=decimal?r(11,999)/100:r(11,99);return Math.random()<.5?operation(n,'×',factor):operation(decimal?n:n*factor,'÷',factor);};
 const smile=(u=10,v=1)=>()=>operation(r(2,9)*u,'×',r(2,9)*v);
 const mully=(lo=20,hi=99)=>()=>{const d=r(2,9),n=r(lo,hi);return q(`Mully is behind the biggest multiple of ${d} without going past ${n}. Where is he?`,Math.floor(n/d)*d);};
 const family=(unit=1)=>()=>{const a=r(2,8)*unit,b=r(2,8)*unit,total=a+b;return multi(`Complete the other facts in the family for ${a} + ${b} = ${total}.`,[[`${b} + ${a}`,total],[`${total} − ${a}`,b],[`${total} − ${b}`,a]]);};
 const mulFamily=()=>{const a=r(2,9)*10,b=r(2,9),p=a*b;return multi(`Complete the fact family for ${a} × ${b} = ${p}.`,[[`${b} × ${a}`,p],[`${p} ÷ ${a}`,b],[`${p} ÷ ${b}`,a]]);};
 const coins=()=>{const n=r(2,9);return multi(`Complete the multiplication card for ${n}.`,[1,2,5,10,20,50,100].map(k=>[`${k} × ${n}`,k*n]));};
 const numberSense=(lo,hi)=>()=>{const n=r(lo,hi);return multi(`Find the neighbours of ${n}.`,[['One less',n-1],['One more',n+1]]);};
 const digitValue=(dp=1)=>()=>{const digits=r(101,9999),s=(digits/10**dp).toFixed(dp),part=r(0,s.length-1);if(s[part]==='.')return digitValue(dp)();const after=s.indexOf('.'),power=after<0?s.length-part-1:part<after?after-part-1:after-part;return q(`What is the value of the digit ${s[part]} in ${s}? (Position ${part<after?part+1:part} from the left.)`,Number(s[part])*10**power);};
 const gap=(cross=false)=>()=>{const a=-r(1,60),b=cross?r(1,60):-r(61,100);return q(`What is the distance between ${a} and ${b}?`,Math.abs(a-b));};
 const decimalOp=(op='+',dpA=1,dpB=dpA)=>()=>{let a=r(11,999)/10**dpA,b=r(11,999)/10**dpB;if(op==='−'&&a<b)[a,b]=[b,a];return operation(a,op,b);};
 const countObjects=(max=10)=>()=>{const n=r(1,max);return q('How many stars are there?',n,{dots:n});};
 const readNumber=(lo,hi,unit=1)=>()=>{const n=r(lo,hi)*unit;return {...oral(`Read this number aloud: ${n}.`,String(n)),say:'Read this number aloud.'};};
 const countOral=(start,end,step=1)=>()=>oral(`Count from ${start} to ${end}${step!==1?` in ${step}s`:''}.`,Array.from({length:Math.floor(Math.abs(end-start)/Math.abs(step))+1},(_,i)=>start+i*step).join(', '));
 const facts=()=>operation(r(1,5),'+',r(1,5));
 const smallAdd=(extra=3)=>()=>operation(r(10,20),'+',r(2,extra));
 const smallSub=(extra=3)=>()=>operation(r(10,20),'−',r(2,extra));
 const factors=()=>{const n=pick([12,16,18,20,24,30,36]),all=Array.from({length:n},(_,i)=>i+1).filter(k=>n%k===0);return q(`Select all the factors of ${n}.`,0,{choices:Array.from({length:12},(_,i)=>String(i+1)),answers:all.filter(k=>k<=12).map(String),a:all.filter(k=>k<=12).join(', '),say:`Which of these numbers are factors of ${n}?`});};
 const primes=()=>{const ns=[r(2,9),r(10,19),r(20,29),r(30,39)],isPrime=n=>n>1&&!Array.from({length:Math.floor(Math.sqrt(n))-1},(_,i)=>i+2).some(d=>n%d===0);if(!ns.some(isPrime))ns[0]=pick([2,3,5,7]);return q('Select all the prime numbers.',0,{choices:ns.map(String),answers:ns.filter(isPrime).map(String),a:ns.filter(isPrime).join(', ')||'None'});};
 const square=()=>{const n=r(2,12);return q(`What is ${n} squared?`,n*n);};
 const fraction=(op='+')=>()=>{const den=pick([3,4,6,8,9,12]),a=r(1,den-1),b=r(1,den-1);return multi(`Calculate ${a}/${den} ${op} ${b}/${den}. Give the answer as an improper fraction with denominator ${den}.`,[['Numerator',op==='+'?a+b:a-b],['Denominator',den]]);};
 // Each row follows the ten skill positions of the downloaded challenge/teacher notes.
 const levels={
  1:[countOral(1,7),countOral(1,10),readNumber(1,3),readNumber(4,5),countObjects(3),()=>oral('How many fingers do you have on both hands?','10'),double(1,2),half(1,2,2),()=>operation(1,'+',1),()=>operation(3,'+',3)],
  2:[countOral(11,17),readNumber(1,9),countObjects(6),()=>q('Which is more: 4 or 7?',7),order(1,10),countOral(10,50,10),()=>q('Five fingers and five fingers. How many fingers altogether?',10),double(1,9),()=>{const n=r(1,19);return q(`One more than ${n}.`,n+1);},()=>{const n=r(2,20);return q(`One less than ${n}.`,n-1);}],
  3:[countOral(1,20),readNumber(14,15),readNumber(11,20),countObjects(20),()=>oral('Take ten objects from a pile.','Ten objects'),countOral(10,0,-1),seq(1),seq(10),()=>{const a=r(1,5),b=r(1,5);return q(`There are ${a} red birds and ${b} blue birds. How many birds altogether?`,a+b,{dots:a+b});},()=>{const a=r(5,10),b=r(1,4);return q(`${a} birds are on a branch. ${b} fly away. How many are left?`,a-b);}],
  4:[countOral(60,69),countOral(1,100),readNumber(1,9,10),readNumber(10,99),countOral(5,25,5),seq(5),seq(2),()=>q('Which is fewer: 12 or 8?',8),jigsaw(10),countOral(20,0,-1)],
  5:[readNumber(10,99,10),numberSense(11,19),countOral(100,90,-1),seq(()=>-pick([1,2,5])),double(1,9,10),jigsaw(10),()=>oral('Read this addition aloud: 4 + 3 = 7.','Four plus three equals seven'),()=>q('Start at 6. Jump forward 3 places. Where do you land?',9,{line:[6,7,8,9]}),()=>oral('Read this subtraction aloud: 8 − 3 = 5.','Eight minus three equals five'),()=>q('Start at 9. Jump back 4 places. Where do you land?',5,{line:[5,6,7,8,9]})],
  6:[partition(2),order(11,20),seq(2),seq(10),parity,family(),smallAdd(3),smallAdd(9),smallSub(3),smallSub(9)],
  7:[seq(100),pim(10),double(11,44),double(1,9,10),()=>{const n=pick([30,50,70,90]);return q(`Half of ${n}.`,n/2);},family(10),()=>operation(r(1,8)*10,'+',10),()=>operation(r(11,89),'+',10),()=>operation(r(2,9)*10,'−',10),()=>operation(r(11,99),'−',10)],
  8:[seq(50),pim(100),()=>{const n=r(11,89);return q(`${n} + ? = ${Math.ceil(n/10)*10}`,Math.ceil(n/10)*10-n);},mully(),add(2,1),()=>operation(r(1,4)*10,'+',r(1,5)*10),()=>operation(r(2,9)*10,'−',r(1,9)),sub(2,1),sub(2,1),sub(3,1)],
  9:[order(11,99),pim(1000),double(11,99),jigsaw(100),scale(10),add(2),sub(2),div(2,[2,3,4,5],true),add(2,2,true),sub(2,2,true)],
  10:[partition(3),pim(1000),()=>Math.random()<.5?double(11,99)():half(1,4,200)(),jigsaw(100),scale(10),add(2),()=>operation(100,'−',r(11,99)),div(2,tables,true),add(2,2,true),sub(2,2,true)],
  11:[seq(4),double(1,9,100),double(101,999),smile(),coins,mully(100,199),add(3,2),add(3,2),add(3,2,true),add(3,2,true)],
  12:[partition(3,1),numberSense(101,999),double(101,999),mulFamily,add(3),mul(1,2),div(3,tables,true),add(3,3,true),mul(2,1,true),div(2,[2,3,4,5],false,true)],
  13:[partition(4,3),numberSense(1001,9999),seq(()=>pick([6,7,8])),seq(250),seq(()=>pick([20,50,250])),jigsaw(1000),scale(100),mul(),sub(4,3,true),div(2,[2,3,4,5],false,true)],
  14:[digitValue(1),seq(.25),seq(.1),pim(.1),()=>{const n=pick([3,5,7,9]);return q(`Half of ${n}.`,n/2);},scale(10,true),add(3),mul(1,2),add(4,3,true),mul(2,1,true)],
  15:[digitValue(2),half(101,999),mully(150,999),factors,sub(3,2),div(3),div(3),sub(4,4,true),mul(3,1,true),div(4,tables,false,true)],
  16:[partition(3,1),seq(-1,true),scale(10,true),mully(150,999),pim(.1),mul(),div(3),div(3),sub(3,3,true),div(3,tables,false,true)],
  17:[scale(100,true),smile(.01),mully(300,999),square,decimalOp('+',1),sub(3),()=>{const ns=[r(101,999),r(101,999),r(11,99)];return q(`Add in columns: ${ns.join(' + ')}`,ns.reduce((a,b)=>a+b),{column:true});},sub(5,5,true),mul(3,2,true),div(4,tables,false,true)],
  18:[partition(5,3),numberSense(100000,99999999),seq(-25,true),gap(),scale(1000,true),primes,decimalOp('+',2),decimalOp('−',1),div(4),add(5,5,true)],
  19:[digitValue(3),gap(true),decimalOp('+',2,1),decimalOp('−',3,1),()=>operation(r(2,9),'×',r(101,999)/100),decimalDivision,()=>({...decimalOp('+',3,1)(),column:true}),()=>({...decimalOp('−',3,2)(),column:true}),()=>operation(r(101,999)/100,'×',r(11,99),{column:true}),columnDecimalDivision],
  20:[()=>q('Calculate 8 divided by two fifths.',20),fraction('+'),()=>oral('Explain why 36% is less than 3/8.','3/8 = 37.5%, which is greater than 36%.'),()=>q('Convert 5/8 to a percentage.',62.5),()=>q('Increase £32 by 15%.',36.8),()=>oral('Give a fraction between 1/3 and 1/2.','For example 2/5.'),()=>q('Decrease 72 metres by 35%.',46.8),()=>q('A recipe for 6 people needs 750 ml of juice. How many ml are needed for 10 people?',1250),()=>q('A camera costs £140 after a 30% discount. What was its original price?',200),()=>multi('Divide 180 in the ratio 3 : 4 : 5.',[['3 parts',45],['4 parts',60],['5 parts',75]])]
 };
 const courses={rec:[1,2,3],y1:[4,5,6],y2:[7,8,9],y3:[10,11,12],y4:[13,14,15],y5:[16,17,18],y6:[19,20]};
 function generate(level){if(!levels[level])throw Error('Unknown challenge');return levels[level].map((fn,i)=>({...fn(),skill:level+'.'+(i+1)}));}
 return{courses,generate,speech,levels};
})();
if(typeof module!=='undefined')module.exports=BMContent;
