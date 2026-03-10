---
description: Tự soát lỗi toàn diện trước khi đẩy code lên GitHub — chạy 8 nhóm kiểm tra tự động
---

# /pre-push — Pre-Push Audit Workflow

**Kích hoạt:** Chạy workflow này trước MỖI lần `git push`.  
Có thể nói: `soát lỗi trước push`, `audit`, `/pre-push`, hoặc `check before push`.

---

## Bước 1: Xác định phạm vi thay đổi

// turbo
```bash
git diff --name-only HEAD
```

Liệt kê tất cả files đã thay đổi kể từ commit cuối. Nếu có staged changes chưa commit:

// turbo
```bash
git diff --name-only --cached
```

---

## Bước 2: Chạy Pre-Push Audit Skill

Kích hoạt skill `pre-push-audit` và thực hiện tuần tự 8 nhóm kiểm tra:

1. 🔴 **Liquid Syntax** — Tag chưa đóng, filter sai, Liquid trong JSON
2. 🟠 **CSS Conflicts** — Selector trùng, !important, Liquid trong CSS, Tailwind config
3. 🟠 **JavaScript Errors** — Custom Element trùng, document.getElementById, cleanup
4. 🔴 **Schema Integrity** — JSON hợp lệ, ID unique, template references
5. 🔴 **Broken References** — Snippets, assets, section types
6. 🟡 **Accessibility** — alt text, button labels, form labels
7. 🟡 **Performance Flags** — Eager load, placeholder URLs, render-blocking scripts
8. 🟢 **Git Hygiene** — .DS_Store, secrets, commit message, file size

---

## Bước 3: Xuất Báo Cáo

Agent xuất báo cáo dạng bảng với kết quả từng nhóm (✅ PASS / ⚠️ WARN / ❌ FAIL).

---

## Bước 4: Quyết định

| Kết quả | Hành động |
|---------|-----------|
| Không có ❌ | → Chạy `/deploy` để push |
| Có ❌ FAIL | → Sửa lỗi → re-audit → push |
| Chỉ có ⚠️ WARN | → Có thể push, nên sửa warnings sau |

---

## Bước 5: Deploy (nếu PASS)

Thông báo người dùng chạy trong terminal hệ thống:

```bash
cd ~/Documents/Dropxlabel-Theme.
npm run build:css
git add -A && git commit -m "<type>(<scope>): <mô tả>" && git push
```

> ⚠️ IDE sandbox không thể chạy `npm run build:css` hay `git push` do macOS EPERM.
> Người dùng phải chạy trong Terminal thủ công.
