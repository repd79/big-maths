/* Games inspired by the classroom resources. Each generator returns a fresh task. */
const MathsGames = (() => {
 const R=n=>Math.floor(Math.random()*n), pick=a=>a[R(a.length)], shuffle=a=>mShuf(a);
 const num=(prompt,answer,visual='',hint='Count carefully, then tap the missing number.')=>({prompt,answer,visual,hint});
 const choice=(prompt,answer,options,visual='',hint='Look closely and try again.')=>({prompt,answer,options:shuffle([...new Set(options)]),visual,hint});
 const svg=(body,view='0 0 200 160')=>`<svg class="mg-svg" viewBox="${view}" aria-hidden="true">${body}</svg>`;
 const coin=n=>`<span class="mg-coin ${n<5?'copper':''}">${n}p</span>`;
 function coins(n){let out='';for(const v of [50,20,10,5,2,1])while(n>=v){out+=coin(v);n-=v;}return `<div class="mg-coins">${out||'<span class="chip">No coins · 0p</span>'}</div>`;}
 const diePips={0:[],1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
 const dots=n=>{const groups=[];do{const count=Math.min(6,n);groups.push(`<span class="mg-die" role="img" aria-label="${count} dots">${Array.from({length:9},(_,i)=>`<i class="${diePips[count].includes(i)?'pip':'blank'}"></i>`).join('')}</span>`);n-=count;}while(n>0);return `<div class="mg-dots">${groups.join('')}</div>`;};
 const equation=s=>`<div class="mg-equation">${s}</div>`;
 const shapeNames=['square','rectangle','triangle','circle','hexagon'];
 function shape(name,color='#54b7a1'){
  const attrs=`fill="${color}" stroke="#276b5d" stroke-width="3"`;
  const bodies={square:`<rect x="45" y="25" width="110" height="110" ${attrs}/>`,rectangle:`<rect x="20" y="40" width="160" height="80" ${attrs}/>`,triangle:`<path d="M100 15 L180 140 L20 140 Z" ${attrs}/>`,circle:`<circle cx="100" cy="80" r="65" ${attrs}/>`,hexagon:`<path d="M60 15 H140 L185 80 L140 145 H60 L15 80 Z" ${attrs}/>`};return svg(bodies[name]);
 }
 const solids=['cube','cuboid','cone','sphere','cylinder'];
 function solid(name){
  const a='fill="#8dcde9" stroke="#275e8b" stroke-width="3"';
  const bodies={cube:`<path d="M45 48L105 20L165 48L105 77Z" fill="#b7e7fa" stroke="#275e8b" stroke-width="3"/><path d="M45 48V112L105 143V77Z" ${a}/><path d="M105 77L165 48V112L105 143Z" fill="#549cc8" stroke="#275e8b" stroke-width="3"/>`,cuboid:`<path d="M20 65L140 25L180 55L60 95Z" fill="#b7e7fa" stroke="#275e8b" stroke-width="3"/><path d="M20 65V108L60 138V95Z" ${a}/><path d="M60 95L180 55V98L60 138Z" fill="#549cc8" stroke="#275e8b" stroke-width="3"/>`,sphere:`<defs><radialGradient id="mg-ball"><stop stop-color="#d3edff"/><stop offset="1" stop-color="#428fb8"/></radialGradient></defs><circle cx="100" cy="80" r="65" fill="url(#mg-ball)" stroke="#275e8b" stroke-width="3"/>`,cone:`<path d="M35 125L100 15L165 125" ${a}/><ellipse cx="100" cy="125" rx="65" ry="20" ${a}/>`,cylinder:`<path d="M45 40V120C45 152 155 152 155 120V40" ${a}/><ellipse cx="100" cy="40" rx="55" ry="20" fill="#b7e7fa" stroke="#275e8b" stroke-width="3"/>`};return svg(bodies[name]);
 }
 function clock(h,m){
  const hand=(ang,len,width)=>{const t=ang*Math.PI/180;return `<line x1="100" y1="100" x2="${100+Math.sin(t)*len}" y2="${100-Math.cos(t)*len}" stroke="#234b3b" stroke-width="${width}" stroke-linecap="round"/>`;};
  let ticks='';for(let i=1;i<=12;i++){const t=i*Math.PI/6;ticks+=`<text x="${100+Math.sin(t)*76}" y="${106-Math.cos(t)*76}" text-anchor="middle" font-size="16" font-family="system-ui" fill="#234b3b">${i}</text>`;}
  return svg(`<circle cx="100" cy="100" r="96" fill="white" stroke="#60aa68" stroke-width="6"/>${ticks}${hand(h*30+m/2,47,7)}${hand(m*6,65,4)}<circle cx="100" cy="100" r="6" fill="#234b3b"/>`,'0 0 200 200');
 }
 const time=(h,m)=>`${h}:${String(m).padStart(2,'0')}`;
 function clockTask(minutes){const h=1+R(12),m=pick(minutes),ans=time(h,m);return choice('What time does the clock show?',ans,[ans,time(h%12+1,m),time(h,(m+30)%60),time((h+10)%12+1,m)],clock(h,m),'The short hand shows the hour. Count five minutes for each number on the long hand.');}
 const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
 const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
 const tasks=[];
 function add(id,title,category,icon,generate){tasks.push({id,title,category,icon,generate});}
 add('fractions','Fractions of shapes','Shapes','◐',()=>{const den=pick([2,4]),parts=1+R(den-1);return {prompt:`Which shape has ${parts}/${den} coloured?`,answer:parts,den,options:shuffle([parts,...shuffle(Array.from({length:den+1},(_,i)=>i).filter(i=>i!==parts)).slice(0,3)]),optionVisual:v=>fractionSVG(den,v),hint:`Find the shape with ${parts} of its ${den} equal parts coloured.`};});
 add('halves-quarters','Halves & quarters','Shapes','◴',()=>{const den=pick([2,4]),p=1+R(den-1);return choice('What fraction is coloured?',`${p}/${den}`,Array.from({length:den},(_,i)=>`${i+1}/${den}`),fractionSVG(den,p),'Count the coloured parts and all the equal parts.');});
 add('odd-even','Odd or even?','Numbers','🦋',()=>{const n=1+R(99);return choice('Is this number odd or even?',n%2?'Odd':'Even',['Odd','Even'],equation(n),'Even numbers end in 0, 2, 4, 6 or 8.');});
 add('find-even','Number hunt','Numbers','🔎',()=>{const odd=R(2),numbers=shuffle(Array.from({length:20},(_,i)=>i+1+20*R(3)));return {kind:'select',prompt:`Tap every ${odd?'odd':'even'} number.`,numbers,answer:numbers.map((n,i)=>n%2===odd?i:-1).filter(i=>i>=0),hint:odd?'Odd numbers end in 1, 3, 5, 7 or 9.':'Even numbers end in 0, 2, 4, 6 or 8.'};});
 add('double-money','Double your money','Money','🪙',()=>{const n=1+R(24);return num('Double this amount. How many pence?',n*2,coins(n),'Double means add the same amount again.');});
 add('clock-hour','O’clock','Time','🕒',()=>clockTask([0]));
 add('clock-day','A day in clocks','Time','🌤️',()=>{const [activity,h]=pick([['Breakfast is at 7 o’clock.',7],['School starts at 9 o’clock.',9],['Lunch is at 12 o’clock.',12],['Home time is at 3 o’clock.',3],['Dinner is at 6 o’clock.',6]]);return {prompt:`${activity} Which clock matches?`,answer:h,options:shuffle([h,h%12+1,(h+4)%12+1]),optionVisual:v=>clock(v,0),hint:'Find the clock with its short hand on the hour in the sentence.'};});
 add('clock-half','Half past','Time','🕤',()=>clockTask([30]));
 add('count-back-money','Count back in pence','Money','🛍️',()=>{const n=10+R(80),sub=1+R(4);return num(`It costs ${n}p. The price drops by ${sub}p. What is the new price?`,n-sub,equation(`${n}p − ${sub}p = ?`),'Count backwards one penny at a time.');});
 add('match-coins','Count the coins','Money','💰',()=>{const n=6+R(75);return num('How many pence are shown?',n,coins(n),'Add the value of each coin.');});
 add('subtract-ten','Subtract 10','Numbers','−10',()=>{const a=20+R(79);return num('One step up the number square. What is 10 less?',a-10,equation(`${a} − 10 = ?`),'The units stay the same. Take away one ten.');});
 add('count-fives','Count in fives','Numbers','5 →',()=>sequenceTask(5));
 add('months','Months & seasons','Time','🍂',()=>{if(R(2)){const i=R(12);return choice(`Which month comes after ${MONTHS[i]}?`,MONTHS[(i+1)%12],MONTHS,'','Say the months in order. After December comes January.');}const groups=[['Winter',['December','January','February']],['Spring',['March','April','May']],['Summer',['June','July','August']],['Autumn',['September','October','November']]],g=pick(groups);return choice(`In the UK, which season includes ${pick(g[1])}?`,g[0],groups.map(x=>x[0]),'','Think about the four seasons of the year.');});
 add('days','Days of the week','Time','📅',()=>{const i=R(7),before=R(2);return choice(`Which day comes ${before?'before':'after'} ${DAYS[i]}?`,DAYS[(i+(before?6:1))%7],DAYS,'','Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.');});
 add('solid-sort','Sort 3D shapes','Shapes','🧊',()=>{const n=pick(solids),a=['cube','cuboid'].includes(n)?'Flat faces only':n==='sphere'?'Curved surface only':'Flat and curved';return choice('Which group does this shape belong to?',a,['Flat faces only','Curved surface only','Flat and curved'],solid(n),'Look for flat faces and curved surfaces.');});
 add('solid-faces','Faces of 3D shapes','Shapes','🔷',()=>{const [n,ans]=pick([['cube','Square'],['cuboid','Rectangle'],['cone','Circle'],['cylinder','Circle']]);return choice(`Which shape is ${n==='cuboid'?'the large flat face':'a flat face'} of this ${n}?`,ans,['Square','Rectangle','Triangle','Circle'],solid(n),'Imagine tracing around a flat face.');});
 add('solid-names','Name the 3D shape','Shapes','🔺',()=>{const n=pick(solids);return choice('What is this 3D shape called?',n,solids,solid(n),'Look at its faces, edges and curved surfaces.');});
 add('bonds-eight','Domino bonds to 8','Calculation','⚄',()=>bondTask(8,true));
 add('bonds-nine','Make 9','Calculation','9',()=>bondTask(9,true));
 add('neighbours','1 more, 10 more','Numbers','↔',()=>{const n=11+R(79),delta=pick([-10,-1,1,10]);return num(`What is ${Math.abs(delta)} ${delta>0?'more':'less'} than ${n}?`,n+delta,equation(`${n} ${delta>0?'+':'−'} ${Math.abs(delta)} = ?`),'A step sideways changes the units. A step up or down changes the tens.');});
 add('cartoon-calculation','Adding & subtracting','Calculation','🦸',()=>{const n=12+R(70),d=pick([-10,-1,1,10]);return num(`The number hero has ${n} stars and ${d<0?'loses':'collects'} ${Math.abs(d)} ${Math.abs(d)===1?'star':'stars'}. How many stars does the hero have now?`,n+d,`<div class="mg-hero">🦸</div>${equation(`${n} ${d<0?'−':'+'} ${Math.abs(d)} = ?`)}`,'Count on or back by 1 or 10.');});
 add('coin-stacks','10p & 1p stacks','Money','🪙',()=>{const tens=1+R(8),ones=R(10);return num('Each tall stack has ten 1p coins. What is the total in pence?',tens*10+ones,`<div class="mg-coins">${Array.from({length:tens},()=>'<span class="mg-stack">10 × 1p</span>').join('')}${Array.from({length:ones},()=>coin(1)).join('')}</div>`,'Count ten for every stack, then add the loose pennies.');});
 add('money-bonds','Number bonds with money','Money','➕',()=>{const n=1+R(8),a=R(n+1)*10,total=n*10;return num(`How many more pence make ${total}p?`,total-a,`${coins(a)}${equation(`${a}p + ? = ${total}p`)}`,'Count up from the first amount to the total.');});
 add('over-ten','Sums across 10','Calculation','🚗',()=>{const a=6+R(4),b=11-a+R(a-1);return num('Add the numbers. Try making 10 first.',a+b,`${dots(a)}${equation(`${a} + ${b} = ?`)}${dots(b)}`,'Move enough from the second group to make the first group up to ten.');});
 add('addition-patterns','Small sums, big sums','Calculation','🐟',()=>{const a=2+R(7),b=1+R(9-a),t=1+R(8);return num(`Use ${a} + ${b} = ${a+b} to solve this.`,t*10+a+b,equation(`${t*10+a} + ${b} = ?`),'The number bond is the same. Keep the tens.');});
 add('three-numbers','Add three numbers','Calculation','🔺',()=>{const a=1+R(9),b=1+R(9),c=1+R(9);return num('Find the total of all three numbers.',a+b+c,`<div class="mg-triangle"><span>${a}</span><span>${b}</span><span>${c}</span></div>`,'Look for two numbers that are easy to add first.');});
 add('halve-dots','Halve the dots','Calculation','⚂',()=>{const n=2*(1+R(6));return num(`Share ${n} dots into two equal groups. How many in each?`,n/2,dots(n),'Give one dot to each group in turn.');});
 add('hundred-square','Gaps in a 100-square','Numbers','▦',()=>{const missing=1+R(100);return {kind:'hundred',prompt:'Which number belongs in the empty square?',answer:missing,missing,hint:'Numbers go up by 1 across a row and by 10 down a column.'};});
 add('place-value','Build a 2-digit number','Numbers','▥',()=>{const t=1+R(9),u=R(10);return num('How many altogether?',t*10+u,`<div class="mg-base">${Array.from({length:t},()=>'<span class="mg-ten">'+ '<i></i>'.repeat(10)+'</span>').join('')}<div class="mg-units">${'<i></i>'.repeat(u)}</div></div>${equation(`${t*10} + ${u} = ?`)}`,'Each rod has ten blocks. Each small square is one.');});
 add('missing-tens','Missing tens & units','Numbers','□ +',()=>{const n=10+R(90),t=Math.floor(n/10)*10,u=n%10,hide=R(2);return num('Fill the missing part.',hide?t:u,equation(hide?`? + ${u} = ${n}`:`${t} + ? = ${n}`),'Split the number into tens and units.');});
 add('sequences','Number sequences','Numbers','→',()=>sequenceTask(pick([1,2,3,4,5,10])));
 add('multiplication','Multiply by 2, 5 & 10','Calculation','✖',()=>{const a=1+R(6),b=pick([2,5,10]);return num(`How many dots in ${a} groups of ${b}?`,a*b,`<div class="mg-arrays">${Array.from({length:a},()=>dots(b)).join('')}</div>${equation(`${a} × ${b} = ?`)}`,'Count one group at a time, or use your times table.');});
 add('number-machine','Double & halve machine','Calculation','⚙️',()=>{const half=R(2),a=half?2*(1+R(20)):1+R(20);return num(`The machine ${half?'halves':'doubles'} every number. What comes out?`,half?a/2:a*2,`<div class="mg-machine"><span>${a}</span><b>${half?'÷ 2':'× 2'}</b><span>?</span></div>`,half?'Split into two equal groups.':'Add the number to itself.');});
 add('halve-odd','Halves with ½','Calculation','½',()=>{const n=3+2*R(4),v=`${Math.floor(n/2)}½`;return choice(`What is half of ${n}?`,v,[v,`${Math.floor(n/2)}`,`${Math.ceil(n/2)}`,`${Math.ceil(n/2)}½`],dots(n),'Share the whole dots equally. Split the last dot in half.');});
 add('clock-quarters','Quarter past & quarter to','Time','🕘',()=>clockTask([15,45]));
 add('patterns','Shapes & patterns','Shapes','🔴',()=>{const seq=shuffle(shapeNames).slice(0,2+R(2)),len=5+R(3),ans=seq[len%seq.length];return {prompt:'Which shape comes next?',answer:ans,options:shuffle(shapeNames),optionVisual:v=>shape(v),visual:`<div class="mg-pattern">${Array.from({length:len},(_,i)=>shape(seq[i%seq.length])).join('')}<b>?</b></div>`,hint:'Find the repeating group. Say it aloud.'};});
 add('add-bonds','Addition using bonds','Calculation','6 +',()=>{const total=pick([6,8,9]),a=1+R(total-1),b=total-a,t=1+R(7);return num(`Use the bond ${a} + ${b} = ${total}.`,t*10+total,equation(`${t*10+a} + ${b} = ?`),'Use the small number bond, then keep the tens.');});
 add('subtract-bonds','Subtraction using bonds','Calculation','−',()=>{const a=pick([5,6,7,8,9]),b=1+R(a),t=1+R(7);return num(`Use ${a} − ${b} = ${a-b}.`,t*10+a-b,equation(`${t*10+a} − ${b} = ?`),'Use the small subtraction fact. The tens stay the same.');});
 add('money-ten','Money bonds to 10p','Money','10p',()=>{const a=1+R(9);return num('How many more pence make 10p?',10-a,`${coins(a)}${equation(`${a}p + ? = 10p`)}`,'Count from this amount up to ten.');});
 add('change-twenty','Change from 20p','Money','🛒',()=>{const price=1+R(19);return num(`You pay 20p for a snack costing ${price}p. How much change in pence?`,20-price,`<div class="mg-hero">🍎 <span class="chip">${price}p</span></div><div class="mg-numberline">${Array.from({length:21},(_,i)=>`<span class="${i===price?'price':''}">${i}</span>`).join('')}</div>`,'Start at the price and count up to 20.');});
 add('add-subtract-one','Add & subtract 1','Calculation','±1',()=>{const a=11+R(78),d=pick([-1,1]);return num('Find the number one step away.',a+d,equation(`${a} ${d<0?'−':'+'} 1 = ?`),'Count one step forwards or backwards.');});
 function bondTask(total,domino){const n=R(total+1);return num(`What goes with ${n} to make ${total}?`,total-n,`${domino?`<div class="mg-domino">${dots(n)}<span>?</span></div>`:''}${equation(`${n} + ? = ${total}`)}`,`Count on from ${n} to ${total}.`);}
 function sequenceTask(step){const backwards=R(2),start=backwards?step*(6+R(8)):step*R(8),delta=backwards?-step:step,missing=1+R(3),ns=Array.from({length:5},(_,i)=>start+i*delta);return num(`Count ${backwards?'back':'on'} in ${step}s. What is missing?`,ns[missing],`<div class="mg-sequence">${ns.map((n,i)=>`<span>${i===missing?'?':n}</span>`).join('')}</div>`,`Each step ${backwards?'subtracts':'adds'} ${step}.`);}
 function fractionSVG(den,p){return `<div class="mg-fraction-display" style="--parts:${den}">${Array.from({length:den},(_,i)=>`<span class="${i<p?'coloured':''}"></span>`).join('')}</div>`;}
 let current=null,task=null,random=false,bag=[],chosen=null,solved=false,correct=0,total=0,category='All',advanceTimer=null,audio=null;
 const stage=$('#mgStage');
 function cancelAdvance(){clearTimeout(advanceTimer);advanceTimer=null;}
 function sound(ok){
  try{
   audio ||= new (window.AudioContext||window.webkitAudioContext)();
   audio.resume().catch(()=>{});
   const notes=ok?[523.25,659.25,783.99]:[220,174.61];
   notes.forEach((hz,i)=>{const o=audio.createOscillator(),g=audio.createGain(),at=audio.currentTime+i*.11;o.type='sine';o.frequency.setValueAtTime(hz,at);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.12,at+.015);g.gain.exponentialRampToValueAtTime(.001,at+.2);o.connect(g);g.connect(audio.destination);o.start(at);o.stop(at+.22);});
  }catch(e){}
 }
 function readProblem(){if(task&&$('#activity').classList.contains('on'))speakText(BMContent.speech(task.say||task.prompt));}
 function numericOptions(answer){
  const candidates=shuffle([...new Set([answer-10,answer+10,answer-2,answer+2,answer-1,answer+1,answer+5,answer-5])].filter(n=>n>=0&&n!==answer));
  return shuffle([answer,...candidates.slice(0,3)]);
 }
 function prepareTask(t){
  const problems=['count-back-money','cartoon-calculation','multiplication','money-ten','bonds-eight','bonds-nine'];
  const equationText=(t.visual||'').match(/<div class="mg-equation">(.*?)<\/div>/)?.[1];
  if(equationText&&problems.includes(current.id)){t.equation=equationText;t.visual=t.visual.replace(/<div class="mg-equation">.*?<\/div>/,'');}
  else if(equationText){t.say=equationText;}

  if(t.options&&!t.optionVisual&&t.options.every(v=>solids.includes(v)))t.optionVisual=v=>solid(v)+`<span>${v}</span>`;
  if(t.options&&!t.optionVisual&&t.options.every(v=>shapeNames.includes(String(v).toLowerCase())))t.optionVisual=v=>shape(String(v).toLowerCase())+`<span>${v}</span>`;
  if(!t.options&&t.kind!=='select')t.options=numericOptions(t.answer);
  if(t.options){const wrong=shuffle([...new Set(t.options)].filter(v=>String(v)!==String(t.answer)));t.options=shuffle([t.answer,...wrong.slice(0,3)]);}
  return t;
 }
 function mascot(){return svg(`<path d="M30 145 Q20 65 55 35 Q100 0 145 35 Q180 65 170 145Z" fill="#b8e6d0" stroke="#388c70" stroke-width="4"/><path d="M60 36L50 12L81 29M123 29L151 12L141 37" fill="#ffd468" stroke="#c59025" stroke-width="4"/><circle cx="74" cy="75" r="7" fill="#285b49"/><circle cx="127" cy="75" r="7" fill="#285b49"/><path d="M82 99Q101 119 120 99" fill="none" stroke="#285b49" stroke-width="5" stroke-linecap="round"/><circle cx="56" cy="94" r="10" fill="#f6a7a0"/><circle cx="145" cy="94" r="10" fill="#f6a7a0"/><text x="100" y="150" text-anchor="middle" font-size="30">★</text>`);}
 function renderMenu(){
  const cats=['All','Numbers','Calculation','Money','Time','Shapes'],filters=$('#gameFilters');filters.innerHTML='';
  cats.forEach(c=>{const b=el('button',null,c);b.setAttribute('aria-pressed',String(c===category));b.onclick=()=>{category=c;renderMenu();};filters.append(b);});
  const host=$('#gameCatalogue');host.innerHTML='';
  tasks.filter(t=>category==='All'||category===t.category).forEach(t=>{const b=el('button','xbtn',`<span class="xf">${t.icon}</span><span class="xt">${t.title}</span><span class="xb">${t.category}</span>`);b.dataset.game=t.id;b.onclick=()=>start(t.id);host.append(b);});
  $('#gamesIntro').textContent='Tap Play and let the adventure choose your next game!';
 }
 function start(id){cancelAdvance();random=id==='random';bag=[];correct=0;total=0;chosen=id;next();}
 function next(){
  cancelAdvance();cancelSpeech();
  if(random){if(!bag.length){bag=shuffle(['trails',...tasks.map(t=>t.id)]);if(bag[bag.length-1]===current?.id)[bag[0],bag[bag.length-1]]=[bag[bag.length-1],bag[0]];}chosen=bag.pop();}
  if(chosen==='trails'){
   current={id:'trails'};Trails.open();$('#trailNext').textContent=random?'Next game →':'↻ New board';return;
  }
  current=tasks.find(t=>t.id===chosen);task=prepareTask(current.generate());solved=false;show('activity');
  $('#mgTitle').textContent=current.title;$('#mgMode').textContent=random?'▶ Play':current.category;
  $('#mgPrompt').textContent=task.prompt;$('#mgFeedback').textContent='Tap your answer!';$('#mgFeedback').className='mg-feedback';stage.classList.remove('celebrate');$('#mgHint').hidden=false;$('#mgHint').textContent='💡 Help';$('#mgHint').setAttribute('aria-expanded','false');$('#mgNext').textContent='Skip →';$('#mgScore').textContent=`⭐ ${correct} stars`;
  stage.innerHTML='';const visual=el('div','mg-visual',task.visual||'');stage.append(visual);
  const response=el('div','mg-response');stage.append(response);
  if(task.kind==='select'){
   const grid=el('div','mg-number-grid'),found=new Set();
   task.numbers.forEach((n,i)=>{const b=el('button',null,String(n));b.dataset.index=i;b.setAttribute('aria-pressed','false');b.onclick=()=>{
    if(solved||found.has(i))return;
    if(!task.answer.includes(i)){b.classList.add('wrong');b.setAttribute('aria-invalid','true');feedback(false);return;}
    found.add(i);b.classList.add('right');b.setAttribute('aria-pressed','true');b.disabled=true;
    if(found.size===task.answer.length)feedback(true);else{sound(true);$('#mgFeedback').textContent=`⭐ ${found.size} / ${task.answer.length} found. Keep going!`;}
   };grid.append(b);});response.append(grid);
  }else if(task.options){
   const options=el('div','mg-choices'+(task.optionVisual?' illustrated':''));task.options.forEach(v=>{const b=el('button','mg-option',task.optionVisual?task.optionVisual(v):String(v));b.setAttribute('aria-label',task.optionVisual?current.id==='clock-day'?`${v} o’clock`:current.id==='fractions'?`${v} of ${task.den} parts coloured`:String(v):String(v));b.dataset.answer=String(v);b.onclick=()=>{if(solved)return;const ok=String(v)===String(task.answer);if(!ok){b.classList.add('wrong');b.setAttribute('aria-invalid','true');}else b.classList.add('right');feedback(ok);};options.append(b);});response.append(options);
  }
  if(task.kind==='hundred'){const grid=el('div','mg-hundred');for(let i=1;i<=100;i++)grid.append(el('span',i===task.missing?'missing':'',i===task.missing?'?':String(i)));visual.append(grid);}
  updateProgress();readProblem();
 }
 function updateProgress(){
  $('#mgProgress').innerHTML=`<span class="mg-star-track" aria-label="${correct%5} of 5 stars">${Array.from({length:5},(_,i)=>i<correct%5?'★':'☆').join(' ')}</span><br>${correct>=5?`Explorer level ${1+Math.floor(correct/5)} · `:''}Collect 5 stars to level up!`;
 }
 function feedback(ok){
  const f=$('#mgFeedback');sound(ok);cancelSpeech();
  f.className=ok?'mg-feedback good':'mg-feedback retry';
  f.textContent=ok?(correct%5===4?'🏆 Level up! Amazing exploring!':'⭐ Brilliant! Next adventure…'):'Try again. Tap Help if you would like a hint.';
  if(ok){solved=true;correct++;total++;$('#mgScore').textContent=`⭐ ${correct} ${correct===1?'star':'stars'}`;updateProgress();$('#mgHint').hidden=true;stage.classList.add('celebrate');stage.querySelectorAll('button').forEach(b=>b.disabled=true);advanceTimer=setTimeout(()=>{if($('#activity').classList.contains('on'))next();},1250);}
 }
 $('#mgNext').onclick=()=>next();$('#mgBack').onclick=()=>{cancelAdvance();cancelSpeech();show('games');};$('#mgHint').onclick=()=>{
  const existing=stage.querySelector('.equation-hint');
  if(existing){existing.remove();$('#mgFeedback').textContent='Tap your answer!';$('#mgHint').textContent='💡 Help';$('#mgHint').setAttribute('aria-expanded','false');return;}
  $('#mgFeedback').className='mg-feedback';$('#mgFeedback').textContent=task.hint;
  if(task.equation){const hint=el('div','equation-hint'),caption=el('p','mg-hint-label','Calculation hint'),calculation=el('div','mg-equation',task.equation);hint.append(caption,calculation);stage.querySelector('.mg-visual').append(hint);$('#mgHint').textContent='Hide hint';$('#mgHint').setAttribute('aria-expanded','true');}
 };
 $('#mgListen').onclick=readProblem;
 new MutationObserver(()=>{if(!$('#activity').classList.contains('on')){cancelAdvance();cancelSpeech();}}).observe($('#activity'),{attributes:true,attributeFilter:['class']});
 $('#randomGames').onclick=()=>start('random');$('#openTrails').onclick=()=>start('trails');
 $('#goGames').addEventListener('click',renderMenu);renderMenu();
 return {start,next,isRandom:()=>random,tasks,getState:()=>({id:current?.id,task,solved,random,correct,bag:[...bag]})};
})();
