import os, re, json, subprocess

base_dir = '/home/user/gb-is-my-strength/karty'
if not os.path.exists(base_dir):
    print("Cloning gb-is-my-strength into /home/user/gb-is-my-strength...")
    subprocess.run(['gh', 'repo', 'clone', 'FedorMilovanov/gb-is-my-strength', '/home/user/gb-is-my-strength', '--', '--depth', '50'], check=True)

print("=== DEEP QUALITY AUDIT PHASE 3: SEO, OPENGRAPH, PAGE OWNERSHIP & TEXT QUALITY ===\n")

# 1. SEO & OpenGraph Audit for all 11 map routes
print("--- 1. OpenGraph & Meta Tags Audit Across All 11 Maps ---")
for slug in sorted(os.listdir(base_dir)):
    html_file = os.path.join(base_dir, slug, 'index.html')
    astro_file = f'/home/user/gb-is-my-strength/src/pages/karty/{slug}/index.astro'
    
    if os.path.exists(html_file):
        html_content = open(html_file, errors='ignore').read()
        og_img = re.search(r'<meta\b[^>]*property=["\']og:image["\'][^>]*content=["\']([^"\']+)["\']', html_content, re.I)
        og_title = re.search(r'<meta\b[^>]*property=["\']og:title["\'][^>]*content=["\']([^"\']+)["\']', html_content, re.I)
        robots = re.search(r'<meta\b[^>]*name=["\']robots["\'][^>]*content=["\']([^"\']+)["\']', html_content, re.I)
        
        og_img_val = og_img.group(1) if og_img else 'MISSING'
        og_title_val = og_title.group(1) if og_title else 'MISSING'
        robots_val = robots.group(1) if robots else 'MISSING'
        
        # Check if local image exists on disk
        img_rel = og_img_val.replace('https://gospod-bog.ru/', '')
        img_disk_exists = os.path.exists(f'/home/user/gb-is-my-strength/{img_rel}') if og_img_val != 'MISSING' else False
        
        print(f"  [{slug}]")
        print(f"     og:image: {og_img_val} (exists on disk: {img_disk_exists})")
        print(f"     og:title: '{og_title_val}'")
        print(f"     robots: '{robots_val}'")

# 2. Text Quality & Unclosed Markup Audit in route.json
print("\n--- 2. Unclosed HTML Markup & Untranslated Placeholders in Data ---")
for slug in sorted(os.listdir(base_dir)):
    route_file = os.path.join(base_dir, slug, 'route.json')
    if os.path.exists(route_file):
        content = open(route_file, errors='ignore').read()
        
        # Check for unclosed div tags or raw unescaped quotes
        open_divs = content.count('<div')
        close_divs = content.count('</div>')
        open_spans = content.count('<span')
        close_spans = content.count('</span>')
        
        # Check for placeholder English strings or TODOs
        placeholders = re.findall(r'\b(?:TODO|FIXME|placeholder|Lorem|ipsum|test_name)\b', content, re.I)
        
        print(f"  [{slug}] <divs>: {open_divs}/{close_divs} | <spans>: {open_spans}/{close_spans} | Placeholders: {len(placeholders)}")
        if open_divs != close_divs or open_spans != close_spans or placeholders:
            print(f"     ⚠️ Markup mismatch or placeholders detected!")

# 3. Page Ownership vs Effective Route Registry Alignment
print("\n--- 3. Page Ownership & Migration Registry Cross-Check ---")
po_file = '/home/user/gb-is-my-strength/data/page-ownership.json'
if os.path.exists(po_file):
    po_data = json.load(open(po_file))
    karty_owners = {k: v for k, v in po_data.items() if '/karty' in k}
    print(f"  page-ownership.json map routes count: {len(karty_owners)}")
    for k, v in karty_owners.items():
        print(f"     {k} -> mode={v.get('mode')}, owner={v.get('owner')}")
