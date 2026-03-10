import re

with open('sections/main-product.liquid', 'r', encoding='utf-8') as f:
    text = f.read()

# ───── 1. Replace hardcoded Social Icons with Dynamic Blocks ─────
old_social = """          <!-- ── Social Icons ── -->
          <div style="display: flex; align-items: center; gap: 1rem; margin-top: 3rem;">
            <strong style="font-size: 1.1rem; font-weight: 700;">Social:</strong>
            <div style="display: flex; gap: 1.5rem; align-items: center; font-size: 1.5rem;">
              <!-- Facebook (Circled) -->
              <a href="#" style="display: flex; justify-content: center; align-items: center; width: 48px; height: 48px; border: 2px solid #eaeaea; border-radius: 50%; color: #333;"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.03 11.46 5.6 13.72 5.6c1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.77-1.64 1.56V12h2.8l-.45 3h-2.35v6.8A10.02 10.02 0 0 0 22 12z"/></svg></a>
              <!-- X (Twitter) -->
              <a href="#" style="color: #111;"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <!-- Pinterest -->
              <a href="#" style="color: #111;"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/></svg></a>
              <!-- Telegram -->
              <a href="#" style="color: #111;"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.38-.63-.22-1.12-.34-1.08-.72.02-.2.27-.41.77-.63 3.03-1.31 5.04-2.18 6.06-2.61 2.88-1.21 3.48-1.42 3.86-1.43.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06-.01.13-.03.25z"/></svg></a>
              <!-- WhatsApp -->
              <a href="#" style="color: #111;"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.574-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c0-5.445 4.454-9.88 9.896-9.88 2.65 0 5.145 1.035 7.018 2.912 1.873 1.873 2.905 4.36 2.905 7.01 0 5.438-4.444 9.88-9.935 9.88h.001M22 12.015c0-5.5-4.475-9.988-9.96-9.988S2.08 6.516 2.08 12.015c0 1.754.457 3.46 1.328 4.97L2 22l5.127-1.346A9.914 9.914 0 0012.04 22c5.485 0 9.96-4.488 9.96-9.985"/></svg></a>
              <!-- Email -->
              <a href="#" style="background: #000; border-radius: 6px; padding: 4px; display: flex; justify-content: center; align-items: center; color: #fff;"><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></a>
            </div>
          </div>"""

new_social = """          <!-- ── Social Icons (Dynamic Blocks) ── -->
          {% assign social_blocks = section.blocks | where: "type", "social_icon" %}
          {% if social_blocks.size > 0 %}
          <div style="display: flex; align-items: center; gap: 1rem; margin-top: 3rem;">
            <strong style="font-size: 1.1rem; font-weight: 700;">Social:</strong>
            <div style="display: flex; gap: 1.25rem; align-items: center;">
              {% for block in social_blocks %}
                <a href="{{ block.settings.social_url | default: '#' }}" target="_blank" rel="noopener noreferrer" style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; color: #111;" {{ block.shopify_attributes }}>
                  {% if block.settings.social_icon_svg != blank %}
                    {{ block.settings.social_icon_svg }}
                  {% else %}
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
                  {% endif %}
                </a>
              {% endfor %}
            </div>
          </div>
          {% endif %}"""

text = text.replace(old_social, new_social)

# ───── 2. Add "PAIRS WELL WITH" carousel AFTER the payment_button div ─────
# Insert after the Dynamic Checkout block (after line "{{ form | payment_button }}" + closing div)
old_checkout_end = """          </div>

          <!-- ── Social Icons (Dynamic Blocks) ── -->"""

new_checkout_and_carousel = """          </div>

          <!-- ── PAIRS WELL WITH Carousel ── -->
          {% if section.settings.pairs_collection != blank %}
            {% assign pairs_col = section.settings.pairs_collection %}
            {% if pairs_col.products.size > 0 %}
            <div style="margin-top: 3rem; margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="font-weight: 900; font-size: 1.4rem; letter-spacing: 0.02em; text-transform: uppercase; margin: 0;">PAIRS WELL WITH</h2>
                <div style="display: flex; gap: 8px;">
                  <button type="button" onclick="scrollPairsCarousel(-1)" style="width: 40px; height: 40px; border-radius: 50%; background: #555; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" onmouseenter="this.style.background='#333'" onmouseleave="this.style.background='#555'">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button type="button" onclick="scrollPairsCarousel(1)" style="width: 40px; height: 40px; border-radius: 50%; background: #111; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" onmouseenter="this.style.background='#333'" onmouseleave="this.style.background='#111'">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
              <div id="pairs-carousel-track" style="display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 8px;">
                <style>#pairs-carousel-track::-webkit-scrollbar { display: none; }</style>
                {% for p in pairs_col.products %}
                <a href="{{ p.url }}" style="scroll-snap-align: start; flex: 0 0 calc(33.333% - 11px); min-width: 150px; text-decoration: none; color: inherit;">
                  <div style="background: #f0f0f0; border-radius: 12px; overflow: hidden; aspect-ratio: 3/4; position: relative;">
                    {% if p.featured_image %}
                      <img src="{{ p.featured_image | image_url: width: 400 }}" alt="{{ p.title | escape }}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" />
                    {% endif %}
                  </div>
                  <p style="font-weight: 600; font-size: 0.9rem; margin-top: 0.75rem; text-align: center; line-height: 1.3;">{{ p.title }}</p>
                  <p style="font-size: 0.95rem; font-weight: 700; text-align: center; margin-top: 0.25rem;">{{ p.price | money }} {{ shop.currency }}</p>
                </a>
                {% endfor %}
              </div>
            </div>
            {% endif %}
          {% endif %}

          <!-- ── Social Icons (Dynamic Blocks) ── -->"""

text = text.replace(old_checkout_end, new_checkout_and_carousel)

# ───── 3. Update Schema: add blocks + collection picker + pairs_heading ─────
old_schema = re.search(r'\{% schema %\}.*?\{% endschema %\}', text, re.DOTALL)
new_schema = """
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
    },
    {
      "type": "header",
      "content": "Product Information"
    },
    {
      "type": "richtext",
      "id": "size_chart_text",
      "label": "Size Chart Content",
      "default": "<p>S (Chest: 36\\", Length: 28\\")</p><p>M (Chest: 38\\", Length: 29\\")</p><p>L (Chest: 40\\", Length: 30\\")</p>"
    },
    {
      "type": "text",
      "id": "pickup_title",
      "label": "Pickup Title",
      "default": "Pickup available at California Warehouse"
    },
    {
      "type": "text",
      "id": "pickup_time",
      "label": "Pickup Time",
      "default": "Usually ready in 24 hours"
    },
    {
      "type": "text",
      "id": "delivery_text",
      "label": "Delivery Text",
      "default": "Free delivery within 2 days"
    },
    {
      "type": "text",
      "id": "returns_text",
      "label": "Returns Text",
      "default": "Free + easy returns"
    },
    {
      "type": "header",
      "content": "Pairs Well With"
    },
    {
      "type": "collection",
      "id": "pairs_collection",
      "label": "Collection for Pairs Well With"
    },
    {
      "type": "text",
      "id": "pairs_heading",
      "label": "Heading Text",
      "default": "PAIRS WELL WITH"
    }
  ],
  "blocks": [
    {
      "type": "social_icon",
      "name": "Social Icon",
      "settings": [
        {
          "type": "url",
          "id": "social_url",
          "label": "Link URL"
        },
        {
          "type": "html",
          "id": "social_icon_svg",
          "label": "Icon SVG Code",
          "info": "Paste an SVG icon here (24x24 recommended). Example: <svg width=\\"24\\" height=\\"24\\" ...></svg>"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Product Layout",
      "blocks": [
        {
          "type": "social_icon",
          "settings": {
            "social_url": "https://facebook.com",
            "social_icon_svg": "<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\"><path d=\\"M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.03 11.46 5.6 13.72 5.6c1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.77-1.64 1.56V12h2.8l-.45 3h-2.35v6.8A10.02 10.02 0 0 0 22 12z\\"/></svg>"
          }
        },
        {
          "type": "social_icon",
          "settings": {
            "social_url": "https://x.com",
            "social_icon_svg": "<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\"><path d=\\"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z\\"/></svg>"
          }
        },
        {
          "type": "social_icon",
          "settings": {
            "social_url": "https://pinterest.com",
            "social_icon_svg": "<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\"><path d=\\"M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z\\"/></svg>"
          }
        },
        {
          "type": "social_icon",
          "settings": {
            "social_url": "https://t.me",
            "social_icon_svg": "<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\"><path d=\\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.38-.63-.22-1.12-.34-1.08-.72.02-.2.27-.41.77-.63 3.03-1.31 5.04-2.18 6.06-2.61 2.88-1.21 3.48-1.42 3.86-1.43.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06-.01.13-.03.25z\\"/></svg>"
          }
        },
        {
          "type": "social_icon",
          "settings": {
            "social_url": "https://wa.me",
            "social_icon_svg": "<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\"><path d=\\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.574-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c0-5.445 4.454-9.88 9.896-9.88 2.65 0 5.145 1.035 7.018 2.912 1.873 1.873 2.905 4.36 2.905 7.01 0 5.438-4.444 9.88-9.935 9.88h.001M22 12.015c0-5.5-4.475-9.988-9.96-9.988S2.08 6.516 2.08 12.015c0 1.754.457 3.46 1.328 4.97L2 22l5.127-1.346A9.914 9.914 0 0012.04 22c5.485 0 9.96-4.488 9.96-9.985\\"/></svg>"
          }
        },
        {
          "type": "social_icon",
          "settings": {
            "social_url": "mailto:hello@example.com",
            "social_icon_svg": "<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\"><path d=\\"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z\\"/></svg>"
          }
        }
      ]
    }
  ]
}
{% endschema %}
"""

if old_schema:
    text = text.replace(old_schema.group(0), new_schema)

# ───── 4. Add scrollPairsCarousel JS function to the script block ─────
# Insert right before </script>
text = text.replace('})();\n</script>', """})();

  /* ── Pairs Well With Carousel ── */
  function scrollPairsCarousel(dir) {
    const track = document.getElementById('pairs-carousel-track');
    if (!track) return;
    const card = track.querySelector('a');
    const scrollAmt = card ? card.offsetWidth + 16 : 200;
    track.scrollBy({ left: dir * scrollAmt, behavior: 'smooth' });
  }
</script>""")

with open('sections/main-product.liquid', 'w', encoding='utf-8') as f:
    f.write(text)

print("Patch applied successfully.")
