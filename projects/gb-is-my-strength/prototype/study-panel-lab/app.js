/* ============================================================================
   «На полях» — isolated study panel runtime
   All content comes from the real article DOM and the repository's real data:
   data/bible-refs.json (apparatus of this article), data/glossary.json,
   data/bible-context.json (local verse corpus). No external services.
   ========================================================================== */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const inlineEm = (s) => esc(s).replace(/&lt;em&gt;/g, '<em>').replace(/&lt;\/em&gt;/g, '</em>');
  // Real footnotes may contain <em>/<strong>/<br>. Everything else is escaped:
  // the lab never injects untrusted markup into the margin.
  const richText = (html) => esc(html)
    .replace(/&lt;(\/?)(em|i|strong|b)&gt;/g, '<$1$2>')
    .replace(/&lt;br\s*\/?&gt;/g, '<br>');
  const norm = (s) => String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/[‐‑‒–—−]/g, '-').replace(/\s+/g, ' ').trim();

  const shell = $('#labShell');
  const center = $('#labCenter');
  const article = $('.article-body');
  const rightPanel = $('#labRight');
  const leftPanel = $('#labLeft');
  const deskEl = $('#labDesk');
  const ctxEl = $('#labContext');
  const pinnedEl = $('#labPinned');
  const tip = $('#labTip');
  const toastEl = $('#labToast');
  const STORE = 'arena-study-lab:';

  const state = {
    theme: document.documentElement.getAttribute('data-lab-theme') || 'light',
    follow: true,
    desk: { mode: 'thread', key: null },
    pinned: [],
    // First paint mirrors the reference tool: ONE instrument open, the other
    // bands already folded to their icon rows. No stack of competing windows.
    collapsed: { context: true, brief: true, desk: false, pinned: false },
    ctxCounts: { total: 0, refs: 0, terms: 0, notes: 0 },
    tocQuiet: false,      // rail folded to a row of icons
    tocOpen: '',          // which section row is expanded in the TOC accordion
    tocQuery: '',
    activeRef: null,
    activeTerm: null,
    currentSection: 'Вступление',
    currentBlock: null,
    rate: 1,
    fontScale: 1,
    leading: 'normal',
    playing: false,
    expandedContext: false,
    graphFocus: null,
    indexQuery: '',
    notesQuery: '',
    tocQuery: '',
    mobile: window.matchMedia('(max-width:1199px)').matches,
    lastFocus: null,
  };

  let DATA = { refs: {}, terms: {}, context: {}, termCounts: [], series: {}, edition: null };
  let refOrder = [], refOcc = new Map(), blocks = [], sections = [], theses = [], notes = [], graph = { nodes: [], edges: [] };
  let tipTimer = null, toastTimer = null, rafPending = false, audioTimer = null, revealTimer = null;

  // ---------------------------------------------------------------- utilities
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.dataset.visible = 'true';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.dataset.visible = 'false'; }, 2400);
  }
  function svg(path, extra = '') {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}><path d="${path}"/></svg>`;
  }
  const ICON = {
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6l-1 6 3.5 3.5H6.5L10 10 9 4zM12 13.5V21"/></svg>',
    unpin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6l-1 6 3.5 3.5H6.5L10 10 9 4zM12 13.5V21M4 4l16 16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 6l6 6-6 6"/></svg>',
    jump: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
    compare: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M5 8l-3 4 3 4M19 8l3 4-3 4"/></svg>',
  };
  function plainText(node) {
    const clone = node.cloneNode(true);
    clone.querySelectorAll?.('.tooltip, .fn-marker, .lab-hidden, [aria-hidden="true"], script, style').forEach(n => n.remove());
    return String(clone.textContent || '').replace(/\s+/g, ' ').trim();
  }
  function firstSentence(text, max = 190) {
    const t = String(text || '').replace(/\s+/g, ' ').trim();
    const cut = t.search(/[.!?][\s«»"']/);
    let s = cut > 30 ? t.slice(0, cut + 1) : t.slice(0, max);
    if (s.length > max) s = s.slice(0, max).replace(/\s\S*$/, '') + '…';
    return s;
  }
  function clip(text, max = 150) {
    const t = String(text || '').replace(/\s+/g, ' ').trim();
    return t.length > max ? t.slice(0, max).replace(/\s\S*$/, '') + '…' : t;
  }
  function topOf(el) {
    const a = el.getBoundingClientRect(), b = center.getBoundingClientRect();
    return a.top - b.top + center.scrollTop;
  }
  function scrollToEl(el, behavior = 'smooth') {
    if (!el) return;
    center.scrollTo({ top: Math.max(0, topOf(el) - 26), behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : behavior });
  }

  // Line breaking must not leave an opening bracket alone at the end of a line:
  // a narrow no-break space ties «(» to the first word of the reference.
  function fixOpeningParens() {
    // A bracket and its reference must travel together: the line breaker happily
    // left «(» at the end of a line and started the next one with the verse.
    // Format characters do not stop it at an element boundary, so the «(» and the
    // button are wrapped in one nowrap span instead.
    const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
    const targets = [];
    let n;
    while ((n = walker.nextNode())) {
      const t = n.textContent;
      if (!/[\s\u00a0(]$/.test(t)) continue;
      const next = n.nextSibling;
      if (!next) continue;
      const btn = next.nodeType === 1 && next.classList.contains('bref') ? next : null;
      if (!btn) continue;
      targets.push(n);
    }
    for (const node of targets) {
      const btn = node.nextSibling;
      const m = node.textContent.match(/[\s\u00a0]\($/);
      if (!m) continue;
      const wrap = document.createElement('span');
      wrap.className = 'lab-nb';
      node.textContent = node.textContent.slice(0, m.index);
      const paren = document.createTextNode('\u00a0(');
      wrap.append(paren, btn);
      node.parentNode.insertBefore(wrap, node.nextSibling);
    }
  }

  // ---------------------------------------------------------------- theme / preferences
  function setTheme(t, save = true) {
    state.theme = t;
    document.documentElement.setAttribute('data-lab-theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    $$('#labSettings [data-theme]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.theme === t)));
    const names = { light: 'День', sepia: 'Сепия', dark: 'Ночь' };
    $$('#labThemeRight, #labThemeLeft').forEach(b => b.setAttribute('aria-label', `Тема: ${names[t]}. Переключить`));
    if (save) try { localStorage.setItem(STORE + 'theme', t); } catch (e) {}
    if (state.desk.mode === 'graph') renderDesk();
  }
  function cycleTheme() {
    const order = ['light', 'sepia', 'dark'];
    setTheme(order[(order.indexOf(state.theme) + 1) % order.length]);
    toast('Тема: ' + ({ light: 'день', sepia: 'сепия', dark: 'ночь' })[state.theme]);
  }
  function applyType() {
    shell.style.setProperty('--lab-font-scale', state.fontScale);
    shell.style.setProperty('--lab-leading', ({ compact: 1.55, normal: 1.76, relaxed: 1.95 })[state.leading]);
    $('#labFontValue').textContent = Math.round(state.fontScale * 100) + '%';
    $$('#labSettings [data-leading]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.leading === state.leading)));
    try {
      localStorage.setItem(STORE + 'fontScale', state.fontScale);
      localStorage.setItem(STORE + 'leading', state.leading);
    } catch (e) {}
  }

  // ---------------------------------------------------------------- panel state
  function isMobile() { return window.matchMedia('(max-width:1199px)').matches; }
  function syncPanels() {
    const l = shell.dataset.left, r = shell.dataset.right;
    const mobile = isMobile();
    $('#labLeftRestore').hidden = mobile || l !== 'closed';
    $('#labRightRestore').hidden = mobile || r !== 'closed';
    const backdropOpen = mobile && (l === 'open' || r === 'open');
    $('#labBackdrop').hidden = !backdropOpen;
    leftPanel.inert = l === 'closed';
    rightPanel.inert = r === 'closed';
    $$('.lab-mobile-bar button').forEach(b => {
      const a = b.dataset.action;
      b.dataset.active = (a === 'toc' && l === 'open') || (a === 'study' && r === 'open') || (a === 'audio' && state.playing) ? 'true' : 'false';
    });
  }
  function setLeft(open, focus = false) {
    shell.dataset.left = open ? 'open' : 'closed';
    if (isMobile() && open) shell.dataset.right = 'closed';
    $('#labLeftCollapse').setAttribute('aria-expanded', String(open));
    syncPanels();
    if (focus && open) $('#labToc a')?.focus();
  }
  function setRight(open, focus = false) {
    shell.dataset.right = open ? 'open' : 'closed';
    if (isMobile() && open) shell.dataset.left = 'closed';
    $('#labRightClose').setAttribute('aria-expanded', String(open));
    syncPanels();
    if (focus && open) $('#labRightClose')?.focus();
  }
  function closeOverlays() {
    toggleSeriesSwitch(false);
    $('#labSettings').hidden = true;
    $('#labSettingsBtn').setAttribute('aria-expanded', 'false');
    closeRatePill();
    hideTip(true);
  }
  function closeRatePill() {
    $('#labRatePop')?.classList.remove('is-open');
    $('#labRate')?.setAttribute('aria-expanded', 'false');
    $('#labPlay')?.setAttribute('aria-expanded', 'false');
  }
  // A manual open should never leave «Разбор» below the fold of the margin.
  function revealDesk() {
    const align = (settled = false) => {
      const sc = $('#labRightScroll'), band = $('[data-band="desk"]');
      if (!sc || !band) return;
      const a = sc.getBoundingClientRect(), b = band.getBoundingClientRect();
      // A band taller than the viewport is only *partly* visible: its head is on
      // screen while the material it just opened sits below the fold. Aligning such
      // a band to the top is the whole point of «opening» it.
      const tall = b.height > a.height * 0.8;
      if (!tall && b.top >= a.top && b.top < a.bottom - 48) return;
      // Tall band: put its own top against the top edge. A 96 px offset would keep
      // the head of the band visible and its body below the fold — the material
      // would look opened and still be unreachable.
      const target = tall ? 0 : Math.min(96, a.height * .25);
      sc.scrollTo({ top: Math.max(0, sc.scrollTop + (b.top - a.top) - target),
        behavior: !settled && !matchMedia('(prefers-reduced-motion:reduce)').matches ? 'smooth' : 'auto' });
    };
    clearTimeout(revealTimer);
    align();
    // Accordion rows above the desk animate for 300 ms. Measuring only on the
    // click frame races their collapsing height and can leave the newly opened
    // tool scrolled behind the fixed header. Re-measure once the geometry settles.
    revealTimer = setTimeout(() => align(true), 340);
  }

  // ---------------------------------------------------------------- build the real-text index
  function hydrateTerms() {
    const terms = Object.keys(DATA.terms);
    if (!terms.length) return;
    const aliasMap = [];
    for (const [canon, v] of Object.entries(DATA.terms)) {
      for (const a of new Set([canon, ...(v.aliases || [])])) {
        if (a.length >= 4) aliasMap.push({ alias: a, canon });
      }
    }
    aliasMap.sort((a, b) => b.alias.length - a.alias.length);
    const re = new RegExp('(?<![\\p{L}\\p{N}_])(' + aliasMap.map(a => a.alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\p{L}\\p{N}_])', 'giu');
    const used = Object.fromEntries(terms.map(t => [t, 0]));
    const perSection = new Set();
    const skipSel = 'button, a, .tooltip, .fn-marker, .summary-card, .notice, .faq-accordion, .related-articles, .quiz-wrapper, .article-header, h1, h2, h3, h4, figcaption';
    for (const p of $$('p', article)) {
      if (p.closest(skipSel)) continue;
      const sectionId = sectionOf(p);
      const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (n.parentElement && n.parentElement.closest(skipSel)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        const value = node.nodeValue;
        re.lastIndex = 0;
        let m, last = 0, frag = null;
        while ((m = re.exec(value))) {
          const hit = aliasMap.find(a => norm(a.alias) === norm(m[1]));
          const canon = hit?.canon;
          if (!canon || used[canon] >= 2 || perSection.has(sectionId + '|' + canon)) continue;
          frag = frag || document.createDocumentFragment();
          frag.appendChild(document.createTextNode(value.slice(last, m.index)));
          const btn = document.createElement('button');
          btn.type = 'button'; btn.className = 'lab-term'; btn.dataset.term = canon;
          btn.setAttribute('aria-label', `Понятие ${canon}: открыть определение на полях`);
          btn.textContent = m[1];
          frag.appendChild(btn);
          frag.__labHit = true;
          last = m.index + m[0].length;
          used[canon] += 1;
          perSection.add(sectionId + '|' + canon);
          break;
        }
        if (frag && frag.__labHit) {
          frag.appendChild(document.createTextNode(value.slice(last)));
          node.replaceWith(frag);
        }
      }
    }
  }

  function sectionOf(el) {
    const n = el?.closest?.('[data-lab-section]') || el;
    return { id: n?.dataset?.labSectionId || '', label: n?.dataset?.labSection || 'Вступление' };
  }

  function buildIndex() {
    // Sections, in document order, with a real verbatim quote from the first paragraph.
    const heads = $$('h2[id], h3[id], h4[id]', article);
    sections = heads.map(h => {
      let p = h.nextElementSibling, quote = '';
      while (p && !/^H[2-4]$/.test(p.tagName) && !quote) {
        if (p.tagName === 'P' && plainText(p).length > 45) quote = firstSentence(plainText(p));
        p = p.nextElementSibling;
      }
      return { id: h.id, label: plainText(h), level: +h.tagName[1], el: h, quote };
    });
    theses = $$('.summary-card__item .summary-card__text', article).map(li => plainText(li)).filter(Boolean);

    // A document-order section map: every prose element knows its real section.
    let cur = { id: '', label: 'Вступление' };
    for (const el of $$('h2, h3, h4, p, li, button.bref', article)) {
      if (/^H[2-4]$/.test(el.tagName) && el.id) cur = { id: el.id, label: plainText(el) };
      if (el.closest('.tooltip')) continue;
      el.dataset.labSection = cur.label;
      el.dataset.labSectionId = cur.id;
    }

    // Paragraph blocks: the atom used by auto-follow.
    blocks = $$('p', article).filter(p => !p.closest('.tooltip, .faq-accordion__body, .notice, .article-header, .quiz-wrapper, .related-articles'));
    blocks.forEach((p, i) => { p.dataset.labBlock = String(i); });

    // Real occurrences of scripture references + their real surrounding sentence fragment.
    refOcc = new Map();
    const brefs = $$('button.bref[data-ref]', article);
    brefs.forEach((btn, i) => {
      btn.dataset.labOcc = String(i);
      const key = btn.dataset.ref;
      const block = btn.closest('p') || btn.closest('li') || btn.parentElement;
      if (!refOcc.has(key)) refOcc.set(key, []);
      refOcc.get(key).push({ el: btn, block, section: sectionOf(btn) });
    });
    refOrder = [...refOcc.keys()];
    // snippets computed lazily, once
    for (const [key, occ] of refOcc) {
      for (const o of occ) {
        let text = plainText(o.block);
        const label = plainText(o.el);
        const at = text.indexOf(label);
        let snippet;
        if (at >= 0) {
          const a = Math.max(0, at - 76), b = Math.min(text.length, at + label.length + 96);
          snippet = (a ? '…' : '') + text.slice(a, b).trim() + (b < text.length ? '…' : '');
        } else snippet = text.slice(0, 165) + (text.length > 165 ? '…' : '');
        o.snippet = snippet;
        o.sectionLabel = o.section.label;
      }
    }
    buildGraph();
    buildNotes();
  }

  // Real footnotes of the article: 116 translator notes / bibliographic sources.
  // Nothing is generated: markup and wording are read straight from the article DOM.
  function buildNotes() {
    notes = $$('.fn-marker', article).map((marker, i) => {
      const tipEl = $('.tooltip', marker);
      const text = tipEl ? String(tipEl.textContent || '').replace(/\s+/g, ' ').trim() : '';
      const block = marker.closest('p') || marker.closest('li') || marker.parentElement;
      const sec = sectionOf(marker);
      const translator = marker.classList.contains('fn-trans') || /^Перев[.:]/.test(text);
      return {
        id: 'fn-' + (i + 1), n: i + 1, marker, tipEl,
        html: tipEl ? tipEl.innerHTML : '', text, block,
        section: sec.label, sectionId: sec.id,
        kind: translator ? 'Переводческое примечание' : 'Сноска и источник',
        snippet: firstSentence(plainText(block), 130),
      };
    }).filter(n => n.text);
  }
  // A heading's real span: itself plus every nested h3/h4 subsection until the
  // next heading of the same or higher level. The article nests «Оценка…» under
  // h4 subsections, so an exact-id match would wrongly report 0 materials.
  function sectionIds(id) {
    if (!id) return [''];
    const i = sections.findIndex(x => x.id === id);
    if (i < 0) return [id];
    const ids = [id], level = sections[i].level;
    for (let k = i + 1; k < sections.length; k++) {
      if (sections[k].level <= level) break;
      ids.push(sections[k].id);
    }
    return ids;
  }
  function sectionNotes(id) {
    const ids = new Set(sectionIds(id));
    return notes.filter(n => ids.has(n.sectionId));
  }
  function sectionRefs(id) {
    const ids = new Set(sectionIds(id));
    const out = new Set();
    for (const [key, occ] of refOcc) if (occ.some(o => ids.has(o.section.id))) out.add(key);
    return [...out];
  }
  function sectionTerms(id) {
    const out = new Set();
    const ids = new Set(sectionIds(id));
    const pars = $$('p', article).filter(p => ids.has(sectionOf(p).id)
      && !p.closest('.tooltip, .notice, .article-header, .related-articles, .faq-accordion'));
    if (!pars.length) return [];
    for (const [canon, v] of Object.entries(DATA.terms)) {
      const aliases = [canon, ...(v.aliases || [])].filter(a => a.length >= 4);
      if (!aliases.length) continue;
      const re = new RegExp('(?<![\\p{L}\\p{N}_])(' + aliases.map(a => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\p{L}\\p{N}_])', 'iu');
      if (pars.some(p => re.test(plainText(p)))) out.add(canon);
    }
    return [...out];
  }

  function buildGraph() {
    const terms = DATA.termCounts.map(t => t.term).filter(t => DATA.terms[t]);
    const aliasRe = {};
    for (const t of terms) {
      const aliases = [t, ...(DATA.terms[t].aliases || [])].filter(a => a.length >= 4);
      aliasRe[t] = new RegExp('(?<![\\p{L}\\p{N}_])(' + aliases.map(a => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\p{L}\\p{N}_])', 'iu');
    }
    const pairs = new Map();
    for (const p of $$('p', article)) {
      if (p.closest('.tooltip, .notice, .article-header')) continue;
      const text = plainText(p);
      const hit = terms.filter(t => aliasRe[t].test(text));
      for (let i = 0; i < hit.length; i++) for (let j = i + 1; j < hit.length; j++) {
        const k = [hit[i], hit[j]].sort().join('|');
        pairs.set(k, (pairs.get(k) || 0) + 1);
      }
    }
    const ordered = terms.slice().sort((a, b) => (DATA.termCounts.find(x => x.term === b)?.count || 0) - (DATA.termCounts.find(x => x.term === a)?.count || 0));
    const cx = 170, cy = 150;
    const nodes = ordered.map((t, i) => {
      const inner = i < 4;
      const ring = inner ? ordered.slice(0, 4) : ordered.slice(4);
      const idx = inner ? i : i - 4;
      const angle = (-Math.PI / 2) + (idx / ring.length) * Math.PI * 2 + (inner ? 0.35 : 0);
      const radius = inner ? 48 : 104;
      const count = DATA.termCounts.find(x => x.term === t)?.count || 1;
      return {
        term: t, count, inner,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        r: Math.min(11, 3.4 + Math.sqrt(count) * 1.45),
        label: shortLabel(t),
      };
    });
    const idxOf = Object.fromEntries(nodes.map((n, i) => [n.term, i]));
    const edges = [...pairs.entries()].map(([k, w]) => {
      const [a, b] = k.split('|');
      return { a: idxOf[a], b: idxOf[b], w };
    }).filter(e => e.a !== undefined && e.b !== undefined)
      .sort((a, b) => b.w - a.w).slice(0, 26);
    graph = { nodes, edges };
  }
  // Two labels used to be the SAME WORD («герменевтика» appeared twice: the term
  // itself and «христоцентрическая герменевтика» cut to a prefix), and the longest
  // names were cut to «христотелич…». The short label is the name minus the head
  // word of its own category, never a blind prefix.
  function shortLabel(t) {
    const words = String(t).split(/\s+/);
    if (words.length < 2) return t;
    const adj = words[0], noun = words.slice(1).join(' ');
    if (adj.length <= 9) return t; // «Ветхий Завет», «Новый Завет» already fit
    // Shorten the adjective, never the noun: «Х. герменевтика» collided with the
    // plain «герменевтика» node, and a blind prefix cut «христотелич…».
    const stem = adj.includes('-')
      ? adj.split('-').map(w => w.slice(0, 4)).join('.-')
      : adj.slice(0, 10);
    return `${stem}. ${noun}`;
  }

  // ---------------------------------------------------------------- tooltip
  let tipAnchor = null, tipToken = 0;
  function showTip(anchor, html) {
    const token = ++tipToken;
    tipAnchor = anchor;
    tip.innerHTML = html;
    tip.hidden = false;
    requestAnimationFrame(() => {
      if (token !== tipToken || tip.hidden) return;
      tip.dataset.visible = 'true';
      positionTip(anchor);
      anchor.setAttribute('aria-describedby', 'labTip');
    });
  }
  function positionTip(anchor) {
    if (!anchor || tip.hidden) return;
    const a = anchor.getBoundingClientRect();
    const w = tip.offsetWidth, h = tip.offsetHeight;
    const rightEdge = isMobile() ? window.innerWidth : (rightPanel.getBoundingClientRect().left || window.innerWidth);
    let x = a.left + a.width / 2 - w / 2;
    x = Math.max(10, Math.min(x, Math.max(10, rightEdge - w - 10)));
    let y = a.top - h - 10;
    if (y < 10) y = a.bottom + 10;
    if (y + h > window.innerHeight - 10) y = Math.max(10, window.innerHeight - h - 10);
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  function hideTip(now = false) {
    clearTimeout(tipTimer);
    const done = () => {
      ++tipToken;
      tip.dataset.visible = 'false';
      tipAnchor?.removeAttribute('aria-describedby');
      tipAnchor = null;
      if (now) tip.hidden = true;
      else setTimeout(() => { if (tip.dataset.visible !== 'true') tip.hidden = true; }, 160);
    };
    now ? done() : (tipTimer = setTimeout(done, 160));
  }
  function tipHtmlFor(el) {
    if (el.matches('.bref')) {
      const key = el.dataset.ref, text = DATA.refs[key];
      return `<span class="lab-tip__ref">${esc(key)} · Писание</span>
        <div class="lab-tip__text">${text ? esc(text) : 'Текст этого места не приведён в аппарате статьи.'}</div>
        <div class="lab-tip__hint">Нажмите — открыть на полях · Shift + нажатие — закрепить</div>`;
    }
    const t = DATA.terms[el.dataset.term];
    return `<span class="lab-tip__ref">Понятие · словарь сайта</span>
      <div class="lab-tip__text">${t ? inlineEm(t.definition) : 'Определение отсутствует.'}</div>
      <div class="lab-tip__hint">Нажмите — полное определение на полях</div>`;
  }

  // ---------------------------------------------------------------- desk: rendering
  function deskHeader(kicker, title, sub, actions = '', gloss = '') {
    return `<div class="lab-desk__kicker">${kicker}</div>
      ${gloss ? `<span class="lab-gloss" aria-hidden="true">${gloss}</span>` : ''}
      <h3 class="lab-desk__title">${title}</h3>
      ${sub ? `<p class="lab-desk__sub">${sub}</p>` : ''}
      ${actions ? `<div class="lab-desk__actions">${actions}</div>` : ''}`;
  }
  function pinAct(type, key, label) {
    const on = state.pinned.some(p => p.type === type && p.key === key);
    const full = !on && state.pinned.length >= PIN_LIMIT;
    return `<button class="lab-act" data-lab-action="pin" data-type="${type}" data-key="${esc(key)}" data-label="${esc(label)}" data-on="${on}" aria-pressed="${on}"${full ? ' aria-disabled="true" title="На полях уже ' + PIN_LIMIT + ' материалов"' : ''}>
      ${on ? ICON.unpin : ICON.pin}<span>${on ? 'Закреплено' : 'Закрепить'}</span></button>`;
  }
  // The band already names the current instrument: never print the same words twice.
  // Runs after EVERY desk re-render (search typing re-renders innerHTML too), hence
  // a MutationObserver in boot() as well as the direct call.
  function dedupeDeskKicker() {
    const bandLabel = $('#labDeskLabel');
    const kick = $('.lab-desk__kicker', deskEl);
    const norm = t => String(t || '').toLowerCase().replace(/\s+/g, ' ')
      .replace(/\b(статьи|статья)\b/g, '').replace(/[·—–-]/g, ' ').trim();
    const k = norm(kick && kick.textContent), b = norm(bandLabel && bandLabel.textContent);
    const dup = !!k && !!b && (k === b || k.startsWith(b) || b.startsWith(k));
    if (kick) kick.hidden = dup;
    const bandEl = $('.lab-band--desk');
    if (bandEl) bandEl.dataset.dup = dup ? '1' : '0';
  }

  function renderDesk() {
    const d = state.desk;
    // The kicker inside the material is a *kind*, the band is a *tool*: saying
    // «Указатель / Указатель» or «Издание / Издание» twice cost a whole line.
    // Band names stay short (a folded band is a 40 px row); the *material* inside
    // gets a different, longer kicker so nothing is printed twice.
    const labels = { verse: 'Писание', term: 'Понятие', note: 'Сноска', notes: 'Примечания',
      section: 'Раздел', thread: 'Ход статьи', graph: 'Сеть понятий', index: 'Указатель',
      compare: 'Сопоставление', help: 'Как пользоваться', edition: 'Издание' };
    $('#labDeskLabel').textContent = labels[d.mode] || 'Разбор';
    $('#labDeskMeta').textContent = d.mode === 'verse' ? `${refOrder.indexOf(d.key) + 1} / ${refOrder.length}`
      : d.mode === 'index' ? `${refOrder.length} ссылок · ${Object.keys(DATA.terms).length} понятий · ${notes.length} сносок`
      : d.mode === 'notes' ? `${notes.length} в статье` : '';
    $('#labDeskOrigin').textContent = d.mode === 'verse' ? 'текст articles/…/index.html'
      : d.mode === 'term' ? 'data/glossary.json'
      : d.mode === 'note' || d.mode === 'notes' ? 'аппарат сносок статьи'
      : d.mode === 'section' ? 'текст статьи'
      : d.mode === 'edition' ? 'data/series · реальные конфиги серий' : '';
    $$('button[data-mode]').forEach(b => b.dataset.active = String(b.dataset.mode === d.mode));
    syncInstrumentRail();
    if (d.mode === 'edition') renderEdition();
    else if (d.mode === 'verse') renderVerse(d.key);
    else if (d.mode === 'term') renderTerm(d.key);
    else if (d.mode === 'note') renderNote(d.key);
    else if (d.mode === 'notes') renderNotes();
    else if (d.mode === 'section') renderSection(d.key);
    else if (d.mode === 'thread') renderThread();
    else if (d.mode === 'graph') renderGraph();
    else if (d.mode === 'index') renderIndex();
    else if (d.mode === 'compare') renderCompare();
    else if (d.mode === 'help') renderHelp();
    dedupeDeskKicker();
    markActiveInText();
  }

  function renderVerse(key) {
    const text = DATA.refs[key];
    const occ = refOcc.get(key) || [];
    const ctx = DATA.context[key];
    const i = refOrder.indexOf(key);
    const nav = `<div class="lab-desk__nav">
        <button type="button" data-lab-action="refprev" aria-label="Предыдущее место Писания" ${i <= 0 ? 'disabled' : ''}>${ICON.left}</button>
        <span>${i + 1} / ${refOrder.length}</span>
        <button type="button" data-lab-action="refnext" aria-label="Следующее место Писания" ${i >= refOrder.length - 1 ? 'disabled' : ''}>${ICON.right}</button>
      </div>`;
    const actions = `${pinAct('verse', key, key)}
      <button class="lab-act" data-lab-action="jump" data-key="${esc(key)}">${ICON.jump}<span>К тексту</span></button>
      <button class="lab-act lab-act--bare" data-lab-action="trail" data-key="${esc(key)}">в статье: ${occ.length}</button>
      ${nav}`;
    let html = deskHeader('Место Писания', esc(key), `Приведено в аппарате статьи · упоминаний в тексте: ${occ.length}`, actions, glossNum(key, 'verse'));

    if (text) html += `<div class="lab-verse">${esc(text)}</div>
      <span class="lab-source">Источник: <b>аппарат библейских ссылок статьи</b>, по изданию «Оценка христоцентричной герменевтики». Текст воспроизведён без изменений.</span>`;
    else {
      const local = ctx?.verses?.find(v => v.cited)?.text;
      html += `<div class="lab-empty">Текст этого места не приведён в аппарате статьи.
        <small>${local ? 'Ниже — фрагмент из локального корпуса сайта.' : 'В локальном корпусе сайта это место также отсутствует. Прототип не подставляет выдуманный текст.'}</small></div>`;
      if (local) html += `<div class="lab-verse">${esc(local)}</div><span class="lab-source">Источник: <b>${esc(ctx.translation)}</b>, локальный корпус data/bible.</span>`;
    }

    // «Контекст стиха» — real neighbouring verses from the site's own corpus
    if (ctx && ctx.verses.length) {
      html += `<button class="lab-collapse" data-lab-action="context-toggle" aria-expanded="${state.expandedContext}">${chev()} Контекст: ${esc(ctx.book)} ${ctx.chapter}, стихи ${ctx.verses[0].n}–${ctx.verses[ctx.verses.length - 1].n}</button>
        <div class="lab-ctxverses ${state.expandedContext ? '' : 'lab-hidden'}">
          ${ctx.verses.map(v => `<p><span class="v">${v.n}</span><span data-cited="${v.cited}">${esc(v.text)}</span></p>`).join('')}
          <span class="lab-source">Источник: <b>${esc(ctx.translation)}</b> · data/bible. Выделено цитируемое место.</span>
        </div>`;
    } else {
      html += `<div class="lab-sub lab-sub--tight">Контекст стиха</div>
        <p class="lab-note">Для этого отрывка в локальном корпусе сайта нет соседних стихов. Доступен только текст, приведённый в аппарате статьи.</p>`;
    }

    // «Как автор использует этот текст» — original reverse-citation mechanic, real snippets
    html += `<div class="lab-sub">Как автор использует этот текст</div>`;
    if (occ.length) {
      html += `<ul class="lab-trail">${occ.slice(0, 6).map((o, n) => `
        <li class="lab-trail__item"><span class="lab-trail__n">${n + 1}</span>
          <div><button class="lab-trail__quote" data-lab-action="jumpocc" data-key="${esc(key)}" data-occ="${n}">«${esc(o.snippet)}»</button>
          <span class="lab-trail__sec">${esc(o.sectionLabel)} · перейти к абзацу</span></div>
        </li>`).join('')}</ul>`;
      if (occ.length > 6) html += `<p class="lab-note">Показано 6 из ${occ.length} упоминаний. Остальные — в указателе.</p>`;
    } else html += `<p class="lab-note">Упоминаний не найдено.</p>`;

    // co-cited refs in the same paragraph
    const siblings = (occ[0]?.block ? $$('button.bref[data-ref]', occ[0].block) : []).map(b => b.dataset.ref).filter(r => r !== key);
    const uniqueSiblings = [...new Set(siblings)];
    if (uniqueSiblings.length) {
      html += `<div class="lab-sub">Рядом в этом абзаце</div><div class="lab-chiplist">
        ${uniqueSiblings.slice(0, 8).map(r => `<button class="lab-chip" data-lab-action="openref" data-key="${esc(r)}">${esc(r)}</button>`).join('')}</div>`;
    }
    deskEl.innerHTML = html;
  }
  function chev() { return '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2l5 4-5 4" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'; }
  function glossNum(key, type) {
    const i = state.pinned.findIndex(p => p.type === type && p.key === key);
    return i >= 0 ? String(i + 1) : '';
  }

  function renderTerm(key) {
    const t = DATA.terms[key];
    if (!t) { deskEl.innerHTML = `<div class="lab-empty">Понятие не найдено в словаре.</div>`; return; }
    const occurrences = [];
    for (const p of $$('p', article)) {
      if (p.closest('.tooltip, .notice, .article-header')) continue;
      const text = plainText(p);
      const aliases = [key, ...(t.aliases || [])].filter(a => a.length >= 4);
      const re = new RegExp('(?<![\\p{L}\\p{N}_])(' + aliases.map(a => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\p{L}\\p{N}_])', 'iu');
      if (re.test(text)) occurrences.push({ el: p, text: firstSentence(text, 150), section: sectionOf(p).label });
    }
    const related = Object.entries(DATA.terms).filter(([k, v]) => k !== key && t.category && v.category === t.category).slice(0, 6);
    const actions = `${pinAct('term', key, key)}
      <button class="lab-act" data-lab-action="jumpterm" data-key="${esc(key)}">${ICON.jump}<span>К тексту</span></button>
      <button class="lab-act lab-act--bare" data-lab-action="graph">сеть понятий</button>`;
    let html = deskHeader('Словарь сайта · понятие', esc(key.charAt(0).toUpperCase() + key.slice(1)), t.category ? esc(t.category) : 'Богословский термин', actions, glossNum(key, 'term'));
    html += `<div class="lab-verse">${inlineEm(t.definition)}</div>
      <span class="lab-source">Источник: <b>data/glossary.json</b> репозитория сайта. Определение приведено без изменений.</span>`;
    if (t.detail) html += `<div class="lab-sub">Подробнее</div><div class="lab-verse" style="font-size:13.6px">${inlineEm(t.detail)}</div>`;
    html += `<div class="lab-sub">Где в статье</div>`;
    if (occurrences.length) {
      html += `<ul class="lab-trail">${occurrences.slice(0, 5).map((o, n) => `<li class="lab-trail__item">
        <span class="lab-trail__n">${n + 1}</span><div>
        <button class="lab-trail__quote" data-lab-action="jumptermocc" data-key="${esc(key)}" data-occ="${n}">«${esc(o.text)}»</button>
        <span class="lab-trail__sec">${esc(o.section)} · перейти к абзацу</span></div></li>`).join('')}</ul>`;
      html += `<p class="lab-note">Всего абзацев с этим понятием: <b>${occurrences.length}</b>. Фрагменты — дословные цитаты из статьи.</p>`;
    } else html += `<p class="lab-note">В тексте статьи понятие не встретилось.</p>`;
    if (related.length) html += `<div class="lab-sub">Близкие по разделу словаря</div><div class="lab-chiplist">${related.map(([k]) => `<button class="lab-chip" data-lab-action="openterm" data-key="${esc(k)}">${esc(k)}</button>`).join('')}</div>`;
    deskEl.innerHTML = html;
    deskEl._termOcc = occurrences;
  }

  function renderThread() {
    const activeId = sections.find(s => s.label === state.currentSection)?.id || '';
    let html = deskHeader('Структура автора', 'Пять тезисов автора', 'Дословно из раздела «Коротко» статьи', '', '');
    html += `<ol class="lab-theses">${theses.map(t => `<li>${esc(t)}</li>`).join('')}</ol>`;
    html += `<div class="lab-sub">Нить рассуждения</div>
      <div class="lab-thread">
        <svg class="lab-thread__rail" viewBox="0 0 18 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="9" y1="0" x2="9" y2="100" />
        </svg>
        <span class="lab-thread__bead" id="labThreadBead" aria-hidden="true"></span>
        ${sections.map((s, i) => `<button class="lab-thread__row" data-lab-action="section" data-id="${esc(s.id)}" data-lab-active="${s.id === activeId}">
          <span class="lab-thread__n">${String(i + 1).padStart(2, '0')} · ${levelWord(s.level)}</span>
          <span class="lab-thread__title">${esc(s.label)}</span>
          ${s.quote ? `<span class="lab-thread__quote">«${esc(s.quote)}»</span>` : ''}
        </button>`).join('')}
      </div>
      <p class="lab-note"><b>О разметке.</b> Заголовки и цитаты взяты дословно из статьи; нумерация и «нить» — аналитическая разметка прототипа, а не авторская структура. Никакие тезисы не сформулированы заново.</p>`;
    deskEl.innerHTML = html;
    updateThreadBead();
  }
  // In this article every heading is an h2/h3; calling an h3 «часть» was a leftover
  // from a two-tier sketch and read as a wrong claim about the author's structure.
  function levelWord(level) {
    return level <= 2 ? 'раздел' : level === 3 ? 'подраздел' : 'пункт';
  }
  function updateThreadBead() {
    const bead = $('#labThreadBead'), wrap = $('.lab-thread');
    if (!bead || !wrap) return;
    const row = $('.lab-thread__row[data-lab-active="true"]', wrap) || $('.lab-thread__row', wrap);
    if (!row) return;
    // A <circle> inside a stretched SVG (`preserveAspectRatio="none"`) is drawn as
    // a 18×300 ellipse — it read as an exclamation mark. An HTML dot keeps its shape.
    const top = row.getBoundingClientRect().top - wrap.getBoundingClientRect().top + row.offsetHeight / 2;
    bead.style.top = `${Math.max(4, top)}px`;
    bead.hidden = false;
  }

  function renderGraph() {
    const { nodes, edges } = graph;
    if (!nodes.length) { deskEl.innerHTML = '<div class="lab-empty">Понятия не найдены.</div>'; return; }
    let html = deskHeader('Совместная встречаемость', 'Что встречается вместе', 'Узлы — реальные термины словаря, встречающиеся в этой статье', '', '');
    html += `<div class="lab-graph__focus" id="labGraphFocus">${state.graphFocus ? esc(state.graphFocus) : 'Наведите на узел'}</div>
      <svg class="lab-graph" viewBox="0 0 340 300" role="img" aria-label="Граф совместной встречаемости богословских понятий в абзацах статьи">
        <g>${edges.map((e, i) => `<line class="edge" data-edge="${i}" x1="${nodes[e.a].x.toFixed(1)}" y1="${nodes[e.a].y.toFixed(1)}" x2="${nodes[e.b].x.toFixed(1)}" y2="${nodes[e.b].y.toFixed(1)}" data-a="${e.a}" data-b="${e.b}"/>`).join('')}</g>
        <g>${nodes.map((n, i) => `<circle class="node" data-node="${i}" cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r.toFixed(1)}" tabindex="0" role="button" aria-label="${esc(n.term)}, ${n.count} упоминаний"/>`).join('')}</g>
        <g>${nodes.map((n, i) => {
          const right = n.x >= 170;
          return `<text class="node-label" data-label="${i}" x="${(n.x + (right ? n.r + 5 : -n.r - 5)).toFixed(1)}" y="${(n.y + 3).toFixed(1)}" text-anchor="${right ? 'start' : 'end'}">${esc(n.label)}</text>`;
        }).join('')}</g>
      </svg>
      <div class="lab-legend">${nodes.map(n => `<button type="button" data-lab-action="openterm" data-key="${esc(n.term)}"><span>${esc(n.term)}</span><b>${n.count}</b></button>`).join('')}</div>
      <p class="lab-note"><b>Как построено.</b> Ребро означает, что два понятия встретились в одном абзаце статьи; размер узла — число упоминаний по <b>data/terms-list.json</b>. Это анализ реального текста, а не богословская классификация. Показано ${edges.length} наиболее частых связей из ${nodes.length} понятий.</p>`;
    deskEl.innerHTML = html;
    $$('.lab-graph .node, .lab-graph .node-label').forEach(el => {
      const i = +(el.dataset.node ?? el.dataset.label);
      el.addEventListener('mouseenter', () => focusGraphNode(i));
      el.addEventListener('mouseleave', () => focusGraphNode(null));
      el.addEventListener('focus', () => focusGraphNode(i));
      el.addEventListener('blur', () => focusGraphNode(null));
      el.addEventListener('click', () => openTerm(nodes[i].term));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTerm(nodes[i].term); } });
    });
  }
  function focusGraphNode(i) {
    state.graphFocus = i === null ? null : graph.nodes[i].term;
    const label = $('#labGraphFocus');
    if (label) label.textContent = state.graphFocus || 'Наведите на узел';
    $$('.lab-graph .edge').forEach(l => l.classList.toggle('is-hot', i !== null && (+l.dataset.a === i || +l.dataset.b === i)));
    $$('.lab-graph .node').forEach(n => n.classList.toggle('is-hot', i !== null && +n.dataset.node === i));
    $$('.lab-graph .node-label').forEach(n => n.classList.toggle('is-hot', i !== null && +n.dataset.label === i));
    $$('.lab-legend button').forEach(b => b.dataset.labActive = i !== null && b.dataset.key === state.graphFocus ? 'true' : '');
  }

  function renderIndex() {
    const q = norm(state.indexQuery);
    const refs = refOrder.filter(r => !q || norm(r).includes(q) || norm(DATA.refs[r] || '').includes(q));
    const terms = Object.keys(DATA.terms).filter(t => !q || norm(t).includes(q) || norm(DATA.terms[t].definition).includes(q));
    const secs = sections.filter(s => !q || norm(s.label).includes(q));
    const foundNotes = notes.filter(n => !q || norm(n.text).includes(q));
    let html = deskHeader('Все материалы', 'Всё, что можно открыть', `${refOrder.length} мест Писания · ${Object.keys(DATA.terms).length} понятий · ${sections.length} разделов · ${notes.length} сносок`, '', '');
    html += `<div class="lab-search">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input id="labIndexInput" type="search" placeholder="Ссылка, понятие, слово из стиха…" value="${esc(state.indexQuery)}" aria-label="Поиск по указателю статьи" autocomplete="off">
    </div><div class="lab-results">`;
    if (refs.length) html += `<div class="lab-sub" style="margin-top:4px">Писание · ${refs.length}</div>` + refs.slice(0, q ? 60 : 20).map(r => `<button class="lab-result" data-lab-action="openref" data-key="${esc(r)}"><span class="lab-result__kind">стих</span><span class="lab-result__title">${esc(r)}</span><span class="lab-result__n">${(refOcc.get(r) || []).length}</span></button>`).join('');
    if (terms.length) html += `<div class="lab-sub">Понятия · ${terms.length}</div>` + terms.map(t => `<button class="lab-result" data-lab-action="openterm" data-key="${esc(t)}"><span class="lab-result__kind">термин</span><span class="lab-result__title">${esc(t)}</span></button>`).join('');
    if (secs.length) html += `<div class="lab-sub">Разделы · ${secs.length}</div>` + secs.map(s => `<button class="lab-result" data-lab-action="opensection" data-key="${esc(s.id)}"><span class="lab-result__kind">раздел</span><span class="lab-result__title">${esc(s.label)}</span><span class="lab-result__n">обзор</span></button>`).join('');
    if (foundNotes.length) html += `<div class="lab-sub">Сноски и источники · ${foundNotes.length}</div>` + foundNotes.slice(0, q ? 40 : 8).map(n => `<button class="lab-result" data-lab-action="opennote" data-key="${esc(n.id)}"><span class="lab-result__kind">сноска</span><span class="lab-result__title">${esc(clip(n.text, 74))}</span><span class="lab-result__n">${n.n}</span></button>`).join('');
    if (q && foundNotes.length > 40) html += `<p class="lab-note">Показаны первые 40 сносок. Уточните запрос, чтобы сузить список.</p>`;
    if (!refs.length && !terms.length && !secs.length && !foundNotes.length) html += `<p class="lab-empty">Ничего не найдено.<small>Указатель ищет только по реальным материалам этой статьи.</small></p>`;
    if (!q && refs.length > 20) html += `<p class="lab-note">Показаны первые 20 мест Писания. Введите часть ссылки или слова из стиха, чтобы сузить список.</p>`;
    html += `</div>`;
    const oldScroll = $('.lab-results', deskEl)?.scrollTop || 0;
    deskEl.innerHTML = html;
    $('.lab-results', deskEl).scrollTop = oldScroll;
    const input = $('#labIndexInput');
    input?.addEventListener('input', e => {
      state.indexQuery = e.target.value;
      const pos = e.target.selectionStart;
      renderIndex();
      const next = $('#labIndexInput');
      next?.focus(); next?.setSelectionRange(pos, pos);
    });
    input?.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); $('.lab-result', deskEl)?.focus(); }
    });
  }

  function itemContent(p) {
    if (p.type === 'verse') {
      const text = DATA.refs[p.key];
      return { title: p.key, body: text ? esc(text) : '<em>Текст не приведён в аппарате статьи.</em>', source: 'Аппарат библейских ссылок статьи', kind: 'Писание' };
    }
    if (p.type === 'note') {
      const n = notes.find(x => x.id === p.key);
      return { title: n ? `Примечание ${String(n.n).padStart(2, '0')}` : p.key,
        body: n ? richText(n.html) : '', source: 'Аппарат сносок статьи', kind: 'Сноска' };
    }
    const t = DATA.terms[p.key];
    return { title: p.key, body: t ? inlineEm(t.definition) : '', source: 'data/glossary.json', kind: 'Понятие' };
  }
  // ---------------------------------------------------------------- compare: matrix, not a pair
  // Two columns were the ceiling: the shelf holds eight materials. What a reader
  // actually needs is (a) an overview of everything on the shelf, (b) where two
  // materials genuinely meet. Both are derived from the article, never invented.
  function materialSections(p) {
    // Every section a material really occurs in, in document order.
    const hit = new Map();
    if (p.type === 'verse') {
      for (const occ of (refOcc.get(p.key) || [])) {
        if (!occ.section || !occ.section.id) continue;
        if (!hit.has(occ.section.id)) hit.set(occ.section.id, occ.section.label || 'Вступление');
      }
    } else if (p.type === 'term') {
      sections.forEach(sec => {
        if (sectionTerms(sec.id).includes(p.key)) hit.set(sec.id, sec.label);
      });
    } else if (p.type === 'note') {
      const n = notes.find(x => x.id === p.key);
      if (n && n.sectionId) {
        const sec = sections.find(x => x.id === n.sectionId);
        hit.set(n.sectionId, sec ? sec.label : 'Раздел');
      }
    }
    return hit;
  }
  function comparePair(a, b) {
    const sa = materialSections(a), sb = materialSections(b);
    const shared = [...sa.keys()].filter(k => sb.has(k));
    const ta = a.type === 'term' ? DATA.terms[a.key] : null;
    const tb = b.type === 'term' ? DATA.terms[b.key] : null;
    const sameCategory = !!(ta && tb && ta.category && ta.category === tb.category);
    const sameKind = a.type === b.type;
    const reasons = [];
    if (shared.length) reasons.push(`оба встречаются в разделе «${shared.map(k => sa.get(k))[0]}»`);
    if (sameCategory) reasons.push(`оба понятия категории «${ta.category}»`);
    if (!shared.length && sameKind && !sameCategory) reasons.push('общего раздела в тексте нет — связь только по типу материала');
    return { shared, sameCategory, sameKind, reasons };
  }
  function renderCompare() {
    const list = state.pinned;
    if (list.length < 2) {
      deskEl.innerHTML = `<div class="lab-empty">Для сопоставления нужно два закреплённых материала.<small>Закрепите отрывок и понятие — затем откройте «Сравнение». Полка уже помнит, что вы закрепили.</small></div>`;
      return;
    }
    const acts = `<button class="lab-act lab-act--bare" data-lab-action="thread">${ICON.left}<span>Вернуться к ходу статьи</span></button>`;
    const html0 = deskHeader('Отношения на полке', 'Вся полка на одном экране',
      `${plural(list.length, ['материал', 'материала', 'материалов'])} · где каждый встречается в статье и с чем сходится`, acts, '');
    let html = html0;

    // -------- overview: grouped by section, in document order
    // A cross-tab matrix needs width the panel does not have: numbered columns
    // without names are unreadable. Grouping by section says the same thing —
    // "what meets where" — and stays legible at 390 px.
    const rows = list.map(p => ({ p, hit: materialSections(p) }));
    const groups = sections
      .map(sec => ({ sec, items: rows.filter(r => r.hit.has(sec.id)) }))
      .filter(g => g.items.length);
    const loose = rows.filter(r => !r.hit.size);
    const sectionsUsed = groups.length;
    // Three big cards ate 70 px of a 420 px column and repeated the line above.
    // One quiet meta line says the same and leaves the overview on one screen.
    const spread = rows.filter(r => r.hit.size > 1).length;
    html += `<p class="lab-compare__meta">
      <b>${list.length}</b> на полке · в <b>${sectionsUsed}</b> ${pluralWord(sectionsUsed, ['разделе', 'разделах', 'разделах'])} статьи${spread ? ` · <b>${spread}</b> встречается больше чем в одном` : ''}</p>`;
    html += `<div class="lab-sub">Где встречается каждый материал</div>`;
    html += `<ol class="lab-shelfmap">${groups.map(g => `<li class="lab-shelfmap__row">
        <button class="lab-shelfmap__sec" data-lab-action="jumpsection" data-key="${esc(g.sec.id)}" title="К тексту раздела">${esc(g.sec.label)}</button>
        <span class="lab-shelfmap__items">${g.items.map(r => `<button class="lab-chip lab-chip--tiny" data-lab-action="openshelf" data-key="${esc(r.p.key)}" data-type="${r.p.type}" title="${esc(r.p.label || r.p.key)}">${esc(r.p.label || r.p.key)}</button>`).join('')}</span>
      </li>`).join('')}</ol>`;
    if (loose.length) html += `<p class="lab-note" style="margin-top:6px"><b>Вне разделов:</b> ${loose.map(r => esc(r.p.label || r.p.key)).join(', ')} — материал есть в аппарате статьи, но не привязан к заголовку.</p>`;

    // -------- pairs: where the shelf really intersects
    const pairs = [];
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const r = comparePair(list[i], list[j]);
      pairs.push({ a: list[i], b: list[j], ...r, score: r.shared.length * 3 + (r.sameCategory ? 2 : 0) + (r.sameKind ? 1 : 0) });
    }
    pairs.sort((x, y) => y.score - x.score);
    const best = pairs.filter(x => x.score > 0);
    // When the whole shelf sits in one section there is exactly one honest thing
    // to say; printing three near-identical pairs would only look busy.
    const combos = new Set(best.map(x => x.shared.join('|')));
    html += `<div class="lab-sub">Где материалы сходятся</div>`;
    if (!best.length) {
      html += `<p class="lab-empty">Общих разделов у этих материалов нет.<small>Это не ошибка: цитаты и понятия могут стоять в разных местах статьи. Сопоставьте их вручную — ниже.</small></p>`;
    } else if (combos.size === 1 && best[0].shared.length === 1) {
      const only = best[0].shared[0];
      html += `<p class="lab-pair__verdict">Все ${plural(list.length, ['материал', 'материала', 'материалов'])} полки встречаются в одном разделе — «${esc(sections.find(s2 => s2.id === only)?.label || only)}». Внутри него они и соседствуют; других пересечений в статье нет.</p>`;
    } else {
      html += `<ol class="lab-pairs">${best.slice(0, 4).map(x => `<li class="lab-pair">
        <button class="lab-pair__open" data-lab-action="comparepair" data-a="${esc(x.a.key)}" data-at="${x.a.type}" data-b="${esc(x.b.key)}" data-bt="${x.b.type}">
          <span class="lab-pair__names">${esc(x.a.label || x.a.key)} <span aria-hidden="true">↔</span> ${esc(x.b.label || x.b.key)}</span>
          <span class="lab-pair__why">${esc(x.reasons[0] || 'близкие материалы полки')}</span>
        </button>
        <button class="lab-pin__btn" data-lab-action="unpin" data-key="${esc(x.a.key)}" data-type="${x.a.type}" aria-label="Открепить ${esc(x.a.label || x.a.key)}" title="Открепить"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      </li>`).join('')}</ol>`;
    }

    // -------- manual pair: any two materials, side by side, wording verbatim
    html += `<details class="lab-pairbox"><summary><span>Сопоставить два материала вручную</span><span class="lab-pairbox__hint">дословно, рядом</span></summary>
      <div class="lab-pairpick">
        <label>Первый<select id="labCompareA">${list.map((p, i) => `<option value="${i}"${i === 0 ? ' selected' : ''}>${esc(p.label || p.key)}</option>`).join('')}</select></label>
        <label>Второй<select id="labCompareB">${list.map((p, i) => `<option value="${i}"${i === 1 ? ' selected' : ''}>${esc(p.label || p.key)}</option>`).join('')}</select></label>
      </div>
      <div id="labCompareOut"></div>
      <p class="lab-note"><b>Демонстрационный режим.</b> Прототип сопоставляет только дословные материалы статьи и словаря: показывает, где они встречаются, и печатает их текст рядом. Интерпретация и выводы не формируются.</p>
      </details>`;
    deskEl.innerHTML = html;
    renderComparePair();
  }
  function renderComparePair() {
    const out = $('#labCompareOut', deskEl);
    if (!out) return;
    const ai = +($('#labCompareA', deskEl)?.value || 0), bi = +($('#labCompareB', deskEl)?.value || 1);
    const a = state.pinned[ai], b = state.pinned[bi];
    if (!a || !b) { out.innerHTML = ''; return; }
    if (ai === bi) { out.innerHTML = `<p class="lab-empty">Выбраны два одинаковых материала — возьмите разные.</p>`; return; }
    const A = itemContent(a), B = itemContent(b), rel = comparePair(a, b);
    const secs = (p) => { const m = materialSections(p); return m.size ? [...m.values()].join(', ') : 'раздел не определён'; };
    out.innerHTML = `<div class="lab-compare">
      <div class="lab-compare__col"><span class="lab-result__kind">${A.kind} · 01</span><h4>${esc(A.title)}</h4><p>${A.body}</p><span class="lab-source">${esc(A.source)}</span><span class="lab-source">Разделы: ${esc(secs(a))}</span></div>
      <div class="lab-compare__col"><span class="lab-result__kind">${B.kind} · 02</span><h4>${esc(B.title)}</h4><p>${B.body}</p><span class="lab-source">${esc(B.source)}</span><span class="lab-source">Разделы: ${esc(secs(b))}</span></div>
    </div>
    <p class="lab-pair__verdict">${esc(rel.shared.length ? `Общий раздел: «${rel.shared.map(k => sections.find(s => s.id === k)?.label || k).join('», «')}».` : 'Общих разделов нет.')}</p>`;
  }

  // ------------------------------------------------- real footnotes, section overview, help
  function currentSectionObj() {
    return sections.find(s => s.label === state.currentSection) || { id: '', label: 'Вступление', quote: '' };
  }
  function noteNav(n) {
    const i = notes.findIndex(x => x.id === n.id);
    return `<div class="lab-desk__nav">
      <button type="button" data-lab-action="noteprev" aria-label="Предыдущая сноска" ${i <= 0 ? 'disabled' : ''}>${ICON.left}</button>
      <span>${i + 1} / ${notes.length}</span>
      <button type="button" data-lab-action="notenext" aria-label="Следующая сноска" ${i >= notes.length - 1 ? 'disabled' : ''}>${ICON.right}</button>
    </div>`;
  }
  function renderNote(key) {
    const n = notes.find(x => x.id === key);
    if (!n) { deskEl.innerHTML = `<div class="lab-empty">Сноска не найдена.</div>`; return; }
    const label = `Примечание ${String(n.n).padStart(2, '0')}`;
    const actions = `${pinAct('note', n.id, label)}
      <button class="lab-act" data-lab-action="jumpnote" data-key="${esc(n.id)}">${ICON.jump}<span>К тексту</span></button>
      <button class="lab-act lab-act--bare" data-lab-action="notes">все сноски</button>
      ${noteNav(n)}`;
    let html = deskHeader(n.kind, label, `${n.section} · аппарат статьи`, actions, glossNum(n.id, 'note'));
    html += `<div class="lab-verse lab-verse--note">${richText(n.html)}</div>
      <span class="lab-source">Источник: <b>аппарат сносок статьи</b>. Приведено дословно, без сокращений и пересказа.</span>`;
    html += `<div class="lab-sub">Где в статье</div>
      <ul class="lab-trail"><li class="lab-trail__item"><span class="lab-trail__n">1</span><div>
        <button class="lab-trail__quote" data-lab-action="jumpnote" data-key="${esc(n.id)}">«${esc(n.snippet)}»</button>
        <span class="lab-trail__sec">${esc(n.section)} · перейти к абзацу</span></div></li></ul>`;
    const siblings = sectionNotes(n.sectionId).filter(x => x.id !== n.id).slice(0, 8);
    if (siblings.length) html += `<div class="lab-sub">Другие сноски раздела</div><div class="lab-chiplist">${siblings.map(x => `<button class="lab-chip" data-lab-action="opennote" data-key="${esc(x.id)}">№ ${x.n}</button>`).join('')}</div>`;
    html += `<p class="lab-note"><b>О разметке.</b> Нумерация и заголовок «Примечание» принадлежат прототипу; сам текст сноски — дословный фрагмент статьи.</p>`;
    deskEl.innerHTML = html;
  }

  function renderNotes() {
    const q = norm(state.notesQuery);
    const list = notes.filter(n => !q || norm(n.text).includes(q) || norm(n.section).includes(q));
    let html = deskHeader('Аппарат сносок', 'Сноски и источники', `${notes.length} примечаний · дословно из аппарата статьи`, '', '');
    html += `<div class="lab-search">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input id="labNotesInput" type="search" placeholder="Автор, книга, слово из сноски…" value="${esc(state.notesQuery)}" aria-label="Поиск по сноскам статьи" autocomplete="off">
    </div><div class="lab-results lab-note-results">`;
    if (list.length) html += list.slice(0, 40).map(n => `<button class="lab-note-row" data-lab-action="opennote" data-key="${esc(n.id)}">
      <span class="lab-note-row__n">${String(n.n).padStart(2, '0')}</span>
      <span class="lab-note-row__body"><span class="lab-note-row__text">${esc(clip(n.text, 170))}</span>
      <span class="lab-note-row__sec">${esc(n.kind)} · ${esc(n.section)}</span></span></button>`).join('');
    else html += `<p class="lab-empty">Ничего не найдено.<small>Поиск идёт только по реальным сноскам статьи.</small></p>`;
    if (list.length > 40) html += `<p class="lab-note">Показаны первые 40 из ${list.length}. Уточните запрос, чтобы сузить список.</p>`;
    html += `</div><p class="lab-note"><b>Источник.</b> Каждая сноска прочитана из DOM реальной статьи; новые библиографические описания не создаются.</p>`;
    const oldScroll = $('.lab-results', deskEl)?.scrollTop || 0;
    deskEl.innerHTML = html;
    $('.lab-results', deskEl).scrollTop = oldScroll;
    $('#labNotesInput')?.addEventListener('input', e => {
      state.notesQuery = e.target.value;
      const pos = e.target.selectionStart;
      renderNotes();
      const next = $('#labNotesInput');
      next?.focus(); next?.setSelectionRange(pos, pos);
    });
    $('#labNotesInput')?.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); $('.lab-note-row', deskEl)?.focus(); }
    });
  }

  function renderSection(key) {
    const s = key ? (sections.find(x => x.id === key) || currentSectionObj()) : currentSectionObj();
    const refs = sectionRefs(s.id), terms = sectionTerms(s.id), sn = sectionNotes(s.id);
    const actions = `<button class="lab-act" data-lab-action="jump-section" data-key="${esc(s.id)}">${ICON.jump}<span>К тексту раздела</span></button>
      <button class="lab-act" data-lab-action="notes">Сноски раздела</button>
      ${refs.length ? `<button class="lab-act" data-lab-action="pinall" data-key="${esc(s.id)}">${ICON.pin}<span>Закрепить ${refs.length > 1 ? 'все ' + refs.length : 'место'}</span></button>` : ''}
      <button class="lab-act lab-act--bare" data-lab-action="thread">ход статьи</button>`;
    const sub = key ? 'Выбран в указателе · не меняется при прокрутке' : 'Следует за разделом, который вы читаете';
    let html = deskHeader('Материалы раздела', esc(s.label || 'Вступление'), sub, actions, '');
    html += `<div class="lab-desk__stats">
      <div><b>${refs.length}</b><span>мест Писания</span></div>
      <div><b>${terms.length}</b><span>понятий</span></div>
      <div><b>${sn.length}</b><span>сносок</span></div>
    </div>`;
    if (s.quote) html += `<div class="lab-sub">Первый абзац раздела</div><blockquote class="lab-section-quote">«${esc(s.quote)}»</blockquote><span class="lab-source">Дословная цитата из статьи.</span>`;
    else if (!refs.length && !terms.length && !sn.length) html += `<p class="lab-empty">Это вступление перед первым заголовком.<small>Выберите раздел в оглавлении или указателе — здесь появятся его реальные материалы.</small></p>`;
    if (refs.length) html += `<div class="lab-sub">Места Писания в разделе</div><div class="lab-chiplist">${refs.slice(0, 12).map(r => `<button class="lab-chip" data-lab-action="openref" data-key="${esc(r)}">${esc(r)}</button>`).join('')}</div>`;
    if (terms.length) html += `<div class="lab-sub">Понятия в разделе</div><div class="lab-chiplist">${terms.slice(0, 10).map(t => `<button class="lab-chip" data-lab-action="openterm" data-key="${esc(t)}">${esc(t)}</button>`).join('')}</div>`;
    if (sn.length) html += `<div class="lab-sub">Примечания раздела</div><div class="lab-results lab-note-results">${sn.slice(0, 5).map(n => `<button class="lab-note-row" data-lab-action="opennote" data-key="${esc(n.id)}"><span class="lab-note-row__n">${String(n.n).padStart(2, '0')}</span><span class="lab-note-row__body"><span class="lab-note-row__text">${esc(clip(n.text, 130))}</span><span class="lab-note-row__sec">${esc(n.kind)}</span></span></button>`).join('')}</div>`;
    html += `<p class="lab-note"><b>Как построено.</b> Счётчики, списки и цитата получены из реального текста статьи и её аппарата. Аналитических выводов прототип не формирует.</p>`;
    deskEl.innerHTML = html;
  }

  // ------------------------------------------------- real series / book structure
  // Everything below reads data/series/*.json, which build.mjs transcribes from the
  // product's own data/series.json, heartSeriesData.ts and hardTextsSeriesConfig.ts.
  // No invented counts: progress minutes are the running sum of real reading times.
  function editionTitle() {
    const items = DATA.series;
    if (!items) return '';
    const e = DATA.edition;
    if (!e || e.key === 'article') return 'Статья вне серии';
    const s = items[e.key];
    if (!s) return 'Статья вне серии';
    if (s.shape === 'book') {
      const chapter = s.items.find(i => i.tier === 'chapter' && (i.id === e.chapter));
      return chapter ? `${s.title} · ${chapter.title}` : s.title;
    }
    return s.title;
  }
  // Russian plural forms: «1 статья / 2 статьи / 5 статей» — never «10 часть».
  function pluralWord(n, forms) {
    const a = Math.abs(n) % 100, b = a % 10;
    return a > 10 && a < 20 ? forms[2] : b === 1 ? forms[0] : b >= 2 && b <= 4 ? forms[1] : forms[2];
  }
  function plural(n, forms) { return `${n} ${pluralWord(n, forms)}`; }
  function seriesChapterOf(s, itemId) {
    const it = s.items.find(i => i.id === itemId);
    if (!it || !it.parent) return null;
    return s.items.find(i => i.id === it.parent) || null;
  }
  // A band collapses to ONE slim row: glyph · label · live count · chevron.
  // The body and every secondary control fold away, so nothing can ever stack
  // into a second toolbar. Reopening the desk always returns to the instrument
  // that follows the reading, never to a stale tab.
  // The header doubles as a status line: which section, what the current
  // paragraph carries, and whether the auto-follow is live. Clicking it is the
  // shortest way back into the context band — no hunting for the row.
  function renderHeadStrip() {
    const strip = $('#labHeadStrip');
    if (!strip) return;
    const quiet = bandsQuiet();
    const ctxOpen = !state.collapsed.context;
    const show = quiet || !ctxOpen;
    document.documentElement.dataset.labStrip = String(show);
    strip.hidden = !show;
    if (!show) return;
    // No section name: the headline right above already carries it. The strip
    // is pure status — what this paragraph holds and whether follow is live.
    const n = (state.ctxCounts && state.ctxCounts.total) || 0;
    const what = n ? `<b>${plural(n, ['материал', 'материала', 'материалов'])}</b> у абзаца` : '<b>Чистый абзац</b> · без аппарата';
    strip.dataset.follow = String(!!state.follow);
    strip.innerHTML = `<span class="lab-head__strip-dot" aria-hidden="true"></span>
      <span class="lab-head__strip-text">${what}</span>
      <span class="lab-head__strip-chip">${state.follow ? 'следит' : 'пауза'}</span>
      <svg class="lab-head__strip-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5 6 8.5 10 4.5"/></svg>`;
    strip.setAttribute('aria-label', `${strip.textContent.trim()}. Слежение ${state.follow ? 'включено' : 'на паузе'}. ${ctxOpen ? 'Лента контекста раскрыта' : 'Раскрыть ленту «У этого абзаца»'}`);
    strip.title = 'Открыть ленту «У этого абзаца»';
  }
  function setBandCollapsed(band, force, focus = true) {
    if (!band) return;
    const collapsed = force === undefined ? band.dataset.collapsed !== 'true' : !!force;
    band.dataset.collapsed = String(collapsed);
    const toggle = band.querySelector('.lab-band__toggle');
    toggle?.setAttribute('aria-expanded', String(!collapsed));
    // Collapsing from the keyboard used to throw focus to <body> because the
    // focused control was inside the clipped body. The header is the stable
    // anchor: keep the reader on the row they just folded.
    if (document.activeElement && !toggle?.contains(document.activeElement)
        && document.activeElement.closest?.('.lab-band') === band
        && !band.querySelector('.lab-band__head')?.contains(document.activeElement)) {
      toggle?.focus({ preventScroll: true });
    }
    const key = band.dataset.band;
    if (key && key in state.collapsed) state.collapsed[key] = collapsed;
    try { localStorage.setItem(STORE + 'bands', JSON.stringify(state.collapsed)); } catch (e) {}
    const quiet = bandsQuiet();
    document.body.dataset.labQuiet = String(quiet);
    renderHeadStrip();
    $('#labQuiet')?.setAttribute('aria-pressed', String(quiet));
    if (!collapsed && key === 'context' && state.currentBlock) renderContext(state.currentBlock, sectionOf(state.currentBlock).label);
    if (!collapsed && key === 'brief') renderBrief();
    if (!collapsed && key === 'desk') {
      if (state.desk && state.desk.mode === 'edition') state.desk = { mode: 'thread', key: null };
      renderDesk();
      updateThreadBead();
    }
    // Only the visible spelling of a count should reach assistive tech.
    const meta = band.querySelector('.lab-band__meta');
    if (meta) {
      meta.querySelectorAll('.band-meta-full').forEach(e => e.setAttribute('aria-hidden', String(collapsed)));
      meta.querySelectorAll('.band-meta-short').forEach(e => e.setAttribute('aria-hidden', String(!collapsed)));
    }
    if (!collapsed && focus) focusBand(key);
  }
  // The pinned shelf is not part of the accordion, so it never counts as "quiet".
  function bandsQuiet() { return ['context', 'brief', 'desk'].every(k => !!state.collapsed[k]); }
  // One switch for the whole margin: every band folds to its icon row, or all open.
  function toggleAllBands(force) {
    const target = force === undefined ? !bandsQuiet() : !!force;
    // "Expand all" really means all: no accordion hand-off here.
    $$('.lab-band').forEach(b => { if (b.dataset.band !== 'pinned') setBandCollapsed(b, target, false); });
    toast(target ? 'Свёрнуто до строк — нажмите на ленту, чтобы раскрыть' : 'Все ленты раскрыты');
  }
  // The margin has three depths and one rule: only one band is "big" at a time.
  // Opening a band folds the other content bands, so the panel never becomes a
  // column of competing windows (the reader can still fold everything to icons).
  function focusBand(key) {
    $$('.lab-band').forEach(b => {
      if (b.dataset.band === key || b.dataset.band === 'pinned') return;
      if (b.dataset.collapsed !== 'true') setBandCollapsed(b, true);
    });
  }
  // No-op kept as a hook for render passes that want to refresh counts.
  function updateBandMeta() {}
  function toggleSeriesSwitch(force) {
    const el = $('#labSeriesSwitch');
    if (!el) return;
    const open = force === undefined ? el.hidden : force;
    el.hidden = !open;
    $('#labSeriesChip')?.setAttribute('aria-expanded', String(open));
  }
  function renderSeriesChip() {
    const text = $('#labSeriesChipText');
    const eyebrow = $('#labSeriesEyebrow');
    const e = DATA.edition;
    if (text) { text.textContent = editionTitle(); text.title = editionTitle(); }
    $('#labSeriesChip')?.setAttribute('title', editionTitle());
    if (eyebrow) {
      eyebrow.textContent = !e || e.key === 'article'
        ? 'Отдельная статья · Герменевтика'
        : `${e.key === 'heart' ? 'Книга' : 'Серия'} · ${DATA.series[e.key] ? DATA.series[e.key].title : ''}`;
    }
    $$('#labSeriesSwitch [data-lab-series]').forEach(b => {
      b.setAttribute('aria-pressed', String((e && e.key || 'article') === b.dataset.labSeries));
    });
    document.body.dataset.labEdition = (e && e.key) || 'article';
    const mark = $('#labEditionMark'), label = $('#labEditionText');
    if (mark && label) {
      const isBook = !!(e && e.key !== 'article' && DATA.series[e.key] && DATA.series[e.key].shape === 'book');
      const isSeries = !!(e && e.key !== 'article');
      mark.textContent = isBook ? 'КН' : isSeries ? 'СЕ' : 'СТ';
      label.textContent = isBook ? 'Книга' : isSeries ? 'Серия' : 'Статья';
      document.querySelector('#labEditionBtn')?.setAttribute('aria-pressed', String(isSeries));
    }
    const s = e && e.key !== 'article' ? DATA.series[e.key] : null;
    document.body.dataset.labSeriesTheme = s && s.theme ? s.theme : 'none';
  }

  function progressBar(done, part, total) {
    const pct = total ? Math.round((done / total) * 100) : 0;
    return `<div class="lab-ed-progress" aria-hidden="true"><i style="width:${pct}%"></i></div>`;
  }

  function renderEdition() {
    const e = DATA.edition || { key: 'article' };
    const s = e.key !== 'article' ? DATA.series[e.key] : null;
    const actions = `<button class="lab-act" data-lab-action="edition" data-key="article"><span>Статья вне серии</span></button>
      ${Object.entries(DATA.series).map(([key, v]) => `<button class="lab-act lab-act--bare" data-lab-action="edition" data-key="${esc(key)}">${esc(key === 'heart' ? 'Книга' : 'Серия')} · ${esc(v.title)}</button>`).join('')}`;
    let html = deskHeader('Формы издания', 'Статья, серия или книга', 'Одна архитектура полей для всех трёх форм издания', '', '');

    // 1. the form that is open right now
    html += `<div class="lab-sub">Сейчас открыто</div>
      <div class="lab-ed-now">
        <span class="lab-ed-now__kind">${s ? (s.shape === 'book' ? 'Книга' : 'Серия') : 'Отдельная статья'}</span>
        <p class="lab-ed-now__title">${esc(s ? s.title : 'Оценка христоцентричной герменевтики')}</p>
        <p class="lab-ed-now__place">${s
          ? (() => { const list = s.shape === 'book' ? s.items.filter(i => i.tier === 'article') : s.items;
              const i = list.findIndex(x => x.id === e.item);
              if (i < 0) return 'Открыта вся форма — часть ещё не выбрана.';
              if (s.shape === 'book') {
                const ch = (seriesChapterOf(s, e.item) || {}).title;
                return `<b>${esc(ch || 'Книга')}</b> · статья ${i + 1} из ${list.length}`;
              }
              return `<b>${esc(s.stepLabel || 'Часть')}</b> · ${i + 1} / ${list.length}`;
            })()
          : 'Отдельный текст вне серии.'}</p>
        <p class="lab-ed-now__sub">${s
          ? (s.shape === 'book'
            ? `${plural(s.items.filter(i => i.tier === 'chapter').length, ['глава', 'главы', 'глав'])} · ${plural(s.items.filter(i => i.tier === 'article').length, ['статья', 'статьи', 'статей'])} · ${s.totalMin} мин`
            : `${plural(s.items.length, s.stepLabel === 'Глава' ? ['глава', 'главы', 'глав'] : ['часть', 'части', 'частей'])} · ${s.items.reduce((n, i) => n + (i.minutes || 0), 0)} мин`)
          : 'Один текст без серии: аппарат ссылок, понятий и сносок тот же.'}</p>
      </div>`;

    // 2. the real parts of the chosen form — a picker, not a picture
    if (s) {
      const isBook = s.shape === 'book';
      const items = isBook ? s.items.filter(i => i.tier === 'article') : s.items;
      // The product numbers a book's articles inside each chapter (1…6 four
      // times), so a column of those numbers next to «Глава II» read as noise.
      // In the picker the number is the article's place in the whole book — the
      // same number the headline reports.
      const partBtn = (it, meta, markOverride) => {
        const isCur = (e.item === it.id);
        const mark = esc(markOverride ?? it.mark?.value ?? it.mark ?? it.roman ?? it.n);
        return `<li><button class="lab-ed-part${isCur ? ' is-current' : ''}" data-lab-action="editionpart" data-key="${esc(e.key)}" data-item="${esc(it.id)}"${isCur ? ' aria-current="true"' : ''}>
          <span class="lab-ed-part__mark">${mark}</span>
          <span class="lab-ed-part__title">${esc(it.title)}</span>
          <span class="lab-ed-part__meta">${meta}</span>
        </button></li>`;
      };
      html += `<div class="lab-sub">${isBook ? 'Статьи книги' : 'Части серии'}</div>`;
      if (isBook) {
        // Two tiers must *look* like two tiers. Repeating «Глава I. Диагноз сердца»
        // under all 22 articles printed the same line 22 times and hid the
        // structure it was meant to explain.
        const chapters = s.items.filter(i => i.tier === 'chapter');
        let n = 0;
        html += chapters.map(ch => {
          const arts = items.filter(a => (seriesChapterOf(s, a.id) || {}).id === ch.id);
          if (!arts.length) return '';
          const hasCur = arts.some(a => a.id === e.item);
          const mins = arts.reduce((m, a) => m + (a.minutes || 0), 0);
          return `<div class="lab-ed-group${hasCur ? ' is-current' : ''}">
            <p class="lab-ed-group__head"><span>${esc(ch.title)}</span><span>${plural(arts.length, ['статья', 'статьи', 'статей'])} · ${mins} мин</span></p>
            <ol class="lab-ed-parts">${arts.map(a => {
              n += 1;
              return partBtn(a, a.minutes ? `${a.minutes} мин` : '', n);
            }).join('')}</ol>
          </div>`;
        }).join('');
      } else {
        html += `<ol class="lab-ed-parts">${items.map((it, i) =>
          partBtn(it, `${i + 1} / ${items.length}${it.minutes ? ' · ' + it.minutes + ' мин' : ''}`)).join('')}</ol>`;
      }
      html += `<p class="lab-note" style="margin-top:4px">${isBook
        ? 'Две ступени: глава → статья. Крупная цифра — место статьи во всей книге, как в строке места над заголовком.'
        : 'Одна ступень: части идут подряд; выбранная часть — та, что открыта в этом издании.'}</p>`;
    }

    // 3. what this article looks like inside each real series
    html += `<div class="lab-sub">Как это выглядит в сериях</div><div class="lab-ed-forms">`;
    for (const [key, v] of Object.entries(DATA.series)) {
      const isOpen = (e.key === key);
      const target = isOpen && e.item ? v.items.find(i => i.id === e.item) : null;
      const chapter = isOpen && e.item ? seriesChapterOf(v, e.item) : null;
      if (v.shape === 'book') {
        html += `<button class="lab-ed-card${isOpen ? ' is-open' : ''}" data-lab-action="edition" data-key="${esc(key)}"${isOpen ? ' aria-current="true"' : ''}>
          <span class="lab-ed-card__label">Книга · ${esc(v.title)}</span>
          <span class="lab-ed-card__meta">${plural(v.items.filter(i => i.tier === 'chapter').length, ['глава', 'главы', 'глав'])} · ${plural(v.items.filter(i => i.tier === 'article').length, ['статья', 'статьи', 'статей'])}</span>
          ${isOpen && target && v.progress && v.progress[target.slug] ? (() => {
            const pr = v.progress[target.slug];
            const pct = Math.round((pr.doneMin / pr.totalMin) * 100);
            return `${progressBar(pr.doneMin, pr.partMin, pr.totalMin)}<span class="lab-ed-progress__lab">${pct}% книги · ${pr.doneMin} из ${pr.totalMin} мин · эта статья ${pr.partMin} мин</span>`;
          })() : ''}
          <span class="lab-ed-chapters">${v.items.filter(i => i.tier === 'chapter').map(c => `<span class="lab-ed-chapter${chapter && chapter.id === c.id ? ' is-current' : ''}"><i>${esc(c.mark.value)}</i><b>${esc(c.title.replace(/^Глава [IVXLC]+\.\s*/, ''))}</b><small>${plural(c.articles, ['статья', 'статьи', 'статей'])}</small></span>`).join('')}</span>
          <span class="lab-ed-card__hint">${isOpen && target ? 'Сейчас: ' + esc(chapter ? chapter.title : '') + ' · статья ' + esc(target.mark.value) : 'две ступени: глава → статья'}</span>
        </button>`;
      } else {
        html += `<button class="lab-ed-card${isOpen ? ' is-open' : ''}" data-lab-action="edition" data-key="${esc(key)}"${isOpen ? ' aria-current="true"' : ''}>
          <span class="lab-ed-card__label">Серия · ${esc(v.title)}</span>
          <span class="lab-ed-card__meta">${plural(v.items.length, ['часть', 'части', 'частей'])}${v.theme ? ' · тема «' + esc(v.theme) + '»' : ''}</span>
          <span class="lab-ed-marks">${v.items.map(it => `<span class="lab-ed-mark${target && target.id === it.id ? ' is-current' : ''}">${esc(it.mark || it.roman || it.n)}</span>`).join('')}</span>
          <span class="lab-ed-card__hint">${isOpen && target ? 'Сейчас: ' + esc(target.mark || target.roman) + ' · ' + esc(target.title) : 'одна ступень: части подряд'}</span>
        </button>`;
      }
    }
    html += `</div>`;

    // 4. what differs between the forms — and what must not
    html += `<div class="lab-sub">Что меняется, а что нет</div>
      <div class="lab-ed-rules">
        <div><b>Меняется</b><span>Шаг вперёд: часть серии или статья главы. Две ступени навигации для книги. Название издания и тема серии.</span></div>
        <div><b>Не меняется</b><span>Три ленты полей, автоследование, «Разбор», «Закреплено», указатель, сноски, обзор раздела, темы чтения и клавиатура.</span></div>
        <div><b>Уникальность серии</b><span>Только токены и фактура через <code>[data-series-theme]</code>. Геометрия полей остаётся общей — иначе каждая новая серия станет форком.</span></div>
      </div>
      <p class="lab-note"><b>Данные.</b> Состав серий и минут чтения прочитаны из реальных конфигов продукта (${Object.keys(DATA.series).length} записи в registry). Прототип не придумывает новые части, главы и тексты.</p>`;
    deskEl.innerHTML = html;
  }

  function renderHelp() {
    const rows = [
      ['/', 'Указатель: ссылки, понятия, слова стихов, разделы'],
      ['?', 'Эта справка'],
      ['Alt + 1 / 2', 'Свернуть или развернуть оглавление / поля'],
      ['Alt + Q', 'Свернуть все ленты до строк или раскрыть обратно'],
      ['Ctrl / ⌘ + K', 'То же, что «/»: указатель с фокусом в поле поиска'],
      ['↑ ↓ на ленте', 'Перейти к заголовку соседней ленты'],
      ['[ и ]', 'Предыдущее и следующее место Писания в «Разборе»'],
      ['Shift + клик', 'Сразу закрепить место Писания на полях'],
      ['Esc', 'Закрыть подсказку, настройки или выйти из поиска'],
    ];
    let html = deskHeader('Устройство лаборатории', 'Коротко о полях', 'Только реальные материалы статьи и словаря сайта', '', '');
    html += `<div class="lab-help">${rows.map(([k, v]) => `<div class="lab-help__row"><kbd>${esc(k)}</kbd><span>${esc(v)}</span></div>`).join('')}</div>`;
    // Every glyph in the rail, explained once. This is the "learning" surface:
    // a reader should never have to guess what a bare icon means.
    const rail = INSTRUMENTS.map(([mode, label, glyph]) => {
      const hint = TOOL_HINTS[mode] || '';
      return `<div class="lab-help__tool">
        <span class="lab-help__glyph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyph}</svg></span>
        <span><b>${esc(label)}</b>${hint ? `<small>${esc(hint)}</small>` : ''}</span>
      </div>`;
    }).join('');
    html += `<div class="lab-sub">${INSTRUMENTS.length} ${pluralWord(INSTRUMENTS.length, ['инструмент', 'инструмента', 'инструментов'])} внизу полей</div>
      <div class="lab-help__tools">${rail}</div>
      <p class="lab-note">Значки не прячут смысл: у каждого есть подпись при наведении, доступное имя для экранного диктора и своя строка здесь. Порядок не случайный — от «что следует за чтением» к «что я выбираю сам».</p>`;
    html += `<div class="lab-sub">Три разные области</div>
      <ul class="lab-help__list">
        <li><b>У этого абзаца</b> — следует за чтением, пока включено «следить»; больше ничего не меняет.</li>
        <li><b>Разбор</b> — открывается только по вашему действию и никогда не подменяется автоматически.</li>
        <li><b>Закреплено</b> — ваша память: остаётся на виду при любом переходе и прокрутке.</li>
      </ul>`;
    html += `<div class="lab-sub">Как свернуть поля</div>
      <ul class="lab-help__list">
        <li><b>Одна лента</b> — нажмите на её заголовок. Свёрнутая лента остаётся строкой в 41 px: значок, название, один честный счётчик.</li>
        <li><b>Все сразу</b> — три штриха в шапке полей или <kbd>Alt</kbd> + <kbd>Q</kbd>. Выбор запоминается между визитами.</li>
        <li><b>Раскрытие ленты</b> складывает остальные, чтобы на полях всегда была одна главная тема. «Закреплено» не сворачивается само никогда.</li>
      </ul>`;
    html += `<div class="lab-sub">Чего здесь нет</div>
      <p class="lab-note">Нет внешних сервисов, ИИ-пересказов, выдуманных цитат, текстов Писания и «интеграций». Озвучка — <b>демонстрационный синтезатор браузера</b>, сеть понятий и «ход статьи» — аналитическая разметка реального текста, а не авторская структура. Все настройки действуют только внутри этой лаборатории.</p>`;
    html += `<p class="lab-note"><b>Изоляция.</b> Исходный репозиторий не изменён; прототип живёт отдельно и не публикуется в продукт без отдельного запроса.</p>`;
    deskEl.innerHTML = html;
  }

  // Compact section digest: a second, slow-moving cue. It changes only when the
  // section changes, never on every paragraph like the auto-follow band.
  function renderBrief() {
    const s = currentSectionObj();
    const refs = sectionRefs(s.id), terms = sectionTerms(s.id), sn = sectionNotes(s.id);
    // a folded band must still read truthfully: "5 стихов · 3 понятия · 2 сноски"
    // Folded, the digest names whichever material this section actually has most of.
    const briefShort = refs.length ? plural(refs.length, ['стих', 'стиха', 'стихов'])
      : sn.length ? plural(sn.length, ['сноска', 'сноски', 'сносок'])
      : terms.length ? plural(terms.length, ['понятие', 'понятия', 'понятий'])
      : 'чистый раздел';
    $('#labBriefMeta').innerHTML = `<span class="band-meta-full">${refs.length} стих. · ${terms.length} понят. · ${sn.length} снос.</span>` +
      `<span class="band-meta-short">${briefShort}</span>`;
    let html = `<div class="lab-brief__stats">
      <button type="button" data-lab-action="opensection" data-key="${esc(s.id)}"><b>${refs.length}</b><span>стихов</span></button>
      <button type="button" data-lab-action="opensection" data-key="${esc(s.id)}"><b>${terms.length}</b><span>понятий</span></button>
      <button type="button" data-lab-action="notes"><b>${sn.length}</b><span>сносок</span></button>
    </div>`;
    const first = sn[0];
    if (first) html += `<p class="lab-brief__note"><span>${esc(first.kind)} · № ${first.n}</span>${esc(clip(first.text, 132))}</p>`;
    else if (refs.length || terms.length) html += `<p class="lab-brief__note"><span>Примечания</span>В этом разделе сносок нет.</p>`;
    else html += `<p class="lab-brief__note"><span>Начало статьи</span>Листайте текст — здесь появятся реальные счётчики раздела, ссылки и сноски.</p>`;
    html += `<button class="lab-brief__more" type="button" data-lab-action="opensection" data-key="${esc(s.id)}">Обзор раздела →</button>`;
    $('#labBrief').innerHTML = html;
  }

  // ---------------------------------------------------------------- pinned shelf
  // Pins are the reader's own memory, so they belong to the edition they were
  // made in and survive a reload. The shelf is stored per edition key: moving
  // between article / series / book never mixes up two different reading rooms.
  const PIN_LIMIT = 8;
  function pinStoreKey() { return STORE + 'pins:' + ((DATA.edition && DATA.edition.key) || 'article'); }
  function loadPins() {
    try {
      const raw = JSON.parse(localStorage.getItem(pinStoreKey()) || '[]');
      state.pinned = Array.isArray(raw)
        ? raw.filter(p => p && typeof p.key === 'string' && typeof p.type === 'string')
            .slice(0, PIN_LIMIT)
            .map(p => ({ type: p.type, key: p.key, label: String(p.label || p.key) }))
        : [];
    } catch (e) { state.pinned = []; }
  }
  function savePins() {
    try { localStorage.setItem(pinStoreKey(), JSON.stringify(state.pinned)); } catch (e) {}
  }
  function renderPinned() {
    $('#labPinnedCount').textContent = `${state.pinned.length} / ${PIN_LIMIT}`;
    syncInstrumentRail();
    rightPanel.style.setProperty('--lab-ribbon-h', (54 + Math.min(state.pinned.length, 6) * 11) + 'px');
    $('#labLyasse').setAttribute('aria-label', `Закреплённых материалов: ${state.pinned.length}. Перейти к списку`);
    $('#labLyasse').title = `Закреплено: ${state.pinned.length}`;
    // The shelf is per edition and persisted, so it has to say which room it is.
    const ed = (DATA.edition && DATA.edition.key) || 'article';
    const room = ed === 'article' ? 'этой статьи' : `издания «${esc(DATA.series[ed] ? DATA.series[ed].title : ed)}»`;
    if (!state.pinned.length) {
      pinnedEl.innerHTML = `<p class="lab-empty">Пока пусто.<small>Закрепите отрывок или понятие — оно останется на этой полке после переходов и перезагрузки. Полка своя для ${room}.</small></p>`;
      return;
    }
    pinnedEl.innerHTML = state.pinned.map((p, i) => `<div class="lab-pin">
      <span class="lab-pin__n">${i + 1}</span>
      <button class="lab-pin__label" data-lab-action="openpin" data-i="${i}" title="Открыть на полях">${esc(p.label)}</button>
      <button class="lab-pin__btn" data-lab-action="comparepin" data-i="${i}" aria-label="Сопоставить ${esc(p.label)} с первым материалом" title="Сопоставить">${ICON.compare}</button>
      <button class="lab-pin__btn" data-lab-action="unpin" data-i="${i}" aria-label="Открепить ${esc(p.label)}" title="Открепить">${ICON.close}</button>
    </div>`).join('') + `<p class="lab-note" style="margin-top:8px">Автоследование и ручной выбор не изменяют этот список. Сохраняется в браузере для ${room}.</p>`;
  }
  function togglePin(type, key, label) {
    const i = state.pinned.findIndex(p => p.type === type && p.key === key);
    if (i >= 0) { state.pinned.splice(i, 1); toast('Откреплено'); }
    else {
      if (state.pinned.length >= PIN_LIMIT) { toast(`На полях уже ${PIN_LIMIT} материалов — открепите один`); return; }
      state.pinned.push({ type, key, label }); toast('Закреплено на полях');
    }
    savePins();
    renderPinned();
    if (['verse', 'term', 'note', 'compare'].includes(state.desk.mode)) renderDesk();
  }

  // --------------------------------------------------------------- table of contents
  // The rail used to print every heading as one flat list, so a collapsed section
  // still cost three lines and the reader had to scroll a 533 px list to find the
  // ninth heading. Sections are now rows: one line each, with their subsections
  // nested and only the section being read unfolded. Folding is remembered.
  const TOC_STORE = () => STORE + 'toc';
  // The article mixes h2, h3 and h4. A heading is a subsection when a SHALLOWER
  // heading is open above it, which handles any mix without hard-coding levels.
  function tocGroups() {
    const out = [];
    for (const s of sections) {
      const item = { id: s.id, label: s.label, el: s.el, level: s.level, subs: [] };
      const last = out[out.length - 1];
      if (last && s.level > last.level) last.subs.push(item);
      else out.push(item);
    }
    return out;
  }
  function tocIndex() { return sections.findIndex(s => s.label === state.currentSection); }
  function renderToc() {
    const list = $('#labToc');
    if (!list) return;
    const groups = tocGroups();
    const q = norm(state.tocQuery);
    const activeId = sections[tocIndex()]?.id || '';
    let shown = 0;
    list.innerHTML = groups.map((g, i) => {
      const subs = g.subs.filter(s => !q || norm(s.label).includes(q));
      const hitParent = !q || norm(g.label).includes(q);
      if (q && !hitParent && !subs.length) return '';
      shown++;
      const open = !!q ? true : (state.tocOpen === g.id || (!state.tocOpen && g.id === activeId));
      const isActive = g.id === activeId;
      const subItems = g.subs.map(s => `<li class="lab-toc__sub${s.id === activeId ? ' is-current' : ''}"${q ? '' : ''}>
          <a href="#${esc(s.id)}" data-toc-link="${esc(s.id)}" title="${esc(s.label)}"${s.id === activeId ? ' aria-current="location"' : ''}>${esc(s.label)}</a>
        </li>`).join('');
      return `<li class="lab-toc__row${isActive ? ' is-current' : ''}${open ? ' is-open' : ''}" data-toc-row="${esc(g.id)}">
        <button type="button" class="lab-toc__head" data-toc-toggle="${esc(g.id)}" title="${esc(g.label)}" aria-expanded="${open}"${g.subs.length ? ` aria-controls="labTocSub${i}"` : ''}>
          <span class="lab-toc__dot" aria-hidden="true"></span>
          <span class="lab-toc__label">${esc(g.label)}</span>
          ${g.subs.length ? `<span class="lab-toc__n" aria-hidden="true">${g.subs.length}</span>
          <svg class="lab-toc__chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5 6 8.5 10 4.5"/></svg>` : ''}
        </button>
        ${g.subs.length ? `<div class="lab-toc__subs" id="labTocSub${i}"><ul class="lab-toc__inner">${subItems}</ul></div>` : ''}
      </li>`;
    }).join('');
    const empty = $('#labTocEmpty');
    if (empty) empty.hidden = shown > 0;
    $$('#labToc [data-toc-toggle]').forEach(btn => btn.addEventListener('click', e => {
      const id = btn.dataset.tocToggle;
      // a modifier click or the tiny chevron area still navigates; a plain click
      // on the row label jumps, and a click on the count/chevron folds
      const jumped = !e.target.closest('.lab-toc__n, .lab-toc__chev');
      if (jumped) {
        const target = document.getElementById(id);
        if (target) { scrollToEl(target); if (isMobile()) setLeft(false); }
      }
      if (btn.getAttribute('aria-controls')) toggleTocSection(id);
      else if (jumped) { state.tocOpen = id; renderToc(); }
    }));
    $$('#labToc .lab-toc__sub a').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href')?.slice(1);
      const target = id && document.getElementById(id);
      if (target) { e.preventDefault(); scrollToEl(target); if (isMobile()) setLeft(false); }
    }));
    syncTocScroll(activeId);
    fitToc();
  }
  // A tall rail has room for every subsection; a short one only for the section
  // being read. Measure instead of guessing: if the fully unfolded list still
  // fits above the audio pill, unfold everything — otherwise stay compact.
  function fitToc() {
    const sc = $('#labTocScroll'), list = $('#labToc');
    if (!sc || !list) return;
    // Measure the FULL height: with every group unfolded the list is taller than
    // the rail on every real screen, so this stays compact unless there is room.
    list.classList.add('is-roomy');
    const avail = sc.clientHeight;
    const full = list.getBoundingClientRect().height;
    const fits = full <= avail - 6;
    list.classList.toggle('is-roomy', fits);
    state.tocRoomy = fits;
  }
  // Follow the reading position: highlight the row (or its subsection), unfold
  // the row that owns it, and keep it inside the rail — without stealing the
  // reader's own choice when they have expanded another section by hand.
  function syncTocActive(secId) {
    const groups = tocGroups();
    const rowIdx = Math.max(0, groups.findIndex(g => g.id === secId || g.subs.some(x => x.id === secId)));
    const owner = groups[rowIdx];
    if (!owner) return;
    const rows = $$('#labToc [data-toc-row]');
    rows.forEach(r => {
      const gi = groups.findIndex(g => g.id === r.dataset.tocRow);
      r.classList.toggle('is-current', r.dataset.tocRow === owner.id);
      r.classList.toggle('is-passed', gi >= 0 && gi < rowIdx);
    });
    $$('#labToc .lab-toc__sub').forEach(li => {
      const a = li.querySelector('a');
      const id = a?.getAttribute('href')?.slice(1);
      const on = id === secId;
      li.classList.toggle('is-current', on);
      if (on) a?.setAttribute('aria-current', 'location'); else a?.removeAttribute('aria-current');
    });
    if (!state.tocQuery) {
      const row = rows.find(r => r.dataset.tocRow === owner.id);
      const wantsOpen = state.tocOpen ? state.tocOpen : owner.id;
      rows.forEach(r => {
        const on = r.dataset.tocRow === wantsOpen && !!r.querySelector('.lab-toc__subs');
        r.classList.toggle('is-open', on);
        r.querySelector('[data-toc-toggle]')?.setAttribute('aria-expanded', String(on));
      });
      if (row && !state.tocOpen) syncTocScroll(owner.id);
    }
  }
  // Keep the section being read inside the rail without yanking the whole list.
  function syncTocScroll(activeId) {
    const row = $(`#labToc [data-toc-row="${CSS.escape(activeId || '')}"]`);
    const sc = $('#labTocScroll');
    if (!row || !sc) return;
    const a = sc.getBoundingClientRect(), b = row.getBoundingClientRect();
    if (b.top < a.top + 4 || b.bottom > a.bottom - 4) {
      sc.scrollTo({ top: Math.max(0, sc.scrollTop + (b.top - a.top) - a.height / 2 + b.height / 2),
        behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
    }
  }
  function setTocQuiet(quiet) {
    state.tocQuiet = !!quiet;
    document.documentElement.dataset.labToc = quiet ? 'quiet' : 'full';
    const btn = $('#labLeftQuiet');
    btn?.setAttribute('aria-pressed', String(!!quiet));
    $('#labLeft')?.setAttribute('data-quiet', String(!!quiet));
    try { localStorage.setItem(TOC_STORE(), JSON.stringify({ quiet: !!quiet, open: state.tocOpen })); } catch (e) {}
  }
  function toggleTocSection(id) {
    state.tocOpen = state.tocOpen === id ? '' : id;
    try { localStorage.setItem(TOC_STORE(), JSON.stringify({ quiet: !!state.tocQuiet, open: state.tocOpen })); } catch (e) {}
    renderToc();
  }

  // ------------------------------------------------------------ instrument rail (desk)
  // The seven research instruments used to be a 3x2 grid of buttons under the
  // panel — a second toolbar that duplicated the apparatus links and stacked up
  // on narrow screens. They are now one compact row of glyphs: icon-only by
  // default, with an accessible name and a tooltip, so no width ever breaks.
  const INSTRUMENTS = [
    ['thread',  'Ход статьи',    '<path d="M4 5h12M4 12h12M4 19h8"/>'],
    ['section', 'Обзор раздела', '<path d="M5 3.5h6l4 4v9H5z"/><path d="M11 3.5V7.5h4"/>'],
    ['notes',   'Сноски',        '<path d="M6 3v18"/><path d="M10 7h8M10 12h8M10 17h5"/>'],
    ['index',   'Указатель',     '<path d="M4 6h16M6 12h12M8 18h8"/><circle cx="4" cy="12" r="1"/>'],
    ['graph',   'Сеть понятий',  '<circle cx="5.5" cy="6.5" r="2"/><circle cx="17" cy="8" r="2"/><circle cx="10" cy="17" r="2"/><path d="M7.3 7.1 15.1 7.8M6.6 8.4l2.7 6.7M16 9.6l-4.5 5.9"/>'],
    ['edition', 'Издание',       '<path d="M12 6.5C10 4.8 7 4.8 4 5.5v12c3-.7 6-.7 8 1 2-1.7 5-1.7 8-1v-12c-3-.7-6-.7-8 1z"/><path d="M12 6.5v12"/>'],
    ['compare', 'Сравнение',     '<path d="M12 3v18"/><path d="M6 7 3 12h6zM18 7l-3 5h6z"/>'],
  ];
  // One short line per glyph: used by the tooltip, the accessible description
  // and the help legend — three places, one source of truth.
  const TOOL_HINTS = {
    thread: 'Пять тезисов, нить разделов и бусина текущего раздела',
    section: 'Счётчики, цитата и аппарат всего раздела',
    notes: '116 примечаний статьи с поиском по автору и книге',
    index: 'Поиск по ссылкам, понятиям, словам стихов и разделам',
    graph: 'Понятия, которые встречаются в одних абзацах',
    edition: 'Статья, серия или книга: что меняется и что нет',
    compare: 'Вся полка: разделы, пересечения и пара вручную',
  };
  function renderInstrumentRail() {
    const rail = $('#labInstruments');
    if (!rail) return;
    const live = state.desk || { mode: null };
    rail.innerHTML = INSTRUMENTS.map(([mode, label, glyph]) => {
      const hint = TOOL_HINTS[mode] || '';
      return `
      <button type="button" data-mode="${mode}" id="labTool${mode[0].toUpperCase() + mode.slice(1)}"
        title="${label}" aria-label="${label}" aria-description="${hint}"
        aria-controls="labDesk" aria-pressed="${live.mode === mode}"${mode === 'compare' ? ' data-locked="1" disabled' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyph}</svg>
      </button>`;
    }).join('');
    syncInstrumentRail();
  }
  // One tooltip for the whole rail, positioned by measurement and clamped to
  // the panel. Seven absolutely positioned tooltips used to widen the rail and
  // get clipped at the panel edge; a single layer cannot.
  function showRailTip(btn) {
    const rail = $('#labInstruments'), host = $('#labRight');
    const tip = $('#labRailTip');
    if (!rail || !host || !tip || !btn) return;
    const mode = btn.dataset.mode;
    const label = btn.getAttribute('aria-label') || mode;
    if (!label) return;
    const locked = mode === 'compare' && btn.disabled;
    tip.innerHTML = `<b>${esc(label)}</b><small>${esc(locked ? 'Нужно два закреплённых материала' : TOOL_HINTS[mode] || '')}</small>`;
    tip.hidden = false;
    const b = btn.getBoundingClientRect(), host_ = host.getBoundingClientRect();
    const w = tip.getBoundingClientRect().width;
    const left = Math.min(Math.max(b.left - host_.left + b.width / 2 - w / 2, 10), host_.width - w - 10);
    tip.style.left = `${Math.round(left)}px`;
    tip.style.bottom = `${Math.round(host_.bottom - b.top + 8)}px`;
  }
  function hideRailTip() { const tip = $('#labRailTip'); if (tip) tip.hidden = true; }
  function syncInstrumentRail() {
    const rail = $('#labInstruments');
    if (!rail) return;
    const live = state.desk || { mode: null };
    $$('button', rail).forEach(b => {
      const mode = b.dataset.mode;
      if (mode === 'compare') { b.disabled = state.pinned.length < 2; return; }
      b.setAttribute('aria-pressed', String(live.mode === mode));
    });
  }

  // ---------------------------------------------------------------- context band (auto)
  function renderContext(block, sectionLabel) {
    if (!block) return;
    const refs = [...new Set($$('button.bref[data-ref]', block).map(b => b.dataset.ref))];
    const terms = [...new Set($$('button.lab-term[data-term]', block).map(b => b.dataset.term))];
    const fn = notes.filter(n => n.block === block);
    const realSection = block.closest?.('[data-lab-section]')?.dataset.labSection || sectionLabel;
    const total = refs.length + terms.length + fn.length;
    state.ctxCounts = { total, refs: refs.length, terms: terms.length, notes: fn.length };
    renderHeadStrip();
    // Two spellings of the same counts: the full one when the band is open, and
    // a single honest figure when the row is folded to a 40 px strip.
    $('#labContextMeta').innerHTML = total
      ? `<span class="band-meta-full">${refs.length} стих. · ${terms.length} понят. · ${fn.length} снос.</span>` +
        `<span class="band-meta-short">${fn.length ? plural(fn.length, ['сноска', 'сноски', 'сносок']) : refs.length ? plural(refs.length, ['стих', 'стиха', 'стихов']) : plural(terms.length, ['понятие', 'понятия', 'понятий'])}</span>`
      : `<span class="band-meta-full">чистый абзац</span><span class="band-meta-short">чисто</span>`;
    let html = `<p class="lab-ctx-section">Раздел: <b>${esc(realSection)}</b><span class="lab-ctx-counts">${refs.length} стихов · ${terms.length} понятий · ${fn.length} сносок</span></p>`;
    if (!total) {
      html += `<p class="lab-empty">Здесь нет ссылок, понятий и сносок.<small>Лента следует за абзацем, который вы читаете, и не меняет «Разбор».</small></p>`;
    } else {
      const snippet = firstSentence(plainText(block), 78);
      for (const r of refs.slice(0, 4)) html += ctxRow('стих', r, snippet, 'verse', r, 'openref');
      for (const t of terms.slice(0, 3)) html += ctxRow('понятие', t, snippet, 'term', t, 'openterm');
      for (const n of fn.slice(0, 2)) html += ctxRow(n.kind === 'Переводческое примечание' ? 'перевод' : 'сноска', `Примечание ${String(n.n).padStart(2, '0')}`, clip(n.text, 92), 'note', n.id, 'opennote');
      const shown = Math.min(refs.length, 4) + Math.min(terms.length, 3) + Math.min(fn.length, 2);
      if (total > shown) html += `<button class="lab-ctx-more" type="button" data-lab-action="index">Ещё ${total - shown} — открыть указатель →</button>`;
    }
    ctxEl.innerHTML = html;
  }
  function ctxRow(kind, label, snippet, type, key, action) {
    const active = state.desk.mode === type && state.desk.key === key;
    return `<button class="lab-ctx-row" data-lab-active="${active}" data-lab-action="${action}" data-type="${type}" data-key="${esc(key)}">
      <span class="lab-ctx-row__top"><span class="lab-ctx-row__kind">${kind}</span><span class="lab-ctx-row__ref">${esc(label)}</span></span>
      <span class="lab-ctx-row__snippet">«${esc(snippet)}»</span>
    </button>`;
  }

  function updateReadingPosition() {
    rafPending = false;
    const view = center.getBoundingClientRect();
    const target = view.top + view.height * 0.28;
    let best = null, bestDist = Infinity;
    for (const p of blocks) {
      const r = p.getBoundingClientRect();
      if (r.bottom < view.top - 40 || r.top > view.bottom + 40) continue;
      const d = Math.abs(r.top - target);
      if (d < bestDist) { bestDist = d; best = p; }
    }
    if (!best && blocks.length) {
      const st = center.scrollTop;
      best = blocks.find(p => topOf(p) + p.offsetHeight > st + 30) || blocks[0];
    }
    if (!best) return;
    if (best !== state.currentBlock) {
      state.currentBlock = best;
      // Follow keeps the band's content AND its folded count chip current even
      // while the row is folded to a strip: folding a band must never freeze it.
      if (state.follow) renderContext(best, sectionOf(best).label);
    }
    // section + rail progress
    const st = center.scrollTop;
    let sec = { id: '', label: 'Вступление' };
    for (const s of sections) if (topOf(s.el) - 34 <= st) sec = s; else break;
    if (sec.label !== state.currentSection) {
      state.currentSection = sec.label;
      setHeadSection(sec.label || (state.currentBlock?.dataset?.labSection || 'Вступление'));
      // The original rail lists 10 content sections, while the article has a
      // few extra utility headings. Count against the real TOC, not all H2/H3.
      renderSeriesChip();
      const groups = tocGroups();
      const rowIdx = Math.max(0, groups.findIndex(g => g.id === sec.id || g.subs.some(x => x.id === sec.id)));
      $('#labTocCount').textContent = `${rowIdx + 1} / ${groups.length}`;
      syncTocActive(sec.id);
      $$('.lab-thread__row').forEach(r => r.dataset.labActive = String(r.dataset.id === sec.id));
      updateThreadBead();
      renderBrief();
      if (state.desk.mode === 'section' && !state.desk.key) renderDesk();
      if (state.desk.mode === 'notes' && !state.notesQuery) renderDesk();
    }
    const max = center.scrollHeight - center.clientHeight;
    const prog = max > 0 ? Math.min(1, st / max) : 0;
    const pct = Math.round(prog * 100);
    $('#labToc')?.style.setProperty('--track-progress', String(prog));
    $('#labTocProgressFill')?.style.setProperty('width', (prog * 100) + '%');
    $('#labReadFill')?.style.setProperty('width', (prog * 100) + '%');
    if ($('#labReadPct')) $('#labReadPct').textContent = pct + '%';
  }
  function schedulePosition() {
    if (!rafPending) { rafPending = true; requestAnimationFrame(updateReadingPosition); }
  }

  // ---------------------------------------------------------------- actions
  function openRef(key, opts = {}) {
    if (!refOcc.has(key)) { toast('Ссылка не найдена в указателе статьи'); return; }
    state.desk = { mode: 'verse', key };
    state.activeRef = key; state.activeTerm = null;
    state.expandedContext = false;
    renderDesk();
    if (opts.scroll) scrollToEl(refOcc.get(key)[0].el);
    if (opts.reveal !== false) revealDesk();
  }
  function openTerm(key, opts = {}) {
    if (!DATA.terms[key]) { toast('Понятие отсутствует в словаре'); return; }
    state.desk = { mode: 'term', key };
    state.activeTerm = key; state.activeRef = null;
    renderDesk();
    if (opts.reveal !== false) revealDesk();
  }
  function openNote(key, opts = {}) {
    if (!notes.some(n => n.id === key)) { toast('Сноска не найдена'); return; }
    state.desk = { mode: 'note', key };
    renderDesk();
    if (opts.scroll) scrollToEl(notes.find(n => n.id === key).marker);
    if (opts.reveal !== false) revealDesk();
  }
  function openEdition(key) {
    const all = Object.keys(DATA.series || {});
    if (key && key !== 'article' && !all.includes(key)) { toast('Такая форма издания не загружена'); return; }
    const wasEdition = state.desk && state.desk.mode === 'edition';
    if (key) applyEdition(key);
    state.desk = { mode: 'edition', key: key || null };
    renderDesk();
    if (wasEdition) return; // a card click must not collapse the band the user is reading
    revealDesk();
  }
  // Switching the form is a VIEW of the same margins — the article itself never changes.
  // In a series the margin is not «at a paragraph of the article»: the reader is
  // inside part N of a bigger thing, and the headline has to say so.
  function headSectionFor(label) {
    const e = DATA.edition;
    if (!e || e.key === 'article' || !DATA.series[e.key]) return { label, pos: '' };
    const s = DATA.series[e.key];
    const it = s.items.find(i => i.id === e.item);
    if (!it) return { label, pos: '' };
    const list = s.shape === 'book' ? s.items.filter(i => i.tier === 'article') : s.items;
    const idx = list.findIndex(i => i.id === it.id) + 1;
    const ch = s.shape === 'book' ? seriesChapterOf(s, it.id) : null;
    return {
      label: it.title,
      pos: `${s.shape === 'book' ? 'Книга' : 'Серия'} · ${ch ? ch.title + ' · ' : ''}${idx} / ${list.length}`,
    };
  }
  function setHeadSection(label) {
    const { label: text, pos } = headSectionFor(label);
    const el = $('#labCurrentSection');
    if (el) el.textContent = text;
    const posEl = $('#labHeadPos');
    if (posEl) { posEl.textContent = pos; posEl.hidden = !pos; }
  }

  // The reading position inside a series («Книга · Глава I · 1 / 22») is a choice
  // the reader made; it must survive a reload, like the pins and the theme.
  const EDITION_STORE = () => STORE + 'edition';
  function saveEdition() {
    try {
      if (DATA.edition && DATA.edition.key && DATA.edition.key !== 'article') {
        localStorage.setItem(EDITION_STORE(), JSON.stringify({ key: DATA.edition.key, item: DATA.edition.item }));
      } else {
        localStorage.removeItem(EDITION_STORE());
      }
    } catch (e) {}
  }
  function loadEdition() {
    try {
      const saved = JSON.parse(localStorage.getItem(EDITION_STORE()) || 'null');
      if (!saved || !saved.key || !DATA.series[saved.key]) return null;
      return saved;
    } catch (e) { return null; }
  }
  function applyEdition(key) {
    const prev = (DATA.edition && DATA.edition.key) || 'article';
    const next = key || 'article';
    // Persist the shelf of the edition we are leaving, then load the new one.
    if (prev !== next) { savePins(); }
    if (key === 'article') { DATA.edition = null; saveEdition(); renderSeriesChip(); loadPins(); renderPinned(); setHeadSection(state.currentSection); return; }
    const s = DATA.series[key];
    if (!s) return;
    // The store key is built from DATA.edition, so the new edition has to be
    // assigned BEFORE loading, otherwise the shelf of the old room is reloaded.
    if (prev !== next) { DATA.edition = { key }; loadPins(); renderPinned(); }
    const previous = DATA.edition && DATA.edition.key === key ? DATA.edition : {};
    const item = previous.item && s.items.some(i => i.id === previous.item) ? previous.item
      : (s.shape === 'book' ? (s.items.find(i => i.tier === 'article') || {}).id : (s.items[0] || {}).id);
    const chapter = s.shape === 'book' ? (seriesChapterOf(s, item) || {}).id : null;
    DATA.edition = { key, item, chapter };
    saveEdition();
    renderSeriesChip();
    setHeadSection(state.currentSection);
    renderBrief();
  }
  function openSection(key) {
    state.desk = { mode: 'section', key: key || null };
    renderDesk();
    revealDesk();
  }
  function openMode(mode) {
    if (mode === 'compare' && state.pinned.length < 2) { toast('Закрепите два материала для сопоставления'); return; }
    if (mode === 'section') { openSection(null); return; }
    // Expand first: setBandCollapsed resets a stale "Издание" view, so the mode
    // has to be assigned after the band is open, never before.
    setBandCollapsed($('[data-band="desk"]'), false);
    state.desk = { mode, key: null };
    renderDesk();
    // Instruments replace one another inside the same long scrolling band.
    // A remembered scroll offset from (say) a long note list can put the new
    // tool's title/card above the viewport, so every explicit tool switch starts
    // at its own beginning. Intra-tool actions (part selection, next/previous)
    // render directly and deliberately keep their position.
    $('#labRightScroll').scrollTop = 0;
    revealDesk();
    if (mode === 'index') $('#labIndexInput')?.focus();
    if (mode === 'notes') $('#labNotesInput')?.focus();
  }
  function markActiveInText() {
    $$('.bref[data-lab-active]', article).forEach(b => b.removeAttribute('data-lab-active'));
    $$('.lab-term[data-lab-active]', article).forEach(b => b.removeAttribute('data-lab-active'));
    if (state.desk.mode === 'verse' && state.desk.key) {
      $$(`button.bref[data-ref="${CSS.escape(state.desk.key)}"]`, article).forEach(b => b.dataset.labActive = 'true');
    } else if (state.desk.mode === 'term' && state.desk.key) {
      $$(`button.lab-term[data-term="${CSS.escape(state.desk.key)}"]`, article).forEach(b => b.dataset.labActive = 'true');
    }
    $$('.lab-ctx-row').forEach(r => {
      r.dataset.labActive = String(state.desk.mode === r.dataset.type && state.desk.key === r.dataset.key);
    });
  }

  function handleAction(e) {
    const el = e.target.closest('[data-lab-action]');
    if (!el) return false;
    const a = el.dataset.labAction, key = el.dataset.key;
    switch (a) {
      case 'pin': togglePin(el.dataset.type, key, el.dataset.label); break;
      case 'unpin': {
        // Two call sites: shelf rows (index) and pair rows (key+type). Index-only
        // would splice NaN; key-only must match the right material type.
        let i = el.dataset.i !== undefined ? +el.dataset.i : -1;
        if (i < 0) i = state.pinned.findIndex(p => p.key === key && (!el.dataset.type || p.type === el.dataset.type));
        if (i >= 0) state.pinned.splice(i, 1);
        savePins(); renderPinned(); renderDesk();
        break;
      }
      case 'jumpsection': {
        // The compare overview names a section; the reader must be able to reach it.
        const sec = sections.find(x => x.id === key);
        if (!sec) { toast('Раздел не найден'); break; }
        sec.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setRight(false);
        toast(`К разделу «${sec.label}»`);
        break;
      }
      case 'openshelf': {
        const p = state.pinned.find(x => x.key === key && x.type === el.dataset.type);
        if (!p) break;
        (p.type === 'verse' ? openRef(p.key) : p.type === 'note' ? openNote(p.key) : openTerm(p.key));
        break;
      }
      case 'rate': {
        const pop = $('#labRatePop');
        if (!pop) break;
        pop.style.pointerEvents = '';
        const open = !pop.classList.contains('is-open');
        pop.classList.toggle('is-open', open);
        el.setAttribute('aria-expanded', String(open));
        break;
      }
      case 'comparepair': {
        // Open two chosen materials in the manual pair panel (matrix row click).
        const ai = state.pinned.findIndex(p => p.key === el.dataset.a && p.type === el.dataset.at);
        const bi = state.pinned.findIndex(p => p.key === el.dataset.b && p.type === el.dataset.bt);
        if (ai < 0 || bi < 0) break;
        if (state.desk.mode !== 'compare') openMode('compare');
        const A = $('#labCompareA', deskEl), B = $('#labCompareB', deskEl);
        if (A && B) { A.value = String(ai); B.value = String(bi); renderComparePair(); }
        break;
      }
      case 'openpin': {
        const p = state.pinned[+el.dataset.i];
        if (p) (p.type === 'verse' ? openRef(p.key) : p.type === 'note' ? openNote(p.key) : openTerm(p.key));
        break;
      }
      case 'pinall': {
        // one button can pin every material of the current section — the whole
        // apparatus of a section, in one action, if the shelf has room
        const ids = sectionRefs(el.dataset.key);
        const room = PIN_LIMIT - state.pinned.length;
        if (!ids.length) { toast('В этом разделе нет мест Писания'); break; }
        if (room <= 0) { toast(`На полях уже ${PIN_LIMIT} материалов — открепите один`); break; }
        let added = 0;
        for (const r of ids.slice(0, room)) {
          if (!state.pinned.some(p => p.type === 'verse' && p.key === r)) { state.pinned.push({ type: 'verse', key: r, label: r }); added++; }
        }
        savePins(); renderPinned(); renderDesk();
        toast(added ? `Закреплено ${plural(added, ['место', 'места', 'мест'])} Писания` : 'Всё уже закреплено');
        break;
      }
      case 'comparepin': {
        const i = +el.dataset.i, p = state.pinned[i];
        if (!p || state.pinned.length < 2) { toast('Закрепите два материала'); break; }
        const other = state.pinned[i === 0 ? 1 : 0];
        state.pinned = [other, p, ...state.pinned.filter((_, n) => n !== i && n !== (i === 0 ? 1 : 0))];
        renderPinned(); openMode('compare'); break;
      }
      case 'openref': openRef(key); break;
      case 'openterm': openTerm(key); break;
      case 'opennote': openNote(key); break;
      case 'notes': openMode('notes'); break;
      case 'opensection': openSection(key); break;
      case 'edition': openEdition(el.dataset.key || null); break;
      case 'editionpart': {
        const key = el.dataset.key, item = el.dataset.item;
        const s = DATA.series[key];
        if (!s || !s.items.some(i => i.id === item)) { toast('Часть не найдена в конфиге серии'); break; }
        // Choosing a part is a real step: it changes the address the margin reports.
        openEdition(key);
        DATA.edition = { key, item, chapter: s.shape === 'book' ? (seriesChapterOf(s, item) || {}).id : null };
        saveEdition();
        renderSeriesChip(); setHeadSection(state.currentSection); renderBrief(); renderDesk();
        // renderDesk() rebuilds the list, which used to drop keyboard focus to
        // <body>: a reader who stepped through the parts lost their place in the
        // row and had to start over from the top of the panel.
        const chosenRow = document.querySelector('.lab-band--desk .lab-ed-part.is-current');
        if (chosenRow) {
          chosenRow.focus({ preventScroll: true });
          // The desk scroll viewport ends directly above the pinned shelf. Keep
          // the chosen row fully above that edge; preventScroll alone can leave
          // a lower row clipped after renderDesk() rebuilds its list.
          const viewport = document.querySelector('#labRightScroll');
          const rowRect = chosenRow.getBoundingClientRect();
          const viewRect = viewport?.getBoundingClientRect();
          if (viewport && viewRect) {
            const pad = 12;
            if (rowRect.bottom > viewRect.bottom - pad) viewport.scrollTop += rowRect.bottom - viewRect.bottom + pad;
            else if (rowRect.top < viewRect.top + pad) viewport.scrollTop -= viewRect.top + pad - rowRect.top;
          }
        }
        // Say *where* the step lands, not only its name: the reader should not
        // have to re-read the headline to learn that the chapter changed.
        const list = s.shape === 'book' ? s.items.filter(i => i.tier === 'article') : s.items;
        const idx = list.findIndex(i => i.id === item) + 1;
        const chTitle = s.shape === 'book' ? (seriesChapterOf(s, item) || {}).title : '';
        toast(chTitle ? `${chTitle} · ${idx} / ${list.length}` : `${s.stepLabel || 'Часть'} · ${idx} / ${list.length}`);
        break;
      }
      case 'help': openMode('help'); break;
      case 'thread': openMode('thread'); break;
      case 'graph': openMode('graph'); break;
      case 'index': openMode('index'); break;
      case 'compare': openMode('compare'); break;
      case 'section': {
        const s = sections.find(x => x.id === el.dataset.id);
        if (s) { scrollToEl(s.el); if (isMobile()) setLeft(false); }
        break;
      }
      case 'jump': { const o = refOcc.get(key)?.[0]; if (o) scrollToEl(o.el); break; }
      case 'jumpnote': { const n = notes.find(x => x.id === key); if (n) scrollToEl(n.marker); break; }
      case 'jump-section': { const s = sections.find(x => x.id === key); if (s) scrollToEl(s.el); break; }
      case 'noteprev': { const i = notes.findIndex(x => x.id === state.desk.key); if (i > 0) openNote(notes[i - 1].id); break; }
      case 'notenext': { const i = notes.findIndex(x => x.id === state.desk.key); if (i >= 0 && i < notes.length - 1) openNote(notes[i + 1].id); break; }
      case 'jumpocc': { const o = refOcc.get(key)?.[+el.dataset.occ]; if (o) scrollToEl(o.el); break; }
      case 'jumpterm': { const o = deskEl._termOcc?.[0]; if (o) scrollToEl(o.el); break; }
      case 'jumptermocc': { const o = deskEl._termOcc?.[+el.dataset.occ]; if (o) scrollToEl(o.el); break; }
      case 'trail': {
        const sc = $('#labRightScroll'), band = $('[data-band="desk"]');
        if (sc && band) sc.scrollTo({ top: band.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 8, behavior: 'smooth' });
        break;
      }
      case 'context-toggle': {
        state.expandedContext = !state.expandedContext;
        el.setAttribute('aria-expanded', String(state.expandedContext));
        $('.lab-ctxverses', deskEl)?.classList.toggle('lab-hidden', !state.expandedContext);
        break;
      }
      case 'refprev': { const i = refOrder.indexOf(state.desk.key); if (i > 0) openRef(refOrder[i - 1]); break; }
      case 'refnext': { const i = refOrder.indexOf(state.desk.key); if (i < refOrder.length - 1) openRef(refOrder[i + 1]); break; }
      default: return false;
    }
    return true;
  }

  // ---------------------------------------------------------------- audio (honest browser demo)
  // Original .gb-ember state machine: idle → playing → complete → idle,
  // with the site's own --p ring fraction (0..1) and SVG glyphs.
  function setPlaying(on, complete = false) {
    const play = $('#labPlay');
    state.playing = on;
    clearInterval(audioTimer);
    if (!on) {
      try { window.speechSynthesis?.cancel(); } catch (e) {}
      play.dataset.state = complete ? 'complete' : 'idle';
      play.style.setProperty('--p', '0');
      play.setAttribute('aria-pressed', 'false');
      play.setAttribute('aria-label', 'Озвучка');
      $('#labAudioStatus').textContent = complete ? 'озвучка завершена · демо' : 'демо · синтезатор браузера';
      if (complete) setTimeout(() => {
        if (!state.playing && play.dataset.state === 'complete') {
          play.dataset.state = 'idle';
          $('#labAudioStatus').textContent = 'демо · синтезатор браузера';
        }
      }, 1600);
      syncPanels();
      return;
    }
    play.dataset.state = 'playing';
    play.style.setProperty('--p', '0');
    play.setAttribute('aria-pressed', 'true');
    play.setAttribute('aria-label', 'Пауза');
    $('#labAudioStatus').textContent = 'озвучивает раздел… · демо';
    syncPanels();
    toast('Демонстрационная озвучка: встроенный синтезатор браузера');
    const text = currentSectionText();
    let ok = false;
    try {
      if ('speechSynthesis' in window && window.SpeechSynthesisUtterance && text) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text.slice(0, 900));
        u.lang = 'ru-RU'; u.rate = state.rate;
        u.onend = () => { if (state.playing) setPlaying(false, true); };
        u.onerror = () => { if (state.playing) setPlaying(false); };
        window.speechSynthesis.speak(u);
        ok = true;
      }
    } catch (e) { ok = false; }
    if (!ok) {
      state.playing = false;
      play.dataset.state = 'idle';
      play.style.setProperty('--p', '0');
      play.setAttribute('aria-pressed', 'false');
      play.setAttribute('aria-label', 'Озвучка');
      $('#labAudioStatus').textContent = 'синтезатор недоступен';
      syncPanels();
      toast('Синтезатор браузера недоступен в этом окружении');
      return;
    }
    // The site's controller drives --p with real playback progress. In this
    // honest browser demo we have no timeline, so the ring is a plain timed
    // indicator and is explicitly labelled «демо» everywhere.
    let p = 0;
    audioTimer = setInterval(() => {
      p += 1;
      if (p >= 30) { clearInterval(audioTimer); if (state.playing) setPlaying(false, true); return; }
      play.style.setProperty('--p', String(p / 30));
    }, 400);
  }
  function currentSectionText() {
    const idx = Math.max(0, sections.findIndex(s => s.label === state.currentSection));
    const start = sections[idx]?.el || article;
    let text = '', n = start.nextElementSibling;
    while (n && !/^H[2-4]$/.test(n.tagName) && text.length < 900) {
      if (n.tagName === 'P') text += plainText(n) + ' ';
      n = n.nextElementSibling;
    }
    return text.trim() || plainText(start);
  }

  // ---------------------------------------------------------------- wiring
  function wire() {
    center.addEventListener('scroll', () => {
      schedulePosition();
      // Keep a hovered/focused preview anchored while the reader scrolls; only
      // dismiss it when its own reference leaves the visible page. This avoids
      // the hover → scrollIntoView → immediately-hide race, and avoids the
      // focus/motion churn the brief warns against.
      if (!tip.hidden && tipAnchor) {
        const a = tipAnchor.getBoundingClientRect(), v = center.getBoundingClientRect();
        if (a.bottom < v.top || a.top > v.bottom) hideTip(true);
        else positionTip(tipAnchor);
      }
    }, { passive: true });
    window.addEventListener('resize', () => {
      const m = isMobile();
      if (m !== state.mobile) {
        state.mobile = m;
        if (m) { shell.dataset.left = 'closed'; shell.dataset.right = 'closed'; }
        else { shell.dataset.left = 'open'; shell.dataset.right = 'open'; }
        syncPanels();
      }
      schedulePosition(); hideTip(true);
    });

    // real scripture references and hydrated terms
    article.addEventListener('pointerover', e => {
      const t = e.target.closest?.('.bref[data-ref], .lab-term[data-term]');
      if (!t || (e.pointerType !== 'mouse' && !matchMedia('(hover:hover) and (pointer:fine)').matches)) return;
      clearTimeout(tipTimer); showTip(t, tipHtmlFor(t));
    });
    article.addEventListener('pointerout', e => {
      const t = e.target.closest?.('.bref[data-ref], .lab-term[data-term]');
      if (t) hideTip();
    });
    article.addEventListener('focusin', e => {
      const t = e.target.closest?.('.bref[data-ref], .lab-term[data-term]');
      if (t) { clearTimeout(tipTimer); showTip(t, tipHtmlFor(t)); }
    });
    article.addEventListener('focusout', e => {
      if (e.target.closest?.('.bref[data-ref], .lab-term[data-term]')) hideTip();
    });
    article.addEventListener('click', e => {
      const ref = e.target.closest?.('button.bref[data-ref]');
      if (ref) {
        e.preventDefault(); hideTip(true);
        const k = ref.dataset.ref;
        if (e.shiftKey) { togglePin('verse', k, k); }
        else { if (isMobile() && shell.dataset.right === 'closed') setRight(true); openRef(k); }
        return;
      }
      const term = e.target.closest?.('button.lab-term[data-term]');
      if (term) {
        e.preventDefault(); hideTip(true);
        if (isMobile() && shell.dataset.right === 'closed') setRight(true);
        openTerm(term.dataset.term); return;
      }
      // real footnotes of the article
      const fn = e.target.closest?.('.fn-marker');
      if (fn) {
        e.preventDefault();
        $$('.fn-marker.is-open', article).forEach(x => { if (x !== fn) x.classList.remove('is-open'); });
        fn.classList.toggle('is-open'); return;
      }
      const faq = e.target.closest?.('.faq-accordion__q');
      if (faq) { faq.parentElement?.classList.toggle('is-open'); return; }
    });
    // Band headers behave like a real accordion: arrows move between them,
    // Home/End jump to the ends. A folded band must also keep the focus it had,
    // otherwise collapsing from the keyboard drops the reader at the page top.
    $('#labRight').addEventListener('keydown', e => {
      const toggle = e.target.closest?.('.lab-band__toggle');
      if (!toggle) return;
      const bands = $$('.lab-band .lab-band__toggle');
      const i = bands.indexOf(toggle);
      let next = null;
      if (e.key === 'ArrowDown') next = bands[i + 1];
      else if (e.key === 'ArrowUp') next = bands[i - 1];
      else if (e.key === 'Home') next = bands[0];
      else if (e.key === 'End') next = bands[bands.length - 1];
      if (!next) return;
      e.preventDefault();
      next.focus();
    });

    // rail tooltip: pointer enter, keyboard focus, Escape to dismiss
    const railEl = $('#labInstruments');
    railEl?.addEventListener('mouseover', e => { const b = e.target.closest('button'); if (b) showRailTip(b); });
    railEl?.addEventListener('mouseleave', hideRailTip);
    railEl?.addEventListener('focusin', e => { const b = e.target.closest('button'); if (b) showRailTip(b); });
    railEl?.addEventListener('focusout', hideRailTip);
    railEl?.addEventListener('click', hideRailTip);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hideRailTip(); });

    article.addEventListener('keydown', e => {
      const fn = e.target.closest?.('.fn-marker');
      if (fn && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); fn.click(); }
      const t = e.target.closest?.('.lab-trail__quote[role="button"]');
      if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); t.click(); }
    });

    // The manual pair panel re-renders on every pick, without rebuilding the desk.
    document.addEventListener('change', e => {
      if (e.target.closest('#labCompareA, #labCompareB')) renderComparePair();
    });

    // generic delegated actions in the right panel / left rail / mobile bar
    document.addEventListener('click', e => {
      // The chip owns its own listener; without this guard the delegated handler
      // would immediately toggle the switcher shut again.
      if (e.target.closest('#labSeriesChip')) return;
      if (e.target.closest('#labSeriesSwitch')) return;
      if (handleAction(e)) { e.preventDefault(); return; }
      const btn = e.target.closest('button');
      if (!btn) {
        if (!e.target.closest('#labSeriesSwitch')) toggleSeriesSwitch(false);
        return;
      }
      if (btn.id === 'labRightClose') { setRight(false); $('#labRightRestore')?.focus(); }
      else if (btn.id === 'labHelpBtn') { setRight(true); openMode('help'); }
      else if (btn.id === 'labRightRestore') setRight(true, true);
      else if (btn.id === 'labLeftQuiet') { setTocQuiet(!state.tocQuiet); toast(state.tocQuiet ? 'Оглавление свёрнуто до строк' : 'Оглавление раскрыто'); }
      else if (btn.id === 'labLeftCollapse') setLeft(false);
      else if (btn.id === 'labLeftRestore') setLeft(true, true);
      else if (btn.id === 'labThemeRight' || btn.id === 'labThemeLeft') cycleTheme();
      else if (btn.id === 'labFollow') {
        state.follow = !state.follow;
        btn.setAttribute('aria-pressed', String(state.follow));
        btn.setAttribute('aria-label', state.follow ? 'Автоматически следовать за текстом включено' : 'Автоматически следовать за текстом выключено');
        btn.textContent = state.follow ? 'следить' : 'пауза';
        toast(state.follow ? 'Лента следует за текстом' : 'Лента остановлена');
        renderHeadStrip();
        if (state.follow && state.currentBlock) renderContext(state.currentBlock, sectionOf(state.currentBlock).label);
      }
      else if (btn.id === 'labSettingsBtn') {
        const s = $('#labSettings'), open = s.hidden;
        s.hidden = !open; btn.setAttribute('aria-expanded', String(open));
        closeRatePill();
      }
      else if (btn.dataset.theme) setTheme(btn.dataset.theme);
      else if (btn.dataset.leading) { state.leading = btn.dataset.leading; applyType(); }
      else if (btn.id === 'labFontUp') { state.fontScale = Math.min(1.3, +(state.fontScale + .05).toFixed(2)); applyType(); }
      else if (btn.id === 'labFontDown') { state.fontScale = Math.max(.9, +(state.fontScale - .05).toFixed(2)); applyType(); }
      else if (btn.id === 'labRate') {
        const p = $('#labRatePop'), open = !p.classList.contains('is-open');
        p.classList.toggle('is-open', open);
        $('#labRate').setAttribute('aria-expanded', String(open));
        $('#labPlay').setAttribute('aria-expanded', String(open));
        $('#labSettings').hidden = true;
      }
      else if (btn.dataset.rate) {
        state.rate = +btn.dataset.rate;
        const label = String(state.rate).replace('.', ',') + '×';
        $('#labRate').textContent = label;
        $('#labRate').setAttribute('aria-label', `Скорость озвучки, ${label}`);
        $$('#labRatePop button').forEach(b => {
          const on = +b.dataset.rate === state.rate;
          b.setAttribute('aria-checked', String(on));
          b.setAttribute('aria-pressed', String(on));
          b.classList.toggle('is-active', on);
        });
        closeRatePill();
        toast('Скорость: ' + label);
      }
      else if (btn.id === 'labPlay') setPlaying(!state.playing);
      else if (btn.id === 'labIndexBtn') { if (isMobile()) setLeft(false); setRight(true); openMode('index'); }
      else if (btn.id === 'labShareBtn') {
        try { navigator.clipboard?.writeText(location.href); toast('Ссылка на прототип скопирована'); } catch (e) { toast('Ссылка: ' + location.href); }
      }
      else if (btn.id === 'labPrintBtn') window.print();
      else if (btn.id === 'labQuiet') toggleAllBands();
      else if (btn.id === 'labHeadStrip') setBandCollapsed($('[data-band="context"]'), false);
      else if (btn.id === 'labCoachOk') {
        try { localStorage.setItem(STORE + 'coach', '1'); } catch (e) {}
        $('#labCoach').hidden = true;
      }
      else if (btn.id === 'labCoachMore') {
        try { localStorage.setItem(STORE + 'coach', '1'); } catch (e) {}
        $('#labCoach').hidden = true;
        openMode('help');
      }
      else if (btn.id === 'labLyasse') {
        const band = $('[data-band="pinned"]');
        setBandCollapsed(band, false);
        band.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
      }
      else if (btn.dataset.mode) openMode(btn.dataset.mode);
      else if (btn.dataset.action) {
        const a = btn.dataset.action;
        if (a === 'toc') setLeft(shell.dataset.left !== 'open', true);
        else if (a === 'study') setRight(shell.dataset.right !== 'open', true);
        else if (a === 'audio') setPlaying(!state.playing);
        else if (a === 'theme') cycleTheme();
        syncPanels();
      }
      else if (btn.classList.contains('lab-band__toggle')) setBandCollapsed(btn.closest('.lab-band'));
      // The site's bloom pill closes on an outside click (light dismiss).
      if (!e.target.closest?.('#labEmberWrap, #labRate')) closeRatePill();
      // close real footnotes when clicking elsewhere
      if (!e.target.closest?.('.fn-marker')) $$('.fn-marker.is-open', article).forEach(x => x.classList.remove('is-open'));
    });

    $('#labBackdrop').addEventListener('click', () => { setLeft(false); setRight(false); });
    $('#labBack').addEventListener('click', () => toast('В изолированном прототипе возврат на главную отключён'));

    $('#labToc').addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      const el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) { e.preventDefault(); scrollToEl(el); if (isMobile()) setLeft(false); }
    });

    // Real TOC filter — the site's own mobile sheet pattern, desktop rail.
    $('#labTocSearch')?.addEventListener('input', e => {
      state.tocQuery = e.target.value;
      renderToc();
    });

    document.addEventListener('keydown', e => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
      if (e.key === 'Escape') {
        if (!$('#labSettings').hidden) { closeOverlays(); return; }
        if ($('#labRatePop').classList.contains('is-open')) { closeOverlays(); return; }
        if (!tip.hidden) { hideTip(true); return; }
        if (document.activeElement?.id === 'labTocSearch' && state.tocQuery) {
          e.preventDefault();
          state.tocQuery = '';
          $('#labTocSearch').value = '';
          $('#labTocSearch').dispatchEvent(new Event('input', { bubbles: true }));
          return;
        }
        if (document.activeElement?.id === 'labIndexInput' || document.activeElement?.id === 'labNotesInput') {
          state.indexQuery = ''; state.notesQuery = '';
          openMode('thread'); $('#labRightClose')?.focus(); return;
        }
        if (isMobile()) { setLeft(false); setRight(false); }
        else { $$('.fn-marker.is-open', article).forEach(x => x.classList.remove('is-open')); }
        return;
      }
      // Panel shortcuts stay available even from the index field.
      if (e.altKey && e.key === '1') { e.preventDefault(); setLeft(shell.dataset.left !== 'open'); return; }
      if (e.altKey && e.key === '2') { e.preventDefault(); setRight(shell.dataset.right !== 'open'); return; }
      if (e.altKey && e.key.toLowerCase() === 'q') { e.preventDefault(); setRight(true); toggleAllBands(); return; }
      if (typing) return;
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault(); setRight(true); openMode('help'); return;
      }
      if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault(); setRight(true); openMode('index'); $('#labIndexInput')?.focus(); return;
      }
      if (state.desk.mode === 'verse' && (e.key === '[' || e.key === ']')) {
        e.preventDefault();
        const i = refOrder.indexOf(state.desk.key);
        if (e.key === '[' && i > 0) openRef(refOrder[i - 1]);
        if (e.key === ']' && i < refOrder.length - 1) openRef(refOrder[i + 1]);
      }
    });
  }

  // ---------------------------------------------------------------- boot
  async function boot() {
    try {
      const [refs, terms, context, termCounts, seriesIndexRaw] = await Promise.all([
        fetch('/data/bible-refs.json').then(r => r.json()),
        fetch('/data/glossary.json').then(r => r.json()),
        fetch('/data/bible-context.json').then(r => r.json()),
        fetch('/data/terms-list.json').then(r => r.json()),
        fetch('/data/series/index.json').then(r => r.json()),
      ]);
      const seriesIndex = await Promise.all(Object.entries(seriesIndexRaw || {}).map(async ([key, meta]) =>
        [key, await fetch('/data/series/' + meta.file).then(r => r.json())]));
      DATA = { refs, terms, context, termCounts, series: Object.fromEntries(seriesIndex), edition: null };
    } catch (err) {
      deskEl.innerHTML = `<div class="lab-empty">Не удалось загрузить данные лаборатории.<small>${esc(err.message)}</small></div>`;
      return;
    }
    buildIndex();
    hydrateTerms();
    fixOpeningParens();
    try {
      state.fontScale = +(localStorage.getItem(STORE + 'fontScale') || 1);
      state.leading = localStorage.getItem(STORE + 'leading') || 'normal';
    } catch (e) {}
    setTheme(state.theme, false);
    applyType();
    wire();
    if (isMobile()) { state.mobile = true; shell.dataset.left = 'closed'; shell.dataset.right = 'closed'; }
    syncPanels();
    loadPins();
    renderPinned();
    renderDesk();
    new MutationObserver(dedupeDeskKicker).observe(deskEl, { childList: true, subtree: false });
    renderInstrumentRail();
    try {
      const saved = JSON.parse(localStorage.getItem(STORE + 'toc') || '{}');
      state.tocQuiet = !!saved.quiet;
      state.tocOpen = typeof saved.open === 'string' ? saved.open : '';
    } catch (e) {}
    renderToc();
    setTocQuiet(state.tocQuiet);
    // Remembered band state: the reader may leave the margins as a quiet strip of
    // icons, and that choice survives a reload like the theme and type settings.
    try {
      const saved = JSON.parse(localStorage.getItem(STORE + 'bands') || '{}');
      for (const k of Object.keys(state.collapsed)) if (typeof saved[k] === 'boolean') state.collapsed[k] = saved[k];
    } catch (e) {}
    // Restore without the accordion hand-off: the saved layout is the user's,
    // so boot must never fold half of it behind their back.
    $$('.lab-band').forEach(b => {
      if (b.dataset.band === 'pinned') return; // the shelf keeps its own rules
      setBandCollapsed(b, !!state.collapsed[b.dataset.band], false);
    });
    document.body.dataset.labQuiet = String(bandsQuiet());
    $('#labQuiet')?.setAttribute('aria-pressed', String(bandsQuiet()));
    // First visit only: the panel explains its own three gestures, then stays quiet.
    try {
      if (localStorage.getItem(STORE + 'coach') !== '1') $('#labCoach').hidden = false;
    } catch (e) { $('#labCoach').hidden = false; }
    const chip = $('#labSeriesChip');
    chip?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      toggleSeriesSwitch();
      if (!$('#labSeriesSwitch').hidden) setLeft(true);
      else chip.blur();
    });
    $$('#labSeriesSwitch [data-lab-series]').forEach(b => b.addEventListener('click', () => {
      applyEdition(b.dataset.labSeries);
      if (state.desk && state.desk.mode === 'edition') renderDesk();
      toast(b.dataset.labSeries === 'article' ? 'Форма: отдельная статья' : 'Форма: ' + DATA.series[b.dataset.labSeries].title);
    }));
    $('#labTocCount').textContent = `1 / ${tocGroups().length}`;
    let tocResize = 0;
    addEventListener('resize', () => { clearTimeout(tocResize); tocResize = setTimeout(fitToc, 180); });
    $('#labApparatusNote').textContent = `${refOrder.length} мест Писания · ${[...refOcc.values()].reduce((n, o) => n + o.length, 0)} упоминаний · ${Object.keys(DATA.terms).length} понятий · ${notes.length} сносок · ${sections.length} разделов. Все материалы взяты из реальной статьи и словаря сайта.`;
    // Reopen the series the reader was in, at the part they chose, and say so
    // quietly in the shelf of the margin headline.
    const savedEdition = loadEdition();
    if (savedEdition) {
      applyEdition(savedEdition.key);
      if (DATA.series[savedEdition.key]?.items.some(i => i.id === savedEdition.item)) {
        const s = DATA.series[savedEdition.key];
        DATA.edition = { key: savedEdition.key, item: savedEdition.item,
          chapter: s.shape === 'book' ? (seriesChapterOf(s, savedEdition.item) || {}).id : null };
        renderSeriesChip();
        setHeadSection(state.currentSection);
      }
    }
    renderContext(blocks[0] || null, 'Вступление');
    renderBrief();
    schedulePosition();
    // A gentle, useful first state: the article's own five theses are already visible.
    document.documentElement.dataset.labReady = '1';
  }
  boot();
})();
