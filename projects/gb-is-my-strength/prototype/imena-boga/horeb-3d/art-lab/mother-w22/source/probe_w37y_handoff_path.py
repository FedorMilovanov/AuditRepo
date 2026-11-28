"""W37y: ordered sampled handoff plan; export individual verified keys on request.

The basket motion is a separate prescribed rigid transform. No dynamic grasp
or animation acceptance is implied by these sampled poses.
"""
import argparse,json,subprocess,sys
from pathlib import Path
import numpy as np

def plan():
    keys=np.array([[0,80,60],[2.5,90,70],[5,100,80],[10,100,80],
                   [15,94.14213562373095,80],[17.5,90,80],[20,80,80]])
    repairs={3.75:(96.,75.),8.75:(102.,80.)}
    states=[]
    for deg in np.linspace(0,20,17):
        deg=float(deg)
        stance,pole=repairs.get(deg,(float(np.interp(deg,keys[:,0],keys[:,1])),float(np.interp(deg,keys[:,0],keys[:,2]))))
        states.append({'phase':'tilt','angle_deg':deg,'stance_mm':stance,'right_pole_deg':pole,'retreat_mm':80})
    for mm in range(75,-1,-5):
        states.append({'phase':'lateral','angle_deg':20.,'stance_mm':80.,'right_pole_deg':80.,'retreat_mm':mm})
    return states

def options(state):
    base=['--distance','0','--open-grip','--multidigit','--underside','20',
          '--asymmetric','--retreat-direction','out','--park-area-ramp',
          '--handoff-retreat',str(state['retreat_mm'])]
    if state['phase']=='tilt':
        return base+['--handoff-park','--handoff-angle',str(state['angle_deg']),
                     '--park-stance',str(state['stance_mm']),'--park-right-pole',
                     str(state['right_pole_deg']),'--park-right-upper','-40']
    return base+['--asymmetric-path','--retreat-pole','-45','--retreat-upper','15']

def main():
    p=argparse.ArgumentParser()
    p.add_argument('evidence',type=Path);p.add_argument('output',type=Path)
    p.add_argument('--state',type=int);p.add_argument('--export',action='store_true')
    args=p.parse_args()
    states=plan();assert len(states)==33
    if args.state is None:
        assert not args.export and not args.output.exists()
        args.output.write_text(json.dumps({'status':'ART_HOLD_SAMPLED_HANDOFF_PLAN','states':states},indent=2))
        return
    assert 0<=args.state<len(states) and not args.output.exists()
    cmd=[sys.executable,str(Path(__file__).with_name('probe_w34zg_arm_reconnect.py')),
         str(args.evidence),str(args.output)]+options(states[args.state])
    if args.export:cmd+=['--handoff-key-export']
    subprocess.run(cmd,check=True,timeout=30)
if __name__=='__main__':main()
