import re,glob,html,json,collections,sys
D='/tmp/gb/dist';rows=[]
for f in sorted(glob.glob(D+'/**/index.html',recursive=True)):
    if '/pagefind/' in f: continue
    r=f[len(D):-10];s=open(f,encoding='utf8').read()
    g=lambda p:(re.search(p,s,re.S) or [None,None])[1]
    metas=[dict(re.findall(r'([a-zA-Z:-]+)="([^"]*)"',m)) for m in re.findall(r'<meta\b([^>]*)>',s)]
    links=[dict(re.findall(r'([a-zA-Z:-]+)="([^"]*)"',m)) for m in re.findall(r'<link\b([^>]*)>',s)]
    M=lambda k:next((m.get('content') for m in metas if m.get('name')==k or m.get('property')==k),None)
    noindex=False
    noindex='noindex' in (M('robots') or '')
    body=re.sub(r'<(script|style|template)\b.*?</\1>','',s,flags=re.S)
    hs=[int(x) for x in re.findall(r'<h([1-6])\b',body)]
    skips=[f'h{a}→h{b}' for a,b in zip(hs,hs[1:]) if b>a+1]
    imgs=re.findall(r'<img\b[^>]*>',body)
    noalt=[i for i in imgs if not re.search(r'\salt=',i)]
    rows.append(dict(r=r,noindex=noindex,title=html.unescape(g(r'<title>(.*?)</title>') or ''),desc=html.unescape(M('description') or ''),
      canon=next((l.get('href') for l in links if l.get('rel')=='canonical'),None),og=M('og:image'),ogt=M('og:title'),lang=g(r'<html[^>]*\slang="([^"]*)"'),
      h1=hs.count(1),skips=sorted(set(skips)),noalt=len(noalt),imgs=len(imgs)))
json.dump(rows,open(sys.argv[1],'w'),ensure_ascii=False,indent=1)
idx=[x for x in rows if not x['noindex']]
print('pages',len(rows),'indexable',len(idx))
def show(name,lst):print(name,len(lst),[x['r'] for x in lst][:8])
show('no title',[x for x in rows if not x['title']])
show('no desc (indexable)',[x for x in idx if not x['desc']])
show('desc <70',[x for x in idx if x['desc'] and len(x['desc'])<70])
show('desc >200',[x for x in idx if len(x['desc'])>200])
show('title >70',[x for x in idx if len(x['title'])>70])
show('no canonical (indexable)',[x for x in idx if not x['canon']])
show('canonical != self',[x for x in idx if x['canon'] and not x['canon'].rstrip('/').endswith(x['r'].rstrip('/'))])
show('no/empty og:image (indexable)',[x for x in idx if not x['og']])
show('no og:title',[x for x in idx if not x['ogt']])
show('lang != ru',[x for x in rows if x['lang']!='ru'])
show('h1 != 1',[x for x in rows if x['h1']!=1]); print('   ',[(x['r'],x['h1']) for x in rows if x['h1']!=1][:12])
show('heading skips',[x for x in rows if x['skips']]); print('   ',collections.Counter(s for x in rows for s in x['skips']).most_common(5))
show('img without alt',[x for x in rows if x['noalt']]); print('   ',[(x['r'],x['noalt']) for x in rows if x['noalt']][:8])
dt=collections.defaultdict(list);dd=collections.defaultdict(list)
for x in idx: dt[x['title']].append(x['r']); x['desc'] and dd[x['desc']].append(x['r'])
print('dup titles',[(k[:50],v) for k,v in dt.items() if len(v)>1][:5]);print('dup desc',[(k[:50],v) for k,v in dd.items() if len(v)>1][:5])
