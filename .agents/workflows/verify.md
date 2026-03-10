---
description: Post-deploy verification — rebuild CSS, commit, push, and confirm no errors
---

After completing any code change, run this workflow to verify and deploy.

// turbo-all

## Step 0: Pre-Push Audit (BẮT BUỘC)

Trước khi build hay push, chạy workflow `/pre-push` để kiểm tra 8 nhóm lỗi.  
**Chỉ tiếp tục Step 1 nếu không có ❌ FAIL.**

```bash
git diff --name-only HEAD
```

## Step 1: Rebuild Tailwind CSS
```bash
npm run build:css
```
Wait for the build to complete successfully. If it fails, fix the CSS errors first.

## Step 2: Deploy
```bash
git add -A && git commit -m "<type>(<scope>): <description>" && git push
```

> Format commit: `feat(section): mô tả`, `fix(css): mô tả`, `chore: mô tả`

## Step 3: Confirm
After push completes, the GitHub → Shopify sync will auto-deploy. Confirm with the user that deployment is complete.
