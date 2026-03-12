/**
 * footer-accordion-mobile.js
 * Namespaced under window.FAM — no jQuery, no global pollution.
 *
 * Behaviour:
 *  • Mobile: single-open accordion (configurable via data-fam-multi on .fam-list)
 *  • Desktop (≥768 px): accordions are always-visible, clicks disabled
 *  • Uses real measured scrollHeight for smooth height animation
 *  • Respects prefers-reduced-motion
 *  • Re-initialises cleanly on Shopify theme-editor section:load / section:reorder
 */

(function () {
  'use strict';

  var FAM = window.FAM || {};
  window.FAM = FAM;

  var DESKTOP_MQ  = window.matchMedia('(min-width: 768px)');
  var REDUCED_MQ  = window.matchMedia('(prefers-reduced-motion: reduce)');
  var OPEN_CLASS  = 'is-open';

  /* ── helpers ────────────────────────────────────────── */

  function q(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qq(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function openPanel(btn, panel) {
    btn.setAttribute('aria-expanded', 'true');
    if (REDUCED_MQ.matches) {
      panel.style.maxHeight = 'none';
      panel.classList.add(OPEN_CLASS);
      return;
    }
    panel.style.maxHeight = panel.scrollHeight + 'px';
    panel.classList.add(OPEN_CLASS);
  }

  function closePanel(btn, panel) {
    btn.setAttribute('aria-expanded', 'false');
    if (REDUCED_MQ.matches) {
      panel.style.maxHeight = '0';
      panel.classList.remove(OPEN_CLASS);
      return;
    }
    /* collapse: set explicit px first so transition works from 'none' */
    panel.style.maxHeight = panel.scrollHeight + 'px';
    /* force reflow */
    panel.offsetHeight; // eslint-disable-line no-unused-expressions
    panel.style.maxHeight = '0';
    panel.classList.remove(OPEN_CLASS);
  }

  /* ── core init ──────────────────────────────────────── */

  FAM.init = function (root) {
    if (!root) return;

    var list     = q('.fam-list', root);
    if (!list) return;

    var isMulti  = list.dataset.famMulti === 'true';
    var buttons  = qq('.fam-trigger', list);

    buttons.forEach(function (btn) {
      /* remove any prior listener to avoid duplicates on theme-editor reload */
      var clone = btn.cloneNode(true);
      btn.parentNode.replaceChild(clone, btn);

      clone.addEventListener('click', function () {
        /* ignore on desktop */
        if (DESKTOP_MQ.matches) return;

        var panelId = this.getAttribute('aria-controls');
        var panel   = document.getElementById(panelId);
        if (!panel) return;

        var isOpen  = this.getAttribute('aria-expanded') === 'true';

        /* single-open: close siblings */
        if (!isMulti) {
          qq('.fam-trigger', list).forEach(function (other) {
            if (other === clone) return;
            var otherId    = other.getAttribute('aria-controls');
            var otherPanel = document.getElementById(otherId);
            if (otherPanel && other.getAttribute('aria-expanded') === 'true') {
              closePanel(other, otherPanel);
            }
          });
        }

        if (isOpen) {
          closePanel(this, panel);
        } else {
          openPanel(this, panel);
        }
      });
    });
  };

  /* ── auto-run on initial load ───────────────────────── */

  function initAll() {
    qq('.fam-root').forEach(function (root) { FAM.init(root); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  /* ── Shopify theme editor events ────────────────────── */

  document.addEventListener('shopify:section:load', function (e) {
    var section = e.target;
    if (section && section.querySelector('.fam-root')) {
      FAM.init(section.querySelector('.fam-root'));
    }
  });

  document.addEventListener('shopify:section:reorder', initAll);

})();
