// Derive review contexts and no-knowledge baselines from the trusted Product dist/census.
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
if (process.argv.length !== 5) throw new Error('Usage: node analyze.cjs PRODUCT CENSUS_OUT OUT');
const [product, censusDir, out] = process.argv.slice(2).map(p => path.resolve(p));
const { parse, parseFragment } = createRequire(path.join(product, 'package.json'))('parse5');
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const { article, learning, map } = read(path.join(censusDir, 'question-corpus.json'));
const { disclosures } = read(path.join(censusDir, 'census.json'));
const origin = 'https://gospod-bog.ru';
const attrs = (n) => Object.fromEntries((n?.attrs ?? []).map(x => [x.name, x.value]));
const skip = (n) => {
  const a = attrs(n);
  return /^(?:style|script|template|noscript|svg|nav|header|footer)$/.test(n?.tagName ?? '')
    || /\b(?:gtip|source-tooltip|fn-marker|gb-floater)\b/.test(a.class ?? '')
    || a['aria-hidden'] === 'true';
};
const txt = (n) => !n || skip(n) ? '' : n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(txt).join(' ');
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
// Flatten the markup emitted by the real runtime without inserting spaces at tag boundaries.
const textContent = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(textContent).join('');
const htmlText = html => clean(textContent(parseFragment(html)));
const rank = (n) => /^h[1-6]$/.test(n.tagName ?? '') ? Number(n.tagName.slice(1)) : null;
const pages = new Map();
function page(route) {
  if (pages.has(route)) return pages.get(route);
  const p = path.join(product,'dist',route.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(p)) return null;
  const items = [], ids = new Map();
  const scan = (n, parent=null, ignored=false) => {
    const muted = ignored || skip(n);
    if (n.tagName) {
      const x = { n, i: items.length, end: -1, muted, parent };
      items.push(x);
      if (attrs(n).id) {
        const id = attrs(n).id;
        if (!ids.has(id)) ids.set(id, []);
        ids.get(id).push(x);
      }
      for (const child of n.childNodes ?? []) scan(child, x, muted);
      x.end = items.length;
    } else {
      for (const child of n.childNodes ?? []) scan(child, parent, muted);
    }
  };
  scan(parse(fs.readFileSync(p, 'utf8')));
  const body = { items, ids };
  pages.set(route, body);
  return body;
}
const content = (x) => !x.muted && /^(?:h[1-6]|p|li|blockquote|figcaption|dt|dd|th|td)$/.test(x.n.tagName);
function context(route, href) {
  if (!href) return { state:'absent' };
  const url = new URL(href, origin+route);
  if (url.origin !== origin) return {state:'external', href:url.href};
  const id = decodeURIComponent(url.hash.slice(1));
  const p = page(url.pathname);
  if (!p) return {state:'missing-page', href:url.pathname+url.hash};
  const targets = p.ids.get(id) ?? [];
  if (targets.length !== 1) return {state:targets.length?'ambiguous':'missing', id, route:url.pathname};
  const target = targets[0];
  // Some owners put the id on a section or a wrapper instead of its heading.
  const heading = rank(target.n) ? target : p.items.slice(target.i, target.end).find(x => !x.muted && rank(x.n));
  let from = heading?.i ?? target.i, end = target.end;
  if (heading) {
    const until = p.items.slice(from + 1).find(x => !x.muted && rank(x.n) && rank(x.n) <= rank(heading.n));
    end = until?.i ?? p.items.length;
  }
  const blocks = p.items.slice(from, end).filter(content).map(x => clean(txt(x.n))).filter(Boolean);
  return {
    state:'ok', route:url.pathname, id, tag:target.n.tagName, heading:heading ? clean(txt(heading.n)) : null,
    // Review aid only: may include summary boxes and is not an entailment check.
    context:blocks.slice(0, 60).join('\n').slice(0, 10000),
  };
}
const pane = learning.map(q => ({
  id:q.id, family:'panel', q:q.question, options:q.answers, correct:q.correctIndex, explanation:q.explanation,
  link:context('/articles/dzhon-gill-chast-2-uchenyi/', q.sourceHref), relatedPageId:q.relatedPageId,
}));
const maps = map.map(q => ({
  id:q.id, family:'map', topic:q.topic, q:q.question, options:q.options, correct:q.correctIndex,
  explanation:q.explanation, link:{state:q.source?'label-only':'absent',label:q.source??null},
}));
const cards = disclosures.flatMap(r=>r.questions.map((q,i)=>({
  id:`${r.route}#q${i+1}`, family:'cards', route:r.route, q:q.summary,
  options:q.options.map(x=>x.text), correct:q.correct, explanation:q.explanation, link:{state:'absent'},
})));
function longestIndex(options) {
  return options.reduce((best, value, i) => value.length > options[best].length ? i : best, 0);
}
function randomDistribution(optionsCounts) {
  let mass = [1];
  for (const count of optionsCounts) {
    const p = 1/count;
    const next = Array(mass.length+1).fill(0);
    mass.forEach((v,i)=>{ next[i]+=v*(1-p); next[i+1]+=v*p; });
    mass = next;
  }
  return mass;
}
async function run() {
  // Use the actual runtime for tier selection, not a reimplementation of min/max precedence.
  const { renderQuizRich, normalizeQuizExplanation, selectQuizResult } = await import('data:text/javascript,' + encodeURIComponent(fs.readFileSync(path.join(product, 'src/runtime/article-quiz.js'), 'utf8')));
  const readable = s => {
    const el = {};
    renderQuizRich(el, String(s ?? ''));
    return htmlText(el.innerHTML);
  };
  const native = article.flatMap(r => r.questions.map((q, i) => ({
    id:`${r.route}#q${i+1}`, authoredId:q.id ?? null, family:'article', route:r.route,
    q:readable(q.question ?? q.q), options:q.options.map(readable), correct:q.correct,
    explanation:Object.values(normalizeQuizExplanation(q.explanation)).map(readable).filter(Boolean).join('\n'),
    link:context(r.route, q.sourceRef?.href ?? (typeof q.sourceRef==='string' ? q.sourceRef : null)),
  })));
  const rows = article.map(r => {
    const qs = native.filter(q => q.route===r.route);
    const picked = qs.map(q=>longestIndex(q.options));
    const n = qs.length, results = Array.from({length:n+1}, (_,i)=>selectQuizResult(r,i,n));
    const top = results[n], mass = randomDistribution(qs.map(q=>q.options.length));
    const tops = results.map((r,i)=>r===top?i:null).filter(i=>i!==null);
    const score = (picks) => picks.filter((p,i)=>qs[i].correct===p).length;
    const lengthScore = score(picked), secondScore = score(qs.map(()=>1));
    return {route:r.route, questions:n, customTierCount:r.scores?.length??0,
      longestPicksZeroBased:picked, lengthScore, secondScore,
      lengthTitle:readable(results[lengthScore].title), lengthDescription:readable(results[lengthScore].desc),
      topTitle:readable(top.title), topScores:r.scores?.length?tops:[n],
      topByLength:r.scores?.length?results[lengthScore]===top:lengthScore===n,
      topBySecond:r.scores?.length?results[secondScore]===top:secondScore===n,
      // Independent uniform guesses; not a learner or guessing-behaviour model.
      uniformTopProbability:r.scores?.length?tops.reduce((p,i)=>p+mass[i],0):mass[n],
      uniformExpectedScore:qs.reduce((s,q)=>s+1/q.options.length,0),
      soloUniqueLongestCorrect:qs.filter(q=>q.options[q.correct].length===Math.max(...q.options.map(a=>a.length))&& q.options.filter(a=>a.length===q.options[q.correct].length).length===1).length,
    };
  });
  fs.mkdirSync(out,{recursive:true});
  const data = [...native, ...pane, ...maps, ...cards];
  const save = (name,obj)=>fs.writeFileSync(path.join(out,name), JSON.stringify(obj,null,2)+'\n');
  save('review-contexts.json',data);
  save('score-baselines.json',rows);
  const counts=Object.create(null);
  for (const q of data) { const k=q.family+':'+q.link.state; counts[k]=(counts[k]??0)+1; }
  console.log({ questions:data.length, linkStates:counts, lengthCorrect:rows.reduce((s,r)=>s+r.lengthScore,0), secondCorrect:rows.reduce((s,r)=>s+r.secondScore,0), lengthTop:rows.filter(r=>r.topByLength).map(r=>r.route), expectedUniform:rows.reduce((s,r)=>s+r.uniformExpectedScore,0)});
}
run().catch(e=>{ console.error(e); process.exitCode=1; });
