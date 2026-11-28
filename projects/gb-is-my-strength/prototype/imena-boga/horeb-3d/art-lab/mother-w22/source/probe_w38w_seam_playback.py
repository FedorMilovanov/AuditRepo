"""W38w: verify exported seam correction at old and fresh interpolation times."""
import argparse,json,subprocess,sys
from pathlib import Path
import numpy as np
def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('folder',type=Path);args=p.parse_args()
 f=args.folder;r=json.loads((f/'w38a-assembly.json').read_text())
 old=json.loads((args.evidence/'W38r-torso-20261128/w38s-playback.json').read_text());assert old['sha256']==r['seam_source_sha256']
 prior=[z['row']['seconds'] for z in old['samples']]
 k=np.linspace(2.,r['torso_keys'][0]['seconds'],17);fresh=[float((a+b)/2) for a,b in zip(k,k[1:])]
 out=f/'w38w-playback.json';assert not out.exists()
 result={'status':'PARTIAL','sha256':r['sha256'],'samples':[]}
 def save():out.write_text(json.dumps(result,indent=2))
 save()
 for kind,t in [('prior',t) for t in prior]+[('fresh',t) for t in fresh]:
  proc=subprocess.run([sys.executable,str(Path(__file__).with_name('probe_w38b_handoff_playback.py')),str(args.evidence),'--folder',str(f),'--time',str(t)],capture_output=True,text=True,timeout=30)
  if proc.returncode:raise RuntimeError(proc.stderr[-1500:])
  z=json.loads(proc.stdout);z['kind']=kind;result['samples'].append(z);save()
  q=z['row'];print(json.dumps({'t':t,'kind':kind,'gate':z['gate'],'scene':q['scene'],'skin':len(q['severe_faces']['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0']),'new_cloth':sorted(set(q['severe_faces']['W28e_tailored_linen'])-{9480,9514,10476,27658,28641,28647})}),flush=True)
 result['status']='ART_HOLD_SPARSE_SEAM_SAMPLED_PLAYBACK';save()
 print('SUMMARY',len(result['samples']),sum(z['gate'] for z in result['samples']),flush=True)
if __name__=='__main__':main()
