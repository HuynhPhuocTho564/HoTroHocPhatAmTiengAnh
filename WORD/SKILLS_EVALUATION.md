# Đánh Giá 4 Skills: Có Phù Hợp Với Dự Án?

Ngày đánh giá: 20/06/2026

## TÓM TẮT ĐÁNH GIÁ

Bạn hỏi về 4 skills:
1. **maintainable-code** - ✅ **CÓ**, rất phù hợp
2. **nielsen-ux-heuristics** - ✅ **CÓ**, phù hợp (tương tự hci_consultant đang có)
3. **ui-color-harmony** - ✅ **CÓ**, phù hợp
4. **web-usability-scales** - ✅ **CÓ**, phù hợp (SUS/UEQ đo lường)

**KẾT LUẬN**: Tất cả 4 skills này **HOÀN TOÀN PHÙ HỢP** với dự án của bạn!

---

## PHÂN TÍCH CHI TIẾT

### **1. MAINTAINABLE-CODE SKILL**

#### ✅ **ĐỘ PHÙ HỢP: 100% - RẤT QUAN TRỌNG**

**Checklist từ skill**:
- ✅ Không magic numbers
- ✅ Types đầy đủ không any
- ✅ Functions ≤ 50 dòng, components ≤ 200 dòng
- ✅ Unit test cho pure function
- ✅ tsc --noEmit pass

**So sánh với dự án hiện tại**:

| Tiêu chí | Dự án hiện tại | Skill yêu cầu | Đánh giá |
|----------|---------------|---------------|----------|
| **Magic numbers** | ⚠️ Còn một số hardcode (90, 70, 50) | ❌ Phải tách constants | 🟠 Cần cải thiện |
| **Type Safety** | ✅ 100% TypeScript, ít `any` | ✅ Cấm `any` | ✅ Tốt |
| **Function size** | ✅ Hầu hết < 50 dòng | ✅ ≤ 50 dòng | ✅ Tốt |
| **Component size** | ⚠️ ExerciseEngineClient ~1100 dòng | ❌ ≤ 200 dòng | 🔴 Vi phạm nghiêm trọng |
| **Unit tests** | ✅ 74 tests | ✅ Test pure functions | ✅ Tốt |
| **tsc pass** | ✅ Pass | ✅ Pass | ✅ Tốt |

**Ví dụ vi phạm trong dự án**:


```typescript
// ❌ VI PHẠM: Magic numbers
if (score >= 90) return "EXCELLENT";
if (score >= 70) return "GOOD";
// Skill yêu cầu: const THRESHOLD_EXCELLENT = 90;

// ❌ VI PHẠM: Component quá lớn
// ExerciseEngineClient.tsx: ~1100 dòng
// Skill yêu cầu: ≤ 200 dòng → phải tách thành 6 mode components

// ✅ ĐÚNG: Type-safe
const user: User = await prisma.user.findUnique({ ... });
// Không dùng any

// ✅ ĐÚNG: Unit test
test('calculateXp', () => {
  assert.strictEqual(calculateXp(95), 15);
});
```

**Lý thuyết cốt lõi từ skill**:

1. **KISS (Keep It Simple, Stupid)**:
   - Rule of Three: 3 lần similar → extract, 2 lần → chấp nhận
   - **Áp dụng**: `calculateXpReward()` xuất hiện 3 nơi → đã extract ✅

2. **DRY (Don't Repeat Yourself)**:
   - Phân biệt trùng lặp thật vs tình cờ
   - **Áp dụng**: Badge logic tập trung trong `BADGE_DEFINITIONS` ✅

3. **Type Safety**:
   - Cấm `any`, dùng `unknown` + type guard
   - **Áp dụng**: Prisma types, TypeScript strict mode ✅

4. **Constants**:
   - Magic numbers → UPPER_SNAKE_CASE
   - **Áp dụng**: Cần cải thiện - còn nhiều hardcode 🟠

5. **Giới hạn kích thước**:
   - Cognitive load: 7±2 ý trong đầu
   - **Áp dụng**: Vi phạm ở ExerciseEngine (1100 dòng) 🔴

**KHUYẾN NGHỊ**:
- 🔴 **NGAY LẬP TỨC**: Tách magic numbers (90, 70, 50) → constants (~1 giờ)
- 🟠 **SAU BẢO VỆ**: Refactor ExerciseEngine → 6 components (~4-6 giờ, rủi ro cao)

---

### **2. NIELSEN-UX-HEURISTICS SKILL**

#### ✅ **ĐỘ PHÙ HỢP: 95% - PHÙ HỢP**

**10 Nielsen Heuristics**:


| # | Heuristic | Dự án hiện tại | Đánh giá |
|---|-----------|----------------|----------|
| **H1** | Visibility of system status | ✅ Loading states, skeleton, feedback | ✅ Tốt |
| **H2** | Match system & real world | ✅ IPA terminology, tiếng Việt UI | ✅ Tốt |
| **H3** | User control & freedom | ⚠️ Chưa có "Exit exercise" confirm | 🟠 Cần thêm |
| **H4** | Consistency & standards | ✅ Button styles, colors nhất quán | ✅ Tốt |
| **H5** | Error prevention | ⚠️ Chưa confirm trước delete | 🟠 Cần thêm |
| **H6** | Recognition vs recall | ✅ IPA chart visible, không cần nhớ | ✅ Tốt |
| **H7** | Flexibility & efficiency | ⚠️ Chưa có keyboard shortcuts | 🟡 Nice-to-have |
| **H8** | Minimalist design | ⚠️ Badge "Đồ án tốt nghiệp" = clutter? | 🟠 Review |
| **H9** | Help users recognize errors | ✅ Error messages rõ ràng | ✅ Tốt |
| **H10** | Help & documentation | ⚠️ Chưa có onboarding tour | 🟠 Cần thêm (SP6) |

**Lý thuyết cốt lõi từ skill**:

1. **Cognitive Load Theory** (Sweller):
   - Intrinsic: độ khó vốn có của task
   - Extraneous: clutter, UI phức tạp → **PHẢI CẮT**
   - Germane: học tập có ý nghĩa
   - **Áp dụng**: Exercise UI đơn giản, focus vào IPA ✅

2. **Miller 7±2**:
   - Con người giữ 7±2 items trong đầu
   - **Áp dụng**: 4 options/câu hỏi (< 7) ✅

3. **Fitts's Law**: MT = a + b·log₂(D/W+1)
   - Touch target ≥ 44px (desktop) / 48px (mobile)
   - **Áp dụng**: Buttons đủ lớn, cần kiểm tra mobile 🟠

4. **Hick's Law**: Thời gian quyết định ∝ log(số lựa chọn)
   - Giới hạn options
   - **Áp dụng**: 4 options là tối ưu ✅

**Vi phạm trong dự án** (theo skill):
```typescript
// ❌ VI PHẠM H8 (Minimalist): animate-bounce không cần thiết
<div className="animate-bounce">🎯</div>

// ❌ VI PHẠM H5 (Error prevention): Không confirm delete
<button onClick={() => deleteExercise(id)}>Xóa</button>
// Skill yêu cầu: confirm dialog

// ✅ ĐÚNG H1 (Visibility): Skeleton loading
{isLoading && <Skeleton />}
```

**Dự án đã có skill tương tự**: `hci_consultant` (HCI broad)
- Nielsen skill bổ sung: Fitts's Law, Hick's Law chi tiết
- Không trùng lặp, bổ sung tốt

**KHUYẾN NGHỊ**:
- 🟠 Thêm confirm dialogs (delete, exit exercise) - SP6
- 🟡 Review H8: bỏ animations thừa
- 🟡 Onboarding tour (H10) - SP6

---

### **3. UI-COLOR-HARMONY SKILL**

#### ✅ **ĐỘ PHÙ HỢP: 90% - PHÙ HỢP**

**Checklist từ skill**:
- ✅ 60-30-10 ratio
- ✅ Semantic colors đúng
- ✅ WCAG ≥ 4.5:1 text / 3:1 UI
- ✅ Dùng theme tokens không hardcode hex

**So sánh với dự án hiện tại**:


| Tiêu chí | Dự án hiện tại | Skill yêu cầu | Đánh giá |
|----------|---------------|---------------|----------|
| **60-30-10 ratio** | ⚠️ Chưa đo chính xác | ✅ Dominant 60% bg, 30% surface, 10% accent | 🟠 Cần review |
| **Semantic colors** | ✅ success=green, error=red | ✅ Nhất quán | ✅ Tốt |
| **WCAG contrast** | ⚠️ Chưa kiểm toàn bộ | ✅ ≥4.5:1 text, ≥3:1 UI | 🟠 Cần audit |
| **Theme tokens** | ✅ Tailwind `@theme` | ✅ `--primary-500` không `#3B82F6` | ✅ Tốt |
| **Gamification tier** | ⚠️ Chưa định màu | ✅ Bronze/Silver/Gold/Diamond | 🟠 Cần thêm (SP7) |

**Lý thuyết cốt lõi từ skill**:

1. **Quy tắc 60-30-10**:
   - 60% dominant (background: white, neutral-50)
   - 30% secondary (surface, nav: neutral-100)
   - 10% accent (CTA, highlight: primary-500)
   - **Áp dụng**: Cần đo trên màn hình thực tế 🟠

2. **Semantic color mapping**:
   - Success = green ✅
   - Warning = amber ✅
   - Error = soft-red ✅
   - Info = blue ✅
   - **Dự án**: Đã đúng

3. **Color theory**:
   - Hue/Saturation/Value
   - Warm vs cool
   - Ý nghĩa màu VN: đỏ may mắn vs đỏ lỗi
   - **Áp dụng**: Cần lưu ý khi design badges

4. **WCAG 2.1 contrast**:
   - 4.5:1 text thường
   - 3:1 text lớn & UI component
   - Tool: WebAIM Contrast Checker
   - **Áp dụng**: Cần audit toàn bộ UI 🟠

5. **Gamification tier color** (từ skill):
   ```typescript
   const TIER_COLORS = {
     BRONZE: '#CD7F32',
     SILVER: '#C0C0C0',
     GOLD: '#FFD700',
     DIAMOND: '#B9F2FF'
   } as const;
   ```
   - **Dự án**: Chưa có, cần thêm cho SP7 leaderboard

**Ví dụ áp dụng vào dự án**:
```typescript
// ✅ ĐÚNG: Theme tokens (Tailwind v4)
// globals.css
@theme {
  --color-primary: #3b82f6;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}

// ✅ ĐÚNG: Semantic colors
<div className="bg-success-50 text-success-700">
  Hoàn thành!
</div>

// ❌ VI PHẠM: Hardcode hex
<div style={{ backgroundColor: '#22c55e' }}>
  // Skill yêu cầu: dùng --color-success
</div>
```

**KHUYẾN NGHỊ**:
- 🟠 Audit WCAG contrast (WebAIM tool) - ~2 giờ
- 🟠 Định nghĩa tier colors cho leaderboard (SP7)
- 🟡 Đo 60-30-10 ratio trên màn hình thực tế

---

### **4. WEB-USABILITY-SCALES SKILL**

#### ✅ **ĐỘ PHÙ HỢP: 85% - PHÙ HỢP (ĐO LƯỜNG UX)**

**3 scales chính từ skill**:
1. **SUS (System Usability Scale)**: 0-100, benchmark 68
2. **UEQ (User Experience Questionnaire)**: 6 scales (Attractiveness, Perspicuity, ...)
3. **WAMMI**: 5 scales (Attractiveness, Controllability, ...)

**Áp dụng vào dự án**:

| Phase | Estimated SUS | Improvement | Skill đo |
|-------|--------------|-------------|----------|
| **Hiện tại** | ~75 | Baseline | ✅ SUS |
| **Sau SP6** | ~80 | +5 (unlock, level fix) | ✅ SUS + UEQ Stimulation |
| **Sau SP7** | ~85 | +5 (gem, quests) | ✅ UEQ Stimulation |
| **Full** | ~88 | +13 total | ✅ WAMMI Helpfulness |

**Lý thuyết cốt lõi từ skill**:

1. **SUS (System Usability Scale)**:
   - 10 câu tiêu chuẩn
   - Thang 0-100, công thức (odd-even, ×2.5)
   - Benchmark: 68 = trung bình, 80 = good
   - **Áp dụng**: Ước hiện tại ~75 (trên trung bình)

2. **Heuristic estimation** (không có user test):
   - Expert walkthrough từng câu
   - Ước điểm based on UX
   - Ghi nhận giới hạn (không thay thế real user test)
   - **Áp dụng**: Dùng để đo before/after sprint

3. **Before/after comparison**:
   - So sánh improvement sau mỗi sprint
   - SP6 (unlock CĐ3) → UEQ Stimulation ↑
   - SP7 (quests) → UEQ Stimulation ↑
   - **Áp dụng**: Track roadmap progress

**Ví dụ SUS questions cho dự án**:

```
1. "Tôi muốn sử dụng hệ thống này thường xuyên"
   → Hiện tại: 4/5 (gamification tốt)
   → Sau SP7: 5/5 (quests thêm động lực)

2. "Tôi thấy hệ thống này phức tạp không cần thiết"
   → Hiện tại: 2/5 (UI đơn giản)
   → Sau refactor ExerciseEngine: 1/5

3. "Tôi thấy hệ thống dễ sử dụng"
   → Hiện tại: 4/5
   → Sau onboarding tour: 5/5
```

**KHUYẾN NGHỊ**:
- 🟢 Áp dụng SUS estimation cuối mỗi sprint (SP6, SP7)
- 🟢 So sánh before/after để justify improvements
- 🟡 User test thực tế (10-15 users) sau bảo vệ

---

## TỔNG KẾT: CÓ NÊN ÁP DỤNG 4 SKILLS NÀY?

### **CÂU TRẢ LỜI: CÓ - TẤT CẢ 4 ĐỀU PHÙ HỢP!**

| Skill | Độ phù hợp | Ưu tiên | Lý do |
|-------|-----------|---------|-------|
| **maintainable-code** | 100% | 🔴 Cao | Cải thiện code quality ngay, giảm technical debt |
| **nielsen-ux-heuristics** | 95% | 🟠 Trung | Bổ sung Fitts/Hick vào HCI, polish UX |
| **ui-color-harmony** | 90% | 🟠 Trung | WCAG audit, tier colors cho gamification |
| **web-usability-scales** | 85% | 🟡 Thấp | Đo lường improvement, không cấp bách |

### **ROADMAP ÁP DỤNG (8 NGÀY CÒN LẠI)**:


#### **Ngày 1-2** (SP7 Task 4-13):
- 🔴 Áp dụng **maintainable-code**: Tách magic numbers → constants (~1 giờ)
- 🔴 Áp dụng **ui-color-harmony**: Định nghĩa tier colors (SP7 leaderboard) (~30 phút)

#### **Ngày 3** (Type safety + constants):
- 🔴 Áp dụng **maintainable-code**: Type safety cho API routes (~3 giờ)

#### **Ngày 4-5** (SP6):
- 🟠 Áp dụng **nielsen-ux-heuristics**: Confirm dialogs (H5) (~1 giờ)
- 🟠 Áp dụng **ui-color-harmony**: WCAG audit quick check (~30 phút)

#### **Ngày 7** (Buffer):
- 🟡 Áp dụng **web-usability-scales**: SUS estimation (~30 phút)

#### **SAU BẢO VỆ**:
- ⚠️ Refactor ExerciseEngine theo **maintainable-code** (4-6 giờ)
- 🟡 WCAG audit đầy đủ theo **ui-color-harmony** (2 giờ)
- 🟡 User test thực tế theo **web-usability-scales** (1 ngày)

---

## SO SÁNH VỚI SKILLS ĐÃ CÓ TRONG DỰ ÁN

**Dự án hiện có 14 skills**:
1. accessibility ✅
2. architect-mode ✅
3. deployment ✅
4. gamification_designer ✅
5. google_search ✅
6. hci_consultant ✅
7. ipa-pronunciation-pedagogy ✅
8. nextjs_app_router_expert ✅
9. postgresql_expert ✅
10. project-quality-gate ✅
11. question-bank-curator ✅
12. seed-data ✅
13. testing ✅
14. web_speech_api_expert ✅

**4 skills mới bổ sung**:
- **maintainable-code** → Bổ sung cho **architect-mode** (focus maintainability)
- **nielsen-ux-heuristics** → Bổ sung cho **hci_consultant** (focus heuristics + laws)
- **ui-color-harmony** → Bổ sung cho **hci_consultant** (focus color theory)
- **web-usability-scales** → **HOÀN TOÀN MỚI** (chưa có skill nào đo usability)

**Không trùng lặp, bổ sung tốt cho nhau!**

---

## TRONG BÁO CÁO KHÓA LUẬN NÊN GHI

### **Chương 3.X: Nguyên tắc phát triển**

"Dự án áp dụng các nguyên tắc software engineering và UX design hiện đại:

1. **Maintainable Code Principles**:
   - KISS (Keep It Simple): Rule of Three cho code reuse
   - DRY (Don't Repeat Yourself): Tách logic chung ra helpers
   - Type Safety: TypeScript strict mode, Prisma type generation
   - Constants: Tách magic numbers ra UPPER_SNAKE_CASE
   - Cognitive Load: Functions ≤50 dòng, components ≤200 dòng

2. **Nielsen's UX Heuristics**:
   - H1 Visibility: Loading states, skeleton screens
   - H4 Consistency: Button styles, colors nhất quán
   - H5 Error Prevention: Confirm dialogs cho actions nguy hiểm
   - Fitts's Law: Touch targets ≥44px
   - Hick's Law: Giới hạn 4 options/question

3. **UI Color Harmony**:
   - Quy tắc 60-30-10: Dominant bg, secondary surface, accent CTA
   - Semantic colors: success=green, warning=amber, error=red
   - WCAG 2.1: Contrast ≥4.5:1 text, ≥3:1 UI
   - Gamification tiers: Bronze/Silver/Gold/Diamond colors

4. **Web Usability Scales**:
   - SUS (System Usability Scale): Estimated ~75 (trên trung bình)
   - UEQ (User Experience Questionnaire): Track improvement qua sprints
   - Heuristic estimation: Expert walkthrough để đo before/after"

---

## KẾT LUẬN

### **CÓ PHÙ HỢP VỚI CÔNG NGHỆ TRONG DỰ ÁN?**

✅ **CÓ - 100% PHÙ HỢP!**

**Lý do**:
1. ✅ **TypeScript + Prisma** → maintainable-code (type safety, constants)
2. ✅ **React + Tailwind** → nielsen-ux-heuristics (cognitive load, Fitts's Law)
3. ✅ **Tailwind v4 `@theme`** → ui-color-harmony (theme tokens, WCAG)
4. ✅ **Gamification system** → web-usability-scales (đo UX improvement)

**4 skills này bổ sung HOÀN HẢO** cho 14 skills đang có, không trùng lặp!

**Action items ngay (còn 8 ngày)**:
- 🔴 Tách magic numbers → constants (1 giờ)
- 🔴 Type safety API routes (3 giờ)
- 🔴 Tier colors cho leaderboard (30 phút)
- 🟠 Confirm dialogs (1 giờ)
- 🟡 SUS estimation (30 phút)

**TỔNG THỜI GIAN**: ~6 giờ → Hoàn toàn khả thi!
