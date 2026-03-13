/* CART.JS — Extracted from cart-drawer.liquid */
  /* ─────────────────────────────────────────────────────
     CartDrawer — GSAP-powered slide-in/out
     Requires: gsap.min.js (loaded in theme.liquid)
  ───────────────────────────────────────────────────── */
  window.CartDrawer = (function () {

    let DRAWER  = null;
    let OVERLAY = null;
    let isOpen  = false;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function ensureElements() {
      if (!DRAWER)  DRAWER  = document.getElementById('cart-drawer');
      if (!OVERLAY) OVERLAY = document.getElementById('cart-overlay');
      return DRAWER && OVERLAY;
    }

    function open() {
      if (isOpen) return;
      if (!ensureElements()) return;
      isOpen = true;
      document.body.style.overflow = 'hidden';
      OVERLAY.classList.add('open');

      if (typeof gsap !== 'undefined' && !reducedMotion) {
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
      if (!ensureElements()) return;
      isOpen = false;
      document.body.style.overflow = '';
      OVERLAY.classList.remove('open');

      if (typeof gsap !== 'undefined' && !reducedMotion) {
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
      setLoading(true);
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: 0 })
      })
      .then(r => r.json())
      .then(() => refreshDrawerSection())
      .catch(() => setLoading(false));
    }

    /* Update quantity via AJAX */
    function updateQty(key, qty) {
      if (qty < 0) return;
      setLoading(true);
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: qty })
      })
      .then(r => r.json())
      .then(() => refreshDrawerSection())
      .catch(() => setLoading(false));
    }

    /* Loading state: dim items area during AJAX */
    function setLoading(on) {
      const wrap = document.getElementById('cd-items-wrap');
      if (wrap) wrap.style.opacity = on ? '0.5' : '1';
    }

    /* Re-render cart drawer HTML via Shopify Section Rendering API.
       No full page reload — only the cart-drawer snippet content updates. */
    function refreshDrawerSection() {
      fetch('/?sections=cart-drawer')
        .then(r => r.json())
        .then(data => {
          const html = data['cart-drawer'];
          if (!html) { setLoading(false); return; }

          /* Parse the returned section HTML */
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          /* Replace items list */
          const newItems = doc.getElementById('cd-items-wrap');
          const curItems = document.getElementById('cd-items-wrap');
          if (newItems && curItems) curItems.replaceWith(newItems);

          /* Replace footer (subtotal + checkout) */
          const newFooter = doc.querySelector('.cd-footer');
          const curFooter = document.querySelector('#cart-drawer .cd-footer');
          if (newFooter && curFooter) curFooter.replaceWith(newFooter);
          else if (newFooter && !curFooter) document.getElementById('cart-drawer').appendChild(newFooter);
          else if (!newFooter && curFooter) curFooter.remove();

          /* Update header count */
          const newCount = doc.getElementById('cd-count');
          const curCount = document.getElementById('cd-count');
          if (newCount && curCount) curCount.textContent = newCount.textContent;

          /* Sync header cart badge */
          const cartCount = document.querySelector('.cart-count');
          const mobBadge  = document.getElementById('mob-nav-badge');
          fetch('/cart.js')
            .then(r => r.json())
            .then(cart => {
              const n = cart.item_count;
              if (cartCount) {
                cartCount.textContent = n;
                cartCount.style.display = n > 0 ? '' : 'none';
              }
              if (mobBadge) {
                mobBadge.textContent = n;
                mobBadge.style.display = n > 0 ? '' : 'none';
              }
            });

          setLoading(false);
        })
        .catch(() => setLoading(false));
    }

    /* ESC key support */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) close();
    });

    return { open, close, toggle, removeItem, updateQty };

  }());

  /* ── Delegation ── */
  document.addEventListener('click', function (e) {
    /* Overlay or close/continue-shopping button */
    if (e.target.matches('[data-cd-overlay]') || e.target.closest('[data-cd-close]')) {
      window.CartDrawer.close();
      return;
    }
    /* Qty +/− buttons */
    const qtyBtn = e.target.closest('[data-cd-qty]');
    if (qtyBtn) {
      const key = qtyBtn.dataset.key;
      const qty = parseInt(qtyBtn.dataset.qty, 10);
      window.CartDrawer.updateQty(key, qty);
      return;
    }
    /* Remove item button */
    const removeBtn = e.target.closest('[data-cd-remove]');
    if (removeBtn) {
      window.CartDrawer.removeItem(removeBtn.dataset.key);
    }
  });
