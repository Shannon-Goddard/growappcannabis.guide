import os, glob, re, json
from datetime import date

BASE_URL = 'https://growappcannabis.guide'
ROOT     = os.path.dirname(os.path.abspath(__file__))
TODAY    = date.today().isoformat()
ORG      = 'Loyal9 LLC'
ORG_URL  = 'https://growappcannabis.guide'
LOGO     = 'https://growappcannabis.guide/assets/img/favicon.png'

EXCLUDE_DIRS = {'node_modules', '.git', '__pycache__', 'fan-img'}

def path_to_url(abs_path):
    rel = os.path.relpath(abs_path, ROOT).replace('\\', '/')
    return BASE_URL + '/' + rel

def get_meta(content):
    title = re.search(r'<title[^>]*>(.*?)</title>', content, re.I | re.S)
    desc  = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']', content, re.I)
    title = title.group(1).strip() if title else 'GrowApp Cannabis Guide'
    desc  = desc.group(1).strip() if desc else 'Cannabis cultivation tools, strain database, and grow guides by Loyal9 LLC.'
    return title, desc

def org_block():
    return {
        "@type": "Organization",
        "@id": ORG_URL + "/#organization",
        "name": ORG,
        "url": ORG_URL,
        "logo": LOGO
    }

def build_schema(url, rel, title, desc):
    """Return a list of schema objects for this page."""
    schemas = []

    # ── Homepage ──────────────────────────────────────────────
    if rel == 'index.html':
        schemas.append({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": url + "#website",
            "url": url,
            "name": "GrowApp Cannabis Guide",
            "description": desc,
            "publisher": org_block(),
            "potentialAction": {
                "@type": "SearchAction",
                "target": BASE_URL + "/strain-search/strain-search.html?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        })
        schemas.append({
            "@context": "https://schema.org",
            **org_block()
        })
        return schemas

    # ── Blog article pages ─────────────────────────────────────
    if '/blog/assets/article/' in rel or '/blog/assets/chart/' in rel:
        schemas.append({
            "@context": "https://schema.org",
            "@type": "Article",
            "@id": url + "#article",
            "url": url,
            "headline": title,
            "description": desc,
            "dateModified": TODAY,
            "datePublished": TODAY,
            "author": org_block(),
            "publisher": org_block(),
            "mainEntityOfPage": {"@type": "WebPage", "@id": url}
        })
        return schemas

    # ── Blog landing ───────────────────────────────────────────
    if rel == 'blog/blog.html':
        schemas.append({
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": url + "#blog",
            "url": url,
            "name": title,
            "description": desc,
            "publisher": org_block()
        })
        return schemas

    # ── Strain search ──────────────────────────────────────────
    if rel == 'strain-search/strain-search.html':
        schemas.append({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "@id": url + "#app",
            "url": url,
            "name": title,
            "description": desc,
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Web",
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
            "author": org_block()
        })
        return schemas

    # ── Individual strain pages ────────────────────────────────
    if '/strain-search/strains/' in rel:
        strain_name = re.sub(r'[-_]', ' ', os.path.splitext(os.path.basename(rel))[0]).title()
        schemas.append({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": url + "#webpage",
            "url": url,
            "name": title,
            "description": desc,
            "about": {
                "@type": "Thing",
                "name": strain_name + " Cannabis Strain"
            },
            "isPartOf": {"@id": BASE_URL + "/strain-search/strain-search.html#app"},
            "publisher": org_block()
        })
        return schemas

    # ── Plant doctor landing ───────────────────────────────────
    if rel == 'plant-doctor/plant-doctor.html':
        schemas.append({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "@id": url + "#app",
            "url": url,
            "name": title,
            "description": desc,
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web",
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
            "author": org_block()
        })
        return schemas

    # ── Plant doctor condition pages ───────────────────────────
    if '/plant-doctor/assets/html/' in rel:
        condition = re.sub(r'[-_]', ' ', os.path.splitext(os.path.basename(rel))[0]).title()
        schemas.append({
            "@context": "https://schema.org",
            "@type": "Article",
            "@id": url + "#article",
            "url": url,
            "headline": title,
            "description": desc,
            "about": {"@type": "Thing", "name": condition + " — Cannabis Plant"},
            "dateModified": TODAY,
            "author": org_block(),
            "publisher": org_block(),
            "mainEntityOfPage": {"@type": "WebPage", "@id": url}
        })
        return schemas

    # ── Product / gear pages ───────────────────────────────────
    if rel in ('airflow/airflow.html', 'lighting/lighting.html', 'grow-space/grow-space.html'):
        schemas.append({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": url + "#webpage",
            "url": url,
            "name": title,
            "description": desc,
            "publisher": org_block(),
            "mainEntity": {
                "@type": "ItemList",
                "name": title,
                "description": desc,
                "url": url
            }
        })
        return schemas

    # ── Seeds ──────────────────────────────────────────────────
    if rel == 'seeds/seeds.html':
        schemas.append({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": url + "#webpage",
            "url": url,
            "name": title,
            "description": desc,
            "publisher": org_block(),
            "mainEntity": {
                "@type": "ItemList",
                "name": "Cannabis Seed Banks Comparison",
                "url": url
            }
        })
        return schemas

    # ── Tools ──────────────────────────────────────────────────
    if rel in ('tools/tools.html', 'harvest-window/harvest-window.html',
               'how-to/how-to.html', 'games/games.html', 'GetTheApp.html'):
        schemas.append({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": url + "#webpage",
            "url": url,
            "name": title,
            "description": desc,
            "publisher": org_block()
        })
        return schemas

    # ── Medium & Feeding app pages ─────────────────────────────
    if 'medium-feeding' in rel:
        schemas.append({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "@id": url + "#app",
            "url": url,
            "name": title,
            "description": desc,
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Web",
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
            "author": org_block()
        })
        return schemas

    # ── Policy pages ───────────────────────────────────────────
    if '/assets/policies/' in rel:
        schemas.append({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": url + "#webpage",
            "url": url,
            "name": title,
            "description": desc,
            "publisher": org_block(),
            "about": {"@type": "Thing", "name": "Legal Policy — " + ORG}
        })
        return schemas

    # ── Default fallback ───────────────────────────────────────
    schemas.append({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": url + "#webpage",
        "url": url,
        "name": title,
        "description": desc,
        "publisher": org_block()
    })
    return schemas


def make_tag(schemas):
    block = json.dumps(schemas[0] if len(schemas) == 1 else schemas, indent=2, ensure_ascii=False)
    return f'<script type="application/ld+json">\n{block}\n</script>'


# ── Main ──────────────────────────────────────────────────────
files = sorted(glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True))
updated, skipped = 0, 0

for abs_path in files:
    # Skip excluded dirs
    parts = abs_path.replace('\\', '/').split('/')
    if any(p in EXCLUDE_DIRS for p in parts):
        skipped += 1
        continue

    with open(abs_path, 'r', encoding='utf-8-sig') as f:
        content = f.read()

    # Skip if schema already injected
    if 'application/ld+json' in content:
        skipped += 1
        continue

    if '<head>' not in content.lower():
        skipped += 1
        continue

    url = path_to_url(abs_path)
    rel = os.path.relpath(abs_path, ROOT).replace('\\', '/')
    title, desc = get_meta(content)
    schemas = build_schema(url, rel, title, desc)
    tag = make_tag(schemas)

    # Inject after closing </title> tag, or after <head> if no title
    if '</title>' in content:
        content = content.replace('</title>', '</title>\n' + tag, 1)
    else:
        idx = content.lower().index('<head>') + len('<head>')
        content = content[:idx] + '\n' + tag + content[idx:]

    with open(abs_path, 'w', encoding='utf-8') as f:
        f.write(content)

    updated += 1

print(f'Done. {updated} updated, {skipped} skipped.')
