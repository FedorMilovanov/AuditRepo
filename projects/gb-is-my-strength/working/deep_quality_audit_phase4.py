import os, re, json, subprocess

base_dir = '/home/user/gb-is-my-strength/karty'
if not os.path.exists(base_dir):
    print("Cloning gb-is-my-strength into /home/user/gb-is-my-strength...")
    subprocess.run(['gh', 'repo', 'clone', 'FedorMilovanov/gb-is-my-strength', '/home/user/gb-is-my-strength', '--', '--depth', '50'], check=True)

print("=== DEEP QUALITY AUDIT PHASE 4: FOCUS TRAPS, DOUBLE-CLICK HANDLERS & MEMORY LEAKS ===\n")

engine_js = open(os.path.join(base_dir, '_engine/map-engine.js'), errors='ignore').read()
avraam_js = open(os.path.join(base_dir, 'avraam/avraam-app.js'), errors='ignore').read()

# 1. Audit Escape Key Event Cascade
print("--- 1. Escape Key Event Handlers Audit ---")
esc_listeners = []
for idx, line in enumerate(engine_js.splitlines(), 1):
    if "e.key === 'Escape'" in line or "e.key==='Escape'" in line or "e.key === \"Escape\"" in line:
        esc_listeners.append((idx, line.strip()))

print(f"  map-engine.js has {len(esc_listeners)} independent Escape key handlers:")
for line_num, line_str in esc_listeners:
    print(f"     Line {line_num}: {line_str[:110]}")

# 2. Audit Double-Click Event Behavior
print("\n--- 2. Double Click Gesture Audit on Place Markers ---")
dbl_clicks = []
for idx, line in enumerate(engine_js.splitlines(), 1):
    if 'dblclick' in line.lower():
        dbl_clicks.append((idx, line.strip()))

print(f"  map-engine.js has {len(dbl_clicks)} double-click event listeners:")
for line_num, line_str in dbl_clicks:
    print(f"     Line {line_num}: {line_str[:110]}")

# 3. Audit DOM Re-creation & Node Leaks in renderMarkers
print("\n--- 3. DOM Node Re-creation Analysis in renderMarkers() ---")
render_markers_match = re.search(r'function renderMarkers\(\)\{(.*?)\n    \}', engine_js, re.DOTALL)
if render_markers_match:
    body = render_markers_match.group(1)
    inner_creates = body.count('document.createElement')
    print(f"  renderMarkers() contains {inner_creates} DOM node creation calls per render pass.")
    print("  Note: All marker SVG elements are destroyed and recreated on every place click or story change.")
