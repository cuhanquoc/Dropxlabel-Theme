/* ═════════════════════════════════════════════════════
   ANIMATIONS.JS — All GSAP ScrollTrigger animations
   Extracted from inline scripts, wrapped in DOMContentLoaded
   ═════════════════════════════════════════════════════ */

/* ═══ Web Component: <hero-banner> ═══ */
class HeroBanner extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.initAnimations();
  }

  initAnimations() {
    if (typeof gsap === 'undefined') return;

    const heading = this.querySelector('.hero-headline');
    if (!heading) return;

    const raw = heading.innerHTML.trim();
    heading.innerHTML = raw.split(/\s+/).map(function (w) {
      return '<span class="hero-word" style="display:inline-block;overflow:hidden;">'
        + '<span style="display:inline-block;transform:translateY(110%)">' + w + '</span></span>';
    }).join(' ');

    const words = heading.querySelectorAll('.hero-word > span');
    gsap.to(words, {
      y: '0%',
      duration: 0.8,
      ease: 'expo.out',
      stagger: 0.15,
      delay: 0.55
    });
  }
}
customElements.define('hero-banner', HeroBanner);

/* ═══ Web Component: <character-morph> ═══
   JolyUI Character Morph → GSAP translation
   Cycles through words with per-character staggered
   blur + 3D rotation entrance/exit animations.
   ═══════════════════════════════════════════ */
class CharacterMorph extends HTMLElement {
  connectedCallback() {
    // Guard: clear any existing timer if element is re-connected (e.g. Shopify section reload)
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }

    this._texts = JSON.parse(this.dataset.texts || '[]');
    this._interval = parseInt(this.dataset.interval) || 3000;
    this._stagger = parseFloat(this.dataset.stagger) || 0.03;
    this._duration = parseFloat(this.dataset.duration) || 0.5;
    this._ease = 'power2.out'; // closest match to [0.215, 0.61, 0.355, 1]
    this._index = 0;
    this._chars = [];
    this._wordEl = this.querySelector('.character-morph-word');

    if (!this._texts.length || typeof gsap === 'undefined' || !this._wordEl) return;

    // Respect prefers-reduced-motion: show first word without animation cycle
    this._prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._showWord(this._texts[0], false);
    if (!this._prefersReducedMotion) {
      this._timer = setInterval(() => this._nextWord(), this._interval);
    }
  }

  disconnectedCallback() {
    if (this._timer) clearInterval(this._timer);
    if (this._tl) this._tl.kill();
  }

  _createChars(text) {
    this._wordEl.innerHTML = '';
    this._chars = [];
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement('span');
      span.className = 'inline-block';
      span.style.transformStyle = 'preserve-3d';
      span.style.willChange = 'transform, opacity, filter';
      span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
      this._wordEl.appendChild(span);
      this._chars.push(span);
    }
  }

  _showWord(text, animate) {
    this._createChars(text);

    if (animate !== false && this._chars.length) {
      const fromProps = {
        opacity: 0,
        y: 20,
        rotationX: -90,
        duration: this._duration,
        stagger: this._stagger,
        ease: this._ease,
        onComplete: () => {
          // Clean up will-change after animation
          this._chars.forEach(function (c) { c.style.willChange = 'auto'; });
        }
      };
      // Only apply GPU-intensive blur when not in reduced-motion mode
      if (!this._prefersReducedMotion) {
        fromProps.filter = 'blur(8px)';
      }
      gsap.from(this._chars, fromProps);
    }
  }

  _nextWord() {
    var self = this;
    if (!this._chars.length) {
      this._index = (this._index + 1) % this._texts.length;
      this._showWord(this._texts[this._index], true);
      return;
    }

    // Exit animation: move up, blur out, rotate
    this._tl = gsap.timeline({
      onComplete: function () {
        self._index = (self._index + 1) % self._texts.length;
        self._showWord(self._texts[self._index], true);
      }
    });

    const exitProps = {
      opacity: 0,
      y: -20,
      rotationX: 90,
      duration: this._duration,
      stagger: this._stagger,
      ease: this._ease
    };
    if (!this._prefersReducedMotion) {
      exitProps.filter = 'blur(8px)';
    }
    this._tl.to(this._chars, exitProps);
  }
}
customElements.define('character-morph', CharacterMorph);

document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Respect prefers-reduced-motion: skip all scroll animations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;


  /* ── Brand Story Bento ── */
  (function () {
    var section = document.getElementById('brand-story-bento');
    if (!section) return;
    var mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', function () {
      gsap.fromTo('#bsb-text', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 80%', once: true } });
      gsap.fromTo('.bsb-card', { y: 50, opacity: 0, willChange: 'transform, opacity' }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: section, start: 'top 75%', once: true }, onComplete: function () { gsap.set('.bsb-card', { clearProps: 'willChange' }); } });
    });

    mm.add('(max-width: 767px)', function () {
      gsap.fromTo('#bsb-text', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 90%', once: true } });
      gsap.fromTo('.bsb-card', { y: 20, opacity: 0, willChange: 'transform, opacity' }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: section, start: 'top 85%', once: true }, onComplete: function () { gsap.set('.bsb-card', { clearProps: 'willChange' }); } });
    });
  }());

  /* ── Trending Accordion — Gradient, Collage, Dynamic Island, Items ── */
  (function () {
    /* Gradient Reveal */
    var curtain = document.getElementById('ta-gradient-curtain');
    var glow = document.getElementById('ta-glow');
    var wrapper = document.getElementById('ta-reveal-wrapper');
    if (curtain && wrapper) {
      var tl = gsap.timeline({ scrollTrigger: { trigger: wrapper, start: 'top 85%', end: 'top 30%', scrub: 0.8 } });
      tl.to(curtain, { opacity: 1, scaleY: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .to(glow, { opacity: 1, duration: 0.3, ease: 'power1.in' }, 0)
        .to(glow, { opacity: 0, duration: 0.4, ease: 'power1.out' }, 0.5);
    }

    /* Scattered Collage */
    var items = document.querySelectorAll('.ta-collage-item');
    items.forEach(function (item, i) {
      var fromX = (i % 2 === 0) ? -60 : 60;
      gsap.fromTo(item,
        { x: fromX, y: 40 + i * 15, rotation: (i % 2 === 0) ? -8 : 8, opacity: 0, scale: 0.85 },
        {
          x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', delay: i * 0.12,
          scrollTrigger: { trigger: '#ta-collage', start: 'top 80%', once: true }
        }
      );
    });

    /* Dynamic Island */
    var island = document.querySelector('.ta-dynamic-island');
    if (island) {
      gsap.fromTo(island, { width: 40, opacity: 0, borderRadius: '50%' }, { width: 'auto', opacity: 1, borderRadius: '22px', duration: 0.8, ease: 'elastic.out(1, 0.75)', scrollTrigger: { trigger: island, start: 'top 90%', once: true } });
    }

    /* Accordion Items */
    var mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', function () {
      var accItems = document.querySelectorAll('#trending-accordion .accordion-item');
      if (accItems.length) {
        gsap.fromTo(accItems, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: '#trending-accordion .flex.flex-col', start: 'top 85%', once: true } });
      }
    });
  }());

  /* ── About Template Animations ── */
  (function () {
    var aboutSection = document.getElementById('about-template');
    if (!aboutSection) return;

    gsap.utils.toArray('.about-fade-in').forEach(function (el) {
      gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });
  }());

  /* ── Footer Entrance ── */
  (function () {
    var footer = document.getElementById('site-footer');
    if (!footer) return;
    var mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', function () {
      gsap.from('#site-footer [data-footer-col]', {
        scrollTrigger: { trigger: footer, start: 'top 88%', once: true },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1, immediateRender: false
      });
      gsap.from('.ft-brand-name', {
        scrollTrigger: { trigger: '.ft-brand-section', start: 'top 90%', once: true },
        y: 30, opacity: 0, duration: 1.2, ease: 'power3.out', immediateRender: false
      });
    });

    mm.add('(max-width: 767px)', function () {
      gsap.from('#site-footer [data-footer-col]', {
        scrollTrigger: { trigger: footer, start: 'top 92%', once: true },
        y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.05, immediateRender: false
      });
    });
  }());

});

/* ═══ JolyUI Button Spotlight — Mouse Tracking ═══
   Updates --joly-mx / --joly-my CSS vars on hover
   to drive the radial-gradient spotlight in input.css.
   Uses event delegation for performance.
   ═══════════════════════════════════════════════ */
(function () {
  var SELECTORS = '.joly-btn, .bsb-cta-btn, .bsb-cta-icon, .bsb-card-link, [data-joly-btn]';

  document.addEventListener('mousemove', function (e) {
    var btn = e.target.closest(SELECTORS);
    if (!btn) return;
    var rect = btn.getBoundingClientRect();
    var mx = ((e.clientX - rect.left) / rect.width * 100);
    var my = ((e.clientY - rect.top) / rect.height * 100);
    btn.style.setProperty('--joly-mx', mx + '%');
    btn.style.setProperty('--joly-my', my + '%');
  }, { passive: true });
}());
