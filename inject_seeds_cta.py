"""
inject_seeds_cta.py
Injects a "Buy Seeds" section into every strain detail page.
Links to ../../seeds/seeds.html?strain=STRAIN_NAME (URL deep-link).
Run from repo root: python inject_seeds_cta.py
"""

import os, re
from pathlib import Path
from urllib.parse import quote

STRAINS_DIR = Path("strain-search/strains")

SEEDS_SECTION = """
    <hr class="divider">

    <p class="section-label">Buy Seeds</p>
    <div class="cta-box" style="text-align:left;">
      <p style="margin-bottom:1rem;">Find {name} seeds from verified seed banks — feminized, autoflower &amp; more. Compare vendors, prices &amp; shipping on Seed Money.</p>
      <a href="../../seeds/seeds.html?strain={encoded}" class="btn" style="background:#04AA6D;">
        <i class="fa-solid fa-seedling"></i> Shop {name} Seeds
      </a>
    </div>"""

INSERT_BEFORE = '<div class="cta-box">'

updated = 0
skipped = 0

for html_file in STRAINS_DIR.glob("*.html"):
    content = html_file.read_text(encoding="utf-8")

    # Skip if already injected
    if "seeds/seeds.html?strain=" in content:
        skipped += 1
        continue

    # Extract strain name from <h1>
    m = re.search(r'<h1>([^<]+)</h1>', content)
    if not m:
        skipped += 1
        continue

    name = m.group(1).strip()
    encoded = quote(name)

    section = SEEDS_SECTION.format(name=name, encoded=encoded)

    # Insert before the existing CTA box
    if INSERT_BEFORE not in content:
        skipped += 1
        continue

    new_content = content.replace(INSERT_BEFORE, section + "\n\n    " + INSERT_BEFORE, 1)
    html_file.write_text(new_content, encoding="utf-8")
    updated += 1

print(f"Done. Updated: {updated} | Skipped: {skipped}")
