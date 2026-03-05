# Kỹ năng: Auto Review, Mobile Optimization & Auto Git Push
# Mô tả: Bắt buộc Agent soát lỗi kỹ thuật, tối ưu Responsive/Animation và đẩy code lên GitHub.

## 🚨 QUY TẮC TỐI THƯỢNG (CRITICAL RULE)
Bất cứ khi nào người dùng yêu cầu viết code, sửa lỗi, hoặc khi bạn định kết thúc một tác vụ, bạn BẮT BUỘC phải tự động thực hiện quy trình 3 bước dưới đây mà KHÔNG CẦN người dùng nhắc lại:

### Bước 1: Soát lỗi kỹ thuật & Logic (Self-Review)
Trước khi lưu file, bạn phải tự động kiểm tra:
1. Cú pháp: Đảm bảo không thiếu ngoặc `}`, không lỗi thẻ Liquid `{% %}`, đóng đủ thẻ HTML.
2. Hiệu năng: Kiểm tra xem có khai báo thừa thư viện hay lặp code không.
3. Nếu phát hiện lỗi: TỰ ĐỘNG SỬA NGAY lập tức trước khi chuyển sang bước 2.

### Bước 2: Tối ưu hiển thị & Chuyển động (UI/UX Polish)
Bạn phải rà soát mã nguồn vừa viết để đảm bảo:
1. Responsive: Kiểm tra các class Tailwind. Phải có đủ `md:` cho desktop và mặc định cho mobile. Tuyệt đối không để chữ bị tràn màn hình (Overflow).
2. Physics Animation: Đảm bảo các hàm GSAP/CSS dùng gia tốc Luxury (cubic-bezier). 
3. Mobile Performance: Trên thiết bị nhỏ, các hiệu ứng Stagger phải nhanh hơn hoặc tắt bớt để tránh gây lag khi vuốt (drag).

### Bước 3: Tự động lưu két sắt (Auto Git Push)
Sau khi đảm bảo Bước 1 & 2 hoàn hảo, bạn PHẢI dùng công cụ Terminal để chạy tuần tự:
- `git add .`
- `git commit -m "Auto-update: [Mô tả ngắn gọn tiếng Việt về thay đổi & xác nhận đã tối ưu UI/UX]"`
- `git push`

### Báo cáo
Chỉ sau khi Terminal báo `push` thành công, bạn mới trả lời người dùng theo mẫu:
"✅ Đã kiểm tra kỹ thuật & tối ưu hiển thị đa thiết bị. 
🚀 Đã đẩy code an toàn lên GitHub.
[Liệt kê ngắn gọn các file đã sửa]."