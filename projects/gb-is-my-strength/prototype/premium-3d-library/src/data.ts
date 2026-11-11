import { READING_GEOMETRY as R } from "./scene/readingGeometry";

export const BASE = "https://gospod-bog.ru";

/**
 * Обложки лежат рядом со сборкой, а не внутри одного файла: так зал не пухнет.
 * Считаем путь от базового адреса страницы — работает и на домене, и в подпапке.
 * Если файла нет, 3D-карточка рисует собственный арт, а модалка просто скрывает блок.
 */
const cover = (name: string) => new URL(`covers/${name}`, document.baseURI).href;
const imgBio = cover("biografii.webp");
const imgNag = cover("nagornaya.webp");
const imgOtst = cover("otstuplenie.webp");

export interface Item {
  id: string;
  kind: "section" | "card" | "tome" | "lectern";
  n: string;
  label: string;
  title: string;
  desc: string;
  tags: string[];
  href: string;
  color: string;
  /** угол на кольце, градусы (0 = порог / +Z, 180 = закат и «Статьи») */
  angle: number;
  radius: number;
  image?: string;
  glyph?: string;
  /** короткая надпись на корешке */
  spine?: string;
}

export const ITEMS: Item[] = [
  {
    id: "articles",
    kind: "section",
    n: "01",
    label: "Тексты",
    title: "Статьи",
    desc: "Экзегеза, богословие, переводы и ответы.",
    tags: ["Экзегеза", "Богословие", "Переводы", "Апологетика"],
    href: "/articles/",
    color: "#f0c27a",
    angle: 180,
    radius: 8.8,
  },
  {
    id: "series",
    kind: "section",
    n: "02",
    label: "По порядку",
    title: "Серии",
    desc: "Цельные исследования от первой части к последней.",
    tags: ["Нагорная проповедь", "Отступники"],
    href: "/nagornaya/",
    color: "#ff7f6b",
    angle: 252,
    radius: 8.8,
  },
  {
    id: "bio",
    kind: "section",
    n: "03",
    label: "Люди",
    title: "Биографии",
    desc: "Служители, реформаторы, богословы и их эпохи.",
    tags: ["Реформаторы", "Миссионеры", "Богословы"],
    href: "/biografii/",
    color: "#c9b6ff",
    angle: 324,
    radius: 8.8,
  },
  {
    id: "maps",
    kind: "section",
    n: "04",
    label: "Пространство",
    title: "Карты",
    desc: "Маршруты, события, связи и библейская география.",
    tags: ["Библейские атласы", "Маршруты", "События"],
    href: "/karty/",
    color: "#62e0d0",
    angle: 36,
    radius: 8.8,
  },
  {
    id: "creeds",
    kind: "section",
    n: "05",
    label: "Системы",
    title: "Конфессии",
    desc: "Документы веры, традиции и богословские различия.",
    tags: ["Исповедания", "Традиции", "Различия"],
    href: "/konfessii/",
    color: "#8fa8ff",
    angle: 108,
    radius: 8.8,
  },
  {
    id: "c-bio",
    kind: "card",
    n: "A",
    label: "Исторический проект",
    title: "Биографии служителей: хроника верных",
    desc: "Жизнь и труд пасторов, богословов, реформаторов и миссионеров в их историческом контексте — от Ранней Церкви до наших дней.",
    tags: ["Редакторский выбор", "История Церкви"],
    href: "/biografii/",
    color: "#c9b6ff",
    angle: 216,
    radius: 12.2,
    image: imgBio,
  },
  {
    id: "c-nag",
    kind: "card",
    n: "B",
    label: "Авторская серия · 5 частей",
    title: "Нагорная проповедь: исследование в 5 частях",
    desc: "Сравнительное исследование Матфея 5–7 и Луки 6:17–49 — содержание, методология записи, адресат, богодухновенность, Закон и Евангелие.",
    tags: ["Редакторский выбор", "Матфея 5–7", "Луки 6"],
    href: "/nagornaya/seriya/",
    color: "#ff7f6b",
    angle: 288,
    radius: 12.2,
    image: imgNag,
  },
  {
    id: "c-about",
    kind: "lectern",
    n: "C",
    label: "О проекте",
    title: "Библиотека, где содержание важнее шума",
    desc: "Авторские статьи, переводы зарубежных богословов, экзегетические разборы, биографии и ответы на вопросы, которые нельзя честно решить одним абзацем. Библиотеку ведёт Фёдор Милованов.",
    tags: ["Медленное чтение", "Проверяемые источники", "Фёдор Милованов"],
    href: "/about/",
    color: "#f0c27a",
    angle: 346,
    radius: 9.4,
    glyph: "S·D·G",
  },
  {
    id: "c-otst",
    kind: "card",
    n: "D",
    label: "Авторская серия · 5 частей",
    title: "Отступники: отступничество, падение и возвращение",
    desc: "Пётр, Иуда, временная вера, тяжёлое падение, ожесточение и предупреждения Евреям: почему Библия не сводит всякий уход к одной категории.",
    tags: ["Редакторский выбор", "Отступление"],
    href: "/otstupniki/",
    color: "#e8a35c",
    angle: 72,
    radius: 12.2,
    image: imgOtst,
  },
  {
    id: "c-hard",
    kind: "card",
    n: "E",
    label: "Новое · Трудные тексты · 42 мин",
    title: "Отступление от веры: Иуда, Евреям 6 и предупреждения всей Библии",
    desc: "Что значит «вкусили дара небесного», как Писание описывает временную веру и окончательное отпадение и как строгие предупреждения согласуются с сохранением святых.",
    tags: ["Экзегеза", "Евреям 6", "Редактор: Фёдор Милованов"],
    href: "/hard-texts/otstuplenie-ot-very-iuda-evreyam-6/",
    color: "#62e0d0",
    angle: 144,
    radius: 12.2,
    glyph: "Евр 6",
  },
  {
    id: "t-bapt",
    kind: "tome",
    n: "06",
    label: "Серия",
    title: "Баптисты России",
    spine: "Баптисты",
    desc: "Историческая серия: ночь на Куре, южная штунда, съезды 1884 года, петербургская линия, гонения, советские годы, инициативная группа и справочник.",
    tags: ["История", "Баптисты"],
    href: "/baptisty-rossii/",
    color: "#8c3030",
    angle: 18,
    radius: 13.05,
  },
  {
    id: "t-heart",
    kind: "tome",
    n: "07",
    label: "Серия",
    title: "Тайны человеческого сердца",
    spine: "Сердце",
    desc: "Что Писание называет сердцем: совесть, скрытые идолы, новое сердце, язык, скорбь и хранение сердца.",
    tags: ["Серия", "Сердце"],
    href: "/articles/chto-bibliya-nazyvaet-serdcem/",
    color: "#7a2d4a",
    angle: 52,
    radius: 13.05,
  },
  {
    id: "t-gill",
    kind: "tome",
    n: "08",
    label: "Серия · биография",
    title: "Джон Гилл (1697–1771)",
    spine: "Гилл",
    desc: "Лондонский пастор и экзегет: человек, учёный, наследие, полемика и справочник по трудам.",
    tags: ["Биографии", "Экзегеза"],
    href: "/articles/dzhon-gill-istoricheskiy-kontekst/",
    color: "#2c3f72",
    angle: 88,
    radius: 13.05,
  },
  {
    id: "t-teen",
    kind: "tome",
    n: "09",
    label: "Серия",
    title: "Подросток за кадром",
    spine: "Подросток",
    desc: "Двойная жизнь, семья и взросление: что делать церкви и родителям, границы власти и возвращение.",
    tags: ["Семья", "Церковь"],
    href: "/podrostok-za-kadrom/",
    color: "#2d5c4a",
    angle: 126,
    radius: 13.05,
  },
  {
    id: "t-gene",
    kind: "tome",
    n: "10",
    label: "Родословие",
    title: "От Адама до Христа",
    spine: "Родословие",
    desc: "Родословие от Адама до Христа — одна линия, по которой читается история Писания.",
    tags: ["Писание", "История"],
    href: "/rodosloviye/",
    color: "#8a6230",
    angle: 160,
    radius: 13.05,
  },
  {
    id: "t-enoch",
    kind: "tome",
    n: "11",
    label: "Трудные тексты",
    title: "Бытие 6, Енох, Иуда и Пётр",
    spine: "Бытие 6",
    desc: "Серия трудных текстов: сыны Божии, корпус 1 Еноха, ангелы под мраком, духи в темнице и благовестие мёртвым.",
    tags: ["Трудные тексты", "Бытие 6"],
    href: "/hard-texts/genesis-6/",
    color: "#3a4a6e",
    angle: 200,
    radius: 13.05,
  },
  {
    id: "t-pastor",
    kind: "tome",
    n: "12",
    label: "Серия",
    title: "Пастырям: власть и верность",
    spine: "Пастырям",
    desc: "Признаки здоровой церкви, дисциплина, тексты, которыми манипулируют, анатомия падения и верные неизвестные.",
    tags: ["Пастырство", "Церковь"],
    href: "/pastor-series/",
    color: "#5c3d78",
    angle: 236,
    radius: 13.05,
  },
  {
    id: "t-avram",
    kind: "tome",
    n: "13",
    label: "Карта",
    title: "Путь Авраама",
    spine: "Авраам",
    desc: "Интерактивная карта пути Авраама — рядом с разделом библейской географии.",
    tags: ["Карты", "Бытие"],
    href: "/karty/avraam/",
    color: "#1f6e68",
    angle: 272,
    radius: 13.05,
  },
  {
    id: "t-journal",
    kind: "tome",
    n: "14",
    label: "Журнал",
    title: "Журнал: документы и разборы",
    spine: "Журнал",
    desc: "Документы, новости и расследования — отдельный контур библиотеки, не смешанный со статьями.",
    tags: ["Журнал", "Документы"],
    href: "/journal/",
    color: "#4a4570",
    angle: 308,
    radius: 13.05,
  },
  {
    id: "t-app",
    kind: "tome",
    n: "15",
    label: "Инструмент",
    title: "Библейский тренажёр",
    spine: "Тренажёр",
    desc: "Тренажёр для тех, кто хочет не только прочитать текст, но и вспомнить его.",
    tags: ["Практика", "Писание"],
    href: "/app/",
    color: "#8a5a28",
    angle: 332,
    radius: 13.05,
  },
];

export const byId = (id: string) => ITEMS.find((i) => i.id === id)!;

export const itemPos = (i: Item): [number, number] => {
  const a = (i.angle * Math.PI) / 180;
  return [Math.sin(a) * i.radius, Math.cos(a) * i.radius];
};

/** Shared player collision shape and inner reading-table obstacle. */
export const PLAYER_COLLISION_RADIUS = 0.35;
export const CENTER_OBSTACLE_RADIUS = 3.35;

/**
 * Section viewpoints must never stop inside the central book's collision
 * volume. Keep a separate comfort clearance beyond the walking collision
 * boundary and derive both camera approach and sign framing from this pose.
 */
export const SECTION_APPROACH_DISTANCE = 5.4;
const SECTION_APPROACH_CLEARANCE = 0.15;
export function sectionApproachDistance(item: Item): number {
  const safeInnerRadius = CENTER_OBSTACLE_RADIUS + PLAYER_COLLISION_RADIUS
    + SECTION_APPROACH_CLEARANCE;
  return Math.max(0, Math.min(SECTION_APPROACH_DISTANCE, item.radius - safeInnerRadius));
}

/** Куда встать, чтобы читать экспонат с лицевой стороны. */
export function approachPose(it: Item) {
  const [ix, iz] = itemPos(it);
  const r = Math.hypot(ix, iz) || 1;
  const ux = ix / r;
  const uz = iz / r;
  const dist = it.kind === "section" ? sectionApproachDistance(it) : it.kind === "tome" ? 2.9 : it.kind === "lectern" ? R.lecternApproachDistance : 4.2;
  // The lectern page sits below visitor eye level. Aim at its physical
  // reading surface, otherwise the public map arrival stares above the book
  // and never exposes the actual interactive read/open affordance.
  const pitch = it.kind === "lectern"
    ? Math.atan2(R.lecternPageCenterY - EYE, dist)
    : it.kind === "section" ? 0.08 : it.kind === "tome" ? 0.05 : 0.08;
  // не даём точке выйти за колоннаду: иначе колонна закрывает экспонат
  const cap = Math.max(0, WALK_RADIUS - 0.75);
  const px = ix - ux * dist;
  const pz = iz - uz * dist;
  const pr = Math.hypot(px, pz);
  const k = pr > cap ? cap / pr : 1;
  return { x: px * k, z: pz * k, yaw: Math.atan2(-ux, -uz), pitch };
}

export interface View {
  x: number;
  z: number;
  yaw: number;
  pitch: number;
}

function look(x: number, z: number, tx: number, tz: number, pitch: number): View {
  return { x, z, yaw: Math.atan2(-(tx - x), -(tz - z)), pitch };
}

/** Точки, которые не привязаны к экспонату: порог и сердце зала. */
export const VIEWS: Record<string, View> = {
  gate: { ...look(0.15, 8.7, 2.35, 11.55, 0), pitch: -0.16 },
  heart: { ...look(2.4, 6.6, 0, 2.6, 0.34), pitch: 0.05 },
};

export const TOUR: { goto: string; kicker: string; text: string }[] = [
  {
    goto: "gate",
    kicker: "Порог",
    text: "«Господь Бог — сила моя: Он сделает ноги мои как у оленя и на высоты мои возведёт меня». Аввакум 3:19. Зал стоит на этих высотах: отсюда видна вся библиотека, и спешить некуда.",
  },
  {
    goto: "heart",
    kicker: "Сердце зала",
    text: "Светило в центре — девиз проекта. Вокруг него лента стиха. Пять дорог расходятся к разделам, закат смотрит туда же, куда и «Статьи».",
  },
  {
    goto: "articles",
    kicker: "01 · Статьи",
    text: "Экзегеза, богословие, переводы и ответы. Большинство путей по сайту начинается здесь — с конкретного текста, а не с мнения.",
  },
  {
    goto: "series",
    kicker: "02 · Серии",
    text: "Исследования, которые читают по порядку, от первой части к последней. Во внешнем круге — стела «Нагорной проповеди».",
  },
  {
    goto: "bio",
    kicker: "03 · Биографии",
    text: "Люди, а не только идеи: служители, реформаторы, богословы в их собственных эпохах. Рядом в колоннаде — том о Джоне Гилле.",
  },
  {
    goto: "maps",
    kicker: "04 · Карты",
    text: "Пространство Писания: маршруты, события, связи. Отдельные тома — путь Авраама и родословие от Адама до Христа.",
  },
  {
    goto: "creeds",
    kicker: "05 · Конфессии",
    text: "Документы веры, традиции и различия. Их держат рядом, не смешивая и не сглаживая.",
  },
  {
    goto: "c-otst",
    kicker: "Редакторский выбор",
    text: "Стелы внешнего круга — работы, с которых стоит начать. Эта серия различает падение, уход и возвращение: не всякий уход Библия называет одним словом.",
  },
  {
    goto: "t-bapt",
    kicker: "Колоннада",
    text: "Между колоннами — остальные большие работы: сердце, Гилл, баптисты России, подросток за кадром, Бытие 6, пастырская серия, журнал и тренажёр. Корешок открывается, как дверь.",
  },
  {
    goto: "c-about",
    kicker: "О проекте",
    text: "Библиотеку ведёт Фёдор Милованов. Это не лента и не набор цитат: медленное чтение, проверяемые источники, одна навигация. Soli Deo Gloria.",
  },
];

/** Порог смотрит на закат: игрок входит с +Z и идёт к свету. */
export const SPAWN = { x: 0, z: 9.6, yaw: 0, pitch: 0.02 };

const hitR = (k: Item["kind"]) => (k === "section" ? 1.05 : k === "card" ? 0.7 : k === "lectern" ? 0.48 : 0.55);

/** круги-препятствия для столкновений: [x, z, r] */
export const OBSTACLES: [number, number, number][] = [
  [0, 0, CENTER_OBSTACLE_RADIUS],
  [-1.9, 13.32, 0.46],
  [1.9, 13.32, 0.46],
  [2.35, 11.55, 0.36],
  ...ITEMS.map((i) => {
    const [x, z] = itemPos(i);
    return [x, z, hitR(i.kind)] as [number, number, number];
  }),
  ...ITEMS.filter((i) => i.kind === "section").map((i) => {
    const a = (i.angle * Math.PI) / 180;
    return [Math.sin(a) * 6.15, Math.cos(a) * 6.15, 0.42] as [number, number, number];
  }),
];

export const WALK_RADIUS = 13.55;
export const EYE = 1.65;
