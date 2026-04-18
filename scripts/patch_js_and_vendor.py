import re

with open('sections/main-product.liquid', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove Vendor completely
# From:
#          <!-- Vendor -->
#          {% if product.vendor != blank %}
#            <p class="product-vendor mb-2" style="font-weight: 500; font-size: 0.9rem;">{{ product.vendor }}</p>
#          {% endif %}
vendor_pattern = r'<!-- Vendor -->\s*\{% if product\.vendor != blank %\}\s*<p class="product-vendor[^>]*>\{\{\s*product\.vendor\s*\}\}</p>\s*\{% endif %\}'
text = re.sub(vendor_pattern, '', text)

# 2. Fix the Stock SVG
stock_svg_pattern = r'<svg id="variant-stock-icon".*?</svg>'
new_stock_svg = """<svg id="variant-stock-icon" width="20" height="20" viewBox="0 0 24 24" fill="#00a82d" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
            </svg>"""
text = re.sub(stock_svg_pattern, new_stock_svg, text, flags=re.DOTALL)

# 3. Completely Rewrite the script block to fix the syntax error
script_pattern = r'<script>\s*/\* ──+.*?MAIN PRODUCT — Variant Selection & UI Logic.*?\s*\(!?function \(\) \{.*?\n</script>'
# Actually let's just find <script> to </script> at the bottom.
match_script = re.search(r'<script>.*?</script>', text, re.DOTALL)
if match_script:
    # There might be multiple scripts. The one we care about is the one with `MAIN PRODUCT — Variant Selection & UI Logic`
    all_scripts = re.finditer(r'<script>.*?</script>', text, re.DOTALL)
    for s in all_scripts:
        if 'updateSelectedVariant' in s.group(0):
            new_script = """<script>
  /* ─────────────────────────────────────────────────
     MAIN PRODUCT — Variant Selection & UI Logic
  ───────────────────────────────────────────────── */

  const productData = [
  {% for v in product.variants %}
    {
      id: {{ v.id }},
      title: {{ v.title | json }},
      option1: {{ v.option1 | json }},
      option2: {{ v.option2 | json }},
      option3: {{ v.option3 | json }},
      price: {{ v.price }},
      compare_at_price: {{ v.compare_at_price | default: 'null' }},
      available: {{ v.available }},
      inventory_management: {{ v.inventory_management | json }},
      inventory_quantity: {{ v.inventory_quantity | default: 0 }}
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
  ];

  /* ── Quantity adjust ── */
  function adjustQty(delta) {
    const input = document.getElementById('qty-input');
    const next  = Math.max(1, parseInt(input.value || 1) + delta);
    input.value = next;
  }

  /* ── Option select ── */
  function selectOption(el, optionName, value) {
    const group = el.closest('[role="radiogroup"]');
    group.querySelectorAll('.size-btn, .color-swatch').forEach(b => b.classList.remove('active'));
    el.classList.add('active');

    const label = document.getElementById('selected-' + optionName.toLowerCase().replace(/\\s+/g, '-'));
    if (label) label.textContent = value.toUpperCase();

    updateSelectedVariant();
  }

  function updateSelectedVariant() {
    /* Collect current selections */
    const selected = {};
    document.querySelectorAll('[data-option-position]').forEach(el => {
      if (el.classList.contains('active')) {
        selected[parseInt(el.dataset.optionPosition)] = el.dataset.optionValue;
      }
    });

    /* Match to a variant */
    const match = productData.find(v =>
      Object.entries(selected).every(([pos, val]) => v['option' + pos] === val)
    );

    if (match) {
      document.getElementById('selected-variant-id').value = match.id;
      
      /* Update price */
      const priceEl = document.getElementById('product-price');
      if (priceEl) priceEl.innerHTML = (match.price / 100).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' {{ shop.currency }}';
      
      /* Update compare at price if exists */
      const compareEl = document.querySelector('.product-price-compare');
      if (compareEl && match.compare_at_price) {
        compareEl.innerHTML = (match.compare_at_price / 100).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' {{ shop.currency }}';
        compareEl.style.display = 'inline';
      } else if (compareEl) {
        compareEl.style.display = 'none';
      }
      
      /* Update add to cart state */
      const btn = document.getElementById('add-to-cart-btn');
      if (btn) {
        btn.disabled = !match.available;
        btn.innerHTML = match.available ? 'Add to Cart' : 'Sold Out';
      }

      /* Update stock text natively */
      const stockEl = document.getElementById('variant-stock-display');
      const stockIcon = document.getElementById('variant-stock-icon');
      if (stockEl && stockIcon) {
        if (match.inventory_management && match.inventory_quantity > 0) {
          stockEl.textContent = match.inventory_quantity + ' in stock';
          stockIcon.setAttribute('fill', '#00a82d');
          stockIcon.style.color = '#00a82d';
          stockEl.style.color = '#111';
        } else if (match.available) {
          stockEl.textContent = 'In stock';
          stockIcon.setAttribute('fill', '#00a82d');
          stockIcon.style.color = '#00a82d';
          stockEl.style.color = '#111';
        } else {
          stockEl.textContent = 'Out of stock';
          stockIcon.setAttribute('fill', '#888');
          stockIcon.style.color = '#888';
          stockEl.style.color = '#888';
        }
      }
    }
  }

  /* ── Product accordion ── */
  function toggleAccordion(trigger) {
    const body     = trigger.nextElementSibling;
    const isOpen   = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', !isOpen);
    body.classList.toggle('open', !isOpen);
  }

  /* ─────────────────────────────────────────────────
     AJAX ADD TO CART
  ───────────────────────────────────────────────── */
  (function () {
    const form   = document.getElementById('product-form');
    const btn    = document.getElementById('add-to-cart-btn');
    if (!form || !btn) return;

    function setBtnLoading() {
      btn.disabled = true;
      btn.style.opacity = '0.65';
      btn.innerHTML = 'Adding...';
    }

    function setBtnSuccess() {
      btn.innerHTML = 'Added!';
      btn.style.opacity = '1';
      btn.disabled = false;
      setTimeout(resetBtn, 1600);
    }

    function setBtnError(msg) {
      btn.innerHTML = msg || 'Try again';
      btn.style.opacity = '1';
      btn.disabled = false;
      setTimeout(resetBtn, 2000);
    }

    function resetBtn() {
      btn.innerHTML = 'Add to Cart';
      btn.disabled  = false;
      btn.style.opacity = '1';
    }

    function refreshCartCount() {
      fetch('/cart.js')
        .then(r => r.json())
        .then(cart => {
          const countEl = document.getElementById('cd-count');
          if (countEl) {
            const n = cart.item_count;
            countEl.textContent = n + (n === 1 ? ' item' : ' items');
          }
          document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = cart.item_count;
            el.style.display = cart.item_count > 0 ? '' : 'none';
          });
          const subtotalEl = document.getElementById('cd-subtotal');
          if (subtotalEl) {
            subtotalEl.textContent = (cart.total_price / 100).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' {{ shop.currency }}';
          }
        })
        .catch(() => {});
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const variantId = document.getElementById('selected-variant-id')?.value;
      const quantity  = parseInt(document.getElementById('qty-input')?.value || 1);

      if (!variantId) { form.submit(); return; }

      setBtnLoading();

      fetch('/cart/add.js', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: parseInt(variantId), quantity: quantity }),
      })
      .then(async r => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.description || 'Could not add item');
        }
        return r.json();
      })
      .then(() => {
        setBtnSuccess();
        refreshCartCount();

        if (typeof window.CartDrawer !== 'undefined') {
          window.CartDrawer.open();
        }
      })
      .catch(err => {
        setBtnError(err.message);
      });
    });
  })();
</script>"""
            text = text.replace(s.group(0), new_script)

with open('sections/main-product.liquid', 'w', encoding='utf-8') as f:
    f.write(text)

print("Patch applied successfully.")
