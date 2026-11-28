"""Lossless compact archive for append-only W38a/e clips.

The latest complete GLB is the byte source; original headers and exact BIN
prefix lengths are retained. Historical readers verify their original SHA.
"""
import argparse,hashlib,json,struct,zlib
from pathlib import Path
NAME='w38a-handoff.glb'
MANIFEST='w38l-archive.json'
HEADER='w38l-header.zlib'
def sha(b):return hashlib.sha256(b).hexdigest()
def split(b):
    magic,version,total,jlen,jtype=struct.unpack_from('<5I',b)
    assert (magic,version,total,jtype)==(0x46546c67,2,len(b),0x4e4f534a)
    off=20+jlen;blen,btype=struct.unpack_from('<2I',b,off)
    assert btype==0x004e4942 and off+8+blen==len(b)
    return b[:off+8],b[off+8:]
def archived_bytes(path):
    path=Path(path);assert path.name==NAME
    f=path.parent;m=json.loads((f/MANIFEST).read_text())
    assert m['source_folder']=='W38i-gaze-20261128'
    latest=(f.parent/m['source_folder']/NAME).read_bytes()
    assert sha(latest)==m['source_sha256']
    compressed=(f/HEADER).read_bytes();assert sha(compressed)==m['header_sha256']
    head=zlib.decompress(compressed);_,bin1=split(latest)
    raw=head+bin1[:m['original_bin_bytes']]
    assert len(raw)==m['original_bytes'] and sha(raw)==m['original_sha256']
    return raw
def read_glb(path):
    path=Path(path)
    return path.read_bytes() if path.exists() else archived_bytes(path)
def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('--restore',choices=('W38a-handoff-20261128','W38e-wrist-20261128'));p.add_argument('--output',type=Path);args=p.parse_args()
    root=args.evidence
    if args.restore:
        assert args.output is not None and not args.output.exists()
        args.output.write_bytes(read_glb(root/args.restore/NAME));print('RESTORE_SHA_PASS');return
    assert args.output is None
    latest=root/'W38i-gaze-20261128';r=json.loads((latest/'w38a-assembly.json').read_text());q=json.loads((latest/'w38j-gaze-playback.json').read_text())
    assert q['sha256']==r['sha256'] and q['status']=='ART_HOLD_GAZE_SAMPLED_PLAYBACK' and len(q['samples'])==10 and all(z['gate'] for z in q['samples'])
    final=(latest/NAME).read_bytes();assert sha(final)==r['sha256'];_,bin1=split(final)
    prepared=[]
    for folder,expected in [('W38a-handoff-20261128',r['source_clip_sha256']),('W38e-wrist-20261128',r['gaze_source_sha256'])]:
        f=root/folder;raw=(f/NAME).read_bytes();report=json.loads((f/'w38a-assembly.json').read_text());assert sha(raw)==expected==report['sha256']
        head,bin0=split(raw);assert bin1[:len(bin0)]==bin0
        compressed=zlib.compress(head,9)
        m={'source_folder':latest.name,'source_sha256':r['sha256'],'original_sha256':expected,'original_bin_bytes':len(bin0),'original_bytes':len(raw),'header_sha256':sha(compressed)}
        assert not (f/MANIFEST).exists() and not (f/HEADER).exists()
        prepared.append((f,raw,m,compressed))
    for f,raw,m,compressed in prepared:
        (f/HEADER).write_bytes(compressed);(f/MANIFEST).write_text(json.dumps(m,indent=2))
        assert archived_bytes(f/NAME)==raw
    # Both immutable originals have been reconstructed byte for byte.
    saved=0
    for f,raw,m,compressed in prepared:
        (f/NAME).unlink()
        try:
            assert read_glb(f/NAME)==raw
        except Exception:
            (f/NAME).write_bytes(raw);raise
        saved+=len(raw)-(f/HEADER).stat().st_size-(f/MANIFEST).stat().st_size
    print(json.dumps({'status':'LOSSLESS_ARCHIVE_VERIFIED','retained_sha256':r['sha256'],'archived':2,'saved_bytes':saved}),flush=True)
if __name__=='__main__':main()
