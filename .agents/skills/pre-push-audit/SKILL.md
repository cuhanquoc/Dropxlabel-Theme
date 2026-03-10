---
name: pre-push-audit
description: >
  Skill tự soát lỗi toàn diện trước khi đẩy code lên GitHub cho dự án Shopify theme.
  Kiểm tra 8 nhóm: Liquid syntax, CSS conflicts, JS errors, schema integrity,
  broken references, accessibility basics, performance flags, và git hygiene.
  Kích hoạt khi người dùng nói "soát lỗi", "audit trước push", "check before push",
  /pre-push, hoặc trước bất kỳ lệnh git push nào.
---

# 🔍 Pre-Push Audit — Shopify Theme

> **BẮT BUỘC** chạy skill này trước mỗi lần `git push`. Không được bỏ qua bất kỳ nhóm kiểm tra nào.

---

## Tổng quan quy trình

```
[1] Liquid Syntax   →  [2] CSS Conflicts   →  [3] JS Errors
      ↓                       ↓                     ↓
[4] Schema Integrity  →  [5] Broken Refs  →  [6] Accessibility
      ↓                       ↓                     ↓
[7] Performance Flags  →  [8] Git Hygiene  →  ✅ Report
```

Sau mỗi nhóm, ghi nhận: `✅ PASS` | `⚠️ WARNING` | `❌ FAIL`  
Chỉ cho phép push khi **không có ❌ FAIL** nào.

---

## Nhóm 1 — Liquid Syntax 🔴

### 1.1 Kiểm tra tag chưa đóng
Dùng `grep_search` trên từng file `.liquid` trong `sections/` và `snippets/`:

```
Tìm: {%  (without closing %}
Tìm: {{  (without closing }})
Pattern nguy hiểm: {% if ... nhưng không có {% endif %}
Pattern nguy hiểm: {% for ... nhưng không có {% endfor %}
Pattern nguy hiểm: {% unless ... nhưng không có {% endunless %}
Pattern nguy hiểm: {% capture ... nhưng không có {% endcapture %}
```

### 1.2 Kiểm tra filter Liquid bị sai
```
Tìm: | default:  →  giá trị phải có quotes nếu là string
Tìm: | split:   →  delimiter phải có quotes
Tìm: | image_url →  phải có width: hoặc height: param
```

### 1.3 Kiểm tra Liquid trong file sai chỗ
```
Tìm: {{ hay {% trong file .json → CẤM (JSON không chạy Liquid)
Tìm: {{ hay {% trong file .js  → WARNING (trừ assets/ snippet inline)
```

### 1.4 Schema JSON trong section
Với mỗi `{% schema %}...{% endschema %}` block:
- Parse JSON: Kiểm tra dấu phẩy thừa (trailing comma), thiếu dấu phẩy giữa settings
- `"id"` phải là `snake_case`, không dấu cách, không ký tự đặc biệt
- `"type"` phải là type hợp lệ: `text`, `textarea`, `color`, `url`, `image_picker`, `collection`, `range`, `select`, `checkbox`, `video`, `header`, `paragraph`
- Mọi `id` trong `settings[]` phải là **duy nhất** trong cùng một schema

```
Kiểm tra: Có id trùng nhau trong settings không?
Kiểm tra: Có type không hợp lệ không?
Kiểm tra: JSON có parse được không? (format thủ công nếu cần)
```

---

## Nhóm 2 — CSS Conflicts 🟠

### 2.1 Selector trùng lặp gây override
```
Với mỗi class mới được thêm vào src/input.css hoặc <style> tag:
grep_search class đó trong TẤT CẢ .liquid files
→ Nếu xuất hiện ở 2+ files: kiểm tra specificity có xung đột không
```

### 2.2 !important audit
```
grep_search: !important  trong src/input.css
→ Mỗi !important phải có comment giải thích lý do
→ Không được thêm !important mới để "fix nhanh"
→ Nếu có → WARNING (yêu cầu tái cấu trúc)
```

### 2.3 CSS Liquid mixin bị đặt sai chỗ
```
Tìm trong src/input.css: {{ hay {% 
→ NẾU TÌM THẤY → ❌ FAIL — CSS thuần không chạy Liquid
→ Liquid-driven styles phải nằm inline trong .liquid file
```

### 2.4 Tailwind class không tồn tại trong config
```
Kiểm tra các class tùy chỉnh được dùng: font-heading, font-body, text-accent, text-muted, bg-surface
→ Đối chiếu với tailwind.config.js → extend.colors và extend.fontFamily
→ Nếu dùng class không có trong config → ❌ FAIL
```

### 2.5 CSS Build check
```
Kiểm tra: assets/theme.css có tồn tại và không rỗng không?
Kiểm tra: Ngày modified của assets/theme.css > ngày modified của src/input.css
→ Nếu theme.css cũ hơn input.css → ⚠️ WARNING: "Cần rebuild CSS trước khi push"
```

---

## Nhóm 3 — JavaScript Errors 🟠

### 3.1 Custom Element đăng ký trùng
```
grep_search: customElements.define  trong TẤT CẢ .liquid và .js files
→ Nếu cùng một tag name được define 2 lần → ❌ FAIL
→ Mẫu an toàn: if (customElements.get('tag-name')) return;
```

### 3.2 document.getElementById trong Web Component
```
grep_search: document.getElementById  trong sections/ và snippets/
→ Mỗi kết quả: kiểm tra xem nó có nằm trong class extends HTMLElement không
→ Nếu có → ❌ FAIL → phải đổi thành this.querySelector('#id')
```

### 3.3 Event listener không cleanup
```
Tìm trong Web Component: addEventListener  
→ Kiểm tra: có disconnectedCallback() không?
→ Trong disconnectedCallback: có removeEventListener tương ứng không?
→ Nếu thiếu → ⚠️ WARNING (memory leak trong Shopify editor)
```

### 3.4 GSAP không có guard
```
grep_search: gsap.  trong sections/ và snippets/
→ Mỗi usage phải được bao bởi: if (typeof gsap !== 'undefined') { ... }
→ Hoặc nằm trong connectedCallback sau khi GSAP đã load
→ Nếu không có guard → ⚠️ WARNING
```

### 3.5 console.log còn sót
```
grep_search: console.log(  trong sections/ snippets/ assets/
→ Nếu tìm thấy → ⚠️ WARNING: "Xóa debug logs trước khi push production"
```

---

## Nhóm 4 — Schema Integrity 🔴

### 4.1 Section settings khớp với settings_data.json
```
Với mỗi section file đã sửa trong commit này:
1. Đọc schema → lấy danh sách tất cả "id" trong settings
2. Mở config/settings_data.json
3. Kiểm tra: không có id nào trong settings_data tham chiếu đến id đã bị xóa/đổi tên
→ Nếu có orphan id → ⚠️ WARNING
```

### 4.2 Template JSON hợp lệ
```
Với mỗi file trong templates/*.json:
- Parse JSON: có hợp lệ không?
- Mọi section type được liệt kê phải có file tương ứng trong sections/
- Ví dụ: "type": "hero-banner" → sections/hero-banner.liquid phải tồn tại
→ Orphan section reference → ❌ FAIL
```

### 4.3 Presets hợp lệ
```
Mỗi schema phải có ít nhất 1 preset:
"presets": [{ "name": "..." }]
→ Thiếu presets → ⚠️ WARNING (section sẽ không xuất hiện trong Add Section)
```

---

## Nhóm 5 — Broken References 🔴

### 5.1 Snippet references
```
grep_search: {% render '  trong TẤT CẢ .liquid files
→ Với mỗi snippet name tìm thấy: kiểm tra snippets/<name>.liquid có tồn tại không
→ Thiếu → ❌ FAIL
```

### 5.2 Asset references
```
grep_search: asset_url  trong TẤT CẢ .liquid files
→ Với mỗi asset name: kiểm tra assets/<name> có tồn tại không
→ Thiếu → ❌ FAIL
```

### 5.3 Section references trong templates
```
Đọc các file trong templates/ và config/
→ Mỗi "type": "section-name" phải map đến sections/section-name.liquid
→ Thiếu → ❌ FAIL
```

---

## Nhóm 6 — Accessibility Basics 🟡

### 6.1 Ảnh thiếu alt text
```
grep_search: <img  trong sections/ và snippets/
→ Mỗi <img> phải có alt="..."
→ alt="" được phép với ảnh decorative (phải thêm role="presentation")
→ Thiếu alt hoàn toàn → ⚠️ WARNING
```

### 6.2 Button không có label
```
grep_search: <button  trong sections/ và snippets/
→ Mỗi <button> phải có: text nội dung HOẶC aria-label HOẶC aria-labelledby
→ Thiếu → ⚠️ WARNING
```

### 6.3 Form input không có label
```
grep_search: <input  trong sections/ và snippets/
→ Mỗi input type khác "hidden" phải có: <label for> HOẶC aria-label
→ Thiếu → ⚠️ WARNING
```

### 6.4 Màu sắc tương phản (kiểm tra thủ công)
```
Kiểm tra thủ công các combo màu mới thêm vào:
- Text màu nhạt trên nền trắng/sáng → phải ≥ 4.5:1
- Text trong button/badge → phải ≥ 4.5:1
Công cụ: https://webaim.org/resources/contrastchecker/
→ Không thể tự động hóa: BÁO CÁO để người dùng kiểm tra
```

---

## Nhóm 7 — Performance Flags 🟡

### 7.1 Ảnh eager load dư thừa
```
grep_search: loading="eager"  trong sections/ và snippets/
→ CHỈ ảnh above-the-fold (hero, first product) mới dùng eager
→ Nếu loading="eager" trên card số 3 trở đi → ⚠️ WARNING
```

### 7.2 Ảnh dùng Unsplash URL (development placeholder)
```
grep_search: unsplash.com  trong sections/
→ Đây là placeholder dev, KHÔNG được push production sections không có fallback Liquid
→ Nếu tìm thấy trong section không phải placeholder → ⚠️ WARNING
```

### 7.3 Render blocking scripts
```
grep_search: <script src=  trong sections/ và snippets/
→ Mỗi <script src> phải có defer hoặc async attribute
→ Thiếu defer/async → ⚠️ WARNING
```

### 7.4 Inline <style> block dư thừa
```
Kiểm tra mỗi section: có <style> block không?
→ Nếu có: styles này đã được migrate vào src/input.css chưa?
→ Styles còn tồn tại trong section (không phải scoped component) → ⚠️ WARNING
(Note: <style> scoped cho Web Component mới không phải lỗi)
```

---

## Nhóm 8 — Git Hygiene 🟢

### 8.1 Files không nên commit
```
Kiểm tra danh sách git-staged files (hoặc git diff --name-only HEAD):
❌ KHÔNG được commit:
  - node_modules/
  - .DS_Store
  - *.log
  - .env, .env.local, .env.* (ngoại trừ .env.example)
  - src/input.css.map (nếu có)
  - npm-debug.log*
  - .shopifyignore (trừ khi có thay đổi có chủ đích)

Kiểm tra .gitignore có cover các pattern trên không.
```

### 8.2 Secrets và credentials
```
grep_search (case-insensitive):
  - "password", "secret", "api_key", "token", "private_key" trong .js và .liquid
→ Nếu tìm thấy dạng hard-coded string (không phải Liquid variable) → ❌ FAIL NGHIÊM TRỌNG
  
grep_search: SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_KEY trong mọi file có thể track
→ Tìm thấy → ❌ FAIL NGHIÊM TRỌNG — DỪNG, không push
```

### 8.3 Commit message chất lượng
```
Commit message PHẢI tuân theo format:
<type>(<scope>): <mô tả ngắn>

type hợp lệ: feat, fix, style, refactor, perf, chore, docs
Ví dụ tốt: feat(featured-collection): add quick view carousel with GSAP animations
Ví dụ xấu: "update", "fix stuff", "changes"

→ Nếu message không có type prefix → ⚠️ WARNING
```

### 8.4 File size check
```
Kiểm tra: có file nào > 500KB đang được staged không?
→ Ảnh, video không được track bằng git (phải dùng Shopify CDN)
→ File > 500KB → ⚠️ WARNING
```

---

## 📊 Báo Cáo Kết Quả

Sau khi hoàn thành tất cả 8 nhóm, xuất báo cáo theo format:

```
╔══════════════════════════════════════════════════════╗
║           PRE-PUSH AUDIT REPORT                      ║
╠══════════════════════════════════════════════════════╣
║ [1] Liquid Syntax       : ✅ PASS / ⚠️ 2 WARN / ❌ FAIL ║
║ [2] CSS Conflicts       : ✅ PASS / ⚠️ 1 WARN / ❌ FAIL ║
║ [3] JS Errors           : ✅ PASS / ⚠️ 0 WARN / ❌ FAIL ║
║ [4] Schema Integrity    : ✅ PASS / ⚠️ 0 WARN / ❌ FAIL ║
║ [5] Broken References   : ✅ PASS / ⚠️ 0 WARN / ❌ FAIL ║
║ [6] Accessibility       : ✅ PASS / ⚠️ 2 WARN / ❌ FAIL ║
║ [7] Performance Flags   : ✅ PASS / ⚠️ 1 WARN / ❌ FAIL ║
║ [8] Git Hygiene         : ✅ PASS / ⚠️ 0 WARN / ❌ FAIL ║
╠══════════════════════════════════════════════════════╣
║ VERDICT: ✅ SAFE TO PUSH  /  ❌ DO NOT PUSH           ║
╚══════════════════════════════════════════════════════╝
```

Sau báo cáo:
- **Không có ❌**: `→ SAFE TO PUSH. Chạy /deploy để commit và push.`
- **Có ❌**: `→ DO NOT PUSH. Sửa các lỗi FAIL trước. Danh sách:`
  - `[file:line] Mô tả lỗi cụ thể và cách sửa`
- **Chỉ có ⚠️**: `→ CÓ THỂ PUSH nhưng nên sửa các cảnh báo sau:`
  - `[file:line] Mô tả cảnh báo`

---

## Cách Thực Hiện Từng Bước

Khi skill này được kích hoạt, thực hiện tuần tự:

```
1. Xác định files đã thay đổi (git diff HEAD hoặc hỏi người dùng)
2. Chạy từng nhóm 1→8 bằng grep_search và view_file
3. Ghi nhận kết quả mỗi nhóm
4. Xuất báo cáo tổng hợp
5. Nếu PASS → gọi /deploy workflow
   Nếu FAIL → liệt kê lỗi, tự sửa nếu có thể, rồi re-audit
```

### Tool mapping:
| Kiểm tra | Tool sử dụng |
|----------|-------------|
| Tìm pattern trong files | `grep_search` (IsRegex: false hoặc true) |
| Đọc file cụ thể | `view_file` |
| Liệt kê files đã thay đổi | `run_command: git diff --name-only HEAD` |
| Kiểm tra file tồn tại | `find_by_name` |
| Parse JSON schema | `view_file` + đọc thủ công |

---

## Tự Sửa Lỗi (Auto-fix)

Với các lỗi sau, agent CÓ THỂ tự sửa mà không cần hỏi:
- ✅ Thêm `if (customElements.get('tag-name')) return;` guard
- ✅ Thêm `defer` vào script tag
- ✅ Thêm `disconnectedCallback()` skeleton vào Web Component
- ✅ Thêm `aria-label` vào button không có text
- ✅ Xóa `console.log(` dư thừa
- ✅ Sửa trailing comma trong JSON schema

Với các lỗi sau, PHẢI hỏi người dùng trước khi sửa:
- ⚠️ Thay đổi schema ID (có thể break settings_data.json)
- ⚠️ Xóa CSS selector (có thể ảnh hưởng sections khác)
- ⚠️ Thay đổi logic Liquid phức tạp
