# Project Status

Last updated: 2026-03-30 (Asia/Ho_Chi_Minh)

## Current Snapshot

- Repo: `Dropxlabel-Theme`
- Branch: `main`
- Latest pushed commit at setup: `56e8282`
- Storefront direction: `mobile-first`
- Current priority: polish UI while keeping Shopify backend behavior stable
- Typography system update in progress:
  - Heading: `Rubik`
  - Body: `Inter`
  - Accent: `Bricolage Grotesque`
- Mandatory design system for UI work:
  - Stitch project `5971681460518604700`
  - direction: `Quiet Luxury / Digital Atelier`
  - no heavy borders, rely on tonal shifts / spacing / soft dividers instead

## Working Rules

- Push trực tiếp lên `main` trừ khi người dùng yêu cầu khác.
- Với mọi task design mới, phải tạo và refine design trong `Stitch` trước.
- Chỉ được implement code và push GitHub sau khi người dùng duyệt phương án design trong `Stitch`.
- Sau mỗi lần push phải báo rõ:
  - đã push hay chưa
  - branch nào
  - commit nào
  - thay đổi chính là gì
- Task UI dùng mô hình 2 agent:
  - 1 agent UI/UX review
  - 1 agent dev implement
- Subagent model mặc định cho flow này:
  - `gpt-5.3-codex`
  - `medium`
- Không tự redesign ngoài reference nếu người dùng đã chốt direction.
- Ưu tiên giữ backend Shopify ổn định hơn là thay đổi cấu trúc dữ liệu/theme contract.

## Current Theme Contract

- Không đổi section type trong template nếu không thật sự cần.
- Không đổi route, cart API, quick view flow, hay shape dữ liệu variant nếu chỉ đang làm UI.
- Theme Editor settings cũ nên được giữ ID để tránh mất dữ liệu merchant.

## Current UI State

- `Header`
  - Desktop: chỉ overlay trên homepage khi section đầu tiên là hero banner.
  - Mobile: nền lấy theo Shopify settings.
- `Hero Banner`
  - Poster image hiện trước, giữ lại ngắn rồi mới fade sang video.
  - Mobile không autoplay video.
- `Featured Collection`
  - Đã restyle theo Stitch reference.
  - Desktop vừa được polish thêm theo screen Stitch đã duyệt: heading editorial hơn, swatches lớn hơn, price hierarchy rõ hơn, layout bớt trống trải.
  - Desktop và mobile dùng cùng backend Shopify hiện có.
- `Customer Help Center`
  - Đã chỉnh accordion mobile nhiều vòng, vẫn nên test lại khi đụng section lân cận.
 - `Footer`
  - Desktop đã redesign theo hướng editorial/luxury (off-black, spacious, quiet) trong `sections/footer.liquid`.
  - Desktop footer đã được mount vào `layout/theme.liquid` để render thật trên storefront.
  - Desktop footer giờ lấy `Quick links`, `Support`, và `Follow us on` từ dữ liệu do mobile footer phát ra, để hai bên đồng bộ nội dung.
  - Typography desktop footer đã được khóa lại theo font system dự án: `Playfair Display` cho display marquee và `Inter` cho menu/utility text.
  - Giữ nguyên contract: logo, brand_description, newsletter form, social URLs, payment icons, copyright.
  - Mobile footer accordion không đổi UI/behavior; hiện đóng vai trò nguồn dữ liệu chuẩn cho 3 cột desktop.

## Recent Completed Work

10. Featured Collection desktop được tinh lại theo phương án Stitch đã duyệt: swatches/variants lớn hơn, heading dùng hệ editorial đúng font dự án, giá chính và giá gạch nổi bật hơn, nhịp card gọn hơn.
11. Typography tokens toàn cục đã được chuyển sang `Rubik / Inter / Bricolage Grotesque` với alias ngược để tránh làm vỡ UI hiện có; các section quan trọng bắt đầu được đổi fallback/font hardcode theo hệ mới.
7. Desktop footer rebuilt toward the approved reference: marquee statement, left newsletter capsule, right link columns, and bottom locale/copyright/payment bar while keeping Shopify footer schema intact.
8. Đồng bộ `Quick links`, `Support`, và `Follow us on` từ mobile footer sang desktop footer bằng data bridge JSON, để desktop không còn drift nội dung so với mobile.
9. Chốt và áp typography parity cho desktop footer theo phương án Stitch đã duyệt: display marquee dùng `Playfair Display`, còn menu/utility dùng `Inter`.
1. Tích hợp UI `featured-collection` theo Stitch reference trong khi giữ backend Shopify.
2. Chỉnh hero poster-first để tránh video mở đầu đen/mờ.
3. Tách hành vi overlay của header để chỉ đè lên hero banner homepage.
4. Redesign desktop footer theo hướng editorial/luxury, giữ nguyên schema/settings ID và behavior Shopify.
5. Chốt Stitch design system project `5971681460518604700` làm quy tắc bắt buộc cho các task UI tiếp theo.
6. Hardening lại logic header: desktop overlay chỉ bật khi trang bắt đầu bằng hero banner; mobile tiếp tục lấy màu theo Shopify settings.

## Open Focus Areas

1. Tiếp tục polish mobile trước khi mở rộng desktop.
2. Kiểm tra trực quan lại:
   - homepage hero/header
   - featured collection
   - quick view
   - collection/search mobile
   - footer desktop trên nhiều viewport lớn (1024/1280/1440)
3. Mọi chỉnh sửa UI mới nên cập nhật lại file này ngay sau khi hoàn tất.
4. Footer desktop visual QA across 1024 / 1280 / 1440 after the new reference-driven redesign.
5. Kiểm tra trong Theme Editor rằng đổi link/social ở mobile footer sẽ cập nhật đúng 3 cột desktop footer.
6. Tiếp tục rà các section còn hardcoded font cũ ngoài nhóm critical UI nếu thấy drift thị giác sau đợt đổi typography toàn cục.

## Files/Paths To Avoid Touching Unless Asked

- `c-e-l-i-s-i-r-a-news/`
- `docs/`
- `export/`
- `taste-skill-main/`

## Update Protocol

Sau mỗi task hoàn tất, cập nhật tối thiểu 4 mục sau:

1. `Last updated`
2. `Latest pushed commit at setup` hoặc commit mới nhất
3. `Recent Completed Work`
4. `Open Focus Areas`

Nếu task thay đổi rule làm việc hoặc theme contract, cập nhật luôn các section tương ứng trong file này.
- 2026-03-27: Footer desktop render hardened in Theme Editor by removing `hidden md:block` from root and hiding mobile via section CSS only.
- 2026-03-27: Desktop footer now reads `Quick links`, `Support`, and `Follow us on` from JSON emitted by the mobile footer section, keeping both surfaces aligned without changing mobile behavior.
