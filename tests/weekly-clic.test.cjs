const {test}=require('node:test');
const assert=require('node:assert/strict');
const W=require('../weekly-clic.js');
test('CLIC 4 is the one oral assessment sheet, independent of week',()=>{
 const sheet=W.generate(4,1);assert.deepEqual(W.generate(4,9),sheet);assert.equal(sheet.length,10);assert.equal(sheet.filter(q=>q.t==='oral').length,10);assert.equal(sheet[0].q,'Count from 50 to 59.');assert.ok(sheet.every(q=>q.sourceSet===1));
});
test('CLIC 5 week 1 preserves the actual mixed written and oral tasks',()=>{
 const q=W.generate(5,1);assert.match(q[0].q,/300, 800, 900/);assert.deepEqual(q[1].acceptRange,[12,20]);assert.deepEqual(q[2].parts.map(p=>p.a),['46','45','44']);assert.deepEqual(q[3].parts.map(p=>p.a),['80','79','78']);assert.equal(q[4].a,'60');assert.equal(q[5].a,'6');assert.equal(q[6].t,'oral');assert.equal(q[7].a,'7');assert.equal(q[8].t,'oral');assert.equal(q[9].a,'2');
});
test('CLIC 6 set 1 matches the supplied worksheet and answer sheet',()=>{
 const q=W.generate(6,1);assert.deepEqual(q[0].parts.map(p=>p.a),['40','6']);assert.deepEqual(q[1].nums,[13,11,17,14]);assert.equal(q[2].a,'16');assert.equal(q[3].a,'180');assert.deepEqual(q[4].answers,['15','21']);assert.deepEqual(q.slice(6).map(x=>x.a),['19','23','13','9']);
});
test('CLIC 6 sets with multiple blanks and subtraction fact families remain intact',()=>{
 assert.deepEqual(W.generate(6,8)[2].parts.map(p=>p.a),['14','18']);assert.deepEqual(W.generate(6,9)[2].parts.map(p=>p.a),['10','16']);assert.deepEqual(W.generate(6,10)[2].parts.map(p=>p.a),['18','20']);assert.equal(W.generate(6,7)[3].a,'140');assert.deepEqual(W.generate(6,5)[5].parts.map(p=>p.a),['3','7','7']);
});
test('Every numbered set is repeatable and all ten sets are distinct',()=>{
 for(const level of [5,6]){const seen=new Set();for(let week=1;week<=10;week++){const q=W.generate(level,week);assert.equal(q.length,10);assert.deepEqual(q,W.generate(level,week));assert.ok(q.every(x=>x.sourceSet===week&&x.sourceLevel===level));seen.add(JSON.stringify(q));}assert.equal(seen.size,10);}
});
test('Open number-range questions accept all valid whole numbers',()=>{
 for(let n=13;n<20;n++)assert.equal(W.acceptsRange([12,20],String(n)),true);
 for(const value of ['12','20','','13.5','banana'])assert.equal(W.acceptsRange([12,20],value),false);
});
