"""W38x: retarget lossless W38 archives to the verified sparse seam clip.

All historical GLBs must be exact BIN prefixes of W38v. Verify every
reconstruction before removing either redundant full file.
"""
import argparse,json,zlib
from pathlib import Path
from probe_w38l_archive import NAME,MANIFEST,HEADER,sha,split,read_glb,archived_bytes
from probe_w34l_foot_surface import load

def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);args=p.parse_args()
 root=args.evidence;latest=root/'W38v-seam-20261128';r=json.loads((latest/'w38a-assembly.json').read_text());q=json.loads((latest/'w38w-playback.json').read_text())
 assert q['sha256']==r['sha256'] and q['status']=='ART_HOLD_SPARSE_SEAM_SAMPLED_PLAYBACK' and len(q['samples'])==38 and all(z['gate'] for z in q['samples'])
 final=(latest/NAME).read_bytes();assert sha(final)==r['sha256'];_,bin1=split(final)
 out=latest/'w38x-archive-migration.json';assert not out.exists()
 specs=[('W38a-handoff-20261128','source_clip_sha256',11),('W38e-wrist-20261128','gaze_source_sha256',12),('W38i-gaze-20261128','torso_source_sha256',13),('W38r-torso-20261128','seam_source_sha256',16)]
 prepared=[]
 for folder,key,count in specs:
  f=root/folder;raw=read_glb(f/NAME);report=json.loads((f/'w38a-assembly.json').read_text())
  assert sha(raw)==r[key]==report['sha256']
  head,bin0=split(raw);assert bin1[:len(bin0)]==bin0
  compressed=zlib.compress(head,9)
  manifest={'source_folder':latest.name,'source_sha256':r['sha256'],'original_sha256':report['sha256'],'original_bin_bytes':len(bin0),'original_bytes':len(raw),'header_sha256':sha(compressed)}
  had_full=(f/NAME).exists();old_manifest=(f/MANIFEST).read_bytes() if (f/MANIFEST).exists() else None
  old_header=(f/HEADER).read_bytes() if (f/HEADER).exists() else None
  assert (old_manifest is None)==(old_header is None)
  assert had_full==(old_manifest is None)
  prepared.append((f,manifest,compressed,had_full,old_manifest,old_header,count))
 # Write and check all manifests while both full historical files still exist.
 try:
  for f,m,h,had_full,om,oh,c in prepared:
   (f/HEADER).write_bytes(h);(f/MANIFEST).write_text(json.dumps(m,indent=2))
   raw=archived_bytes(f/NAME);assert sha(raw)==m['original_sha256']
   if had_full:assert raw==(f/NAME).read_bytes()
  # After unlink, common load and exact checks must pass. If any failure,
  # restore original full files using validated new archives before reverting.
  saved=0
  for f,m,h,had_full,om,oh,c in prepared:
   if had_full:
    (f/NAME).unlink()
    saved+=m['original_bytes']-(f/HEADER).stat().st_size-(f/MANIFEST).stat().st_size
   d,a=load(f/NAME,m['original_sha256']);assert len(d['animations'][0]['channels'])==c
   assert not (f/NAME).exists()
 except Exception:
  for f,m,h,had_full,om,oh,c in prepared:
   if had_full and not (f/NAME).exists():(f/NAME).write_bytes(archived_bytes(f/NAME))
  for f,m,h,had_full,om,oh,c in prepared:
   if om is None:
    for pp in (f/MANIFEST,f/HEADER):
     if pp.exists():pp.unlink()
   else:
    (f/MANIFEST).write_bytes(om);(f/HEADER).write_bytes(oh)
  raise
 result={'status':'LOSSLESS_ARCHIVES_MIGRATED','retained_sha256':r['sha256'],'archives':[m for f,m,h,had_full,om,oh,c in prepared],'full_glbs_retired':2,'saved_bytes':saved}
 out.write_text(json.dumps(result,indent=2));print(json.dumps(result),flush=True)
if __name__=='__main__':main()
