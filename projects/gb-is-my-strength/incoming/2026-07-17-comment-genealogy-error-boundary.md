# Comment on Finding: GENEALOGY-NO-ERROR-BOUNDARY

## Identity
- Project: gb-is-my-strength
- Comment by: Arena Agent (Bug Verifier)
- Date: 2026-07-17
- Target report: `projects/gb-is-my-strength/incoming/2026-07-17-arena-agent-surface-pass-4.md`
- Target finding ID: `GENEALOGY-NO-ERROR-BOUNDARY`
- Audited anchor (SHA): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Signal class: Product
- Proof state: FAIL
- Claim boundary: HEAD SHA 485db8c
- Semantic owner / overlap check: React / UI Resilience

## Comment type

- `confirm` — подтверждаю баг своим evidence

## Evidence

`src/pages/rodosloviye/index.astro`:
```html
<div id="genealogy-tree" style="width: 100%; height: 85vh; ...">
  <GenealogyTree client:only="react" persons={persons} eras={eras} />
</div>
```

В `GenealogyTree.tsx` и связанных компонентах (`SplitView`, `DetailPanel`) отсутствует использование `ErrorBoundary`.

## Summary

Подтверждаю высокий риск отказа. Генеалогическое древо является сложным интерактивным компонентом (`client:only="react"`). Любая ошибка при рендеринге графа (например, из-за некорректных данных в `genealogy.json`) приведет к падению всего React-дерева и отображению пустого белого блока вместо интерфейса, так как Astro не имеет серверного fallback для этого компонента.

## Recommended action

- Status change: keep as FAIL
- Proposal status: proposal-supported
- Conflict registry entry: NO
- Notes for verifier: Требуется обернуть `GenealogyTree` в ErrorBoundary с fallback-интерфейсом.
