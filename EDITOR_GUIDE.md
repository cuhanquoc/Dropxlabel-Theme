# 🛍️ Dropxlabel Theme — Hướng Dẫn Chỉnh Sửa Không Cần Code

> **Dành cho:** Merchant, Store Manager  
> **Cập nhật:** Tháng 3/2026  
> **Vào Shopify Admin → Online Store → Customize** để bắt đầu.

---

## 📋 Mục Lục

1. [Mở Theme Editor](#1-mở-theme-editor)
2. [Trang Chủ (Homepage)](#2-trang-chủ-homepage)
3. [Trang Sản Phẩm (Product)](#3-trang-sản-phẩm-product)
4. [Trang Bộ Sưu Tập (Collection)](#4-trang-bộ-sưu-tập-collection)
5. [Header & Navigation](#5-header--navigation)
6. [Footer](#6-footer)
7. [Announcement Bar](#7-announcement-bar)
8. [Lưu & Xuất Bản](#8-lưu--xuất-bản)
9. [FAQ & Mẹo Nhanh](#9-faq--mẹo-nhanh)

---

## 1. Mở Theme Editor

1. Đăng nhập **Shopify Admin** (`yourdomain.myshopify.com/admin`)
2. Vào **Online Store** → **Themes**
3. Nhấn **Customize** bên cạnh theme Dropxlabel
4. Giao diện Editor mở ra với **cột trái** (danh sách sections) và **vùng giữa** (preview trang)

> 💡 **Tip:** Nhấn biểu tượng điện thoại/máy tính ở dưới cùng để chuyển xem Desktop ↔ Mobile.

---

## 2. Trang Chủ (Homepage)

**Chọn trang:** Dropdown ở trên cùng → **Home page**

### Danh sách Sections mặc định (theo thứ tự):

| # | Section | Mô tả |
|---|---------|--------|
| 1 | **Announcement Bar** | Dải thông báo cuộn trên cùng |
| 2 | **Hero Banner** | Video/ảnh nền lớn với tiêu đề |
| 3 | **Featured Collection** | Lưới sản phẩm nổi bật |
| 4 | **Brand Story Bento** | Ô ảnh phong cách thương hiệu |
| 5 | **Trending Styles** | Carousel sản phẩm cuộn ngang |
| 6 | **Customer Help Center** | FAQ / Câu hỏi thường gặp |

### Thêm / Xóa Section

- **Thêm:** Nhấn **"Add section"** ở cuối cột trái → chọn loại section
- **Xóa:** Click section → nhấn biểu tượng 🗑️ góc phải
- **Sắp xếp:** Kéo thả biểu tượng ≡ ở đầu mỗi section

### Chỉnh Hero Banner

1. Click section **Hero Banner** ở cột trái
2. Thay đổi:
   - **Video nền:** Upload video ở "Background Video"
   - **Tiêu đề lớn:** Trường "Headline"
   - **Nút CTA:** "CTA Text" + "CTA URL" (link đến collection/product)
   - **Dòng chữ chạy:** "Marquee Text" (chữ lặp lại dưới banner)

### Chỉnh Featured Collection (Sản phẩm nổi bật)

1. Click **Featured Collection**
2. **Heading:** Tiêu đề phần (vd: "New Arrivals")
3. **Product List:** Thêm/xóa sản phẩm bằng picker
4. **Màu sắc:** Chỉnh heading color, price color

### Chỉnh Brand Story Bento

1. Click **Brand Story Bento**
2. Mỗi ô ảnh là 1 **Block** → nhấn block để chỉnh:
   - **Image:** Upload ảnh phong cách
   - **Tag Text:** Nhãn nhỏ (vd: "Quiet Luxury")
   - **Title:** Tên phong cách (vd: "Old Money Vibes")
   - **Button:** Text nút + Link URL
3. **Thêm ô mới:** "Add block" → "Story Card"
4. **Tối đa:** 10 ô

---

## 3. Trang Sản Phẩm (Product)

**Chọn trang:** Dropdown → **Products** → chọn 1 sản phẩm bất kỳ

### Danh sách Sections:

| # | Section | Chỉnh gì |
|---|---------|----------|
| 1 | **Product Layout** (main) | Gallery, mô tả, size chart |
| 2 | **Trending Accordion** | Accordion câu hỏi/thông tin thêm |
| 3 | **Trending Styles** | Sản phẩm gợi ý (You May Also Like) |
| 4 | **Apps** | Khu vực app Shopify tự điền |

### Chỉnh Product Layout

1. Click **Product Layout**
2. **Gallery Gap:** Khoảng cách giữa ảnh (0-10)
3. **Size Chart:** Nhập bảng size dạng HTML đơn giản:
   ```
   <p>S: Ngực 80cm</p>
   <p>M: Ngực 84cm</p>
   ```
4. **Pickup / Delivery info:** Bật/tắt + chỉnh text
5. **Pairs Well With:** Chọn collection để hiện sản phẩm kết hợp

### Thêm Trust Badges / Social Icons

1. Trong **Product Layout** → "Add block"
2. Chọn **Trust Badge** → upload icon + text
3. Chọn **Social Icon** → chọn platform + URL

---

## 4. Trang Bộ Sưu Tập (Collection)

**Chọn trang:** Dropdown → **Collections** → chọn collection

### Danh sách Sections:

| # | Section | Ghi chú |
|---|---------|---------|
| 1 | **Announcement Bar** | Thông báo riêng cho collection |
| 2 | **Collection Grid** (main) | Lưới sản phẩm, filter, sort |
| 3 | **Trending Styles** | Upsell cuối trang |

### Chỉnh lưới sản phẩm

1. Click **Collection Grid**
2. Chỉnh số cột, filter, sort options trong settings

---

## 5. Header & Navigation

**Vị trí:** Cột trái → phần **Header** (luôn hiển thị trên tất cả trang)

### Thêm Link Navigation

1. Click **Header** trong cột trái
2. Cuộn xuống phần **Blocks**
3. Nhấn **"Add block"** → chọn **"Nav Link"**
4. Điền:
   - **Label:** Tên hiển thị (vd: "Bộ Sưu Tập")
   - **URL:** Link đến trang/collection (vd: `/collections/all`)
5. **Sắp xếp:** Kéo thả để đổi thứ tự link
6. **Tối đa:** 8 links

> 💡 **Tip:** Để link đến collection, dùng định dạng `/collections/ten-collection`

### Thay Logo

1. Click **Header**
2. Tìm setting **"Logo"** → upload ảnh PNG/SVG trong suốt
3. Chỉnh **"Logo Width"** để điều chỉnh kích thước

---

## 6. Footer

**Vị trí:** Cột trái → cuộn xuống cùng → **Footer**

### Thêm Cột Links

1. Click **Footer**
2. **"Add block"** → **"Link Column"** → đặt tiêu đề cột (vd: "Support")
3. **"Add block"** → **"Link Item"** → điền Text + URL
4. Kéo item vào trong cột muốn nhóm

### Chỉnh Copyright & Legal Links

1. Click **Footer**
2. Cuộn xuống phần **Settings**:
   - **Copyright Text:** Để trống = tự động hiện `© 2026 Store Name`
   - **Hotline:** Số điện thoại/email liên hệ
   - **Legal Link 1-4:** Nhập tên + URL (Privacy Policy, Terms...)

### Thêm Social Media

1. **"Add block"** → **"Social Links"**
2. Chọn platform → nhập URL profile

---

## 7. Announcement Bar

Dải thông báo hiển thị trên cùng mọi trang.

### Thêm / Xóa Thông Báo

1. Click **Announcement Bar**
2. **"Add block"** → **"Message"**
3. Điền:
   - **Text:** Nội dung thông báo (vd: "🚀 Free shipping over $50!")
   - **Link Text:** Text nút (vd: "Shop Now")
   - **Link URL:** Link đến trang (vd: `/collections/all`)
4. Nhiều blocks = xoay vòng tự động
5. **Tối đa:** 8 thông báo

---

## 8. Lưu & Xuất Bản

### Lưu thay đổi

- Nhấn **"Save"** ở góc trên phải sau mỗi lần chỉnh
- Thay đổi **chỉ hiển thị preview** cho đến khi Save

### Xuất bản lên live store

- Vào **Themes** → nhấn **"Publish"** để áp dụng lên store thực
- Theme cũ sẽ tự lưu lại để rollback nếu cần

### Rollback (Hoàn tác)

- Vào **Themes** → tìm theme cũ → nhấn **"Publish"** để quay lại

---

## 9. FAQ & Mẹo Nhanh

**Q: Tôi có thể xóa section nào?**  
A: Tất cả sections ngoại trừ phần **main** (Product Layout, Collection Grid, Article) — các section main là bắt buộc cho trang đó hoạt động.

**Q: Sắp xếp sections như thế nào?**  
A: Kéo thả biểu tượng **≡** (ba gạch ngang) ở đầu mỗi section trong cột trái.

**Q: Block là gì?**  
A: Block là thành phần con bên trong section. Ví dụ: mỗi ô ảnh trong Brand Story Bento là 1 block, mỗi link trong Header là 1 block.

**Q: Thay đổi không lưu được?**  
A: Không nhấn **Save** là sẽ mất. Shopify không tự lưu draft.

**Q: Màn hình mobile trông khác desktop?**  
A: Dùng nút preview **📱/💻** ở dưới cùng Editor để kiểm tra cả hai.

**Q: Thêm trang mới (About, Contact...)?**  
A: Vào **Online Store → Pages** → tạo trang → sau đó vào Customize chọn trang đó để thêm sections.

---

> 📞 **Cần hỗ trợ kỹ thuật?** Liên hệ developer với file `sections/*.liquid` tương ứng.  
> 📚 **Tài liệu gốc Shopify:** [help.shopify.com/en/manual/online-store/themes/theme-structure](https://help.shopify.com/en/manual/online-store/themes/theme-structure)
