import { useEffect,useRef,useState } from 'react';
import type { MidianControl,MidianDirection } from '../engine/MidianWell';
import {FIELD_NOTES,FIELD_STORAGE_KEY,answerField,nearField,
  normalizeFieldJournal,observeField,type Choice} from '../data/WorldFieldLearning';

/** Real WebGL walking area for Exodus 2:16–17. NOT the entire Midian life. */
export function MidianCanvas({reducedMotion=false,world='well'}:{reducedMotion?:boolean;world?:'well'|'homestead'}){
  const homestead=world==='homestead';
  const canvas=useRef<HTMLCanvasElement>(null);
  const controller=useRef<MidianControl|null>(null);
  const start=useRef<HTMLButtonElement>(null);
  const [exploring,setExploring]=useState(false);
  const [ready,setReady]=useState(false);
  const [failed,setFailed]=useState(false);
  const exploringRef=useRef(false);
  const lastWorldRef=useRef(world);
  const wasExploring=useRef(false);
  const noteOpenRef=useRef(false);
  const observeButtonRef=useRef<HTMLButtonElement>(null);
  const noteCloseRef=useRef<HTMLButtonElement>(null);
  const [nearNote,setNearNote]=useState(false);
  const [noteOpen,setNoteOpen]=useState(false);
  const [choice,setChoice]=useState<Choice|null>(null);
  const note=FIELD_NOTES[world];
  const [journal,setJournal]=useState(()=>{
    try{return normalizeFieldJournal(JSON.parse(localStorage.getItem(FIELD_STORAGE_KEY)||'null'));}
    catch{return normalizeFieldJournal(null);}
  });
  useEffect(()=>{
    try{localStorage.setItem(FIELD_STORAGE_KEY,JSON.stringify(journal));}
    catch{/* no storage permission; maintain usable in-memory study */}
  },[journal]);
  useEffect(()=>{
    if(!exploring){setNearNote(false);return;}
    const sample=()=>{
      const c=canvas.current;
      const x=Number(c?.dataset.midianX),z=Number(c?.dataset.midianZ);
      const isNear=c?.dataset.midianMode==='walk'&&nearField(note,x,z);
      setNearNote(prev=>prev===Boolean(isNear)?prev:Boolean(isNear));
    };
    sample();
    const interval=window.setInterval(sample,180);
    return ()=>window.clearInterval(interval);
  },[exploring,world]);
  useEffect(()=>{
    if(noteOpen)noteCloseRef.current?.focus();
    else if(exploring)observeButtonRef.current?.focus();
  },[noteOpen]);
  useEffect(()=>{
    if(wasExploring.current&&!exploring)start.current?.focus();
    wasExploring.current=exploring;
  },[exploring]);
  useEffect(()=>{
    if(!canvas.current)return;
    let disposed=false;
    controller.current=null;
    setReady(false);
    setFailed(false);
    if(lastWorldRef.current!==world){
      lastWorldRef.current=world;
      exploringRef.current=false;
      noteOpenRef.current=false;
      setNoteOpen(false);
      setExploring(false);
    }
    const reduced=reducedMotion||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
    const load=homestead
      ?import('../engine/MidianHomestead').then(mod=>mod.createMidianHomestead)
      :import('../engine/MidianWell').then(mod=>mod.createMidianWell);
    load.then(create=>{
      if(disposed||!canvas.current)return;
      const current=create(canvas.current,reduced);
      if(disposed){current.dispose();return;}
      controller.current=current;
      if(exploringRef.current)current.setExplore(true);
      if(noteOpenRef.current)current.setPaused(true);
      setReady(true);
    }).catch(()=>{
      if(!disposed){
        exploringRef.current=false;
        noteOpenRef.current=false;
        setNoteOpen(false);
        setExploring(false);
        setReady(false);
        setFailed(true);
      }
    });
    return ()=>{disposed=true;controller.current?.dispose();controller.current=null;};
  },[reducedMotion,world]);
  useEffect(()=>{
    if(!exploring)return;
    const old=document.body.style.overflow;document.body.style.overflow='hidden';
    return ()=>{document.body.style.overflow=old;};
  },[exploring]);
  const toggle=(on:boolean)=>{
    if(!controller.current||!ready||failed)return;
    if(!on){noteOpenRef.current=false;setNoteOpen(false);}
    controller.current.setExplore(on);
    exploringRef.current=on;
    setExploring(on);
  };
  const openNote=()=>{
    if(!controller.current||!exploring||!nearNote||noteOpen)return;
    controller.current.setPaused(true);
    noteOpenRef.current=true;
    setJournal(j=>observeField(j,note.id));
    setChoice(null);
    setNoteOpen(true);
  };
  const closeNote=()=>{
    noteOpenRef.current=false;
    controller.current?.setPaused(false);
    setNoteOpen(false);
  };
  const answer=(picked:Choice)=>{
    if(!noteOpen)return;
    setJournal(j=>answerField(j,note.id,picked));
    setChoice(picked);
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
      <div className="absolute right-3 bottom-14 z-20 flex flex-col items-end gap-1">
        <button ref={observeButtonRef} type="button" data-testid="midian-field-observe"
          disabled={!nearNote||noteOpen} onClick={openNote}
          className="rounded-lg border border-parch/60 bg-black/85 px-3 py-2 text-xs sm:text-sm text-parch shadow-lg disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">
          {nearNote?'Осмотреть место':'Подойдите к месту наблюдения'}
        </button>
        <span data-testid="midian-field-progress"
          className="rounded bg-black/75 px-2 py-1 text-[11px] text-parch/90">
          Изучено {journal.understood.length} / 2
        </span>
      </div>
    </>}
    {noteOpen&&exploring&&!failed&&
      <div className="absolute inset-0 z-30 grid place-items-center bg-black/85 px-3 py-4">
        <section role="dialog" aria-modal="true" aria-labelledby="midian-field-title"
          data-testid="midian-field-dialog"
          onKeyDown={e=>{
            if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeNote();}
            if(e.key==='Tab'){
              const buttons=Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button:not([disabled])'));
              const first=buttons[0],last=buttons[buttons.length-1];
              if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
              else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
            }
          }}
          className="w-full max-w-lg max-h-[85dvh] overflow-y-auto rounded-xl border border-parch/40 bg-[#1a211e] p-4 sm:p-6 text-parch shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-bronze">
                Полевое наблюдение · {note.source}
              </p>
              <h3 id="midian-field-title" className="mt-1 font-display text-xl sm:text-2xl">{note.title}</h3>
            </div>
            <button ref={noteCloseRef} type="button" data-testid="midian-field-close"
              onClick={closeNote}
              className="rounded-lg border border-parch/55 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">Закрыть</button>
          </div>
          <p className="mt-4 text-sm sm:text-base leading-relaxed">{note.question}</p>
          <div className="mt-4 space-y-2">
            {note.options.map(item=><button key={item.id} type="button"
              data-testid={'midian-field-choice-'+item.id}
              aria-pressed={choice===item.id} onClick={()=>answer(item.id)}
              className={'block w-full text-left rounded-lg border px-3 py-3 text-sm leading-relaxed focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 '+(choice===item.id?'border-bronze bg-bronze/20':'border-parch/30 bg-black/25')}>
              {item.text}
            </button>)}
          </div>
          {choice&&<p data-testid="midian-field-feedback" role="status"
            className="mt-4 rounded-lg border border-parch/30 bg-black/40 p-3 text-sm leading-relaxed">
            {choice===note.answer?'Верно. '+note.explanation:
              'Сверьте текст ещё раз. '+note.hint+
              ((journal.mistakes[note.id]??0)>=2?' Источник: '+note.source+'.':'')}
          </p>}
          <p className="mt-4 text-xs leading-relaxed text-parch/70">
            Природа и предметы вокруг — художественная модель; сведения
            о событии проверяются по Писанию, а не по форме 3D-объектов.
          </p>
        </section>
      </div>}
    <span className="absolute right-2 bottom-2 bg-black/70 text-parch/95 text-[10px] rounded px-2 py-1 pointer-events-none max-w-[45%] text-right">
      Условная реконструкция · {homestead?'Исх. 2:18–21':'Исх. 2:16–17'}
    </span>
  </div>;
}
