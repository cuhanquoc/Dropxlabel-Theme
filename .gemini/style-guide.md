# 🚨 QUY TẮC THIẾT KẾ UI BẮT BUỘC — Tiêu Chuẩn 2026

> File này là **QUY TẮC BẮT BUỘC**, không phải Skill tuỳ chọn.
> Agent PHẢI tuân thủ TẤT CẢ các quy tắc bên dưới khi viết HTML, CSS, Liquid, hoặc Tailwind.

---

## 1. PHÂN CẤP THỊ GIÁC (Visual Hierarchy)

- **Kích thước = Mức quan trọng.** Heading lớn nhất = thông tin quan trọng nhất. KHÔNG phóng to tất cả.
- **Màu tương phản cao** CHỈ dành cho CTA và cảnh báo. Các phần tử phụ dùng tương phản thấp hơn.
- **Không gian trắng** là công cụ phân nhóm nội dung (Gestalt Law of Proximity). KHÔNG nhồi nhét.
- **Nhất quán mẫu:** Cùng loại phần tử (button, card, link) PHẢI có cùng phong cách xuyên suốt.

---

## 2. TYPOGRAPHY — Hệ Thống Tỷ Lệ Mô-đun

- **KHÔNG dùng font-size cố định** cho heading. BẮT BUỘC dùng `clamp()`:
  ```css
  font-size: clamp(MIN, PREFERRED, MAX);
  /* Ví dụ: clamp(1.5rem, 4vw, 3rem) */
  ```
- **Chiều cao dòng:** Body text → `line-height: 1.5–1.75`. Heading → `line-height: 1.05–1.2`.
- **Độ dài dòng:** Giới hạn `max-width: 65ch` hoặc `max-w-prose` cho đoạn văn bản đọc dài.
- **Font pairing:** Heading dùng `var(--font-heading)`, body dùng `var(--font-body)`.
- **Tỷ lệ mô-đun:** Bắt đầu từ 16px base, nhân theo hệ số 1.25 (Major Third):
  `12px → 14px → 16px → 20px → 25px → 31px → 39px → 49px`

---

## 3. HỆ THỐNG LƯỚI 8-ĐIỂM (8-Point Grid)

- **MỌI giá trị** margin, padding, gap, size PHẢI là **bội số của 8px**:
  `8px, 16px, 24px, 32px, 40px, 48px, 56px, 64px, 80px`
- Tailwind tương ứng: `p-2(8px), p-4(16px), p-6(24px), p-8(32px), p-10(40px), p-12(48px)`
- **Ngoại lệ duy nhất:** Border width (1px, 2px) và các giá trị typography.
- **Desktop:** Sử dụng cấu trúc Grid 12 cột (`grid-cols-12`).
- **Mobile:** Luôn 1 cột (`grid-cols-1`) hoặc tối đa 2 cột cho nội dung nhẹ.

---

## 4. TOUCH TARGETS & THUMB ZONE (Mobile-First)

- **Vùng chạm tối thiểu:** MỌI button, link, icon PHẢI có kích thước chạm ≥ **44×44px**.
  ```html
  <!-- ĐÚng: icon nhỏ nhưng vùng chạm đủ lớn -->
  <button class="p-3 min-w-[44px] min-h-[44px]">
    <svg class="w-5 h-5">...</svg>
  </button>
  ```
- **Khoảng cách an toàn:** Tối thiểu **8px gap** giữa 2 phần tử tương tác.
- **CTA chính** (Mua hàng, Thêm giỏ, Thanh toán) → neo ở **1/3 dưới cùng** màn hình (Thumb Zone).
- **Navigation chính trên mobile** → đặt ở **bottom**, KHÔNG phải top-header.

---

## 5. DARK MODE QUANG HỌC

- **CẤM dùng #000000** làm background. Tối thiểu: `#0a0a0a`, `#121212`, hoặc `bg-zinc-900`.
- **CẤM dùng #FFFFFF** cho body text trên nền tối. Dùng: `text-gray-300`, `text-zinc-400`, `rgba(255,255,255,0.6–0.85)`.
- **Khử bão hòa màu nhấn:** Màu rực rỡ trên nền tối → phải làm dịu (muted/desaturated).
- **Phân lớp bằng độ sáng:** Bề mặt nổi (card, modal) sáng hơn nền 1–2 bậc, KHÔNG dùng shadow nặng.
  ```css
  /* Nền base */  background: #0a0a0a;
  /* Card nổi */  background: #161616; border: 1px solid rgba(255,255,255,0.08);
  /* Modal */     background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1);
  ```
- **Tỷ lệ tương phản:** Text thường ≥ 4.5:1 (WCAG AA). Text lớn ≥ 3:1.

---

## 6. ACCESSIBILITY — WCAG 3.0 (POUR)

- **Semantic HTML:** BẮT BUỘC dùng `<nav>`, `<main>`, `<article>`, `<section>`, `<button>`.
  KHÔNG dùng `<div>` làm button hay link. `<a>` PHẢI có `href`.
- **Focus visible:** MỌI phần tử tương tác PHẢI có `focus-visible:ring` hoặc outline.
- **Alt text:** MỌI `<img>` PHẢI có `alt` mô tả nội dung (trừ decorative → `alt=""`).
- **CẤM dùng MÀU SẮC làm tín hiệu duy nhất.** Lỗi = text + icon. KHÔNG chỉ đổi viền sang đỏ.
- **Icon-only button** PHẢI có `aria-label` mô tả chức năng.
- **Keyboard navigation:** Dropdown, modal, accordion PHẢI dùng được bằng Tab + Enter/Escape.

---

## 7. RESPONSIVE BREAKPOINTS

| Tên | Dải | Chiến lược |
|-----|-----|-----------|
| XS (Mobile) | 0–639px | 1 cột, margin 16px, button full-width |
| SM (Mobile ngang) | 640–767px | 1–2 cột, margin 32px |
| MD (Tablet) | 768–1023px | 2 cột linh hoạt, Flexbox |
| LG (Desktop) | 1024–1535px | 3–4 cột, Grid 12-col |
| XL (Wide) | 1536px+ | max-width khoá, tránh kéo dãn |

- **Mobile-First:** Viết CSS mobile trước, dùng `md:` `lg:` mở rộng lên.
- **CẤM ép desktop layout sang mobile.** Mobile phải đơn giản hóa, không chỉ thu nhỏ.
- **Image responsive:** `max-width: 100%; height: auto;` hoặc `w-full h-auto`.

---

## 8. CHUYỂN ĐỘNG & ANIMATION

- **CHỈ dùng Functional Motion** — animation phải có mục đích (transition state, feedback).
- **CẤM animation thuần trang trí** làm chậm tải trang hoặc gây CLS.
- **Tốc độ:** Tối đa `duration-300` (300ms) cho micro-interactions, `duration-500` cho transitions lớn.
- **CHỈ animate `transform` và `opacity`** (GPU-accelerated). KHÔNG animate `width`, `height`, `top`, `left`.
- **Prefers-reduced-motion:** PHẢI respect, tắt animation cho user yêu cầu.

---

## 9. CÁC LỖI CẤM PHẠM

| # | Lỗi | Hậu quả | Cách sửa |
|---|------|---------|----------|
| 1 | **Mystery Meat Navigation** — giấu tính năng vào icon không nhãn | +34% bounce rate | Icon LUÔN đi kèm text label |
| 2 | **Nhồi nhét thông tin** trên mobile | UX ngột ngạt | Ưu tiên nội dung cốt lõi, ẩn phụ |
| 3 | **Animation quá 3s** trước khi hiện nội dung | 53% users rời đi | Content-first, animation phụ trợ |
| 4 | **overflow: hidden** cắt nội dung mobile | Mất thông tin | Sắp xếp lại layout, không cắt |
| 5 | **Hover-only features** không có fallback mobile | Mobile users mất tính năng | Luôn có tap/click alternative |

---

## 10. CHECKLIST TRƯỚC KHI PUSH CODE

- [ ] Mọi spacing là bội số 8px?
- [ ] Touch targets ≥ 44px?
- [ ] Heading dùng `clamp()`?
- [ ] Body text có `max-width` giới hạn?
- [ ] Dark mode không dùng `#000000`?
- [ ] Semantic HTML (`nav`, `main`, `section`, `button`)?
- [ ] `alt` text trên mọi image?
- [ ] Focus styles trên interactive elements?
- [ ] Animation chỉ dùng `transform`/`opacity`?
- [ ] Mobile layout 1 cột, CTA ở thumb zone?
