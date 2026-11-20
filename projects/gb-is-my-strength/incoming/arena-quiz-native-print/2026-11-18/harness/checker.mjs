import { getDocument, GlobalWorkerOptions, version } from './pdfjs/build/pdf.mjs';

const lib = new URL('./pdfjs/', import.meta.url);
GlobalWorkerOptions.workerSrc = new URL('build/pdf.worker.mjs', lib).href;
const $ = id => document.getElementById(id);
const normalize = s => s.normalize('NFKC').replace(/\u00ad/gu, '').replace(/\s+/gu, ' ').trim();
const digest = async data => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)), b => b.toString(16).padStart(2, '0')).join('');
const encode = s => new TextEncoder().encode(s);
const markers = {
  headline: 'Анатомия падения',
  quizNotice: 'Интерактивный тест доступен в электронной версии статьи',
  editorial: 'Писание выше личности и системы',
  signature: 'Soli Deo Gloria',
  feedback: 'Богословскую или техническую — напишите',
};
const tail = ['editorial', 'signature', 'feedback'];
const pick = file => file && file.size > 0 && file.size <= 40 * 1024 * 1024;
async function parse(file) {
  if (!pick(file)) throw new Error('Нужен непустой PDF размером до 40 МБ.');
  let data = new Uint8Array(await file.arrayBuffer());
  if (String.fromCharCode(...data.subarray(0, 5)) !== '%PDF-') throw new Error('Файл не начинается с подписи PDF.');
  const sha256 = await digest(data);
  const bytes = data.byteLength;
  const task = getDocument({ data, isEvalSupported: false, enableXfa: false, stopAtErrors: true,
    cMapUrl: new URL('cmaps/', lib).href, cMapPacked: true, standardFontDataUrl: new URL('standard_fonts/', lib).href,
    wasmUrl: new URL('wasm/', lib).href, iccUrl: new URL('iccs/', lib).href });
  try {
    const pdf = await task.promise;
    if (pdf.numPages > 60) throw new Error('Для этой проверки допустимо не более 60 страниц.');
    const pageSha256 = [], markerPages = Object.fromEntries(Object.keys(markers).map(k => [k, []]));
    const paperPoints = new Set();
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const { width, height } = page.getViewport({ scale: 1 });
      paperPoints.add(`${Math.round(width)}×${Math.round(height)}`);
      const text = normalize((await page.getTextContent()).items.map(x => x.str ?? '').join(' '));
      pageSha256.push(await digest(encode(text)));
      const lower = text.toLowerCase();
      for (const [name, value] of Object.entries(markers)) {
        // PDF.js can preserve the title's wide letter spacing as individual spaces.
        const compact = s => s.replace(/\s+/gu, '');
        const found = name === 'signature' ? compact(lower).includes(compact(value.toLowerCase())) : lower.includes(value.toLowerCase());
        if (found) markerPages[name].push(n);
      }
      page.cleanup();
    }
    return { pages: pdf.numPages, bytes, sha256, paperPoints: [...paperPoints], markerPages, pageSha256 };
  } finally {
    await task.destroy();
  }
}
const allTail = record => tail.every(k => record.markerPages[k].length > 0);
const noTail = record => tail.every(k => record.markerPages[k].length === 0);
const isA4 = record => record.paperPoints.every(size => {
  const [width, height] = size.split('×').map(Number);
  return Math.abs(width - 595) <= 4 && Math.abs(height - 842) <= 4;
});
function verdict(first, repeat) {
  const article = a => a.markerPages.headline.length && a.markerPages.quizNotice.length;
  if (!article(first) || !article(repeat)) return ['unconfirmed_article', 'В одном PDF нет названия или статического уведомления теста. Сверьте маршрут.'];
  if (!isA4(first) || !isA4(repeat)) return ['unconfirmed_paper', 'Размер страницы отличается от A4. Сверьте настройки.'];
  const samePrefix = first.pageSha256.every((h, i) => h === repeat.pageSha256[i]);
  if (first.pages + 1 === repeat.pages && samePrefix && noTail(first) && allTail(repeat) &&
      tail.every(k => repeat.markerPages[k].includes(repeat.pages))) {
    return ['missing_last_page', `Последний лист отсутствует в первом PDF: ${first.pages} → ${repeat.pages}.`];
  }
  if (allTail(first) && allTail(repeat)) return ['tail_present_both', `Все три финальных блока есть в обеих копиях (${first.pages} → ${repeat.pages}).`];
  return ['needs_review', 'Конец или разбивка отличаются, но это не точная копия известного сценария. Нужна ручная сверка.'];
}

$('neutral').addEventListener('click', () => window.print());
let witness;
try {
  const r = await fetch(new URL('./status.json', import.meta.url));
  if (!r.ok) throw new Error('Сервер не подтвердил якорь сборки.');
  witness = await r.json();
  if (witness.pdfjs !== version) throw new Error('Версия локального PDF-парсера не совпадает.');
  $('compare').disabled = false;
  $('status').textContent = 'Выберите два файла после печати.';
} catch (error) { $('status').textContent = error.message; }
const controls = ['first', 'repeat', 'note', 'attest', 'compare'].map($);
$('pair').addEventListener('input', () => {
  if ($('receipt').hidden) return;
  $('receipt').hidden = true;
  $('status').textContent = 'Поля изменены. Сравните выбранные PDF заново.';
});
$('pair').addEventListener('submit', async event => {
  event.preventDefault();
  if (!witness || $('compare').disabled || !$('attest').checked) return;
  const files = [$('first').files[0], $('repeat').files[0]];
  const attestedOptions = $('note').value.trim();
  for (const control of controls) control.disabled = true;
  $('receipt').hidden = true;
  $('status').textContent = 'Читаем текст PDF на этом устройстве…';
  try {
    const first = await parse(files[0]);
    const repeat = await parse(files[1]);
    const [result, message] = verdict(first, repeat);
    const inputBytesEqual = first.sha256 === repeat.sha256;
    const receipt = { ...witness, nativePrintWitness: 'user-attested-only', attestedOptions,
      result, inputBytesEqual, first, repeat };
    $('receipt-text').textContent = JSON.stringify(receipt, null, 2);
    $('status').textContent = inputBytesEqual
      ? `${message} Файлы побайтно совпадают: это не подтверждает два отдельных сохранения. Проверьте выбор.`
      : message;
    $('copy').textContent = 'Скопировать квитанцию';
    $('receipt').hidden = false;
    $('receipt').open = true;
  } catch (error) {
    $('status').textContent = `Не удалось прочитать пару: ${error.message}`;
  } finally {
    for (const control of controls) control.disabled = false;
  }
});
$('copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('receipt-text').textContent);
    $('copy').textContent = 'Квитанция скопирована';
  } catch {
    const range = document.createRange();
    range.selectNodeContents($('receipt-text'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
});
