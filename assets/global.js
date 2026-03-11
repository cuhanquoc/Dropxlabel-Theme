/* ═════════════════════════════════════════════════════
   GLOBAL.JS — Non-animation global utilities
   Extracted from inline scripts for production build
   ═════════════════════════════════════════════════════ */

/* ── Announcement Bar Height ── */
(function () {
  var bar = document.querySelector('.announcement-bar');
  if (bar) {
    document.documentElement.style.setProperty('--ab-height', bar.offsetHeight + 'px');
  } else {
    document.documentElement.style.setProperty('--ab-height', '0px');
  }
}());

/* ── Mobile Menu Toggle ── */
window.MobileMenu = (function () {
  var menu = document.getElementById('mobile-menu');
  var btn = document.getElementById('hamburger-btn');
  if (!menu || !btn) return { open: function(){}, close: function(){}, toggle: function(){} };
  var isOpen = false;

  function open() {
    if (isOpen) return;
    isOpen = true;
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  function toggle() { isOpen ? close() : open(); }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) close();
  });

  return { open: open, close: close, toggle: toggle };
}());

/* ── Custom Cursor (pointer:fine only) ── */
(function () {
  if (typeof gsap === 'undefined') return;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  var xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
  var yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

  document.addEventListener('mousemove', function (e) {
    if (!cursor.classList.contains('is-active')) cursor.classList.add('is-active');
    xTo(e.clientX);
    yTo(e.clientY);
  });

  document.addEventListener('mouseleave', function () {
    cursor.classList.remove('is-active');
  });

  document.addEventListener('mouseenter', function (e) {
    if (e.target.closest('a, button, .icon-btn, .product-card, .nav-link'))
      cursor.classList.add('is-hover');
  }, true);

  document.addEventListener('mouseleave', function (e) {
    if (e.target.closest('a, button, .icon-btn, .product-card, .nav-link'))
      cursor.classList.remove('is-hover');
  }, true);
}());

/* ── Magnetic Hover (hover devices only) ── */
(function () {
  'use strict';
  if (typeof gsap === 'undefined') return;
  if (!window.matchMedia('(hover: hover)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var PRESETS = {
    soft:   { move: 0.15, enter: 0.35, leave: 0.65 },
    medium: { move: 0.25, enter: 0.30, leave: 0.55 },
    strong: { move: 0.40, enter: 0.25, leave: 0.50 },
  };

  function initMagnetic(el) {
    var strength = el.dataset.magnetic || 'soft';
    var preset = PRESETS[strength] || PRESETS.soft;
    var rect;

    el.addEventListener('mouseenter', function () { rect = el.getBoundingClientRect(); }, { passive: true });
    el.addEventListener('mousemove', function (e) {
      if (!rect) return;
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      gsap.to(el, { x: (e.clientX - cx) * preset.move, y: (e.clientY - cy) * preset.move, duration: preset.enter, ease: 'expo.out', overwrite: 'auto' });
    }, { passive: true });
    el.addEventListener('mouseleave', function () {
      gsap.to(el, { x: 0, y: 0, duration: preset.leave, ease: 'expo.out', overwrite: 'auto' });
      rect = null;
    }, { passive: true });
  }

  function bindAll() {
    document.querySelectorAll('[data-magnetic]').forEach(initMagnetic);
    document.querySelectorAll('.mega-col a, .nav-link, .footer-link, .footer-social').forEach(function (el) {
      if (!el.dataset.magnetic) { el.dataset.magnetic = 'soft'; initMagnetic(el); }
    });
    document.querySelectorAll('.maya-merge-btn, .ta-cta-btn, .icon-btn').forEach(function (el) {
      if (!el.dataset.magnetic) { el.dataset.magnetic = 'medium'; initMagnetic(el); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAll);
  } else {
    bindAll();
  }
}());
