"""Independent final triangle-gap witness on the actual W36m exported clip."""
import argparse,json
from pathlib import Path
import numpy as np
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry,merged
from probe_w35e_playback import pose,BODY
from probe_w36a_contact_closure import apply_closure
from probe_w36i_triangle_gap import contact_witness,self_test

def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
    root=args.evidence;out=args.output;assert not out.exists();self_test()
    f=root/'W36m-closure-20261128';r=json.loads((f/'w36m-assembly.json').read_text());d,a=load(f/'w36m-approach-closure.glb',r['sha256'])
    orig,oa=load(root/'W35y-bilateral-20261128/w35y-approach.glb',r['approach_sha256'])
    closed,chosen=apply_closure(pose(orig,oa,2.4),root,1.,r['approach_sha256']);ref,_=geometry(closed,oa,True)
    g,_=geometry(pose(d,a,r['duration_s']),a,True);body=g[BODY]
    m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text());h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256']);hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m']);basket=merged([z for z in hg.values() if z['basket']])
    _,first,idx=np.unique(body['canon'],return_index=True,return_inverse=True)
    q=ref[BODY]['v'][first];n=next(n for n in d['nodes'] if n['name']==BODY);at=d['meshes'][n['mesh']]['primitives'][0]['attributes']
    js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=np.array([d['nodes'][i]['name'] for i in d['skins'][n['skin']]['joints']])
    patches=[]
    for side,ids in chosen.items():
        for digit,i in zip(('thumb','index'),ids):
            valid=np.array([name.startswith(digit+'_') and name.endswith('_'+side) for name in jn])
            dist=np.linalg.norm(q-q[idx[i]],axis=1)
            mask=(np.sum(ws[first]*valid[js[first]],axis=1)>.999)&(dist<.012)
            assert mask[idx[i]]
            # Include every fully digit-weighted vertex inside 12mm of each tracked point,
            # even if it was not eligible for the earlier displacement.
            patches.append((side,digit,i,[(int(j),) for j in np.flatnonzero(mask)]))
    rows=contact_witness(body,basket,patches,near_limit=.00005)
    opposition={}
    for side in ('l','r'):
        th=rows[side+'_thumb']['minimum_facing'];ix=rows[side+'_index']['minimum_facing']
        assert th and ix
        dot=float(np.dot(th['rim_normal'],ix['rim_normal']))
        # At a shared rim edge adjacent face normals may differ. Do not infer
        # opposition from a single arbitrary closest-face tie. Enumerate all
        # facing pairs within 50 micrometers and a local 70mm sector.
        centers=basket['v'][basket['tri']].mean(1);pairs=[]
        for a0 in rows[side+'_thumb']['near_facing']:
            for b0 in rows[side+'_index']['near_facing']:
                od=float(np.dot(a0['rim_normal'],b0['rim_normal']))
                sep=float(np.linalg.norm(centers[a0['basket_face']]-centers[b0['basket_face']])*1000)
                if od<=-.75 and sep<=70:
                    pairs.append({'thumb':a0,'index':b0,'dot':od,'centroid_separation_mm':sep,'max_gap_mm':max(a0['distance_mm'],b0['distance_mm'])})
        best=min(pairs,key=lambda q:(q['max_gap_mm'],q['dot'])) if pairs else None
        opposition[side]={'closest_face_dot':dot,'closest_face_angle_deg':float(np.degrees(np.arccos(np.clip(dot,-1,1)))),'opposed_pairs_within_50um':len(pairs),'best_opposed_pair':best}
    result={'status':'ART_HOLD_EXPORTED_MICROGAP_WITNESS','sha256':r['sha256'],'patch_radius_mm':12,'rows':rows,'opposition':opposition,'limitations':['Local incident triangle neighborhoods, conditional on no proper crossings. Not physical contact or pressure.']}
    out.write_text(json.dumps(result,indent=2));print(json.dumps(result),flush=True)
if __name__=='__main__':main()
