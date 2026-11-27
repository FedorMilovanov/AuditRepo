#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path
import tempfile
import subprocess

from check_artifact_admission import artifact_admission_errors, capture_changed_paths, read_changed_paths

with tempfile.TemporaryDirectory(prefix='auditrepo-artifacts-') as temp:
    root = Path(temp)
    (root / 'evidence').mkdir()
    original = root / 'evidence/original.png'
    duplicate = root / 'evidence/copy.png'
    original.write_bytes(b'png fixture')
    duplicate.write_bytes(original.read_bytes())
    errors = artifact_admission_errors(
        root,
        ['evidence/copy.png'],
        ['evidence/original.png', 'evidence/copy.png'],
    )
    assert any('exact artifact duplicate' in error for error in errors)

    archive = root / 'evidence/package.zip'
    archive.write_bytes(b'unique archive fixture')
    errors = artifact_admission_errors(root, ['evidence/package.zip'], ['evidence/package.zip'])
    assert any('requires sidecar' in error for error in errors)

    payload = archive.read_bytes()
    sidecar = root / 'evidence/package.zip.artifact.json'
    sidecar.write_text(json.dumps({
        'schemaVersion': 1,
        'path': 'evidence/package.zip',
        'sha256': hashlib.sha256(payload).hexdigest(),
        'sizeBytes': len(payload),
        'purpose': 'regression fixture',
        'provenance': 'generated locally',
        'retention': 'test only',
    }), encoding='utf-8')
    assert artifact_admission_errors(root, ['evidence/package.zip'], ['evidence/package.zip']) == []

    # Sidecar-only mutations must not bypass admission for a retained archive.
    sidecar_rel = 'evidence/package.zip.artifact.json'
    archive_rel = 'evidence/package.zip'
    valid_manifest = sidecar.read_text(encoding='utf-8')
    tracked = [archive_rel, sidecar_rel]
    assert artifact_admission_errors(root, [sidecar_rel], tracked) == []

    sidecar.unlink()
    assert any('requires sidecar' in error for error in
               artifact_admission_errors(root, [sidecar_rel], [archive_rel]))
    # No retrospective failure when neither the artifact nor its sidecar changed.
    assert artifact_admission_errors(root, [], [archive_rel]) == []

    sidecar.write_text(valid_manifest.replace(hashlib.sha256(payload).hexdigest(), '0' * 64), encoding='utf-8')
    assert any('identity does not match' in error for error in
               artifact_admission_errors(root, [sidecar_rel], tracked))
    sidecar.write_text('[]', encoding='utf-8')
    assert any('JSON object' in error for error in
               artifact_admission_errors(root, [sidecar_rel], tracked))
    sidecar.write_bytes(b'\xff')
    assert any('invalid artifact sidecar' in error for error in
               artifact_admission_errors(root, [sidecar_rel], tracked))
    sidecar.write_text(valid_manifest, encoding='utf-8')
    assert artifact_admission_errors(root, [sidecar_rel], tracked) == []

    # Removing both files is not an admission of a surviving artifact.
    archive.unlink()
    sidecar.unlink()
    assert artifact_admission_errors(root, [archive_rel, sidecar_rel], []) == []

    spaced = root / 'evidence/bad name.webp'
    spaced.write_bytes(b'unique image fixture')
    errors = artifact_admission_errors(root, ['evidence/bad name.webp'], ['evidence/bad name.webp'])
    assert any('must not contain whitespace' in error for error in errors)

# Exercise the exact Git capture used by the workflow, not a synthetic list.
with tempfile.TemporaryDirectory(prefix='auditrepo-git-paths-') as temp:
    root = Path(temp)
    repo = root / 'repo'
    repo.mkdir()
    output = root / 'changed.txt'

    def git(*args):
        return subprocess.check_output(['git', '-c', 'user.name=fixture',
                                        '-c', 'user.email=fixture@example.invalid',
                                        *args], cwd=repo)

    git('init', '-q')
    (repo / 'initial.md').write_text('root', encoding='utf-8')
    git('add', '.')
    git('commit', '-qm', 'initial')
    capture_changed_paths(repo, output)
    assert read_changed_paths(output) == ['initial.md']

    archive_rel = 'архив.zip'
    archive = repo / archive_rel
    archive.write_bytes(b'archive fixture')
    spaced_rel = ' leading.png'
    (repo / spaced_rel).write_bytes(b'image fixture')
    git('add', '.')
    git('commit', '-qm', 'literal paths')
    capture_changed_paths(repo, output)
    changed = read_changed_paths(output)
    assert set(changed) == {archive_rel, spaced_rel}
    errors = artifact_admission_errors(repo, changed, changed)
    assert any(archive_rel in error and 'requires sidecar' in error for error in errors)
    assert any(spaced_rel in error and 'whitespace' in error for error in errors)

    old_rel = archive_rel + '.artifact.json'
    new_rel = 'renamed.artifact.json'
    (repo / old_rel).write_text(json.dumps({
        'schemaVersion': 1, 'path': archive_rel,
        'sha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
        'sizeBytes': archive.stat().st_size,
        'purpose': 'fixture', 'provenance': 'fixture', 'retention': 'fixture',
    }), encoding='utf-8')
    git('add', '.')
    git('commit', '-qm', 'manifest')
    (repo / old_rel).rename(repo / new_rel)
    git('add', '-A')
    git('commit', '-qm', 'rename manifest')
    capture_changed_paths(repo, output)
    changed = read_changed_paths(output)
    assert set(changed) == {old_rel, new_rel}
    assert any(archive_rel in error and 'requires sidecar' in error for error in
               artifact_admission_errors(repo, changed, [archive_rel, new_rel]))

    # A line-oriented consumer cannot represent this path without ambiguity.
    # This fixture is valid on the Linux CI host, not on Windows.
    import os
    if os.name != 'nt':
        (repo / 'bad\nname.md').write_text('fixture', encoding='utf-8')
        git('add', '.')
        git('commit', '-qm', 'unrepresentable path')
        try:
            capture_changed_paths(repo, output)
        except ValueError as error:
            assert 'line separator' in str(error)
        else:
            raise AssertionError('unrepresentable Git path silently accepted')

print('AUDITREPO ARTIFACT ADMISSION REGRESSION: PASS')
