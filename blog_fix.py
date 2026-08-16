import glob, re

REMOVE_TAGS = [
    r'<link[^>]+fonts\.googleapis\.com[^>]*>\n?',
    r'<link[^>]+aos\.css[^>]*>\n?',
    r'<link[^>]+bootstrap[^>]*>\n?',
    r'<link[^>]+swiper[^>]*>\n?',
    r'<link[^>]+glightbox[^>]*>\n?',
    r'<link[^>]+style\.css[^>]*>\n?',
    r'<link[^>]+preload[^>]+bootstrap[^>]*>\n?',
    r'<link[^>]+preload[^>]+style\.css[^>]*>\n?',
    r'<script[^>]+jquery[^>]*>.*?</script>\n?',
    r'<script[^>]+bootstrap[^>]*>.*?</script>\n?',
    r'<script[^>]+aos\.js[^>]*>.*?</script>\n?',
    r'<script[^>]+swiper[^>]*>.*?</script>\n?',
    r'<script[^>]+glightbox[^>]*>.*?</script>\n?',
    r'<script[^>]+isotope[^>]*>.*?</script>\n?',
    r'<script[^>]+main\.js[^>]*>.*?</script>\n?',
    r'<div[^>]+id=["\']preloader["\'][^>]*>.*?</div>\n?',
]

files = glob.glob('blog/assets/article/*.html')
for path in files:
    with open(path, 'r', encoding='utf-8-sig') as f:
        html = f.read()

    for pattern in REMOVE_TAGS:
        html = re.sub(pattern, '', html, flags=re.IGNORECASE | re.DOTALL)

    # Fix double assets path
    html = html.replace('../../../../assets/assets/', '../../../../assets/')

    # Fix article.css path (some files have ../../assets/css/)
    html = html.replace('../../assets/css/article.css', '../css/article.css')

    # Fix FA to 6.5.0
    html = re.sub(
        r'font-awesome/[\d.]+/css/all\.min\.css',
        'font-awesome/6.5.0/css/all.min.css',
        html
    )

    # Fix age-gate path
    html = html.replace('../js/age-gate.js', '../../../../assets/js/age-gate.js')

    # Add age-gate before </body> if missing
    if 'age-gate.js' not in html:
        html = html.replace('</body>', '  <script src="../../../../assets/js/age-gate.js"></script>\n</body>')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)

    print('done:', path)

print('\nAll files processed.')
