import os
import re

ROOT = os.path.dirname(__file__)

# (file_path, relative_path_to_age-gate.js)
TARGETS = []

# plant-doctor.html  (depth 1 from root)
TARGETS.append((
    os.path.join(ROOT, 'plant-doctor', 'plant-doctor.html'),
    '../assets/js/age-gate.js'
))

# 45 treatment pages  (depth 3 from root)
html_dir = os.path.join(ROOT, 'plant-doctor', 'assets', 'html')
for f in os.listdir(html_dir):
    if f.endswith('.html'):
        TARGETS.append((os.path.join(html_dir, f), '../../../assets/js/age-gate.js'))

# strain-search.html  (depth 1 from root)
TARGETS.append((
    os.path.join(ROOT, 'strain-search', 'strain-search.html'),
    '../assets/js/age-gate.js'
))

# 2878 strain pages  (depth 2 from root)
strains_dir = os.path.join(ROOT, 'strain-search', 'strains')
for f in os.listdir(strains_dir):
    if f.endswith('.html'):
        TARGETS.append((os.path.join(strains_dir, f), '../../assets/js/age-gate.js'))

# Remove old inline age gate block
OLD_GATE_RE = re.compile(
    r'\s*<div id=["\']ageGate["\'][^>]*>.*?</div>\s*',
    re.DOTALL | re.IGNORECASE
)

updated = skipped = 0

for fpath, rel_path in TARGETS:
    if not os.path.exists(fpath):
        print(f'  MISSING: {fpath}')
        continue

    with open(fpath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Skip if already injected
    if 'age-gate.js' in html:
        skipped += 1
        continue

    # Remove old inline gate HTML if present
    html = OLD_GATE_RE.sub('', html)

    # Inject before </body>
    tag = f'\n<script src="{rel_path}"></script>'
    html = html.replace('</body>', tag + '\n</body>', 1)

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(html)
    updated += 1

print(f'Done. Updated: {updated}, Skipped (already done): {skipped}')
