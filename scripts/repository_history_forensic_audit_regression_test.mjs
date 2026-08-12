#!/usr/bin/env node
import assert from 'node:assert/strict';

import {
  STRICT_ZERO_SUMMARY_KEYS,
  reconcileBranch,
  strictSummaryProblems,
} from './repository_history_forensic_audit.mjs';

const zeroSummary = Object.fromEntries(STRICT_ZERO_SUMMARY_KEYS.map((key) => [key, 0]));
assert.deepEqual(strictSummaryProblems(zeroSummary), []);

for (const key of STRICT_ZERO_SUMMARY_KEYS) {
  const nonzero = { ...zeroSummary, [key]: 1 };
  const failures = strictSummaryProblems(nonzero);
  assert.equal(failures.length, 1, `${key}=1 must create exactly one strict failure`);
  assert.match(failures[0], new RegExp(`${key}=0; observed 1`));
}

for (const invalid of [undefined, -1, 0.5, '0']) {
  const malformed = { ...zeroSummary, inaccessibleClosedHeads: invalid };
  const failures = strictSummaryProblems(malformed);
  assert.equal(failures.length, 1, `invalid summary value ${String(invalid)} must fail`);
  assert.match(failures[0], /must be a non-negative integer/);
}

const preservedSha = '1'.repeat(40);
const archiveRef = 'origin/archive/forensic-example-2026-08-13';
const archivedRefsBySha = new Map([[preservedSha, [archiveRef]]]);
const orphan = {
  name: 'origin/arena/example',
  sha: preservedSha,
  subject: 'evidence branch',
  mergedIntoMain: false,
  associatedPrs: [],
};

assert.deepEqual(reconcileBranch(orphan, archivedRefsBySha), {
  reconciliation: 'archived-source-ref',
  archiveRefs: [archiveRef],
});
assert.deepEqual(reconcileBranch({ ...orphan, name: archiveRef }, archivedRefsBySha), {
  reconciliation: 'archived-recovery-branch',
  archiveRefs: [],
});
assert.deepEqual(reconcileBranch(orphan, new Map()), {
  reconciliation: 'orphan-branch',
  archiveRefs: [],
});
assert.deepEqual(reconcileBranch({ ...orphan, sha: '2'.repeat(40) }, archivedRefsBySha), {
  reconciliation: 'orphan-branch',
  archiveRefs: [],
});

console.log('AUDITREPO HISTORY FORENSIC REGRESSION: PASS');
