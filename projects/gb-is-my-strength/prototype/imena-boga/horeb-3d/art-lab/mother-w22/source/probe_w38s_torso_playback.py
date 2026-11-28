"""Audit actual W38r lateral interpolation, including the first blend seam."""
import argparse,json,subprocess,sys
from pathlib import Path
def main():
 p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('folder',type=Path);args=p.parse_args()
 f=args.folder;r=json.loads((f/'w38a-assembly.json').read_text())
 out=f/'w38s-playback.json';assert not out.exists()
 keys=[2.]+[z['seconds'] for z in r['torso_keys']]
 assert len(keys)==17
 times=sorted(set([2.,float(r['duration_s'])]+[(a+b)/2 for a,b in zip(keys,keys[1:])]+[keys[0]+(keys[1]-keys[0])*q for q in (.125,.25,.75,.875)]))
 result={'status':'PARTIAL','sha256':r['sha256'],'samples':[]}
 def save():out.write_text(json.dumps(result,indent=2))
 save()
 for t in times:
  proc=subprocess.run([sys.executable,str(Path(__file__).with_name('probe_w38b_handoff_playback.py')),str(args.evidence),'--folder',str(f),'--time',str(t)],capture_output=True,text=True,timeout=30)
  if proc.returncode:raise RuntimeError(proc.stderr[-1500:])
  z=json.loads(proc.stdout);result['samples'].append(z);save()
  q=z['row'];print(json.dumps({'t':t,'gate':z['gate'],'non_toe':q['skin_self_total']-q['toe_pairs_below_150mm'],'cloth':q['tunic_self'],'scene':q['scene'],'skin':len(q['severe_faces']['ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0']),'new_cloth':sorted(set(q['severe_faces']['W28e_tailored_linen'])-{9480,9514,10476,27658,28641,28647})}),flush=True)
 result['status']='ART_HOLD_TORSO_SAMPLED_PLAYBACK';save()
 print('SUMMARY',len(result['samples']),sum(z['gate'] for z in result['samples']),flush=True)
if __name__=='__main__':main()
