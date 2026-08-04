#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path

path = Path('.github/tmp/nagornaya_dark_browser.js')
text = path.read_text(encoding='utf-8')

anchor = "function emptyAggregate(token) {"
insert = r'''function ignoreLocalNoise(text) {
  return (/violates the following Content Security Policy directive/i.test(text) && /https:\/\/gospod-bog\.ru\//i.test(text))
    || /Failed to load resource.*mc\.yandex/i.test(text)
    || /favicon/i.test(text);
}

function emptyAggregate(token) {'''
if text.count(anchor) != 1:
    raise SystemExit(f'ignoreLocalNoise insertion anchor drift: {text.count(anchor)}')
text = text.replace(anchor, insert, 1)

old_init = r'''        await context.addInitScript((wantedTheme) => {
          try { localStorage.setItem('theme', wantedTheme); } catch {}
          document.documentElement.classList.toggle('dark', wantedTheme === 'dark');
          document.documentElement.dataset.theme = wantedTheme;
        }, theme);'''
new_init = r'''        await context.addInitScript((wantedTheme) => {
          try { localStorage.setItem('theme', wantedTheme); } catch {}
        }, theme);'''
if text.count(old_init) != 1:
    raise SystemExit(f'early-document init replacement anchor drift: {text.count(old_init)}')
text = text.replace(old_init, new_init, 1)

old_listener = r'''        page.on('pageerror', (error) => pageErrors.push(String(error && error.message || error)));
        page.on('console', (message) => {
          if (message.type() === 'error') pageErrors.push(`console: ${message.text()}`);
        });'''
new_listener = r'''        page.on('pageerror', (error) => {
          const value = String(error && error.message || error);
          if (!ignoreLocalNoise(value)) pageErrors.push(value);
        });
        page.on('console', (message) => {
          const value = message.text();
          if (message.type() === 'error' && !ignoreLocalNoise(value)) pageErrors.push(`console: ${value}`);
        });'''
if text.count(old_listener) != 1:
    raise SystemExit(f'console-filter replacement anchor drift: {text.count(old_listener)}')
text = text.replace(old_listener, new_listener, 1)

path.write_text(text, encoding='utf-8')
print('Corrected early-document harness error and applied canonical Product local-noise filter.')
PY

exec bash .github/tmp/nagornaya_dark_browser_executor.sh run
