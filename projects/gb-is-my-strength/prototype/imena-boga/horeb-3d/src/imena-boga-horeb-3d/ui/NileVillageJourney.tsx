import {useEffect,useRef,useState} from 'react';
import {NILE_VILLAGE_STEPS,NILE_VILLAGE_START,
  nileVillageDistance,nileVillageMayInteract} from '../data/nileVillageQuest';
import type {NileVillageController,VillageDirection} from '../engine/NileVillage3D';
/** A playable, visibly staged prologue. Separate from established Nile shoreline
 * and independent of the research/field-study mastery registry. */
export function NileVillageJourney({reducedMotion=false,onContinue}:{
 reducedMotion?:boolean;onContinue?:()=>void;
}){
 const canvas=useRef<HTMLCanvasElement>(null),engine=useRef<NileVillageController|null>(null);
 const startButton=useRef<HTMLButtonElement>(null),actionButton=useRef<HTMLButtonElement>(null);
 const [ready,setReady]=useState(false),[failed,setFailed]=useState(false);
 const [active,setActive]=useState(false),[step,setStep]=useState(0);
 const [position,setPosition]=useState<{x:number;z:number}>({x:NILE_VILLAGE_START.x,z:NILE_VILLAGE_START.z});
 const [message,setMessage]=useState('');
 const site=NILE_VILLAGE_STEPS[step],finished=step>=NILE_VILLAGE_STEPS.length;
 const distance=site?nileVillageDistance(position.x,position.z,site):0;
 const near=!!site&&distance<=site.reach;
 useEffect(()=>{
   const c=canvas.current;if(!c)return;let disposed=false;setReady(false);setFailed(false);
   import('../engine/NileVillage3D').then(({createNileVillage3D})=>{
     if(disposed)return;
     const control=createNileVillage3D(c,reducedMotion,(x,z)=>setPosition({x,z}));
     if(disposed){control.dispose();return;}
     engine.current=control;control.setStep(step);setReady(true);
   }).catch(err=>{console.error('W15 village scene init failed',err);if(!disposed)setFailed(true);});
   return ()=>{disposed=true;engine.current?.dispose();engine.current=null;};
 // New journey is intentionally independent of legacy Nile scene remount.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[reducedMotion]);
 useEffect(()=>{engine.current?.setStep(step);},[step]);
 useEffect(()=>{
   if(!active)return;
   const before=document.body.style.overflow;document.body.style.overflow='hidden';
   return ()=>{document.body.style.overflow=before;};
 },[active]);
 const close=()=>{
   engine.current?.stop();setActive(false);
   setTimeout(()=>startButton.current?.focus(),0);
 };
 const start=()=>{if(!ready||failed||!engine.current)return;engine.current.start();setActive(true);setMessage('');};
 const interact=()=>{
   if(!active||failed||!engine.current||finished)return;
   const p=engine.current.getPosition();
   if(!nileVillageMayInteract(p.x,p.z,step))return;
   const completed=NILE_VILLAGE_STEPS[step];
   setMessage(completed.description);
   setStep(s=>s+1);
 };
 useEffect(()=>{
   if(!active)return;
   const handler=(e:KeyboardEvent)=>{
     if(e.key==='Escape'){e.preventDefault();close();}
     if(e.key.toLowerCase()==='e'&&!e.repeat &&
        !(e.target instanceof HTMLInputElement)&&
        !(e.target instanceof HTMLTextAreaElement)){
       e.preventDefault();actionButton.current?.click();
     }
   };
   window.addEventListener('keydown',handler);
   return ()=>window.removeEventListener('keydown',handler);
 // Action button always reads current state; close only sets local state.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[active]);
 const directional=(dir:VillageDirection,label:string)=>(
   <button type="button" key={dir} data-testid={'nile-village-move-'+dir}
     aria-label={{forward:'Вперёд',backward:'Назад',left:'Влево',right:'Вправо'}[dir]}
     className="w-12 h-12 select-none touch-none rounded-md border border-amber-200/50 bg-black/75 text-parch font-bold text-xl shadow-lg active:bg-bronze/50"
     onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);engine.current?.setDirection(dir,true);}}
     onPointerUp={()=>engine.current?.setDirection(dir,false)}
     onPointerCancel={()=>engine.current?.setDirection(dir,false)}
     onLostPointerCapture={()=>engine.current?.setDirection(dir,false)}>{label}</button>
 );
 return <div data-testid="nile-village-journey"
   className={active?'fixed inset-0 z-[100] bg-[#4c4a3a]':'relative bg-[#372e24]'}>
   <div className={active?'absolute inset-0':'relative h-64 sm:h-80 overflow-hidden'}>
     <canvas ref={canvas} role="img" data-testid="nile-village-canvas"
       aria-label="Художественный трёхмерный жилой квартал у Нила: глинобитные дома, жители, тропа к зарослям"
       className={'block h-full w-full '+(active?'touch-none cursor-grab active:cursor-grabbing':'pointer-events-none')}/>
     {!active&&<div className="absolute inset-x-0 bottom-0 z-10 px-3 pb-3 pt-10 bg-gradient-to-t from-black/85 to-transparent flex flex-wrap justify-between gap-2 items-end">
       <div className="max-w-[65%] text-parch">
         <p className="text-xs uppercase tracking-widest text-amber-200">Интерактивная глава · Исх. 1:22–2:4</p>
         <p className="font-display text-xl sm:text-2xl">Из домов к берегу Нила</p>
       </div>
       <button ref={startButton} type="button" data-testid="nile-village-start"
         disabled={!ready||failed} onClick={start}
         className="rounded-md border border-amber-200 bg-[#35281f] px-4 py-3 font-semibold text-parch shadow-lg disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">
         {failed?'3D недоступно':ready?'Начать путь от домов':'Загрузка квартала…'}
       </button>
     </div>}
   </div>
   {active&&<>
     <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-3 pointer-events-none">
       <div className="pointer-events-auto max-w-[74%] rounded-xl border border-amber-200/35 bg-[#1e211e]/90 px-3 py-3 text-parch shadow-2xl">
         <div className="flex gap-2 text-[10px] uppercase tracking-widest text-amber-200">
           <span>Младенец Моисей</span><span data-testid="nile-village-progress">{Math.min(step+1,NILE_VILLAGE_STEPS.length)} / {NILE_VILLAGE_STEPS.length}</span>
         </div>
         <p className="font-display text-lg sm:text-2xl mt-1" data-testid="nile-village-objective">
           {finished?'Корзина укрыта · сестра наблюдает':site.title}
         </p>
         <p className="text-xs sm:text-sm text-parch/85 mt-1">
           {finished?'Продолжите библейскую историю: дочь фараона обнаруживает корзину.':
           'Подойдите к отмеченному человеку или месту, затем нажмите E / «Взаимодействовать».'}
         </p>
         {!finished&&<p data-testid="nile-village-distance" className="text-xs text-amber-100/95 mt-1">До цели: {distance.toFixed(1)} м · {site.source}</p>}
       </div>
       <button type="button" data-testid="nile-village-close" onClick={close}
         className="pointer-events-auto shrink-0 rounded-lg border border-parch/70 bg-black/85 px-3 py-3 text-parch text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">Вернуться</button>
     </div>
     <div className="absolute inset-x-3 bottom-3 flex justify-between items-end gap-3 pointer-events-none">
       <div className="pointer-events-auto flex sm:hidden flex-col items-center gap-1" aria-label="Сенсорное перемещение">
         {directional('forward','↑')}
         <div className="flex gap-1">{directional('left','←')}{directional('backward','↓')}{directional('right','→')}</div>
       </div>
       <div className="pointer-events-auto ml-auto flex flex-col items-end gap-2 max-w-[min(80%,340px)]">
         {message&&<p role="status" data-testid="nile-village-feedback" className="max-h-32 overflow-auto rounded-lg border border-amber-200/30 bg-black/85 text-parch px-3 py-2 text-xs sm:text-sm leading-relaxed">
           {message}
         </p>}
         {finished?<>
           <button type="button" data-testid="nile-village-finish" onClick={()=>{close();onContinue?.();}}
             className="rounded-lg bg-[#b38a4b] px-4 py-3 font-semibold text-[#17140f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
             Дальше: обнаружение младенца
           </button>
           <button type="button" data-testid="nile-village-replay"
             onClick={()=>{setStep(0);setMessage('');engine.current?.start();}}
             className="text-xs underline text-parch">Повторить маршрут</button>
         </>:<button ref={actionButton} type="button" data-testid="nile-village-interact"
           disabled={!near} onClick={interact}
           className="rounded-lg border border-amber-200 bg-[#342b1b]/95 px-4 py-3 font-semibold text-parch shadow-lg disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">
           {near?site.action:'Подойдите к месту'} · E
         </button>}
         <div className="rounded-md bg-black/65 text-parch/85 px-2 py-1 text-[10px] sm:text-xs">
           WASD / стрелки · мышь — осмотреться · E — действие
         </div>
       </div>
     </div>
   </>}
   {!active&&<div className="border-t border-amber-200/20 bg-[#30291f] px-4 py-3 text-xs leading-relaxed text-parch/85">
     Исх. 1:22; 2:1–4 · люди, постройки и тропа условны. Без насилия и вымышленных «найденных свидетельств».
     {failed&&<p role="status" className="mt-2">3D недоступно; текст эпизода можно прочитать ниже без потери содержания.</p>}
   </div>}
   {active&&site&&<span className="sr-only" data-testid="nile-village-source">
     {site.source}. {site.description} {site.qualification}
   </span>}
 </div>;
}
