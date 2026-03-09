---
name: shopify-os2-architecture
description: >
  Shopify Online Store 2.0 architecture patterns for Liquid sections with
  Tailwind CSS, GSAP animations, and Web Components. Use when refactoring
  sections, adding new sections, converting inline styles, or debugging
  Liquid + JS interactions. Triggers on tasks involving Shopify sections,
  Liquid templates, GSAP ScrollTrigger, Tailwind in Shopify context, or
  Web Component architecture for Shopify themes.
---

# Shopify OS 2.0 Architecture Skill

## 1. Section File Structure (Zero Inline Styles)

Every section MUST follow this clean structure — no `<style>` block, no inline `style=""` (except dynamic Liquid values).

```liquid
<custom-element class="block [tailwind-classes]">
  <!-- HTML content with Tailwind utility classes ONLY -->

  <!-- Dynamic Liquid values are the ONLY acceptable inline styles -->
  <div style="--dynamic-var: {{ section.settings.value }};">
    <span style="color: {{ section.settings.color }};">
      {{ section.settings.text }}
    </span>
  </div>
</custom-element>

{% schema %}
{
  "name": "Section Name",
  "tag": "section",
  "class": "section-name-section",
  "settings": [ ... ],
  "presets": [{ "name": "Section Name" }]
}
{% endschema %}
```

### What goes WHERE:

| Content | Location |
|---------|----------|
| Tailwind utility classes | On the HTML element's `class` attribute |
| `@keyframes`, animations | `src/input.css` (global Tailwind source) |
| Component CSS (hover, transitions) | `src/input.css` with `@apply` |
| Dynamic Liquid-driven values | Inline `style=""` (ONLY acceptable case) |
| Schema | Bottom of section file, untouched |

---

## 2. Web Component Pattern

Every section with JavaScript behavior MUST use a Custom Element defined in `assets/animations.js` (or a dedicated `assets/section-name.js`).

```javascript
class SectionName extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.init();
  }

  disconnectedCallback() {
    // IMPORTANT: Clean up ScrollTriggers, IntersectionObservers, 
    // event listeners. Critical for Shopify theme editor hot-reload.
  }

  init() {
    // ALWAYS use this.querySelector() — NEVER document.getElementById()
    const el = this.querySelector('.target-class');
    if (!el) return;

    // GSAP animation logic scoped to this element
    if (typeof gsap !== 'undefined') {
      gsap.to(el, { ... });
    }
  }
}
customElements.define('section-name', SectionName);
```

### Rules:
- Define Web Components **BEFORE** `DOMContentLoaded` in `animations.js`
- Use `this.querySelector()` and `this.querySelectorAll()` for **scoped** DOM queries
- Implement `disconnectedCallback()` for cleanup (Shopify theme editor re-renders sections)
- Class name = PascalCase of the hyphenated tag name (`hero-banner` → `HeroBanner`)
- Check `typeof gsap !== 'undefined'` before using GSAP (it loads async)

### File Loading:
```liquid
<!-- In layout/theme.liquid -->
<script src="{{ 'animations.js' | asset_url }}" defer></script>
```
The `defer` attribute ensures the script runs after HTML parsing, so `connectedCallback()` fires with the full DOM available.

---

## 3. Tailwind Conversion Reference

### Common Inline Style → Tailwind Mappings

| Inline Style | → Tailwind Class |
|---|---|
| `font-family: var(--font-heading)` | `font-heading` |
| `font-family: var(--font-body)` | `font-body` |
| `color: var(--color-accent)` | `text-accent` |
| `font-size: 9px` | `text-[9px]` |
| `font-size: clamp(a, b, c)` | `text-[clamp(a,b,c)]` (no spaces!) |
| `font-weight: 600` | `font-semibold` |
| `font-weight: 700` | `font-bold` |
| `line-height: 0.9` | `leading-[0.9]` |
| `line-height: 1.8` | `leading-[1.8]` |
| `letter-spacing: 0.3em` | `tracking-[0.3em]` |
| `text-transform: uppercase` | `uppercase` |
| `max-width: 780px` | `max-w-[780px]` |
| `margin-bottom: 32px` | `mb-8` |
| `margin-bottom: 28px` | `mb-7` |
| `margin-bottom: 40px` | `mb-10` |
| `padding-bottom: 14vh` | `pb-[14vh]` |
| `color: #ffffff` | `text-white` |
| `color: rgba(255,255,255,0.72)` | `text-white/[0.72]` |
| `background-color: #0a0a0a` | `bg-[#0a0a0a]` |
| `border-radius: 9999px` | `rounded-full` |
| `border-radius: 50%` | `rounded-full` |
| `margin-left: -26px` | `ml-[-26px]` |
| `padding-left: 44px` | `pl-[44px]` |
| `bottom: 2.5rem` | `bottom-10` |
| `pointer-events: none` | `pointer-events-none` |
| `user-select: none` | `select-none` |
| Complex gradients | `bg-[linear-gradient(to_right,...)]` (use `_` for spaces) |

### MUST keep as inline `style=""`:
- CSS custom properties set by Liquid: `style="--speed: {{ value }}s;"`
- Colors from Liquid color pickers: `style="color: {{ settings.color }};"`
- Any value that changes per-section instance via Liquid `{{ }}`

---

## 4. CSS Organization in `src/input.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ═══ Section: Hero Banner ═══ */
@keyframes kenBurns { ... }
@keyframes fadeSlideUp { ... }
.hero-image { @apply w-full h-full object-cover; animation: ...; }
.hero-eyebrow { animation: fadeSlideUp 1s ...; }

/* ═══ Section: Brand Story Bento ═══ */
...

/* ═══ Components: Shared (e.g. buttons used across sections) ═══ */
.maya-merge-btn { @apply inline-flex items-center ...; }
```

### Rules:
- **Group by section**, then shared components at the bottom
- Use `@apply` for Tailwind-equivalent properties (e.g., `@apply flex items-center`)
- Keep non-Tailwind CSS as **raw CSS** (animations, keyframes, transitions, cubic-bezier)
- **Responsive in HTML**: Prefer Tailwind breakpoints on elements (`md:px-10 lg:px-14`)
- **Responsive in CSS**: Use `@media` only for component-internal overrides that can't be expressed inline
- After editing `src/input.css`, ALWAYS rebuild: `npm run build:css`

---

## 5. GSAP Animation Rules

### Setup
```javascript
document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  
  // Section animations that are NOT Web Components go here
});
```

### Best Practices
- **`once: true`**: Always set on scroll-triggered one-shot animations
- **`gsap.matchMedia()`**: Use for responsive animation variants
- **`immediateRender: false`**: Add to `gsap.from()` to prevent flash-of-styled-content
- **`will-change` cleanup**: Use `onComplete` to clear `will-change` after animation
- **Scoped queries**: In Web Components, always use `this.querySelector()`

### Responsive Animation Pattern
```javascript
const mm = gsap.matchMedia();
mm.add('(min-width: 768px)', () => {
  // Desktop animations
});
mm.add('(max-width: 767px)', () => {
  // Mobile animations (smaller movements, shorter durations)
});
```

---

## 6. Responsive Breakpoints

| Device | Tailwind Prefix | CSS Media Query | Use For |
|--------|----------------|-----------------|---------|
| Mobile | *(default)* | `max-width: 767px` | Base styles, touch-first |
| Tablet+ | `md:` | `min-width: 768px` | Wider padding, desktop grid |
| Desktop | `lg:` | `min-width: 1024px` | Full layout |
| Wide | `xl:` | `min-width: 1280px` | Max-width containers |

### Custom config (`tailwind.config.js`):
```javascript
module.exports = {
  content: [
    './layout/*.liquid',
    './templates/**/*.{liquid,json}',
    './sections/*.liquid',
    './snippets/*.liquid',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F9F8F6',
        text: '#222222',
        accent: '#C5A880',
        muted: '#8A8A8A',
        surface: '#FFFFFF',
        border: '#E8E5DF',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

---

## 7. Pre-flight Checklist (Before Every Deploy)

- [ ] No `<style>` blocks inside any section file
- [ ] No inline `style=""` except dynamic Liquid values
- [ ] All JS sections use Web Component pattern with `this.querySelector()`
- [ ] `disconnectedCallback()` implemented for cleanup
- [ ] `src/input.css` rebuilt with `npm run build:css`
- [ ] Schema block untouched — all `{{ section.settings.* }}` intact
- [ ] Ken Burns / GSAP / CSS animations still functional
- [ ] Responsive: test on mobile viewport (≤ 767px)
- [ ] No console errors in DevTools
