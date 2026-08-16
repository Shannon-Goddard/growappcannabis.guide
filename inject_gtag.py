import os, glob

GTAG = """<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-KWP9QD7GPL"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-KWP9QD7GPL');
</script>"""

root = os.path.dirname(__file__)
files = glob.glob(os.path.join(root, '**', '*.html'), recursive=True)

updated, skipped = 0, 0

for path in files:
    with open(path, 'r', encoding='utf-8-sig') as f:
        content = f.read()
    if 'G-KWP9QD7GPL' in content:
        skipped += 1
        continue
    if '<head>' not in content.lower():
        skipped += 1
        continue
    # Insert right after <head> (case-insensitive)
    idx = content.lower().index('<head>') + len('<head>')
    content = content[:idx] + '\n' + GTAG + content[idx:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  updated: {os.path.relpath(path, root)}')
    updated += 1

print(f'\nDone. {updated} updated, {skipped} skipped (already tagged or no <head>).')
