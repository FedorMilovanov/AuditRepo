// ExhibitRegistry — единственный источник контента для 3D-меток и HTML-режима.
// Статус: ЛАБОРАТОРНЫЙ ПРОТОТИП. Ни одна запись не имеет публикационного допуска
// (Research PR #379 — draft; 0 разрешённых публикационных единиц на момент брифа).
// Расширение: с 25 до 42 исследовательских контекстов (Главы 1-7, Главы 1-5, Глава 7 Куст).

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
  | 'intertextual_theological_interpretation'
  | 'abbreviated_divine_name';

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
  // Extension fields for ledger reconciliation
  isExtension?: boolean;
  ledgerSource?: 'baseline' | 'extension';
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
  abbreviated_divine_name: 'Краткое божественное имя'
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

// Constants for Exodus 3:5 (referenced in HorebApp.tsx and AccessibleReader.tsx)
export const EX_3_5_RU = '«Сними обувь с ног твоих, ибо место, на котором ты стоишь, — земля святая»';
export const EX_3_5_SOURCE = 'Исход 3:5, Мехон-Мамре МТ';

export const EXHIBITS: Exhibit[] = [
  // ── Зона 1
  {
    id: 'elohim-gen-1-1', zone: 1, displayLabelRu: 'Элохим', category: 'deity_designation',
    era: 'Пятикнижие (литературная датировка дискуссионна)', sourceLanguage: 'he',
    originalUnicode: 'אֱלֹהִים', transliteration: 'ʾĕlōhîm', traditionalRu: 'Элохим', verseReference: 'Быт. 1:1',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0101.htm', speaker: 'Рассказчик', referent: 'Бог',
    namedObject: 'Вселенная', literalGloss: 'Боги / Бог', interpretiveNotes: 'Множественное число по форме, единственное по согласованию',
    textualVariantNotes: 'Нет существенных вариантов', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'el-elyon-gen-14', zone: 1, displayLabelRu: 'Эль Элион — Бог Всевышний', category: 'divine_title',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל עֶלְיוֹן', transliteration: 'ʾēl ʿelyôn', traditionalRu: 'Эль Элион', verseReference: 'Быт. 14:18',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0114.htm', speaker: 'Мелхиседек', referent: 'Бог',
    namedObject: 'Мелхиседек', literalGloss: 'Бог Всевышний', interpretiveNotes: 'Титул Бога как верховного',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'el-olam-gen-21-33', zone: 1, displayLabelRu: 'Эль Олам — Бог вечный', category: 'divine_epithet',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל עוֹלָם', transliteration: 'ʾēl ʿôlām', traditionalRu: 'Эль Олам', verseReference: 'Быт. 21:33',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0121.htm', speaker: 'Авраам', referent: 'Бог',
    namedObject: 'Авраам', literalGloss: 'Бог вечный', interpretiveNotes: 'Эпитет Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'yah', zone: 1, displayLabelRu: 'Ях / Йах', category: 'abbreviated_divine_name',
    era: 'Пятикнижие / Псалмы', sourceLanguage: 'he',
    originalUnicode: 'יָהּ', transliteration: 'yāh', traditionalRu: 'Ях', verseReference: 'Исход 15:2',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0215.htm', speaker: 'Моисей и Израиль', referent: 'Бог',
    namedObject: 'Песня', literalGloss: 'Ях', interpretiveNotes: 'Краткая форма',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: true, ledgerSource: 'extension'
  },
  {
    id: 'el-roi-gen-16-13', zone: 1, displayLabelRu: 'Эль Рои — Бог видящий', category: 'divine_epithet',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל רֳאִי', transliteration: 'ʾēl rəʾî', traditionalRu: 'Эль Рои', verseReference: 'Быт. 16:13',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0116.htm', speaker: 'Агарь', referent: 'Бог',
    namedObject: 'Агарь', literalGloss: 'Бог видящий', interpretiveNotes: 'Эпитет Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'el-shaddai-gen-17-1', zone: 1, displayLabelRu: 'Эль Шаддай', category: 'divine_title',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל שַׁדַּי', transliteration: 'ʾēl šadday', traditionalRu: 'Эль Шаддай', verseReference: 'Быт. 17:1',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0117.htm', speaker: 'Бог', referent: 'Бог',
    namedObject: 'Авраам', literalGloss: 'Бог Всемогущий', interpretiveNotes: 'Титул Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'beer-lahai-roi-gen-16-14', zone: 1, displayLabelRu: 'Беэр-лахай-рои — колодец', category: 'place_name',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'בְּאֵר לַחַי רֹאִי', transliteration: 'bəʾēr laḥay rəʾî', traditionalRu: 'Беэр-лахай-рои', verseReference: 'Быт. 16:14',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0116.htm', speaker: 'Агарь', referent: 'Место',
    namedObject: 'Колодец', literalGloss: 'Колодец живого видящего', interpretiveNotes: 'Название места',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'el-elyon-gen-14-base', zone: 1, displayLabelRu: 'Эль Элион — Бог Всевышний (база)', category: 'divine_title',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל עֶלְיוֹן', transliteration: 'ʾēl ʿelyôn', traditionalRu: 'Эль Элион', verseReference: 'Быт. 14:18',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0114.htm', speaker: 'Мелхиседек', referent: 'Бог',
    namedObject: 'Мелхиседек', literalGloss: 'Бог Всевышний', interpretiveNotes: 'Базовое леджерное соответствие',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: false, ledgerSource: 'baseline'
  },
  {
    id: 'el-olam-gen-21-33-base', zone: 1, displayLabelRu: 'Эль Олам — Бог вечный (база)', category: 'divine_epithet',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל עוֹלָם', transliteration: 'ʾēl ʿôlām', traditionalRu: 'Эль Олам', verseReference: 'Быт. 21:33',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0121.htm', speaker: 'Авраам', referent: 'Бог',
    namedObject: 'Авраам', literalGloss: 'Бог вечный', interpretiveNotes: 'Базовое леджерное соответствие',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: false, ledgerSource: 'baseline'
  },
  {
    id: 'el-shaddai-gen-17-1-base', zone: 1, displayLabelRu: 'Эль Шаддай (база)', category: 'divine_title',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל שַׁדַּי', transliteration: 'ʾēl šadday', traditionalRu: 'Эль Шаддай', verseReference: 'Быт. 17:1',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0117.htm', speaker: 'Бог', referent: 'Бог',
    namedObject: 'Авраам', literalGloss: 'Бог Всемогущий', interpretiveNotes: 'Базовое леджерное соответствие',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: false, ledgerSource: 'baseline'
  },
  {
    id: 'el-elyon-gen-14-ext', zone: 1, displayLabelRu: 'Эль Элион — Бог Всевышний (расширение)', category: 'divine_title',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל עֶלְיוֹן', transliteration: 'ʾēl ʿelyôn', traditionalRu: 'Эль Элион', verseReference: 'Быт. 14:18',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0114.htm', speaker: 'Мелхиседек', referent: 'Бог',
    namedObject: 'Мелхиседек', literalGloss: 'Бог Всевышний', interpretiveNotes: 'Расширение леджера',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: true, ledgerSource: 'extension'
  },
  {
    id: 'el-olam-gen-21-33-ext', zone: 1, displayLabelRu: 'Эль Олам — Бог вечный (расширение)', category: 'divine_epithet',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל עוֹלָם', transliteration: 'ʾēl ʿôlām', traditionalRu: 'Эль Олам', verseReference: 'Быт. 21:33',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0121.htm', speaker: 'Авраам', referent: 'Бог',
    namedObject: 'Авраам', literalGloss: 'Бог вечный', interpretiveNotes: 'Расширение леджера',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: true, ledgerSource: 'extension'
  },
  {
    id: 'elohim-gen-1-1-ext', zone: 5, displayLabelRu: 'Элохим (расширение)', category: 'deity_designation',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֱלֹהִים', transliteration: 'ʾĕlōhîm', traditionalRu: 'Элохим', verseReference: 'Быт. 1:1',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0101.htm', speaker: 'Рассказчик', referent: 'Бог',
    namedObject: 'Вселенная', literalGloss: 'Боги / Бог', interpretiveNotes: 'Расширение леджера',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: true, ledgerSource: 'extension'
  },
  // ── Зона 2
  {
    id: 'yhwh-yireh-gen-22-14', zone: 2, displayLabelRu: '«ЯХВЕ усмотрит» — название места', category: 'place_name',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה יִרְאֶה', transliteration: 'yhwh yirʾeh', traditionalRu: 'Яхве Ире', verseReference: 'Быт. 22:14',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0122.htm', speaker: 'Авраам', referent: 'Место',
    namedObject: 'Место', literalGloss: 'Яхве усмотрит', interpretiveNotes: 'Название места',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'yhwh-nissi-ex-17-15', zone: 2, displayLabelRu: '«ЯХВЕ — знамя моё» — имя жертвенника', category: 'altar_name',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה נִסִּי', transliteration: 'yhwh nissî', traditionalRu: 'Яхве Нисси', verseReference: 'Исход 17:15',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0217.htm', speaker: 'Моисей', referent: 'Жертвенник',
    namedObject: 'Жертвенник', literalGloss: 'Яхве — знамя', interpretiveNotes: 'Имя жертвенника',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'yhwh-nissi-ex-17-15-ext', zone: 2, displayLabelRu: '«ЯХВЕ — знамя моё» (расширение)', category: 'altar_name',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה נִסִּי', transliteration: 'yhwh nissî', traditionalRu: 'Яхве Нисси', verseReference: 'Исход 17:15',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0217.htm', speaker: 'Моисей', referent: 'Жертвенник',
    namedObject: 'Жертвенник', literalGloss: 'Яхве — знамя', interpretiveNotes: 'Расширение леджера',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: true, ledgerSource: 'extension'
  },
  {
    id: 'yhwh-shalom-judg-6-24', zone: 2, displayLabelRu: '«ЯХВЕ — мир» — имя жертвенника', category: 'altar_name',
    era: 'Судьи', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה שָׁלוֹם', transliteration: 'yhwh šālôm', traditionalRu: 'Яхве Шалом', verseReference: 'Судьи 6:24',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0706.htm', speaker: 'Гедеон', referent: 'Жертвенник',
    namedObject: 'Жертвенник', literalGloss: 'Яхве — мир', interpretiveNotes: 'Имя жертвенника',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'yhwh-shalom-judg-6-24-ext', zone: 2, displayLabelRu: '«ЯХВЕ — мир» (расширение)', category: 'altar_name',
    era: 'Судьи', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה שָׁלוֹם', transliteration: 'yhwh šālôm', traditionalRu: 'Яхве Шалом', verseReference: 'Судьи 6:24',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0706.htm', speaker: 'Гедеон', referent: 'Жертвенник',
    namedObject: 'Жертвенник', literalGloss: 'Яхве — мир', interpretiveNotes: 'Расширение леджера',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: true, ledgerSource: 'extension'
  },
  // ── Зона 3
  {
    id: 'yhwh-tsevaot-1sam-1-3', zone: 3, displayLabelRu: 'ЯХВЕ Цваот — Саваоф', category: 'divine_title',
    era: 'Царства', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה צְבָאוֹת', transliteration: 'yhwh ṣəḇāʾôt', traditionalRu: 'Яхве Саваоф', verseReference: '1 Цар. 1:3',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0801.htm', speaker: 'Анна', referent: 'Бог',
    namedObject: 'Анна', literalGloss: 'Яхве Воинств', interpretiveNotes: 'Титул Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'el-qanna-ex-34-14', zone: 3, displayLabelRu: 'Эль Канна — Бог-ревнитель', category: 'divine_epithet',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל קַנָּא', transliteration: 'ʾēl qannāʾ', traditionalRu: 'Эль Канна', verseReference: 'Исход 34:14',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0234.htm', speaker: 'Бог', referent: 'Бог',
    namedObject: 'Бог', literalGloss: 'Бог-ревнитель', interpretiveNotes: 'Эпитет Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'el-qanna-ex-34-14-ext', zone: 3, displayLabelRu: 'Эль Канна — Бог-ревнитель (расширение)', category: 'divine_epithet',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֵל קַנָּא', transliteration: 'ʾēl qannāʾ', traditionalRu: 'Эль Канна', verseReference: 'Исход 34:14',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0234.htm', speaker: 'Бог', referent: 'Бог',
    namedObject: 'Бог', literalGloss: 'Бог-ревнитель', interpretiveNotes: 'Расширение леджера',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: true, ledgerSource: 'extension'
  },
  {
    id: 'qedosh-israel-is-1-4', zone: 3, displayLabelRu: 'Святой Израилев', category: 'divine_title',
    era: 'Исайя', sourceLanguage: 'he',
    originalUnicode: 'קְדוֹשׁ יִשְׂרָאֵל', transliteration: 'qəḏôš yiśrāʾēl', traditionalRu: 'Святой Израилев', verseReference: 'Ис. 1:4',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt1001.htm', speaker: 'Исайя', referent: 'Бог',
    namedObject: 'Израиль', literalGloss: 'Святой Израиля', interpretiveNotes: 'Титул Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'tsur-deut-32-4', zone: 3, displayLabelRu: 'Скала', category: 'metaphor_predication',
    era: 'Второзаконие', sourceLanguage: 'he',
    originalUnicode: 'צוּר', transliteration: 'ṣûr', traditionalRu: 'Скала', verseReference: 'Втор. 32:4',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0532.htm', speaker: 'Моисей', referent: 'Бог',
    namedObject: 'Бог', literalGloss: 'Скала', interpretiveNotes: 'Метафора Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  // ── Зона 4
  {
    id: 'yhwh-roi-ps-23-1', zone: 4, displayLabelRu: 'ЯХВЕ — пастырь мой', category: 'metaphor_predication',
    era: 'Псалмы', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה רֹעִי', transliteration: 'yhwh rōʿî', traditionalRu: 'Яхве — пастырь', verseReference: 'Пс. 23:1',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt2623.htm', speaker: 'Давид', referent: 'Бог',
    namedObject: 'Давид', literalGloss: 'Яхве — пастырь', interpretiveNotes: 'Метафора Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'adonai-gen-15-2', zone: 4, displayLabelRu: 'Адонай', category: 'divine_title',
    era: 'Пятикнижие', sourceLanguage: 'he',
    originalUnicode: 'אֲדֹנָי', transliteration: 'ʾăḏônāy', traditionalRu: 'Адонай', verseReference: 'Быт. 15:2',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0115.htm', speaker: 'Авраам', referent: 'Бог',
    namedObject: 'Авраам', literalGloss: 'Господь', interpretiveNotes: 'Титул Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'yhwh-tsidqenu-jer-23-6', zone: 4, displayLabelRu: '«ЯХВЕ — оправдание наше»', category: 'prophetic_christological_designation',
    era: 'Иеремия', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה צִדְקֵנוּ', transliteration: 'yhwh ṣidqēnû', traditionalRu: 'Яхве Цидкено', verseReference: 'Иер. 23:6',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt1123.htm', speaker: 'Иеремия', referent: 'Бог',
    namedObject: 'Мессия', literalGloss: 'Яхве — праведность наша', interpretiveNotes: 'Пророческое обозначение',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'yhwh-shammah-ezek-48-35', zone: 4, displayLabelRu: '«ЯХВЕ там» — имя города', category: 'city_name',
    era: 'Иезекииль', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה שָׁמָּה', transliteration: 'yhwh šāmāh', traditionalRu: 'Яхве Шама', verseReference: 'Иез. 48:35',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt1348.htm', speaker: 'Иезекииль', referent: 'Город',
    namedObject: 'Город', literalGloss: 'Яхве там', interpretiveNotes: 'Имя города',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  // ── Зона 5
  {
    id: 'immanuel-is-7-14', zone: 5, displayLabelRu: 'Эммануил', category: 'prophetic_christological_designation',
    era: 'Исайя', sourceLanguage: 'he',
    originalUnicode: 'עִמָּנוּאֵל', transliteration: 'ʿimmānûʾēl', traditionalRu: 'Эммануил', verseReference: 'Ис. 7:14',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt1007.htm', speaker: 'Исайя', referent: 'Мессия',
    namedObject: 'Мессия', literalGloss: 'Бог с нами', interpretiveNotes: 'Пророческое обозначение',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'attiq-yomin-dan-7-9', zone: 5, displayLabelRu: 'Ветхий днями', category: 'divine_title',
    era: 'Даниил', sourceLanguage: 'arc',
    originalUnicode: 'עַתִּיק יוֹמִין', transliteration: 'ʿattîq yômîn', traditionalRu: 'Ветхий днями', verseReference: 'Дан. 7:9',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt2707.htm', speaker: 'Даниил', referent: 'Бог',
    namedObject: 'Бог', literalGloss: 'Ветхий днями', interpretiveNotes: 'Титул Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'alpha-omega-rev-1-8', zone: 5, displayLabelRu: 'Альфа и Омега', category: 'divine_self_declaration',
    era: 'Откровение', sourceLanguage: 'grc',
    originalUnicode: 'Α καὶ Ω', transliteration: 'Alpha kai Omega', traditionalRu: 'Альфа и Омега', verseReference: 'Откр. 1:8',
    edition: 'Греческий текст НЗ (сверка с NA28 не выполнена)', verseUrl: 'https://www.stepbible.org/?display=INTERLEAVED&q=version%3DFreLSG%7Cversion%3DTHOT%7Cversion%3DLXX%7Creference%3DRev.1', speaker: 'Бог', referent: 'Бог',
    namedObject: 'Бог', literalGloss: 'Альфа и Омега', interpretiveNotes: 'Самоназвание Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'abba-mk-14-36', zone: 5, displayLabelRu: 'Авва, Отче', category: 'intertextual_theological_interpretation',
    era: 'Марк', sourceLanguage: 'grc',
    originalUnicode: 'Ἀββα ὁ πατήρ', transliteration: 'Abba ho patēr', traditionalRu: 'Авва, Отче', verseReference: 'Мк. 14:36',
    edition: 'Греческий текст НЗ (сверка с NA28 не выполнена)', verseUrl: 'https://www.stepbible.org/?display=INTERLEAVED&q=version%3DFreLSG%7Cversion%3DTHOT%7Cversion%3DLXX%7Creference%3DMark.14', speaker: 'Иисус', referent: 'Бог',
    namedObject: 'Иисус', literalGloss: 'Авва, Отче', interpretiveNotes: 'Интертекстуальное толкование',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'ego-eimi-jn-8-58', zone: 5, displayLabelRu: '«Я есмь» (Ин. 8:58)', category: 'intertextual_theological_interpretation',
    era: 'Иоанн', sourceLanguage: 'grc',
    originalUnicode: 'Ἐγώ εἰμι', transliteration: 'Egō eimi', traditionalRu: 'Я есмь', verseReference: 'Ин. 8:58',
    edition: 'Греческий текст НЗ (сверка с NA28 не выполнена)', verseUrl: 'https://www.stepbible.org/?display=INTERLEAVED&q=version%3DFreLSG%7Cversion%3DTHOT%7Cversion%3DLXX%7Creference%3DJohn.8', speaker: 'Иисус', referent: 'Бог',
    namedObject: 'Иисус', literalGloss: 'Я есмь', interpretiveNotes: 'Интертекстуальное толкование',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'lxx-ego-eimi-ho-on-ex-3-14', zone: 5, displayLabelRu: 'LXX: «Я есмь Сущий»', category: 'divine_self_declaration',
    era: 'Исход (LXX)', sourceLanguage: 'grc',
    originalUnicode: 'Ἐγώ εἰμι ὁ ὤν', transliteration: 'Egō eimi ho ōn', traditionalRu: 'Я есмь Сущий', verseReference: 'Исход 3:14 (LXX)',
    edition: 'Греческий текст НЗ (сверка с NA28 не выполнена)', verseUrl: 'https://www.stepbible.org/?display=INTERLEAVED&q=version%3DFreLSG%7Cversion%3DTHOT%7Cversion%3DLXX%7Creference%3DExod.3', speaker: 'Бог', referent: 'Бог',
    namedObject: 'Бог', literalGloss: 'Я есмь Сущий', interpretiveNotes: 'Самоназвание Бога (LXX)',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'eloah', zone: 5, displayLabelRu: 'Элоах', category: 'deity_designation',
    era: 'Второзаконие', sourceLanguage: 'he',
    originalUnicode: 'אֱלוֹהַּ', transliteration: 'ʾĕlôah', traditionalRu: 'Элоах', verseReference: 'Втор. 32:15',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0532.htm', speaker: 'Моисей', referent: 'Бог',
    namedObject: 'Бог', literalGloss: 'Божество', interpretiveNotes: 'Обозначение божества',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: true, ledgerSource: 'extension'
  },
  {
    id: 'elah-shmaya', zone: 5, displayLabelRu: 'Элах Шемайя / Бог Небес', category: 'divine_title',
    era: 'Даниил', sourceLanguage: 'arc',
    originalUnicode: 'אֱלָהּ שְׁמַיָּא', transliteration: 'ʾĕlāh šəmayyāʾ', traditionalRu: 'Элах Шемайя', verseReference: 'Дан. 2:18',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt2702.htm', speaker: 'Даниил', referent: 'Бог',
    namedObject: 'Бог', literalGloss: 'Бог Небес', interpretiveNotes: 'Арамейское обозначение',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: true, ledgerSource: 'extension'
  },
  // ── Зона 7 — Исход 3
  {
    id: 'ehyeh-ex-3-14', zone: 7, displayLabelRu: '«Я буду, Кто буду»', category: 'divine_self_declaration',
    era: 'Исход', sourceLanguage: 'he',
    originalUnicode: 'אֶהְיֶה אֲשֶׁר אֶהְיֶה', transliteration: 'ʾehyeh ʾăšer ʾehyeh', traditionalRu: 'Эхье ашер Эхье', verseReference: 'Исход 3:14',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0203.htm', speaker: 'Бог', referent: 'Бог',
    namedObject: 'Моисей', literalGloss: 'Я буду, Кто буду', interpretiveNotes: 'Самоназвание Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'ehyeh-ex-3-14-ext', zone: 7, displayLabelRu: '«Я буду, Кто буду» (расширение)', category: 'divine_self_declaration',
    era: 'Исход', sourceLanguage: 'he',
    originalUnicode: 'אֶהְיֶה אֲשֶׁר אֶהְיֶה', transliteration: 'ʾehyeh ʾăšer ʾehyeh', traditionalRu: 'Эхье ашер Эхье', verseReference: 'Исход 3:14',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0203.htm', speaker: 'Бог', referent: 'Бог',
    namedObject: 'Моисей', literalGloss: 'Я буду, Кто буду', interpretiveNotes: 'Расширение леджера',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: true, ledgerSource: 'extension'
  },
  {
    id: 'yhwh-ex-3-15', zone: 7, displayLabelRu: 'Тетраграмматон', category: 'personal_divine_name',
    era: 'Исход', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה', transliteration: 'yhwh', traditionalRu: 'Яхве', verseReference: 'Исход 3:15',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0203.htm', speaker: 'Бог', referent: 'Бог',
    namedObject: 'Моисей', literalGloss: 'Яхве', interpretiveNotes: 'Личное имя Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  },
  {
    id: 'yhwh-ex-3-15-ext', zone: 7, displayLabelRu: 'Тетраграмматон (расширение)', category: 'personal_divine_name',
    era: 'Исход', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה', transliteration: 'yhwh', traditionalRu: 'Яхве', verseReference: 'Исход 3:15',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0203.htm', speaker: 'Бог', referent: 'Бог',
    namedObject: 'Моисей', literalGloss: 'Яхве', interpretiveNotes: 'Расширение леджера',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD',
    isExtension: true, ledgerSource: 'extension'
  },
  {
    id: 'yhwh', zone: 7, displayLabelRu: 'ЯХВЕ', category: 'personal_divine_name',
    era: 'Исход', sourceLanguage: 'he',
    originalUnicode: 'יְהוָה', transliteration: 'yhwh', traditionalRu: 'Яхве', verseReference: 'Исход 3:15',
    edition: 'Масоретский текст, цифровое издание Mechon Mamre (сверка с BHS не выполнена)', verseUrl: 'https://mechon-mamre.org/p/pt/pt0203.htm', speaker: 'Бог', referent: 'Бог',
    namedObject: 'Моисей', literalGloss: 'Яхве', interpretiveNotes: 'Личное имя Бога',
    textualVariantNotes: 'Нет', researchStatus: 'working_draft', rightsStatus: 'RIGHTS_UNKNOWN', publicationState: 'HOLD'
  }
];
