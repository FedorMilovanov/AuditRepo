#!/usr/bin/env python3
"""Verify Draft #570's raw traces; optionally restore them into a new directory."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import re
import zipfile

INCOMING = 'projects/gb-is-my-strength/incoming'
PACKAGE = Path(__file__).resolve().parent.parent
ROOT = PACKAGE.parents[4]
ARCHIVE = PACKAGE / 'evidence/browser-traces.zip'
MEMBER = re.compile(rf'{INCOMING}/arena-quiz-[a-z0-9-]+/2026-11-18/evidence/[a-z0-9-]+\.(?:json|png)')
PRINT = f'{INCOMING}/arena-quiz-print-readiness/2026-11-18/evidence/print-tail-witness.json'
PRINT_PINS = PACKAGE.parent.parent / 'arena-quiz-native-print/2026-11-18/evidence/article-dist-pins.json'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def verify():
    meta = json.loads(ARCHIVE.with_name(ARCHIVE.name + '.artifact.json').read_bytes())
    payload = ARCHIVE.read_bytes()
    require(meta['schemaVersion'] == 1 and meta['path'] == ARCHIVE.relative_to(ROOT).as_posix()
            and len(payload) == meta['sizeBytes'] and sha(payload) == meta['sha256'], 'archive identity mismatch')
    expected = meta['members']
    files = {}
    with zipfile.ZipFile(io.BytesIO(payload)) as source:
        names = source.namelist()
        require(len(names) == len(expected) and set(names) == expected.keys(),
                'unexpected, duplicated or missing archive path')
        for item in source.infolist():
            name = item.filename
            require(MEMBER.fullmatch(name), f'invalid member path: {name}')
            record = expected[name]
            require(item.file_size == record['sizeBytes'], f'wrong size: {name}')
            data = source.read(item)
            require(len(data) == item.file_size and sha(data) == record['sha256'], f'wrong bytes: {name}')
            files[name] = data
    print_source = json.loads(files[PRINT])
    require(json.loads(PRINT_PINS.read_bytes()) == {
        'anchor': print_source['anchor'], 'distSha256': print_source['assets']['main']['distSha256'],
        'sourceWitnessSha256': expected[PRINT]['sha256'],
    }, 'native print startup pins differ from the archived witness')
    return files


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--restore', type=Path, metavar='NEW_DIR', help='create a new directory outside the checkout')
    args = parser.parse_args()
    try:
        files = verify()
        if args.restore is not None:
            target = args.restore.resolve()
            require(ROOT not in (*target.parents, target), 'restore outside the checkout')
            args.restore.mkdir()  # Refuse an existing directory or symlink; do not overwrite anything.
            for name, data in files.items():
                path = args.restore / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(data)
        print(f'PASS: {len(files)} archived files ({sum(map(len, files.values()))} bytes), including the print pin source')
    except (OSError, ValueError, KeyError, TypeError, zipfile.BadZipFile) as exc:
        parser.exit(1, f'Evidence verification failed: {exc}\n')


if __name__ == '__main__':
    main()
