import sys

with open('sections/main-product.liquid', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove mobile padding-top to eliminate the "yellow bar" gap
old_media = """  /* ─── Mobile Responsive ─── */
  @media (max-width: 767px) {
    #main-product {
      padding-top: 1.5rem;
      padding-bottom: 2rem;
    }"""
new_media = """  /* ─── Mobile Responsive ─── */
  @media (max-width: 767px) {
    #main-product {
      padding-top: 0rem;
      padding-bottom: 2rem;
    }"""

if old_media in content:
    content = content.replace(old_media, new_media)
    print("Patched mobile padding-top.")
else:
    print("WARNING: Could not find mobile padding-top rule.")

# 2. Increase gap from 1px to 2px for thicker stroke, and update flex width
content = content.replace(
    'display: flex; flex-direction: column; gap: 1px;',
    'display: flex; flex-direction: column; gap: 2px;'
)
content = content.replace(
    'display: flex; flex-wrap: nowrap; gap: 1px;',
    'display: flex; flex-wrap: nowrap; gap: 2px;'
)
content = content.replace(
    'calc(25% - 0.75px)',
    'calc(25% - 1.5px)'
)

with open('sections/main-product.liquid', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixes applied successfully!")
