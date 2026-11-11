import React, { useState } from 'react';
import { ArrowRight, BookOpen, Languages } from 'lucide-react';
import { DivineNameEntry } from '../data/divineNames';

interface LexiconBridgeRow {
  id: string;
  targetNameId: string;
  hebrew: string;
  hebrewTranslit: string;
  lxxGreek: string;
  lxxTranslit: string;
  synodalRendering: string;
  countNote: string;
  theologicalBridge: string;
}

const LEXICON_BRIDGES: LexiconBridgeRow[] = [
  {
    id: 'bridge-yhwh',
    targetNameId: 'yhwh',
    hebrew: 'יְהוָה',
    hebrewTranslit: 'Яхве (Тетраграмматон)',
    lxxGreek: 'Κύριος',
    lxxTranslit: 'Кюриос',
    synodalRendering: 'Господь',
    countNote: 'Статистика и варианты передачи имени зависят от текстовой традиции и издания.',
    theologicalBridge:
      'В Новом Завете титул Κύριος используется при исповедании воскресшего Иисуса (Рим. 10:9; Флп. 2:11). Это важный христианский богословский мост, но история передачи יהוה в древних греческих рукописях неоднородна и не сводится к одному обязательному написанию.',
  },
  {
    id: 'bridge-elohim',
    targetNameId: 'elohim',
    hebrew: 'אֱלֹהִים',
    hebrewTranslit: 'Элохим',
    lxxGreek: 'Θεός',
    lxxTranslit: 'Теос',
    synodalRendering: 'Бог',
    countNote: 'В Быт. 1:1 еврейское Элохим согласуется с глаголом в единственном числе; LXX здесь использует ὁ θεός.',
    theologicalBridge:
      'В прологе Иоанна 1:1 («и Слово было Бог» — Θεὸς ἦν ὁ Λόγος) евангелист связывает Божество Христа с Творцом Бытия 1:1.',
  },
  {
    id: 'bridge-adonai',
    targetNameId: 'adonai',
    hebrew: 'אֲדֹנָי',
    hebrewTranslit: 'Адонай',
    lxxGreek: 'Κύριος (Ис. 6:1)',
    lxxTranslit: 'Кюриос (пример из Ис. 6:1)',
    synodalRendering: 'Владыка / Господь (по стиху)',
    countNote: 'В Пс. 109:1 «господину моему» = לַאדֹנִי (adoni), не אֲדֹנָי (Адонай)',
    theologicalBridge:
      'Фома называет воскресшего Иисуса «Господь мой и Бог мой» (Ин. 20:28), используя греческие слова Κύριος и Θεός. Это христианское исповедание, а не буквальная цитата еврейских форм אֲדֹנָי и אֱלֹהִים.',
  },
  {
    id: 'bridge-shaddai',
    targetNameId: 'el-shaddai',
    hebrew: 'אֵל שַׁדַּי',
    hebrewTranslit: 'Эль-Шаддай',
    lxxGreek: 'ἐγώ εἰμι ὁ θεός σου',
    lxxTranslit: 'Эго эйми хо Теос су (Быт. 17:1 LXX)',
    synodalRendering: 'Бог Всемогущий',
    countNote: 'В греческом Быт. 17:1 нет Παντοκράτωρ; в Откровении это отдельный титул',
    theologicalBridge:
      'Христианское сопоставление Быт. 17:1 с образом Вседержителя в Откр. 1:8 и 19:6 — богословская связь. В греческом Быт. 17:1 сказано «Я Бог твой», а не «Я Пантократор»; прямую лексическую цепочку здесь утверждать нельзя.',
  },
  {
    id: 'bridge-elyon',
    targetNameId: 'el-elyon',
    hebrew: 'אֵל עֶלְיוֹן',
    hebrewTranslit: 'Эль-Эльон',
    lxxGreek: 'Θεὸς Ὕψιστος',
    lxxTranslit: 'Теос Хюпсистос',
    synodalRendering: 'Бог Всевышний',
    countNote: 'Быт. 14:18–20: Мелхиседек — священник Бога Всевышнего',
    theologicalBridge:
      'При Благовещении Иисус назван «Сыном Всевышнего» (Лк. 1:32) и вечным Первосвященником по чину Мелхиседека (Евр. 7:1).',
  },
  {
    id: 'bridge-sabaoth',
    targetNameId: 'yhwh-sabaoth',
    hebrew: 'יְהוָה צְבָאוֹת',
    hebrewTranslit: 'Яхве Цеваот',
    lxxGreek: 'Κύριος Σαβαώθ / τῶν δυνάμεων',
    lxxTranslit: 'Кюриос Саваоф',
    synodalRendering: 'Господь Саваоф / Господь сил',
    countNote: 'Транслитерировано без перевода в Рим. 9:29 и Иак. 5:4',
    theologicalBridge:
      'Ин. 12:41 связывает славу, о которой говорил Исаия, с Иисусом. Это каноническое толкование Ис. 6, но не утверждение, что в еврейском Ис. 6:3 буквально названо имя Иисуса.',
  },
];

interface HebrewGreekLexiconMatrixProps {
  names: DivineNameEntry[];
  onSelectName: (entry: DivineNameEntry) => void;
}

export const HebrewGreekLexiconMatrix: React.FC<HebrewGreekLexiconMatrixProps> = ({
  names,
  onSelectName,
}) => {
  const [selectedRowId, setSelectedRowId] = useState<string>(LEXICON_BRIDGES[0].id);

  const activeRow =
    LEXICON_BRIDGES.find((r) => r.id === selectedRowId) || LEXICON_BRIDGES[0];
  const linkedEntry = names.find((n) => n.id === activeRow.targetNameId) || names[0];

  return (
    <section
      aria-label="Сравнительная таблица переводов имён Бога"
      className="my-12 rounded-3xl border p-6 sm:p-8 shadow-lg"
      style={{
        backgroundColor: 'var(--gb-surface)',
        borderColor: 'var(--gb-border-strong)',
        boxShadow: 'var(--gb-shadow-lg)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4" style={{ borderColor: 'var(--gb-border)' }}>
        <div>
          <div className="font-ui flex items-center gap-2 text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--gb-gold-ink)' }}>
            <Languages className="h-4 w-4" />
            <span>Лексикографический мост Заветов</span>
          </div>
          <h3 className="font-serif-display mt-1 text-xl sm:text-2xl font-bold" style={{ color: 'var(--gb-ink)' }}>
            Еврейские выражения, греческие передачи и христианское прочтение
          </h3>
        </div>
        <span className="font-ui text-xs" style={{ color: 'var(--gb-muted)' }}>
          Выберите строку: примеры не всегда буквальные эквиваленты
        </span>
      </div>

      {/* Responsive Matrix Table */}
      <div
        className="mt-5 overflow-x-auto rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gb-accent)]"
        role="region"
        aria-label="Горизонтальная прокрутка сравнительной таблицы переводов"
        tabIndex={0}
      >
        <table className="w-full border-collapse text-left">
          <thead>
            <tr
              className="font-ui border-b text-[11px] font-bold tracking-wider uppercase"
              style={{ borderColor: 'var(--gb-border-strong)', color: 'var(--gb-muted)' }}
            >
              <th className="py-2.5 pr-3">Еврейский текст (MT)</th>
              <th className="py-2.5 px-3">Пример греческой передачи</th>
              <th className="py-2.5 pl-3">Русская передача</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--gb-border)' }}>
            {LEXICON_BRIDGES.map((row) => {
              const isSelected = row.id === activeRow.id;
              return (
                <tr
                  key={row.id}
                  className="transition-colors"
                  style={{
                    backgroundColor: isSelected ? 'var(--gb-accent-soft)' : 'transparent',
                  }}
                >
                  <td className="py-3 pr-3 align-middle">
                    <button type="button" aria-pressed={isSelected} onClick={() => setSelectedRowId(row.id)} className="inline-flex min-h-11 w-full cursor-pointer flex-col justify-center rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gb-accent)]">
                    <div className="font-hebrew text-lg sm:text-xl font-bold" style={{ color: 'var(--gb-ink)' }}>
                      {row.hebrew}
                    </div>
                    <div className="font-ui text-xs font-medium" style={{ color: isSelected ? 'var(--gb-accent)' : 'var(--gb-muted)' }}>
                      {row.hebrewTranslit}
                    </div>
                    </button>
                  </td>

                  <td className="py-3 px-3 align-middle">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="hidden sm:inline h-3.5 w-3.5 shrink-0" style={{ color: 'var(--gb-gold)' }} />
                      <div>
                        <div className="font-greek text-base sm:text-lg font-bold" style={{ color: 'var(--gb-ink)' }}>
                          {row.lxxGreek}
                        </div>
                        <div className="font-ui text-xs" style={{ color: 'var(--gb-muted)' }}>
                          {row.lxxTranslit}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 pl-3 align-middle">
                    <div className="font-serif-display text-sm sm:text-base font-bold" style={{ color: 'var(--gb-ink)' }}>
                      {row.synodalRendering}
                    </div>
                    <div className="font-ui text-[11px]" style={{ color: 'var(--gb-muted)' }}>
                      {row.countNote}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Bridge Christological Commentary Bar */}
      <div
        className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border p-4 sm:p-5"
        style={{
          backgroundColor: 'var(--gb-bg)',
          borderColor: 'var(--gb-gold)',
        }}
      >
        <div className="space-y-1">
          <div className="font-ui text-[11px] font-bold tracking-wider uppercase" style={{ color: 'var(--gb-accent)' }}>
            Богословское сопоставление · {activeRow.hebrewTranslit} / {activeRow.lxxTranslit}
          </div>
          <p className="font-body-editorial text-[14.5px] leading-relaxed" style={{ color: 'var(--gb-ink-secondary)' }}>
            {activeRow.theologicalBridge}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectName(linkedEntry)}
          className="font-ui inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold gb-on-accent transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--gb-accent)' }}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Открыть {linkedEntry.transliteration.split(' ')[0]}</span>
        </button>
      </div>
    </section>
  );
};
