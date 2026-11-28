"""Independent glTF LINEAR rotation/weight playback audit, not a renderer."""
import argparse,copy,json,math,sys
from pathlib import Path
import numpy as np
from probe_w34l_foot_surface import load
from probe_w34t_whole_scene import geometry,merged
from probe_w34r_static_correction import contacts,deadline

BODY='ANATOMICAL_ADULT_WOMAN__MAKEHUMAN_CC0';TUNIC='W28e_tailored_linen'
def pose(doc,acc,t):
    d=dict(doc,nodes=copy.deepcopy(doc['nodes']))
    anim=doc['animations'][0]
    for ch in anim['channels']:
        sampler=anim['samplers'][ch['sampler']];target=ch['target']
        assert sampler['interpolation']=='LINEAR'
        times=acc(sampler['input']).ravel().astype(float)
        assert np.all(np.diff(times)>0)
        i=int(np.clip(np.searchsorted(times,t,side='right')-1,0,len(times)-2))
        u=float(np.clip((t-times[i])/(times[i+1]-times[i]),0,1))
        values=acc(sampler['output']).reshape(len(times),-1).astype(float)
        a,b=values[i],values[i+1];field=target['path']
        if field=='rotation':
            a/=np.linalg.norm(a);b/=np.linalg.norm(b)
            dot=float(a@b)
            if dot<0:b=-b;dot=-dot
            if dot>.9995:v=(1-u)*a+u*b
            else:
                theta=math.acos(np.clip(dot,-1,1))
                v=(math.sin((1-u)*theta)*a+math.sin(u*theta)*b)/math.sin(theta)
            v/=np.linalg.norm(v)
        else:v=(1-u)*a+u*b
        d['nodes'][target['node']][field]=v.tolist()
    return d

def audit(root,frame,bilateral=False,closure_fraction=None,pad_fraction=None,extension=False,sample_time=None,handoff=False):
    folder=root/('W35y-bilateral-20261128' if bilateral else 'W35d-approach-20261127')
    r=json.loads((folder/('w35y-assembly.json' if bilateral else 'w35d-assembly.json')).read_text())
    doc,acc=load(folder/('w35y-approach.glb' if bilateral else 'w35d-approach.glb'),r['sha256'])
    if extension:
        assert bilateral and closure_fraction is None and pad_fraction is None
        original,oa=doc,acc;original_sha=r['sha256']
        ext=root/'W36m-closure-20261128';r=json.loads((ext/'w36m-assembly.json').read_text())
        assert r['approach_sha256']==original_sha
        doc,acc=load(ext/'w36m-approach-closure.glb',r['sha256'])
    if handoff:
        assert bilateral and not extension and closure_fraction is None and pad_fraction is None
        ext=root/'W38a-handoff-20261128';r=json.loads((ext/'w38a-assembly.json').read_text())
        doc,acc=load(ext/'w38a-handoff.glb',r['sha256'])
    source,sa=load(root/('W34s-sleeve-correction-20261127/w34s-static-actor.glb' if bilateral else 'W34v-finger-refine-20261127/w34u-static-actor.glb'),r['source_sha256'])
    m=json.loads((root/'W34m-reach-20261127/w34m-reach-v3.json').read_text())
    h,ha=load(root/'W28-house-20261125/w28-house.glb',m['house_sha256'])
    hg,_=geometry(h,ha,drop=m['basket_support']['analytic_settle_delta_m'])
    baseline,bw=geometry(source,sa,True)
    t=min(frame/24,r['duration_s']) if sample_time is None else sample_time
    assert 0<=t<=r['duration_s']
    d=pose(doc,acc,t);chosen=None
    if closure_fraction is not None:
        assert bilateral and frame==58
        from probe_w36a_contact_closure import apply_closure
        d,chosen=apply_closure(d,root,closure_fraction,r['sha256'])
    g,w=geometry(d,acc,True);assert set(g)==set(baseline)
    if pad_fraction is not None:
        assert closure_fraction==1
        from probe_w36g_pad_compliance import apply_pad
        g=apply_pad(g,root,pad_fraction,r['sha256'])
    extension_error=None
    if extension:
        from probe_w36a_contact_closure import apply_closure
        from probe_w36g_pad_compliance import apply_pad
        ref=pose(original,oa,min(t,2.4))
        if t>=2.4:
            ref,chosen=apply_closure(ref,root,float(np.clip((t-2.4)/.5,0,1)),original_sha)
        rg,_=geometry(ref,oa,True)
        if t>=2.9:rg=apply_pad(rg,root,float(np.clip((t-2.9)/.25,0,1)),original_sha)
        extension_error=max(float(np.max(abs(v['v']-rg[k]['v']))) for k,v in g.items())
    names={n['name']:i for i,n in enumerate(d['nodes'])}
    basket_layout=None
    stance=.100 if bilateral else .160
    if handoff:
        assert r['house_sha256']==m['house_sha256'] and r['settle_delta_m']==m['basket_support']['analytic_settle_delta_m']
        i=r['basket_track_node'];assert d['nodes'][i]['name']==r['basket_track_name']
        M=w[i];Q=M[:3,:3];S=M[:3,3]
        assert np.max(abs(Q.T@Q-np.eye(3)))<1e-6 and np.linalg.det(Q)>.99999
        hg={k:dict(z,v=z['v']@Q.T+S) if z['basket'] else z for k,z in hg.items()}
        stance=float(np.interp(t,[z['seconds'] for z in r['keys']],[z['stance_mm'] for z in r['keys']]))*.001
        bb=merged([z for z in hg.values() if z['basket']]);bv=bb['v'];lo=bv.min(0);hi=bv.max(0);table=hg['Coarse_work_surface'];th=table['v'].max(0);tl=table['v'].min(0)
        near=bv[(bv[:,0]>=tl[0])&(bv[:,0]<=th[0])&(bv[:,2]>=tl[2])&(bv[:,2]<=th[2])]
        bc={}
        for k,z in hg.items():
            if z['basket'] or np.any((z['v'].max(0)<lo-1e-8)|(z['v'].min(0)>hi+1e-8)):continue
            bt=z['v'][z['tri']];mask=np.all((bt.min(1)<=hi+1e-8)&(bt.max(1)>=lo-1e-8),axis=1)
            if mask.any():
                count=contacts(bb,dict(z,tri=z['tri'][mask],region=z['region'][mask]),np.arange(len(bb['tri'])))['pairs']
                if count:bc[k]=count
        basket_layout={'table_min_gap_mm':float((near[:,1].min()-th[1])*1000),'proper_crossings':bc,'rotation':Q.tolist(),'translation':S.tolist()}
    changed={}
    for k,v in g.items():
        assert np.array_equal(v['tri'],baseline[k]['tri'])
        mask=np.linalg.norm(v['v']-baseline[k]['v']-[0,0,stance],axis=1)>1e-6
        changed[k]=np.flatnonzero(np.any(mask[v['tri']],axis=1))
    def hit(a,b,active=None,selfcheck=False,ids=False):
        if active is None:active=np.arange(len(a['tri']))
        if not len(active):return {'pairs':0,'face_ids':[]}
        return contacts(a,b,active,selfcheck,include_pairs=ids)
    body=g[BODY];tunic=g[TUNIC]
    skin=hit(body,body,selfcheck=True,ids=True)
    toe_pairs=sum(np.max(body['v'][body['tri'][[i,j]],1])<.15 for i,j in skin['pair_ids'])
    cloth=hit(tunic,tunic,selfcheck=True)['pairs']
    garment_hits={}
    for k,v in g.items():
        if k==BODY:continue
        # Audit all body/garment pairs; eye/brow/lash anatomy is separately unchanged.
        if k not in ('W19_CC0_Eyes','W28t_CC0_brows','W29b_CC0_lashes'):
            garment_hits[k]=hit(body,v)['pairs']
    other={}
    for k,v in g.items():
        idx=changed[k]
        if not len(idx):continue
        aa=dict(v,tri=v['tri'][idx],region=v['region'][idx]);at=aa['v'][aa['tri']];lo=at.min(axis=(0,1));hi=at.max(axis=(0,1))
        for n,b in g.items():
            if k==n or (k==BODY and n in garment_hits) or (n==BODY and k in garment_hits):continue
            if len(changed[n]) and n<k:continue
            bt=b['v'][b['tri']];mask=np.all((bt.min(1)<=hi+1e-8)&(bt.max(1)>=lo-1e-8),axis=1)
            if np.any(mask):
                count=hit(aa,dict(b,tri=b['tri'][mask],region=b['region'][mask]))['pairs']
                if count:other[k+' / '+n]=count
    actor=merged(g.values());at=actor['v'][actor['tri']];lo=at.min(1);hi=at.max(1);amin=lo.min(0);amax=hi.max(0)
    groups={'floor':[],'basket':[],'room':[]}
    for k,v in hg.items():
        if np.any((v['v'].min(0)>amax+1e-8)|(v['v'].max(0)<amin-1e-8)):continue
        kind='floor' if k in ('Room_floor_earthen','Courtyard_earthen_ground') else 'basket' if v['basket'] else 'room'
        groups[kind].append(v)
    scene={}
    for kind,items in groups.items():
        if not items:scene[kind]=0;continue
        prop=merged(items);bt=prop['v'][prop['tri']]
        mask=np.all((bt.min(1)<=amax+1e-8)&(bt.max(1)>=amin-1e-8),axis=1)
        prop=dict(prop,tri=prop['tri'][mask],region=prop['region'][mask])
        if not len(prop['tri']):scene[kind]=0;continue
        bt=prop['v'][prop['tri']];active=np.flatnonzero(np.all((lo<=bt.max(axis=(0,1))+1e-8)&(hi>=bt.min(axis=(0,1))-1e-8),axis=1))
        scene[kind]=hit(actor,prop,active)['pairs']
    strain={}
    for k in (BODY,TUNIC):
        n=next(n for n in source['nodes'] if n['name']==k);mesh=source['meshes'][n['mesh']];pr=mesh['primitives'][0]
        v=sa(pr['attributes']['POSITION']).astype(float)
        for wt,z in zip(n.get('weights',mesh.get('weights',[])),pr.get('targets',[])):
            if wt:v+=wt*sa(z['POSITION'])
        tri=g[k]['tri']
        def area(points):
            x=points[tri];return np.linalg.norm(np.cross(x[:,1]-x[:,0],x[:,2]-x[:,0]),axis=1)
        a0=area(v);a1=area(g[k]['v']);strain[k]=np.flatnonzero((a0>1e-12)&(a1<.1*a0)).tolist()
    error={}
    for side in (() if bilateral else ('l','r')):
        q=json.loads((root/f'W34zf-retreat-{side}-20261127/w34zb-reshape.json').read_text())
        direction=np.array(q['approach_meta']['selected']['direction'],float);direction/=np.linalg.norm(direction)
        target=np.array(q['best']['joint_world_matrices']['hand_'+side])[:3,3]+direction*.06*(1-t/1.5)
        error[side]=float(np.linalg.norm(w[names['hand_'+side]][:3,3]-target)*1000)
    grip=None
    if bilateral and not handoff:
        from probe_w35i_rim_contact import closest,normals
        left=json.loads((root/'W35k-cross-section-l-20261127.json').read_text())['shapes'][1]['best']
        right=next(q for q in json.loads((root/'W35l-mirror-contact-20261127.json').read_text())['right'] if q['passes'] and q['left_source_pair']==left['skin_vertices'] and q['delta_mm']==[0,0,0])
        times=[s['seconds'] for s in r['keys']]
        for side,record in [('l',left),('r',right)]:
            sign=-1 if side=='l' else 1
            base=np.array(record['rotation'])@bw[names['hand_'+side]][:3,3]+record['translation']
            offsets=np.array([[sign*(s['outset_mm']+(s['distance_mm'] if s['direction']=='outward' else 0)),s['distance_mm'] if s['direction']=='up' else 0,0] for s in r['keys']])*.001
            target=base+np.array([np.interp(t,times,offsets[:,j]) for j in range(3)])
            error[side]=float(np.linalg.norm(w[names['hand_'+side]][:3,3]-target)*1000)
        if (extension and t>=2.4) or (not extension and frame==58):
            rim=hg['Basket_thick_lipped_rim'];rt=rim['v'][rim['tri']];rn=normals(rim['v'],rim['tri']);rn/=np.maximum(np.linalg.norm(rn,axis=1),1e-12)[:,None]
            fn=normals(body['v'],body['tri']);vn=np.zeros((int(body['canon'].max())+1,3))
            for k in range(3):np.add.at(vn,body['canon'][body['tri'][:,k]],fn)
            vn=vn[body['canon']];vn/=np.maximum(np.linalg.norm(vn,axis=1),1e-12)[:,None]
            vn*=np.sign(np.sum(np.einsum('ij,ij->i',body['v'][body['tri'][:,0]],fn)))
            grip={}
            for side,ids in (chosen.items() if chosen else [('l',left['skin_vertices']),('r',[q['vertex'] for q in right['contacts']])]):
                rows=[]
                for i in ids:
                    distance,point,j=closest(body['v'][i],rt)
                    rows.append({'vertex':i,'gap_mm':distance*1000,'normal':rn[j].tolist(),'skin_facing_dot':float(vn[i]@rn[j])})
                dot=float(np.dot(rows[0]['normal'],rows[1]['normal']))
                grip[side]={'contacts':rows,'opposition_dot':dot,'pass':bool(dot<=-.75 and all(q['gap_mm']<=3 and q['skin_facing_dot']<=-.5 for q in rows))}
    endpoint=None
    if not bilateral and frame in (0,36):
        f=root/f'W35c-static-160-{60 if frame==0 else 0}-20261127';q=json.loads((f/'w34zx-export.json').read_text())
        dd,aa=load(f/'w34zx-static-actor.glb',q['export']['sha256']);gg,_=geometry(dd,aa,True)
        endpoint=max(float(np.max(abs(v['v']-gg[k]['v']))) for k,v in g.items())
    # Floor height is a verified constant on this staging area; feet unchanged from source.
    floor_gap=float((body['v'][:,1].min()+.005)*1000)
    return {'frame':frame,'seconds':t,'skin_self_total':skin['pairs'],'toe_pairs_below_150mm':int(toe_pairs),'tunic_self':cloth,'body_clothes':garment_hits,'other_changed_actor':other,'scene':scene,'severe_faces':strain,'wrist_error_mm':error,'endpoint_max_error_m':endpoint,'min_body_height_vs_floor_mm':floor_gap,'grip':grip,'closure_fraction':closure_fraction,'pad_fraction':pad_fraction,'extension_reference_error_m':extension_error,'basket_layout':basket_layout}

def main():
    p=argparse.ArgumentParser();p.add_argument('evidence',type=Path)
    modes=p.add_mutually_exclusive_group(required=True);modes.add_argument('--frame',type=int);modes.add_argument('--all',action='store_true')
    p.add_argument('--report',type=Path);p.add_argument('--bilateral',action='store_true');p.add_argument('--closure-fraction',type=float);p.add_argument('--pad-fraction',type=float);p.add_argument('--extension',action='store_true');p.add_argument('--sample-time',type=float);args=p.parse_args();assert not args.extension or (args.bilateral and args.frame is not None and args.closure_fraction is None and args.pad_fraction is None);assert args.sample_time is None or args.extension;assert args.pad_fraction is None or (args.closure_fraction==1 and 0<=args.pad_fraction<=1);assert args.closure_fraction is None or (args.bilateral and args.frame==58 and 0<=args.closure_fraction<=1)
    if args.frame is not None:
        assert args.report is None and 0<=args.frame<=(76 if args.extension else 58 if args.bilateral else 36)
        print(json.dumps(audit(args.evidence,args.frame,args.bilateral,args.closure_fraction,args.pad_fraction,args.extension,args.sample_time)),flush=True);return
    import subprocess
    folder=args.evidence/('W35y-bilateral-20261128' if args.bilateral else 'W35d-approach-20261127')
    path=args.report or folder/('w35z-playback.json' if args.bilateral else 'w35e-playback.json');assert not path.exists()
    sha=json.loads((folder/('w35y-assembly.json' if args.bilateral else 'w35d-assembly.json')).read_text())['sha256']
    report={'status':'PARTIAL','sha256':sha,'sample_rate_fps':24,'rows':[]}
    def save():path.write_text(json.dumps(report,indent=2),encoding='utf-8')
    save()
    for frame in range(59 if args.bilateral else 37):
        proc=subprocess.run([sys.executable,__file__,str(args.evidence),'--frame',str(frame)]+(['--bilateral'] if args.bilateral else []),capture_output=True,text=True,timeout=30)
        if proc.returncode:raise RuntimeError(proc.stdout[-1200:]+proc.stderr[-1200:])
        row=json.loads(proc.stdout);assert row['frame']==frame
        report['rows'].append(row);save();print('FRAME',frame,flush=True)
    rows=report['rows'];report['status']='ART_HOLD_SAMPLED_PLAYBACK_AUDITED'
    report['summary']={'frames':len(rows),'max_wrist_error_mm':max(max(row['wrist_error_mm'].values()) for row in rows),'non_toe_skin_pairs':sum(row['skin_self_total']-row['toe_pairs_below_150mm'] for row in rows),'tunic_self_pairs':sum(row['tunic_self'] for row in rows),'body_clothes_pairs':sum(sum(row['body_clothes'].values()) for row in rows),'other_changed_pairs':sum(sum(row['other_changed_actor'].values()) for row in rows),'basket_room_pairs':sum(row['scene']['basket']+row['scene']['room'] for row in rows),'severe_skin_faces':sum(len(row['severe_faces'][BODY]) for row in rows),'max_endpoint_error_m':max((row['endpoint_max_error_m'] for row in rows if row['endpoint_max_error_m'] is not None),default=None)}
    report['summary']['new_severe_cloth_faces']=sum(len(set(row['severe_faces'][TUNIC])-{9480,9514,10476,27658,28641,28647}) for row in rows)
    save();print('SUMMARY',json.dumps(report['summary']),flush=True)
if __name__=='__main__':main()
