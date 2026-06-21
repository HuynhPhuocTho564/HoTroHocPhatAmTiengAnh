---
name: nielsen-ux-heuristics
description: Use when designing new UI, reviewing UX before/after changes, or evaluating heuristics for Web_HoTroPhatAmEN. Applies Nielsen's 10 heuristics, Cognitive Load Theory (Sweller, Miller 7±2), Fitts's Law, Hick's Law, and 4 engagement laws (Aesthetic-Usability, Goal-Gradient, Von Restorff, Doherty Threshold). Required for every task in PLAN/03_UI_UX/IMPROVEMENT_P1..P6.
---

# Nielsen UX Heuristics

## Khi nào dùng

- Thiết kế UI mới (component, page, modal, flow)
- Review UX trước/sau thay đổi
- Đánh giá heuristic khi làm task trong `PLAN/03_UI_UX/IMPROVEMENT_P1..P6`
- Lập baseline / đánh giá cải thiện UX

Dùng song song với `hci_consultant` (skill gốc cho bức tranh HCI lớn: persona, design system, flow) — skill này cho *checklist 10 heuristic + 8 luật UX tập trung* mà hci_consultant không có chi tiết.

## Checklist thực thi

- [ ] H1: Loading/progress states visible (skeleton, spinner, progress bar)
- [ ] H2: Ngôn ngữ user, không jargon; "Mọi thời đại" không "Tất thời gian"
- [ ] H3: Undo/cancel/back rõ ràng ("Try again" sau phát âm sai)
- [ ] H4: Consistency với existing patterns (currency, button style, icon)
- [ ] H5: Confirmation cho destructive action (confirm exit exercise)
- [ ] H6: Hiển thị option, không bắt user nhớ (recognition over recall)
- [ ] H7: Shortcut cho user chuyên + default cho newbie
- [ ] H8: Chỉ giữ info phục vụ task (cắt clutter, bỏ animation distracting)
- [ ] H9: Lỗi rõ + hướng phục hồi ("Sai /ʃ/ vì...", không "Error")
- [ ] H10: Onboarding/help (tour, tooltip, help page)
- [ ] Cognitive Load: ≤7 item/group, progressive disclosure
- [ ] Fitts: touch target ≥44px desktop / 48px mobile
- [ ] Hick: ≤7 option menu, group category

## Lý thuyết cốt lõi

### A. Cả 10 Nielsen heuristics — gắn persona "Minh" (sinh viên Việt ESL beginner, từ hci_consultant)

1. **H1 — Visibility of system status**: user biết đang xảy ra gì
   - Vi phạm: loading mà chỉ hiện text "Đang tải...", spinner không có progress
   - Đúng: skeleton card animate-pulse (P1-1.4), progress bar % , toast thông báo
   - Persona Minh: ghi âm xong không thấy gì → tưởng app treo → thoát

2. **H2 — Match between system and real world**: dùng ngôn ngữ user
   - Vi phạm: "Tất thời gian" (sai grammar), COMMON/RARE/EPIC (tiếng Anh với user Việt)
   - Đúng: "Mọi thời đại" (P1-1.3.1), "Thường/Hiếm/Huyền thoại" (P1-1.3.3)
   - Persona Minh: technical term IPA chưa rõ → cần glossary/tooltip

3. **H3 — User control and freedom**: undo, cancel, back
   - Vi phạm: exit exercise mất tiến độ không cảnh báo
   - Đúng: confirm exit exercise (P2-2.5), "Try again" sau phát âm sai
   - Persona Minh: bấm nhầm → sợ mất streak → cần escape rõ

4. **H4 — Consistency and standards**: cùng ý nghĩa → cùng UI
   - Vi phạm: "xu" + "gems" + "XP" 3 currency (P1-1.1)
   - Đúng: thống nhất XP + Gems, bỏ "xu"
   - Persona Minh: phải học lại ý nghĩa mỗi page = cognitive load

5. **H5 — Error prevention**: confirm trước destructive
   - Vi phạm: nút delete không confirm
   - Đúng: confirm exit exercise (P2-2.5), disable submit khi thiếu field
   - Persona Minh: bấm nhầm "Bỏ qua" → mất chuỗi → chán

6. **H6 — Recognition over recall**: hiển thị option, không bắt nhớ
   - Vi phạm: bắt user gõ category tên
   - Đúng: dropdown/list option, recently-used nổi bật
   - Persona Minh: không nhớ tên phoneme → chọn từ danh sách có IPA + audio

7. **H7 — Flexibility and efficiency**: shortcut cho chuyên + default cho newbie
   - Vi phạm: mỗi lần đều qua 5 bước
   - Đúng: 1-click "Gợi ý hôm nay" (P2-2.2), keyboard shortcut cho power user
   - Persona Minh (mới): default; Hương (teacher): shortcut

8. **H8 — Aesthetic and minimalist**: chỉ giữ info phục vụ task
   - Vi phạm: badge "Đồ án tốt nghiệp 2026" (P1-1.3.2), animate-bounce (P1-1.1.3), warning block thừa (P1-1.5)
   - Đúng: chỉ element phục vụ học phát âm
   - Persona Minh: clutter = extraneous load → giảm germane load (học thật)

9. **H9 — Help users recognize/recover errors**: lỗi rõ + hướng phục hồi
   - Vi phạm: "Error" không giải thích
   - Đúng: "Bạn sai /ʃ/ vì lưỡi chưa cong — nghe lại audio mẫu" (P5-5.1)
   - Persona Minh: cần biết sai ở đâu mới sửa được

10. **H10 — Help and documentation**: onboarding, tooltip, help
    - Vi phạm: không onboarding, user mới lạc
    - Đúng: onboarding tour 5 bước (P2-2.3), tooltip IPA, help page
    - Persona Minh: tour đầu tiên giảm cognitive load chặng đầu

### B. Cognitive Load Theory (Sweller) + Miller 7±2

3 loại cognitive load:

- **Intrinsic** — khó vốn có của bài học (IPA /ʃ/ vs /s/, minimal pair). Không giảm được, nhưng sắp thứ tự + chunking giúp
- **Extraneous** — khó do design kém (clutter, layout rối, animation distracting). **PHẢI CẮT.** Sidebar quá nhiều widget (P2-2.1), badge "Đồ án tốt nghiệp" (P1-1.3.2)
- **Germane** — khó tốt, góp phần xây schema. Gamification, phản hồi cụ thể, lặp có chủ đích

**Miller 7±2**: working memory giữ 7±2 chunk. Áp dụng:
- ≤7 item mỗi session học (HCI consultant đã có)
- ≤7 option mỗi menu (Hick's Law củng cố)
- Progressive disclosure: ẩn advance đến khi cần (tabbed widgets P2-2.1)

### C. Fitts's Law — MT = a + b·log₂(2D/W)

- D = khoảng cách từ con trỏ đến target, W = kích thước target
- Thời gian di chuyển ∝ log(D/W)
- **Hệ quả:**
  - Target thường dùng → to + gần (nút "Claim reward", "Submit")
  - Target nguy hiểm → nhỏ + xa (nút delete ở góc, cách nút thường)
  - Touch target ≥ 44px (desktop WCAG 2.5.5), ≥ 48px (mobile)
  - Recording button 48px (HCI consultant spec)
- Ví dụ: "Gợi ý hôm nay" (P2-2.2) nút to giữa dashboard — Fitts dễ bấm

### D. Hick's Law — RT = a + b·log₂(n+1)

- Thời gian quyết định ∝ log số lựa chọn (n)
- **Hệ quả:**
  - ≤7 option menu chính
  - Group category thay vì list dài
  - Default smart (1 click vào bài tiếp theo, P2-2.2)
  - Progressive disclosure — ẩn option hiếm dùng
- Ví dụ: dashboard sidebar nhiều widget (P2-2.1) → Hick overload → gom thành tab

### E. Aesthetic-Usability Effect (Norman) — bổ sung

- Cái đẹp được *nhận thức* là dễ dùng hơn, dù objectively bằng nhau (thí nghiệm Norman)
- **Hệ quả:** đầu tư visual polish có ROI cao cho first impression
- **Bằng chứng trong dự án:** đánh giá "First impression 8/10 vì đẹp" (UI_UX_COMPREHENSIVE_EVALUATION) — chính hiệu ứng này
- **Cảnh báo:** KHÔNG thay thế usability thật — đẹp + khó vẫn rời user sau 1 tuần (đánh giá "Sau 1 tháng: 4/10" chứng tỏ)
- Áp dụng: giữ visual polish nhưng ưu tiên fix usability sâu (P3 ranking, P5 pedagogy)

### F. Goal-Gradient Effect — bổ sung

- User nỗ lực tăng khi gần đích, chững lại giữa chừng (Kivetz, Urminsky, Zheng)
- **Hệ quả:**
  - Progress bar rõ % → động lực
  - "Còn 2 bài nữa lên Gold" → tăng effort
  - Streak counter → sợ mất (loss aversion cộng hưởng)
- Áp dụng: Rank Tier Bronze→Silver→Gold→Diamond (P3-3.2), streak (P6-6.2), mastery tree progress
- Cảnh báo: gradient sau đích giảm → cần season reset (P3-3.5) để tạo đích mới

### G. Von Restorff Effect (isolation) — bổ sung

- Item khác biệt (màu/kích thước/vị trí) nổi bật, được nhớ tốt hơn
- **Hệ quả:**
  - Chỉ 1 item "primary CTA" khác màu trên màn hình — nhiều CTA cùng nổi = không nổi cái nào
  - Top-3 podium khác visual top 4-20 (P3-3.3) → drama + motivation
- Áp dụng: "Gợi ý hôm nay" nút nổi bật giữa dashboard (P2-2.2), podium top-3 (P3-3.3)

### H. Doherty Threshold — bổ sung

- Phản hồi <400ms = cảm giác "tức thời"; >2s = cảm giác chờ
- **Hệ quả:**
  - Feedback phát âm phải <400ms nếu có thể
  - >400ms → bắt buộc có skeleton/spinner (H1 cộng hưởng)
  - >10s → progress bar với %, không spinner vô định
- Áp dụng: skeleton loading (P1-1.4), speech feedback phải có spinner nếu xử lý lâu

### I. Giới hạn phương pháp

- **Heuristic evaluation KHÔNG thay thế user test thật**
- Evaluator bias: người thiết kế khó thấy lỗi mình làm (盲 điểm)
- Khuyến nghị: heuristic để lọc lỗi rõ ràng trước; user test (5+ user) để bắt lỗi tinh tế trước production release lớn
- Dùng cùng `web-usability-scales` để ước SUS/UEQ trước/sau

## Ví dụ before/after (từ PLAN IMPROVEMENT)

### Ví dụ 1: H8 — bỏ animation distracting (P1-1.1.3)

```tsx
// TRƯỚC — animate-bounce liên tục, extraneous load
<Button className="animate-bounce">Nhận quà</Button>

// SAU — hover feedback subtle
<Button className="hover:scale-[1.02] transition-transform">Nhận quà</Button>
```

### Ví dụ 2: H8 — cắt clutter (P1-1.3.2)

```tsx
// TRƯỚC — badge không phục vụ user goal
<div className="mb-8 inline-flex ...">Đồ án tốt nghiệp 2026</div>

// SAU — xóa/comment
{/* Xóa: element này tăng extraneous cognitive load, không phục vụ học phát âm */}
```

### Ví dụ 3: H1 + Doherty — skeleton loading (P1-1.4)

```tsx
// TRƯỚC — text-only, không biết đang tải gì
{isLoading && <Card>Đang tải huy hiệu...</Card>}

// SAU — skeleton visual + aria-busy
{isLoading && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-busy="true">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} className="animate-pulse">
        <div className="h-14 w-14 rounded-xl bg-neutral-200" />
        <div className="h-6 w-3/4 rounded bg-neutral-200 mt-4" />
      </Card>
    ))}
  </div>
)}
```

### Ví dụ 4: H5 — error prevention (P2-2.5)

```tsx
// TRƯỚC — exit mất tiến độ không cảnh báo
<button onClick={() => router.back()}>← Quay lại</button>

// SAU — confirm trước
const handleExit = () => {
  if (progress > 0 && !confirm("Thoát sẽ mất tiến độ bài này. Tiếp tục?")) return;
  router.back();
};
<button onClick={handleExit}>← Quay lại</button>
```

### Ví dụ 5: Hick + Von Restorff + Goal-Gradient — "Gợi ý hôm nay" (P2-2.2)

```tsx
// 1 nút nổi bật giữa dashboard — giảm Hick (1 lựa chọn thay vì duyệt list),
// Von Restorff (khác màu/vị trí), Goal-Gradient (tiếp tục chuỗi)
<Link href={`/exercises/${nextExerciseId}`} className="bg-primary-500 text-white rounded-xl p-6 shadow-lg hover:scale-[1.02] transition-transform">
  <span className="text-lg font-bold">Gợi ý hôm nay →</span>
  <span className="text-sm opacity-90">{nextExerciseTitle}</span>
</Link>
```

## Quan hệ với skill khác

- **Complement `hci_consultant`** (skill gốc): hci_consultant cho *bức tranh HCI lớn* (persona Minh/Hương, design system, user flow, evaluation methods). Skill này cho *checklist 10 heuristic + 8 luật UX thực thi tập trung* (Fitts, Hick, Aesthetic-Usability, Goal-Gradient, Von Restorff, Doherty) mà hci_consultant chỉ liệt kê tên.
- **Complement `accessibility`** (skill gốc): accessibility cho *WCAG, ARIA, keyboard* (chi tiết kỹ thuật a11y). Skill này cho *nhận định UX tổng thể*. H3/H8 có giao accessibility; khi chạm a11y kỹ thuật, đọc accessibility.
- **Cặp với `web-usability-scales`** (cùng nhóm): skill này dùng để *nhận định*, web-usability-scales dùng để *đo lường*. Nhận định rồi mới đo được.
- **Cặp với `ui-color-harmony`** (cùng nhóm): H8 (minimalist) liên quan 60-30-10; khi quyết màu, đọc cả 2.
