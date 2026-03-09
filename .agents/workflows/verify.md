---
description: Post-deploy UI verification — opens the live site, checks layout, animations, console errors, responsive, and reports bugs
---

After completing any code change and deploying, run this workflow to visually verify the live site and catch UI issues.

**Live Site**: https://dearnest.co/

// turbo-all

## Step 1: Rebuild Tailwind CSS
```bash
npm run build:css
```
Wait for the build to complete successfully. If it fails, fix the CSS errors first.

## Step 2: Open the live site in the browser
Use `browser_subagent` to navigate to **https://dearnest.co/**. Take a full-page screenshot on load.

## Step 3: Desktop UI Audit
Check and screenshot each of these on the default (desktop) viewport:
- **Hero Banner**: full-height, background image/video, gradient overlays, eyebrow text, headline, sub-copy, CTA button, marquee
- **All other visible sections**: scroll down and screenshot each section above the fold
- **Header & Footer**: navigation links, logo, layout alignment
- **Typography**: font families (Playfair Display for headings, Inter for body), sizes, spacing
- **Colors**: accent (#C5A880), white text on dark backgrounds, muted text
- **Animations**: Ken Burns on hero image, fadeSlideUp entrance, marquee scrolling, GSAP stagger
- **Interactive elements**: CTA hover effects, links, buttons

## Step 4: Mobile UI Audit
Resize the browser to mobile viewport (375×812) and repeat:
- Check responsive padding (px-6 on mobile, md:px-10 on tablet)
- Check text sizing doesn't overflow
- Check CTA button sizing (smaller on mobile: 40px circle, smaller text)
- Check marquee text sizing
- Screenshot the mobile view

## Step 5: Console Error Check
Open browser console and check for:
- JavaScript errors (especially GSAP, Web Component registration, Alpine.js)
- 404 errors for missing assets
- CSS warnings
- Take a screenshot of the console

## Step 6: DOM Structure Audit
In DevTools Elements tab, verify:
- Custom elements are used (e.g., `<hero-banner>`, not `<section>` for refactored sections)
- No orphaned `id` attributes that should have been removed
- No inline `style=""` on elements that should use Tailwind (except dynamic Liquid values)

## Step 7: Cross-reference with Web Design Guidelines
Read the `web-design-guidelines` skill (`.agents/skills/web-design-guidelines/SKILL.md`) and apply the checklist from:
```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```
to the pages you've verified.

## Step 8: Generate Bug Report
Create a structured report with:

### No Issues Found
If everything looks correct, confirm: "✅ All checks passed — zero UI bugs detected."

### Issues Found
For each issue, provide:
1. **Section**: Which section has the issue
2. **Screenshot**: Embedded screenshot showing the problem
3. **Description**: What's wrong
4. **Severity**: 🔴 Critical / 🟡 Warning / 🔵 Minor
5. **Fix suggestion**: What code change would fix it

Use `notify_user` to deliver the final report to the user with screenshots embedded.
