from pathlib import Path

d = Path('strain-search/strains')
updated = 0
for f in d.glob('*.html'):
    t = f.read_text(encoding='utf-8')
    if 'on Seed Money.' in t:
        f.write_text(t.replace('on Seed Money.', 'in one place.'), encoding='utf-8')
        updated += 1

print(f'Updated: {updated}')
