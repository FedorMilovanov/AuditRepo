import re,glob,os,json,html,urllib.parse,collections
D='/tmp/gb/dist'
pages={}
for f in glob.glob(D+'/**/index.html',recursive=True):
    if '/pagefind/' in f: continue
    r=f[len(D):-len('index.html')]
    pages[r]=open(f,encoding='utf8').read()
ids={r:set(re.findall(r'\sid="([^"]+)"',s)) for r,s in pages.items()}
def exists(path):
    p=D+path
    if path.endswith('/'): return os.path.exists(p+'index.html')
    return os.path.exists(p) or os.path.exists(p+'/index.html') or os.path.exists(p+'.html')
dead=collections.defaultdict(set);anch=collections.defaultdict(set);res=collections.defaultdict(set)
for r,s in pages.items():
    s2=re.sub(r'<script\b[^>]*>.*?</script>','',s,flags=re.S)
    for tag,attr,val in re.findall(r'<(a|link|img|source|script|video|iframe)\b[^>]*?\s(href|src)="([^"]*)"',s):
        v=html.unescape(val).strip()
        if not v or v.startswith(('mailto:','tel:','javascript:','data:','http:','https:','//')): 
            if v.startswith('https://gospod-bog.ru/'): v=v[len('https://gospod-bog.ru'):]
            else: continue
        u=urllib.parse.urlsplit(urllib.parse.urljoin('http://x'+r,v))
        path=urllib.parse.unquote(u.path)
        if tag=='a' and u.fragment and (path==r or path==''):
            if u.fragment not in ids[r] and not re.search(r'name="'+re.escape(u.fragment)+'"',s): anch[r+'#'+u.fragment].add(r)
            continue
        if not exists(path):
            (dead if tag=='a' else res)[path].add(r)
        elif tag=='a' and u.fragment and path in pages and u.fragment not in ids[path]:
            anch[path+'#'+u.fragment].add(r)
out={'dead_links':{k:sorted(v) for k,v in dead.items()},'missing_resources':{k:sorted(v) for k,v in res.items()},'dead_anchors':{k:sorted(v) for k,v in anch.items()}}
json.dump(out,open('/tmp/aud/links.json','w'),ensure_ascii=False,indent=1)
for k in out: print(k,len(out[k]))
for k in out:
    for u,v in sorted(out[k].items(),key=lambda x:-len(x[1]))[:12]: print(' ',k[:5],u[:90],len(v),v[:2])
