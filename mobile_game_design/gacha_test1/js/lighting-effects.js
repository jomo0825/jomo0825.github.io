/* FX13–14: independent WAAPI loops; no dependency on CSS animation restart. */
(()=>{'use strict';const rim=document.getElementById('rinne-rim-canvas'),beams=['shine-one','shine-ten','shine-title'].map(id=>document.getElementById(id));
let contour=null,sheens=[],lastPeriod=null;
function stopRim(){contour?.cancel();contour=null;lastPeriod=null}
function stopSheen(){for(const a of sheens)a.cancel();sheens=[]}
function alive(a){return a&&a.playState!=='idle'&&a.playState!=='finished'&&!a.cancelled}
function sync({rimActive,sheenActive,period}){
 if(!rimActive)stopRim();else if(!alive(contour)||lastPeriod!==period){stopRim();contour=rim.animate([{opacity:.14,offset:0},{opacity:.8,offset:.5},{opacity:.14,offset:1}],{duration:period*1000,easing:'ease-in-out',iterations:Infinity});lastPeriod=period}
 if(!sheenActive)stopSheen();else if(sheens.length!==3||sheens.some(a=>!alive(a))){stopSheen();sheens=beams.map((el,i)=>el.animate([
 {transform:'translateX(-210%) skewX(-18deg)',opacity:0,offset:0},
 {transform:'translateX(-145%) skewX(-18deg)',opacity:.7,offset:.03},
 {transform:'translateX(310%) skewX(-18deg)',opacity:.7,offset:.24},
 {transform:'translateX(310%) skewX(-18deg)',opacity:0,offset:.27},
 {transform:'translateX(310%) skewX(-18deg)',opacity:0,offset:1}],{duration:4500,delay:i*170,easing:'linear',iterations:Infinity}))}
}
window.RinneLighting={sync,stop:()=>{stopRim();stopSheen()},state:()=>({rimRunning:alive(contour),sheenCount:sheens.filter(alive).length,period:lastPeriod})};
})();
