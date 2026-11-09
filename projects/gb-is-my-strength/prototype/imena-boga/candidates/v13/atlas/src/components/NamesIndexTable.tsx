import React, { useState } from 'react';
import { TableProperties, ChevronDown, ChevronUp, Navigation, CheckCircle2 } from 'lucide-react';
import { ARTICLE_SECTIONS, DivineNameEntry } from '../data/divineNames';

interface NamesIndexTableProps {
  names: DivineNameEntry[];
  studiedIds: Set<string>;
  onJumpToName: (entry: DivineNameEntry) => void;
  onSelectName: (entry: DivineNameEntry) => void;
}

export const NamesIndexTable: React.FC<NamesIndexTableProps> = ({
  names,
  studiedIds,
  onJumpToName,
  onSelectName,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="names-index"
      data-reveal
      className="scroll-mt-24 my-14 rounded-3xl border p-6 sm:p-8"
      style={{
        backgroundColor: 'var(--gb-surface)',
        borderColor: 'var(--gb-border-strong)',
        boxShadow: 'var(--gb-shadow-lg)',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div>
          <div
            className="font-ui flex items-center gap-2 text-xs font-bold tracking-wider uppercase"
            style={{ color: 'var(--gb-gold-ink)' }}
          >
            <TableProperties className="h-4 w-4" />
            <span>Справочная таблица · для печати и быстрого поиска</span>
          </div>
          <h2
            className="font-serif-display mt-1 text-xl sm:text-2xl font-bold"
            style={{ color: 'var(--gb-ink)' }}
          >
            Указатель 36 исследуемых обозначений: оригинал, транслитерация, Стронг и место Писания
          </h2>
          <p className="font-ui mt-1 text-xs" style={{ color: 'var(--gb-muted)' }}>
            Нажмите на строку, чтобы перейти к карточке в тексте статьи, или на название — чтобы
            открыть полное досье.
          </p>
        </div>

        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
          style={{
            borderColor: 'var(--gb-border-strong)',
            backgroundColor: 'var(--gb-bg)',
            color: 'var(--gb-accent)',
          }}
        >
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {open && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr
                className="font-ui border-b text-[11px] font-bold tracking-wider uppercase"
                style={{ borderColor: 'var(--gb-border-strong)', color: 'var(--gb-muted)' }}
              >
                <th className="py-2.5 pr-3">№</th>
                <th className="py-2.5 pr-3">Оригинал</th>
                <th className="py-2.5 pr-3">Транслитерация</th>
                <th className="py-2.5 pr-3 hidden md:table-cell">Русское имя</th>
                <th className="py-2.5 pr-3 hidden lg:table-cell">Стронг</th>
                <th className="py-2.5 pr-3 hidden sm:table-cell">Ключевой стих</th>
                <th className="py-2.5 pl-3 text-right">Переход</th>
              </tr>
            </thead>
            <tbody>
              {ARTICLE_SECTIONS.map((section) => {
                const sectionNames = names.filter((n) => n.sectionId === section.id);
                if (sectionNames.length === 0) return null;
                return (
                  <React.Fragment key={section.id}>
                    <tr
                      style={{
                        backgroundColor: 'var(--gb-bg)',
                      }}
                    >
                      <td
                        colSpan={7}
                        className="font-ui border-b px-3 py-2 text-[11px] font-bold tracking-wider uppercase"
                        style={{
                          borderColor: 'var(--gb-border)',
                          color: 'var(--gb-accent)',
                        }}
                      >
                        Часть {section.roman} · {section.title}
                      </td>
                    </tr>
                    {sectionNames.map((item) => {
                      const isStudied = studiedIds.has(item.id);
                      return (
                        <tr
                          key={item.id}
                          className="transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                          style={{ borderBottom: '1px solid var(--gb-border)' }}
                        >
                          <td
                            className="font-ui py-2.5 pr-3 align-middle text-xs font-bold tabular-nums"
                            style={{ color: 'var(--gb-gold-ink)' }}
                          >
                            {item.number}
                          </td>
                          <td className="py-2.5 pr-3 align-middle">
                            <span
                              className={`${
                                item.language === 'greek' ? 'font-greek' : 'font-hebrew'
                              } text-base font-bold whitespace-nowrap`}
                              style={{ color: 'var(--gb-ink)' }}
                            >
                              {item.original}
                            </span>
                          </td>
                          <td className="py-2.5 pr-3 align-middle">
                            <button
                              type="button"
                              onClick={() => onSelectName(item)}
                              className="font-serif-display cursor-pointer text-left text-[15px] font-bold hover:underline"
                              style={{ color: 'var(--gb-ink)' }}
                            >
                              {item.transliteration}
                            </button>
                            {isStudied && (
                              <span
                                className="ml-1.5 inline-flex align-middle"
                                title="Изучено"
                                style={{ color: '#2a6b4a' }}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </td>
                          <td
                            className="font-ui py-2.5 pr-3 align-middle text-xs hidden md:table-cell"
                            style={{ color: 'var(--gb-ink-secondary)' }}
                          >
                            {item.russianName}
                          </td>
                          <td
                            className="font-ui py-2.5 pr-3 align-middle text-xs font-mono hidden lg:table-cell"
                            style={{ color: 'var(--gb-muted)' }}
                          >
                            {item.strongs}
                          </td>
                          <td
                            className="font-ui py-2.5 pr-3 align-middle text-xs hidden sm:table-cell"
                            style={{ color: 'var(--gb-accent)' }}
                          >
                            {item.keyVerses[0]?.ref}
                          </td>
                          <td className="py-2.5 pl-3 align-middle text-right">
                            <button
                              type="button"
                              onClick={() => onJumpToName(item)}
                              className="font-ui inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors hover:opacity-85"
                              style={{
                                borderColor: 'var(--gb-border-strong)',
                                backgroundColor: 'var(--gb-bg)',
                                color: 'var(--gb-accent)',
                              }}
                              title={`Перейти к карточке «${item.transliteration}» в тексте`}
                            >
                              <Navigation className="h-3 w-3" />
                              <span>В тексте</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
