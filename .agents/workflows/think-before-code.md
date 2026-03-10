---
description: Impact analysis workflow — MUST run before ANY code change to prevent regressions and side effects
---

# 🧠 Think Before Code — Impact Analysis

**MANDATORY**: Before making ANY code change, you MUST complete this checklist using the `sequential-thinking` MCP tool. Do NOT skip steps.

## Step 1: Identify the Blast Radius

Use `mcp_sequential-thinking_sequentialthinking` to answer these questions:

1. **What files will this change touch?** List every file that will be modified.
2. **What OTHER files depend on these files?** Check for:
   - Liquid `{% render %}` or `{% include %}` calls that reference these files
   - CSS classes used across multiple sections (grep for the class name)
   - JavaScript global variables or functions called from other files
   - Shopify schema settings referenced in `settings_data.json` or template `.json` files
3. **What CSS selectors am I modifying?** For each selector:
   - `grep_search` for that selector across ALL `.liquid` files and `input.css`
   - If it appears in 2+ files → HIGH RISK, document which files
4. **Am I removing or renaming anything?** If yes:
   - Search the ENTIRE codebase for references before removing
   - Never remove a class/ID/function without confirming zero external references

## Step 2: Map the Dependency Chain

```
Changed File → Which sections use it? → Which templates use those sections? → Which pages are affected?
```

Example:
```
input.css → ALL sections → ALL templates → ALL pages (FULL BLAST RADIUS)
header.liquid → layout/theme.liquid → ALL pages
quick-view-modal.liquid → featured-collection.liquid → index, collection pages
```

## Step 3: CSS Conflict Check

Before adding or modifying CSS:

1. **Check for selector collisions**: `grep_search` for the exact selector name in `src/input.css`
2. **Check for specificity wars**: Look for `!important` on any rule you're modifying
3. **Check media query order**: Ensure mobile-first ordering (min-width) or desktop-first (max-width) is consistent
4. **Check for Liquid-dependent CSS**: If the CSS contains `{{ }}` Liquid tags, it CANNOT go in `input.css` — it must stay inline

## Step 4: Before/After Snapshot

1. Note the current state of affected sections (take mental inventory or screenshot)
2. Make the change
3. Immediately verify ALL affected sections still render correctly

## Step 5: Rollback Plan

Before committing:
- Can this change be reverted with a single `git revert`?
- Are there any database/schema changes that can't be reverted?
- Document what to undo if the change causes issues

---

## Quick Reference: Common Side Effects

| Change Type | Common Side Effect | Prevention |
|---|---|---|
| Modify CSS class | Breaks other sections using same class | Grep for class across all `.liquid` files |
| Remove `<style>` block | Styles disappear if not in `input.css` | Verify CSS exists in `input.css` before removing |
| Add new CSS | Overrides existing styles via cascade | Check specificity and source order |
| Move JS function | Breaks onclick handlers in HTML | Grep for function name across all files |
| Rename snippet | `{% render %}` calls break | Search for old name in all sections |
| Edit schema | Shopify admin breaks | Check `settings_data.json` for matching keys |
| Add `!important` | Creates specificity debt | Almost never use — find root cause instead |
