/*
 * Reference contract for integration into gb-is-my-strength.
 *
 * IMPORTANT: this is not a fourth runtime and not a replacement for the
 * existing modules. When landing, split/merge these declarations into:
 *   - _shared/series/seriesConfig.ts
 *   - _shared/mobileChromeTypes.ts
 *   - _shared/mobileChromeRegistry.ts
 *
 * Book is a shape of the SERIES engine, never a separate mobile engine.
 */

export type EngineKind = 'series' | 'article' | 'page';
export type SeriesShape = 'flat' | 'book';
export type ThemeMode = 'light' | 'sepia' | 'dark';

export interface TocNode {
  id: string;
  label: string;
  level: 2 | 3;
}

export interface ReaderPage {
  id: string;
  title: string;
  shortTitle: string;
  href: string;
  minutes: number;
  toc: TocNode[];
}

export interface SeriesFrontmatter extends ReaderPage {
  kind: 'frontmatter';
  mark: string;
  ornament?: 'lily' | 'book';
}

export interface FlatSeriesPart extends ReaderPage {
  kind: 'part';
  roman: string;
}

export interface BookArticle extends ReaderPage {
  kind: 'article';
  arabic: number;
  chapterId: string;
}

export interface BookChapter {
  kind: 'chapter';
  id: string;
  roman: string;
  title: string;
  articles: BookArticle[];
}

export interface SeriesEngineBase {
  engine: 'series';
  id: string;
  title: string;
  shape: SeriesShape;
  frontmatter: SeriesFrontmatter[];
  settings: true;
  playback: true;
  help: true;
}

export interface FlatSeriesEngine extends SeriesEngineBase {
  shape: 'flat';
  parts: FlatSeriesPart[];
}

export interface BookSeriesEngine extends SeriesEngineBase {
  shape: 'book';
  chapters: BookChapter[];
}

export interface ArticleEngine {
  engine: 'article';
  id: string;
  title: string;
  page: ReaderPage;
  settings: true;
  playback: true;
  help: boolean;
}

export interface PageEngine {
  engine: 'page';
  id: string;
  title: string;
  search: true;
  playback: false;
  settings: false;
  help: false;
  bottomActions?: Array<'theme' | 'share' | 'filters'>;
}

export type EngineContract =
  | FlatSeriesEngine
  | BookSeriesEngine
  | ArticleEngine
  | PageEngine;

export interface DesktopChromeContract {
  rail: 'series-rail' | 'reader-rail' | 'none';
  toc: 'series-and-part' | 'book-chapter-article-part' | 'article' | 'none';
  progress: 'series-and-article' | 'article' | 'none';
  corner: 'reader-actions' | 'page-actions';
}

export interface MobileChromeContract {
  engine: EngineKind;
  primary: 'help' | 'search';
  progress: 'dual' | 'single' | 'none';
  toc: 'series-and-part' | 'book-and-article' | 'article' | 'none';
  playback: boolean;
  save: boolean;
  settings: boolean;
}

export function desktopChromeFor(contract: EngineContract): DesktopChromeContract {
  if (contract.engine === 'series') {
    return {
      rail: 'series-rail',
      toc: contract.shape === 'book'
        ? 'book-chapter-article-part'
        : 'series-and-part',
      progress: 'series-and-article',
      corner: 'reader-actions',
    };
  }
  if (contract.engine === 'article') {
    return {
      rail: 'reader-rail',
      toc: 'article',
      progress: 'article',
      corner: 'reader-actions',
    };
  }
  return {
    rail: 'none',
    toc: 'none',
    progress: 'none',
    corner: 'page-actions',
  };
}

export function mobileChromeFor(contract: EngineContract): MobileChromeContract {
  if (contract.engine === 'series') {
    return {
      engine: 'series',
      primary: 'help',
      progress: 'dual',
      toc: contract.shape === 'book' ? 'book-and-article' : 'series-and-part',
      playback: true,
      save: true,
      settings: true,
    };
  }
  if (contract.engine === 'article') {
    return {
      engine: 'article',
      primary: 'help',
      progress: 'single',
      toc: 'article',
      playback: true,
      save: true,
      settings: true,
    };
  }
  return {
    engine: 'page',
    primary: 'search',
    progress: 'none',
    toc: 'none',
    playback: false,
    save: false,
    settings: false,
  };
}

const ROMAN = /^[IVXLC]+$/;

function fail(id: string, message: string): never {
  throw new Error(`[engine:${id}] ${message}`);
}

function validateToc(id: string, toc: TocNode[]): void {
  if (!toc.length) fail(id, 'оглавление пусто');
  const seen = new Set<string>();
  for (const row of toc) {
    if (!row.id || !row.label) fail(id, 'строка оглавления без id/label');
    if (seen.has(row.id)) fail(id, `дублирующийся якорь ${row.id}`);
    seen.add(row.id);
  }
}

function validatePage(page: ReaderPage): void {
  if (!page.id || !page.title || !page.href) fail(page.id || '?', 'страница без id/title/href');
  if (!Number.isFinite(page.minutes) || page.minutes <= 0) fail(page.id, 'minutes должен быть > 0');
  validateToc(page.id, page.toc);
}

export function defineEngine<T extends EngineContract>(contract: T): T {
  if (!contract.id || !contract.title) fail(contract.id || '?', 'пустой id/title');

  if (contract.engine === 'page') {
    // playback/settings/help are literal false in PageEngine, so TypeScript
    // rejects the invalid combination before this validator runs.
    return contract;
  }

  if (contract.engine === 'article') {
    validatePage(contract.page);
    return contract;
  }

  contract.frontmatter.forEach(validatePage);

  if (contract.shape === 'flat') {
    if (!contract.parts.length) fail(contract.id, 'flat series без частей');
    contract.parts.forEach((part) => {
      if (!ROMAN.test(part.roman)) fail(part.id, `невалидная римская метка ${part.roman}`);
      validatePage(part);
    });
    return contract;
  }

  if (!contract.chapters.length) fail(contract.id, 'book series без глав');
  const chapterIds = new Set<string>();
  const pageIds = new Set<string>();

  for (const chapter of contract.chapters) {
    if (chapterIds.has(chapter.id)) fail(contract.id, `дубль главы ${chapter.id}`);
    chapterIds.add(chapter.id);
    if (!ROMAN.test(chapter.roman)) fail(chapter.id, `невалидная римская метка ${chapter.roman}`);
    if (!chapter.articles.length) fail(chapter.id, 'глава не может быть пустой');

    chapter.articles.forEach((article, index) => {
      if (article.chapterId !== chapter.id) fail(article.id, `parent должен быть ${chapter.id}`);
      if (article.arabic !== index + 1) fail(article.id, `ожидался номер ${index + 1}`);
      if (pageIds.has(article.id)) fail(contract.id, `дубль страницы ${article.id}`);
      pageIds.add(article.id);
      validatePage(article);
    });
  }

  return contract;
}
