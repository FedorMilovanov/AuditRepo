#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path
import tempfile

from check_artifact_admission import artifact_admission_errors

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

print('AUDITREPO ARTIFACT ADMISSION REGRESSION: PASS')
