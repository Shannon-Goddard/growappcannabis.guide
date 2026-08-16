import os, glob, re
from datetime import date

BASE_URL = 'https://growappcannabis.guide'
ROOT     = os.path.dirname(os.path.abspath(__file__))
TODAY    = date.today().isoformat()

# Folders to exclude entirely
EXCLUDE_DIRS = {
    'node_modules', '.git', '__pycache__', 'fan-img',
    'medium-feeding', 'mydiary', 'mytask',  # app pages — not crawlable standalone
}

# Priority rules — checked in order, first match wins
PRIORITY_RULES = [
    ('index.html',              '1.0', 'daily'),
    ('/airflow/',               '0.9', 'weekly'),
    ('/lighting/',              '0.9', 'weekly'),
    ('/grow-space/',            '0.9', 'weekly'),
    ('/seeds/',                 '0.9', 'weekly'),
    ('/strain-search/strains/', '0.6', 'monthly'),
    ('/strain-search/',         '0.8', 'weekly'),
    ('/plant-doctor/',          '0.8', 'weekly'),
    ('/harvest-window/',        '0.8', 'weekly'),
    ('/how-to/',                '0.8', 'weekly'),
    ('/tools/',                 '0.8', 'weekly'),
    ('/blog/assets/article/',   '0.7', 'weekly'),
    ('/blog/assets/chart/',     '0.7', 'weekly'),
    ('/blog/',                  '0.8', 'weekly'),
    ('/assets/policies/',       '0.5', 'yearly'),
]

def get_priority(url_path):
    for pattern, pri, freq in PRIORITY_RULES:
        if pattern in url_path or url_path.endswith(pattern):
            return pri, freq
    return '0.6', 'monthly'

def path_to_url(abs_path):
    rel = os.path.relpath(abs_path, ROOT).replace('\\', '/')
    return BASE_URL + '/' + rel

def should_exclude(abs_path):
    parts = abs_path.replace('\\', '/').split('/')
    return any(p in EXCLUDE_DIRS for p in parts)

# Collect all HTML files
files = sorted(glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True))
urls = []

for f in files:
    if should_exclude(f):
        continue
    url = path_to_url(f)
    pri, freq = get_priority(url)
    urls.append((url, pri, freq))

# Build XML
lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

for url, pri, freq in urls:
    lines += [
        '  <url>',
        f'    <loc>{url}</loc>',
        f'    <lastmod>{TODAY}</lastmod>',
        f'    <changefreq>{freq}</changefreq>',
        f'    <priority>{pri}</priority>',
        '  </url>',
    ]

lines.append('</urlset>')

out = os.path.join(ROOT, 'sitemap.xml')
with open(out, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'Written: {out}')
print(f'{len(urls)} URLs indexed')
for url, pri, freq in urls:
    print(f'  [{pri}] {url}')
