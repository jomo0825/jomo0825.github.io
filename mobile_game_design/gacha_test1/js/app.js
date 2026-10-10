
document.querySelector("#font-license").textContent='© 2014–2021 Adobe (http://www.adobe.com/).\nProjectFont is a subset of Noto Sans CJK TC, version 2.004, renamed for this project.\nThis Font Software is licensed under the SIL Open Font License, Version 1.1.\nOfficial license: https://openfontlicense.org/documents/OFL.txt\n\nSIL OPEN FONT LICENSE Version 1.1 - 26 February 2007\n-----------------------------------------------------------\n\nPREAMBLE\nThe goals of the Open Font License (OFL) are to stimulate worldwide\ndevelopment of collaborative font projects, to support the font creation\nefforts of academic and linguistic communities, and to provide a free and\nopen framework in which fonts may be shared and improved in partnership\nwith others.\nThe OFL allows the licensed fonts to be used, studied, modified and\nredistributed freely as long as they are not sold by themselves. The\nfonts, including any derivative works, can be bundled, embedded,\nredistributed and/or sold with any software provided that any reserved\nnames are not used by derivative works. The fonts and derivatives,\nhowever, cannot be released under any other type of license. The\nrequirement for fonts to remain under this license does not apply\nto any document created using the fonts or their derivatives.\nDEFINITIONS\n"Font Software" refers to the set of files released by the Copyright\nHolder(s) under this license and clearly marked as such. This may\ninclude source files, build scripts and documentation.\n\n"Reserved Font Name" refers to any names specified as such after the\ncopyright statement(s).\n\n"Original Version" refers to the collection of Font Software components as\ndistributed by the Copyright Holder(s).\n"Modified Version" refers to any derivative made by adding to, deleting,\nor substituting -- in part or in whole -- any of the components of the\nOriginal Version, by changing formats or by porting the Font Software to a\nnew environment.\n\n"Author" refers to any designer, engineer, programmer, technical\nwriter or other person who contributed to the Font Software.\nPERMISSION & CONDITIONS\nPermission is hereby granted, free of charge, to any person obtaining\na copy of the Font Software, to use, study, copy, merge, embed, modify,\nredistribute, and sell modified and unmodified copies of the Font\nSoftware, subject to the following conditions:\n\n1) Neither the Font Software nor any of its individual components,\nin Original or Modified Versions, may be sold by itself.\n2) Original or Modified Versions of the Font Software may be bundled,\nredistributed and/or sold with any software, provided that each copy\ncontains the above copyright notice and this license. These can be\nincluded either as stand-alone text files, human-readable headers or\nin the appropriate machine-readable metadata fields within text or\nbinary files as long as those fields can be easily viewed by the user.\n3) No Modified Version of the Font Software may use the Reserved Font\nName(s) unless explicit written permission is granted by the corresponding\nCopyright Holder. This restriction only applies to the primary font name as\npresented to the users.\n4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font\nSoftware shall not be used to promote, endorse or advertise any\nModified Version, except to acknowledge the contribution(s) of the\nCopyright Holder(s) and the Author(s) or with their explicit written\npermission.\n5) The Font Software, modified or unmodified, in part or in whole,\nmust be distributed entirely under this license, and must not be\ndistributed under any other license. The requirement for fonts to\nremain under this license does not apply to any document created\nusing the Font Software.\n\nTERMINATION\nThis license becomes null and void if any of the above conditions are\nnot met.\nDISCLAIMER\nTHE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT\nOF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE\nCOPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,\nINCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL\nDAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\nFROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM\nOTHER DEALINGS IN THE FONT SOFTWARE.\n';
const W=941,H=1672,$=s=>document.querySelector(s),stage=$('#stage'),viewport=$('#viewport');let scale=1,ready=false,cal=false,entered=false,entryRunning=false,selectedActivity=0,balance=12680,busy=false,run=0,timer=null,lastFocus=null;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize(){scale=viewport.clientWidth/W;stage.style.transform=`scale(${scale})`}new ResizeObserver(resize).observe(viewport);resize();
const fieldDefs=[
['gems','CP01-gems',161,52,25,0,100,49,27,'12,680'],['tickets','CP01-tickets',140,52,24,0,88,49,27,'10'],
['detail-label','CP04',97,230,-5,80,102,37,22,'角色詳情'],['probability-label','CP04',97,230,-5,202,102,37,22,'機率說明'],
['pity-number','CP06',624,94,157,4,53,49,38,'60'],
['time-label','CP08',330,44,43,0,92,42,21,'剩餘時間'],['time-value','CP08',330,44,139,0,182,42,23,'12天 08:45']];
const baseline={};for(const [id,container,rw,rh,x,y,width,height,fontSize,text] of fieldDefs){const cp=container.split('-')[0];baseline[id]={componentId:cp,fieldId:id,containerId:container,referenceWidth:rw,referenceHeight:rh,fontFamily:'ProjectFont',fontWeight:700,x,y,width,height,fontSize,lineHeight:fontSize*1.15,letterSpacing:0};const el=document.createElement('span');el.className='field';el.dataset.field=id;el.textContent=text;el.tabIndex=-1;document.getElementById(container).append(el)}let fields=structuredClone(baseline);const nodes=Object.fromEntries([...document.querySelectorAll('.field')].map(e=>[e.dataset.field,e]));for(const id of ['pity-number','time-value'])nodes[id].style.color='#ff28ba';
function applyFields(){for(const [id,f] of Object.entries(fields)){Object.assign(nodes[id].style,{left:f.x+'px',top:f.y+'px',width:f.width+'px',height:f.height+'px',fontSize:f.fontSize+'px',lineHeight:f.lineHeight+'px',letterSpacing:f.letterSpacing+'px',fontWeight:f.fontWeight})}}applyFields();
let activeField=fieldDefs[0][0];const select=$('#field-select');for(const [id,container,,,,,,,,text] of fieldDefs){const o=document.createElement('option');o.value=id;o.textContent=`${container} · ${text}`;select.append(o)}const props=['x','y','width','height','fontSize','lineHeight','letterSpacing'];for(const p of props){const label=document.createElement('label');label.textContent=p+' (px)';const n=document.createElement('input');n.type='number';n.step=p==='letterSpacing'?.1:1;n.dataset.prop=p;n.id='edit-'+p;label.append(n);$('#editor').append(label);n.addEventListener('input',()=>{const val=Number(n.value);if(!Number.isFinite(val)||!validRange(p,val)){n.setCustomValidity('數值超出允許範圍');return}n.setCustomValidity('');fields[activeField][p]=val;applyFields();$('#cal-status').textContent='已修改，請匯出 JSON 保存。'})}
function validRange(p,v){return p==='x'||p==='y'?Math.abs(v)<=2000:p==='letterSpacing'?Math.abs(v)<=30:p==='fontSize'||p==='lineHeight'?v>=8&&v<=120:v>=1&&v<=2000}
function selectField(id){activeField=id;select.value=id;for(const [k,n] of Object.entries(nodes))n.classList.toggle('selected',k===id);const f=fields[id];$('#field-meta').textContent=`${f.componentId} · ${f.containerId} · 基準 ${f.referenceWidth} × ${f.referenceHeight} px · ProjectFont`;for(const p of props)$('#edit-'+p).value=Number(f[p].toFixed(2))}select.addEventListener('change',()=>selectField(select.value));selectField(activeField);
let drag=null;for(const [id,n] of Object.entries(nodes)){n.addEventListener('pointerdown',e=>{if(!cal)return;e.preventDefault();e.stopPropagation();selectField(id);n.focus();drag={id,x:e.clientX,y:e.clientY,baseX:fields[id].x,baseY:fields[id].y,pointerId:e.pointerId};n.setPointerCapture(e.pointerId)});n.addEventListener('pointermove',e=>{if(!cal||!drag||drag.id!==id)return;fields[id].x=drag.baseX+(e.clientX-drag.x)/scale;fields[id].y=drag.baseY+(e.clientY-drag.y)/scale;applyFields();selectField(id);$('#cal-status').textContent='已拖曳，請匯出 JSON 保存。'});for(const ev of ['pointerup','pointercancel','lostpointercapture'])n.addEventListener(ev,()=>drag=null);n.addEventListener('keydown',e=>{if(!cal||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();const v=e.shiftKey?10:1;fields[id].x+=e.key==='ArrowRight'?v:e.key==='ArrowLeft'?-v:0;fields[id].y+=e.key==='ArrowDown'?v:e.key==='ArrowUp'?-v:0;applyFields();selectField(id)})}
function cancelRun(){run++;clearTimeout(timer);timer=null;busy=false;updateButtons()}
$('#calibrate').addEventListener('change',()=>{cal=$('#calibrate').checked;cancelRun();closeModal();cancelEntry(true);stage.classList.toggle('calibrating',cal);for(const n of Object.values(nodes))n.tabIndex=cal?0:-1;$('#cal-status').textContent=cal?'校準模式：遊戲點擊已暫停。':'校準模式已關閉。';updateButtons()});$('#reset-field').onclick=()=>{fields[activeField]=structuredClone(baseline[activeField]);applyFields();selectField(activeField);$('#cal-status').textContent='已還原此欄位至 v0.2 基準。'};
const signature='4ba473d4019aba967fadd26ed104c9853ae94ded4682df5b96dc253dd2c93702',project='rinne-recruitment-941x1672';function makeCalibration(){return{schema:'game-ui-text-calibration/1',project,signature,sourceVersion:'source-941x1672-v1',editorVersion:'v1.2.2',coordinateSystem:'component-local-reference-pixels',updatedAt:new Date().toISOString(),fields:structuredClone(fields)}}window.makeCalibration=makeCalibration;
function validateTextCalibration(data){if(data.schema!=='game-ui-text-calibration/1'||data.signature!==signature||data.project!==project||data.coordinateSystem!=='component-local-reference-pixels')throw Error('專案、座標系統或相容性簽章不符');if(!data.fields||typeof data.fields!=='object'||Object.keys(data.fields).sort().join('|')!==Object.keys(baseline).sort().join('|'))throw Error('欄位清單不完整');const next={};for(const [id,b] of Object.entries(baseline)){const f=data.fields[id];for(const p of ['componentId','fieldId','containerId','referenceWidth','referenceHeight','fontFamily','fontWeight'])if(f[p]!==b[p])throw Error('欄位依賴不符：'+id);for(const p of props)if(typeof f[p]!=='number'||!Number.isFinite(f[p])||!validRange(p,f[p]))throw Error('校準數值無效：'+id+'/'+p);next[id]={...b,...Object.fromEntries(props.map(p=>[p,f[p]]))}}return next;}
$('#export-json').onclick=()=>{if(!ready){$('#cal-status').textContent='素材尚在載入，請稍候再匯出完整設定。';return}const blob=new Blob([JSON.stringify(makeProjectSettings(),null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='Rinne_Project_Settings_v1.2.2.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);$('#cal-status').textContent='已匯出全部可配置參數。重新整理後可直接匯入這份 JSON 恢復設定。'};
$('#import-json').onclick=()=>$('#json-file').click();
$('#json-file').onchange=async e=>{try{const f=e.target.files?.[0];if(!f)return;if(f.size>2000000)throw Error('JSON 超過 2 MB');const data=JSON.parse(await f.text());if(!ready){$('#cal-status').textContent='設定檔已讀取，等待素材載入完成後匯入…';await settingsReady}importProjectSettings(data)}catch(err){$('#cal-status').textContent='匯入失敗，目前參數未變更：'+err.message;$('#status').textContent=$('#cal-status').textContent}finally{e.target.value=''}};
const activities=[{name:'霓光領航者 RINNE',image:'assets/card1.png'},{name:'蒼海迴響',image:'assets/card2.png'},{name:'暗夜契約',image:'assets/card3.png'}];activities.forEach((a,i)=>{const b=document.createElement('button');b.className='game-btn card';b.dataset.activity=i;b.role='tab';b.setAttribute('aria-label',a.name);b.setAttribute('aria-selected',i===0?'true':'false');const img=document.createElement('img');img.src=a.image;img.alt=a.name;b.append(img);b.onclick=()=>setActivity(i);$('#CP09').append(b);const dot=document.createElement('button');dot.setAttribute('aria-label','選擇活動 '+a.name);dot.setAttribute('aria-selected',i===0?'true':'false');dot.onclick=()=>setActivity(i);$('#dots').append(dot);b.onkeydown=e=>{if(cal)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setActivity((selectedActivity+(e.key==='ArrowRight'?1:2))%3);$('#CP09').children[selectedActivity].focus()}}});
function setActivity(i){if(!ready||cal)return;cancelRun();closeModal();cancelEntry(true);selectedActivity=i;stage.classList.toggle('alt',i!==0);$('#alt-title').textContent=activities[i].name;$('#alt-img').src=activities[i].image;for(const list of [$('#CP09'),$('#dots')])[...list.children].forEach((b,j)=>b.setAttribute('aria-selected',j===i?'true':'false'));updateButtons();syncCards();log('活動：'+activities[i].name+(i?'（只有原縮圖）':''))}$('#prev').onclick=()=>setActivity((selectedActivity+2)%3);$('#next').onclick=()=>setActivity((selectedActivity+1)%3);
function log(s){$('#status').textContent=(ready?'圖片與字型已載入。\n':'')+s}function gameAllowed(){return ready&&!cal&&entered}
function updateButtons(){for(const [id,cost] of [['CP07-one',300],['CP07-ten',3000]])document.getElementById(id).disabled=!ready||cal||busy||!entered||selectedActivity!==0||balance<cost}
function setBalance(v){balance=Math.max(0,Math.min(999999999,Math.trunc(v)));nodes.gems.textContent=balance.toLocaleString('en-US');$('#balance-input').value=balance;updateButtons()}
$('#balance-input').oninput=e=>{if(!Number.isFinite(e.target.valueAsNumber))return;setBalance(e.target.valueAsNumber);log('示範餘額已更新：'+balance)};$('#normal-state').onclick=()=>{if(!ready||cal)return;cancelEntry(true);cancelRun();closeModal();setActivity(0);setBalance(12680);log('已還原一般狀態。')};$('#insufficient').onclick=()=>{if(!gameAllowed())return;cancelRun();setBalance(100);log('餘額不足：單次與十連招募已實際停用。')};
function showModal(title,content,actions=[]){lastFocus=document.activeElement;$('#modal-title').textContent=title;$('#modal-content').replaceChildren();if(typeof content==='string'){const p=document.createElement('p');p.textContent=content;$('#modal-content').append(p)}else $('#modal-content').append(content);$('#modal-actions').replaceChildren();for(const a of actions){const b=document.createElement('button');b.textContent=a.label;b.className=a.secondary?'secondary':'';b.onclick=a.fn;$('#modal-actions').append(b)}$('#modal').classList.add('open');if(!reduced&&$('#motion').checked)$('#modal').animate([{opacity:0},{opacity:1}],{duration:150});$('#close-modal').focus()}
function closeModal(){cancelRun();$('#modal').classList.remove('open');if(lastFocus?.isConnected)lastFocus.focus();lastFocus=null}$('#close-modal').onclick=closeModal;$('#modal').onclick=e=>{if(e.target===$('#modal'))closeModal()};document.addEventListener('keydown',e=>{if(!$('#modal').classList.contains('open'))return;if(e.key==='Escape'){e.preventDefault();closeModal()}if(e.key==='Tab'){const els=[...$('#modal').querySelectorAll('button:not(:disabled),[tabindex="0"]')];const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
function doRecruit(n){if(!gameAllowed()||busy||selectedActivity!==0||balance<n*300)return;showModal('確認招募流程示範',`招募 ${n} 次，圖中費用 ${(n*300).toLocaleString('en-US')} 水晶。這次只示範操作流程，不扣款、不依未知機率產生角色。`,[{label:'開始示範',fn:()=>loading(n)},{label:'取消',secondary:true,fn:closeModal}])}$('#CP07-one').onclick=()=>doRecruit(1);$('#CP07-ten').onclick=()=>doRecruit(10);
function loading(n=1){if(!gameAllowed())return;cancelRun();const token=run;busy=true;updateButtons();const content=document.createElement('div');const ring=document.createElement('div');ring.className='loading-ring';const p=document.createElement('p');p.textContent='正在播放招募流程示範…';content.append(ring,p);showModal('招募載入',content,[{label:'取消示範',secondary:true,fn:closeModal}]);timer=setTimeout(()=>{if(token!==run||cal||document.hidden)return;busy=false;updateButtons();const c=document.createElement('div');const img=document.createElement('img');img.src=activities[0].image;img.alt=activities[0].name;const p=document.createElement('p');p.textContent=`${n} 次招募的 UI 流程示範完成。展示的是活動縮圖，並非抽卡結果；餘額與持有角色未變動。`;c.append(img,p);showModal('流程示範完成',c,[{label:'返回招募',fn:closeModal}]);log('招募流程示範完成；沒有扣款或產生角色。')},1000)}$('#preview-loading').onclick=()=>{if(gameAllowed())loading(1)};
$('#preview-press').onclick=()=>{if(!gameAllowed()||reduced||!$('#motion').checked)return;$('#CP07-ten').animate([{filter:'brightness(1)'},{filter:'brightness(1.3)',offset:.4},{filter:'brightness(1)'}],{duration:240});log('已試播按下亮度回饋。')};$('#motion').checked=!reduced;$('#motion').onchange=()=>{if(!$('#motion').checked)cancelEntry(true);document.body.dataset.motion=$('#motion').checked?'on':'off';for(const a of stage.getAnimations({subtree:true}))if(!$('#motion').checked)a.cancel()};
$('#details').onclick=()=>{if(gameAllowed())showModal('角色詳情','SSR · RINNE · 霓光領航者。原圖標示「限定角色機率提升」。角色技能、能力數值與完整設定尚未提供。')};$('#probability').onclick=()=>{if(gameAllowed())showModal('機率說明','原圖顯示：十連招募必得 SR 以上角色，距離保底還有 60 次。SSR、SR、R 與 UP 機率、保底總次數及計算順序尚未提供。')};$('#back').onclick=()=>{if(gameAllowed())showModal('返回','此交付範圍為單一招募頁；上一頁尚未提供。你可以關閉彈窗繼續驗證。')};document.querySelectorAll('[data-resource]').forEach(b=>b.onclick=()=>{if(gameAllowed())showModal('增加'+b.dataset.resource,'商店與資源取得頁尚未提供。右側面板可以調整示範水晶餘額，測試招募按鈕的停用條件。')});for(const [id,name] of [['CP02-standard','常駐'],['CP02-friend','友情']])document.getElementById(id).onclick=()=>{if(gameAllowed())showModal(name+'招募','本圖只提供選單標籤；此頁的主視覺、費用與規則尚未提供。')};$('#CP02-limited').onclick=()=>setActivity(0);
stage.addEventListener('click',e=>{if((cal||!entered)&&!(e.target.closest('.field'))){e.preventDefault();e.stopImmediatePropagation()}},true);
$('#overlay').oninput=e=>{$('#source-overlay').style.opacity=e.target.value/100;$('#overlay-value').textContent=e.target.value+'%'};$('#toggle-panel').onclick=()=>{const hidden=document.body.classList.toggle('hidden-panel');$('#toggle-panel').textContent=hidden?'顯示驗證面板':'隱藏驗證面板';resize()};document.addEventListener('visibilitychange',()=>{if(document.hidden&&entryRunning){cancelEntry(true);$('#entry-status').textContent='頁面隱藏，進場已取消並回到完成位置。'}if(document.hidden&&busy){closeModal();log('頁面隱藏，招募示範已取消。')}});addEventListener('pagehide',()=>{cancelRun();cancelEntry(true)});
const cpRows=[['CP01','頁頭／資源：沿用','AS02/06 · FX03','已實作'],['CP02','原圖完整點陣 Tab 文字＋按鈕','AS03 · FX02/03','已實作'],['CP03','背景與透明人物，941×1672共同座標','AS01/07/08 · FX06/14','素材已沿用；新輪廓光待試用'],['CP04','詳情與機率彈窗：沿用','AS02/06 · FX03','已實作'],['CP05','獨立圖片美術字：左側滑入＋淡入','AS04 · FX07/13','已實作'],['CP06','原圖點陣保底 UI；僅 60 為 HTML','AS09/06','已實作'],['CP07','原圖點陣按鈕／全部原字樣；分別滑入','AS10/11 · FX01/04/08/09/13','已實作'],['CP08','原版剩餘時間字樣','AS06','沿用'],['CP09','活動卡、箭頭、圓點','AS05 · FX02','沿用']];
const asRows=[['AS01','source.png','保留 v0.1 主視覺作為拆層來源與比對'],['AS02','gem.png / ticket.png / header-title.png','沿用裁切；少量原背景像素未精修'],['AS03','tabs-raster.png','原圖(50,105)844×68，完整點陣文字／框線；外界裁切 alpha'],['AS04','promo-final.png','沿用 v0.1 美術字素材，不重新生成'],['AS05','card1–3.png','沿用原圖活動缩圖'],['AS06','project-font.otf','沿用字型；僅 7 個 HTML 欄位'],['AS07','rig/*.png','使用者分層動畫 v7；共同941×1672畫布，動態輪廓光共用每幀 alpha'],['AS08','background-only.png','移除 Rinne 後補全；遮擋區為推定，非原作復原'],['AS09','pity-raster.png','原圖(190,1188)624×94；只替換原60的修復小區'],['AS10','one-raster.png','原圖(118,1280)347×125，完整文字／費用／框線'],['AS11','ten-raster.png','原圖(472,1280)356×125，完整文字／費用／框線']];
const fxRows=[['FX01','CP07 按下','原圖按鈕亮度回饋120ms；與進場 transform 分層'],['FX02','CP02/09','沿用選中／切換；取消載入與進場'],['FX03','彈窗','150ms淡入；Escape／關閉取消；reduce立即'],['FX04','招募 loading','1000ms示範；防重入、取消、校準／隱藏頁停止'],['FX05','背景光','靜態，不新增持續光效'],['FX06','Rinne 右→左＋淡入','0ms起，滑動850ms，淡入0.1–4秒可調；起點x可調，預設75→50；translateX((起點−50)/100×stageWidth)→0，opacity0→1'],['FX07','角色標題 左→右＋淡入','140ms延遲，650ms；translateX(-(x+width+24))→0，opacity0→1'],['FX08','單抽 左→右滑入','320ms延遲，600ms；translateX(-(x+width+24))→0；無額外淡入'],['FX09','十連 右→左滑入','390ms延遲，600ms；translateX(stageWidth-x+24)→0；無額外淡入']];
cpRows.push(['CP10','7張背景懸浮卡牌；pointer-events:none','AS12–18 · FX10/11/12','已實作，整頁待試用']);
asRows.push(...['neon-cube.png','neon-orbit.png','neon-data.png','neon-mesh.png','neon-spectrum.png','neon-network.png','neon-scan.png'].map((file,i)=>['AS'+(12+i),file,'已接受的 imagegen 透明PNG；顯示素材512px寬；完整透明PNG']));
fxRows[4]=['FX05','場景背景','靜態場景；動態卡牌另列FX10–12'];
fxRows.push(['FX10','CP10 不同步漂浮','兩組sine疊加；週期5.9–8.7s；13–23px，另含3.5px側移／1.2°輕擺'],['FX11','CP10 呼吸光暈','獨立sine相位；靜態blur9px＋opacity／scale漲縮；不影響人物UI'],['FX12','CP10 卡牌淡入','載入後850ms；重播／暫停可控制；校準／reduce靜態；隱藏頁暫停']);
fxRows.push(['FX13','CP05/CP07反光','alpha遮罩白色掃亮；4.5秒錯開；进場完成後自動／可試播；校準／reduce停止'],['FX14','Rinne白色輪廓光','SourceAlpha向外膨脹3px＋5px柔光；opacity呼吸，週期1–12秒可調']);
function fillTable(id,rows){for(const row of rows){const tr=document.createElement('tr');for(const text of row){const td=document.createElement('td');td.textContent=text;tr.append(td)}$(id).append(tr)}}fillTable('#cp-table',cpRows);fillTable('#as-table',asRows);fillTable('#fx-table',fxRows);

// All motions share a clock. Layout transforms belong to the outer motion layers.

let rinneStartX=75,rinneFadePeriod=.85;
function setRinneStartX(value){
 const n=Number(value);if(value===''||!Number.isFinite(n))return;
 rinneStartX=Math.max(0,Math.min(100,n));
 $('#rinne-start-x').value=rinneStartX;$('#rinne-start-number').value=rinneStartX;
 $('#rinne-start-value').textContent=`x＝${rinneStartX} → 50（中央）；滑動距離為畫面寬度的 ${Math.abs(rinneStartX-50)}%。`;
}
for(const id of ['rinne-start-x','rinne-start-number'])$('#'+id).addEventListener('input',e=>setRinneStartX(e.target.value));
$('#rinne-start-number').addEventListener('blur',()=>setRinneStartX(rinneStartX));
function setRinneFadePeriod(value){const n=Number(value);if(value===''||!Number.isFinite(n))return;rinneFadePeriod=Math.max(.1,Math.min(4,n));$('#rinne-fade-period').value=rinneFadePeriod;$('#rinne-fade-number').value=rinneFadePeriod;$('#entry-timing').textContent='Rinne滑動850ms、淡入'+Math.round(rinneFadePeriod*1000)+'ms；完整時間軸'+Math.max(990,Math.round(rinneFadePeriod*1000))+'ms。'}
for(const id of ['rinne-fade-period','rinne-fade-number'])$('#'+id).addEventListener('input',e=>setRinneFadePeriod(e.target.value));
$('#rinne-fade-number').addEventListener('blur',()=>setRinneFadePeriod(rinneFadePeriod));
window.rinneEntrySettings=()=>({startX:rinneStartX,endX:50,offsetPx:W*(rinneStartX-50)/100,fadePeriod:rinneFadePeriod});

const entrySpecs=[{id:'character-motion',x:0,width:941,side:'right',fade:true,delay:0,duration:850},{id:'CP05',x:0,width:397,side:'left',fade:true,delay:140,duration:650},{id:'one-motion',x:118,width:347,side:'left',fade:false,delay:320,duration:600},{id:'ten-motion',x:472,width:356,side:'right',fade:false,delay:390,duration:600}];let entryToken=0,entryAnimations=[];
function cancelEntry(final=true){entryToken++;for(const a of entryAnimations)a.cancel();entryAnimations=[];entryRunning=false;entered=final;for(const s of entrySpecs){const el=document.getElementById(s.id);el.classList.remove('entry-playing');el.style.transform='none';el.style.opacity='1'}stage.classList.add('entry-ready');updateButtons();syncBeauty()}
function entryOffset(s){if(s.id==='character-motion')return W*(rinneStartX-50)/100;return s.side==='right'?W-s.x+24:-(s.x+s.width+24)}
async function playEntry(only=null){if(!ready||cal||document.hidden)return;closeModal();cancelEntry(true);const all=only?entrySpecs.filter(s=>only.includes(s.id)):entrySpecs;const mediaReduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(mediaReduce||!$('#motion').checked){$('#entry-status').textContent='減少動態／動效關閉：直接顯示完成位置。';return}const token=entryToken;entryRunning=true;entered=false;updateButtons();stage.classList.add('entry-ready');const clock=document.timeline.currentTime;const timeline=only?all.map(s=>({...s,delay:0})):all;const total=Math.max(...timeline.map(s=>s.delay+Math.max(s.duration,s.id==='character-motion'?rinneFadePeriod*1000:0)));$('#entry-status').textContent='進場播放中（'+total+'ms）；遊戲按鈕暫停。';entryAnimations=timeline.flatMap(s=>{const el=document.getElementById(s.id);el.classList.add('entry-playing');const options={duration:s.duration,delay:s.delay,easing:'cubic-bezier(.22,.72,.2,1)',fill:'both'};let animations;
if(s.id==='character-motion'){animations=[el.animate([{transform:'translateX('+entryOffset(s)+'px)'},{transform:'translateX(0px)'}],options),el.animate([{opacity:0},{opacity:1}],{duration:rinneFadePeriod*1000,delay:s.delay,easing:'linear',fill:'both'})]}
else animations=[el.animate([{transform:'translateX('+entryOffset(s)+'px)',opacity:s.fade?0:1},{transform:'translateX(0px)',opacity:1}],options)];
for(const a of animations)if(Number.isFinite(clock))a.startTime=clock;return animations});syncBeauty();try{await Promise.all(entryAnimations.map(a=>a.finished));if(token!==entryToken)return;cancelEntry(true);$('#entry-status').textContent='進場完成；最終位置固定，可操作遊戲。';log('進場完成，可操作招募、活動與詳情。')}catch(e){/* cancelled runs never restart */}}
$('#replay-entry').onclick=()=>{if(!ready||cal)return;if(selectedActivity!==0)setActivity(0);playEntry()};$('#finish-entry').onclick=()=>{if(!ready)return;cancelEntry(true);$('#entry-status').textContent='已取消進場並顯示完成位置。'};$('#preview-character').onclick=()=>playEntry(['character-motion']);$('#preview-title').onclick=()=>playEntry(['CP05']);$('#preview-buttons').onclick=()=>playEntry(['one-motion','ten-motion']);window.playEntry=playEntry;window.entrySpecs=entrySpecs;window.entryOffset=entryOffset;

// FX10/11/12: bounded, phase-independent ambient motion on one shared clock.
// Surface sheen and white alpha contour have independent effect layers.
const beautySettings={sheen:true,rim:true,period:3.2};let beautyVisible=true,beautyDisposed=false,shinePreview=[],shineToken=0;
function beautyBlockReason(){
 if(!ready)return '素材尚在載入';if(cal)return '文字校準模式開啟，請先關閉校準';
 if(document.hidden)return '分頁隱藏';if(beautyDisposed)return '頁面已離開';if(!beautyVisible)return '預覽畫面不在可見範圍';
 if(selectedActivity!==0)return '目前不是 Rinne 活動';if(!$('#motion').checked)return '總動效已關閉';
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return '系統已啟用減少動態';return '';
}
function syncBeauty(){
 const reason=beautyBlockReason(),active=!reason;
 if(!active)cancelShinePreview();
 const rimActive=active&&beautySettings.rim,sheenActive=active&&entered&&beautySettings.sheen&&shinePreview.length===0;
 stage.classList.toggle('beauty-active',rimActive);stage.classList.toggle('sheen-active',sheenActive);
 stage.classList.toggle('rim-visible',beautySettings.rim&&selectedActivity===0);
 stage.style.setProperty?.('--rim-period',beautySettings.period+'s');
 window.RinneLighting?.sync({rimActive,sheenActive,period:beautySettings.period});
 const rimLabel=rimActive?'輪廓光：呼吸播放中（'+beautySettings.period+' 秒）':beautySettings.rim?'輪廓光：靜態':'輪廓光：關閉';
 const sheenLabel=shinePreview.length?'反光：試播中':sheenActive?'反光：自動掃亮中':!beautySettings.sheen?'反光：關閉':!entered?'反光：等待進場完成':'反光：暫停';
 $('#beauty-status').textContent=rimLabel+'；'+sheenLabel+(reason?'。暫停原因：'+reason+'。':'。');
 $('#preview-shine').disabled=!!reason||!entered;
 $('#preview-shine').title=reason||(!entered?'等待進場完成':'立即試播一次反光');
}
function cancelShinePreview(){shineToken++;for(const a of shinePreview)a.cancel();shinePreview=[]}
function setRimPeriod(value){const n=Number(value);if(value===''||!Number.isFinite(n))return;beautySettings.period=Math.max(1,Math.min(12,n));$('#rim-period').value=beautySettings.period;$('#rim-period-number').value=beautySettings.period;stage.style.setProperty?.('--rim-period',beautySettings.period+'s');syncBeauty()}
for(const id of ['rim-period','rim-period-number'])$('#'+id).addEventListener('input',e=>setRimPeriod(e.target.value));
$('#rim-period-number').addEventListener('blur',()=>setRimPeriod(beautySettings.period));
for(const [id,key] of [['beauty-sheen','sheen'],['beauty-rim','rim']])$('#'+id).addEventListener('change',e=>{beautySettings[key]=e.target.checked;if(key==='sheen')cancelShinePreview();syncBeauty()});
$('#preview-shine').onclick=async()=>{
 if(beautyBlockReason()||!entered){syncBeauty();return}
 cancelShinePreview();window.RinneLighting?.sync({rimActive:beautySettings.rim,sheenActive:false,period:beautySettings.period});const token=shineToken;stage.classList.remove('sheen-active');
 shinePreview=['shine-one','shine-ten','shine-title'].map((id,i)=>document.getElementById(id).animate([{transform:'translateX(-210%) skewX(-18deg)',opacity:0},{opacity:.75,offset:.18},{opacity:.75,offset:.78},{transform:'translateX(310%) skewX(-18deg)',opacity:0}],{duration:1100,delay:i*170,easing:'linear',fill:'both'}));syncBeauty();
 try{await Promise.all(shinePreview.map(a=>a.finished));if(token!==shineToken)return;cancelShinePreview();syncBeauty()}catch(e){/* cancellation cannot restart stale preview */}
};
$('#calibrate').addEventListener('change',syncBeauty);$('#motion').addEventListener('change',syncBeauty);
document.addEventListener('visibilitychange',syncBeauty);addEventListener('pagehide',()=>{beautyDisposed=true;cancelShinePreview();syncBeauty()});addEventListener('pageshow',()=>{beautyDisposed=false;syncBeauty()});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',syncBeauty);
if(typeof IntersectionObserver!=='undefined')new IntersectionObserver(entries=>{beautyVisible=entries[0].isIntersecting;syncBeauty()},{threshold:0}).observe(viewport);
window.beautyFXState=()=>({...beautySettings,previewing:shinePreview.length,active:stage.classList.contains('beauty-active'),sheenActive:stage.classList.contains('sheen-active')});
syncBeauty();

const cardSpecs = [
 {id:'AS12',file:'neon-cube.png',name:'粉紫立方體',x:6,y:218,w:238,h:267,amp:15,period:5.9,phase:0.35,rotation:-3,depth:.94},
 {id:'AS13',file:'neon-orbit.png',name:'粉紫軌道環',x:-32,y:875,w:255,h:319,amp:21,period:7.3,phase:2.1,rotation:5,depth:.84},
 {id:'AS14',file:'neon-data.png',name:'青藍資料卡',x:718,y:428,w:220,h:330,amp:18,period:6.7,phase:4.2,rotation:3,depth:.88},
 {id:'AS15',file:'neon-mesh.png',name:'粉紫三角網格',x:-25,y:470,w:214,h:321,amp:14,period:8.1,phase:1.3,rotation:-8,depth:.72},
 {id:'AS16',file:'neon-spectrum.png',name:'青藍波形頻譜',x:730,y:829,w:218,h:327,amp:23,period:7.9,phase:5.5,rotation:5,depth:.85},
 {id:'AS17',file:'neon-network.png',name:'粉紫節點網路',x:514,y:214,w:172,h:258,amp:13,period:6.3,phase:3.6,rotation:-5,depth:.62},
 {id:'AS18',file:'neon-scan.png',name:'青藍同心掃描環',x:574,y:1058,w:197,h:296,amp:17,period:8.7,phase:0.9,rotation:8,depth:.76}
];
const cardSettings={visible:true,drift:true,glow:true,paused:false,speed:1,amplitude:1,strength:1};
const cardsLayer=$('#CP10'),cardNodes=[];
for(const s of cardSpecs){
 const card=document.createElement('div');card.className='neon-card';card.dataset.asset=s.id;
 Object.assign(card.style,{left:s.x+'px',top:s.y+'px',width:s.w+'px',height:s.h+'px'});
 const halo=document.createElement('img');halo.className='card-halo';halo.src='assets/'+s.file;halo.alt='';
 const face=document.createElement('img');face.className='card-face';face.src=halo.src;face.alt='';
 card.append(halo,face);cardsLayer.append(card);cardNodes.push({card,halo,face,spec:s});
}
let cardRAF=null,cardTime=0,cardReveal=0,cardLast=null,cardLastRender=-Infinity,cardDisposed=false,cardInView=true;
const cardMedia=matchMedia('(prefers-reduced-motion: reduce)');
function sampleCard(s,t){
 const a=2*Math.PI*t/s.period+s.phase;
 const y=s.amp*cardSettings.amplitude*(.72*Math.sin(a)+.28*Math.sin(a*.617+s.phase*1.83));
 const x=3.5*cardSettings.amplitude*Math.sin(a*.43+s.phase);
 const roll=1.2*cardSettings.amplitude*Math.sin(a*.71+1.2);
 const pulse=.5+.5*Math.sin(2*Math.PI*t/(s.period*1.21)+s.phase+1.7);
 return {x,y,roll,pulse};
}
function renderCards(t,neutral=false){
 for(const {card,halo,face,spec:s} of cardNodes){
  const v=sampleCard(s,t),move=cardSettings.drift&&!neutral;
  card.style.transform=`translate3d(${move?v.x.toFixed(2):0}px,${move?v.y.toFixed(2):0}px,0) rotate(${(s.rotation+(move?v.roll:0)).toFixed(2)}deg)`;
  const glow=cardSettings.glow?cardSettings.strength:0;
  const pulse=neutral?.5:v.pulse;
  halo.style.opacity=((.08+.42*pulse)*glow*s.depth).toFixed(3);
  halo.style.transform=`scale(${(1+.065*pulse*glow).toFixed(4)})`;
  face.style.opacity=(s.depth*(.90+.10*(glow?pulse:.5))).toFixed(3);
 }
 cardsLayer.style.opacity=neutral?'1':String(Math.min(1,cardReveal/.85));
}
function cardBlockReason(){
 if(!ready)return '等待卡牌素材載入。';
 if(cardDisposed||document.hidden||!cardInView)return '畫面不可見，卡牌動畫已暫停。';
 if(!cardSettings.visible)return '卡牌已隱藏。';
 if(selectedActivity!==0)return '其他活動：卡牌已隱藏。';
 if(cal)return '文字校準中：卡牌靜止。';
 if(cardMedia.matches||!$('#motion').checked)return '減少動態／總動效關閉：顯示靜態卡牌。';
 if(cardSettings.paused)return '卡牌已暫停，保留目前位置與亮度。';
 if(!cardSettings.drift&&!cardSettings.glow)return '漂浮與呼吸發光關閉：顯示靜態卡牌。';
 return '';
}
function stopCards(){if(cardRAF!==null)cancelAnimationFrame(cardRAF);cardRAF=null;cardLast=null;cardsLayer.classList.remove('cards-playing')}
function cardFrame(now){
 cardRAF=null;if(cardBlockReason()){syncCards();return}
 if(cardLast!==null){const dt=Math.min(.08,Math.max(0,(now-cardLast)/1000));cardTime+=dt*cardSettings.speed;cardReveal+=dt}
 cardLast=now;
 // Transform/opacity only, capped at 30 fps; blur is static on small cached images.
 if(now-cardLastRender>=1000/30){renderCards(cardTime);cardLastRender=now}
 cardRAF=requestAnimationFrame(cardFrame);
}
function syncCards(){
 syncBeauty();
 cardsLayer.hidden=!cardSettings.visible||selectedActivity!==0;
 const reason=cardBlockReason();
 if(reason){stopCards();if(cal||cardMedia.matches||!$('#motion').checked||(!cardSettings.drift&&!cardSettings.glow)){cardReveal=.85;renderCards(cardTime,true)}$('#card-status').textContent=reason;return}
 if(cardRAF===null){cardLast=null;cardLastRender=-Infinity;cardsLayer.classList.add('cards-playing');cardRAF=requestAnimationFrame(cardFrame)}
 $('#card-status').textContent='7 張卡牌播放中：獨立 sine 漂浮、光暈呼吸。';
}
for(const [id,key] of [['cards-visible','visible'],['cards-drift','drift'],['cards-glow','glow']]){
 $( '#'+id).addEventListener('change',e=>{cardSettings[key]=e.target.checked;renderCards(cardTime);syncCards()});
}
for(const [id,key] of [['cards-speed','speed'],['cards-amplitude','amplitude'],['cards-strength','strength']]){
 $('#'+id).addEventListener('input',e=>{cardSettings[key]=Number(e.target.value);$('#'+id+'-value').textContent=Number(e.target.value).toFixed(1)+'×';renderCards(cardTime,cardMedia.matches||!$('#motion').checked||cal);syncCards()});
}
$('#cards-pause').onclick=()=>{cardSettings.paused=!cardSettings.paused;$('#cards-pause').textContent=cardSettings.paused?'繼續卡牌':'暫停卡牌';$('#cards-pause').setAttribute('aria-pressed',String(cardSettings.paused));syncCards()};
$('#cards-replay').onclick=()=>{stopCards();cardTime=0;cardReveal=0;cardSettings.paused=false;$('#cards-pause').textContent='暫停卡牌';$('#cards-pause').setAttribute('aria-pressed','false');renderCards(0);syncCards()};
$('#cards-reset').onclick=()=>{stopCards();Object.assign(cardSettings,{visible:true,drift:true,glow:true,paused:false,speed:1,amplitude:1,strength:1});for(const id of ['cards-visible','cards-drift','cards-glow'])$('#'+id).checked=true;for(const id of ['cards-speed','cards-amplitude','cards-strength']){$('#'+id).value=1;$('#'+id+'-value').textContent='1.0×'}$('#cards-pause').textContent='暫停卡牌';$('#cards-pause').setAttribute('aria-pressed','false');cardTime=0;cardReveal=0;renderCards(0);syncCards()};
$('#calibrate').addEventListener('change',syncCards);$('#motion').addEventListener('change',syncCards);
document.addEventListener('visibilitychange',syncCards);
addEventListener('pagehide',()=>{cardDisposed=true;stopCards()});addEventListener('pageshow',()=>{cardDisposed=false;syncCards()});
cardMedia.addEventListener('change',()=>{if(cardMedia.matches)cancelEntry(true);syncCards()});
if(typeof IntersectionObserver!=='undefined')new IntersectionObserver(entries=>{cardInView=entries[0].isIntersecting;syncCards()},{threshold:0}).observe(viewport);
window.cardSpecs=cardSpecs;window.sampleCard=sampleCard;
window.cardFXState=()=>({running:cardRAF!==null,time:cardTime,reveal:cardReveal,...cardSettings,reason:cardBlockReason()});
renderCards(0);syncCards();

// One portable snapshot of every configurable value; animation phases are transient.
let resolveSettingsReady,rejectSettingsReady;
const settingsReady=new Promise((resolve,reject)=>{resolveSettingsReady=resolve;rejectSettingsReady=reject});settingsReady.catch(()=>{});
function makeProjectSettings(){
 return {...makeCalibration(),schema:'game-ui-project-settings/1',editorVersion:'v1.2.2',parameters:{
  rinne:{startX:rinneStartX,fadeInSeconds:rinneFadePeriod},
  portrait:{...window.RinneRig?.settings},cards:{...cardSettings},lighting:{...beautySettings},
  ui:{motionEnabled:$('#motion').checked,overlayPercent:Number($('#overlay').value)||0,calibrationEnabled:cal,panelHidden:document.body.classList.contains('hidden-panel'),balance,selectedActivity,activeField}
 }};
}
function requireKeys(value,keys,path){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).sort().join('|')!==keys.slice().sort().join('|'))throw Error(path+' 欄位不完整或含未知參數');
}
function requireBool(value,path){if(typeof value!=='boolean')throw Error(path+' 必須是 true 或 false');return value}
function requireNumber(value,min,max,path,integer=false){if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max||(integer&&!Number.isInteger(value)))throw Error(path+' 必須介於 '+min+'–'+max+(integer?'，且為整數':''));return value}
function validateProjectSettings(data){
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('JSON 必須為設定物件');
 const legacy=data.schema==='game-ui-text-calibration/1';
 if(!legacy&&data.schema!=='game-ui-project-settings/1')throw Error('不支援的 JSON 格式；請選擇本頁匯出的設定檔');
 const nextFields=validateTextCalibration({...data,schema:'game-ui-text-calibration/1'});
 if(legacy)return {fields:nextFields,parameters:makeProjectSettings().parameters,legacy:true};
 const p=structuredClone(data.parameters);if(p&& !Object.hasOwn(p,'portrait')&&!['v1.1','v1.2','v1.2.1','v1.2.2'].includes(data.editorVersion))p.portrait={...window.RinneRig.settings};requireKeys(p,['rinne','portrait','cards','lighting','ui'],'parameters');
 requireKeys(p.portrait,['enabled','paused','amplitude','speed','gestureSpeed','track','autoTalk'],'人物動作');for(const key of ['enabled','paused','track','autoTalk'])requireBool(p.portrait[key],'人物 '+key);requireNumber(p.portrait.amplitude,0,150,'人物幅度');requireNumber(p.portrait.speed,.3,1.7,'人物速度');requireNumber(p.portrait.gestureSpeed,.25,4,'比手速度');
 requireKeys(p.rinne,['startX','fadeInSeconds'],'Rinne');requireNumber(p.rinne.startX,0,100,'Rinne 起點');requireNumber(p.rinne.fadeInSeconds,.1,4,'Fade in 秒數');
 requireKeys(p.cards,['visible','drift','glow','paused','speed','amplitude','strength'],'卡牌');
 for(const key of ['visible','drift','glow','paused'])requireBool(p.cards[key],'卡牌 '+key);
 requireNumber(p.cards.speed,.4,1.8,'卡牌速度');requireNumber(p.cards.amplitude,0,2,'漂浮幅度');requireNumber(p.cards.strength,0,1.6,'卡牌光暈');
 requireKeys(p.lighting,['sheen','rim','period'],'照明');requireBool(p.lighting.sheen,'反光開關');requireBool(p.lighting.rim,'輪廓光開關');requireNumber(p.lighting.period,1,12,'輪廓光週期');
 requireKeys(p.ui,['motionEnabled','overlayPercent','calibrationEnabled','panelHidden','balance','selectedActivity','activeField'],'介面');
 for(const key of ['motionEnabled','calibrationEnabled','panelHidden'])requireBool(p.ui[key],'介面 '+key);
 requireNumber(p.ui.overlayPercent,0,100,'疊圖透明度');requireNumber(p.ui.balance,0,999999999,'示範水晶餘額',true);requireNumber(p.ui.selectedActivity,0,2,'活動選擇',true);
 if(typeof p.ui.activeField!=='string'||!Object.hasOwn(baseline,p.ui.activeField))throw Error('文字校準選中欄位不符');
 return {fields:nextFields,parameters:structuredClone(p),legacy:false};
}
function importProjectSettings(data){
 // Validate every section before cancelling or changing any current setting.
 const next=validateProjectSettings(data),p=next.parameters;
 cancelRun();closeModal();cancelEntry(true);stopCards();cancelShinePreview();
 fields=next.fields;applyFields();drag=null;
 setRinneStartX(p.rinne.startX);setRinneFadePeriod(p.rinne.fadeInSeconds);
 window.RinneRig?.apply(p.portrait);Object.assign(cardSettings,p.cards);Object.assign(beautySettings,p.lighting);
 for(const [id,key] of [['cards-visible','visible'],['cards-drift','drift'],['cards-glow','glow']])$('#'+id).checked=cardSettings[key];
 for(const [id,key] of [['cards-speed','speed'],['cards-amplitude','amplitude'],['cards-strength','strength']]){$('#'+id).value=cardSettings[key];$('#'+id+'-value').textContent=cardSettings[key].toFixed(1)+'×'}
 $('#cards-pause').textContent=cardSettings.paused?'繼續卡牌':'暫停卡牌';$('#cards-pause').setAttribute('aria-pressed',String(cardSettings.paused));
 $('#beauty-sheen').checked=beautySettings.sheen;$('#beauty-rim').checked=beautySettings.rim;setRimPeriod(beautySettings.period);
 cal=p.ui.calibrationEnabled;$('#calibrate').checked=cal;stage.classList.toggle('calibrating',cal);for(const node of Object.values(nodes))node.tabIndex=cal?0:-1;
 $('#motion').checked=p.ui.motionEnabled;document.body.dataset.motion=p.ui.motionEnabled?'on':'off';
 if(!p.ui.motionEnabled)for(const a of stage.getAnimations({subtree:true}))a.cancel();
 selectedActivity=p.ui.selectedActivity;stage.classList.toggle('alt',selectedActivity!==0);$('#alt-title').textContent=activities[selectedActivity].name;$('#alt-img').src=activities[selectedActivity].image;
 for(const list of [$('#CP09'),$('#dots')])[...list.children].forEach((b,i)=>b.setAttribute('aria-selected',String(i===selectedActivity)));
 setBalance(p.ui.balance);selectField(p.ui.activeField);
 $('#overlay').value=p.ui.overlayPercent;$('#source-overlay').style.opacity=p.ui.overlayPercent/100;$('#overlay-value').textContent=p.ui.overlayPercent+'%';
 document.body.classList.toggle('hidden-panel',p.ui.panelHidden);$('#toggle-panel').textContent=p.ui.panelHidden?'顯示驗證面板':'隱藏驗證面板';resize();
 cardTime=0;cardReveal=.85;renderCards(0,cal||cardMedia.matches||!p.ui.motionEnabled);syncCards();syncBeauty();updateButtons();window.RinneRig?.sync();
 const message=next.legacy?'已匯入舊版文字 JSON；文字已更新。舊檔不含動效參數，其他設定保留目前值。':'已完整匯入：文字、Rinne入場／淡入、卡牌、反光、輪廓光及介面設定均已更新。';
 $('#cal-status').textContent=message;log(message);return makeProjectSettings();
}
// Preserve the old public entry point while accepting both supported formats.
function importCalibration(data){return importProjectSettings(data)}
window.importCalibration=importCalibration;window.makeProjectSettings=makeProjectSettings;window.importProjectSettings=importProjectSettings;

async function init(){try{await window.RinneRig?.ready;await document.fonts.load('28px ProjectFont','招募霓光領航者0123456789');await document.fonts.ready;if(!document.fonts.check('28px ProjectFont','招募0123456789'))throw Error('ProjectFont 載入失敗');await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>i.decode()));ready=true;window.RinneRig?.sync();if(window.RINNE_SETTINGS)importProjectSettings(window.RINNE_SETTINGS);syncCards();$('#calibrate').disabled=false;updateButtons();resize();if(!cal&&selectedActivity===0)playEntry();log('素材與專案設定已載入。');$('#game-load-status').hidden=true;resolveSettingsReady()}catch(e){ready=false;rejectSettingsReady(e);updateButtons();$('#status').textContent='載入失敗：'+e.message+'。校準與遊戲操作已停用。';$('#game-load-status').hidden=false;$('#game-load-status').textContent=$('#status').textContent}}init();window.uiState=()=>({ready,cal,busy,balance,selectedActivity,scale,entered,entryRunning});
