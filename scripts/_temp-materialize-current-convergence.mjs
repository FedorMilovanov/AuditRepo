#!/usr/bin/env node
import fs from 'node:fs';

const path = 'projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md';
let text = fs.readFileSync(path, 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function replaceLine(prefix, replacement) {
  const lines = text.split('\n');
  const indices = lines.map((line, index) => line.startsWith(prefix) ? index : -1).filter((index) => index >= 0);
  assert(indices.length === 1, `${prefix}: expected exactly one line, found ${indices.length}`);
  lines[indices[0]] = replacement;
  text = lines.join('\n');
}

function replaceHeading(pattern, delta, expectedLabel) {
  const matches = [...text.matchAll(pattern)];
  assert(matches.length === 1, `${expectedLabel}: expected one heading, found ${matches.length}`);
  const current = Number(matches[0][1]);
  assert(Number.isInteger(current), `${expectedLabel}: invalid count`);
  text = text.replace(matches[0][0], matches[0][0].replace(`(${current})`, `(${current + delta})`));
}

function insertRowsAfterHeading(headingPattern, rows, idLabel) {
  for (const row of rows) assert(!text.includes(`| ${row.id} |`), `${idLabel}: duplicate ${row.id}`);
  const heading = text.match(headingPattern);
  assert(heading, `${idLabel}: heading missing`);
  const start = heading.index + heading[0].length;
  const tail = text.slice(start);
  const tableHeader = '| ID | Описание |';
  const headerIndex = tail.indexOf(tableHeader);
  assert(headerIndex >= 0, `${idLabel}: table header missing`);
  const separatorIndex = tail.indexOf('\n|---', headerIndex);
  assert(separatorIndex >= 0, `${idLabel}: table separator missing`);
  const insertAt = start + separatorIndex + tail.slice(separatorIndex).indexOf('\n') + 1;
  const payload = rows.map((row) => `| ${row.id} | ${row.description} | ${row.witness} |`).join('\n') + '\n';
  text = text.slice(0, insertAt) + payload + text.slice(insertAt);
}

replaceLine(
  '| Source HEAD |',
  '| Source HEAD | `d94b54889e4f5f0330adaf2b9947e59af4aee7e4` (current source main; merged PDF convergence PR #283 after the TTS/deploy/editorial sequence; duplicate print ownership removed) |',
);
replaceLine(
  '| Deploy |',
  '| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Last fully imported exact production witness remains `8a535267`; newer candidate `ddcf7153` has permanent post-deploy TTS verification in source, but exact readiness/Pages/live-artifact IDs are not yet imported into AuditRepo. Current source `d94b5488` is not claimed deployed here. |',
);
replaceLine(
  '| Last reverify |',
  '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_d94b5488_multiagent-convergence.md` |',
);
replaceLine(
  '⚠️ Старые deploy-формулировки',
  '⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `d94b5488`; last fully imported exact production witness: `8a535267`; newer production candidate requiring evidence import: `ddcf7153`; source/orchestration evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_d94b5488_multiagent-convergence.md`.',
);

replaceHeading(/## ✅ ЗАКРЫТО \((\d+)\)/g, 2, 'closed heading');
insertRowsAfterHeading(/## ✅ ЗАКРЫТО \(\d+\)/, [
  {
    id: 'AUDIT-SSOT-CURRENT-HEAD-DRIFT',
    description: '✅ **FIXED/SOURCE GOVERNANCE VERIFIED 2026-07-25.** AuditRepo no longer points agents at `184d7ed1` and obsolete map-first PR ownership. `NEXT_AGENT_PROMPT.md`, matrix masthead and immutable reverify/convergence reports now own `main@d94b5488`, current PR boundaries and the explicit production-evidence gap.',
    witness: '`d94b5488` source + current AuditRepo convergence PR',
  },
  {
    id: 'ORCH-DUPLICATE-PRINT-SURFACE-OWNERS',
    description: '✅ **FIXED 2026-07-25.** PR #283 became the sole PDF product owner and merged as `d94b5488`; PR #280 was closed without merge as superseded. Test-only PR #286 owns only the missing physical front/back evidence and changes no product CSS/JS.',
    witness: 'PR #283 merged; PR #280 closed; PR #286 bounded',
  },
], 'closed convergence rows');

replaceHeading(/## 🟠 P1 — ОТКРЫТО \((\d+)\)/g, 6, 'P1 heading');
insertRowsAfterHeading(/## 🟠 P1 — ОТКРЫТО \(\d+\)/, [
  {
    id: 'CI-ALERT-NO-RECOVERY-STATE',
    description: 'Failure notifier has no exact-head recovery/superseded state, can leave stale failure issues open after green recovery, does not reliably download diagnostic artifacts and may present workflow-name heuristics as root cause.',
    witness: 'forensic delta 2026-07-25; notify-on-failure lifecycle',
  },
  {
    id: 'CI-BUILD-VALIDATION-DUPLICATION',
    description: 'Readiness and deploy repeat dependency installation, production-like build and overlapping full/light validation instead of promoting one verified immutable artifact.',
    witness: 'workflow/control-plane forensic 2026-07-25',
  },
  {
    id: 'DEPLOY-PROVENANCE-TTS-COUPLING',
    description: 'PR #284 uses generic deployment-provenance naming/path but its schema and ownership are TTS-specific. Generic repository/commit/workflow/artifact/build/routes/assets identity must be separated from `extensions.tts` before merge.',
    witness: 'open draft PR #284',
  },
  {
    id: 'CI-WORKFLOW-PROLIFERATION',
    description: 'Control plane expanded from the earlier 19-workflow baseline to roughly 26 permanent workflows with repeated heavy setup/build/test sections. Capability inventory and convergence are required before adding workflows.',
    witness: 'current control-plane artifacts; forensic delta 2026-07-25',
  },
  {
    id: 'WORKFLOW-POLICY-SHADOW-ERA',
    description: 'Workflow policy still protects historical shadow/route names and hardcoded dist paths instead of effective-route-registry coverage, capability gates, read-only validation and permission contracts.',
    witness: 'existing source issue #64',
  },
  {
    id: 'AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP',
    description: 'AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, deployment and live-contract artifact identifiers for newer candidate `ddcf7153` are imported and reconciled.',
    witness: '`ddcf7153` production candidate; evidence import pending',
  },
], 'P1 convergence rows');

const p2HeadingPattern = /##[^\n]*P2[^\n]*ОТКРЫТО \((\d+)\)/g;
replaceHeading(p2HeadingPattern, 2, 'P2 heading');
insertRowsAfterHeading(/##[^\n]*P2[^\n]*ОТКРЫТО \(\d+\)/, [
  {
    id: 'GENESIS6-ACTIVATION-OWNER-GAP',
    description: 'Canonical Genesis 6 MDX/images are landed as intentional draft/noindex content, but no active five-route activation owner exists. Snapshots may not remain independent workstreams.',
    witness: 'PR #285 closed/reset; no active activation PR',
  },
  {
    id: 'RESEARCH-AUTHORITY-MANIFEST-MISSING',
    description: 'Research supersession/authority remains prose-only. A machine-readable manifest must govern document scope, supersedes, canonical authority, source grade, rights status and pinned source commit.',
    witness: 'Research forensic review 2026-07-25',
  },
], 'P2 convergence rows');

const sessionMarker = '### 2026-07-25 — d94b5488 multi-agent convergence';
assert(!text.includes(sessionMarker), 'session marker already present');
text = text.replace(/\s+$/, '') + `\n\n${sessionMarker}\n\n- Source authority advanced from \`184d7ed1\` to \`d94b5488\`.\n- Duplicate PDF ownership closed through merged #283 and superseded #280.\n- Stale Genesis snapshot #285 closed/reset; no activation owner exists.\n- Current active source PRs recorded as #284 and #286.\n- Production authority remains fail-closed pending exact evidence import for \`ddcf7153\`.\n- Added notifier, build-once, workflow proliferation, provenance coupling and Research authority findings.\n`;

fs.writeFileSync(path, text, 'utf8');
console.log(JSON.stringify({ path, bytes: Buffer.byteLength(text), source: 'd94b5488', closedAdded: 2, p1Added: 6, p2Added: 2 }, null, 2));
