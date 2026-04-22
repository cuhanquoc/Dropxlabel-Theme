# Theme Editor Refactor Audit

## Goal
Refactor the theme so the main merchant-facing content and presentation can be edited in Shopify Customize instead of requiring code edits.

## Constraints
- Preserve existing storefront appearance/behavior unless a setting-binding fix requires adjustment.
- Avoid overwriting unrelated in-progress changes already present in the repo.
- Use real code evidence only; do not assume a setting is wired unless Liquid/JS actually uses it.

## Current repo state at audit start
Uncommitted changes already existed in:
- `config/settings_data.json`
- `sections/customer-help-center.liquid`
- `sections/footer.liquid`
- `templates/index.json`

## Findings so far

### 1) Product page is partially editor-driven already
`sections/main-product.liquid` already defines and uses many section/block settings, including:
- `price_promo_text`
- `choose_size_text`
- `choose_color_text`
- `select_size_button_text`
- `add_to_cart_button_text`
- multiple font-size, pickup, delivery, returns, and pairs-well-with settings

This means the product page problem is **not** simply “everything is hardcoded”. It is a hybrid implementation: some parts are properly setting-driven, others are still hardcoded or inconsistently exposed.

### 2) Theme-wide hardcoded merchant text still exists
Observed hardcoded merchant-facing labels/content in:
- `sections/featured-collection.liquid`
- `sections/main-collection.liquid`
- `sections/main-article.liquid`
- `sections/brand-story-bento.liquid`
- parts of `sections/main-product.liquid`
- likely other sections/snippets pending full pass

Examples found during audit:
- `Add to cart`
- `Quick View`
- `Sold out`
- `More` / `Less`
- `SHOP NOW`
- `DESCRIPTION`
- `Social:`

These should be reviewed one by one and exposed to section/block settings where merchant control is expected.

### 3) Homepage is already section-based but not fully merchant-configurable
`templates/index.json` uses editor sections and blocks, but section implementations still contain some hardcoded labels and fallback text that should be moved into schema settings where merchant editing makes sense.

## Refactor phases

### Phase 1 — Product page + homepage core sections
Target files:
- `sections/main-product.liquid`
- `templates/product.json` (only if settings/default block values need alignment)
- homepage core sections such as:
  - `sections/hero-banner.liquid`
  - `sections/featured-collection.liquid`
  - `sections/brand-story-bento.liquid`
  - any homepage section with obvious merchant-facing hardcoded labels

Goals:
- Fix any existing product settings that are defined but not actually wired
- Expose remaining key product labels/messages to editor settings
- Expose homepage CTA/button/utility labels that are still hardcoded
- Keep section/block structure merchant-editable in Customize

### Phase 2 — Collection/article/support/navigation/footer
Target files likely include:
- `sections/main-collection.liquid`
- `sections/main-article.liquid`
- `sections/customer-help-center.liquid`
- `sections/header.liquid`
- `sections/footer.liquid`
- `sections/mobile-*`

Goals:
- Remove remaining high-frequency merchant text hardcodes
- Improve editor control for headings, buttons, utility labels, and repeated content rows

### Phase 3 — Remaining advanced sections + cleanup
- Remaining niche sections/snippets
- Consistency pass on schema naming/defaults
- Documentation of what remains code-only by design

## Verification checklist
- Every new merchant-facing label introduced in markup/JS should come from `section.settings` or `block.settings` when practical
- JS-updated button states should use data attributes sourced from settings instead of hardcoded English strings
- Existing working settings should not regress
- No unrelated user edits should be overwritten
- Run local validation/checks available in repo after edits

## Status
- Audit started
- Product-page binding verified for several existing settings
- Phase 1 implementation in progress
