---
name: shopify-2026-standards
description: >
  Bộ quy tắc tiêu chuẩn phát triển theme Shopify hiện đại (2026).
  Bao gồm 9 nhóm quy tắc: kiến trúc & workflow, JSON templates,
  hiệu suất & Core Web Vitals, CSS system, trợ năng WCAG 2.1,
  metaobjects, cart AJAX, checkout extensibility, và headless commerce.
  Áp dụng BẮT BUỘC cho mọi thay đổi code trong dự án Shopify theme.
---

# Tiêu Chuẩn Phát Triển Theme Shopify Hiện Đại (2026)

> **MANDATORY** — Mọi thay đổi code trong dự án theme PHẢI tuân thủ bộ quy tắc này.

---

## 1. Môi Trường & Quy Trình Phát Triển

### Môi trường cục bộ
- **BẮT BUỘC** dùng `shopify theme dev` (Shopify CLI) cho phát triển local
- **CẤM** chỉnh sửa trực tiếp trên Admin Theme Editor của live theme

### Quản lý phiên bản
- Tích hợp CI/CD qua **Shopify GitHub Integration**
- Mọi thay đổi phải đẩy qua **branch** và đồng bộ hai chiều với cửa hàng
- Workflow: `feature branch` → `PR review` → `merge to main` → auto-sync Shopify

### Kiểm soát chất lượng
- Cài đặt **Theme Check** + **LiquidDoc** trên IDE
- Phát hiện tự động: lỗi cú pháp, file rác, cảnh báo hiệu suất
- Chạy kiểm tra **TRƯỚC** khi commit

---

## 2. JSON Templates & Khối Mô-đun

### Phân tách dữ liệu
- Chuyển đổi **hoàn toàn** sang **JSON Templates**
- File template JSON **CHỈ** lưu settings + thứ tự hiển thị
- Logic HTML/Liquid đặt trong `sections/` và `snippets/`

### Quản lý layout
- Dùng **Section Groups**: `header-group.json`, `footer-group.json`
- Cho phép App Embeds nhúng mã an toàn

### Schema design
- `settings_schema.json` phải **súc tích**, tránh nhồi nhét logic tĩnh
- Label rõ ràng, info text hữu ích cho thương nhân

---

## 3. Hiệu Suất & Core Web Vitals

### Tiêu chuẩn tốc độ
| Metric | Target |
|--------|--------|
| Tốc độ tải trang | **< 2 giây** |
| Lighthouse mobile | **≥ 90 điểm** |
| Trọng số Collection | 42.8% |
| Trọng số Product | 40.2% |
| Trọng số Homepage | 16.8% |

### Triết lý JavaScript
- **"HTML-first, JS-as-needed"**
- Loại bỏ jQuery hoàn toàn
- Ưu tiên **Vanilla JS (ES6)** + **Web Components**
- Hạn chế tối đa framework frontend nặng

### Ngăn chặn kịch bản rác
- **CẤM** dùng Liquid string filter để hack `{{ content_for_header }}`
- Vô hiệu hóa mã rác thông qua **App Embeds** settings

---

## 4. Kiến Trúc CSS & UI

### Đồng nhất phương pháp luận
- Chọn **MỘT** kiến trúc CSS và tuân thủ xuyên suốt:
  - **Option A:** CSS thuần + CSS Variables (kiểu Dawn)
  - **Option B:** Utility-first (Tailwind CSS) qua PostCSS/Vite
- **CẤM** pha trộn các phương pháp → tránh phình to file tĩnh

### Hình ảnh & đa phương tiện
- **BẮT BUỘC** dùng `image_tag` filter của Liquid → tự sinh `srcset` + WebP
- Thêm `loading: 'lazy'` cho mọi ảnh **below-the-fold**
- Above-the-fold: dùng `loading: 'eager'` + `fetchpriority: 'high'`

---

## 5. Trợ Năng — WCAG 2.1

### Touch targets (mobile)
- Mọi nút bấm / mục tiêu chạm: **≥ 44×44px**

### Tỷ lệ tương phản
| Loại | Tỷ lệ tối thiểu |
|------|-----------------|
| Chữ thường | **4.5:1** |
| Focus indicators / viền | **3:1** |

### Focus trapping
- Cart Drawers, Modals: **BẮT BUỘC** bẫy tiêu điểm
- Bàn phím không được thao tác vào nền mờ phía sau
- `Escape` key phải đóng modal/drawer

---

## 6. Metaobjects — Dữ Liệu Phức Tạp

### Ưu tiên Metaobjects
- Dùng **Metaobjects** (siêu đối tượng) cho dữ liệu quan hệ đồng nhất
  - Ví dụ: thông số kỹ thuật, bộ tài liệu, FAQs
- Tránh tạo hàng loạt metafield đơn lẻ rời rạc

### Cú pháp truy xuất mảng
```liquid
{%- comment -%} BẮT BUỘC dùng .value liên tiếp trên mỗi tầng {%- endcomment -%}
{{ license.value.reference_product.value }}

{%- comment -%} SAI — sẽ trả về đối tượng rỗng {%- endcomment -%}
{{ license.reference_product.value }}
```

---

## 7. Quản Lý Giỏ Hàng (Cart Management)

### Giao tiếp đồng bộ
- Dùng **Cart AJAX API**: `/cart/add.js`, `/cart/change.js`
- Kết hợp **Section Rendering API** → cập nhật Cart Drawer không reload trang

### Bảo vệ tính toàn vẹn
- Dùng **Concurrency API** của Shopify → xếp hàng truy vấn
- Ngăn lỗi sai lệch số lượng khi spam nút "Add to Cart"

---

## 8. Checkout Extensibility

### Quy tắc cứng
- **CẤM TUYỆT ĐỐI** chỉnh sửa `checkout.liquid` (deprecated)
- Tùy chỉnh checkout qua **Checkout UI Extensions** only

### Sandbox components
- Chỉ dùng components Shopify kiểm duyệt: `BlockLayout`, `TextField`, etc.
- Đính kèm đúng **Extension Targets** trên hệ thống đám mây

---

## 9. Headless Commerce

### Khi nào dùng
- **CHỈ** tiếp cận headless khi:
  - Tích hợp đa nền tảng CMS
  - B2B phức tạp
  - Hệ thống cũ không xử lý được bằng Liquid truyền thống

### Lựa chọn framework
| Yêu cầu | Framework |
|----------|-----------|
| Triển khai nhanh commerce cốt lõi | **Hydrogen** (+ Oxygen hosting) |
| Phụ thuộc ISR + server độc lập | **Next.js** |

---

## 10. DOM & JavaScript Safety

### Xóa phần tử HTML (DOM Removal)
- **CẤM** xóa một thẻ HTML có `id=` hoặc class đặc biệt mà không kiểm tra JavaScript.
- **BẮT BUỘC** tìm kiếm (`grep_search`) ID/class đó trong khối `<script>` hoặc các file `.js` liên quan trước khi xóa.
- Nếu muốn xóa HTML mà JS đang gọi, phải cập nhật JS an toàn BẰNG CÁCH thêm Optional Chaining (`el?.textContent`) hoặc lệnh điều kiện (`if (el)`), tránh gây lỗi "Uncaught TypeError: null".

---

## Quick Reference — Checklist Trước Deploy

- [ ] Shopify CLI `theme dev` hoạt động
- [ ] Theme Check + LiquidDoc: 0 errors
- [ ] JSON Templates: tách logic khỏi settings
- [ ] Lighthouse mobile ≥ 90
- [ ] Không có jQuery, không hack `content_for_header`
- [ ] Tất cả ảnh dùng `image_tag` + lazy loading
- [ ] Touch targets ≥ 44×44px
- [ ] Tương phản màu ≥ 4.5:1
- [ ] Modal/Drawer có focus trapping
- [ ] Metaobjects dùng `.value` chain đúng
- [ ] Cart dùng AJAX API + Section Rendering
- [ ] Không chỉnh sửa `checkout.liquid`
- [ ] **KHÔNG xóa ID/Class HTML đang được JS gọi**
