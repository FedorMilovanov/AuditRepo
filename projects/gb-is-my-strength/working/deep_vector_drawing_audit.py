import os, re, json, xml.etree.ElementTree as ET

print("=== FORENSIC VECTOR DRAWING & CARTOGRAPHIC QUALITY AUDIT ===\n")

base_dir = '/home/user/gb-is-my-strength/karty'

# 1. Audit 'nachalo' draft sheet
print("--- 1. Audit of 'nachalo' (Eden to Babylon) Draft Sheet ---")
nachalo_route_path = os.path.join(base_dir, 'nachalo/route.json')
if os.path.exists(nachalo_route_path):
    nachalo_data = json.load(open(nachalo_route_path))
    places = nachalo_data.get('places', [])
    stages = nachalo_data.get('stages', [])
    stories = nachalo_data.get('stories', [])
    meta = nachalo_data.get('meta', {})
    
    print(f"  nachalo: places={len(places)}, stages={len(stages)}, stories={len(stories)}")
    print(f"  meta properties: {list(meta.keys())}")

    # Check place details
    for p in places:
        print(f"    - Place '{p.get('id')}': name='{p.get('name')}', x={p.get('x')}, y={p.get('y')}, stage={p.get('stage')}, type={p.get('type')}")

# 2. Audit base-geo.svg & base.svg Vector Path Precision & Complexity
print("\n--- 2. Vector Precision & Complexity Analysis of Basemaps ---")
for svg_rel in ['_engine/base-geo.svg', 'avraam/base.svg']:
    svg_path = os.path.join(base_dir, svg_rel)
    if not os.path.exists(svg_path): continue
    content = open(svg_path).read()
    
    # Analyze path commands (M, C, Q, L, Z)
    paths = re.findall(r'<path\b[^>]*d=["\']([^"\']+)["\']', content)
    total_commands = sum(len(re.findall(r'[MmLlCcQqSsTtAaZz]', p)) for p in paths)
    straight_line_paths = [p for p in paths if len(re.findall(r'[CcQq]', p)) == 0 and len(re.findall(r'[Ll]', p)) > 0]
    curved_bezier_paths = [p for p in paths if len(re.findall(r'[CcQq]', p)) > 0]
    
    print(f"  [{svg_rel}]")
    print(f"     Total <path> elements: {len(paths)}")
    print(f"     Total path vector nodes/commands: {total_commands}")
    print(f"     Bezier smooth curved paths: {len(curved_bezier_paths)}")
    print(f"     Simple straight segment paths: {len(straight_line_paths)}")

# 3. Search for Hardcoded Crutches / Hacks in MapEngine Drawing Logic
print("\n--- 3. Code-Level Drawing Crutches & Hacks in map-engine.js ---")
engine_code = open(os.path.join(base_dir, '_engine/map-engine.js')).read()

hacks = []
# Check for straight line connection hack in renderMarkers
if 'places.map((p,j)=>`${j===0?\'M\':\'L\'}${p.x},${p.y}`).join(\' \')' in engine_code or 'M${p.x},${p.y}' in engine_code or 'L${p.x},${p.y}' in engine_code:
    hacks.append("CRUTCH: MapEngine constructs route paths by drawing straight 'L' lines directly between places, producing crude geometric zig-zags rather than historical curved roads.")

# Check for fixed offsets vs dynamic collision solver
if 'Math.abs(op.x - place.x) < 100' in engine_code:
    hacks.append("CRUTCH: Hardcoded 100x16px bounding box check in label collision logic with fixed 12px shift, failing on dense clusters.")

# Check hardcoded scale bar math
if 'cfg.W0 / view.w' in engine_code:
    hacks.append("CRUTCH: Scale bar uses unscaling W0 constant instead of rendered container element width.")

for idx, h in enumerate(hacks, 1):
    print(f"  ❌ Hack #{idx}: {h}")
