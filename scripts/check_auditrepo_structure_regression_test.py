#!/usr/bin/env python3
from pathlib import Path
import tempfile

from check_auditrepo_structure import PROJECT_REQUIRED, structure_errors

with tempfile.TemporaryDirectory(prefix='auditrepo-structure-') as temp:
    root = Path(temp)
    (root / 'README.md').touch()
    (root / 'PROJECT_REGISTRY.md').touch()
    project = root / 'projects' / 'fixture'
    for rel in PROJECT_REQUIRED:
        path = project / rel
        if Path(rel).suffix:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.touch()
        else:
            path.mkdir(parents=True, exist_ok=True)

    assert structure_errors(root) == []
    (project / 'DOC_MAP.md').unlink()
    assert any('missing DOC_MAP.md' in error for error in structure_errors(root))

print('AUDITREPO STRUCTURE REGRESSION: PASS')
