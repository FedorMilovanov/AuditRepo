"""W36r: compare actual finger silhouettes and distal distances, no export."""
import argparse,copy,hashlib,json
from pathlib import Path
import numpy as np
from scipy.spatial import cKDTree
from PIL import Image,ImageDraw
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry,merged,point_triangle_min
from probe_w35e_playback import pose,BODY
from probe_w35f_depth_review import prepare,render

def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path);p.add_argument('output',type=Path);p.add_argument('--reverse',action='store_true');args=p.parse_args()
    root=args.evidence;out=args.output;assert not out.exists()
    f=root/'W36m-closure-20261128';r=json.loads((f/'w36m-assembly.json').read_text());d,a=load(f/'w36m-approach-closure.glb',r['sha256']);d=pose(d,a,3.15);g,w=geometry(d,a,True)
    report=root/('W36s-reverse-wrap-20261128.json' if args.reverse else 'W36q-wrap-20261128.json')
    q=json.loads(report.read_text()) if report.exists() else json.loads((root/'W36q-s-wrap-20261128/w36q-s-wrap.json').read_text())['reverse_screen' if args.reverse else 'forward_screen']
    assert q['source_sha256']==r['sha256']
    m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text());h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256']);hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m'])
    basket=merged([z for z in hg.values() if z['basket']]);bt=basket['v'][basket['tri']]
    c=bt.mean(1);rad=np.linalg.norm(bt-c[:,None],axis=2).max(1);tree=cKDTree(c)
    def nearest(pt):
        _,j=tree.query(pt,workers=1)
        ub=point_triangle_min(pt,bt[j:j+1]);jj=np.array(tree.query_ball_point(pt,ub+rad.max()+1e-10,workers=1),int)
        jj=jj[np.linalg.norm(c[jj]-pt,axis=1)-rad[jj]<=ub+1e-10]
        return point_triangle_min(pt,bt[jj])
    names={n['name']:i for i,n in enumerate(d['nodes'])}
    n=d['nodes'][names[BODY]];at=d['meshes'][n['mesh']]['primitives'][0]['attributes'];js=a(at['JOINTS_0']);ws=a(at['WEIGHTS_0']);jn=[d['nodes'][i]['name'] for i in d['skins'][n['skin']]['joints']]
    cases=[{'angles_deg':{},'rotations':{}}]+[z for z in q['rows'] if len(z['angles_deg'])==3 and z['gate']]
    W,H=360,265;sheet=Image.new('RGB',(W*len(cases),2*(H+18)),(25,28,32));draw=ImageDraw.Draw(sheet);rows=[]
    for col,case in enumerate(cases):
        doc=dict(d,nodes=copy.deepcopy(d['nodes']))
        for key,val in case['rotations'].items():doc['nodes'][names[key]]['rotation']=val
        gg,ww=geometry(doc,a,True);prepared=prepare(gg,hg);metrics={}
        for row,(side,sign) in enumerate((('l',-1),('r',1))):
            wrist=ww[names['hand_'+side]][:3,3];knuckle=ww[names['middle_01_'+side]][:3,3];center=(wrist+knuckle)*.5
            draw.text((col*W+7,row*(H+18)+3),f"{case['angles_deg'].get('middle',0):g} deg | {side.upper()}",fill=(235,235,235))
            sheet.paste(render(prepared,center,[sign,.75,.7],.28,W,H),(col*W,row*(H+18)+18))
            for digit in ('middle','ring','pinky'):
                jid=jn.index(f'{digit}_03_{side}');ids=np.flatnonzero(np.sum(ws*(js==jid),axis=1)>=.55)
                axis=ww[names[f'{digit}_03_{side}']][:3,1];pivot=ww[names[f'{digit}_03_{side}']][:3,3]
                ids=ids[np.argsort((gg[BODY]['v'][ids]-pivot)@axis)[-max(4,len(ids)//4):]]
                _,ix=np.unique(gg[BODY]['canon'][ids],return_index=True);ids=ids[ix]
                dist=[nearest(gg[BODY]['v'][j])*1000 for j in ids]
                metrics[side+'_'+digit]={'minimum_distal_vertex_gap_mm':min(dist),'median_gap_mm':float(np.median(dist)),'sample_count':len(dist)}
        rows.append({'angles_deg':case['angles_deg'],'distal_gaps':metrics})
    out.mkdir();path=out/'w36r-wrap-review.jpg';sheet.save(path,quality=86)
    result={'status':'ART_HOLD_WRAP_VISUAL_REVIEW','source_sha256':r['sha256'],'reverse':args.reverse,'cases':rows,'jpeg_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'limitations':['Distal vertex distances, not contact surfaces or physical grip. CPU faceted static views.']}
    (out/'w36r-review.json').write_text(json.dumps(result,indent=2));print(json.dumps(result),flush=True)
if __name__=='__main__':main()
