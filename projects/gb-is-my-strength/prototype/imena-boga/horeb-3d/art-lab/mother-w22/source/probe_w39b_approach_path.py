"""W39b: sampled right-hand approach keys into the W38v asymmetric tilt.

The left hand remains parked; the basket is stationary during this prefix.
No claim of a full walk-in, grasp force or continuous certification.
"""
import argparse,json,subprocess,sys,tempfile
from pathlib import Path
import numpy as np
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry,merged
from probe_w35e_playback import pose,BODY
from probe_w35i_rim_contact import closest

def states():
    return [[60,y,0] for y in range(40,0,-10)]+[[x,0,0] for x in range(60,-1,-10)]

def options(offset):
    return ['--distance','0','--open-grip','--multidigit','--underside','20','--asymmetric','--retreat-direction','out','--park-area-ramp','--handoff-park','--handoff-angle','0','--handoff-retreat','80','--park-stance','80','--park-right-pole','60','--park-right-upper','-40','--right-approach-out',str(offset[0]),'--right-approach-up',str(offset[1]),'--right-approach-back',str(offset[2])]

def gate(v):
    return bool(v and v['crossings']==v['bind_strain'][BODY]['severe']==v['bind_strain']['W28e_tailored_linen']['new']==v['full_scene']['basket']==v['full_scene']['room']==v['full_scene']['below_floor_half_mm']==0)

def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);args=p.parse_args()
    root=args.evidence;out=root/'W39b-approach-path-20261128.json';assert not out.exists()
    base=root/'W38v-seam-20261128';r=json.loads((base/'w38a-assembly.json').read_text());d,a=load(base/'w38a-handoff.glb',r['sha256'])
    g,w=geometry(pose(d,a,0),a,True)
    result={'status':'PARTIAL','source_sha256':r['sha256'],'samples':[]}
    def save():out.write_text(json.dumps(result,indent=2))
    save()
    with tempfile.TemporaryDirectory(prefix='w39b-trials-',dir=root) as tmp:
        for i,offset in enumerate(states()):
            f=Path(tmp)/str(i)
            cmd=[sys.executable,str(Path(__file__).with_name('probe_w34zg_arm_reconnect.py')),str(root),str(f)]+options(offset)
            if i in (0,len(states())-1):cmd+=['--handoff-key-export']
            proc=subprocess.run(cmd,capture_output=True,text=True,timeout=30)
            if proc.returncode:
                result['samples'].append({'offset_mm':offset,'gate':False,'error':proc.stderr[-1500:]});save();print('FAILED',i,proc.stderr[-300:],flush=True);continue
            q=json.loads((f/'w37g-asymmetric.json').read_text());v=q['best']
            row={'offset_mm':offset,'gate':gate(v),'report':q}
            if i in (0,len(states())-1):
                ex=json.loads((f/'handoff-key.json').read_text());dd,aa=load(f/'handoff-key.glb',ex['export']['sha256']);gg,ww=geometry(dd,aa,True)
                if i==len(states())-1:
                    result['boundary_max_error_m']=max(float(np.max(abs(g[k]['v']-gg[k]['v']))) for k in g)
                    result['boundary_matrix_error']=max(float(np.max(abs(w[j]-ww[j]))) for j in ww)
                    result['boundary_gate']=result['boundary_max_error_m']<1e-6 and result['boundary_matrix_error']<1e-6
                else:
                    h,ha=load(root/'W28-house-20261125/w28-house.glb',r['house_sha256']);hg,_=geometry(h,ha,drop=r['settle_delta_m']);M=w[r['basket_track_node']]
                    b=merged([dict(z,v=z['v']@M[:3,:3].T+M[:3,3]) for z in hg.values() if z['basket']]);tri=b['v'][b['tri']]
                    n=next(n for n in dd['nodes'] if n['name']==BODY);at=dd['meshes'][n['mesh']]['primitives'][0]['attributes'];js=aa(at['JOINTS_0']);ws=aa(at['WEIGHTS_0']);jn=np.array([dd['nodes'][j]['name'] for j in dd['skins'][n['skin']]['joints']])
                    valid=np.array([k.endswith('_r') and k.startswith(('hand_','thumb_','index_','middle_','ring_','pinky_')) for k in jn]);body=gg[BODY];_,first=np.unique(body['canon'],return_index=True);ids=first[np.sum(ws[first]*valid[js[first]],axis=1)>.999]
                    lo=tri.min(axis=(0,1));hi=tri.max(axis=(0,1));gap=np.inf
                    for j in ids:
                        x=body['v'][j]
                        if np.linalg.norm(np.maximum(0,np.maximum(lo-x,x-hi)))>gap:continue
                        gap=min(gap,closest(x,tri)[0])
                    result['initial_right_min_vertex_gap_mm']=float(gap*1000);result['initial_right_vertices']=len(ids)
            result['samples'].append(row);save()
            print(json.dumps({'offset':offset,'gate':row['gate'],'cross':v['crossings'] if v else None,'skin':v['bind_strain'][BODY]['severe'] if v else None,'cloth':v['bind_strain']['W28e_tailored_linen']['new'] if v else None}),flush=True)
    result['status']='ART_HOLD_RIGHT_APPROACH_SAMPLED';save()
    print('SUMMARY',len(result['samples']),sum(z['gate'] for z in result['samples']),result.get('boundary_gate'),result.get('initial_right_min_vertex_gap_mm'),flush=True)
if __name__=='__main__':main()
