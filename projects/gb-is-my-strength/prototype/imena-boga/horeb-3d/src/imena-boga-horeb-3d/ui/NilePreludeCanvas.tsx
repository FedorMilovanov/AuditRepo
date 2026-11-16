import { useEffect, useRef, useState } from 'react';
import type { NileMoment } from '../engine/NilePrelude';

/** A real 3D environmental shot, not another player navigation engine.
 * Lazy-imported only after the user opens the six-beat Moses prelude. */
export function NilePreludeCanvas({ moment = 'basket' }: { moment?: NileMoment }) {
  const ref=useRef<HTMLCanvasElement>(null);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    const canvas=ref.current;
    if(!canvas)return;
    let disposed=false;
    let cleanup:(()=>void)|undefined;
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
    import('../engine/NilePrelude').then(({createNilePrelude})=>{
      if(disposed)return;
      cleanup=createNilePrelude(canvas,reduced,moment);
    }).catch(()=>{
      if(!disposed)setFailed(true);
    });
    return ()=>{disposed=true;cleanup?.();};
  },[moment]);
  const discovery=moment==='discovery';
  return <div className="relative w-full h-48 sm:h-64 bg-[#314e54] overflow-hidden"
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
    <span className="absolute right-2 bottom-2 text-[10px] text-parch/75 bg-black/55 px-2 py-1 rounded-sm pointer-events-none">
      Художественная реконструкция · {discovery?'Исх. 2:5–6':'Исх. 2:3'}
    </span>
  </div>;
}
