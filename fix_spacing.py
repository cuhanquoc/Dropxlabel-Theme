import sys
import re

with open('sections/main-product.liquid', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Breadcrumb entirely
content = re.sub(
    r'<!-- Breadcrumb -->[\s\S]*?</nav>',
    '',
    content
)

# 2. Remove padding from main container (for layout flush to edge)
content = content.replace(
    'class="max-w-screen-xl mx-auto px-6 md:px-10 py-12"',
    'class="mx-auto md:max-w-screen-xl md:px-10 pb-12 mb-12"'
)

# 3. Add px-6 back to RIGHT column so info isn't flush to screen
content = content.replace(
    '<!-- ── RIGHT: Product Info (40% = 2/5 cols) — STICKY ── -->\n    <div class="md:col-span-2">',
    '<!-- ── RIGHT: Product Info (40% = 2/5 cols) — STICKY ── -->\n    <div class="md:col-span-2 px-6 md:px-0">'
)

# 4. Update the Gallery HTML
old_gallery = """    <!-- ── LEFT: Image Gallery ── -->
    <div class="md:col-span-3">
      <div class="flex flex-col gap-3">

        <!-- Main Image -->
        <div class="w-full relative bg-[#f5f4f1] rounded-lg overflow-hidden flex items-center justify-center">
          {% if product.featured_image %}
            <img id="ProductMainImage" src="{{ product.featured_image | image_url: width: 1200 }}" alt="{{ product.title | escape }}" class="w-full h-auto object-contain transition-opacity duration-300">
          {% else %}
            <div class="w-full aspect-[3/4] bg-[#f5f4f1] flex items-center justify-center">
               {{ 'product-1' | placeholder_svg_tag: 'w-full h-full text-gray-300 object-cover' }}
            </div>
          {% endif %}
        </div>
        
        <!-- Thumbnail Slider -->
        {% if product.media.size > 1 %}
          <div id="ProductThumbnails" class="w-full" style="display: flex; gap: 8px; overflow-x: auto; box-sizing: border-box; -webkit-overflow-scrolling: touch; -ms-overflow-style: none; scrollbar-width: none;">
            <style>#ProductThumbnails::-webkit-scrollbar { display: none; }</style>
            {% for media in product.media %}
              <button type="button" aria-label="Thumbnail"
                      style="flex: 0 0 24%; min-width: 70px; border: none; background: #f5f4f1; border-radius: 6px; padding: 0; overflow: hidden; cursor: pointer; outline: none; aspect-ratio: 4/5;"
                      onclick="var main=document.getElementById('ProductMainImage'); if(main) main.src='{{ media.preview_image | image_url: width: 1200 }}'">
                <img src="{{ media.preview_image | image_url: width: 400 }}" alt="{{ media.alt | escape }}" style="width: 100%; height: 100%; object-fit: contain; display: block; mix-blend-mode: multiply;">
              </button>
            {% endfor %}
          </div>
        {% endif %}

      </div>
    </div>"""

new_gallery = """    <!-- ── LEFT: Image Gallery ── -->
    <div class="md:col-span-3">
      <div style="display: flex; flex-direction: column; gap: 1px; background-color: #fff; width: 100%;">

        <!-- Main Image -->
        <div style="width: 100%; position: relative; background-color: #f5f4f1; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          {% if product.featured_image %}
            <img id="ProductMainImage" src="{{ product.featured_image | image_url: width: 1200 }}" alt="{{ product.title | escape }}" style="width: 100%; height: auto; object-fit: contain; display: block;">
          {% else %}
            <div style="width: 100%; aspect-ratio: 4/5; background-color: #f5f4f1; display: flex; align-items: center; justify-content: center;">
               {{ 'product-1' | placeholder_svg_tag: 'w-full h-full text-gray-300 object-cover' }}
            </div>
          {% endif %}
        </div>
        
        <!-- Thumbnail Slider -->
        {% if product.media.size > 1 %}
          <div id="ProductThumbnails" style="display: flex; flex-wrap: nowrap; gap: 1px; overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; scrollbar-width: none; -ms-overflow-style: none;">
            <style>#ProductThumbnails::-webkit-scrollbar { display: none; }</style>
            {% for media in product.media %}
              <button type="button" aria-label="Thumbnail"
                      style="flex: 0 0 calc(25% - 0.75px); min-width: 0; outline: none; border: none; background-color: #f5f4f1; padding: 0; cursor: pointer; aspect-ratio: 4/5; overflow: hidden; display: block;"
                      onclick="var main=document.getElementById('ProductMainImage'); if(main) main.src='{{ media.preview_image | image_url: width: 1200 }}'">
                <img src="{{ media.preview_image | image_url: width: 400 }}" alt="{{ media.alt | escape }}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
              </button>
            {% endfor %}
          </div>
        {% endif %}

      </div>
    </div>"""

if old_gallery in content:
    content = content.replace(old_gallery, new_gallery)
    with open('sections/main-product.liquid', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced formatting and layout!")
else:
    print("ERROR: old_gallery string not found!")

