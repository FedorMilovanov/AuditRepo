# Verified bug ledger — placeholder

Этот файл пока пустой намеренно.

Когда несколько агентов загрузят отчёты, сильный верификатор должен:
- прочитать всё из `incoming/`
- собрать дедуплицированную матрицу
- подтвердить баги на production-like artifact / browser / source
- только после этого заполнять этот файл

Рекомендуемые секции:
- Shared runtime bugs
- Route bugs
- Metadata / content bugs
- Audit/tooling false positives
- Repair order
