import glob, re

files = glob.glob('blog/assets/article/*.html')

for path in files:
    with open(path, 'r', encoding='utf-8-sig') as f:
        html = f.read()

    # Fix seed-map external links → internal seeds page
    html = re.sub(
        r'<a\s[^>]*href=["\']https://seed-map\.poweredbyci\.live[^"\']*["\'][^>]*>.*?</a>',
        '<a href="../../../../seeds/seeds.html">Find on Seed Money 🌱</a>',
        html, flags=re.IGNORECASE | re.DOTALL
    )

    # Fix sticky CTA link
    html = html.replace(
        '../../../../shop/seed-money.html',
        '../../../../seeds/seeds.html'
    )

    # Add progress bar div after <body> if missing
    if 'reading-progress' not in html:
        html = html.replace(
            '<body class="article-body">',
            '<body class="article-body">\n  <div class="progress-bar" id="reading-progress"></div>'
        )

    # Add share.js before </body> if share functions used but share.js missing
    if 'shareOnX' in html and 'share.js' not in html:
        html = html.replace('</body>', '  <script src="../js/share.js"></script>\n</body>')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)

    print('done:', path)

print('\nAll done.')
