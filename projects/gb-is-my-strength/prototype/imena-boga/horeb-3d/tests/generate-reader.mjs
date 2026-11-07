// Generates a no-JavaScript HTML edition from the canonical typed registry.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const source = readFileSync('src/imena-boga-horeb-3d/data/exhibits.ts', 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { EXHIBITS, ZONES, CATEGORY_RU, EX_3_5_RU, EX_3_5_SOURCE } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const pairs = [
  ['Традиционное русское чтение', 'traditionalRu'],
  ['Буквальное значение', 'literalGloss'],
  ['Кто говорит', 'speaker'],
  ['Кого / что именуют', 'referent'],
  ['Именованный объект', 'namedObject'],
  ['Эпоха / литературный горизонт', 'era'],
  ['Толкование', 'interpretiveNotes'],
  ['Текстологические заметки', 'textualVariantNotes'],
  ['Издание', 'edition'],
  ['Права', 'rightsStatus'],
];
const card = (e) => `<article id="${esc(e.id)}"><small>${esc(CATEGORY_RU[e.category])}${e.zone === 5 ? ' · позднейшее свидетельство' : ''}</small>
<h3>${esc(e.displayLabelRu)}</h3><p class="original" lang="${esc(e.sourceLanguage)}" dir="${e.sourceLanguage === 'grc' ? 'ltr' : 'rtl'}">${esc(e.originalUnicode)}</p>
<p><i>${esc(e.transliteration)}</i> · <a href="${esc(e.verseUrl)}" rel="noopener noreferrer">${esc(e.verseReference)}</a></p>
<dl>${pairs.map(([label, key]) => `<dt>${esc(label)}</dt><dd>${esc(e[key])}</dd>`).join('')}</dl>
<p class="status">Статус: ${esc(e.researchStatus)} · ${esc(e.publicationState)} — нет редакционного допуска · id: ${esc(e.id)}</p></article>`;
const sections = ZONES.map((z) => {
  const items = EXHIBITS.filter((e) => e.zone === z.id);
  if (!items.length && z.id !== 6) return '';
  return `<section id="zone-${z.id}"><h2>${z.id}. ${esc(z.title)} — ${esc(z.sub)}</h2>
    ${z.id === 6 ? '<p>Из галерей — к открытой каменистой земле у Хорива.</p>' : ''}
    ${z.id === 7 ? `<blockquote>«${esc(EX_3_5_RU)}»<footer>${esc(EX_3_5_SOURCE)}</footer></blockquote>` : ''}
    ${items.map(card).join('\n')}</section>`;
}).join('\n');
const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Имена Бога — перед Святым · чтение без JavaScript</title><meta name="description" content="Читаемая без JavaScript версия 3D-экспозиции имён Бога">
<style>
@font-face{font-family:Cormorant;src:url('./fonts/cormorant-cyrillic.woff2') format('woff2');font-display:swap}
@font-face{font-family:NotoHebrew;src:url('./fonts/noto-hebrew.woff2') format('woff2');font-display:swap}
@font-face{font-family:NotoGreek;src:url('./fonts/noto-greek.woff2') format('woff2');font-display:swap}
:root{color-scheme:dark}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#0b0907;color:#efe2c6;font:20px/1.5 Cormorant,Georgia,serif;overflow-wrap:anywhere}
main{max-width:780px;padding:30px 18px 100px;margin:auto}h1,h2,h3{font-weight:500;line-height:1.1}h1{font-size:clamp(2.1rem,7vw,4rem)}h2{font-size:2rem;border-bottom:1px solid #665442;padding-bottom:12px}h3{font-size:1.7rem;margin:.25rem 0}
a{color:#dcb377;text-underline-offset:3px}a:focus-visible{outline:2px solid #e2b877;outline-offset:3px}nav{display:flex;flex-wrap:wrap;gap:6px;margin:25px 0}nav a{border:1px solid #675743;padding:4px 9px;border-radius:3px;text-decoration:none}
section{margin-top:65px}article{border-bottom:1px solid #44392e;padding:26px 0}small,dt,.status{color:#c9a46a}small{text-transform:uppercase;letter-spacing:.08em}p.original{font-size:clamp(2rem,7vw,3rem);margin:.7rem 0;line-height:1.8}
[lang=he],[lang=arc]{font-family:NotoHebrew,"Times New Roman",serif;unicode-bidi:isolate}[lang=grc]{font-family:NotoGreek,Georgia,serif}dl{display:grid;grid-template-columns:minmax(0,160px) 1fr;gap:9px 18px;font-size:.95rem}dt{text-transform:uppercase;letter-spacing:.05em;font-size:.8rem}dd{margin:0}footer,.status{font-size:.8rem}blockquote{border-left:2px solid #c9a46a;margin:24px 0;padding-left:20px}
@media(max-width:520px){dl{display:block}dt{margin-top:12px}dd{margin-top:2px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style></head><body><main><header><p>Лабораторный прототип · доступная HTML-экспозиция</p><h1>Имена Бога — перед Святым</h1>
<p>География и пещеры — художественная экспозиция, а не установленная история. Карточки — рабочие черновики (HOLD), не публикационно одобренные досье. Никакой фигуры Бога в экспозиции нет.</p>
<nav aria-label="Разделы">${ZONES.filter((z) => EXHIBITS.some((e) => e.zone === z.id)).map((z) => `<a href="#zone-${z.id}">${z.id}. ${esc(z.title)}</a>`).join('')}<a href="#sources">Источники и ограничения</a></nav></header>
${sections}<section id="sources"><h2>Источники и ограничения исследования</h2>
<p>Все ${EXHIBITS.length} карточек имеют статус HOLD. 42 обозначения из брифа — не 42 доказанных личных имени. Рукописная колляция и редакционный допуск не выполнены.</p>
<p>Полных стихов здесь нет, кроме Исх. 3:5 (Синодальный перевод, 1876, общественное достояние). Каждая карточка даёт короткую лексему, ссылку, говорящего и референта. Репозитории Research и Product в этой итерации не использовались.</p>
<p>Галереи и каменные надписи — визуальный приём, не утверждение о реальной археологии Хорива. Позднейшие тексты не приписываются Моисею.</p></section></main></body></html>`;
mkdirSync('public/fonts', { recursive: true });
writeFileSync('public/reader.html', html);
const fonts = [
  ['node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-normal.woff2', 'public/fonts/cormorant-cyrillic.woff2'],
  ['node_modules/@fontsource/noto-serif-hebrew/files/noto-serif-hebrew-hebrew-400-normal.woff2', 'public/fonts/noto-hebrew.woff2'],
  ['node_modules/@fontsource/noto-serif/files/noto-serif-greek-400-normal.woff2', 'public/fonts/noto-greek.woff2'],
];
const { copyFileSync } = await import('node:fs');
for (const [src, dest] of fonts) copyFileSync(src, dest);
console.log(`Generated public/reader.html with ${EXHIBITS.length} entries from canonical data`);