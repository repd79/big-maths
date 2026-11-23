/* Per-round timing: defaults are preferences; the dial never rewrites them. */
const BMRoundOptions=(()=>{
 const defaultSeconds=(preference,seconds)=>preference===0?0:preference==='double'?seconds*2:seconds;
 const dialSeconds=(step,seconds)=>step>=11?0:Math.round(seconds*(1+Math.max(0,step)/10));
 const defaultStep=preference=>preference===0?11:preference==='double'?10:0;
 return {defaultSeconds,dialSeconds,defaultStep};
})();
if(typeof module!=='undefined')module.exports=BMRoundOptions;
