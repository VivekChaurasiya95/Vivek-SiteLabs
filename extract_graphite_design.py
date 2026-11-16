import re

with open('graphite.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Check style tags or inline styles or linked styles
styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
print(f"Inline styles count: {len(styles)}")

# Search for color codes, font-family, font-size in styles
css_vars = set(re.findall(r'(--wp--preset--color--[a-zA-Z0-9_-]+:[^;]+;)', html))
print("Preset colors sample:")
for c in sorted(list(css_vars))[:10]:
    print(" ", c)

font_vars = set(re.findall(r'(--wp--preset--font-family--[a-zA-Z0-9_-]+:[^;]+;)', html))
print("\nFont families:")
for f in font_vars:
    print(" ", f)

# Let's inspect the hero / top body section
body_match = re.search(r'<body[^>]*>(.*?)<footer', html, re.DOTALL)
if body_match:
    body_content = body_match.group(1)
    # Find all main section headings and their surrounding context
    print("\n--- Key sections and content structure ---")
    sections = re.findall(r'(<(?:section|header|div)[^>]*(?:wp-block-graphite|block-)[^>]*>.*?</(?:section|header|div)>)', body_content, re.DOTALL)
    print(f"Blocks found: {len(sections)}")

# Let's extract sample text and structural blocks
blocks = re.findall(r'<!-- wp:graphite-core/([a-z0-9-]+)(.*?)-->', html, re.DOTALL)
print("\nGraphite blocks:")
for b_name, b_attr in blocks:
    print("  Block:", b_name)

