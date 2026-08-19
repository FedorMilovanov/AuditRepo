import json, os, re, subprocess

GB = '/home/user/gb'
wf_dir = os.path.join(GB, '.github/workflows')
wf_text = {}
for fn in os.listdir(wf_dir):
    if fn.endswith(('.yml', '.yaml')):
        wf_text[fn] = __builtins__.open(os.path.join(wf_dir, fn), encoding='utf8').read()

# collect only "run:" command bodies (executed), vs whole file (mentions)
run_bodies = []
for fn, t in wf_text.items():
    lines = t.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        m = re.match(r'^(\s*)-?\s*run:\s*(.*)$', line)
        if m:
            indent = len(m.group(1))
            body = [m.group(2)]
            j = i + 1
            while j < len(lines):
                nxt = lines[j]
                if nxt.strip() == '':
                    body.append('')
                    j += 1
                    continue
                ind = len(nxt) - len(nxt.lstrip())
                if ind > indent:
                    body.append(nxt)
                    j += 1
                else:
                    break
            run_bodies.append('\n'.join(body))
            i = j
        else:
            i += 1
RUN = '\n'.join(run_bodies)
ALL = '\n'.join(wf_text.values())

pkg = json.load(__builtins__.open(os.path.join(GB, 'package.json')))['scripts']

# expand npm run chains reachable from anything executed in CI
def expand(name, seen=None):
    seen = seen or set()
    if name in seen or name not in pkg:
        return set()
    seen.add(name)
    out = {name}
    for ref in re.findall(r'npm run ([A-Za-z0-9:_\-]+)', pkg[name]):
        out |= expand(ref, seen)
    return out

executed_scripts = set()
for n in re.findall(r'npm run ([A-Za-z0-9:_\-]+)', RUN):
    executed_scripts |= expand(n)

# node scripts executed directly in CI
direct = set(re.findall(r'node (?:--[\w=]+ )*(scripts/[\w\-.]+\.(?:js|mjs|cjs))', RUN))
for s in executed_scripts:
    for f in re.findall(r'node (?:--[\w=]+ )*(scripts/[\w\-.]+\.(?:js|mjs|cjs))', pkg.get(s, '')):
        direct.add(f)

allscripts = sorted(
    f'scripts/{f}' for f in os.listdir(os.path.join(GB, 'scripts'))
    if f.endswith(('.js', '.mjs', '.cjs'))
)

never_run = [s for s in allscripts if s not in direct]
# among those, which are cited as workflow path triggers (implying they are believed to be gates)
trigger_only = [s for s in never_run if s in ALL]

print('total scripts:', len(allscripts))
print('executed in CI (direct or via npm chain):', len(direct))
print('never executed:', len(never_run))
print('\n== cited in workflow files (path trigger etc) but NEVER executed:', len(trigger_only))
for s in trigger_only:
    print('  ', s)
