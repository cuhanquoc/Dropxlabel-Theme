# Project Status

Last updated: 2026-03-26 (Asia/Ho_Chi_Minh)

## Current Snapshot

- Repo: `Dropxlabel-Theme`
- Branch: `main`
- Latest pushed commit at setup: `a1f6a21`
- Storefront direction: `mobile-first`
- Current priority: polish UI while keeping Shopify backend behavior stable

## Working Rules

- Push trực tiếp lên `main` trừ khi người dùng yêu cầu khác.
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
  - Desktop và mobile dùng cùng backend Shopify hiện có.
- `Customer Help Center`
  - Đã chỉnh accordion mobile nhiều vòng, vẫn nên test lại khi đụng section lân cận.

## Recent Completed Work

1. Tích hợp UI `featured-collection` theo Stitch reference trong khi giữ backend Shopify.
2. Chỉnh hero poster-first để tránh video mở đầu đen/mờ.
3. Tách hành vi overlay của header để chỉ đè lên hero banner homepage.

## Open Focus Areas

1. Tiếp tục polish mobile trước khi mở rộng desktop.
2. Kiểm tra trực quan lại:
   - homepage hero/header
   - featured collection
   - quick view
   - collection/search mobile
3. Mọi chỉnh sửa UI mới nên cập nhật lại file này ngay sau khi hoàn tất.

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
