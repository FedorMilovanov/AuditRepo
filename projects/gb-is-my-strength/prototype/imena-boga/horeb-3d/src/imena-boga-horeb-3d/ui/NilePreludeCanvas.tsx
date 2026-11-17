import { useEffect, useRef, useState } from 'react';
import type { NileDirection, NileMoment, NilePreludeControl, NileView } from '../engine/NilePrelude';

/** W10: one real shoreline geometry with a bounded, grounded pedestrian
 * camera. Existing cinematic shots remain available as an optional view.
 * No legacy/Horeb checkpoint, scene material or Exhibit registry mutation.
 */
export function NilePreludeCanvas({ moment = 'basket', reducedMotion = false }: { moment?: NileMoment; reducedMotion?: boolean }) {
  const ref=useRef<HTMLCanvasElement>(null);
  const controller=useRef<NilePreludeControl|null>(null);
  const viewRef=useRef<NileView>('wide');
  const [view,setView]=useState<NileView>('wide');
  const [failed,setFailed]=useState(false);
  const [exploring,setExploring]=useState(false);
  useEffect(()=>{
    const canvas=ref.current;
    if(!canvas)return;
    let disposed=false;
    const reduced=reducedMotion||(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false);
    import('../engine/NilePrelude').then(({createNilePrelude})=>{
      if(disposed)return;
      const scene=createNilePrelude(canvas,reduced,moment);
      controller.current=scene;
      if(viewRef.current!=='wide')scene.setView(viewRef.current);
    }).catch(()=>{if(!disposed)setFailed(true);});
    return ()=>{
      disposed=true;
      controller.current?.dispose();
      controller.current=null;
    };
  },[moment,reducedMotion]);
  useEffect(()=>{
    if(!exploring)return;
    const prior=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return ()=>{document.body.style.overflow=prior;};
  },[exploring]);
  const discovery=moment==='discovery';
  const toggleShot=()=>{
    const next:NileView=viewRef.current==='wide'?'close':'wide';
    viewRef.current=next;
    controller.current?.setView(next);
    setView(next);
  };
  const toggleExplore=(enabled:boolean)=>{
    controller.current?.setExplore(enabled);
    setExploring(enabled);
  };
  const movementButton=(direction:NileDirection,label:string)=>(
    <button type="button" key={direction} aria-label={{forward:'Идти вперёд',backward:'Идти назад',left:'Шаг влево',right:'Шаг вправо'}[direction]}
      data-testid={`nile-move-${direction}`}
      onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);controller.current?.setMovement(direction,true);}}
      onPointerUp={()=>controller.current?.setMovement(direction,false)}
      onPointerCancel={()=>controller.current?.setMovement(direction,false)}
      onLostPointerCapture={()=>controller.current?.setMovement(direction,false)}
      className="select-none touch-none w-14 h-14 sm:w-16 sm:h-16 rounded-lg border border-parch/60 bg-black/70 text-parch text-xl font-bold shadow-lg active:bg-bronze/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">{label}</button>
  );
  return <div data-testid="nile-viewport"
    className={`bg-[#314e54] overflow-hidden ${exploring
      ? 'fixed inset-0 z-[90] !w-screen !h-[100dvh]'
      : `relative w-full ${discovery?'h-56 sm:h-80':'h-48 sm:h-64'}`}`}
    aria-label={discovery
      ? 'Исследуемый берег Нила: дочь фараона, служанки и корзина среди папируса'
      : 'Исследуемый берег Нила: корзина с младенцем среди папируса'}>
    <canvas ref={ref} data-testid={discovery?'moses-nile-discovery-3d':'moses-nile-3d'}
      className={`w-full h-full block ${exploring?'touch-none cursor-grab active:cursor-grabbing':''}`}
      role="img" aria-label={discovery
        ? 'Исход 2:5–6. Трёхмерный берег, три условных силуэта и корзина'
        : 'Исход 2:3. Трёхмерная береговая полоса и корзина у тростника'} />
    {failed && <p role="status" className="absolute inset-0 grid place-items-center px-4 text-center bg-[#2d4042] text-parch">
      Трёхмерная локация недоступна на этом устройстве. Текст источника сохранён в режиме чтения.
    </p>}
    {!failed && !exploring && <div className="absolute left-3 bottom-3 z-10 flex flex-wrap gap-2">
      <button type="button" data-testid="nile-explore-start" onClick={()=>toggleExplore(true)}
        className="rounded-sm border border-parch/65 bg-black/80 px-3 py-2 text-sm font-semibold text-parch shadow-md hover:bg-black/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">
        Исследовать берег в 3D
      </button>
      {discovery && <button type="button" data-testid="moses-nile-shot-toggle"
        aria-pressed={view==='close'} onClick={toggleShot}
        className="rounded-sm border border-parch/40 bg-black/70 px-3 py-2 text-xs font-semibold text-parch shadow-md hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">
        {view==='close'?'Общий план':'Крупный план'}
      </button>}
    </div>}
    {exploring && !failed && <>
      <div className="absolute left-3 right-3 top-3 z-20 flex items-start justify-between gap-3 pointer-events-none">
        <div className="max-w-[65%] rounded-lg bg-black/75 border border-parch/25 px-3 py-2 text-parch shadow-lg">
          <p className="font-semibold text-base">Берег Нила · {discovery?'обнаружение':'младенец'}</p>
          <p className="text-xs leading-snug text-parch/90">WASD / стрелки — идти; перетаскивание — осмотреться. Доступная береговая полоса ограничена водой и сценой.</p>
        </div>
        <button type="button" data-testid="nile-explore-close" onClick={()=>toggleExplore(false)}
          className="pointer-events-auto shrink-0 rounded-lg bg-black/80 border border-parch/70 px-3 py-3 text-sm font-semibold text-parch shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">
          Вернуться
        </button>
      </div>
      <div className="absolute bottom-6 left-4 z-20 flex flex-col gap-1 items-center sm:bottom-8 sm:left-8" aria-label="Сенсорное управление перемещением">
        {movementButton('forward','↑')}
        <div className="flex gap-1">
          {movementButton('left','←')}
          {movementButton('backward','↓')}
          {movementButton('right','→')}
        </div>
      </div>
      <p className="absolute bottom-7 right-4 max-w-36 text-right text-xs text-parch/95 bg-black/75 rounded-md px-2 py-2 pointer-events-none">
        Художественная реконструкция · {discovery?'Исх. 2:5–6':'Исх. 2:3–4'}
      </p>
    </>}
    {!exploring && <span className="absolute right-2 top-2 text-[10px] text-parch/90 bg-black/65 px-2 py-1 rounded-sm pointer-events-none">
      <span className="hidden sm:inline">Художественная реконструкция · </span>{discovery?'Исх. 2:5–6':'Исх. 2:3'}
    </span>}
  </div>;
}
