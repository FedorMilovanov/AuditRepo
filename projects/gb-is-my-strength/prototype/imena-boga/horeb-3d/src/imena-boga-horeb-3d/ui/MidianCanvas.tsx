import { useEffect,useRef,useState } from 'react';
import type { MidianControl,MidianDirection } from '../engine/MidianWell';

/** Real WebGL walking area for Exodus 2:16–17. NOT the entire Midian life. */
export function MidianCanvas({reducedMotion=false,world='well'}:{reducedMotion?:boolean;world?:'well'|'homestead'}){
  const homestead=world==='homestead';
  const canvas=useRef<HTMLCanvasElement>(null);
  const controller=useRef<MidianControl|null>(null);
  const start=useRef<HTMLButtonElement>(null);
  const [exploring,setExploring]=useState(false);
  const [ready,setReady]=useState(false);
  const [failed,setFailed]=useState(false);
  const wasExploring=useRef(false);
  useEffect(()=>{
    if(wasExploring.current&&!exploring)start.current?.focus();
    wasExploring.current=exploring;
  },[exploring]);
  useEffect(()=>{
    if(!canvas.current)return;
    let disposed=false;
    const reduced=reducedMotion||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
    const load=homestead
      ?import('../engine/MidianHomestead').then(mod=>mod.createMidianHomestead)
      :import('../engine/MidianWell').then(mod=>mod.createMidianWell);
    load.then(create=>{
      if(disposed||!canvas.current)return;
      controller.current=create(canvas.current,reduced);
      setReady(true);
    }).catch(()=>{if(!disposed)setFailed(true);});
    return ()=>{disposed=true;controller.current?.dispose();controller.current=null;};
  },[reducedMotion,world]);
  useEffect(()=>{
    if(!exploring)return;
    const old=document.body.style.overflow;document.body.style.overflow='hidden';
    return ()=>{document.body.style.overflow=old;};
  },[exploring]);
  const toggle=(on:boolean)=>{
    if(!controller.current)return;
    controller.current.setExplore(on);setExploring(on);
  };
  const control=(direction:MidianDirection,glyph:string,label:string)=>(
    <button type="button" key={direction} aria-label={label}
      data-testid={'midian-move-'+direction}
      onPointerDown={e=>{
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        controller.current?.setMovement(direction,true);
      }}
      onPointerUp={()=>controller.current?.setMovement(direction,false)}
      onPointerCancel={()=>controller.current?.setMovement(direction,false)}
      onLostPointerCapture={()=>controller.current?.setMovement(direction,false)}
      className="w-14 h-14 select-none touch-none rounded-lg border border-parch/60 bg-black/70 text-parch text-xl font-semibold shadow-lg active:bg-bronze/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">{glyph}</button>
  );
  return <div data-testid="midian-viewport"
    className={'overflow-hidden bg-[#574f47] '+(exploring
      ? 'fixed inset-0 z-[90] !w-screen !h-[100dvh]'
      : 'relative w-full h-60 sm:h-80')}
    aria-label={homestead?'Трёхмерная семейная стоянка в Мадиаме, Исход 2:18–21':'Трёхмерная локация колодца Мадиама по Исходу 2:16–17'}>
    <canvas ref={canvas} role="img" data-testid={homestead?'moses-midian-homestead-3d':'moses-midian-well-3d'}
      aria-label={homestead?'Трёхмерный навес, настоящий деревянный каркас, каменистый склон и очаг':'Трёхмерный колодец, водопой, каменистые склоны и скудная растительность'}
      className={'block w-full h-full '+(exploring?'touch-none cursor-grab active:cursor-grabbing':'')}/>
    {failed&&<p role="status" className="absolute inset-0 grid place-items-center bg-[#382d25] px-5 text-parch text-center">
      На этом устройстве не удалось запустить WebGL. Описание библейского эпизода доступно ниже.
    </p>}
    {!failed&&!exploring&&<button ref={start} type="button" disabled={!ready}
      data-testid={homestead?'midian-homestead-explore-start':'midian-explore-start'} onClick={()=>toggle(true)}
      className="absolute bottom-3 left-3 z-10 rounded-sm border border-parch/70 bg-black/80 px-4 py-2.5 text-sm font-semibold text-parch shadow-lg hover:bg-black/95 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">
      {ready?(homestead?'Исследовать стоянку в 3D':'Исследовать колодец в 3D'):'Загрузка 3D...'}
    </button>}
    {exploring&&!failed&&<>
      <div className="absolute left-3 right-3 top-3 z-20 flex items-start justify-between gap-3 pointer-events-none">
        <div className="max-w-[65%] bg-black/75 border border-parch/30 text-parch p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-sm sm:text-lg">{homestead?'Мадиам · стоянка семьи':'Мадиам · у колодца'}</p>
          <p className="text-xs sm:text-sm text-parch/90">WASD / стрелки — ходьба; перетаскивание — обзор. {homestead?'Каркас навеса и очаг — реальные препятствия; центральный вход открыт.':'Колодец и водопой — реальные препятствия.'}</p>
        </div>
        <button type="button" data-modal-escape-exit data-testid="midian-explore-close"
          onClick={()=>toggle(false)}
          className="pointer-events-auto rounded-lg bg-black/80 border border-parch/70 px-3 py-3 text-parch font-semibold text-sm shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">
          Вернуться
        </button>
      </div>
      <div className="absolute left-4 bottom-5 z-20 flex flex-col items-center gap-1 sm:hidden"
        aria-label="Сенсорная навигация">
        {control('forward','↑','Идти вперёд')}
        <div className="flex gap-1">
          {control('left','←','Шаг влево')}
          {control('backward','↓','Идти назад')}
          {control('right','→','Шаг вправо')}
        </div>
      </div>
    </>}
    <span className="absolute right-2 bottom-2 bg-black/70 text-parch/95 text-[10px] rounded px-2 py-1 pointer-events-none max-w-[45%] text-right">
      Условная реконструкция · {homestead?'Исх. 2:18–21':'Исх. 2:16–17'}
    </span>
  </div>;
}
