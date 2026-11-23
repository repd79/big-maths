/* Local child profiles. The first profile retains all pre-profile keys unchanged. */
const BMProfiles=(()=>{
 const META='bm.profiles.v1',validId=id=>typeof id==='string'&&/^(legacy|p[a-z0-9]{6,40})$/.test(id);
 function clean(value){
  if(!value||!Array.isArray(value.children))return null;
  const ids=new Set(),children=value.children.filter(p=>p&&validId(p.id)&&typeof p.name==='string'&&p.name.trim()&&p.name.length<=40&&!ids.has(p.id)&&ids.add(p.id)).slice(0,30).map(p=>({id:p.id,name:p.name.trim()}));
  if(!children.length)return null;return {active:children.some(p=>p.id===value.active)?value.active:children[0].id,children};
 }
 function create(storage){
  let state;try{state=clean(JSON.parse(storage.getItem(META)));}catch(_){}
  state ||= {active:'legacy',children:[{id:'legacy',name:'Player 1'}]};
  const persist=()=>storage.setItem(META,JSON.stringify(state));
  const key=k=>state.active==='legacy'||!(k==='bm.settings'||k.startsWith('bm.best.'))?k:'bm.child.'+state.active+'.'+k.slice(3);
  function activate(id){if(!state.children.some(p=>p.id===id))throw Error('Choose an existing player.');state.active=id;persist();}
  function add(name){name=String(name||'').trim();if(!name||name.length>40)throw Error('Use a name between 1 and 40 characters.');if(state.children.length>=30)throw Error('This device already has 30 players.');const id='p'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);state.children.push({id,name});state.active=id;persist();return id;}
  function rename(name){name=String(name||'').trim();if(!name||name.length>40)throw Error('Use a name between 1 and 40 characters.');state.children.find(p=>p.id===state.active).name=name;persist();}
  return {key,activate,add,rename,list:()=>state.children.map(p=>({...p})),active:()=>state.active};
 }
 return {create,clean,validId};
})();
if(typeof module!=='undefined')module.exports=BMProfiles;
