# Skill: 2026 UI/UX Architecture Standards
# Description: Bắt buộc Agent áp dụng các tiêu chuẩn thiết kế UI 2026 (Hệ thống lưới 8-point, Touch Targets 44px, Dark Mode quang học, Accessibility WCAG 3.0 và Responsive Fluid).

## 🚨 QUY TẮC LẬP TRÌNH UI TỐI THƯỢNG (CRITICAL RULES)
Khi viết mã HTML, Liquid, hoặc Tailwind CSS, bạn BẮT BUỘC tuân thủ 6 trụ cột thiết kế sau:

### 1. Hệ Thống Lưới 8-Điểm & Không Gian (8-Point Grid & Whitespace)
- **Tuyệt đối:** Mọi giá trị margin, padding, gap BẮT BUỘC phải là bội số của 8 (Tailwind: `4`, `8`, `16`, `24`, `32` tương ứng với `p-1`, `p-2`, `p-4`, `p-6`, `p-8`).
- **Layout:** Sử dụng cấu trúc Grid 12 cột cho màn hình Desktop (`grid-cols-12`). Màn hình Mobile luôn là 1 cột (`grid-cols-1`).
- **Dòng đọc:** Giới hạn chiều dài đoạn văn bản để chống mỏi mắt bằng class `max-w-prose`.

### 2. Tỷ Lệ Chữ Kỹ Thuật Số (Fluid Modular Typography)
- Không dùng kích thước chữ cố định (pixel cứng) cho các thẻ Heading.
- **Tiêu chuẩn:** Sử dụng Tailwind `clamp()` hoặc các class responsive (`text-base md:text-lg lg:text-xl`) để font chữ tự động co giãn. 
- **Line-height:** Text đọc dài bắt buộc dùng `leading-relaxed` (1.5) hoặc `leading-loose`. Heading dùng `leading-tight` hoặc `leading-none`.

### 3. Công Thái Học Di Động (Mobile-First & Touch Targets)
- **Vùng chạm (Touch Zone):** Mọi button, link, icon BẮT BUỘC có vùng chạm tối thiểu 44x44px. Cấm set `w-4 h-4` mà không có padding bọc ngoài. Bắt buộc dùng cấu trúc: `<button class="p-3 min-w-[44px] min-h-[44px]"> <icon class="w-5 h-5"/> </button>`.
- **Khoảng cách an toàn:** Phải có khoảng trống ít nhất 8px (`gap-2`) giữa các phần tử có thể click.
- **Nhãn hiển thị:** KHÔNG giấu tính năng lõi vào icon vô nghĩa (Mystery Meat Navigation). Icon điều hướng luôn đi kèm text nhãn.

### 4. WCAG 3.0 Accessibility (Tiếp Cận Kỹ Thuật Số)
- **Semantic HTML:** Bắt buộc dùng `<nav>`, `<main>`, `<article>`, `<section>`, `<button>` thay vì chỉ dùng thẻ `<div>`.
- **Focus:** Mọi phần tử tương tác phải có class `focus-visible:ring` để nhận diện khi dùng phím Tab.
- **Mù màu:** KHÔNG dùng màu sắc làm tín hiệu duy nhất. Báo lỗi phải đi kèm text hoặc icon cảnh báo. Nút bấm chỉ có icon bắt buộc phải có `aria-label`.

### 5. Dark Mode Quang Học (Optical Dark Mode)
- **CẤM dùng màu Đen tuyền (#000000):** Background tối thiểu phải là `bg-[#121212]` hoặc `bg-zinc-900`.
- **Độ tương phản:** Chữ trên nền tối tuyệt đối không dùng màu rực (Neon). Sử dụng `text-gray-300` hoặc `text-zinc-400` cho body text.
- **Độ sâu (Elevation):** Thay vì dùng shadow rườm rà trên nền tối, tạo độ sâu bằng viền mỏng: `border border-white/10` kết hợp nền sáng hơn một chút (`bg-zinc-800`).

### 6. Hiệu Ứng Chuyển Động (Functional Motion & Haptics)
- Chỉ dùng Animation có mục đích (Functional Motion). Tốc độ tối đa `duration-300` hoặc `duration-500`. Không làm hiệu ứng rườm rà làm chặn quá trình load trang (Core Web Vitals).
- Luôn ưu tiên dùng `transform` và `opacity` (Hardware acceleration) khi animate.

### Báo cáo
Khi hoàn thành viết UI, hãy báo cáo: "✨ Đã áp dụng tiêu chuẩn UI 2026: Lưới 8-point, Touch Target >44px, Semantic HTML và Optical Dark Mode."