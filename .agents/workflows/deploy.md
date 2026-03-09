---
description: How to deploy changes to the Shopify theme after editing code
---

# Deploy Workflow

After finishing code changes, **notify the user** to run these commands in their **system terminal**:

```bash
cd ~/Documents/Dropxlabel-Theme.
npm run build:css
git add -A && git commit -m "<commit message>" && git push
```

> ⚠️ The IDE sandbox CANNOT run `npm run build:css` or `git push` due to macOS permissions.
> Always ask the user to run these commands manually.

The agent MUST:
1. Provide a clear, descriptive commit message
2. List what files were changed and why
3. Wait for user confirmation before proceeding
