# PR #2217 resulting main — широкая волна 39

**Дата:** 2026-10-29  
**Product PR:** #2217  
**PR head:** `ff860d39dd107997ba70470960bfb003ebc2be1a`  
**Merge commit / current main:** `f63aac014c1d2d24e812a2f283245e4c60dc45d8`  
**Граница:** read-only; merge выполнил Product owner, не AuditRepo.

## Merge identity

GitHub подтверждает:

- PR state: `MERGED`;
- merged at: `2026-10-29T17:26:49Z`;
- merged by: `FedorMilovanov`;
- merge commit: `f63aac014c1d2d24e812a2f283245e4c60dc45d8`;
- exact PR-head checks перед merge: 39 success / 4 skipped / 0 failure / 0 pending.

Fetched `origin/main` указывает на этот же merge commit. `git merge-base --is-ancestor ff860d39… origin/main` проходит. Tree objects PR head и merge commit идентичны:

```text
ff860d39^{tree} = f63aac01^{tree}
8a121d9021949a8eb843e19f8b7d588dbfe5717f
```

Поэтому все exact-tree browser/build witnesses волн 25–38 относятся к resulting main без предположения о runtime-equivalence: Git tree байт-в-байт тот же.

## Fresh resulting-main contracts

На detached `f63aac01…` повторно выполнены:

```text
node scripts/build-scripture-occurrence-index.mjs --check
→ 1368 references, 3474 occurrences, 102 routes

node scripts/scripture-occurrence-index-contract.mjs
→ passed; 149 curated text records

node scripts/glossary-contract-audit.js
→ passed; 137 terms, 378 aliases, 857 source files

git diff --exit-code
→ clean
```

Следовательно, owner repair индекса и systemic glossary taxonomy guard сохранены в resulting main, а проверка не оставляет generated drift.

## Что меняет статус findings

### Теперь current main

Ранее PR-local evidence становится current-main evidence на exact `f63aac01…`:

- серия «Отступники», её пять частей, hub и Home promotion опубликованы в main;
- отсутствие bottom neighbour surface на пяти частях больше не является только draft observation; оно остаётся manifestation в `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`;
- generic quiz relation/source-fragment fail-open boundary также теперь подкреплена merged fixture, но уже принадлежит тому же atomic-authoring system lane;
- PR-языковые/copy observations больше нельзя описывать как «unmerged», однако они по-прежнему не требуют отдельной строки на каждое слово: closure должна идти через существующий authoring/editorial owner;
- пять новых quiz-source mobile failures теперь дополняют шесть current Gill controls в `GBS-GILL-QUIZ-SOURCE-LINK-MOBILE-NOOP` на одном и том же shared component;
- five-route print divergence теперь resulting-main manifestation `SYS-READER-PRINT-EXCLUSION-POLICY-PARITY`;
- Home `Евреям 6` first-result outcome теперь часть current-main `SYS-SCRIPTURE-EXACT-DESTINATION-REACHABILITY`, а не PR extension.

### Что закрыто

- stale scripture index omission закрыт;
- glossary category omission закрыт и защищён common contract;
- Home links и cards сохраняют pointer/keyboard/no-JS parity;
- PR admission transaction завершена exact green merge.

## Updated exact-search resulting-main numbers

Merged index содержит:

- 1368 references с occurrences;
- 3474 total occurrences;
- 1559 unanchored occurrences;
- 772 references, у которых первый result unanchored;
- 507 all-unanchored references;
- 354 mixed anchored/unanchored references.

Это заменяет старый current-main census 1306/3228 в evidence wave 37. Root и closure boundary не меняются; меняется только resulting-main масштаб.

## Push-CI boundary

Сразу после merge GitHub создал main-push checks. При первичном resulting-main запросе было 9 success / 6 skipped / 0 failure / 17 pending. Это не переопределяет уже доказанную exact tree identity и local contracts, но resulting-main remote CI нельзя объявлять завершённым, пока очередь не закончена. Финальный статус должен быть дописан только после exact-merge-SHA re-query.

## Matrix disposition

Новых строк не требуется:

- merged manifestations переводятся из PR evidence в current-main evidence существующих owners;
- freshness и glossary closure остаются closure, а не активными rows;
- exact-search system row уже адмитирован в wave 37 и лишь получает stronger resulting-main anchor.

Арифметика остаётся **57 = 28 direct + 7 improvements + 1 residual + 21 system lanes**.

**Широкая волна 39 завершена.**
