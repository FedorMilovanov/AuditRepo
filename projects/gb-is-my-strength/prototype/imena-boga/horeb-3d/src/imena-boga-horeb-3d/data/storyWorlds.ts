/** HOREB / biblical-world route CONTRACT (design state, not deployed geometry).
 *
 * One curatorial assignment per existing Research ID. Textual truth is owned
 * by EXHIBITS and Research PR #379, NOT by this route ledger. Do not copy
 * Scriptures, speaker claims or approval flags into scene navigation.
 *
 * The Genesis world may include a creation PROLOGUE; Exodus main path follows
 * Exodus 1-40; later Hebrew Scriptures and NT remain independently curated.
 * An entry's primary chapter is not a claim that all its referenced parallel
 * passages belong to that single historical scene.
 */
export type StoryWorld = 'genesis' | 'exodus' | 'later-ot' | 'nt-future';
export type StoryChapter =
  | 'creation-prologue' | 'patriarchs'
  | 'moses-childhood' | 'moses-midian' | 'horeb-call' | 'egypt-return' | 'exodus-and-sea'
  | 'marah' | 'wilderness-sin' | 'rephidim' | 'sinai-covenant'
  | 'deuteronomy-epilogue' | 'later-ot-library' | 'nt-library';

export interface StoryStop {
  readonly id: StoryChapter;
  readonly world: StoryWorld;
  readonly biblicalRange: string;
  readonly place: string;
  readonly exhibitIds: readonly string[];
  readonly navigation: 'optional' | 'main' | 'future';
  readonly description: string;
}

/** Narrative order is deliberate. Empty stops are genuine Biblical episodes
 * without additional approved names-ledger ID, not fabricated exhibits.
 * These are proposed narrative ROUTES; only standalone Horeb plus the legacy QA lab are physically built. */
export const STORY_STOPS: readonly StoryStop[] = [
  { id: 'creation-prologue', world: 'genesis',
    biblicalRange: 'Быт. 1–11', place: 'Литературный пролог к миру Бытия',
    exhibitIds: ['elohim'], navigation: 'optional',
    description: 'Начало Бытия; не отождествлять творение с физической локацией патриархов.' },
  { id: 'patriarchs', world: 'genesis',
    biblicalRange: 'Быт. 12–50', place: 'Отдельный будущий мир патриархов',
    exhibitIds: ['el-elyon', 'el-shaddai', 'el-roi', 'el-olam', 'yireh', 'el-bethel'],
    navigation: 'future',
    description: 'Разные места и события Авраама, Агари и Иакова; не один общий колодец.' },
  { id: 'moses-childhood', world: 'exodus',
    biblicalRange: 'Исх. 1:8–2:10', place: 'Нил: рождение и спасение Моисея',
    exhibitIds: [], navigation: 'main',
    description: 'Начало истории с младенца среди тростника; фон — угнетение Израиля, но не установленный адрес берега или дворца.' },
  { id: 'moses-midian', world: 'exodus',
    biblicalRange: 'Исх. 2:11–25', place: 'Взросление Моисея, бегство, Мадиам',
    exhibitIds: [], navigation: 'main',
    description: 'Отдельные эпохи и места; события не представлять единым непрерывным маршрутом или точной картой.' },
  { id: 'horeb-call', world: 'exodus',
    biblicalRange: 'Исх. 3–4', place: 'Хорив: призвание Моисея, неопалимая купина',
    exhibitIds: ['ehyeh', 'yhwh'], navigation: 'main',
    description: 'Отправная кульминация; Исх. 3:12 обещает служение на этой горе.' },
  { id: 'egypt-return', world: 'exodus',
    biblicalRange: 'Исх. 4:18–12:51', place: 'Переход к другой локации: Египет',
    exhibitIds: [], navigation: 'main',
    description: 'Моисей возвращается в Египет; Египет не является соседней пещерой Хорива.' },
  { id: 'exodus-and-sea', world: 'exodus',
    biblicalRange: 'Исх. 13–15:21', place: 'Море и Песнь Моисея',
    exhibitIds: ['yah'], navigation: 'main',
    description: 'Библейская последовательность, не GPS-модель маршрута или механизм чуда.' },
  { id: 'marah', world: 'exodus',
    biblicalRange: 'Исх. 15:22–27', place: 'Марра и Елим',
    exhibitIds: ['rapha'], navigation: 'main',
    description: 'Горькая вода и отличимый оазис; не смешивать с источником Агари.' },
  { id: 'wilderness-sin', world: 'exodus',
    biblicalRange: 'Исх. 16', place: 'Пустыня Син',
    exhibitIds: [], navigation: 'main',
    description: 'Манна и доверие; дополнительная глава без нового Research ID.' },
  { id: 'rephidim', world: 'exodus',
    biblicalRange: 'Исх. 17–18', place: 'Рефидим: вода из скалы и памятный жертвенник',
    exhibitIds: ['nissi'], navigation: 'main',
    description: 'Имя дано жертвеннику, а не создано новое личное имя Бога.' },
  { id: 'sinai-covenant', world: 'exodus',
    biblicalRange: 'Исх. 19–40', place: 'Синай: завет и последующее возобновление',
    exhibitIds: ['mekoddishkem', 'el-rahum-hannun', 'el-qanna', 'el'],
    navigation: 'main',
    description: 'Реальные стихи и несколько событий, не одна бесконечная церемония.' },
  { id: 'deuteronomy-epilogue', world: 'later-ot',
    biblicalRange: 'Втор. 32', place: 'Моисеева песнь: отдельное позднейшее свидетельство',
    exhibitIds: ['tsur', 'el-emunah', 'eloah'], navigation: 'future',
    description: 'Песнь относится к позднему контексту Второзакония, не в Исх. 3.' },
  { id: 'later-ot-library', world: 'later-ot',
    biblicalRange: 'Судьи, исторические книги, Псалтирь, пророки и Даниил',
    place: 'Будущие самостоятельные миры и исследовательская библиотека',
    exhibitIds: ['shalom', 'ro-i', 'sabaoth', 'el-gibbor', 'tsidkenu',
      'shammah', 'adonai', 'qedosh-yisrael', 'el-hay',
      'avinu', 'yhwh-ori', 'atiq-yomin', 'elah-shmaya'],
    navigation: 'future',
    description: 'Это библиотечная группа, НЕ реконструкция общей исторической сцены.' },
  { id: 'nt-library', world: 'nt-future',
    biblicalRange: 'Евангелия, апостольские свидетельства, Откровение',
    place: 'Отдельные будущие новозаветные локации',
    exhibitIds: ['abba', 'pantokrator', 'alpha-omega', 'ego-eimi', 'immanuel',
      'kyrios-ho-theos', 'poimen-ho-kalos', 'anastasis-zoe',
      'ho-on-erchomenos', 'arche-telos'],
    navigation: 'future',
    description: 'Значения имеют интертекстуальные связи с ВЗ; всё равно не помещать НЗ в Хорив.' },
] as const;

/** First 3D slice: physically separate Horeb from the legacy 42-item lab.
 * The two IDs are derived from the SAME canonical chronology, not from
 * an invented duplicate source registry. The complete 42 entries remain
 * in the accessible reader and the explicit legacy QA laboratory.
 */
export type ExpeditionMode = 'horeb' | 'legacy';
/** Cinematic, source-grounded PRELUDE to the already implemented Horeb.
 * Editorial vignettes are not photographs, geolocated sets, or completed
 * playable chapters. The first frame is the infant, not a generic desert.
 */
export const MOSES_ORIGIN_BEATS = [
  { id: 'basket', reference: 'Исх. 2:1–4',
    title: 'Младенец у Нила',
    scene: 'В зарослях папируса у берега стоит осмолённая корзина. Сестра ребёнка наблюдает издали. Угроза фараонова указа остаётся в предыстории.',
    limit: 'В тексте корзину оставляют среди тростника у берега; долгого путешествия корзины по течению там нет.' },
  { id: 'rescued', reference: 'Исх. 2:5–10',
    title: 'Дочь фараона',
    scene: 'Египетская царевна находит плачущего ребёнка. Благодаря его сестре младенец возвращается к родной матери на время вскармливания.',
    limit: 'Библейский текст не называет царевну, не сообщает точный дворец, фасад здания или возраст мальчика при последующем переходе в дом царевны.' },
  { id: 'grown', reference: 'Исх. 2:11–15',
    title: 'Выбор и бегство',
    scene: 'Уже взрослый Моисей видит тяжёлый труд своего народа и насилие над евреем. После убийства египтянина он вынужден бежать от фараона.',
    limit: 'Нельзя романтизировать убийство или выдумывать сцены детства и учёбы во дворце, не описанные здесь.' },
  { id: 'midian', reference: 'Исх. 2:16–22',
    title: 'Жизнь в Мадиаме',
    scene: 'Моисей защищает дочерей мадиамского священника у колодца, остаётся у их семьи и женится на Сепфоре.',
    limit: 'Местоположение конкретного колодца и архитектура дома не установлены текстом.' },
  { id: 'cry', reference: 'Исх. 2:23–25',
    title: 'Бог услышал стенания',
    scene: 'Проходит время. Израиль стонет от тяжёлого труда; Бог слышит и вспоминает завет с Авраамом, Исааком и Иаковом.',
    limit: 'Не изображать Божий завет как человеческий договор на свитке и не назначать точный год событий.' },
  { id: 'shepherd', reference: 'Исх. 3:1',
    title: 'Пастух на пути к Хориву',
    scene: 'Моисей пасёт стадо Иофора и приходит к Хориву. Здесь начинается действующая 3D-глава о неопалимой купине.',
    limit: 'Точная современная гора и маршрут пастуха не установлены. Хорив в проекте — художественный ландшафт.' },
] as const;

/** W8D: source-ordered micro-scenes inside the SECOND Nile episode.
 * ONLY the discovery is physically staged in Three.js. The nursing
 * arrangement and later adoption are time-separated textual intertitles:
 * do not invent a palace interior, precise ages or a second 3D location.
 * Original editorial paraphrases, not verbatim licensed Bible text.
 */
export const MOSES_RESCUE_STAGES = [
  { id:'discovery', reference:'Исх. 2:5–6', title:'Корзина среди тростника',
    label:'Обнаружение',
    scene:'Дочь фараона видит корзину среди тростника. Служанка приносит её. Царевна открывает корзину, замечает плачущего мальчика и проявляет сострадание.',
    transition:'Это единственный момент эпизода, представленный в 3D. Имена царевны и служанок текст не сообщает.' },
  { id:'nursing', reference:'Исх. 2:7–9', title:'Сестра и родная мать',
    label:'Мать-кормилица',
    scene:'Сестра ребёнка предлагает найти женщину, которая сможет его кормить. По разрешению царевны она зовёт родную мать мальчика; та берёт его на вскармливание.',
    transition:'Сестра, мать и их разговор не помещаются искусственно в ту же 3D-композицию обнаружения.' },
  { id:'adoption', reference:'Исх. 2:10', title:'Имя Моисей',
    label:'Имя Моисей',
    scene:'Когда ребёнок подрос, мать привела его к дочери фараона. Он стал её сыном и получил имя Моисей — повествование связывает имя со спасением из воды.',
    transition:'Между вскармливанием и усыновлением прошло время, но возраст мальчика, точная продолжительность и дворцовая обстановка здесь не названы.' },
] as const;

/** W9A: Exodus 2:11–25 chronological reading, with transparent time and
 * location breaks. Not preapproved 3D sets or museum exhibit records.
 * Editorial paraphrases grounded in the cited verses (not licensed quotes).
 */
export const MOSES_PREHOREB_BEATS = {
  grown: [
    { id:'oppression', reference:'Исх. 2:11–12', label:'Насилие в Египте',
      title:'Моисей видит угнетение',
      scene:'Уже взрослый Моисей видит тяжёлый труд евреев и египтянина, который бьёт одного из них. Моисей убивает египтянина и скрывает тело в песке.',
      limitation:'Убийство не изображается как безупречный подвиг. Обстоятельства не позволяют устанавливать точный возраст, улицу или дворцовое окружение.' },
    { id:'exposure', reference:'Исх. 2:13–14', label:'Тайна раскрыта',
      title:'Ссора между евреями',
      scene:'На следующий день Моисей пытается остановить драку двух евреев. Один из них спрашивает, кто поставил Моисея судьёй, и указывает на вчерашнее убийство.',
      limitation:'Не объединять столкновение с египтянином и ссору двух евреев в один день или одно событие.' },
    { id:'flight', reference:'Исх. 2:15', label:'Бегство',
      title:'Моисей покидает Египет',
      scene:'Услышав о случившемся, фараон намеревается убить Моисея. Моисей спасается бегством и оказывается в земле Мадиамской, где садится у колодца.',
      limitation:'Путь в Мадиам нельзя рисовать как установленный GPS-маршрут. Имя фараона и точный колодец не определены.' },
  ],
  midian: [
    { id:'well', reference:'Исх. 2:16–17', label:'У колодца',
      title:'Семь дочерей и пастухи',
      scene:'Семь дочерей мадиамского священника пришли напоить стадо. Другие пастухи пытались их прогнать, но Моисей помог женщинам и напоил животных.',
      limitation:'Не переносить сюда сцены с Авраамом, Исааком или Иаковом: схожий мотив колодца не означает тождество места.' },
    { id:'household', reference:'Исх. 2:18–21', label:'Дом Рагуила',
      title:'Приглашение и Сепфора',
      scene:'Дочери рассказывают о спасшем их человеке Рагуилу, названному здесь их отцом. Моисей принимает приглашение, остаётся у семьи и женится на Сепфоре.',
      limitation:'В Исх. 3:1 назван Иофор. Различение имён Рагуил/Иофор требует отдельного объяснения, а не выдуманного родословия или двух изображённых глав семьи.' },
    { id:'gershom', reference:'Исх. 2:22', label:'Сын Гирсам',
      title:'Чужеземец в чужой земле',
      scene:'У Моисея и Сепфоры рождается сын Гирсам. Моисей связывает данное имя со своим положением пришельца в чужой стране.',
      limitation:'Повествовательная игра слов с именем не устанавливает точную этимологию, год рождения, возраст Моисея или устройство семейного жилища.' },
  ],
  cry: [
    { id:'duration', reference:'Исх. 2:23', label:'Прошло время',
      title:'Рабство продолжается',
      scene:'Проходит длительное время, умирает царь Египта. Однако угнетение израильтян продолжается; люди стонут от тяжёлого труда и взывают о помощи.',
      limitation:'Смерть правителя не следует показывать как немедленное освобождение. Длительность периода и имя царя не названы.' },
    { id:'covenant', reference:'Исх. 2:24–25', label:'Бог услышал',
      title:'Бог помнит Свой завет',
      scene:'Бог слышит стенания народа, вспоминает Свой завет с Авраамом, Исааком и Иаковом, видит Израиль и обращает на него внимание.',
      limitation:'«Вспоминает» не означает, что Бог прежде забыл обещание. Здесь не требуется визуализировать Бога или Его завет как человеческий документ.' },
  ],
} as const;

export const HOREB_CALL_STOP = STORY_STOPS.find(s => s.id === 'horeb-call')!;
export const EGYPT_RETURN_STOP = STORY_STOPS.find(s => s.id === 'egypt-return')!;

/** Source-order reading plan only. No approved 3D Egyptian locations or
 * additional Research names have been assigned to these episodes. */
export const EGYPT_EPISODES = [
  { id: 'return', reference: 'Исх. 4:18–31', title: 'Возвращение Моисея',
    summary: 'От Иофора к возвращению в Египет, встрече с Аароном и обращению к старейшинам.' },
  { id: 'pharaoh', reference: 'Исх. 5:1–7:7', title: 'Противостояние с фараоном',
    summary: 'Требование отпустить народ, усиление принудительного труда и Божье обетование избавления.' },
  { id: 'judgments', reference: 'Исх. 7:8–11:10', title: 'Знамения и суды',
    summary: 'Повествование о знамениях, казнях и отказе фараона; не реконструкция природного механизма чудес.' },
  { id: 'passover', reference: 'Исх. 12:1–51', title: 'Пасха и исход',
    summary: 'Установление Пасхи, последняя казнь и выход из Египта; дальнейший путь к морю относится к новой главе.' },
] as const;

/** W6D: text-grounded beats of the FIRST Egypt episode. These are reader
 * notes, not approved scenery, archaeological identifications or copies of
 * licensed Bible translations. Keep ambiguous referents unresolved. */
export const EGYPT_RETURN_BEATS = [
  { id: 'leave-midian', reference: 'Исх. 4:18–20',
    title: 'Прощание с Иофором',
    reading: 'Моисей получает разрешение уйти, отправляется с женой и сыновьями; текст упоминает осла и Божий жезл.',
    limitation: 'Точное положение Мадиама и длина пути не установлены этим текстом.',
    interpretation: 'narrative' },
  { id: 'message-to-pharaoh', reference: 'Исх. 4:21–23',
    title: 'Наставление перед встречей с фараоном',
    reading: 'Бог объявляет Моисею, что именно следует сказать фараону, в том числе о первородном сыне Израиле.',
    limitation: 'Это наставление на пути, а не уже состоявшаяся сцена в тронном зале.',
    interpretation: 'narrative' },
  { id: 'zipporah', reference: 'Исх. 4:24–26',
    title: 'Трудный эпизод с Сепфорой',
    reading: 'На месте ночлега Сепфора совершает обрезание сына. Краткий рассказ содержит неясные местоимения.',
    limitation: 'Нельзя выдавать личность того, кому угрожала смерть, жест Сепфоры и причины происшествия за бесспорно установленные детали постановки.',
    interpretation: 'ambiguous' },
  { id: 'aaron-at-mountain', reference: 'Исх. 4:27–28',
    title: 'Встреча Аарона у горы Божией',
    reading: 'Аарон идёт в пустыню и встречает Моисея у горы Божией; Моисей передаёт ему слова и знамения.',
    limitation: 'Эта встреча не описана как встреча во дворце или на улицах Египта.',
    interpretation: 'narrative' },
  { id: 'elders', reference: 'Исх. 4:29–31',
    title: 'Собрание старейшин Израиля',
    reading: 'Моисей и Аарон собирают старейшин, передают слова Господа и знамения; народ верит и поклоняется.',
    limitation: 'Точное здание и адрес собрания в тексте не названы.',
    interpretation: 'narrative' },
] as const;

/** W6E: seven successive TEXT-ONLY moments from Exodus 5:1–7:7.
 * No reconstructed throne room, named pharaoh, Hebrew slave portrait,
 * historical date, exact brick quota or 3D approval is implied. */
export const EGYPT_PHARAOH_BEATS = [
  { id: 'first-audience', reference: 'Исх. 5:1–5',
    title: 'Первое обращение к фараону',
    reading: 'Моисей и Аарон требуют отпустить народ для поклонения Господу. Фараон отвергает требование и возвращает их к работе.',
    limitation: 'Библейский текст не называет фараона и не описывает архитектуру зала аудиенции.' },
  { id: 'bricks-and-straw', reference: 'Исх. 5:6–14',
    title: 'Солома и прежняя норма кирпичей',
    reading: 'Распорядители перестают выдавать солому, люди собирают её сами, но ежедневное количество кирпичей не уменьшается; начальников израильтян бьют.',
    limitation: 'Текст не сообщает численного размера нормы, техники конкретной мастерской или адреса производства. Это НЕ приказ делать кирпичи вообще без соломы.' },
  { id: 'foremen-complaint', reference: 'Исх. 5:15–21',
    title: 'Жалоба надзирателей и упрёк Моисею',
    reading: 'Израильские начальники труда обращаются к фараону, не получают облегчения и обвиняют Моисея и Аарона в ухудшении своего положения.',
    limitation: 'Нельзя объединять египетских принуждающих надсмотрщиков и израильских начальников в одну должность.' },
  { id: 'moses-complaint', reference: 'Исх. 5:22–6:1',
    title: 'Обращение Моисея к Господу',
    reading: 'Моисей спрашивает, почему бедствие усилилось; Бог отвечает обещанием избавить народ.',
    limitation: 'Это отдельный разговор с Богом, а не продолжение речи Моисея перед фараоном.' },
  { id: 'divine-promise', reference: 'Исх. 6:2–13',
    title: 'Имя Господа и обетование избавления',
    reading: 'Бог напоминает о завете с праотцами, обещает освобождение и поручает Моисею говорить с народом и фараоном.',
    limitation: 'Исх. 6:3 не следует упрощать до утверждения, будто имя YHWH впервые появляется только здесь: в Бытии оно уже встречается; толкование требует отдельной текстологической сверки.' },
  { id: 'genealogy', reference: 'Исх. 6:14–27',
    title: 'Родословная Моисея и Аарона',
    reading: 'Повествование называет роды Рувима, Симеона и Левия, затем прослеживает происхождение Моисея и Аарона.',
    limitation: 'Это литературная родословная в тексте, а не разрешение реконструировать внешность, точные даты или жилища перечисленных людей.' },
  { id: 'renewed-commission', reference: 'Исх. 6:28–7:7',
    title: 'Повторное поручение перед знамениями',
    reading: 'Бог вновь поручает Моисею и Аарону обратиться к фараону; текст указывает их возраст, но ещё не описывает первую казнь.',
    limitation: 'Не переносить знамения и казни из Исх. 7:8 и далее внутрь этого эпизода.' },
] as const;

/** A contextual artwork, not a picture of Moses or proof of Exodus dating.
 * Rights are stated by the Museum on the object record; the project uses
 * the LINK only, without embedding or re-licensing an image. */
export const EGYPT_BRICKWORK_CONTEXT = {
  institution: 'The Metropolitan Museum of Art',
  work: 'Brickmakers, Tomb of Rekhmire',
  catalog: '30.4.77',
  period: 'XVIII династия, ок. 1479–1425 гг. до н. э.',
  url: 'https://www.metmuseum.org/art/collection/search/544649',
  limitation: 'Роспись, известная по современной копии Нины де Гарис Дэвис, показывает египетскую технологию кирпичного производства, но не доказывает участие изображённых работников в событиях Исхода и не устанавливает дату этих событий.',
} as const;

/** W6C concept gate: a scene design is not a historical site identification.
 * Episode order and verse references come ONLY from EGYPT_EPISODES above.
 * No Egypt mesh, route coordinates, Research IDs, or right to publish exist.
 * Physical scenes require separate evidence, art, rights, and QA acceptance.
 */
export type EgyptEpisodeId = (typeof EGYPT_EPISODES)[number]['id'];
const EGYPT_STAGE_CONCEPTS = {
  return: {
    space: 'раздельные точки повествования, а не непрерывная тропа',
    possibleTreatment: 'смена глав между возвращением Моисея, встречей с Аароном и Египтом',
    cannotClaim: 'маршрут Мадиам—Хорив—Египет с измеренными расстояниями',
  },
  pharaoh: {
    space: 'условная административная аудиенция, место точно не установлено',
    possibleTreatment: 'отдельный эпизод обращения Моисея и Аарона к фараону',
    cannotClaim: 'личность фараона, конкретный дворец, подлинный тронный зал',
  },
  judgments: {
    space: 'несколько разнесённых событий без единой подтверждённой карты',
    possibleTreatment: 'последовательные повествовательные сцены без объяснения механизма чудес',
    cannotClaim: 'географическая точность каждого суда или природное объяснение казней',
  },
  passover: {
    space: 'домашний контекст Пасхи и отдельное повествование о выходе',
    possibleTreatment: 'сцена чтения о домах и переход к следующей исторической главе',
    cannotClaim: 'аутентичность конкретного жилища или GPS-путь исхода',
  },
} as const satisfies Record<EgyptEpisodeId, {
  space: string; possibleTreatment: string; cannotClaim: string;
}>;

export const EGYPT_SPATIAL_BLUEPRINT = EGYPT_EPISODES.map(episode => ({
  episodeId: episode.id,
  passage: episode.reference,
  ...EGYPT_STAGE_CONCEPTS[episode.id],
  geographicalCoordinates: null,
  physicalResearchExhibits: [] as const,
  physicalSceneReady: false as const,
  releaseGate: 'HOLD' as const,
  transition: 'chapter-cut' as const,
}));

export const HOREB_CALL_START = { x: 0, z: -338 } as const;
export function sceneExhibitsForMode<T extends { readonly id: string }>(
  registry: readonly T[], mode: ExpeditionMode,
): T[] {
  if (mode === 'legacy') return [...registry];
  if (mode !== 'horeb') throw new Error('3D expedition mode not approved: ' + String(mode));
  const activeIds = new Set(HOREB_CALL_STOP.exhibitIds);
  return registry.filter(item => activeIds.has(item.id));
}
export const EXODUS_CHAPTER_ORDER: readonly StoryChapter[] = [
  'moses-childhood', 'moses-midian', 'horeb-call', 'egypt-return', 'exodus-and-sea', 'marah',
  'wilderness-sin', 'rephidim', 'sinai-covenant',
];

export function worldForResearchId(id: string): StoryWorld | null {
  return STORY_STOPS.find(s => s.exhibitIds.includes(id))?.world ?? null;
}
export function chapterForResearchId(id: string): StoryChapter | null {
  return STORY_STOPS.find(s => s.exhibitIds.includes(id))?.id ?? null;
}

export interface RoutableExhibit { readonly id: string; readonly publicationState: string; }

/** Fail-closed integrity validator; never mistake design routing for an
 * approval to display source claims or move physical props. */
export function validateStoryWorlds(registry: readonly RoutableExhibit[]): string[] {
  const errors: string[] = [];
  const exhibitIds = new Set(registry.map(e => e.id));
  if (registry.length !== 42 || exhibitIds.size !== 42)
    errors.push('expected exactly 42 distinct Research exhibits');
  const seen = new Set<string>();
  const chapterIds = new Set<StoryChapter>();
  for (const stop of STORY_STOPS) {
    if (chapterIds.has(stop.id)) errors.push('duplicate story chapter: ' + stop.id);
    chapterIds.add(stop.id);
    if (!stop.place || !stop.biblicalRange || !stop.description)
      errors.push('missing source or narrative label in ' + stop.id);
    for (const id of stop.exhibitIds) {
      if (!exhibitIds.has(id)) errors.push('missing Research ID: ' + id);
      if (seen.has(id)) errors.push('duplicate story assignment: ' + id);
      seen.add(id);
    }
  }
  for (const id of exhibitIds) if (!seen.has(id))
    errors.push('unassigned Research ID: ' + id);
  for (const id of seen) if (!exhibitIds.has(id))
    errors.push('story ID absent from registry: ' + id);
  if (registry.some(e => e.publicationState !== 'HOLD'))
    errors.push('story route cannot approve Research / rights');
  const exodus = STORY_STOPS.filter(s => s.world === 'exodus');
  if (exodus.map(s => s.id).join('|') !== EXODUS_CHAPTER_ORDER.join('|'))
    errors.push('Exodus 1–40 chapter order is broken');
  if (STORY_STOPS.find(s => s.id === 'horeb-call')?.exhibitIds.join('|') !== 'ehyeh|yhwh' ||
      STORY_STOPS.find(s => s.id === 'moses-childhood')?.exhibitIds.length !== 0 ||
      STORY_STOPS.find(s => s.id === 'moses-midian')?.exhibitIds.length !== 0 ||
      STORY_STOPS.find(s => s.id === 'egypt-return')?.exhibitIds.length !== 0 ||
      STORY_STOPS.find(s => s.id === 'wilderness-sin')?.exhibitIds.length !== 0)
    errors.push('Horeb / Egypt / wilderness narrative boundaries lost');
  if (exodus.some(s => s.navigation !== 'main') ||
      STORY_STOPS.filter(s => s.world === 'nt-future').some(s => s.navigation !== 'future'))
    errors.push('unapproved cross-world narrative route');
  return errors;
}
