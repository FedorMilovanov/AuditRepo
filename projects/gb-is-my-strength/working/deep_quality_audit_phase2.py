import os, re, json, subprocess

base_dir = '/home/user/gb-is-my-strength/karty'
if not os.path.exists(base_dir):
    print("Cloning gb-is-my-strength into /home/user/gb-is-my-strength...")
    subprocess.run(['gh', 'repo', 'clone', 'FedorMilovanov/gb-is-my-strength', '/home/user/gb-is-my-strength', '--', '--depth', '50'], check=True)

print("=== DEEP QUALITY AUDIT PHASE 2: EVENT LOOPS, PASSIVE LISTENERS, SEARCH & AJV SCHEMAS ===\n")

engine_js = open(os.path.join(base_dir, '_engine/map-engine.js'), errors='ignore').read()
avraam_js = open(os.path.join(base_dir, 'avraam/avraam-app.js'), errors='ignore').read()

# 1. Passive Event Listeners Audit
print("--- 1. Non-Passive Wheel & Touch Listener Audit ---")
for code_name, code in [('map-engine.js', engine_js), ('avraam-app.js', avraam_js)]:
    non_passive = []
    for line in code.splitlines():
        if any(e in line for e in ['addEventListener', '_on']) and any(evt in line for evt in ['wheel', 'touchstart', 'touchmove', 'scroll', 'mousemove']):
            if 'passive: true' not in line and 'passive:true' not in line and 'passive: false' not in line and 'passive:false' not in line:
                non_passive.append(line.strip())
    print(f"  [{code_name}] Non-explicit passive listeners count: {len(non_passive)}")
    for np in non_passive[:5]:
        print(f"     ⚠️ {np[:110]}")

# 2. Timer Cleanup Audit
print("\n--- 2. Uncleaned Timer Closures & RAF Locks ---")
for code_name, code in [('map-engine.js', engine_js), ('avraam-app.js', avraam_js)]:
    set_timeout_count = len(re.findall(r'\bsetTimeout\b|\b_tm\b', code))
    set_interval_count = len(re.findall(r'\bsetInterval\b', code))
    clear_timeout_count = len(re.findall(r'\bclearTimeout\b', code))
    clear_interval_count = len(re.findall(r'\bclearInterval\b', code))
    raf_count = len(re.findall(r'\brequestAnimationFrame\b', code))
    cancel_raf_count = len(re.findall(r'\bcancelAnimationFrame\b', code))
    print(f"  [{code_name}] setTimeout/_tm: {set_timeout_count} (clear: {clear_timeout_count}) | setInterval: {set_interval_count} (clear: {clear_interval_count}) | RAF: {raf_count} (cancel: {cancel_raf_count})")

# 3. Schema Property & Data Audits
print("\n--- 3. Ajv Route Schema Integrity Audit across 11 maps ---")
try:
    node_script = """
    const fs = require('fs');
    const path = require('path');
    const Ajv2020 = require('ajv/dist/2020');
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    
    const schemaPath = '/home/user/gb-is-my-strength/karty/_shared/route.schema.json';
    if (!fs.existsSync(schemaPath)) {
      console.log('Schema file not found:', schemaPath);
      process.exit(0);
    }
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const validate = ajv.compile(schema);
    
    const routeFiles = fs.readdirSync('/home/user/gb-is-my-strength/karty')
      .filter(d => fs.existsSync(`/home/user/gb-is-my-strength/karty/${d}/route.json`))
      .map(d => `/home/user/gb-is-my-strength/karty/${d}/route.json`);
      
    routeFiles.forEach(rf => {
      const slug = path.basename(path.dirname(rf));
      const route = JSON.parse(fs.readFileSync(rf, 'utf8'));
      const valid = validate(route);
      if (!valid) {
        console.log(`  ❌ [${slug}] Ajv Schema Validation Failures (${validate.errors.length} errors):`);
        validate.errors.slice(0, 4).forEach(err => {
          console.log(`     - ${err.instancePath || 'root'}: ${err.message}`);
        });
      } else {
        console.log(`  ✅ [${slug}] Ajv Schema Valid`);
      }
    });
    """
    res = subprocess.run(['node', '-e', node_script], capture_output=True, text=True, cwd='/home/user/gb-is-my-strength')
    print(res.stdout)
    if res.stderr:
        print("  Stderr:", res.stderr[:300])
except Exception as e:
    print("Ajv audit failed:", e)
