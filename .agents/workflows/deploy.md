---
description: How to deploy changes to the Shopify theme after editing code
---

After every code change is completed, do a quality check first, then push to GitHub so it auto-deploys to Shopify.

// turbo-all

## Step 1: Review & Bug Check
Before pushing, always review the code you just changed:
- Re-read the modified code to catch syntax errors, typos, or missing closing tags/brackets
- Check CSS for cascade issues (global styles overriding mobile media queries, etc.)
- Verify the UI will look correct — check spacing, alignment, colors, font sizes
- On Liquid files: ensure Shopify schema is valid JSON and all settings are properly referenced
- If possible, open the live site in the browser tool to visually verify the changes look correct on both desktop and mobile

## Step 2: Stage changed files
```bash
git add -A
```

## Step 3: Commit with a descriptive message
```bash
git commit -m "<descriptive message about changes>"
```

## Step 4: Push to GitHub
```bash
git push origin main
```

## Step 5: Notify
Inform the user that changes have been pushed and they should wait for GitHub to sync to Shopify, then hard refresh the page (Cmd+Shift+R).
