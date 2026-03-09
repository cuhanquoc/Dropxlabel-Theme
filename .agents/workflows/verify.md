---
description: Post-deploy verification — rebuild CSS, commit, push, and confirm no errors
---

After completing any code change, run this workflow to verify and deploy.

// turbo-all

## Step 1: Rebuild Tailwind CSS
```bash
npm run build:css
```
Wait for the build to complete successfully. If it fails, fix the CSS errors first.

## Step 2: Deploy
```bash
git add -A && git commit -m "update" && git push
```

## Step 3: Confirm
After push completes, the GitHub → Shopify sync will auto-deploy. Confirm with the user that deployment is complete.
