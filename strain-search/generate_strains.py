"""
generate_strains.py
Run from: medium-feeding/strain-search/
Output:  medium-feeding/strain-search/strains/<slug>.html  (one per strain)

Usage:
    python generate_strains.py
"""

import re, os

# ── 1. Read data.js and extract the JS array ──────────────────────────────────
DATA_JS = os.path.join(os.path.dirname(__file__), '..', 'assets', 'js', 'data.js')
OUT_DIR  = os.path.join(os.path.dirname(__file__), 'strains')
os.makedirs(OUT_DIR, exist_ok=True)

with open(DATA_JS, encoding='utf-8') as f:
    raw = f.read()

# Extract each object block between outermost { } in the array
blocks = re.findall(r'\{([^{}]+)\}', raw, re.DOTALL)

def extract_field(block, key):
    """Pull a field value from a JS object block."""
    # Match:  key: "value"  or  key: 'value'
    m = re.search(r'\b' + re.escape(key) + r'\s*:\s*(["\'])(.+?)\1', block, re.DOTALL)
    if m:
        return m.group(2).strip()
    # Match unquoted (numbers)
    m = re.search(r'\b' + re.escape(key) + r'\s*:\s*([^,\n}]+)', block)
    if m:
        return m.group(1).strip().strip('"\'')
    return ''

strains = []
for block in blocks:
    if 'strain' not in block:
        continue
    strains.append({
        'strain':  extract_field(block, 'strain'),
        'info':    extract_field(block, 'info'),
        'more':    extract_field(block, 'more'),
        'THC':     extract_field(block, 'THC'),
        'CBD':     extract_field(block, 'CBD'),
        'Indica':  extract_field(block, 'Indica'),
        'Hybrid':  extract_field(block, 'Hybrid'),
        'Sativa':  extract_field(block, 'Sativa'),
        'Grow':    extract_field(block, 'Grow'),
        'logo':    extract_field(block, 'logo'),
    })

# ── 2. Helpers ────────────────────────────────────────────────────────────────
def slugify(name):
    s = name.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

def type_label(s):
    if s.get('Indica'): return s['Indica']
    if s.get('Hybrid'): return s['Hybrid']
    if s.get('Sativa'): return s['Sativa']
    return 'Hybrid'

def img_path(logo):
    # logo is like "assets/strain-img/Green_Crack.jpg"
    # from strains/ we need ../../assets/strain-img/...
    filename = logo.split('/')[-1]
    return f'../../assets/strain-img/{filename}'

# ── 3. HTML template ──────────────────────────────────────────────────────────
TEMPLATE = '''\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>{title_tag}</title>
  <meta name="description" content="{meta_desc}">
  <link rel="canonical" href="https://growappcannabis.guide/medium-feeding/strain-search/strains/{slug}.html">
  <link rel="icon" href="../../../assets/img/favicon.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-KWP9QD7GPL"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-KWP9QD7GPL');</script>
  <style>
    *,*::before,*::after{{box-sizing:border-box;margin:0;padding:0;}}
    body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0c0e;color:#e8eaed;min-height:100vh;}}
    a{{color:#04AA6D;text-decoration:none;}}
    a:hover{{text-decoration:underline;}}
    header{{position:sticky;top:0;z-index:50;background:rgba(10,12,14,0.92);backdrop-filter:blur(8px);border-bottom:1px solid #2a333d;display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;}}
    .nav-logo{{font-size:1.1rem;font-weight:800;color:#fff;display:flex;align-items:center;gap:.4rem;}}
    .nav-logo i{{color:#04AA6D;}}
    header a.back{{color:#8b949e;font-size:.875rem;display:flex;align-items:center;gap:.4rem;transition:color .15s;}}
    header a.back:hover{{color:#04AA6D;}}
    main{{max-width:760px;margin:0 auto;padding:2.5rem 1.25rem 5rem;}}
    .strain-hero{{display:flex;gap:1.5rem;align-items:flex-start;margin-bottom:2rem;}}
    .strain-hero img{{width:120px;height:120px;border-radius:12px;object-fit:cover;border:1px solid #2a333d;flex-shrink:0;background:#13181d;}}
    .strain-hero-info h1{{font-size:1.75rem;font-weight:800;margin-bottom:.4rem;}}
    .badges{{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.6rem;}}
    .badge{{display:inline-block;font-size:.72rem;font-weight:700;padding:.25rem .6rem;border-radius:4px;border:1px solid;}}
    .badge-green{{background:rgba(4,170,109,.12);color:#04AA6D;border-color:#04AA6D;}}
    .badge-muted{{background:#13181d;color:#8b949e;border-color:#2a333d;}}
    .stats{{display:flex;gap:1.5rem;margin-top:.5rem;}}
    .stat-item{{text-align:center;}}
    .stat-value{{font-size:1.2rem;font-weight:800;color:#04AA6D;}}
    .stat-label{{font-size:.7rem;color:#8b949e;margin-top:.1rem;}}
    .divider{{border:none;border-top:1px solid #2a333d;margin:1.75rem 0;}}
    .section-label{{font-size:.7rem;text-transform:uppercase;letter-spacing:2px;color:#8b949e;margin-bottom:.75rem;}}
    p.body-text{{color:#c9d1d9;line-height:1.75;margin-bottom:1rem;font-size:.95rem;}}
    .cta-box{{background:#13181d;border:1px solid #2a333d;border-radius:12px;padding:1.5rem;margin-top:2rem;text-align:center;}}
    .cta-box p{{color:#8b949e;font-size:.875rem;margin-bottom:1rem;}}
    .btn{{display:inline-flex;align-items:center;gap:.5rem;background:#04AA6D;color:#000;font-weight:700;font-size:.9rem;padding:.7rem 1.4rem;border-radius:8px;transition:opacity .2s;}}
    .btn:hover{{opacity:.85;text-decoration:none;}}
    @media(max-width:520px){{.strain-hero{{flex-direction:column;}}.strain-hero img{{width:100%;height:200px;border-radius:12px;}}}}
  </style>
</head>
<body>
  <header>
    <a href="../strain-search.html" class="back"><i class="fa-solid fa-arrow-left"></i> Strain Search</a>
    <a href="../../../index.html" class="nav-logo">GrowApp <i class="fa-solid fa-leaf"></i></a>
    <div style="width:60px;"></div>
  </header>

  <div id="hamburger-placeholder" data-depth="3"></div>

  <main>
    <div class="strain-hero">
      <img src="{img_src}" alt="{strain_name} cannabis strain" onerror="this.src='../../../assets/strain-img/default.jpg'">
      <div class="strain-hero-info">
        <h1>{strain_name}</h1>
        <div class="badges">
          <span class="badge badge-green">{type_str}</span>
          <span class="badge badge-muted"><i class="fa-solid fa-clock" style="font-size:.65rem;"></i> {grow_weeks} wk flower</span>
          {thc_badge}
          {cbd_badge}
        </div>
        <div class="stats">
          <div class="stat-item"><div class="stat-value">{thc}%</div><div class="stat-label">THC</div></div>
          <div class="stat-item"><div class="stat-value">{cbd}%</div><div class="stat-label">CBD</div></div>
          <div class="stat-item"><div class="stat-value">{grow_weeks}wk</div><div class="stat-label">Flower</div></div>
        </div>
      </div>
    </div>

    <hr class="divider">

    <p class="section-label">About {strain_name}</p>
    <p class="body-text">{info}</p>
    {more_block}

    <hr class="divider">

    <div class="cta-box">
      <p>Ready to grow {strain_name}? Build your personalized day-by-day schedule — strain selected, nutrients dialed in, start date set.</p>
      <a href="../../medium-feeding.html" class="btn"><i class="fa-solid fa-seedling"></i> Start My Grow</a>
    </div>
  </main>

  <script src="../../../assets/js/hamburger.js"></script>
</body>
</html>
'''

# ── 4. Generate ───────────────────────────────────────────────────────────────
count = 0
for s in strains:
    name     = s.get('strain', '').strip()
    if not name:
        continue

    slug     = slugify(name)
    thc      = s.get('THC', '0') or '0'
    cbd      = s.get('CBD', '0') or '0'
    grow_wks = s.get('Grow', '8') or '8'
    info     = (s.get('info') or '').strip()
    more     = (s.get('more') or '').strip()
    logo     = s.get('logo', '')
    t_label  = type_label(s)

    title_tag  = f"{name} Strain — THC {thc}% · {t_label} | GrowApp Cannabis Guide"
    meta_desc  = (
        f"{name} is a {t_label} cannabis strain with {thc}% THC and {cbd}% CBD. "
        f"Flowering time: {grow_wks} weeks. Full grow guide, feeding schedule & strain info on GrowApp."
    )[:160]

    def safe_float(v):
        try: return float(v)
        except: return 0.0

    thc_badge = f'<span class="badge badge-green">THC {thc}%</span>' if safe_float(thc) > 0 else ''
    cbd_badge = f'<span class="badge badge-muted">CBD {cbd}%</span>' if safe_float(cbd) > 0 else ''
    more_block = f'<p class="body-text">{more}</p>' if more else ''

    html = TEMPLATE.format(
        slug       = slug,
        strain_name= name,
        title_tag  = title_tag,
        meta_desc  = meta_desc,
        img_src    = img_path(logo),
        type_str   = t_label,
        grow_weeks = grow_wks,
        thc        = thc,
        cbd        = cbd,
        thc_badge  = thc_badge,
        cbd_badge  = cbd_badge,
        info       = info,
        more_block = more_block,
    )

    out_path = os.path.join(OUT_DIR, f'{slug}.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    count += 1

print(f"✅  Generated {count} strain pages → medium-feeding/strain-search/strains/")
