import { EXHIBITS, ZONES, CATEGORY_RU, EX_3_5_RU, EX_3_5_SOURCE, type Exhibit } from '../data/exhibits';
import { narrationPlan, NARRATION_LANGUAGE_LABEL } from '../data/narrationPlan';
import { SceneMoment } from './SceneMoment';
import { PILOT_IDS, PILOT_LESSONS, type LearningChoice, type LearningJournal } from '../data/learningJourney';

const LANG_RU = { he: 'древнееврейский', arc: 'арамейский', grc: 'греческий' } as const;
const STATUS_RU = { working_draft: 'рабочий черновик', disputed: 'дискуссионно', review_in_progress: 'проверка продолжается' } as const;

export function Original({ e, className = '' }: { e: Exhibit; className?: string }) {
  const rtl = e.sourceLanguage !== 'grc';
  return (
    <span lang={e.sourceLanguage} dir={rtl ? 'rtl' : 'ltr'} className={`${rtl ? 'font-hebrew' : 'font-greek'} ${className}`}>
      {e.originalUnicode}
    </span>
  );
}

export function ExhibitCard({ e, headingLevel = 3 }: { e: Exhibit; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const voice = narrationPlan(e);
  const rows: [string, string][] = [
    ['Традиционное русское чтение', e.traditionalRu],
    ['Буквальное значение', e.literalGloss],
    ['Кто говорит', e.speaker],
    ['Кого / что именуют', e.referent],
    ['Именованный объект', e.namedObject],
    ['Эпоха / литературный горизонт', e.era],
    ['Сцена / действие', e.meaningfulAction],
    ['Предупреждение / контраст', e.caution],
    ['Толкование (отделено от буквального)', e.interpretiveNotes],
    ['Текстологические заметки', e.textualVariantNotes],
    ['Издание', e.edition],
    ['Права', e.rightsStatus],
  ];
  return (
    <article className="exhibit-card" aria-labelledby={`h-${e.id}`}>
      <p className="eyebrow">
        {CATEGORY_RU[e.category]}{e.zone === 5 ? ' · позднейшее свидетельство' : ''}
      </p>
      <H id={`h-${e.id}`} className="font-display text-2xl sm:text-3xl text-parch leading-tight mt-1">{e.displayLabelRu}</H>
      <p className="mt-4 text-4xl sm:text-5xl text-parch leading-snug break-words">
        <Original e={e} />
      </p>
      <p className="mt-2 text-sm text-muted">
        <span className="italic">{e.transliteration}</span> · {LANG_RU[e.sourceLanguage]} ·{' '}
        <a className="link" href={e.verseUrl} target="_blank" rel="noopener noreferrer">{e.verseReference} ↗</a>
      </p>
      <dl className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(0,12rem)_1fr] text-[0.95rem]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-bronze text-xs uppercase tracking-[0.12em] pt-1">{k}</dt>
            <dd className="text-parch/90 leading-relaxed">{v}</dd>
          </div>
        ))}
      </dl>
      <details className="mt-5 rounded-sm border border-bronze/25 bg-black/25 p-4">
        <summary className="cursor-pointer text-bronze text-sm">
          Аудиогид · {voice.originalSpoken ? 'оригинал → русский' : 'написание → русский'} · {voice.status === 'HOLD' ? 'запись ожидает утверждения' : 'запись утверждена'}
        </summary>
        <ol className="list-decimal list-inside text-sm text-parch/85 space-y-3 mt-3">
          <li>
            <strong>{voice.originalSpoken ? 'Сначала произношение на ' + NARRATION_LANGUAGE_LABEL[voice.sourceLanguage] : 'Сначала написание — без реконструированного произношения'}.</strong>{' '}
            <Original e={e} className="text-lg mx-2" />
          </li>
          <li>
            <strong>Затем русский рассказчик.</strong>{' '}
            {voice.russianDraft ?? 'Текст этой экспозиции ещё должен пройти написание и редакционную проверку.'}
          </li>
        </ol>
        <p className="mt-3 text-xs text-muted">
          {voice.status === 'HOLD'
            ? 'Аудиозаписей нет: проверка произношения, русского сценария, прав исполнителей и исходников не завершена. Это письменная схема, не кнопка воспроизведения.'
            : 'Редакционные аудиофайлы разрешены в реестре. Воспроизведение допускается только по действию посетителя.'}
        </p>
      </details>
      <p className="mt-5 text-xs text-muted border-t border-white/10 pt-3">
        Статус исследования: <b className="text-parch/80">{STATUS_RU[e.researchStatus]}</b> · публикационное состояние:{' '}
        <b className="text-amber-300/80">{e.publicationState}</b> (нет редакционного допуска) · id: <code>{e.id}</code>
      </p>
    </article>
  );
}

export function SourcesAndLimits() {
  return (
    <section aria-labelledby="limits" className="prose-block">
      <h2 id="limits" className="font-display text-2xl text-parch">Источники и ограничения исследования</h2>
      <ul>
        <li>Это <b>лабораторный прототип</b>. Все карточки имеют состояние <b>HOLD</b>: ни одна не прошла редакционный допуск к публикации.</li>
        <li>Рабочая основа — Research PR #379 (Draft): 42 исследовательских <i>обозначания</i> в предварительном корпусе HOREB (не «42 доказанных личных имени»). Версию исследовательского реестра проверяют отдельно; текущий экран не является фиксацией HEAD Research. Полная рукописная колляция, проверка чтений и редакционный допуск <b>не выполнены</b>: ни одна карточка не разрешена к публикации.</li>
        <li>Здесь показаны {EXHIBITS.length} карточек, составленных вручную для прототипа по коротким лексемам. Еврейский текст сверялся по памяти с цифровым масоретским текстом Mechon Mamre; построчная сверка с BHS/BHQ и рукописями <b>не выполнена</b>.</li>
        <li>Успешная сборка, автоматические проверки инвариантов и скриншоты <b>не являются</b> текстологической рецензией.</li>
        <li>Полные стихи не воспроизводятся (права на конкретные редакции не проверены). Единственная полная русская цитата — Исх. 3:5 в Синодальном переводе 1876 г. (общественное достояние).</li>
        <li>Обзор о статусе имён и эпитетов: <a className="link" href="https://doi.org/10.1093/acrefore/9780199340378.013.144" target="_blank" rel="noopener noreferrer">Oxford Research Encyclopedia, doi:10.1093/acrefore/9780199340378.013.144</a> (не цитируется, только указан).</li>
      </ul>
    </section>
  );
}

export function AboutExhibition() {
  return (
    <section aria-labelledby="about" className="prose-block">
      <h2 id="about" className="font-display text-2xl text-parch">Об экспозиции</h2>
      <ul>
        <li>География, пещерные галереи и очертания горы — <b>художественная реконструкция</b>, а не установленный исторический факт. В Исходе 3 Моисей пасёт стадо у Хорива; куст стоит на открытой земле, не в пещере.</li>
        <li>Надписи на камне — приём визуализации. Это не сведения о реальных древних надписях в этом месте и не «встреча Моисея» с ними.</li>
        <li>Бог не изображается: ни фигурой, ни лицом, ни светом-силуэтом. Голос Бога не озвучивается.</li>
        <li>Зона 5 содержит позднейшие свидетельства (Псалтирь, пророки, Даниил, Новый Завет) — отдельные литературные горизонты, не современники Исхода.</li>
      </ul>
    </section>
  );
}

export function AccessibleReader({ onClose, learning, onLearningObserve, onLearningCorrect }: {
  onClose?: () => void;
  learning: LearningJournal;
  onLearningObserve: (id: string) => void;
  onLearningCorrect: (id: string, choice: LearningChoice) => void;
}) {
  return (
    <main id="reader" className="reader min-h-screen bg-ink text-parch">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-10">
        <header className="mb-10">
          <p className="eyebrow">Режим чтения · HTML-экспозиция</p>
          <h1 className="font-display text-4xl sm:text-5xl mt-2">Имена Бога — перед Святым</h1>
          <p className="mt-4 text-parch/80 leading-relaxed">Все тексты 3D-экспозиции в доступном виде. Каждая карточка содержит исходную форму, транслитерацию, стих, говорящего, референт, категорию и статус.</p>
          {onClose && <button className="btn mt-6" onClick={onClose}>← Вернуться</button>}
          <p className="mt-5 text-sm text-bronze" role="status">Путевой дневник: {learning.understood.length} из {PILOT_LESSONS.length} сюжетов осмыслено.</p>
          <p className="text-sm text-parch/75">Восемь ключевых сюжетов можно проходить как вопросы по Писанию и без WebGL. Это обучающее чтение, не заменяющее личного исследования.</p>
          <nav aria-label="Зоны" className="mt-6 flex flex-wrap gap-2 text-sm">
            {ZONES.filter((z) => EXHIBITS.some((e) => e.zone === z.id)).map((z) => (
              <a key={z.id} className="chip" href={`#zone-${z.id}`}>{z.id}. {z.title}</a>
            ))}
            <a className="chip" href="#limits">Источники и ограничения</a>
          </nav>
        </header>
        <AboutExhibition />
        {ZONES.map((z) => {
          const items = EXHIBITS.filter((e) => e.zone === z.id);
          if (!items.length && z.id !== 6) return null;
          return (
            <section key={z.id} id={`zone-${z.id}`} aria-labelledby={`zh-${z.id}`} className="mt-14">
              <h2 id={`zh-${z.id}`} className="font-display text-3xl border-b border-bronze/30 pb-2">
                <span className="text-bronze mr-2">{z.id}</span>{z.title} <span className="text-muted text-lg">— {z.sub}</span>
              </h2>
              {z.id === 6 && <p className="mt-4 text-parch/80">Узкий проход без надписей: из галерей — к открытой каменистой земле у Хорива.</p>}
              {z.id === 7 && (
                <blockquote className="mt-6 border-l-2 border-amber-500/50 pl-4 text-xl font-display italic">
                  «{EX_3_5_RU}»<footer className="text-sm not-italic text-muted mt-2">{EX_3_5_SOURCE}</footer>
                </blockquote>
              )}
              <div className="mt-6 space-y-8">{items.map((e) => <div key={e.id}>
                {PILOT_IDS.includes(e.id) && <SceneMoment
                  e={e} examined={learning.observed.includes(e.id)} understood={learning.understood.includes(e.id)}
                  canInspect textMode onInspect={() => onLearningObserve(e.id)}
                  onUnderstood={(choice) => onLearningCorrect(e.id, choice)} />}
                <ExhibitCard e={e} />
              </div>)}</div>
            </section>
          );
        })}
        <div className="mt-16"><SourcesAndLimits /></div>
      </div>
    </main>
  );
}
