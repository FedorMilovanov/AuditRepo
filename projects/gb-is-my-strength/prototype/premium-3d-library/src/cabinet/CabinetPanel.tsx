import { useEffect, useMemo, useRef, useState, type ReactNode, type ChangeEvent } from 'react';
import { ITEMS } from '../data';
import {
  EMPTY_VAULT, addBookmark, addQuote, attachToCollection, createCollection, deleteCollection, deleteRecord,
  exportVault, parseVault, targetUrl, newRecordId, type Mutation, type Target, type VaultState
} from './engine';
import { loadVault, saveVault } from './storage';

const SOURCES: Target[] = ITEMS.filter(item => /^\/(?:[a-z0-9_-]+\/)*$/i.test(item.href))
  .filter((item, i, all) => all.findIndex(x => x.href === item.href) === i)
  .map(item => ({ contentId: `lab:${item.id}`, path: item.href, title: item.title }));
const mkId = () => newRecordId();
const at = () => new Date().toISOString();

function Btn({ children, onClick, disabled=false, secondary=false }: { children: ReactNode; onClick: () => void; disabled?: boolean; secondary?: boolean }) {
  return <button type="button" disabled={disabled} onClick={onClick}
    className={`rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315743] disabled:cursor-not-allowed disabled:opacity-45 ${secondary?'border border-[#aab2a5] bg-white/70 text-[#33493b] hover:bg-white':'bg-[#315743] text-white hover:bg-[#426d53]'}`}>{children}</button>;
}
export default function CabinetPanel({ onClose }: { onClose: () => void }) {
  const [vault, setVault] = useState<VaultState>(() => structuredClone(EMPTY_VAULT));
  const [status,setStatus] = useState('Загружаю сохранённые материалы…');
  const [ready,setReady] = useState(false);
  const [locked,setLocked] = useState(false);
  const [busy,setBusy] = useState(false);
  const [tab,setTab] = useState<'bookmarks'|'quotes'|'collections'>('bookmarks');
  const [source,setSource] = useState(SOURCES[0]?.contentId || '');
  const [anchor,setAnchor] = useState('');
  const [exact,setExact] = useState('');
  const [prefix,setPrefix] = useState('');
  const [suffix,setSuffix] = useState('');
  const [attribution,setAttribution] = useState('');
  const [note,setNote] = useState('');
  const [collTitle,setCollTitle] = useState('');
  const [collId,setCollId] = useState('');
  const [selectedRecord,setSelectedRecord] = useState('');
  const importRef=useRef<HTMLInputElement>(null);
  const closeRef=useRef<HTMLButtonElement>(null);
  const chosen = useMemo(() => SOURCES.find(x=>x.contentId===source),[source]);
  const bookmarks=vault.records.filter(x=>x.kind==='bookmark');
  const quotes=vault.records.filter(x=>x.kind==='quote');

  useEffect(()=>{
    let alive=true;
    loadVault().then(s=>{ if(alive){setVault(s);setReady(true);setStatus('Данные хранятся только в этом браузере. Это независимая лаборатория, не кабинет действующего сайта.');} })
      .catch(e=>{ if(alive){setReady(true);setLocked(true);setStatus('Доступ к сохранённым данным ограничен: '+String(e instanceof Error?e.message:e)+'. Не перезаписываем их.');} });
    return ()=>{alive=false};
  },[]);
  useEffect(()=>{
    closeRef.current?.focus();
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onClose();}
      if(e.key!=='Tab')return;
      const root=document.querySelector('[data-gb-cabinet-modal]');
      const nodes=[...(root?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')??[])].filter(el=>el.getClientRects().length>0);
      if(!nodes.length)return;
      if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes[nodes.length-1].focus()}
      else if(!e.shiftKey&&document.activeElement===nodes[nodes.length-1]){e.preventDefault();nodes[0].focus()}
    };
    window.addEventListener('keydown',onKey,true);return()=>window.removeEventListener('keydown',onKey,true);
  },[onClose]);

  async function commit(result:Mutation){
    if(!result.ok){setStatus(result.reason);return}
    setBusy(true);
    try{await saveVault(result.state, vault);setVault(result.state);setStatus(result.reason)}
    catch(e){setStatus('Сохранение не выполнено. Данные на диске не изменены: '+String(e));setLocked(true)}
    finally{setBusy(false)}
  }
  function saveBookmark(){if(chosen)void commit(addBookmark(vault,{id:mkId(),target:{...chosen,...(anchor.trim()?{anchor:anchor.trim()}: {})},at:at()}));}
  function saveQuote(){if(chosen)void commit(addQuote(vault,{id:mkId(),target:chosen,at:at(),exact,prefix,suffix,attribution,note}));}
  function makeCollection(){void commit(createCollection(vault,{id:mkId(),at:at(),title:collTitle}));}
  function fileExport(){
    const blob=new Blob([exportVault(vault)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='my-library-lab-backup.json';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    setStatus('Скопирован локальный снимок в файл. Он содержит личные выписки и заметки: храните его приватно.');
  }
  async function fileImport(e:ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0];e.target.value='';if(!file)return;
    if(file.size>350_000){setStatus('Файл слишком большой для прототипа');return}
    let contents='';try{contents=await file.text()}catch{setStatus('Файл не удалось прочитать');return}
    const parsed=parseVault(contents);if(!parsed.ok){setStatus('Импорт отклонён: '+parsed.reason+'. Текущие данные сохранены.');return}
    if(locked){setStatus('Сохранённая база требует ручного восстановления; импорт поверх повреждённых данных запрещён.');return}
    if(!confirm('Заменить ВСЕ лабораторные закладки, цитаты и коллекции содержимым файла? Сначала экспортируйте резервную копию.'))return;
    setBusy(true);
    try{await saveVault(parsed.state,vault);setVault(parsed.state);setLocked(false);setStatus('Импорт проверен и выполнен. Резервная копия предыдущих данных не создавалась автоматически.')}
    catch(err){setStatus('Импорт не записан: '+String(err));setLocked(true)}
    finally{setBusy(false)}
  }
  const disabled=busy||!ready||locked;
  return <div data-gb-cabinet-modal role="dialog" aria-modal="true" aria-labelledby="gb-cabinet-title" className="fixed inset-0 z-[76] flex items-center justify-center bg-[#0e1712]/90 p-2 backdrop-blur-md sm:p-6">
    <div className="flex max-h-[97dvh] w-full max-w-[1050px] flex-col overflow-hidden rounded-[24px] border border-[#c7bda7]/60 bg-[#f4f0e8] text-[#28372d] shadow-2xl sm:max-h-[92dvh]">
      <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[#d5cabb] bg-[#e8e2d6] px-4 py-4 sm:px-8 sm:py-6">
        <div><div className="text-[10px] font-bold uppercase tracking-[.2em] text-[#567162]">Господь Бог — сила моя · лаборатория</div>
          <h2 id="gb-cabinet-title" className="mt-1 font-display text-3xl font-semibold sm:text-4xl">Моя библиотека</h2>
          <p className="mt-1 text-xs text-[#69766c]">Личные закладки, выписки и тематические полки · без аккаунта</p></div>
        <button ref={closeRef} onClick={onClose} className="shrink-0 rounded-full border border-[#9ca89d] bg-white/80 px-3 py-2 text-xs font-semibold hover:bg-white">Закрыть ×</button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-8">
        <div role="status" aria-live="polite" className={`mb-4 rounded-xl px-4 py-3 text-xs leading-relaxed ${locked?'border border-[#b98664] bg-[#fff4e8] text-[#70452c]':'bg-[#e2e8dc] text-[#435a48]'}`}>{status}</div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d9cfc0] pb-4">
          <nav className="flex flex-wrap gap-2" aria-label="Личные материалы">
            {([{k:'bookmarks',t:`Закладки (${bookmarks.length})`},{k:'quotes',t:`Цитаты (${quotes.length})`},{k:'collections',t:`Коллекции (${vault.collections.length})`}] as const).map(x=><button key={x.k} aria-pressed={x.k===tab} onClick={()=>setTab(x.k)} className={`rounded-full px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${tab===x.k?'bg-[#30533f] text-white':'bg-[#e4e0d7] hover:bg-[#d7d3c9]'}`}>{x.t}</button>)}
          </nav>
          <div className="flex gap-2"><Btn disabled={!ready||busy} secondary onClick={fileExport}>Экспорт JSON</Btn><Btn secondary disabled={busy} onClick={()=>importRef.current?.click()}>Импорт</Btn><input ref={importRef} type="file" accept="application/json,.json" className="hidden" onChange={e=>void fileImport(e)}/></div>
        </div>
        <div className="mt-5 grid gap-6 lg:grid-cols-[340px_1fr]">
          <section aria-label="Добавление материала" className="rounded-2xl border border-[#d5caba] bg-white/65 p-5">
            {tab!=='collections'?<>
              <label htmlFor="gb-cabinet-source" className="mb-1 block text-xs font-semibold">Материал сайта</label>
              <select id="gb-cabinet-source" value={source} onChange={e=>setSource(e.target.value)} className="mb-4 w-full rounded-xl border border-[#aeb5a7] bg-white p-2 text-sm">
                {SOURCES.map(x=><option key={x.contentId} value={x.contentId}>{x.title}</option>)}
              </select>
              {tab==='bookmarks'?<><label htmlFor="gb-cabinet-anchor" className="mb-1 block text-xs font-semibold">Якорь раздела (необязательно)</label>
                <input id="gb-cabinet-anchor" value={anchor} onChange={e=>setAnchor(e.target.value)} maxLength={120} placeholder="Например: section-1" className="mb-3 w-full rounded-xl border border-[#aeb5a7] bg-white p-2 text-sm"/>
                <p className="mb-4 text-xs leading-relaxed text-[#657063]">Это только лабораторные адреса из каталога Arena. Прежде чем переносить в Product, требуется сверка настоящего адреса и якоря.</p>
                <Btn disabled={disabled||!chosen} onClick={saveBookmark}>Сохранить закладку</Btn></>
              : <><label htmlFor="gb-cabinet-exact" className="mb-1 block text-xs font-semibold">Дословная личная выписка</label><textarea id="gb-cabinet-exact" value={exact} onChange={e=>setExact(e.target.value)} maxLength={1200} rows={4} className="mb-3 w-full rounded-xl border border-[#aeb5a7] bg-white p-2 text-sm" placeholder="Вставьте только точно сверенный отрывок"/>
                <label htmlFor="gb-cabinet-attribution" className="mb-1 block text-xs font-semibold">Атрибуция источника</label><input id="gb-cabinet-attribution" value={attribution} onChange={e=>setAttribution(e.target.value)} maxLength={160} className="mb-3 w-full rounded-xl border border-[#aeb5a7] bg-white p-2 text-sm" placeholder="Название издания, автор и т. п."/>
                <details className="mb-3 text-xs"><summary className="cursor-pointer font-semibold">Контекст и личная заметка</summary><div className="mt-2 space-y-2"><input aria-label="Текст непосредственно перед цитатой" value={prefix} onChange={e=>setPrefix(e.target.value)} maxLength={160} placeholder="Текст перед цитатой" className="w-full rounded-lg border border-[#aeb5a7] p-2"/><input aria-label="Текст непосредственно после цитаты" value={suffix} onChange={e=>setSuffix(e.target.value)} maxLength={160} placeholder="Текст после цитаты" className="w-full rounded-lg border border-[#aeb5a7] p-2"/><textarea aria-label="Личная заметка" value={note} onChange={e=>setNote(e.target.value)} maxLength={2000} rows={2} placeholder="Личная заметка" className="w-full rounded-lg border border-[#aeb5a7] p-2"/></div></details>
                <p className="mb-3 text-xs leading-relaxed text-[#657063]">Ручная выписка не считается проверенной редакционной цитатой. Поиск точного места в тексте появится после интеграции с Reader.</p>
                <Btn disabled={disabled||!chosen} onClick={saveQuote}>Сохранить выписку</Btn></>}
            </>:<><label htmlFor="gb-cabinet-collection" className="mb-1 block text-xs font-semibold">Новая тематическая полка</label><input id="gb-cabinet-collection" value={collTitle} onChange={e=>setCollTitle(e.target.value)} maxLength={64} placeholder="Например: Экзегеза" className="mb-3 w-full rounded-xl border border-[#aeb5a7] bg-white p-2 text-sm"/><Btn disabled={disabled} onClick={makeCollection}>Создать коллекцию</Btn>
              {vault.collections.length>0&&vault.records.length>0&&<div className="mt-6 border-t border-[#ddd3c7] pt-5"><p className="mb-3 text-xs font-semibold">Добавить сохранённый материал</p>
                <select aria-label="Коллекция для пополнения" value={collId} onChange={e=>setCollId(e.target.value)} className="mb-2 w-full rounded-lg border border-[#aeb5a7] bg-white p-2 text-sm"><option value="">Выберите коллекцию</option>{vault.collections.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select>
                <select aria-label="Сохранённый материал" value={selectedRecord} onChange={e=>setSelectedRecord(e.target.value)} className="mb-3 w-full rounded-lg border border-[#aeb5a7] bg-white p-2 text-sm"><option value="">Выберите запись</option>{vault.records.map(r=><option key={r.id} value={r.id}>{r.target.title} · {r.kind==='bookmark'?'закладка':'цитата'}</option>)}</select>
                <Btn disabled={disabled||!collId||!selectedRecord} onClick={()=>void commit(attachToCollection(vault,collId,selectedRecord))}>Добавить на полку</Btn>
              </div>}
            </>}
          </section>
          <section aria-label="Сохранённое" className="min-w-0 space-y-3">
            {tab==='collections'?(vault.collections.length?vault.collections.map(c=><article key={c.id} className="rounded-2xl border border-[#d8cbb8] bg-white/75 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-xl font-semibold">{c.title}</h3><p className="text-xs text-[#607268]">Материалов: {c.recordIds.length}</p></div><Btn secondary disabled={disabled} onClick={()=>{if(confirm('Удалить только эту полку? Материалы останутся сохранены.'))void commit(deleteCollection(vault,c.id))}}>Удалить полку</Btn></div><ul className="mt-2 text-sm text-[#435449]">{c.recordIds.map(id=>{const r=vault.records.find(x=>x.id===id);return r?<li key={id} className="py-1">{r.target.title} · {r.kind==='bookmark'?'закладка':'выписка'}</li>:null})}</ul></article>):<p className="p-6 text-sm text-[#69756d]">Ваши тематические полки пока пусты.</p>)
              :(tab==='bookmarks'?bookmarks:quotes).length?(tab==='bookmarks'?bookmarks:quotes).map(r=><article key={r.id} className="rounded-2xl border border-[#d8cbb8] bg-white/75 p-4"><div className="flex justify-between gap-2"><h3 className="font-display text-xl font-semibold">{r.target.title}</h3><Btn disabled={disabled} secondary onClick={()=>{if(confirm('Удалить этот сохранённый материал?'))void commit(deleteRecord(vault,r.id))}}>Удалить</Btn></div>
                {r.kind==='quote'&&<><blockquote className="mt-2 border-l-2 border-[#b8a67f] pl-3 text-sm italic leading-relaxed">{r.exact}</blockquote><p className="mt-2 text-xs text-[#6b6d60]">Источник: {r.attribution}</p>{r.note&&<p className="mt-2 text-sm">Заметка: {r.note}</p>}<p className="mt-2 text-xs text-[#926840]">Привязка к оригиналу не проверена</p></>}
                <a className="mt-3 inline-block text-xs font-semibold text-[#315743] underline decoration-[#769681] underline-offset-2" href={targetUrl(r.target)} target="_blank" rel="noopener noreferrer">Открыть материал ↗</a>
              </article>):<p className="rounded-2xl bg-white/60 p-6 text-sm text-[#69756d]">Пока ничего не сохранено. Начните с материала слева.</p>}
          </section>
        </div>
      </div>
    </div>
  </div>
}
