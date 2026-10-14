
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(require('path').join(__dirname,'..','review.html'),'utf8');
function createRuntime({deferFont=false}={}){
 const anchors=[],blobs=[];let fontResolve;const fontGate=deferFont?new Promise(r=>fontResolve=r):Promise.resolve();
 let motionRecords=[];class El{constructor(tag='div'){this.tagName=tag;this.children=[];this.style={setProperty(k,v){this[k]=v}};this.dataset={};this.attrs={};this.events={};this.checked=true;this.disabled=false;this.value='';this.clientWidth=480;this.isConnected=true;this.textContent='';const set=new Set;this.classList={add:(...v)=>v.forEach(x=>set.add(x)),remove:(...v)=>v.forEach(x=>set.delete(x)),contains:v=>set.has(v),toggle:(v,f)=>{f=f??!set.has(v);f?set.add(v):set.delete(v);return f}}}append(...els){this.children.push(...els)}replaceChildren(...els){this.children=[...els]}addEventListener(n,f){(this.events[n]??=[]).push(f)}setAttribute(n,v){this.attrs[n]=v}getAttribute(n){return this.attrs[n]}remove(){this.removed=true}focus(){doc.activeElement=this}setPointerCapture(){}setCustomValidity(){}animate(frames,options){let resolve,reject;const finished=new Promise((a,b)=>{resolve=a;reject=b});finished.catch(()=>{});const a={frames,options,finished,cancelled:false,cancel(){this.cancelled=true;reject(Error('cancelled'))},complete(){resolve()}};motionRecords.push(a);return a}getAnimations(){return[]}querySelectorAll(s){if(s.includes('button'))return this.children.filter(e=>e.tagName==='button');return[]}click(){this.clickCount=(this.clickCount||0)+1;if(!this.disabled)this.onclick?.({target:this})}decode(){return Promise.resolve()}}
const docEvents={},pageEvents={},rafQueue=new Map;let rafSerial=0;const ids={};Object.defineProperty(El.prototype,"id",{set(v){this._id=v;ids[v]=this},get(){return this._id}});for(const m of html.matchAll(/id="([^"]+)"/g))ids[m[1]]=new El();const fields=[];const resources=[new El('button'),new El('button')];resources[0].dataset.resource='水晶';resources[1].dataset.resource='票券';const doc={images:[],hidden:false,timeline:{currentTime:1000},fonts:{load:async()=>{await fontGate},ready:Promise.resolve(),check:()=>true},body:new El(),documentElement:new El(),activeElement:null,createElement:tag=>{const el=new El(tag);if(tag==='a')anchors.push(el);return el},getElementById:id=>ids[id],querySelector:s=>ids[s.slice(1)],querySelectorAll:s=>s==='.field'?fields:s==='[data-resource]'?resources:[],addEventListener(n,f){(docEvents[n]??=[]).push(f)}};for(const id of ['CP01-gems','CP01-tickets','CP02-limited','CP02-standard','CP02-friend','CP04','CP06','CP06-guarantee','CP07-one','CP07-ten','CP08']){const el=ids[id];if(!el)continue;el.append=(...els)=>{el.children.push(...els);els.forEach(e=>{if(e.className==='field')fields.push(e)})}}
for(const m of html.matchAll(/<input[^>]*id="([^"]+)"[^>]*>/g)){const v=m[0].match(/value="([^"]*)"/);if(v)ids[m[1]].value=v[1]}ids['calibrate'].checked=false;let scheduled=new Map,serial=0;const ctx={document:doc,window:{},ResizeObserver:class{observe(){}},matchMedia:()=>({get matches(){return ctx.reduceMode??false},addEventListener(n,f){(pageEvents['media']??=[]).push(f)}}),structuredClone,console,URL:{createObjectURL:b=>{blobs.push(b);return 'blob:test'},revokeObjectURL(){}},Blob,setTimeout:(fn,ms)=>{scheduled.set(++serial,fn);return serial},clearTimeout:id=>scheduled.delete(id),addEventListener(n,f){(pageEvents[n]??=[]).push(f)},requestAnimationFrame:fn=>{rafQueue.set(++rafSerial,fn);return rafSerial},cancelAnimationFrame:id=>rafQueue.delete(id),Date,Math,Number,Error,Promise,Object,Array};ctx.window.RinneRig={ready:Promise.resolve(),settings:{enabled:true,paused:false,amplitude:100,speed:1,gestureSpeed:1.5,track:true,autoTalk:false},sync(){},apply(value){Object.assign(this.settings,value);for(const key of ['enabled','paused','track','autoTalk'])ids['rig-'+key].checked=value[key];for(const key of ['amplitude','speed','gestureSpeed'])ids['rig-'+key].value=String(value[key])}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(require('path').join(__dirname,'..','config.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(require('path').join(__dirname,'..','js','app.js'),'utf8'),ctx);

 return {ctx,ids,doc,rafQueue,motionRecords,anchors,blobs,fontResolve};
}
const flush=()=>new Promise(r=>setImmediate(r));
function emit(r,id,event='input'){const el=r.ids[id];for(const fn of el.events[event]||[])fn({target:el})}
function setNumber(r,id,value){r.ids[id].value=String(value);emit(r,id)}
function setCheck(r,id,checked){r.ids[id].checked=checked;emit(r,id,'change')}
const normalize=v=>JSON.parse(JSON.stringify(v));
const config=r=>normalize(r.ctx.window.makeProjectSettings());
async function readFile(r,raw){const el=r.ids['json-file'];el.files=[{size:Buffer.byteLength(raw),text:async()=>raw}];el.value='same-file.json';await el.onchange({target:el});assert.equal(el.value,'')}
(async()=>{
 const a=createRuntime();await flush();a.motionRecords.forEach(x=>x.complete());await flush();assert(a.ctx.window.uiState().ready);
 a.ids['field-select'].value='pity-number';emit(a,'field-select','change');setNumber(a,'edit-x',263);setNumber(a,'edit-fontSize',44);
 setNumber(a,'rinne-start-number',88);setNumber(a,'rinne-fade-number',1.95);setNumber(a,'rim-period-number',7.3);
 setNumber(a,'cards-speed',1.7);setNumber(a,'cards-amplitude',1.8);setNumber(a,'cards-strength',1.4);
 setCheck(a,'cards-visible',false);setCheck(a,'cards-drift',false);setCheck(a,'cards-glow',false);a.ids['cards-pause'].click();
 setCheck(a,'beauty-sheen',false);setCheck(a,'beauty-rim',false);
 a.ids['motion'].checked=false;a.ids['motion'].onchange();emit(a,'motion','change');
 a.ids['overlay'].value='37';a.ids['overlay'].oninput({target:a.ids['overlay']});
 a.ids['balance-input'].valueAsNumber=9237;a.ids['balance-input'].oninput({target:a.ids['balance-input']});
 a.ids['next'].click();setCheck(a,'calibrate',true);a.ids['toggle-panel'].click();
 a.ctx.window.RinneRig.apply({enabled:false,paused:true,amplitude:125,speed:1.3,gestureSpeed:2.5,track:false,autoTalk:true});const expected=config(a);a.ids['export-json'].click();assert.equal(a.blobs.length,1);assert(a.anchors[0].download.includes('Project_Settings_v1.2.2'));
 const raw=await a.blobs[0].text(), exported=JSON.parse(raw);assert.deepEqual(exported.parameters,expected.parameters);assert.deepEqual(exported.fields,expected.fields);
 // Fresh runtime is the F5 reset; import through the real file-change handler before loading finishes.
 const b=createRuntime({deferFont:true});assert(!b.ctx.window.uiState().ready);b.ids['import-json'].click();assert.equal(b.ids['json-file'].clickCount,1);
 const pending=readFile(b,raw);await flush();assert(b.ids['cal-status'].textContent.includes('等待素材'));b.fontResolve();await pending;await flush();
 assert(b.ctx.window.uiState().ready);assert.deepEqual(config(b).parameters,exported.parameters);assert.deepEqual(config(b).fields,exported.fields);
 for(const [id,value] of [['rinne-start-x',88],['rinne-start-number',88],['rinne-fade-period',1.95],['rinne-fade-number',1.95],['rim-period',7.3],['rim-period-number',7.3],['cards-speed',1.7],['cards-amplitude',1.8],['cards-strength',1.4],['overlay',37],['balance-input',9237],['edit-x',263],['edit-fontSize',44]])assert.equal(Number(b.ids[id].value),value,id);
 assert.equal(b.ids['field-select'].value,'pity-number');assert(b.ids['calibrate'].checked);assert.equal(b.ids['cards-pause'].textContent,'繼續卡牌');assert(b.doc.body.classList.contains('hidden-panel'));assert(b.ids.stage.classList.contains('alt'));assert(b.ids.stage.classList.contains('calibrating'));assert.equal(b.ids['source-overlay'].style.opacity,.37);assert.equal(b.doc.body.dataset.motion,'off');assert.equal(b.ids.stage.style['--rim-period'],'7.3s');assert.equal(b.rafQueue.size,0);
 assert.equal(b.ids['rig-amplitude'].value,'125');assert.equal(b.ids['rig-gestureSpeed'].value,'2.5');assert(b.ids['rig-autoTalk'].checked);
 // Invalid late section must leave all fields and all earlier parameters untouched.
 const bad=normalize(exported);bad.fields['pity-number'].x=999;bad.parameters.rinne.startX=63;bad.parameters.lighting.period=200;
 const before=config(b);assert.throws(()=>b.ctx.window.importProjectSettings(bad));assert.deepEqual(config(b).fields,before.fields);assert.deepEqual(config(b).parameters,before.parameters);
 await readFile(b,JSON.stringify(bad));assert(b.ids['cal-status'].textContent.includes('匯入失敗'));assert.deepEqual(config(b).parameters,before.parameters);
 await readFile(b,raw);assert.deepEqual(config(b).parameters,exported.parameters); // same file can be reselected
 const c=createRuntime();await flush();const defaults=config(c).parameters;fs.writeFileSync(require('path').join(__dirname,'..','tests','test-defaults-output.json'),JSON.stringify(config(c),null,2));
 const legacy=normalize(a.ctx.window.makeCalibration());legacy.editorVersion='v0.2';await readFile(c,JSON.stringify(legacy));assert.deepEqual(config(c).fields,exported.fields);assert.deepEqual(config(c).parameters,defaults);assert(c.ids['cal-status'].textContent.includes('舊版文字'));
 const old=normalize(exported);old.editorVersion='v1.0';delete old.parameters.portrait;assert.doesNotThrow(()=>c.ctx.window.importProjectSettings(old));const invalidPortrait=normalize(exported);invalidPortrait.parameters.portrait.gestureSpeed=8;const heldPortrait=config(c);assert.throws(()=>c.ctx.window.importProjectSettings(invalidPortrait));assert.deepEqual(config(c),heldPortrait);
 const missing=normalize(exported);delete missing.parameters.cards.strength;assert.throws(()=>c.ctx.window.importProjectSettings(missing));
 const wrong=normalize(exported);wrong.parameters.ui.motionEnabled='false';assert.throws(()=>c.ctx.window.importProjectSettings(wrong));
 const signature=normalize(exported);signature.signature='other';assert.throws(()=>c.ctx.window.importProjectSettings(signature));
 const beforeMalformed=config(c);await readFile(c,'{broken');assert.deepEqual(config(c).parameters,beforeMalformed.parameters);
 const live=normalize(exported);Object.assign(live.parameters.ui,{calibrationEnabled:false,panelHidden:false,motionEnabled:true,selectedActivity:0});Object.assign(live.parameters.cards,{visible:true,drift:true,glow:true,paused:false});Object.assign(live.parameters.lighting,{sheen:true,rim:true});const d=createRuntime();await flush();await readFile(d,JSON.stringify(live));assert.equal(d.rafQueue.size,1);assert(d.ctx.window.beautyFXState().active);assert(d.ctx.window.beautyFXState().sheenActive);assert.equal(d.ids.stage.style['--rim-period'],'7.3s');const k=d.motionRecords.length;d.ids['preview-character'].click();assert.equal(d.motionRecords[k].frames[0].transform,'translateX(357.58px)');assert.equal(d.motionRecords[k+1].options.duration,1950);

 const lightingOn=normalize(live);lightingOn.parameters.ui.motionEnabled=true;lightingOn.parameters.ui.calibrationEnabled=false;lightingOn.parameters.ui.selectedActivity=0;lightingOn.parameters.lighting={sheen:true,rim:true,period:2.4};
 d.ctx.window.importProjectSettings(lightingOn);
 const lightingOff=normalize(lightingOn);lightingOff.parameters.ui.motionEnabled=false;
 d.ctx.window.importProjectSettings(lightingOff);
 assert(!d.ctx.window.beautyFXState().active,'FX14 must stop when importing motionEnabled=false');
 assert(!d.ctx.window.beautyFXState().sheenActive,'FX13 must stop when importing motionEnabled=false');
 d.ctx.window.importProjectSettings(lightingOn);
 assert(d.ctx.window.beautyFXState().active,'FX14 must restart when importing motionEnabled=true');
 assert(d.ctx.window.beautyFXState().sheenActive,'FX13 must restart when importing motionEnabled=true');
 const inCalibration=normalize(lightingOn);inCalibration.parameters.ui.calibrationEnabled=true;d.ctx.window.importProjectSettings(inCalibration);assert(!d.ctx.window.beautyFXState().active);assert(!d.ctx.window.beautyFXState().sheenActive);
 d.ctx.window.importProjectSettings(lightingOn);assert(d.ctx.window.beautyFXState().active);assert(d.ctx.window.beautyFXState().sheenActive);assert.equal(d.ids.stage.style['--rim-period'],'2.4s');
 const noLighting=normalize(lightingOn);noLighting.parameters.lighting={sheen:false,rim:false,period:2.4};d.ctx.window.importProjectSettings(noLighting);assert(!d.ctx.window.beautyFXState().active);assert(!d.ctx.window.beautyFXState().sheenActive);assert(!d.ids.stage.classList.contains('rim-visible'));
 d.ctx.window.importProjectSettings(lightingOn);assert(d.ctx.window.beautyFXState().active);assert(d.ctx.window.beautyFXState().sheenActive);
 console.log('PASS: actual export click creates full JSON; fresh F5 runtime + import file handler waits for load; all values/checkboxes/labels/fields/CSS/activity/mode restored; re-import same file; legacy v0.2 accepted; missing/wrong-type/signature/malformed/late-invalid data rejected atomically. DOM shim only.');
})().catch(e=>{console.error(e);process.exit(1)});
