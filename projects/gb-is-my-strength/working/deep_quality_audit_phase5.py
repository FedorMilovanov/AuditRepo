import os, re, json, subprocess

base_dir = '/home/user/gb-is-my-strength/karty'
if not os.path.exists(base_dir):
    print("Cloning gb-is-my-strength into /home/user/gb-is-my-strength...")
    subprocess.run(['gh', 'repo', 'clone', 'FedorMilovanov/gb-is-my-strength', '/home/user/gb-is-my-strength', '--', '--depth', '50'], check=True)

print("=== DEEP QUALITY AUDIT PHASE 5: MIGRATION MATRIX, PAYLOAD WATERFALLS & HEADER PARITY ===\n")

# 1. Effective Route Registry & Migration Matrix Sync Test
print("--- 1. Route Migration Matrix Sync & Contract Audit ---")
try:
    res = subprocess.run(['node', 'scripts/sync-route-migration-matrix.js', '--check'], cwd='/home/user/gb-is-my-strength', capture_output=True, text=True)
    print(f"  sync-route-migration-matrix --check exit code: {res.returncode}")
    if res.stdout:
        for line in res.stdout.splitlines()[:10]:
            print("  ", line)
    if res.stderr:
        for line in res.stderr.splitlines()[:5]:
            print("  stderr:", line)
except Exception as e:
    print("  Sync audit failed:", e)

# 2. Map Folder Payload Size Audit
print("\n--- 2. Uncompressed Asset Payload Sizing Across All 11 Maps ---")
for slug in sorted(os.listdir(base_dir)):
    map_path = os.path.join(base_dir, slug)
    if os.path.isdir(map_path) and not slug.startswith('_'):
        total_size = 0
        file_counts = {'html': 0, 'json': 0, 'svg': 0, 'js': 0}
        for root, dirs, files in os.walk(map_path):
            for f in files:
                ext = f.split('.')[-1].lower()
                if ext in file_counts:
                    file_counts[ext] += 1
                fp = os.path.join(root, f)
                total_size += os.path.getsize(fp)
        print(f"  [{slug}] Payload: {round(total_size / 1024, 1)} KB | Files: {file_counts}")

# 3. Check Canonical & Hreflang Tag Completeness Across All Map Pages
print("\n--- 3. SEO Canonical & Hreflang Tag Verification ---")
for slug in sorted(os.listdir(base_dir)):
    html_file = os.path.join(base_dir, slug, 'index.html')
    if os.path.exists(html_file):
        content = open(html_file, errors='ignore').read()
        canonical = re.search(r'<link\b[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']', content, re.I)
        hreflang_ru = re.search(r'<link\b[^>]*hreflang=["\']ru["\'][^>]*href=["\']([^"\']+)["\']', content, re.I)
        hreflang_x = re.search(r'<link\b[^>]*hreflang=["\']x-default["\'][^>]*href=["\']([^"\']+)["\']', content, re.I)
        
        c_val = canonical.group(1) if canonical else 'MISSING'
        h_ru_val = hreflang_ru.group(1) if hreflang_ru else 'MISSING'
        h_x_val = hreflang_x.group(1) if hreflang_x else 'MISSING'
        
        is_complete = c_val != 'MISSING' and h_ru_val != 'MISSING' and h_x_val != 'MISSING'
        print(f"  [{slug}] Canonical/Hreflang Complete: {is_complete} | Canonical: '{c_val}'")
