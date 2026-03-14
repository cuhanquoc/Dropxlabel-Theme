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
      if (!ensureElements()) return;
      refreshDrawerSection();
      if (isOpen) return;
      isOpen = true;
      document.body.style.overflow = 'hidden';
      document.body.classList.add('cart-drawer-open');
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
      document.body.classList.remove('cart-drawer-open');
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

    function syncCartBadgesFromCartObject(cart) {
      if (!cart) return;
      const n = cart.item_count || 0;
      document.querySelectorAll('.cart-count').forEach(cartCount => {
        cartCount.textContent = n;
        cartCount.style.display = n > 0 ? '' : 'none';
      });
      const mobBadge = document.getElementById('mob-nav-cart-badge');
      if (mobBadge) {
        mobBadge.textContent = n;
        mobBadge.style.display = n > 0 ? '' : 'none';
      }
      document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: cart } }));
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
          const newDrawer = doc.getElementById('cart-drawer');

          if (newDrawer) {
            const curDrawer = document.getElementById('cart-drawer');
            if (curDrawer) {
              curDrawer.dataset.cdGiftVariantId = newDrawer.dataset.cdGiftVariantId || '';
              curDrawer.dataset.cdGiftLineKeys = newDrawer.dataset.cdGiftLineKeys || '';
            }
          }

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

          /* Update grand total if present */
          const newGrand = doc.getElementById('cd-grand-total');
          const curGrand = document.getElementById('cd-grand-total');
          if (newGrand && curGrand) curGrand.textContent = newGrand.textContent;

          /* Sync header cart badge */
          fetch('/cart.js')
            .then(r => r.json())
            .then(syncCartBadgesFromCartObject)
            .catch(() => {});

          setLoading(false);
        })
        .catch(() => setLoading(false));
    }

    function updateCartNote(note) {
      fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ note: note || '' })
      })
        .then(r => r.json())
        .then(syncCartBadgesFromCartObject)
        .catch(() => {});
    }

    function addItem(variantId, quantity) {
      return fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: parseInt(variantId, 10), quantity: quantity || 1 })
      }).then(r => r.json());
    }

    function removeLineByKey(key) {
      return fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: key, quantity: 0 })
      }).then(r => r.json());
    }

    function toggleGiftWrap(enabled) {
      if (!ensureElements()) return;
      const variantId = (DRAWER.dataset.cdGiftVariantId || '').trim();
      const lineKeys = (DRAWER.dataset.cdGiftLineKeys || '')
        .split('||')
        .map(v => v.trim())
        .filter(Boolean);

      if (!variantId) {
        return;
      }

      setLoading(true);
      if (enabled) {
        const reco = document.querySelector('.cd-reco');
        if (reco) reco.style.display = 'none';
        addItem(variantId, 1)
          .then(() => refreshDrawerSection())
          .catch(() => setLoading(false));
        return;
      }

      if (!lineKeys.length) {
        refreshDrawerSection();
        return;
      }

      Promise.all(lineKeys.map(removeLineByKey))
        .then(() => refreshDrawerSection())
        .catch(() => setLoading(false));
    }

    /* ESC key support */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) close();
    });

    return {
      open,
      close,
      toggle,
      removeItem,
      updateQty,
      updateCartNote,
      refresh: refreshDrawerSection,
      toggleGiftWrap
    };

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
      return;
    }

    /* Toggle order note panel */
    const noteToggle = e.target.closest('[data-cd-note-toggle]');
    if (noteToggle) {
      const panel = document.querySelector('[data-cd-note-panel]');
      if (panel) {
        const drawer = document.getElementById('cart-drawer');
        if (drawer) {
          drawer.scrollTo({ top: drawer.scrollHeight, behavior: 'smooth' });
        }
        const isOpen = panel.classList.toggle('is-open');
        noteToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        const plus = noteToggle.querySelector('.cd-note-plus');
        if (plus) plus.textContent = isOpen ? '−' : '+';
      }
      return;
    }

    /* Save order note */
    const noteSave = e.target.closest('[data-cd-note-save]');
    if (noteSave) {
      const input = document.querySelector('[data-cd-note-input]');
      const note = input ? input.value : '';
      if (window.CartDrawer && typeof window.CartDrawer.updateCartNote === 'function') {
        window.CartDrawer.updateCartNote(note);
      }
      return;
    }

    /* Recommendation carousel nav */
    const prevBtn = e.target.closest('[data-cd-reco-prev]');
    const nextBtn = e.target.closest('[data-cd-reco-next]');
    if (prevBtn || nextBtn) {
      const track = document.querySelector('[data-cd-reco-track]');
      if (!track) return;
      const step = 187;
      const dir = nextBtn ? 1 : -1;
      track.scrollBy({ left: dir * step, behavior: 'smooth' });
    }
  });

  document.addEventListener('change', function (e) {
    const giftWrapInput = e.target.closest('[data-cd-gift-wrap]');
    if (!giftWrapInput) return;
    if (window.CartDrawer && typeof window.CartDrawer.toggleGiftWrap === 'function') {
      window.CartDrawer.toggleGiftWrap(giftWrapInput.checked);
    }
  });
