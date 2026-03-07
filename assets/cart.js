/* CART.JS — Extracted from cart-drawer.liquid */
  /* ─────────────────────────────────────────────────────
     CartDrawer — GSAP-powered slide-in/out
     Requires: gsap.min.js (loaded in theme.liquid)
  ───────────────────────────────────────────────────── */
  window.CartDrawer = (function () {

    const DRAWER  = document.getElementById('cart-drawer');
    const OVERLAY = document.getElementById('cart-overlay');
    let   isOpen  = false;

    function open() {
      if (isOpen) return;
      isOpen = true;
      document.body.style.overflow = 'hidden';
      OVERLAY.classList.add('open');

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(DRAWER,
          { x: '100%' },
          { x: '0%', duration: 0.6, ease: 'power4.out' }
        );
      } else {
        DRAWER.style.transform = 'translateX(0)';
      }
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      document.body.style.overflow = '';
      OVERLAY.classList.remove('open');

      if (typeof gsap !== 'undefined') {
        gsap.to(DRAWER, {
          x: '100%',
          duration: 0.45,
          ease: 'power3.in'
        });
      } else {
        DRAWER.style.transform = 'translateX(100%)';
      }
    }

    function toggle() {
      isOpen ? close() : open();
    }

    /* Remove item via Shopify AJAX Cart API */
    function removeItem(key) {
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: 0 })
      })
      .then(r => r.json())
      .then(refreshDrawer)
      .catch(console.error);
    }

    /* Update quantity via AJAX */
    function updateQty(key, qty) {
      if (qty < 0) return;
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: qty })
      })
      .then(r => r.json())
      .then(refreshDrawer)
      .catch(console.error);
    }

    /* Refresh visible subtotal + count without page reload */
    function refreshDrawer(cart) {
      const subtotalEl = document.getElementById('cd-subtotal');
      const countEl    = document.getElementById('cd-count');

      if (subtotalEl) {
        subtotalEl.textContent = (cart.total_price / 100).toLocaleString('vi-VN') + '₫';
      }
      if (countEl) {
        const n = cart.item_count;
        countEl.textContent = n + (n === 1 ? ' item' : ' items');
      }

      /* Full re-render via page reload on item removal for simplicity;
         replace with Liquid template fetch for SPA behaviour */
      window.location.reload();
    }

    /* ESC key support */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) close();
    });

    return { open, close, toggle, removeItem, updateQty };

  }());
