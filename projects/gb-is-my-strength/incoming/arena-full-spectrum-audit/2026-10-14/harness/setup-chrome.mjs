// Rebuilds the ephemeral Chromium stack used by the 2026-10-14/15 pass: /tmp/gbchrome + /tmp/nsslib.
// Requires: npm i @sparticuz/chromium @achingbrain/nss  (run from the harness directory).
import { mkdirSync, copyFileSync, readdirSync, writeFileSync, chmodSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import chromium from '@sparticuz/chromium';

const GB = '/tmp/gbchrome';
const NSS_SRC = '/home/user/arena-harness/node_modules/@achingbrain/nss/linux';
mkdirSync(GB, { recursive: true });
mkdirSync('/tmp/nsslib', { recursive: true });

// 1. Chromium binary (the npm tarball extracts it to /tmp/chromium)
const src = await chromium.executablePath();
console.log('executablePath ->', src);
copyFileSync(src, GB + '/chromium');
chmodSync(GB + '/chromium', 0o755);

// 2. NSS/NSPR shared objects
for (const f of readdirSync(NSS_SRC)) {
  if (/\.so(\.\d+)*$/.test(f)) {
    copyFileSync(`${NSS_SRC}/${f}`, `/tmp/nsslib/${f}`);
    try { chmodSync(`/tmp/nsslib/${f}`, 0o755); } catch {}
  }
}
console.log('nss libs ->', readdirSync('/tmp/nsslib').length);

// 3. PK11_HasAttributeSet stub pinned to the NSS_3.22 version node
mkdirSync(GB + '/stub', { recursive: true });
writeFileSync(GB + '/stub/pk11stub.c', `#include <stdint.h>
typedef int PRBool; typedef int SECStatus; typedef uint32_t CK_ATTRIBUTE_TYPE;
#define SECSuccess 0
SECStatus PK11_HasAttributeSet (void *slot, CK_ATTRIBUTE_TYPE type, PRBool has, PRBool *result) {
  (void) slot; (void) type; (void) has;
  if (result) *result = 0;
  return SECSuccess;
}
`);
writeFileSync(GB + '/stub/ver.map', 'NSS_3.22 {\n  global: PK11_HasAttributeSet;\n  local: *;\n};\n');
execFileSync('gcc', ['-shared', '-fPIC', '-O1', '-o', GB + '/libpk11stub.so', GB + '/stub/pk11stub.c',
  '-Wl,--version-script=' + GB + '/stub/ver.map']);

// 4. launcher
writeFileSync(GB + '/chrome.sh', `#!/bin/sh
export LD_LIBRARY_PATH=/tmp/nsslib:${GB}
export LD_PRELOAD=${GB}/libpk11stub.so
exec ${GB}/chromium --no-sandbox --disable-dev-shm-usage "$@"
`);
chmodSync(GB + '/chrome.sh', 0o755);
console.log('OK — now run patch-nss.mjs, then: LD_LIBRARY_PATH=/tmp/nsslib:/tmp/gbchrome LD_PRELOAD=/tmp/gbchrome/libpk11stub.so /tmp/gbchrome/chromium --version');
