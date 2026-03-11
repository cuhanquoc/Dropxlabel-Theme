/**
 * product-form.js
 * Web Component: <product-form>
 * Encapsulates all product page JS logic with scoped selectors.
 * Replaces the inline <script> block in main-product.liquid.
 */

class ProductForm extends HTMLElement {
  connectedCallback() {
    // Parse variant data embedded by Liquid
    const dataEl = this.querySelector('[data-product-variants]');
    this._variants = dataEl ? JSON.parse(dataEl.textContent) : [];
    this._currency = this.dataset.currency || '';

    this._bindEvents();
  }

  disconnectedCallback() {
    // Remove delegated listeners when element is removed (Theme Editor)
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('mouseover', this._onMouseover);
    this.removeEventListener('mouseout', this._onMouseout);
    const form = this.querySelector('[data-product-form]');
    if (form) form.removeEventListener('submit', this._onSubmit);
  }

  _bindEvents() {
    this._onClick = this._handleClick.bind(this);
    this._onMouseover = this._handleMouseover.bind(this);
    this._onMouseout = this._handleMouseout.bind(this);

    this.addEventListener('click', this._onClick);
    this.addEventListener('mouseover', this._onMouseover);
    this.addEventListener('mouseout', this._onMouseout);

    // AJAX Add to Cart
    const form = this.querySelector('[data-product-form]');
    if (form) {
      this._onSubmit = this._handleSubmit.bind(this);
      form.addEventListener('submit', this._onSubmit);
    }
  }

  /* ── Click delegation ── */
  _handleClick(e) {
    // Size chart open
    if (e.target.closest('[data-action="open-size-chart"]')) {
      const modal = this.querySelector('#size-chart-modal');
      if (modal) modal.showModal();
      return;
    }

    // Size chart close
    if (e.target.closest('[data-action="close-size-chart"]')) {
      const modal = this.querySelector('#size-chart-modal');
      if (modal) modal.close();
      return;
    }

    // Option buttons (color swatches / size text)
    const optBtn = e.target.closest('[data-option-position][data-option-value]');
    if (optBtn) {
      const group = optBtn.closest('[role="radiogroup"]');
      if (group) {
        group.querySelectorAll('.size-btn, .color-swatch').forEach(b => b.classList.remove('active'));
      }
      optBtn.classList.add('active');

      // Update selected label
      const pos = optBtn.dataset.optionPosition;
      const val = optBtn.dataset.optionValue;
      const label = this.querySelector(`[data-option-label="${pos}"]`);
      if (label) label.textContent = val.toUpperCase();

      this._updateVariant();
      return;
    }

    // Quantity stepper
    const qtyBtn = e.target.closest('[data-qty-btn]');
    if (qtyBtn) {
      const input = this.querySelector('[data-qty-input]');
      if (input) {
        input.value = Math.max(1, parseInt(input.value || 1) + parseInt(qtyBtn.dataset.qtyBtn, 10));
      }
      return;
    }

    // Wishlist toggle
    const wishBtn = e.target.closest('[data-wishlist-btn]');
    if (wishBtn) {
      wishBtn.classList.toggle('wishlisted');
      const svg = wishBtn.querySelector('svg');
      if (svg) svg.style.fill = wishBtn.classList.contains('wishlisted') ? 'currentColor' : 'none';
      return;
    }

    // Pairs carousel navigation
    const carouselBtn = e.target.closest('[data-carousel-dir]');
    if (carouselBtn) {
      const track = this.querySelector('[data-carousel-track]');
      if (track) {
        const card = track.querySelector('a');
        const amt = card ? card.offsetWidth + 16 : 200;
        track.scrollBy({ left: parseInt(carouselBtn.dataset.carouselDir, 10) * amt, behavior: 'smooth' });
      }
      return;
    }

    // Thumbnail → update main image
    const thumbBtn = e.target.closest('[data-thumb-url]');
    if (thumbBtn) {
      const main = this.querySelector('[data-main-image]');
      if (main) {
        main.src = thumbBtn.dataset.thumbUrl;
        main.srcset = thumbBtn.dataset.thumbSrcset || '';
      }
      return;
    }

    // Accordion triggers
    const accordionBtn = e.target.closest('.product-accordion-trigger');
    if (accordionBtn) {
      this._toggleAccordion(accordionBtn);
    }
  }

  /* ── Hover effects ── */
  _handleMouseover(e) {
    const carouselBtn = e.target.closest('[data-carousel-dir]');
    if (carouselBtn) { carouselBtn.style.opacity = '0.8'; return; }

    const sizeBtn = e.target.closest('[data-option-value].size-btn:not(.active)');
    if (sizeBtn) sizeBtn.style.backgroundColor = '#f5f5f5';
  }

  _handleMouseout(e) {
    const carouselBtn = e.target.closest('[data-carousel-dir]');
    if (carouselBtn) { carouselBtn.style.opacity = '1'; return; }

    const sizeBtn = e.target.closest('[data-option-value].size-btn:not(.active)');
    if (sizeBtn) sizeBtn.style.backgroundColor = 'transparent';
  }

  /* ── Variant matching ── */
  _updateVariant() {
    const selected = {};
    this.querySelectorAll('[data-option-position][data-option-value].active').forEach(el => {
      selected[parseInt(el.dataset.optionPosition)] = el.dataset.optionValue;
    });

    const match = this._variants.find(v =>
      Object.entries(selected).every(([pos, val]) => v['option' + pos] === val)
    );
    if (!match) return;

    // Update hidden variant ID input
    const vidInput = this.querySelector('[data-variant-id]');
    if (vidInput) vidInput.value = match.id;

    // Update price
    const priceEl = this.querySelector('[data-product-price]');
    if (priceEl) {
      priceEl.innerHTML = this._formatMoney(match.price) + ' ' + this._currency;
    }

    // Update compare-at price
    const compareEl = this.querySelector('[data-compare-price]');
    if (compareEl) {
      if (match.compare_at_price) {
        compareEl.textContent = this._formatMoney(match.compare_at_price) + ' ' + this._currency;
        compareEl.style.display = 'inline';
      } else {
        compareEl.style.display = 'none';
      }
    }

    // Update ATC button
    const btn = this.querySelector('[data-atc-btn]');
    if (btn) {
      btn.disabled = !match.available;
      btn.textContent = match.available ? 'Add to Cart' : 'Sold Out';
    }

    // Update stock status
    const stockEl = this.querySelector('[data-stock-text]');
    const stockIcon = this.querySelector('[data-stock-icon]');
    if (stockEl) {
      if (match.inventory_management && match.inventory_quantity > 0) {
        stockEl.textContent = match.inventory_quantity + ' in stock';
        if (stockIcon) { stockIcon.style.color = '#00a82d'; }
        stockEl.style.color = '#111';
      } else if (match.available) {
        stockEl.textContent = 'In stock';
        if (stockIcon) { stockIcon.style.color = '#00a82d'; }
        stockEl.style.color = '#111';
      } else {
        stockEl.textContent = 'Out of stock';
        if (stockIcon) { stockIcon.style.color = '#888'; }
        stockEl.style.color = '#888';
      }
    }
  }

  /* ── Accordion ── */
  _toggleAccordion(trigger) {
    const allTriggers = this.querySelectorAll('.product-accordion-trigger');
    const allBodies   = this.querySelectorAll('.product-accordion-body');
    const body        = trigger.nextElementSibling;
    const isOpen      = trigger.getAttribute('aria-expanded') === 'true';

    allTriggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
    allBodies.forEach(b => b.classList.remove('open'));

    if (!isOpen) {
      trigger.setAttribute('aria-expanded', 'true');
      if (body) body.classList.add('open');
    }
  }

  /* ── AJAX Add to Cart ── */
  _handleSubmit(e) {
    e.preventDefault();

    const vidInput = this.querySelector('[data-variant-id]');
    const qtyInput = this.querySelector('[data-qty-input]');
    const btn      = this.querySelector('[data-atc-btn]');

    if (!vidInput || !btn) { e.target.submit(); return; }

    const variantId = parseInt(vidInput.value);
    const quantity  = parseInt(qtyInput?.value || 1);

    this._setBtnState(btn, 'loading');

    fetch('/cart/add.js', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity }),
    })
    .then(async r => {
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.description || 'Could not add item');
      }
      return r.json();
    })
    .then(() => {
      this._setBtnState(btn, 'success');
      this._refreshCartCount();
      if (typeof window.CartDrawer !== 'undefined') window.CartDrawer.open();
    })
    .catch(err => {
      this._setBtnState(btn, 'error', err.message);
    });
  }

  _setBtnState(btn, state, msg) {
    const states = {
      loading: { text: 'Adding...', disabled: true,  opacity: '0.65' },
      success: { text: 'Added!',    disabled: false, opacity: '1'    },
      error:   { text: msg || 'Try again', disabled: false, opacity: '1' },
      reset:   { text: 'Add to Cart', disabled: false, opacity: '1'  },
    };
    const s = states[state];
    btn.innerHTML = s.text;
    btn.disabled  = s.disabled;
    btn.style.opacity = s.opacity;

    if (state === 'success') setTimeout(() => this._setBtnState(btn, 'reset'), 1600);
    if (state === 'error')   setTimeout(() => this._setBtnState(btn, 'reset'), 2000);
  }

  _refreshCartCount() {
    fetch('/cart.js')
      .then(r => r.json())
      .then(cart => {
        document.querySelectorAll('.cart-count').forEach(el => {
          el.textContent = cart.item_count;
          el.style.display = cart.item_count > 0 ? '' : 'none';
        });
        const cdCount = document.getElementById('cd-count');
        if (cdCount) {
          const n = cart.item_count;
          cdCount.textContent = n + (n === 1 ? ' item' : ' items');
        }
        const subtotalEl = document.getElementById('cd-subtotal');
        if (subtotalEl) {
          subtotalEl.textContent = this._formatMoney(cart.total_price) + ' ' + this._currency;
        }
      })
      .catch(() => {});
  }

  _formatMoney(cents) {
    return (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

customElements.define('product-form', ProductForm);
