const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');const records=[],ids={};
for(const id of ['rinne-rim-canvas','shine-one','shine-ten','shine-title'])ids[id]={animate(frames,options){const a={id,frames,options,playState:'running',cancelled:false,cancel(){this.playState='idle';this.cancelled=true}};records.push(a);return a}};
const ctx={window:{},document:{getElementById:id=>ids[id]}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js','lighting-effects.js'),'utf8'),ctx);const fx=ctx.window.RinneLighting,live={rimActive:true,sheenActive:true,period:3.2};
fx.sync(live);assert.equal(records.length,4);assert.equal(fx.state().sheenCount,3);assert(fx.state().rimRunning);assert.equal(records[0].options.duration,3200);assert.equal(records[0].frames[1].opacity,.8);assert.equal(records[1].options.iterations,Infinity);
for(let i=0;i<100;i++)fx.sync(live);assert.equal(records.length,4);
fx.sync({...live,period:7.3});assert(records[0].cancelled);assert.equal(records.length,5);assert.equal(records[4].options.duration,7300);assert.equal(fx.state().sheenCount,3);
// A cancelled Web Animation is recreated even if activation class stayed unchanged.
records.filter(a=>!a.cancelled).forEach(a=>a.cancel());fx.sync({...live,period:7.3});assert.equal(records.length,9);assert(fx.state().rimRunning);assert.equal(fx.state().sheenCount,3);
fx.sync({rimActive:true,sheenActive:false,period:7.3});assert.equal(fx.state().sheenCount,0);assert(fx.state().rimRunning);fx.sync({...live,period:7.3});assert.equal(fx.state().sheenCount,3);
fx.sync({rimActive:false,sheenActive:false,period:7.3});assert(!fx.state().rimRunning);assert.equal(fx.state().sheenCount,0);assert(records.every(a=>a.cancelled));fx.sync(live);assert(fx.state().rimRunning);assert.equal(fx.state().sheenCount,3);fx.stop();assert(records.every(a=>a.cancelled));
console.log('PASS FX13/14: opacity/transform keyframes, independent loops, live period, 100 resyncs without duplicates, cancelled animation recreation, manual sheen gating, pause/resume and stop. Animation API shim; not browser rendering.');
