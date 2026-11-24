import {useEffect,useRef,useState} from 'react';
import {NILE_VILLAGE_STEPS,NILE_VILLAGE_START,
  nileVillageDistance,nileVillageMayInteract,nileVillageGoalBearing,NILE_VILLAGE_APPROACHES,initialNileVillageQuest,cancelNileVillageAction,type NileVillageQuest} from '../data/nileVillageQuest';
import type {NileVillageController,VillageDirection} from '../engine/NileVillage3D';
/** A playable, visibly staged prologue. Separate from established Nile shoreline
 * and independent of the research/field-study mastery registry. */
export function NileVillageJourney({reducedMotion=false,onContinue}:{
 reducedMotion?:boolean;onContinue?:()=>void;
}){
 const canvas=useRef<HTMLCanvasElement>(null),engine=useRef<NileVillageController|null>(null);
 const startButton=useRef<HTMLButtonElement>(null),actionButton=useRef<HTMLButtonElement>(null);
 const [ready,setReady]=useState(false),[failed,setFailed]=useState(false);
 const [active,setActive]=useState(false);
 const [quest,setQuest]=useState(initialNileVillageQuest),questRef=useRef(quest);
 const step=quest.step,acting=quest.pending!==null;
 const [position,setPosition]=useState<{x:number;z:number;yaw:number}>({x:NILE_VILLAGE_START.x,z:NILE_VILLAGE_START.z,yaw:NILE_VILLAGE_START.yaw});
 const positionRef=useRef(position);
 const [message,setMessage]=useState('');
 const site=NILE_VILLAGE_STEPS[step],finished=step>=NILE_VILLAGE_STEPS.length;
 const distance=site?nileVillageDistance(position.x,position.z,site):0;
 const near=!!site&&nileVillageMayInteract(position.x,position.z,step);
 const bearing=site?nileVillageGoalBearing(position.x,position.z,position.yaw,near?site:NILE_VILLAGE_APPROACHES[step]):0;
 const heading=Math.abs(bearing)>Math.PI*.75?'позади':Math.abs(bearing)<Math.PI/8?'впереди':bearing>0?'слева':'справа';
 useEffect(()=>{
   const c=canvas.current;if(!c)return;let disposed=false;setReady(false);setFailed(false);setActive(false);
   import('../engine/NileVillage3D').then(({createNileVillage3D})=>{
     if(disposed)return;
     const updateQuest=(next:NileVillageQuest)=>{
      if(disposed)return;
      const prev=questRef.current;
      questRef.current=next;setQuest(next);
      if(next.step===prev.step+1)setMessage(NILE_VILLAGE_STEPS[prev.step].description);
     };
     const control=createNileVillage3D(c,reducedMotion,(x,z,yaw)=>{
      if(disposed)return;positionRef.current={x,z,yaw};setPosition({x,z,yaw});
     },updateQuest,cancelNileVillageAction(questRef.current),positionRef.current);
     if(disposed){control.dispose();return;}
     engine.current=control;setReady(true);
   }).catch(err=>{console.error('W15 village scene init failed',err);if(!disposed)setFailed(true);});
   return ()=>{disposed=true;engine.current?.dispose();engine.current=null;};
 // New journey is intentionally independent of legacy Nile scene remount.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[reducedMotion]);
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
   if(!active||failed||!engine.current||finished||acting)return;
   engine.current.beginAction(quest.revision,step);
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
       <div className="pointer-events-auto flex-1 min-w-0 max-w-[480px] rounded-xl border border-amber-200/35 bg-[#1e211e]/90 px-3 py-3 text-parch shadow-2xl">
         <div className="flex gap-2 text-[10px] uppercase tracking-widest text-amber-200">
           <span>Младенец Моисей</span><span data-testid="nile-village-progress">{step} / {NILE_VILLAGE_STEPS.length}</span>
         </div>
         <div aria-hidden="true" className="mt-1.5 flex gap-1">
           {NILE_VILLAGE_STEPS.map((s,i)=><span key={s.id} className={'h-0.5 flex-1 rounded-full '+(i<step?'bg-amber-200':i===step?'bg-amber-200/60':'bg-white/15')}/>)}
         </div>
         <p className="font-display text-lg sm:text-2xl mt-1" data-testid="nile-village-objective">
           {finished?'Корзина укрыта · сестра наблюдает':site.title}
         </p>
         <p className="text-xs sm:text-sm text-parch/85 mt-1">
           {finished?'Продолжите библейскую историю: дочь фараона обнаруживает корзину.':
           acting?'Подождите завершения действия.':near?'Цель рядом. Можно взаимодействовать.':'Следуйте к отметке на земле.'}
         </p>
         {acting&&<p role="status" data-testid="nile-village-acting" className="text-xs text-amber-100 mt-1">Действие выполняется…</p>}
         {!finished&&<div className="mt-2 flex items-center gap-2 text-xs text-amber-100/95">
           <span data-testid="nile-village-bearing" aria-label={'Цель '+heading} className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-amber-200/40">
             <svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" style={{transform:'rotate('+(-bearing*180/Math.PI)+'deg)'}}>
               <path d="M12 3 20 19 12 15 4 19Z" fill="currentColor"/>
             </svg>
           </span>
           <span data-testid="nile-village-distance">Цель {heading} · {distance.toFixed(1)} м<br/>{site.source}</span>
         </div>}
       </div>
       <button type="button" data-testid="nile-village-close" onClick={close}
         className="pointer-events-auto shrink-0 rounded-lg border border-parch/70 bg-black/85 px-3 py-3 text-parch text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">Вернуться</button>
     </div>
     <div className="absolute inset-x-3 bottom-3 flex justify-between items-end gap-3 pointer-events-none">
       <div className="pointer-events-auto flex sm:hidden flex-col items-center gap-1" aria-label="Сенсорное перемещение">
         {directional('forward','↑')}
         <div className="flex gap-1">{directional('left','←')}{directional('backward','↓')}{directional('right','→')}</div>
       </div>
       <div className="pointer-events-auto ml-auto flex flex-col items-end gap-2 min-w-0 max-w-[340px]">
         {message&&<p role="status" data-testid="nile-village-feedback" className="max-h-20 sm:max-h-32 overflow-auto rounded-lg border border-amber-200/30 bg-black/85 text-parch px-3 py-2 text-xs sm:text-sm leading-relaxed">
           {message}
         </p>}
         {finished?<>
           <button type="button" data-testid="nile-village-finish" onClick={()=>{close();onContinue?.();}}
             className="rounded-lg bg-[#b38a4b] px-4 py-3 font-semibold text-[#17140f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
             Дальше: обнаружение младенца
           </button>
           <button type="button" data-testid="nile-village-replay"
             onClick={()=>{engine.current?.restart();setMessage('');}}
             className="text-xs underline text-parch">Повторить маршрут</button>
         </>:<button ref={actionButton} type="button" data-testid="nile-village-interact"
           disabled={!near||acting} aria-busy={acting} onClick={interact}
           className="rounded-lg border border-amber-200 bg-[#342b1b]/95 px-4 py-3 font-semibold text-parch shadow-lg disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">
           {acting?'Действие выполняется…':near?site.action:'Подойдите к месту'} · E
         </button>}
         <div className="rounded-md bg-black/65 text-parch/85 px-2 py-1 text-[10px] sm:text-xs">
           <span className="sm:hidden">Стрелки — идти · свайп — обзор</span><span className="hidden sm:inline">WASD / стрелки · мышь — обзор · E — действие</span>
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
