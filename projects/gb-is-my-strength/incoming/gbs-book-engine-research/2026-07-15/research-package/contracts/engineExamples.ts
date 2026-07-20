import {
  defineEngine,
  type ArticleEngine,
  type BookSeriesEngine,
  type FlatSeriesEngine,
  type PageEngine,
  type TocNode,
} from './enginePlatformContracts';

const toc = (...labels: string[]): TocNode[] => labels.map((label, index) => ({
  id: `sec-${index + 1}`,
  label,
  level: 2,
}));

export const GILL_FLAT_SERIES: FlatSeriesEngine = defineEngine({
  engine: 'series',
  shape: 'flat',
  id: 'dzhon-gill',
  title: 'Джон Гилл',
  settings: true,
  playback: true,
  help: true,
  frontmatter: [
    {
      kind: 'frontmatter',
      id: 'context',
      mark: 'Введение',
      ornament: 'lily',
      title: 'Исторический контекст',
      shortTitle: 'Контекст',
      href: '/articles/dzhon-gill-istoricheskiy-kontekst/',
      minutes: 16,
      toc: toc('I. От пуритан к диссентерам', 'II. Великое изгнание', 'III. Саутварк'),
    },
  ],
  parts: [
    {
      kind: 'part', id: 'part1', roman: 'I', title: 'Человек', shortTitle: 'Становление',
      href: '/articles/dzhon-gill-chast-1-chelovek/', minutes: 39,
      toc: toc('I. Становление и призвание', 'II. Служение в Хорслидауне', 'III. Семья и скорбь'),
    },
    {
      kind: 'part', id: 'part2', roman: 'II', title: 'Учёный', shortTitle: 'Языки и книги',
      href: '/articles/dzhon-gill-chast-2-uchenyi/', minutes: 71,
      toc: toc('I. Языковая школа', 'II. Раввинистика', 'III. Богословская система'),
    },
  ],
});

export const HEART_BOOK: BookSeriesEngine = defineEngine({
  engine: 'series',
  shape: 'book',
  id: 'hard-texts',
  title: 'Тайны человеческого сердца',
  settings: true,
  playback: true,
  help: true,
  frontmatter: [
    {
      kind: 'frontmatter', id: 'prolog', mark: 'Пролог', ornament: 'lily',
      title: 'Библейская кардиология', shortTitle: 'Что Библия называет сердцем',
      href: '/articles/chto-bibliya-nazyvaet-serdcem/', minutes: 39,
      toc: toc('I. Сердце в Писании', 'II. Мысль и воля', 'III. Поклонение'),
    },
  ],
  chapters: [
    {
      kind: 'chapter', id: 'ch1', roman: 'I', title: 'Диагноз сердца',
      articles: [
        {
          kind: 'article', id: 'krajne', chapterId: 'ch1', arabic: 1,
          title: 'Крайне ли испорчено сердце?', shortTitle: 'Иеремия 17',
          href: '/articles/krajne-li-isporcheno-serdce/', minutes: 41,
          toc: toc('I. Исторический фон', 'II. Грех, вырезанный в человеке', 'III. Два образа доверия', 'IV. Источник самообмана'),
        },
        {
          kind: 'article', id: 'idoly', chapterId: 'ch1', arabic: 2,
          title: 'Скрытые идолы сердца', shortTitle: 'Чему поклоняется сердце',
          href: '/articles/skrytye-idoly-serdca/', minutes: 26,
          toc: toc('I. Что такое идол', 'II. Обещание идола', 'III. Разоблачение поклонения'),
        },
      ],
    },
  ],
});

export const HERMENEUTICS_ARTICLE: ArticleEngine = defineEngine({
  engine: 'article',
  id: 'hermenevtika',
  title: 'Оценка христоцентричной герменевтики',
  settings: true,
  playback: true,
  help: true,
  page: {
    id: 'hermenevtika',
    title: 'Оценка христоцентричной герменевтики',
    shortTitle: 'Герменевтика',
    href: '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/',
    minutes: 50,
    toc: toc('Герменевтические определения', 'Объяснение христоцентричной герменевтики', 'Часто задаваемые вопросы'),
  },
});

export const ARTICLES_CATALOG: PageEngine = defineEngine({
  engine: 'page',
  id: 'articles-catalog',
  title: 'Все статьи',
  search: true,
  playback: false,
  settings: false,
  help: false,
  bottomActions: ['theme', 'filters'],
});
