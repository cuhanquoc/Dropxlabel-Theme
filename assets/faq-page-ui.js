(function () {
  'use strict';

  if (customElements.get('faq-page-ui')) return;

  class FaqPageUi extends HTMLElement {
    constructor() {
      super();
      this._items = new Map();
      this._boundKeydown = this._onKeydown.bind(this);
      this._boundResize = this._syncOpenPanels.bind(this);
      this._loaded = false;
      this._isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    connectedCallback() {
      this._build();
      if (!this._loaded) {
        requestAnimationFrame(() => {
          this.classList.add('is-loaded');
          this._loaded = true;
        });
      }
    }

    disconnectedCallback() {
      this._cleanup();
    }

    _build() {
      this._cleanup();

      const triggers = this.querySelectorAll('.faq-page__item-toggle');
      triggers.forEach((trigger) => {
        const panelId = trigger.getAttribute('aria-controls');
        const panel = panelId ? this.querySelector('#' + CSS.escape(panelId)) : null;
        if (!panel) return;

        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        this._setPanelState(trigger, panel, isOpen, false);

        const onClick = () => this._toggle(trigger, panel);
        trigger.addEventListener('click', onClick);
        this._items.set(trigger, {
          panel: panel,
          unlisten: () => trigger.removeEventListener('click', onClick),
        });
      });

      document.addEventListener('keydown', this._boundKeydown);
      window.addEventListener('resize', this._boundResize);
    }

    _cleanup() {
      this._items.forEach((entry) => entry.unlisten());
      this._items.clear();
      document.removeEventListener('keydown', this._boundKeydown);
      window.removeEventListener('resize', this._boundResize);
    }

    _toggle(trigger, panel) {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        this._setPanelState(trigger, panel, false, true);
        return;
      }

      this._items.forEach((entry, otherTrigger) => {
        if (otherTrigger !== trigger) {
          this._setPanelState(otherTrigger, entry.panel, false, true);
        }
      });

      this._setPanelState(trigger, panel, true, true);
    }

    _setPanelState(trigger, panel, expanded, animate) {
      const item = trigger.closest('.faq-page__item');
      trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');

      if (item) {
        item.classList.toggle('is-open', expanded);
      }

      if (expanded) {
        panel.hidden = false;
        panel.classList.add('is-open');
        if (!animate || this._isReducedMotion) {
          panel.style.maxHeight = 'none';
          panel.style.opacity = '1';
          return;
        }

        panel.style.maxHeight = '0px';
        panel.offsetHeight;
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.style.opacity = '1';
        this._afterTransition(panel, () => {
          if (trigger.getAttribute('aria-expanded') === 'true') {
            panel.style.maxHeight = 'none';
          }
        });
        return;
      }

      if (!animate || this._isReducedMotion) {
        panel.classList.remove('is-open');
        panel.style.maxHeight = '0px';
        panel.style.opacity = '0';
        panel.hidden = true;
        return;
      }

      const startHeight = panel.scrollHeight;
      panel.style.maxHeight = startHeight + 'px';
      panel.offsetHeight;
      panel.classList.remove('is-open');
      panel.style.maxHeight = '0px';
      panel.style.opacity = '0';
      this._afterTransition(panel, () => {
        if (trigger.getAttribute('aria-expanded') !== 'true') {
          panel.hidden = true;
        }
      });
    }

    _afterTransition(panel, callback) {
      const handle = function (event) {
        if (event.target !== panel || event.propertyName !== 'max-height') return;
        panel.removeEventListener('transitionend', handle);
        callback();
      };

      panel.addEventListener('transitionend', handle);
    }

    _syncOpenPanels() {
      this._items.forEach((entry, trigger) => {
        if (trigger.getAttribute('aria-expanded') === 'true') {
          entry.panel.style.maxHeight = 'none';
        }
      });
    }

    _onKeydown(event) {
      if (event.key !== 'Escape') return;

      this._items.forEach((entry, trigger) => {
        if (trigger.getAttribute('aria-expanded') === 'true') {
          this._setPanelState(trigger, entry.panel, false, true);
        }
      });
    }
  }

  customElements.define('faq-page-ui', FaqPageUi);
})();
