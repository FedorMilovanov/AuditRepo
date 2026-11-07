import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, Award } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Почему в Бытии 1:1 имя Элохим (אֱלֹהִים), имеющее форму множественного числа, сочетается с глаголом «сотворил» в единственном числе?',
    options: [
      'Это грамматическая ошибка древних переписчиков из Месопотамии',
      'Форма Элохим морфологически множественная, но в Быт. 1:1 с глаголом в единственном числе указывает на единого Творца; сама по себе форма не доказывает Троицу',
      'Потому что речь идёт о совете ангелов, которые помогали Богу создавать материю',
    ],
    correctIndex: 1,
    explanation:
      'В Быт. 1:1 глагол בָּרָא («сотворил») стоит в единственном числе. Значение формы Элохим определяется контекстом; доктрину Троицы нельзя вывести из одной грамматической формы.',
  },
  {
    id: 'q2',
    question: 'Как возникла латинская форма «Иегова» и почему в русском Синодальном переводе Тетраграмматон (יְהוָה) передан словом «Господь»?',
    options: [
      'Масореты вписали под согласными ЙХВХ гласные от титула Адонай («Владыка»), чтобы чтец в синагоге не произносил непроизносимое Имя вслух',
      'Слово «Иегова» было придумано в XIX веке и никогда не встречалось в рукописях',
      'Греческие переводчики не знали еврейского языка и случайно перепутали два разных слова',
    ],
    correctIndex: 0,
    explanation:
      'Из благоговения перед третьей заповедью иудеи при чтении заменяли Тетраграмматон словом Адонай. Септуагинта передала это греческим Κύριος («Господь»), откуда в Синодальный перевод пришло слово «Господь».',
  },
  {
    id: 'q3',
    question: 'В какой исторический момент Бог открылся 99-летнему Аврааму под именем Эль-Шаддай («Бог Всемогущий / Вседостаточный», Быт. 17:1)?',
    options: [
      'После победы Авраама над коалицией четырёх царей у Дамаска',
      'Когда человеческая способность иметь наследника окончательно омертвела и исполнение обетования было возможно лишь всемогущей силой Творца',
      'При покупке пещеры Махпела у сынов Хетовых',
    ],
    correctIndex: 1,
    explanation:
      'Имя Эль-Шаддай (в Септуагинте — Пантократор, «Вседержитель») звучит тогда, когда земные ресурсы исчерпаны: Бог Сам питает, умножает и рождает жизнь из мёртвости природы.',
  },
  {
    id: 'q4',
    question: 'Кто впервые в Священном Писании произнёс имя Бога Эль-Рои («Ты Бог Видящий меня», Быт. 16:13)?',
    options: [
      'Первосвященник Аарон при освящении скинии в пустыне',
      'Царь Давид после победы над Голиафом',
      'Бесправная египетская рабыня Агарь, бежавшая в пустыню от суровости Сарры',
    ],
    correctIndex: 2,
    explanation:
      'У источника Беэр-лахай-рои Ангел Господень нашёл изгнанную Агарь — свидетельство того, что Бог лично видит и хранит отверженных.',
  },
  {
    id: 'q5',
    question: 'Какое пророческое имя Мессии у пророка Иеремии (23:6) прямо соединяет Тетраграмматон с учением об оправдании по вере?',
    options: [
      'Яхве-Нисси («Господь — знамя моё»)',
      'Яхве-Цидкену («Господь — оправдание наше»)',
      'Яхве-Шамма («Господь там»)',
    ],
    correctIndex: 1,
    explanation:
      'В Иеремии 23:6 праведная Отрасль Давидова названа «Яхве-Цидкену» — «Господь — оправдание наше», что в Новом Завете раскрыто во 2 Кор. 5:21.',
  },
  {
    id: 'q6',
    question: 'Почему в греческом тексте Послания к Римлянам 8:15 и Галатам 4:6 сохранено непереведённое арамейское слово «Авва» (Ἀββᾶ ὁ Πατήρ)?',
    options: [
      'Потому что в греческом языке не было слова для обозначения отца',
      'Потому что это подлинное семейное обращение Самого Иисуса к Отцу (Мк. 14:36), которое Святой Дух вкладывает в сердца усыновлённых верующих',
      'Потому что послание было адресовано исключительно жителям Иерусалима',
    ],
    correctIndex: 1,
    explanation:
      'В Мк. 14:36 Иисус обращается к Отцу словами «Авва, Отче»; Павел использует это обращение для описания усыновления верующих (Рим. 8:15; Гал. 4:6).',
  },
  {
    id: 'q7',
    question: 'Какой ветхозаветный титул Яхве из книги пророка Исаии (44:6) Иисус Христос прямо относит к Себе в последней главе Библии (Откр. 22:13)?',
    options: [
      '«Альфа и Омега, начало и конец, Первый и Последний»',
      '«Бог Вефиля, явившийся во сне»',
      '«Владыка Силома и Самарии»',
    ],
    correctIndex: 0,
    explanation:
      'Титул «Я первый и Я последний, и кроме Меня нет Бога» (Ис. 44:6) в Откр. 22:13 произносит Сам грядущий Христос, подтверждая Своё полное Божественное единосущие с Отцом.',
  },
];

const QUIZ_STORAGE_KEY = 'gb:imena:atlas:quiz-answers:v1';

export const TheologicalQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    try {
      const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          const valid: Record<string, number> = {};
          for (const q of QUIZ_QUESTIONS) {
            const v = (parsed as Record<string, unknown>)[q.id];
            if (typeof v === 'number' && v >= 0 && v < q.options.length) {
              valid[q.id] = v;
            }
          }
          return valid;
        }
      }
    } catch {
      // Ignore storage errors
    }
    return {};
  });

  const answeredCount = Object.keys(answers).length;
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;
  const allCompleted = answeredCount === QUIZ_QUESTIONS.length;

  const handleSelect = (qId: string, optionIdx: number) => {
    setAnswers((prev) => {
      const next = { ...prev, [qId]: optionIdx };
      try {
        window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleReset = () => {
    setAnswers({});
    try {
      window.localStorage.removeItem(QUIZ_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <section
      id="theological-quiz"
      data-reveal
      className="scroll-mt-24 my-16 rounded-3xl border p-6 sm:p-8"
      style={{
        backgroundColor: 'var(--gb-surface)',
        borderColor: 'var(--gb-border-strong)',
        boxShadow: 'var(--gb-shadow-lg)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--gb-border)' }}>
        <div>
          <div className="font-ui flex items-center gap-2 text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--gb-accent)' }}>
            <HelpCircle className="h-4 w-4" style={{ color: 'var(--gb-gold)' }} />
            <span>Самопроверка экзегета · 7 вопросов</span>
          </div>
          <h2 className="font-serif-display mt-1 text-2xl sm:text-3xl font-bold" style={{ color: 'var(--gb-ink)' }}>
            Проверьте своё понимание Имён Божьих
          </h2>
        </div>

        {answeredCount > 0 && (
          <div className="flex items-center gap-3">
            <span
              className="font-ui rounded-full px-3 py-1 text-xs font-bold"
              style={{
                backgroundColor: 'var(--gb-accent-soft)',
                color: 'var(--gb-accent)',
              }}
            >
              Верно: {correctCount} из {QUIZ_QUESTIONS.length}
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="font-ui inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium hover:opacity-80"
              style={{
                borderColor: 'var(--gb-border-strong)',
                color: 'var(--gb-muted)',
              }}
            >
              <RotateCcw className="h-3 w-3" />
              Сбросить
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-6">
        {QUIZ_QUESTIONS.map((q, qIdx) => {
          const selected = answers[q.id];
          const isAnswered = selected !== undefined;
          const isCorrect = selected === q.correctIndex;

          return (
            <div
              key={q.id}
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: 'var(--gb-bg)',
                borderColor: 'var(--gb-border)',
              }}
            >
              <p className="font-serif-display text-base sm:text-lg font-bold leading-snug" style={{ color: 'var(--gb-ink)' }}>
                <span className="mr-2" style={{ color: 'var(--gb-accent)' }}>
                  {qIdx + 1}.
                </span>
                {q.question}
              </p>

              <div className="mt-3.5 space-y-2">
                {q.options.map((opt, idx) => {
                  const isThisSelected = selected === idx;
                  const isThisCorrect = idx === q.correctIndex;

                  let borderCol = 'var(--gb-border-strong)';
                  let bgCol = 'var(--gb-surface)';
                  if (isAnswered) {
                    if (isThisCorrect) {
                      borderCol = '#2a6b4a';
                      bgCol = 'rgba(42, 107, 74, 0.11)';
                    } else if (isThisSelected && !isThisCorrect) {
                      borderCol = '#9b3c3c';
                      bgCol = 'rgba(155, 60, 60, 0.11)';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect(q.id, idx)}
                      className="font-body-editorial flex w-full cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-left text-[15px] leading-snug transition-all hover:opacity-95"
                      style={{
                        borderColor: borderCol,
                        backgroundColor: bgCol,
                        color: 'var(--gb-ink)',
                      }}
                    >
                      <span className="mt-0.5 shrink-0">
                        {isAnswered && isThisCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : isAnswered && isThisSelected && !isThisCorrect ? (
                          <XCircle className="h-4 w-4 text-rose-600" />
                        ) : (
                          <span
                            className="font-ui inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-bold"
                            style={{ borderColor: 'var(--gb-border-strong)', color: 'var(--gb-muted)' }}
                          >
                            {String.fromCharCode(1040 + idx)}
                          </span>
                        )}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div
                  className="font-ui mt-3.5 rounded-xl border-l-4 px-4 py-2.5 text-xs leading-relaxed"
                  style={{
                    backgroundColor: 'var(--gb-surface-quote)',
                    borderLeftColor: isCorrect ? '#2a6b4a' : 'var(--gb-accent)',
                    color: 'var(--gb-ink-secondary)',
                  }}
                >
                  <strong style={{ color: isCorrect ? '#2a6b4a' : 'var(--gb-accent)' }}>
                    {isCorrect ? 'Верно! ' : 'Пояснение: '}
                  </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Summary Banner */}
      {allCompleted && (
        <div
          className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border p-5"
          style={{
            backgroundColor: 'var(--gb-accent-soft)',
            borderColor: 'var(--gb-gold)',
          }}
        >
          <div className="flex items-start gap-3">
            <Award className="mt-0.5 h-6 w-6 shrink-0" style={{ color: 'var(--gb-accent)' }} />
            <div>
              <h3 className="font-serif-display text-lg font-bold" style={{ color: 'var(--gb-ink)' }}>
                Самопроверка завершена: {correctCount} из {QUIZ_QUESTIONS.length} верных ответов
              </h3>
              <p className="font-body-editorial mt-1 text-sm" style={{ color: 'var(--gb-ink-secondary)' }}>
                {correctCount === QUIZ_QUESTIONS.length
                  ? 'Превосходное знание библейской ономатологии, лексики оригинала и христологии Завета!'
                  : 'Отличная работа над текстом Писания! Вы можете перечитать пояснения к отмеченным вопросам или пройти проверку снова.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="font-ui inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--gb-accent)' }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Пройти заново</span>
          </button>
        </div>
      )}
    </section>
  );
};
