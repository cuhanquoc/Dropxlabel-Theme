---
description: Historical Bug Registry - MUST read before making similar changes to prevent recurring errors
---

# Tự Điển Lỗi (Bug Registry)
Mục đích: Lưu trữ toàn bộ các lỗi nghiêm trọng đã từng xảy ra trong project để **LUÔN LUÔN** đối chiếu trước khi code mới, nhằm đảm bảo không bao giờ giẫm lại "vết xe đổ".

## Bug 01: JavaScript `null` reference chặn toàn bộ module (Modal không mở được)
- **Ngày ghi nhận:** 10/03/2026
- **Khu vực:** Quick View Modal (`sections/featured-collection.liquid`)
- **Nguyên nhân cốt lõi:** Developer đã chủ động xoá một HTML Element (cụ thể là `<p id="fc-qv-sku">`) trong phần giao diện để dọn dẹp, nhưng **MẤT TRÍ NHỚ** không xoá hoặc bọc an toàn dòng lệnh JavaScript gọi đến tham chiếu này (`document.getElementById('fc-qv-sku')` và `skuEl.textContent`).
- **Hậu quả:** Trình duyệt quăng lỗi `Uncaught TypeError: Cannot read properties of null (reading 'textContent')`. Toàn bộ các dòng lệnh phía sau (mở modal, nạp ảnh) bị huỷ bỏ, Modal không thể click mở được nữa.
- **Quy tắc phòng chống (Prevention Rule):** TRƯỚC KHI xoá hoặc đổi ID bất kỳ một thẻ HTML nào, BẮT BUỘC phải grep (tìm kiếm) ID/class đó ở toàn bộ các thẻ `<script>` trong file đó và các file `.js` liên quan. Nếu có tham chiếu, phải sử dụng `if (element) { element.text = ... }` hoặc an toàn xoá hẳn logic đó đi.

## Bug 02: Vỡ giao diện trầm trọng do thêm mới Tailwind Classes nhưng Compiler không tự động dịch (Lỗi Môi Trường)
- **Ngày ghi nhận:** 10/03/2026
- **Khu vực:** Quick View Modal (`sections/featured-collection.liquid`)
- **Nguyên nhân cốt lõi:** Developer sử dụng lệnh Python/Bash (Scripts) để ghi đè hoặc thêm vào một tệp Liquid khối HTML chứa cực kỳ nhiều các thẻ Tailwind mới chưa từng xuất hiện trên template (ví dụ: `bg-[#f2fcf5]`, `flex`, `mt-4`). Ngặt nghèo thay, Shopify CLI/Tailwind CLI trên máy tính local của user đang bị lỗi quyền ghi (`EPERM`) hoặc không "lắng nghe" (watch) sự thay đổi script ngoài luồng, dẫn đến file `input.css` không bao giờ sinh ra các class JIT này.
- **Hậu quả:** Giao diện trắng trơn, không mang CSS, "ADD TO CART" rớt xuống đáy màn hình dưới dạng text thuần, nút tăng giảm rớt dòng.
- **Quy tắc phòng chống (Prevention Rule):** 
  - Nếu user báo lỗi "class Tailwind mới không nhận, vỡ UI", phải NGƯNG DÙNG class Tailwind mới. Lập tức chuyển hướng sang tự build inline styles bên trong thẻ `<style>` nội bộ của file đó (sử dụng CSS thuần `display: flex`, `position: absolute`).
  - Hạn chế việc thêm class lạ thông qua script replace nếu không cắm cờ báo trước cho user Restart Compiler. Đảm bảo giao diện fallback không bị chết.

---
*Ghi chú cho AI: Trước khi lên kế hoạch cập nhật (Planning) một class JS/Tailwind, hãy chạy lướt qua tệp này.*
