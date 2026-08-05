#!/usr/bin/env node
/**
 * guard-no-main-junk.mjs — блокирует «мусорные» коммиты в main:
 *   - пустые/placeholder-коммиты;
 *   - direct-main маркеры (TEMP/SHOULD NOT USE MAIN/probe/placeholder);
 *   - неожиданные файлы (probe*, *placeholder*, *.tmp).
 *
 * Usage: node scripts/guard-no-main-junk.mjs [--diff <base>..<head>]
 * Exit 1 = найдены нарушения (CI должен заблокировать merge в main).
 */
import { execSync } from 'node:child_process';

const diffArg = process.argv.find((a) => a.startsWith('--diff='));
const range = diffArg ? diffArg.split('=')[1] : 'HEAD~1..HEAD';

const BAD_MESSAGE = /placeholder|TEMP SHOULD NOT|DO NOT USE|probe|accidental|wip|draft(?!-)|\btmp\b/i;
const BAD_FILES = /(^|\/)(probe|placeholder|temp|tmp)[^/]*$/i;
const BAD_EXT = /\.(tmp|bak|orig)$/i;

let exit = 0;
try {
  const msgs = execSync(`git log --format=%s ${range}`, { encoding: 'utf8' }).split('\n').filter(Boolean);
  const files = execSync(`git diff --name-only ${range}`, { encoding: 'utf8' }).split('\n').filter(Boolean);

  for (const m of msgs) {
    if (BAD_MESSAGE.test(m)) {
      console.error(`❌ Сообщение коммита похоже на мусор: "${m}"`);
      exit = 1;
    }
  }
  for (const f of files) {
    if (BAD_FILES.test(f) || BAD_EXT.test(f)) {
      console.error(`❌ Подозрительный файл в main: "${f}"`);
      exit = 1;
    }
  }
  if (exit === 0) console.log('✅ Нет мусорных коммитов/файлов.');
} catch (e) {
  console.error('⚠ diff пуст или ошибка:', e.message);
}
process.exit(exit);
