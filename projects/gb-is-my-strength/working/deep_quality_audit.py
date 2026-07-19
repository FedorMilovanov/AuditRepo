import os, re, json

print("=== DEEP QUALITY AUDIT: TYPOGRAPHY, TOUCH TARGETS, PERFORMANCE & DATA ===\n")

base_dir = '/home/user/gb-is-my-strength/karty'
if not os.path.exists(base_dir):
    print("FATAL: /home/user/gb-is-my-strength/karty not found!")
    exit(1)

# 1. Check Touch Target Sizes in map-engine.js
print("--- 1. Touch Target Sizes in CSS & Engine JS ---")
css_content = open(os.path.join(base_dir, '_engine/map-engine.js'), errors='ignore').read()

small_targets = []
for m in re.finditer(r'(\.[\w-]+)\s*\{[^}]*?\b(height|min-height|width|min-width)\s*:\s*(\d+)px', css_content):
    cls = m.group(1)
    attr = m.group(2)
    val = int(m.group(3))
    if val < 44 and cls not in [s[0] for s in small_targets]:
        small_targets.append((cls, attr, val))

for cls, attr, val in small_targets[:15]:
    print(f"  ⚠️ {cls} -> {attr}: {val}px (< 44px recommended touch target)")

# 2. Check Hebrew Typography & RTL Attributes
print("\n--- 2. Hebrew Typography & RTL Attributes ---")
for root, dirs, files in os.walk(base_dir):
    for f in sorted(files):
        if f.endswith(('.json', '.html', '.js')):
            fp = os.path.join(root, f)
            content = open(fp, errors='ignore').read()
            hebrew_chars = re.findall(r'[\u0590-\u05FF]+', content)
            if hebrew_chars:
                has_rtl = 'dir="rtl"' in content or "dir='rtl'" in content or 'direction: rtl' in content or "direction:'rtl'" in content
                has_hebrew_font = 'Noto Serif Hebrew' in content or 'SBL Hebrew' in content
                rel = fp.replace('/home/user/gb-is-my-strength/', '')
                print(f"  [{rel}] Hebrew words: {len(hebrew_chars)} | RTL set: {has_rtl} | Font declared: {has_hebrew_font}")

# 3. Check JSON Route Data Integrity & Scripture Ref Formatting
print("\n--- 3. JSON Route Data & Scripture Refs Audit ---")
for f in sorted(os.listdir(base_dir)):
    route_file = os.path.join(base_dir, f, 'route.json')
    if os.path.exists(route_file):
        data = json.load(open(route_file))
        places = data.get('places', [])
        refs = []
        for p in places:
            if 'refs' in p: refs.extend(p['refs'])
            if 'ref' in p: refs.append(p['ref'])
        hyphen_refs = [r for r in refs if '-' in r]
        dash_refs = [r for r in refs if '–' in r or '—' in r]
        print(f"  [{f}] Places: {len(places)} | Total refs: {len(refs)} | ASCII hyphen: {len(hyphen_refs)} | En-dash: {len(dash_refs)}")
        if hyphen_refs:
            print(f"     ⚠️ Examples of ASCII hyphen '-' in refs: {hyphen_refs[:2]}")
