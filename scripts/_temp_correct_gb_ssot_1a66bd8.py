#!/usr/bin/env python3
from pathlib import Path

root=Path('projects/gb-is-my-strength')
next_path=root/'NEXT_AGENT_PROMPT.md'
matrix_path=root/'verified/MASTER_BUG_MATRIX.md'
next_text=next_path.read_text(encoding='utf-8')
matrix=matrix_path.read_text(encoding='utf-8')

old='''**Source release gates зелёные на `1a66bd8`.** PR #94 снял старый atlas-export PNG blocker; PR #95 закрыл дубли цитат, ARIA и конкурентный scroll-lock; PR #96 закрыл `MAP-P0-02`, `MAP-P0-03`, `MAP-P0-08`, `ASTRO-P0-01`, `ASTRO-P0-02`, добавил постоянный regression guard и исправил обнаруженный full-gate hash-drift `site-utils.js` в 38 HTML/Astro ссылках. Exact post-merge deployed SHA пока не подтверждён доступным connector witness, поэтому `PROD-STALE-DEPLOY-RED` не закрывать декларативно.'''
new='''**Source release gates зелёные на `1a66bd8`.** PR #94 снял старый atlas-export PNG blocker; PR #95 закрыл дубли цитат, ARIA и конкурентный scroll-lock; PR #96 закрыл первый runtime P0-кластер карт и cache-bust drift; PR #97 закрыл `MAP-P0-04/05` единой initial-state/deep-link транзакцией с pure и Chromium witnesses. Exact post-merge deployed SHA пока не подтверждён доступным connector witness, поэтому `PROD-STALE-DEPLOY-RED` не закрывать декларативно.'''
if next_text.count(old)!=1: raise SystemExit('NEXT current summary mismatch')
next_text=next_text.replace(old,new,1)
next_text=next_text.replace('Прежние reverify (`32ae0d7d`, `2ca2af3b`, `b8459bdf`, `14a49be8`) исторические.', 'Прежние reverify (`1f80f12`, `32ae0d7d`, `2ca2af3b`, `b8459bdf`, `14a49be8`) исторические.',1)

old_evidence='''- **2026-07-21 — Source HEAD `1f80f12`: release gates green; runtime P0 wave landed.** PR #94 снял исторический atlas-export PNG stop-point; PR #95 закрыл quote dedupe/ARIA/shared scroll-lock; PR #96 закрыл `MAP-P0-02`, `MAP-P0-03`, `MAP-P0-08`, `ASTRO-P0-01`, `ASTRO-P0-02`, добавил permanent map regression guard и синхронизировал 38 stale `site-utils.js` asset revisions. Full `validate:static-publication`, `guard:shared-files`, Shared Files Guard и Native Source Contract green. Exact post-merge deployed SHA proof pending; evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1a66bd8.md`.'''
new_evidence=old_evidence.replace('CURRENT_HEAD_REVERIFY_2026-07-21_1a66bd8.md','CURRENT_HEAD_REVERIFY_2026-07-21_1f80f12.md')
if matrix.count(old_evidence)!=1: raise SystemExit('old session evidence mismatch')
matrix=matrix.replace(old_evidence,new_evidence,1)

next_path.write_text(next_text,encoding='utf-8')
matrix_path.write_text(matrix,encoding='utf-8')
print('SSOT provenance corrected')
