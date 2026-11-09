import React, { useState } from 'react';
import { Sparkles, Cross, BookOpen } from 'lucide-react';

interface IAmStatement {
  id: string;
  numeral: string;
  greek: string;
  translit: string;
  russian: string;
  gospelRef: string;
  synodalQuote: string;
  otBackgroundRef: string;
  otThematicParallel: string;
  theologicalMeaning: string;
}

const SEVEN_I_AM: IAmStatement[] = [
  {
    id: 'bread',
    numeral: 'I',
    greek: 'Ἐγώ εἰμι ὁ ἄρτος τῆς ζωῆς',
    translit: 'Эго эйми хо артос тес дзоес',
    russian: 'Я есмь хлеб жизни',
    gospelRef: 'Иоанна 6:35, 48, 51',
    synodalQuote: '«Иисус же сказал им: Я есмь хлеб жизни; приходящий ко Мне не будет алкать, и верующий в Меня не будет жаждать никогда».',
    otBackgroundRef: 'Исход 16:4, 15 · Втор. 8:3',
    otThematicParallel: 'Манна и Божье попечение (Исх. 16)',
    theologicalMeaning:
      'Манна в пустыне поддерживала лишь земную жизнь и не спасала от смерти (Ин. 6:49). Христос открывает Себя как истинный небесный Хлеб: Его преломлённая плоть и пролитая кровь даруют вечную жизнь.',
  },
  {
    id: 'light',
    numeral: 'II',
    greek: 'Ἐγώ εἰμι τὸ φῶς τοῦ κόσμου',
    translit: 'Эго эйми то фос ту косму',
    russian: 'Я есмь свет миру',
    gospelRef: 'Иоанна 8:12; 9:5',
    synodalQuote: '«Опять говорил Иисус к народу и сказал им: Я свет миру; кто последует за Мною, тот не будет ходить во тме, но будет иметь свет жизни».',
    otBackgroundRef: 'Исход 13:21 · Псалом 26:1 · Исаия 60:19',
    otThematicParallel: 'Господь — свет мой (Пс. 26:1)',
    theologicalMeaning:
      'В Ин. 8:12 Иисус говорит о Себе как о свете миру. Некоторые толкователи связывают это речение с образом света на празднике Кущей и огненным столпом Исхода (Исх. 13:21), но евангелист не называет их прямой этимологией слов Иисуса. Это богословское сопоставление образов, а не новое составное Божье имя.',
  },
  {
    id: 'door',
    numeral: 'III',
    greek: 'Ἐγώ εἰμι ἡ θύρα τῶν προβάτων',
    translit: 'Эго эйми хе тюра тон пробатон',
    russian: 'Я есмь дверь овцам',
    gospelRef: 'Иоанна 10:7, 9',
    synodalQuote: '«Я есмь дверь: кто войдёт Мною, тот спасётся, и войдёт, и выйдет, и пажить найдёт».',
    otBackgroundRef: 'Псалом 117:20 · Бытие 28:17',
    otThematicParallel: 'Врата небес во сне Иакова (Быт. 28:17), не перевод Эль-Бетель',
    theologicalMeaning:
      'В Ин. 10:7–10 Иисус называет Себя дверью для овец: через Него входят и находят спасение и пажить. Этот образ стоит объяснять по самому рассказу о пастыре и стаде, не выдавая популярную реконструкцию древнего овечьего загона за установленный обычай или смысл имени Эль-Бетель.',
  },
  {
    id: 'shepherd',
    numeral: 'IV',
    greek: 'Ἐγώ εἰμι ὁ ποιμὴν ὁ καλός',
    translit: 'Эго эйми хо поймен хо калос',
    russian: 'Я есмь пастырь добрый',
    gospelRef: 'Иоанна 10:11, 14',
    synodalQuote: '«Я есмь пастырь добрый: пастырь добрый полагает жизнь свою за овец… Я знаю Моих, и Мои знают Меня».',
    otBackgroundRef: 'Псалом 22:1 · Иезекииль 34:11–16 · Исаия 40:11',
    otThematicParallel: 'Господь — Пастырь мой (Пс. 22:1)',
    theologicalMeaning:
      'В Иезекииля 34 Сам Господь Яхве обещал отнять стадо у корыстных наёмников и лично пасти Своих овец. Называя Себя Пастырем добрым, Иисус исполняет это пророчество ценой собственной жизни.',
  },
  {
    id: 'resurrection',
    numeral: 'V',
    greek: 'Ἐγώ εἰμι ἡ ἀνάστασις καὶ ἡ ζωή',
    translit: 'Эго эйми хе анастасис кай хе дзое',
    russian: 'Я есмь воскресение и жизнь',
    gospelRef: 'Иоанна 11:25–26',
    synodalQuote: '«Иисус сказал ей: Я есмь воскресение и жизнь; верующий в Меня, если и умрёт, оживёт».',
    otBackgroundRef: 'Втор. 32:39 · Иов 19:25 · Осия 13:14',
    otThematicParallel: 'Бог дарует жизнь и искупление (Втор. 32:39; Иов 19:25)',
    theologicalMeaning:
      'У гроба четверодневного Лазаря Иисус не просто обещает будущее воскресение в последний день — Он утверждает, что само Воскресение и победа над смертью заключены в Его собственной Личности.',
  },
  {
    id: 'way',
    numeral: 'VI',
    greek: 'Ἐγώ εἰμι ἡ ὁδὸς καὶ ἡ ἀλήθεια καὶ ἡ ζωή',
    translit: 'Эго эйми хе ходос кай хе алетейя кай хе дзое',
    russian: 'Я есмь путь и истина и жизнь',
    gospelRef: 'Иоанна 14:6',
    synodalQuote: '«Иисус сказал ему: Я есмь путь и истина и жизнь; никто не приходит к Отцу, как только чрез Меня».',
    otBackgroundRef: 'Исход 26:33 · Исаия 35:8 · Иеремия 10:10',
    otThematicParallel: 'Святой путь (Ис. 35:8) и Божья истина (Иер. 10:10)',
    theologicalMeaning:
      'Без Него путь есть блуждание, знание — заблуждение, а существование — духовная смерть. Он одновременно и дорога к Отцу, и высшая реальность Божьей истины, и источник жизни.',
  },
  {
    id: 'vine',
    numeral: 'VII',
    greek: 'Ἐγώ εἰμι ἡ ἄμπελος ἡ ἀληθινή',
    translit: 'Эго эйми хе ампелос хе алетине',
    russian: 'Я есмь истинная виноградная лоза',
    gospelRef: 'Иоанна 15:1, 5',
    synodalQuote: '«Я есмь лоза, а вы ветви; кто пребывает во Мне, и Я в нём, тот приносит много плода; ибо без Меня не можете делать ничего».',
    otBackgroundRef: 'Псалом 79:9–16 · Исаия 5:1–7',
    otThematicParallel: 'Израиль как виноградник (Пс. 79:9–16; Ис. 5:1–7)',
    theologicalMeaning:
      'Ветхозаветный Израиль часто сравнивался с виноградником, принесшим дикие ягоды. Христос есть Истинный Израиль и живая Лоза, питающая верующих соком благодати Святого Духа.',
  },
];

export const SevenIAmStatements: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(SEVEN_I_AM[0].id);

  const current = SEVEN_I_AM.find((s) => s.id === activeId) || SEVEN_I_AM[0];

  return (
    <div
      data-reveal
      className="my-10 rounded-3xl border p-6 sm:p-8 shadow-xl"
      style={{
        backgroundColor: 'var(--gb-surface)',
        borderColor: 'var(--gb-gold)',
        boxShadow: 'var(--gb-shadow-xl)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4" style={{ borderColor: 'var(--gb-border)' }}>
        <div>
          <div
            className="font-ui flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase"
            style={{ color: 'var(--gb-gold-ink)' }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Речения Иисуса · Тематические связи Ветхого и Нового Заветов</span>
          </div>
          <h3 className="font-serif-display mt-1 text-xl sm:text-2xl font-bold" style={{ color: 'var(--gb-ink)' }}>
            Семь образных «Я есмь» (<span className="font-greek">Ἐγώ εἰμι</span>) Господа Иисуса
          </h3>
        </div>
        <span className="font-ui text-xs" style={{ color: 'var(--gb-muted)' }}>
          Выберите одно из 7 речений
        </span>
      </div>

      <p className="font-body-editorial mt-3 max-w-4xl text-sm leading-relaxed" style={{ color: 'var(--gb-muted)' }}>
        Здесь собраны семь высказываний Иисуса с образным определением после «Я есмь». Слова Ин. 8:58 рассматриваются отдельно: их нельзя автоматически отождествлять с этими семью речениями. Ветхозаветные параллели — богословские сопоставления, а не буквальные переводы новых собственных имён Бога.
      </p>

      {/* 7 Interactive Tabs */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {SEVEN_I_AM.map((item) => {
          const isSelected = item.id === current.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center transition-all ${
                isSelected ? 'sacred-active-glow scale-[1.03]' : 'hover:opacity-90'
              }`}
              style={{
                backgroundColor: isSelected ? 'var(--gb-accent)' : 'var(--gb-bg)',
                borderColor: isSelected ? 'var(--gb-gold)' : 'var(--gb-border-strong)',
                color: isSelected ? '#ffffff' : 'var(--gb-ink)',
              }}
            >
              <div
                className="font-serif-display text-xs font-bold"
                style={{ color: isSelected ? 'var(--gb-gold-bright)' : 'var(--gb-gold)' }}
              >
                {item.numeral}
              </div>
              <div className="font-ui mt-0.5 truncate text-[11px] font-semibold">
                {item.russian.replace('Я есмь ', '')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Statement Detail Panel */}
      <div
        className="mt-5 rounded-2xl border p-5 sm:p-6"
        style={{
          backgroundColor: 'var(--gb-bg)',
          borderColor: 'var(--gb-border-strong)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--gb-border)' }}>
          <div>
            <div className="font-ui text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--gb-accent)' }}>
              Речение {current.numeral} из VII · {current.gospelRef}
            </div>
            <h4 className="font-serif-display mt-1 text-xl sm:text-2xl font-bold" style={{ color: 'var(--gb-ink)' }}>
              {current.russian}
            </h4>
          </div>

          <div
            className="self-start sm:self-center rounded-xl border px-4 py-2 text-right"
            style={{
              backgroundColor: 'var(--gb-surface)',
              borderColor: 'var(--gb-gold)',
            }}
          >
            <div className="font-greek text-lg sm:text-xl font-bold" style={{ color: 'var(--gb-ink)' }}>
              {current.greek}
            </div>
            <div className="font-ui text-[10px]" style={{ color: 'var(--gb-muted)' }}>
              {current.translit}
            </div>
          </div>
        </div>

        <blockquote
          className="mt-4 rounded-xl border-l-4 px-4 py-3"
          style={{
            backgroundColor: 'var(--gb-surface-quote)',
            borderLeftColor: 'var(--gb-accent)',
          }}
        >
          <p className="font-quote-editorial text-lg italic leading-relaxed" style={{ color: 'var(--gb-ink)' }}>
            {current.synodalQuote}
          </p>
        </blockquote>

        <p className="font-body-editorial mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--gb-ink-secondary)' }}>
          {current.theologicalMeaning}
        </p>

        <div
          className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-xs"
          style={{
            backgroundColor: 'var(--gb-surface)',
            borderColor: 'var(--gb-border)',
          }}
        >
          <span className="font-ui flex items-center gap-1.5 font-semibold" style={{ color: 'var(--gb-accent)' }}>
            <Cross className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
            <span>Ветхозаветный тематический контекст: {current.otThematicParallel}</span>
          </span>
          <span className="font-ui flex items-center gap-1" style={{ color: 'var(--gb-muted)' }}>
            <BookOpen className="h-3.5 w-3.5" />
            <span>Связанные тексты ВЗ: {current.otBackgroundRef}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
