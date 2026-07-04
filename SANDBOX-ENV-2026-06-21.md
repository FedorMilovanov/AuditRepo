## 🛠 ТЕХНИЧЕСКИЙ ПАСПОРТ СРЕДЫ (Verified 2026-07-04)

**Архитектура:** E2B / Firecracker microVM  
**ОС:** Debian GNU/Linux 13 (trixie)  
**Ресурсы:** 2 vCPU, ~2 GB RAM, ~22 GB Disk  
**Права:** Полный root через sudo (без пароля)  
**Сеть:** Исходящий трафик открыт, localhost доступен  
**Маркер:** `E2B_SANDBOX=true`

* * *

# ARENA SESSION MANUAL — выживание в песочнице (v9 — 2026-07-04)

## 0. ЭКСПЕРИМЕНТАЛЬНО ПРОВЕРЕНО

```
✅ Файлы СОХРАНЯЮТСЯ при падении сессии (ext4, не tmpfs)
✅ git remote СОХРАНЯЕТСЯ (токен в URL — да, в ~/.git-credentials — нет)
✅ git log/history СОХРАНЯЕТСЯ
✅ node_modules СОХРАНЯЕТСЯ
✅ npm cache (~/.npm/) СОХРАНЯЕТСЯ
✅ Токен в remote URL сохраняется между сессиями
✅ /tmp/ файлы сохраняются
✅ ~/.cache/ (Playwright, fontconfig) сохраняется
✅ python3, sed -i — надёжны для правок кода
❌ global git config (user.name/email) НЕ сохраняется — ставь заново
❌ ~/.git-credentials НЕ существует
❌ SSH keys НЕ сохраняются
❌ Терминальная история/aliases НЕ сохраняются
❌ Фоновые процессы НЕ сохраняются
❌ Переменные окружения НЕ сохраняются
❌ Текущая рабочая директория НЕ сохраняется
❌ npm ci/node_modules НЕ переживают если не в workspace (в workspace — да)
❌ edit_file иногда ПАДАЕТ на крупных блоках (используй sed -i или python3)
❌ read_file файлов >500KB может упасть
❌ Vision/изображения — зависит от МОДЕЛИ, не от платформы
❌ Токен в открытом чате = СКОМПРОМЕТИРОВАН
```

### ⚠️ Главная ловушка: «новая сессия» ≠ новый разговор

Когда пользователь пишет новое сообщение (даже «продолжай») — Arena может **начать новую сессию**.  
Это 100% означает:

1. **git commit без `-c` упадет** — global git config user.name не установлен.  
   Фикс: поставь `git config user.name "..." && git config user.email "..."` в каждом репо.
2. **Путь может быть не `/home/user/work/repo`** — проверь `pwd` и `ls` сначала.
3. **Токен в remote URL живёт** — только если ты явно прописал `git remote set-url origin https://oauth2:TOKEN@github.com/...`.
4. **node_modules живы** — только если ты в той же workspace директории.
5. **Playwright бинарники живы** (в ~/.cache/).

**Правило:** каждый новый раунд → проверь `git log --oneline -1`, `git status`, `pwd` сразу.

* * *

## 1. Версии и обходные пути

| Компонент | По умолчанию | Нужно | Workaround |
|---|---|---|---|
| Node.js | 20.20.2 | 22.12.0+ (Astro 6) | `wget -q https://nodejs.org/dist/v22.12.0/node-v22.12.0-linux-x64.tar.xz -O /tmp/node22.tar.xz && tar -xf /tmp/node22.tar.xz -C /tmp/ && export PATH="/tmp/node-v22.12.0-linux-x64/bin:$PATH"` |
| npm | 10.x | 10.9.0 (с Node 22) | идёт с Node 22 |
| git global config | не установлен | user.name + email | `git config --global user.name "Arena Agent" && git config --global user.email "agent@arena.ai"` |
| git credentials | нет | токен в URL | `git remote set-url origin https://oauth2:TOKEN@github.com/owner/repo.git` |

### Speed/quality gate discipline

```
FAST loop (после мелкой правки):
  git diff --check
  npm run guard:shared-files  
  npm run data:consistency
  npm run migration:metadata:check

FULL gate (перед commit/merge/push production-impact lane):
  npm run validate:static-publication
  npm run guard:shared-files
```

**НЕ гоняй полный validate:static-publication после каждой правки** — 2 CPU/2GB RAM, Astro build жрёт ресурсы.

### CI-регрессии (факт: 7 из 8 коммитов)

**Паттерн:** Каждый агент ломает CI хотя бы раз за сессию.  
**Причина:** агенты не гоняют Playwright локально перед push.  
**Правило:** Перед push всегда запускай локальные быстрые тесты:
```bash
npm run gill:mobile-play:smoke      # ~30 сек
npm run gill:mobile-layout:audit    # ~60 сек  
```

* * *

## 2. Build-mode trap (КРИТИЧНО для gb-is-my-strength)

Production-артефакт = **strangler-build**: `astro build` + `node scripts/copy-legacy-to-dist.js`.  
НЕ plain `astro build`, НЕ `npm run build`.

Проверяй на production-like dist, иначе получишь ложные «404 / файл не существует» (как C-08).

```
npm run strangler:build:production-like   # правильный продакшн-билд
```

* * *

## 3. Git survival guide

```
# Перед commit (если global config не стоит):
git -c user.name="Arena Agent" -c user.email="agent@arena.ai" commit -m "msg"

# ИЛИ один раз на репозиторий:
git config user.name "Arena Agent" && git config user.email "agent@arena.ai"

# Если push rejected — rebase:
git pull --rebase origin main && git push origin main

# Если rebase конфликт:
# 1. почини конфликт в файлах
# 2. git add <files>
# 3. GIT_EDITOR=true git rebase --continue

# Если rebase сломался и коммит уже был — не паникуй:
git rebase --abort   # отменить rebase
# или
git push --force-with-lease   # если ты уверен, что твоя версия правильная
```

* * *

## 4. Playwright

```bash
# Установка (однократно, ~114MB):
npx playwright install chromium

# Если не хватает библиотек:
sudo apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2

# Smoke test:
node scripts/dist-smoke-audit.js --no-build --production-like
```

* * *

## 5. Что ещё важно

### 5.1 Vision/изображения
Способность видеть скриншоты зависит от **модели**, а не от платформы.  
Обходные пути: OCR (tesseract), PIL-анализ, Playwright + pixelmatch.

### 5.2 SVG / self-closing tags
```bash
grep -rn '/>' dist/ | grep -v '/>\|data:image' | head
```
Если SVG теги не самозакрывающиеся — браузер парсит неверно.

### 5.3 Токены
Токен в open chat = СКОМПРОМЕТИРОВАН.  
Как только написал токен в сообщение — он виден в истории чата и Arena может его логировать.  
Держи токен ТОЛЬКО в `git remote url` — он там живёт между сессиями.

* * *


## 📚 Historical reference (archived content)

Следующие секции были удалены из основной части для сокращения файла, но содержат полезную информацию.

### 1.8 Why some agents survive — failure taxonomy

| Failure mode | What it looks like | Likely cause | Mitigation |
|---|---|---|---|
| Context rot / drift | Agent forgets constraints, repeats failed approach | Long noisy transcript, weak compaction | Write decisions to lane reports; use FAST loop; summarize with file paths |
| Compaction loss | After summary, agent forgets active branch/lane/rules | Compaction omitted exact state | Keep AGENTS.md, WORK_MODES.md, lane reports as durable memory; commit before breaks |
| Zombie/stalled tool call | Spinner continues, no output | Missing tool timeout or hung subprocess | bash timeouts, avoid long background jobs, verify output files |
| Subagent black hole | Parent waits forever | Subagent lifecycle bug, no output contract | Sequential work preferred; require output files; don't spawn many background agents |
| Resource/OOM kill | Process killed during Astro/build/browser install | 2 CPU / ~2 GB RAM, parallel builds | Don't parallelize Astro builds; FAST loop before FULL gate |
| Tool-output bloat | Context fills with huge logs | Reading giant files into chat | grep/sed targeted slices; write analysis to files |
| Environment reset | Node 20, dist missing, browser missing | PATH not persistent, ephemeral dirs | Prefix Node commands; run npm ci; document environment |
| Git/worktree confusion | Agent edits wrong branch | Missing git status, stale worktrees | Start with git fetch, git status, git worktree list |
| Over-broad prompt | Agent tries to fix everything and trips shared files | No lane scope, no forbidden files list | WORK_MODES, LANE_LOCK_POLICY, migration matrix |
| Model/runtime variance | One model works for hours, another fails quickly | Different context handling, tool-call reliability | Keep state in files so weaker agents recover |

### 1.9 Arena coding polish — 30 operational rules (shortlist)

**Топ-10 для выживания в Arena:**
1. Start every turn with `git status --short --branch` when changes exist.
2. Run `git fetch --all --prune` before lane/merge/conflict decisions.
3. Never rely on `export` persisting; prefix Node with `PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH`.
4. Use `npm ci` in fresh sessions, NOT `npm install`.
5. Use FAST loop during iteration; reserve FULL gate for release barrier.
6. Do not run two Astro builds in parallel (2 CPU / ~2 GB RAM).
7. Use targeted file reads (`sed -n`, `grep`) instead of dumping large files.
8. Write long analysis to lane reports, not only the conversation.
9. Use git commits as state checkpoints after verified changes.
10. If context feels noisy, write a checkpoint to a file and continue from that file.

**Полный список:** см. `git show de5d8a4:SANDBOX-ENV-2026-06-21.md | grep -A2 '^[0-9]'` (из оригинального файла в git history).

### 1.6 External reference pass (30+ links)

Original document had 40+ verified external links documenting:
- E2B sandbox lifecycle, timeout defaults, persistence
- npm ci vs install behavior, GitHub Actions caching
- Astro v6 Node 22+ requirement
- Playwright CI caching strategies
- Git worktree multi-agent hygiene
- Codex/Claude session management and compaction

Полный список: `git show de5d8a4:SANDBOX-ENV-2026-06-21.md | sed -n '/^## 1.6/,/^## 1.7/p'`
