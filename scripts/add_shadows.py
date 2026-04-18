import sys

with open('sections/main-product.liquid', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add border and shadow to Main Image
old_main_style = 'style="width: 100%; position: relative; background-color: #f5f4f1; display: flex; align-items: center; justify-content: center; overflow: hidden;"'
new_main_style = 'style="width: 100%; position: relative; background-color: #f5f4f1; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #e5e5e5; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-radius: 8px; box-sizing: border-box;"'

content = content.replace(old_main_style, new_main_style)

# 2. Add border and shadow to Thumbnails
old_thumb_style = 'style="flex: 0 0 calc(25% - {{ gap_compensate }}px); min-width: 0; outline: none; border: none; background-color: #f5f4f1; padding: 0; cursor: pointer; aspect-ratio: 4/5; overflow: hidden; display: block;"'
new_thumb_style = 'style="flex: 0 0 calc(25% - {{ gap_compensate }}px); min-width: 0; outline: none; border: 1px solid #e5e5e5; background-color: #f5f4f1; padding: 0; cursor: pointer; aspect-ratio: 4/5; overflow: hidden; display: block; box-shadow: 0 2px 6px rgba(0,0,0,0.04); border-radius: 6px; box-sizing: border-box;"'

content = content.replace(old_thumb_style, new_thumb_style)

with open('sections/main-product.liquid', 'w', encoding='utf-8') as f:
    f.write(content)

print("Shadows and borders added successfully.")
