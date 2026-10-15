// Byte-neutral NSS version patch, ELF-aware: Chromium's NSS_3.30 requirement -> NSS_3.22
// (the @achingbrain/nss build tops out at NSS_3.22). Run AFTER setup-chrome.mjs.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const BIN = '/tmp/gbchrome/chromium';

function sysvHash (name) {
  let h = 0;
  for (const ch of name) {
    h = ((h << 4) + ch.charCodeAt(0)) >>> 0;
    const g = h & 0xf0000000;
    if (g) { h ^= g >>> 24; h = (h & ~g) >>> 0; }
  }
  return h >>> 0;
}

const elf = readFileSync(BIN);
const shoff = Number(elf.readBigUInt64LE(0x28));
const shentsize = elf.readUInt16LE(0x3a);
const shnum = elf.readUInt16LE(0x3c);
const shstrndx = elf.readUInt16LE(0x3e);
const sh = (i) => {
  const o = shoff + i * shentsize;
  return { name: elf.readUInt32LE(o),
    offset: Number(elf.readBigUInt64LE(o + 0x18)), size: Number(elf.readBigUInt64LE(o + 0x20)) };
};
const strtab = sh(shstrndx);
const secName = (i) => {
  let o = strtab.offset + sh(i).name, s = '';
  while (elf[o] !== 0) s += String.fromCharCode(elf[o++]);
  return s;
};
const sections = {};
for (let i = 0; i < shnum; i++) sections[secName(i)] = sh(i);
const verneed = sections['.gnu.version_r'];
const dynstr = sections['.dynstr'];
const dynstrAt = (off) => {
  let o = dynstr.offset + off, s = '';
  while (elf[o] !== 0) s += String.fromCharCode(elf[o++]);
  return s;
};

// walk Verneed/Vernaux chains for the entry naming NSS_3.30
let vn = verneed.offset;
const found = [];
for (let e = 0; e < 64 && vn < verneed.offset + verneed.size; e++) {
  const file = elf.readUInt32LE(vn + 4);
  const aux = elf.readUInt32LE(vn + 8);
  const next = elf.readUInt32LE(vn + 12);
  let va = vn + aux;
  for (let k = 0; k < 64; k++) {
    const nameOff = elf.readUInt32LE(va + 8);
    const vnext = elf.readUInt32LE(va + 12);
    const name = dynstrAt(nameOff);
    if (name === 'NSS_3.30') found.push({ file: dynstrAt(file), va, hash: elf.readUInt32LE(va), nameOff });
    if (!vnext) break;
    va += vnext;
  }
  if (!next) break;
  vn += next;
}
console.log('NSS_3.30 need entries:', JSON.stringify(found));
if (!found.length) { console.error('NOTHING TO PATCH'); process.exit(1); }

const NEW = 'NSS_3.22';
const newHash = sysvHash(NEW);
for (const f of found) {
  elf.write(NEW, dynstr.offset + f.nameOff, 'latin1');
  elf.writeUInt32LE(newHash, f.va);   // Elf64_Vernaux: vna_hash is Word at offset 0
  console.log(`patched vernaux @0x${f.va.toString(16)} hash 0x${f.hash.toString(16)} -> 0x${newHash.toString(16)}`);
}
writeFileSync(BIN, elf);
console.log(execFileSync('readelf', ['-VW', BIN], { encoding: 'utf8' })
  .split('\n').filter((l) => /NSS_3\.(22|30)/.test(l)).join('\n'));
