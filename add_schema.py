import sys
import re

with open('sections/main-product.liquid', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the Gallery spacing HTML logic
old_gallery = """    <!-- ── LEFT: Image Gallery ── -->
    <div class="md:col-span-3">
      <div style="display: flex; flex-direction: column; gap: 2px; background-color: #fff; width: 100%;">

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
          <div id="ProductThumbnails" style="display: flex; flex-wrap: nowrap; gap: 2px; overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; scrollbar-width: none; -ms-overflow-style: none;">
            <style>#ProductThumbnails::-webkit-scrollbar { display: none; }</style>
            {% for media in product.media %}
              <button type="button" aria-label="Thumbnail"
                      style="flex: 0 0 calc(25% - 1.5px); min-width: 0; outline: none; border: none; background-color: #f5f4f1; padding: 0; cursor: pointer; aspect-ratio: 4/5; overflow: hidden; display: block;"
                      onclick="var main=document.getElementById('ProductMainImage'); if(main) main.src='{{ media.preview_image | image_url: width: 1200 }}'">
                <img src="{{ media.preview_image | image_url: width: 400 }}" alt="{{ media.alt | escape }}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
              </button>
            {% endfor %}
          </div>
        {% endif %}

      </div>
    </div>"""

# Ensure we use the Liquid calculation for width reduction:
# 3 gaps * gap_size / 4 = 0.75 * gap_size
new_gallery = """    <!-- ── LEFT: Image Gallery ── -->
    <div class="md:col-span-3">
      {% assign gallery_gap = section.settings.gallery_gap | default: 10 %}
      <div style="display: flex; flex-direction: column; gap: {{ gallery_gap }}px; background-color: #fff; width: 100%;">

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
          <div id="ProductThumbnails" style="display: flex; flex-wrap: nowrap; gap: {{ gallery_gap }}px; overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; scrollbar-width: none; -ms-overflow-style: none;">
            <style>#ProductThumbnails::-webkit-scrollbar { display: none; }</style>
            {% assign gap_compensate = gallery_gap | times: 0.75 %}
            {% for media in product.media %}
              <button type="button" aria-label="Thumbnail"
                      style="flex: 0 0 calc(25% - {{ gap_compensate }}px); min-width: 0; outline: none; border: none; background-color: #f5f4f1; padding: 0; cursor: pointer; aspect-ratio: 4/5; overflow: hidden; display: block;"
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
    print("Replaced HTML to use section.settings.gallery_gap.")
else:
    print("ERROR: old_gallery HTML block not found.")

schema_block = """
{% schema %}
{
  "name": "Product Layout",
  "settings": [
    {
      "type": "header",
      "content": "Image Gallery"
    },
    {
      "type": "range",
      "id": "gallery_gap",
      "min": 0,
      "max": 40,
      "step": 1,
      "unit": "px",
      "label": "Gallery Gap / Stroke Thickness",
      "default": 10
    }
  ]
}
{% endschema %}
"""

if "{% schema %}" not in content:
    content += schema_block
    print("Appended dynamic schema block at bottom.")
else:
    print("Schema block already exists somehow.")

with open('sections/main-product.liquid', 'w', encoding='utf-8') as f:
    f.write(content)
