"""Independent W34m first-frame reach and elbow geometry, not Blender collision proof."""
import argparse, hashlib, json, math
from pathlib import Path
import numpy as np
from probe_w34l_foot_surface import load,world,place,ground_heights

def rx(deg):
    a=math.radians(deg);c,s=math.cos(a),math.sin(a)
    return np.array([[1,0,0],[0,c,-s],[0,s,c]])

def joint_points(doc,acc):
    nodes=[dict(n) for n in doc['nodes']]
    a=next(x for x in doc['animations'] if x['name']=='Mother_GestureTowardsBasket')
    for ch in a['channels']:
        t=ch['target'];s=a['samplers'][ch['sampler']]
        assert abs(float(acc(s['input'])[0,0])-1/24)<1e-6
        if t['path']!='weights':nodes[t['node']][t['path']]=acc(s['output'])[0].tolist()
    w=world(doc,nodes)
    return {n['name']:w[i][:3,3] for i,n in enumerate(nodes)}

def lean_points(joints,row,z):
    # glTF Y-up -> Blender Z-up after actor yaw/offset.
    names=['spine_01','spine_02']+[n+'_'+s for s in ('l','r') for n in ('upperarm','lowerarm','hand')]
    p={}
    for n in names:
        x,h,neg_y=place(joints[n][None,:],row['yaw_deg'],row['stance_x'],row['stance_y'],z)[0]
        p[n]=np.array([x,-neg_y,h])
    rot=rx(-row['lean_deg']/2)
    for i,spine in enumerate(names[:2]):
        pivot=p[spine].copy()
        for n in names[i+1:]:p[n]=pivot+rot@(p[n]-pivot)
    return p

def solve(a,b,c,target,pole):
    l1=np.linalg.norm(b-a);l2=np.linalg.norm(c-b)
    v=target-a;d=np.linalg.norm(v)
    reserve=l1+l2-d
    row={'distance_mm':float(d*1000),'arm_length_mm':float((l1+l2)*1000),
         'reserve_mm':float(reserve*1000),'reachable':bool(abs(l1-l2)+.005<d<l1+l2-.005)}
    if not row['reachable']:return row
    axis=v/d;projected=pole-axis*np.dot(pole,axis)
    if np.linalg.norm(projected)<1e-8:row['reachable']=False;return row
    projected/=np.linalg.norm(projected)
    along=(l1*l1-l2*l2+d*d)/(2*d)
    elbow=a+axis*along+projected*math.sqrt(max(0,l1*l1-along*along))
    assert abs(np.linalg.norm(elbow-a)-l1)<1e-10
    assert abs(np.linalg.norm(target-elbow)-l2)<1e-10
    row['elbow']=elbow.tolist()
    row['flexion_deg']=math.degrees(math.acos(np.clip(np.dot(elbow-a,target-elbow)/(l1*l2),-1,1)))
    return row

def basket_support(doc,acc):
    w=world(doc,doc['nodes'])
    anchor=next(i for i,n in enumerate(doc['nodes']) if n['name']=='BASKET_OBJECT_ACTION_ANCHOR')
    def descendants(i):
        yield i
        for c in doc['nodes'][i].get('children',[]):yield from descendants(c)
    def geometry(i):
        n=doc['nodes'][i]
        for pr in doc['meshes'][n['mesh']]['primitives']:
            assert pr.get('mode',4)==4
            pp=acc(pr['attributes']['POSITION'])
            vertices=(np.column_stack((pp,np.ones(len(pp))))@w[i].T)[:,:3]
            yield n['name'],vertices,acc(pr['indices']).reshape(-1,3)
    ids=[i for i in descendants(anchor) if 'mesh' in doc['nodes'][i]]
    assert len(ids)==92
    allv=np.concatenate([v for i in ids for _,v,_ in geometry(i)])
    base_y=float(allv[:,1].min())
    bottom=np.unique(np.round(allv[allv[:,1]<base_y+.002],8),axis=0)
    # Translate the support query only to reuse the existing low-height ray
    # routine. Actual basket, tabletop and glTF remain untouched.
    offset=np.array([0,1,0])
    table=next(i for i,n in enumerate(doc['nodes']) if n['name']=='Coarse_work_surface')
    support=[(name,v-offset,tri) for name,v,tri in geometry(table)]
    heights,names=ground_heights(bottom-offset,support)
    gaps=(bottom[:,1]-1-heights)*1000
    drop=float(gaps.min()/1000)
    assert 10<drop*1000<12
    return {'mesh_count':len(ids),'bottom_vertices':len(bottom),'bottom_y_m':base_y,
        'support_y_min_m':float(heights.min()+1),'support_y_max_m':float(heights.max()+1),
        'min_gap_mm':float(gaps.min()),'max_gap_mm':float(gaps.max()),
        'analytic_settle_delta_m':-drop,'surface_names':sorted(set(names))}

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('evidence',type=Path);parser.add_argument('output',type=Path)
    args=parser.parse_args();root=args.evidence
    assert not args.output.exists()
    ah='587c7b0b10d38207a3a305ba71557f8f4ba82abd2ca21fc3389aba5e52009dcf'
    j=json.loads((root/'W34j-lean-20261127/w34j-shell-approach.json').read_text())
    w=json.loads((root/'W34l-foot-surface-20261127/w34l-foot-surface-v2.json').read_text())
    assert j['actor_sha256']==w['actor_sha256']==ah
    doc,acc=load(root/'W34f-corrective-glb-20261127/w34f-actor.glb',ah)
    hh='fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622'
    assert w['house_sha256']==hh
    house,ha=load(root/'W28-house-20261125/w28-house.glb',hh)
    basket=basket_support(house,ha)
    joints=joint_points(doc,acc)
    targets={}
    for row in j['rows']:
        if not row['reachable']:continue
        v={s:np.array(row['targets'][s]['wrist']) for s in ('l','r')}
        key=row['height']
        if key in targets:
            assert max(np.linalg.norm(v[s]-targets[key][s]) for s in v)<1e-7
        else:targets[key]=v
    assert len(targets)==3
    heights={r['offset'][1]:r['grounded_trial']['offset'][2] for r in w['rows'] if r['yaw_deg']==180}
    assert set(heights)=={-.96,-1.04}
    rows=[];errors=[]
    for old in j['rows']:
        assert old['yaw_deg']==180
        row={k:old[k] for k in ('stance_x','stance_y','lean_deg','height')}
        row['original_blender_reachable']=old['reachable']
        for mode,z,rotated in [('legacy',.015,False),('actor_pole',.015,True),('grounded_actor_pole',heights[old['stance_y']],True),('grounded_settled_basket',heights[old['stance_y']],True)]:
            p=lean_points(joints,old,z);sides={}
            for s,sign in [('l',1),('r',-1)]:
                a,b,c=[p[n+'_'+s] for n in ('upperarm','lowerarm','hand')]
                pole=np.array([-sign*.5,-.2,-1] if rotated else [-.2,sign*.5,-1])
                target=targets[old['height']][s]
                if mode=='grounded_settled_basket':
                    target=target+np.array([0,0,basket['analytic_settle_delta_m']])
                sides[s]=solve(a,b,c,target,pole)
            good=all(r['reachable'] for r in sides.values())
            symmetry=None
            if good:
                l=np.array(sides['l']['elbow']);r=np.array(sides['r']['elbow'])
                l[0]=2*old['stance_x']-l[0]
                symmetry=float(np.linalg.norm(l-r)*1000)
            row[mode]={'reachable':good,'sides':sides,'elbow_mirror_error_mm':symmetry}
            if mode=='legacy' and not old['reachable']:
                fail=old['reason'];assert fail['kind']=='ik_failed'
                actual=sides[fail['side']]
                errors.append(abs(actual['distance_mm']-fail['distance_mm']))
                errors.append(abs(actual['arm_length_mm']-fail['arm_length_mm']))
        rows.append(row)
    assert len(rows)==12 and len(errors)==10
    assert max(errors)<.1,errors
    assert all(r['legacy']['reachable']==r['original_blender_reachable'] for r in rows)
    summary={}
    for mode in ('legacy','actor_pole','grounded_actor_pole','grounded_settled_basket'):
        good=[r for r in rows if r[mode]['reachable']]
        vals=[r[mode]['elbow_mirror_error_mm'] for r in good]
        summary[mode]={'reachable':len(good),'median_mirror_error_mm':float(np.median(vals)) if vals else None,
            'max_mirror_error_mm':max(vals) if vals else None}
    report={'status':'ART_HOLD_ANALYTIC_REACH_WITNESS','actor_sha256':ah,
        'house_sha256':hh,
        'foot_witness_sha256':hashlib.sha256((root/'W34l-foot-surface-20261127/w34l-foot-surface-v2.json').read_bytes()).hexdigest(),
        'max_saved_blender_witness_error_mm':max(errors),'basket_support':basket,'summary':summary,'rows':rows,
        'limitations':['Exact glTF first-frame joint anchors and W34j saved wrists; analytic two-bone reach and elbow positions only. Settled basket mode translates wrist targets rigidly by measured base gap, not an accepted prop movement. No wrist orientation, skin/cloth/prop/room collision or force/balance proof; no asset changed.']}
    args.output.parent.mkdir(exist_ok=True,parents=True)
    with args.output.open('x',encoding='utf-8') as f:json.dump(report,f,indent=2)
    print(json.dumps({k:report[k] for k in ('status','max_saved_blender_witness_error_mm','basket_support','summary')}))
    for r in rows:
        print(r['stance_y'],r['lean_deg'],r['height'],*[round(min(x['reserve_mm'] for x in r[m]['sides'].values()),2) for m in ('legacy','grounded_actor_pole','grounded_settled_basket')],*[r[m]['elbow_mirror_error_mm'] for m in ('legacy','actor_pole','grounded_actor_pole')])

if __name__=='__main__':main()
