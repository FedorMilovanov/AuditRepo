// ExhibitRegistry — единственный источник контента для 3D-меток и HTML-режима.
// Статус: ЛАБОРАТОРНЫЙ ПРОТОТИП. Ни одна запись не имеет публикационного допуска
// (Research PR #379 — draft; 0 разрешённых публикационных единиц на момент брифа).

export type Category =
  | 'personal_divine_name'
  | 'divine_self_declaration'
  | 'deity_designation'
  | 'divine_title'
  | 'divine_epithet'
  | 'metaphor_predication'
  | 'place_name'
  | 'altar_name'
  | 'city_name'
  | 'prophetic_christological_designation'
  | 'intertextual_theological_interpretation';

export type Lang = 'he' | 'arc' | 'grc';
export type ZoneId = 1 | 2 | 3 | 4 | 5 | 7;

export interface Exhibit {
  id: string;
  zone: ZoneId;
  displayLabelRu: string;
  category: Category;
  era: string;
  sourceLanguage: Lang;
  originalUnicode: string;
  transliteration: string;
  traditionalRu: string;
  verseReference: string;
  edition: string;
  verseUrl: string;
  speaker: string;
  referent: string;
  namedObject: string;
  literalGloss: string;
  interpretiveNotes: string;
  textualVariantNotes: string;
  researchStatus: 'working_draft' | 'disputed' | 'review_in_progress';
  rightsStatus: string;
  publicationState: 'HOLD';
}

export const CATEGORY_RU: Record<Category, string> = {
  personal_divine_name: 'Личное имя Бога',
  divine_self_declaration: 'Самоназвание Бога',
  deity_designation: 'Обозначение божества',
  divine_title: 'Божественный титул',
  divine_epithet: 'Эпитет',
  metaphor_predication: 'Метафора / предикация',
  place_name: 'Название места',
  altar_name: 'Имя жертвенника',
  city_name: 'Имя города',
  prophetic_christological_designation: 'Пророческое / христологическое обозначение',
  intertextual_theological_interpretation: 'Интертекстуальное / богословское толкование',
};

export const ZONES: { id: number; title: string; sub: string }[] = [
  { id: 0, title: 'Порог', sub: 'Предисловие' },
  { id: 1, title: 'Галерея Творения', sub: 'Бог Всевышний' },
  { id: 2, title: 'Галерея Патриархов', sub: 'Видящий и Шаддай' },
  { id: 3, title: 'Имена как память о действии', sub: 'Жертвенники и места' },
  { id: 4, title: 'Святость и Воинства', sub: 'Святой, Ревнитель, Скала' },
  { id: 5, title: 'Позднейшие свидетельства', sub: 'Литературное продолжение' },
  { id: 6, title: 'Узкий выход', sub: 'К Хориву' },
  { id: 7, title: 'Несгорающий куст', sub: 'Исход 3' },
];

const MM = 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)';
const MMR = 'Короткая лексема; права на цифровую редакцию не проверены, полный текст не воспроизводится';
const NA = 'Греческий текст НЗ (сверка с NA28 не выполнена)';
const NAR = 'Короткая лексема; лицензия NA28 не распространяется на прототип — проверка прав открыта';

export const EXHIBITS: Exhibit[] = [
  // ── Зона 1
  {
    id: 'elohim-gen-1-1', zone: 1, displayLabelRu: 'Элохим', category: 'deity_designation',
    era: 'Пятикнижие (литературная датировка дискуссионна)', sourceLanguage: 'he',
    originalUnicode: 'אֱלֹהִים', transliteration: 'ʾĕlōhîm', traditionalRu: 'Элохим', verseReference: 'Быт. 1:1',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0101.htm',
    speaker: 'Повествователь', referent: 'Бог Израиля (по контексту)', namedObject: '—',
    literalGloss: '«Бог / боги» (форма мн. ч.)',
    interpretiveNotes: 'В Быт. 1:1 подлежащее согласуется с глаголом ед. ч. בָּרָא. Из одной морфологии нельзя «доказать» учение о Троице. В других контекстах то же слово обозначает «других богов».',
    textualVariantNotes: 'Критическая рукописная колляция не выполнена.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'el-elyon-gen-14', zone: 1, displayLabelRu: 'Эль Элион — Бог Всевышний', category: 'divine_title',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל עֶלְיוֹן', transliteration: 'ʾēl ʿelyôn', traditionalRu: 'Эль Элион', verseReference: 'Быт. 14:18–22',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0114.htm',
    speaker: 'Повествователь (14:18), Мелхиседек (14:19–20), Аврам (14:22)', referent: 'Бог, «Владыка неба и земли»', namedObject: '—',
    literalGloss: '«Бог Высочайший»',
    interpretiveNotes: 'В 14:22 Аврам ставит перед אֵל עֶלְיוֹן тетраграмматон, отождествляя Всевышнего с ЯХВЕ. Роли говорящих различаются.',
    textualVariantNotes: 'В 14:22 тетраграмматон отсутствует в LXX и Пешитте — вариант отмечен, не разрешён.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'el-olam-gen-21-33', zone: 1, displayLabelRu: 'Эль Олам — Бог вечный', category: 'divine_epithet',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל עוֹלָם', transliteration: 'ʾēl ʿôlām', traditionalRu: 'Эль Олам', verseReference: 'Быт. 21:33',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0121.htm',
    speaker: 'Повествователь об Аврааме, призвавшем имя', referent: 'ЯХВЕ', namedObject: '—',
    literalGloss: '«Бог вечности / древности»',
    interpretiveNotes: 'Формула стоит в приложении к тетраграмматону: «призвал там имя ЯХВЕ, Эль Олам».',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  // ── Зона 2
  {
    id: 'el-shaddai-gen-17-1', zone: 2, displayLabelRu: 'Эль Шаддай', category: 'divine_title',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל שַׁדַּי', transliteration: 'ʾēl šadday', traditionalRu: 'Бог Всемогущий (традиционный перевод)', verseReference: 'Быт. 17:1; 35:11',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0117.htm',
    speaker: 'ЯХВЕ говорит Авраму (17:1); Бог — Иакову (35:11)', referent: 'ЯХВЕ', namedObject: '—',
    literalGloss: 'этимология שַׁדַּי дискуссионна',
    interpretiveNotes: '«Всемогущий» — традиционный перевод (через LXX παντοκράτωρ в др. книгах / лат. Omnipotens), а не единственная доказанная первоначальная этимология. Предлагаемые связи: «гора», «грудь», «опустошать» — все гипотетичны.',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'disputed', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'el-roi-gen-16-13', zone: 2, displayLabelRu: 'Эль Рои — Бог видящий', category: 'divine_epithet',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל רֳאִי', transliteration: 'ʾēl rŏʾî', traditionalRu: 'Эль Рои', verseReference: 'Быт. 16:13',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0116.htm',
    speaker: 'Агарь', referent: 'ЯХВЕ, говоривший с ней', namedObject: '—',
    literalGloss: 'корень ראה «видеть»',
    interpretiveNotes: 'Единственное в своём роде наименование, данное человеком (Агарью). Не тождественно יְהוָה רֹעִי Пс. 22(23):1 — корень רעה «пасти». ראה ≠ רעה.',
    textualVariantNotes: 'Огласовка и синтаксис 16:13б трудны; варианты понимания обсуждаются.',
    researchStatus: 'disputed', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'beer-lahai-roi-gen-16-14', zone: 2, displayLabelRu: 'Беэр-лахай-рои — колодец', category: 'place_name',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'בְּאֵר לַחַי רֹאִי', transliteration: 'bəʾēr laḥay rōʾî', traditionalRu: 'Беэр-лахай-рои', verseReference: 'Быт. 16:14',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0116.htm',
    speaker: 'Повествователь', referent: 'Колодец (не Бог)', namedObject: 'колодец',
    literalGloss: '«колодец Живого, видящего меня» (понимание дискуссионно)',
    interpretiveNotes: 'Именован колодец, а не Бог. Показан ради различения с 16:13.',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  // ── Зона 3
  {
    id: 'yhwh-yireh-gen-22-14', zone: 3, displayLabelRu: '«ЯХВЕ усмотрит» — название места', category: 'place_name',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה יִרְאֶה', transliteration: 'YHWH yirʾeh', traditionalRu: 'Иегова-ире', verseReference: 'Быт. 22:14',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0122.htm',
    speaker: 'Авраам', referent: 'Место на горе', namedObject: 'место',
    literalGloss: '«ЯХВЕ увидит / усмотрит»',
    interpretiveNotes: 'Авраам нарекает имя МЕСТУ. Это не самостоятельное личное имя Бога.',
    textualVariantNotes: 'Огласовка 22:14б (יֵרָאֶה) — пассив, обсуждается.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'yhwh-nissi-ex-17-15', zone: 3, displayLabelRu: '«ЯХВЕ — знамя моё» — имя жертвенника', category: 'altar_name',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה נִסִּי', transliteration: 'YHWH nissî', traditionalRu: 'Иегова-нисси', verseReference: 'Исх. 17:15',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0217.htm',
    speaker: 'Моисей', referent: 'Жертвенник', namedObject: 'жертвенник',
    literalGloss: '«ЯХВЕ — моё знамя»',
    interpretiveNotes: 'Моисей устроил жертвенник и нарёк ему имя. Именован жертвенник.',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'yhwh-shalom-judg-6-24', zone: 3, displayLabelRu: '«ЯХВЕ — мир» — имя жертвенника', category: 'altar_name',
    era: 'Исторические книги', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה שָׁלוֹם', transliteration: 'YHWH šālôm', traditionalRu: 'Иегова-шалом', verseReference: 'Суд. 6:24',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0706.htm',
    speaker: 'Гедеон', referent: 'Жертвенник в Офре', namedObject: 'жертвенник',
    literalGloss: '«ЯХВЕ — мир»',
    interpretiveNotes: 'Гедеон построил жертвенник и назвал его так. Именован жертвенник.',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  // ── Зона 4
  {
    id: 'yhwh-tsevaot-1sam-1-3', zone: 4, displayLabelRu: 'ЯХВЕ Цваот — Саваоф', category: 'divine_title',
    era: 'Исторические книги; Исаия', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה צְבָאוֹת', transliteration: 'YHWH ṣəbāʾôt', traditionalRu: 'Господь Саваоф', verseReference: '1 Цар. 1:3; Ис. 6:3',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0801.htm',
    speaker: 'Повествователь (1 Цар. 1:3); серафимы в видении (Ис. 6:3)', referent: 'ЯХВЕ', namedObject: '—',
    literalGloss: '«ЯХВЕ воинств»',
    interpretiveNotes: 'צְבָאוֹת — «воинства», от צָבָא. «Саваоф» НЕ связан с «субботой» (שַׁבָּת).',
    textualVariantNotes: 'Грамматика конструкции (имя собственное в сопряжении) обсуждается.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'el-qanna-ex-34-14', zone: 4, displayLabelRu: 'Эль Канна — Бог-ревнитель', category: 'divine_epithet',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל קַנָּא', transliteration: 'ʾēl qannāʾ', traditionalRu: 'Бог ревнитель', verseReference: 'Исх. 34:14',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0234.htm',
    speaker: 'ЯХВЕ в речи завета', referent: 'ЯХВЕ', namedObject: '—',
    literalGloss: '«Бог ревнующий»',
    interpretiveNotes: 'Стих говорит: «ЯХВЕ — Ревнитель имя Его». Контекст — запрет поклонения иному богу.',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'qedosh-israel-is-1-4', zone: 4, displayLabelRu: 'Святой Израилев', category: 'divine_title',
    era: 'Исаия (VIII в. до н.э. и редакционная история)', sourceLanguage: 'he',
    originalUnicode: 'קְדוֹשׁ יִשְׂרָאֵל', transliteration: 'qədôš yiśrāʾēl', traditionalRu: 'Святой Израилев', verseReference: 'Ис. 1:4',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt1001.htm',
    speaker: 'Пророк', referent: 'ЯХВЕ', namedObject: '—',
    literalGloss: '«Святой Израиля»',
    interpretiveNotes: 'Характерный титул книги Исаии; в 1:4 — в обличении: «оставили ЯХВЕ, презрели Святого Израилева».',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'tsur-deut-32-4', zone: 4, displayLabelRu: 'Скала', category: 'metaphor_predication',
    era: 'Пятикнижие (Песнь Моисея)', sourceLanguage: 'he',
    originalUnicode: 'הַצּוּר', transliteration: 'haṣṣûr', traditionalRu: 'Скала', verseReference: 'Втор. 32:4',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0532.htm',
    speaker: 'Песнь Моисея', referent: 'Бог Израиля (в 32:4)', namedObject: '—',
    literalGloss: '«скала»',
    interpretiveNotes: 'Метафорическая предикация. Не каждое «скала» — о Боге Израиля: в 32:31 «скала их» — отрицательный референт (боги врагов).',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  // ── Зона 5 — позднейшие свидетельства
  {
    id: 'yhwh-roi-ps-23-1', zone: 5, displayLabelRu: 'ЯХВЕ — пастырь мой', category: 'metaphor_predication',
    era: 'Псалтирь — позднейший литературный горизонт', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה רֹעִי', transliteration: 'YHWH rōʿî', traditionalRu: 'Господь — Пастырь мой', verseReference: 'Пс. 22(23):1',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt2623.htm',
    speaker: 'Псалмопевец', referent: 'ЯХВЕ', namedObject: '—',
    literalGloss: 'корень רעה «пасти»',
    interpretiveNotes: 'Это предложение-исповедание, а не «имя ЯХВЕ-Рои». Не смешивать с אֵל רֳאִי (корень ראה). Нумерация: Синодальный 22, евр. 23.',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'adonai-gen-15-2', zone: 5, displayLabelRu: 'Адонай', category: 'divine_title',
    era: 'Пятикнижие и далее; традиция чтения — позднейшая', sourceLanguage: 'he',
    originalUnicode: 'אֲדֹנָי', transliteration: 'ʾădōnāy', traditionalRu: 'Господь / Владыка', verseReference: 'Быт. 15:2',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0115.htm',
    speaker: 'Аврам', referent: 'ЯХВЕ', namedObject: '—',
    literalGloss: '«мой Господин» (особая форма)',
    interpretiveNotes: 'Адонай как традиционное чтение вместо тетраграмматона — не доказательство древнего произношения יהוה.',
    textualVariantNotes: 'Огласовка тетраграмматона в масоретском тексте — qere perpetuum.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'yhwh-tsidqenu-jer-23-6', zone: 5, displayLabelRu: '«ЯХВЕ — оправдание наше»', category: 'prophetic_christological_designation',
    era: 'Иеремия (VI в. до н.э. и редакционная история)', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה צִדְקֵנוּ', transliteration: 'YHWH ṣidqēnû', traditionalRu: 'Господь — оправдание наше', verseReference: 'Иер. 23:6; 33:16',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt1123.htm',
    speaker: 'Пророческое слово', referent: '23:6 — царская (мессианская) фигура, Отрасль Давида; 33:16 — Иерусалим', namedObject: 'царь (23:6); город (33:16)',
    literalGloss: '«ЯХВЕ — наша праведность»',
    interpretiveNotes: 'Один и тот же оборот именует разные референты. Это не самостоятельное личное имя Бога.',
    textualVariantNotes: '33:14–26 отсутствует в LXX — существенное текстологическое расхождение.',
    researchStatus: 'review_in_progress', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'yhwh-shammah-ezek-48-35', zone: 5, displayLabelRu: '«ЯХВЕ там» — имя города', category: 'city_name',
    era: 'Иезекииль (VI в. до н.э.)', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה שָׁמָּה', transliteration: 'YHWH šāmmāh', traditionalRu: 'Иегова-шамма', verseReference: 'Иез. 48:35',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt1248.htm',
    speaker: 'Видение пророка', referent: 'Город', namedObject: 'город',
    literalGloss: '«ЯХВЕ — там»',
    interpretiveNotes: 'Именуется город видения. Не личное имя Бога.',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'immanuel-is-7-14', zone: 5, displayLabelRu: 'Эммануил', category: 'prophetic_christological_designation',
    era: 'Исаия; Евангелие от Матфея (I в. н.э.)', sourceLanguage: 'he',
    originalUnicode: 'עִמָּנוּ אֵל', transliteration: 'ʿimmānû ʾēl', traditionalRu: 'Эммануил', verseReference: 'Ис. 7:14; Мф. 1:23',
    edition: MM + '; Мф. 1:23 — ' + NA, verseUrl: 'https://mechon-mamre.org/p/pt/pt1007.htm',
    speaker: 'Исаия — Ахазу; Матфей цитирует (по греч. Ἐμμανουήλ)', referent: 'Ребёнок-знамение (Ис.); Иисус (Мф.)', namedObject: 'ребёнок',
    literalGloss: '«с нами Бог»',
    interpretiveNotes: 'Говорящий, контекст и интертекст различаются: в Ис. 7 — знамение дому Давида; Мф. 1:23 читает его христологически.',
    textualVariantNotes: 'В масоретском тексте — два слова; в ряде рукописей слитно.',
    researchStatus: 'review_in_progress', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'attiq-yomin-dan-7-9', zone: 5, displayLabelRu: 'Ветхий днями', category: 'divine_title',
    era: 'Даниил — арамейская часть (датировка дискуссионна)', sourceLanguage: 'arc',
    originalUnicode: 'עַתִּיק יוֹמִין', transliteration: 'ʿattîq yômîn', traditionalRu: 'Ветхий днями', verseReference: 'Дан. 7:9',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt3207.htm',
    speaker: 'Видение Даниила', referent: 'Божественный Судия видения', namedObject: '—',
    literalGloss: '«Древний днями» (АРАМЕЙСКИЙ, не древнееврейский)',
    interpretiveNotes: 'Дан. 2:4б–7:28 написаны на арамейском. Прототип не изображает фигуру видения.',
    textualVariantNotes: 'Расхождения LXX и Феодотиона в Дан. 7 обсуждаются.',
    researchStatus: 'review_in_progress', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'alpha-omega-rev-1-8', zone: 5, displayLabelRu: 'Альфа и Омега', category: 'divine_self_declaration',
    era: 'Откровение (конец I в. н.э.)', sourceLanguage: 'grc',
    originalUnicode: 'τὸ ἄλφα καὶ τὸ ὦ', transliteration: 'to alpha kai to ō', traditionalRu: 'Альфа и Омега', verseReference: 'Откр. 1:8',
    edition: NA, verseUrl: 'https://www.die-bibel.de/bibel/NA28/REV.1',
    speaker: '«Господь Бог» (1:8); ср. 22:13', referent: 'Господь Бог', namedObject: '—',
    literalGloss: '«альфа и омега» — первая и последняя буквы',
    interpretiveNotes: 'Самоназвание в 1:8; в 22:13 формула связана с говорящим Христом — различать контексты.',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'review_in_progress', rightsStatus: NAR, publicationState: 'HOLD',
  },
  {
    id: 'abba-mk-14-36', zone: 5, displayLabelRu: 'Авва, Отче', category: 'intertextual_theological_interpretation',
    era: 'Евангелие от Марка (I в. н.э.)', sourceLanguage: 'grc',
    originalUnicode: 'αββα ὁ πατήρ', transliteration: 'abba ho patēr', traditionalRu: 'Авва Отче', verseReference: 'Мк. 14:36',
    edition: NA, verseUrl: 'https://www.die-bibel.de/bibel/NA28/MRK.14',
    speaker: 'Иисус в Гефсимании', referent: 'Отец', namedObject: '—',
    literalGloss: 'арам. «отец» + греч. «отец»',
    interpretiveNotes: 'Обращение, а не имя. Не сводить к «папочка» — тезис давно оспорен.',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'review_in_progress', rightsStatus: NAR, publicationState: 'HOLD',
  },
  {
    id: 'ego-eimi-jn-8-58', zone: 5, displayLabelRu: '«Я есмь» (Ин. 8:58)', category: 'intertextual_theological_interpretation',
    era: 'Евангелие от Иоанна (конец I в. н.э.)', sourceLanguage: 'grc',
    originalUnicode: 'ἐγὼ εἰμί', transliteration: 'egō eimi', traditionalRu: 'Я есмь', verseReference: 'Ин. 8:58',
    edition: NA, verseUrl: 'https://www.die-bibel.de/bibel/NA28/JHN.8',
    speaker: 'Иисус', referent: 'Говорящий', namedObject: '—',
    literalGloss: '«я есть»',
    interpretiveNotes: 'Не дословно тождественно LXX Исх. 3:14 Ἐγώ εἰμι ὁ ὤν. Связь — интертекстуальное толкование. Та же фраза в Ин. 9:9 — обычная речь исцелённого человека.',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'review_in_progress', rightsStatus: NAR, publicationState: 'HOLD',
  },
  // ── Зона 7 — Исход 3
  {
    id: 'ehyeh-ex-3-14', zone: 7, displayLabelRu: '«Я буду, Кто буду»', category: 'divine_self_declaration',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֶהְיֶה אֲשֶׁר אֶהְיֶה', transliteration: 'ʾehyeh ʾăšer ʾehyeh', traditionalRu: 'Я есмь Сущий (Синод.)', verseReference: 'Исх. 3:14',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0203.htm',
    speaker: 'Бог отвечает Моисею из куста', referent: 'Бог, говорящий', namedObject: '—',
    literalGloss: 'глагол היה, 1 л. ед. ч. имперфект: «буду / есмь»',
    interpretiveNotes: 'Ответ следует за обещанием присутствия в 3:12 — אֶהְיֶה עִמָּךְ «Я буду с тобою». Самоназвание, а не «этимологический источник всех имён».',
    textualVariantNotes: 'Перевод времени глагола дискуссионен (буду / есмь).',
    researchStatus: 'disputed', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'yhwh-ex-3-15', zone: 7, displayLabelRu: 'Тетраграмматон', category: 'personal_divine_name',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה', transliteration: 'YHWH', traditionalRu: 'Господь (традиционное чтение «Адонай»)', verseReference: 'Исх. 3:15',
    edition: MM, verseUrl: 'https://mechon-mamre.org/p/pt/pt0203.htm',
    speaker: 'Бог — Моисею', referent: 'Бог отцов: Авраама, Исаака, Иакова', namedObject: '—',
    literalGloss: 'личное имя; древнее произношение не засвидетельствовано огласовкой',
    interpretiveNotes: 'Форма יהוה отличается от אהיה 3:14. «Это имя Моё навеки и памятование Моё из рода в род» (3:15, пересказ).',
    textualVariantNotes: 'Огласовка — qere perpetuum (огласовка «Адонай»).',
    researchStatus: 'working_draft', rightsStatus: MMR, publicationState: 'HOLD',
  },
  {
    id: 'lxx-ego-eimi-ho-on-ex-3-14', zone: 7, displayLabelRu: 'LXX: «Я есмь Сущий»', category: 'divine_self_declaration',
    era: 'Греческий перевод Пятикнижия (III в. до н.э.)', sourceLanguage: 'grc',
    originalUnicode: 'Ἐγώ εἰμι ὁ ὤν', transliteration: 'egō eimi ho ōn', traditionalRu: 'Аз есмь Сый', verseReference: 'Исх. 3:14 LXX',
    edition: 'Septuaginta (Rahlfs-Hanhart), Deutsche Bibelgesellschaft', verseUrl: 'https://www.die-bibel.de/bibel/LXX/EXO.3',
    speaker: 'Бог — Моисею (в переводе)', referent: 'Бог, говорящий', namedObject: '—',
    literalGloss: '«Я есмь Сущий»',
    interpretiveNotes: 'Перевод-толкование еврейского. НЕ дословно тождественно ἐγὼ εἰμί Ин. 8:58.',
    textualVariantNotes: 'Колляция не выполнена.',
    researchStatus: 'working_draft', rightsStatus: 'Короткая лексема; лицензия редакции LXX не распространяется на русские переводы', publicationState: 'HOLD',
  },
];

// Исх. 3:5, Синодальный перевод (1876) — общественное достояние.
export const EX_3_5_RU = 'Не подходи сюда; сними обувь твою с ног твоих, ибо место, на котором ты стоишь, есть земля святая.';
export const EX_3_5_SOURCE = 'Исх. 3:5, Синодальный перевод (1876, общественное достояние)';
