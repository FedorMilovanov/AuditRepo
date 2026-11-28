"""W38b: independent sampled glTF actor + external settled basket playback."""
import argparse,json
from pathlib import Path
from probe_w35e_playback import audit,BODY,TUNIC

def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('--time',type=float,required=True);p.add_argument('--folder',type=Path);args=p.parse_args()
    row=audit(args.evidence,0,bilateral=True,sample_time=args.time,handoff=True,handoff_folder=args.folder)
    b=row['basket_layout']
    gate=bool(row['skin_self_total']==row['toe_pairs_below_150mm']==8 and row['tunic_self']==0
              and not any(row['body_clothes'].values()) and not row['other_changed_actor']
              and row['scene']=={'floor':4,'basket':0,'room':0}
              and not row['severe_faces'][BODY] and not set(row['severe_faces'][TUNIC])-{9480,9514,10476,27658,28641,28647}
              and not b['proper_crossings'] and b['table_min_gap_mm']>=-.0001)
    print(json.dumps({'gate':gate,'row':row}),flush=True)
if __name__=='__main__':main()
