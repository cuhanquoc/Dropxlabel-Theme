/**
 * Footer Accordion Mobile v2 — fam2.js
 * Web Component: <footer-accordion-mobile>
 * No jQuery · Vanilla JS ES6+ · Shopify OS 2.0 compliant
 *
 * Anatomy:
 *   .fam2__trigger[aria-controls, aria-expanded]
 *     └── .fam2__icon (plus/minus animated)
 *   .fam2__panel[id]  ← height animated via maxHeight
 *
 * Rules:
 *   - Only one panel open at a time (accordion behaviour)
 *   - Escape key closes active panel
 *   - disconnectedCallback cleans up all listeners
 *   - Guard: if tag already registered, skip re-define
 */

(function () {
  'use strict';

  if (customElements.get('footer-accordion-mobile')) return;

  class FooterAccordionMobile extends HTMLElement {
    constructor() {
      super();
      /** @type {Map<HTMLButtonElement, {panel: HTMLElement, unlisten: Function}>} */
      this._items = new Map();
      this._boundKeydown = this._onKeydown.bind(this);
    }

    /* ── Lifecycle ──────────────────────────────────────────────── */

    connectedCallback() {
      this._build();
    }

    disconnectedCallback() {
      this._cleanup();
    }

    /* ── Build ──────────────────────────────────────────────────── */

    _build() {
      const triggers = /** @type {NodeListOf<HTMLButtonElement>} */ (
        this.querySelectorAll('.fam2__trigger')
      );

      triggers.forEach((trigger) => {
        const panelId = trigger.getAttribute('aria-controls');
        const panel = panelId ? this.querySelector(`#${panelId}`) : null;

        if (!panel) return;

        // Ensure closed state on mount
        this._close(trigger, panel, false /* no transition on mount */ );

        const onClick = () => this._toggle(trigger, panel);
        trigger.addEventListener('click', onClick);

        this._items.set(trigger, {
          panel,
          unlisten: () => trigger.removeEventListener('click', onClick),
        });
      });

      // Global Escape key handler
      document.addEventListener('keydown', this._boundKeydown);
    }

    /* ── Toggle ─────────────────────────────────────────────────── */

    _toggle(trigger, panel) {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        this._close(trigger, panel);
      } else {
        // Close any currently open item first
        this._closeAll();
        this._open(trigger, panel);
      }
    }

    _open(trigger, panel) {
      trigger.setAttribute('aria-expanded', 'true');
      panel.classList.add('is-open');
      // Set scrollHeight so CSS transition can animate
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }

    _close(trigger, panel, animate = true) {
      trigger.setAttribute('aria-expanded', 'false');
      panel.classList.remove('is-open');

      if (!animate) {
        panel.style.maxHeight = '0';
        return;
      }

      // Animate from current height → 0
      panel.style.maxHeight = panel.scrollHeight + 'px';
      // Force reflow so transition fires
      panel.getBoundingClientRect();
      panel.style.maxHeight = '0';
    }

    _closeAll() {
      this._items.forEach(({ panel }, trigger) => {
        if (trigger.getAttribute('aria-expanded') === 'true') {
          this._close(trigger, panel);
        }
      });
    }

    /* ── Keyboard ───────────────────────────────────────────────── */

    _onKeydown(e) {
      if (e.key !== 'Escape') return;
      this._closeAll();
    }

    /* ── Cleanup ────────────────────────────────────────────────── */

    _cleanup() {
      this._items.forEach(({ unlisten }) => unlisten());
      this._items.clear();
      document.removeEventListener('keydown', this._boundKeydown);
    }
  }

  customElements.define('footer-accordion-mobile', FooterAccordionMobile);
})();
