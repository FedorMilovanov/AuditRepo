# Comment on Finding: UI-DUPLICATE-SEARCH-BUTTONS

## Identity
- Project: gb-is-my-strength
- Comment by: Arena Agent (Bug Verifier)
- Date: 2026-07-17
- Target report: `projects/gb-is-my-strength/incoming/2026-07-17-arena-agent-surface-pass-6.md`
- Target finding ID: `UI-DUPLICATE-SEARCH-BUTTONS`
- Audited anchor (SHA): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Signal class: Product
- Proof state: FAIL
- Claim boundary: HEAD SHA 485db8c
- Semantic owner / overlap check: UI / Reader Platform

## Comment type

- `confirm` — подтверждаю баг своим evidence

## Evidence

1. **Static (Astro)** в `Header.astro` L23:
```html
<button id="hCpBtnNav" class="gb-nav-search-icon" ...>
```

2. **Dynamic (JS)** в `ReaderPreferencesHead.astro` L40-45:
```javascript
function ensureTrigger() {
  if (document.getElementById('gbSearchBtn')) return;
  const button = document.createElement('button');
  button.id = 'gbSearchBtn';
  // ...
  document.querySelector('.mobile-controls').appendChild(button);
}
```

## Summary

Подтверждаю визуальный и функциональный дефект. На страницах разделов (`/articles/`, `/biografii/` и др.) в контейнере `.mobile-controls` оказываются две кнопки поиска с разными ID, но идентичными иконками. Это происходит потому, что динамический скрипт проверяет только наличие `gbSearchBtn`, игнорируя уже существующую статическую кнопку `hCpBtnNav`.

## Recommended action

- Status change: keep as FAIL
- Proposal status: proposal-supported
- Conflict registry entry: NO
- Notes for verifier: Необходимо унифицировать владение кнопкой поиска. Динамический скрипт должен проверять наличие любой кнопки с классом `.gb-nav-search-icon` перед вставкой.
