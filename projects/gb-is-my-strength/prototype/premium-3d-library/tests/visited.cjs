const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const assert = require('node:assert/strict');

(async () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/visited.ts'), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
  });
  assert.equal(compiled.diagnostics?.length, 0);
  const { parseVisited, decodeVisitedRecord, appendVisitedRecord } = await import('data:text/javascript;base64,' +
    Buffer.from(compiled.outputText).toString('base64'));
  const known = ['articles', 'series', 'maps'];
  const valid = JSON.stringify(['series', 'articles', 'series', 'legacy-id', 'maps']);
  assert.deepEqual(parseVisited(valid, known), ['series', 'articles', 'maps']);
  assert.deepEqual(parseVisited('[]', known), []);
  for (const invalid of [
    null, '', 'invalid-json', 'null', '{}', '24', 'true', '"articles"',
    '["articles", 17]', '["articles", null]', '["articles", {}]',
    '["articles", ""]', '["articles", "' + 'x'.repeat(158) + '"]',
    JSON.stringify(Array(257).fill('articles')),
    '[' + ' '.repeat(16390) + ']',
  ]) {
    assert.deepEqual(parseVisited(invalid, known), [],
      'Invalid persisted visit history incorrectly accepted: ' + String(invalid).slice(0, 60));
    if (invalid === null) assert.deepEqual(decodeVisitedRecord(invalid), []);
    else assert.equal(decodeVisitedRecord(invalid), null,
      'Invalid record not rejected for preservation');
  }
  // An unknown former-edition visit ID must not crash the current scene.
  assert.deepEqual(parseVisited('["retired-section", "articles"]', known), ['articles']);
  assert.deepEqual(decodeVisitedRecord('["retired-section","articles"]'),
    ['retired-section','articles'], 'Valid legacy IDs should survive read/merge');
  assert.deepEqual(decodeVisitedRecord('["articles","series"]'),
    ['articles','series'], 'Valid history should round-trip exactly');
  assert.equal(appendVisitedRecord('null', 'articles'), null,
    'A corrupted record must not be replaced on the next station visit');
  assert.equal(appendVisitedRecord('{}', 'articles'), null,
    'Malformed history must stay available for recovery');
  assert.equal(appendVisitedRecord('["retired-section","articles"]', 'series'),
    '["retired-section","articles","series"]',
    'A new visit must preserve valid historic/unknown IDs');
  assert.equal(appendVisitedRecord(null, 'articles'), '["articles"]');
  assert.equal(appendVisitedRecord('["articles","articles"]', 'articles'),
    '["articles"]');
  assert.equal(appendVisitedRecord(JSON.stringify(Array(256).fill("legacy")), 'series'),
    '["legacy","series"]', 'Existing duplicates should be deduplicated');
  assert.equal(appendVisitedRecord(JSON.stringify(Array.from({length:256}, (_,i)=>"old-"+i)), "articles"),
    null, 'Cannot overflow bounded storage');

  // The function is pure, has no storage access and never overwrites raw data.
  console.log('PASS: visit history parser strict shape/size, duplicate/legacy ID and malformed JSON safeguards');
})().catch(e => { console.error(e); process.exitCode = 1; });
