import { useEffect, useRef, useState } from 'react';
import type { NileMoment, NilePreludeControl, NileView } from '../engine/NilePrelude';

/** One lightweight WebGL scene per narrative beat. W8C adds a user-driven
 * camera shot, not a second engine, route or autoplay cutscene. */
export function NilePreludeCanvas({ moment = 'basket', reducedMotion = false }: { moment?: NileMoment; reducedMotion?: boolean }) {
  const ref=useRef<HTMLCanvasElement>(null);
  const controller=useRef<NilePreludeControl|null>(null);
  const viewRef=useRef<NileView>('wide');
  const [view,setView]=useState<NileView>('wide');
  const [failed,setFailed]=useState(false);
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
    }).catch(()=>{
      if(!disposed)setFailed(true);
    });
    return ()=>{
      disposed=true;
      controller.current?.dispose();
      controller.current=null;
    };
  },[moment,reducedMotion]);
  const discovery=moment==='discovery';
  const toggleShot=()=>{
    const next:NileView=viewRef.current==='wide'?'close':'wide';
    viewRef.current=next;
    controller.current?.setView(next);
    setView(next);
  };
  return <div className={`relative w-full ${discovery?'h-56 sm:h-80':'h-48 sm:h-64'} bg-[#314e54] overflow-hidden`}
    aria-label={discovery
      ? 'Условная 3D-композиция: дочь фараона, прислужницы и корзина среди папируса'
      : 'Художественная 3D-композиция: неподвижная корзина с младенцем среди папируса у берега Нила'}>
    <canvas ref={ref} data-testid={discovery?'moses-nile-discovery-3d':'moses-nile-3d'} className="w-full h-full block"
      role="img" aria-label={discovery
        ? 'Исход 2:5–6. Условные человеческие силуэты у берега рядом с корзиной'
        : 'Реконструкция: папирусная корзина среди тростника у берега реки'} />
    {failed && <p role="status" className="absolute inset-0 grid place-items-center px-4 text-center bg-[#2d4042] text-parch">
      Трёхмерная композиция недоступна на этом устройстве. Описание событий доступно ниже.
    </p>}
    {discovery && !failed && <button type="button" data-testid="moses-nile-shot-toggle"
      aria-pressed={view==='close'} onClick={toggleShot}
      className="absolute bottom-3 left-3 z-10 rounded-sm border border-parch/40 bg-black/70 px-3 py-2 text-xs font-semibold text-parch shadow-md hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200">
      {view==='close'?'Общий план':'Крупный план'}
    </button>}
    <span className="absolute right-2 bottom-2 text-[10px] text-parch/90 bg-black/65 px-2 py-1 rounded-sm pointer-events-none">
      <span className="hidden sm:inline">Художественная реконструкция · </span>{discovery?'Исх. 2:5–6':'Исх. 2:3'}
    </span>
  </div>;
}
