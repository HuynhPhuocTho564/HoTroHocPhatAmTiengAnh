---
name: web-usability-scales
description: Use when evaluating UX before/after changes, measuring improvement, ending a sprint, or establishing a usability baseline for Web_HoTroPhatAmEN. Applies SUS (System Usability Scale, 10 items + scoring formula), UEQ (User Experience Questionnaire, 6 scales + 26 word-pairs), and WAMMI (20 items + 5 scales) via heuristic estimation when no real users are available. Required at the end of each sprint in PLAN/03_UI_UX/IMPROVEMENT_P1..P6.
---

# Web Usability Scales

## Khi nào dùng

- Đánh giá UX **before** thay đổi (lập baseline)
- Đánh giá UX **after** thay đổi (đo cải thiện)
- **Kết thúc mỗi sprint** trong `PLAN/03_UI_UX/IMPROVEMENT_P1..P6` (cùng `project-quality-gate` cho code quality)
- Xác nhận roadmap có thực sự cải thiện UX
- Khi nghi ngờ thay đổi có thể hại UX → đo lại

Dùng song song với `project-quality-gate` (skill gốc cho code quality/build) — skill này cho *UX quality*. Hoàn toàn mới, không skill nào đo lường usability.

## Checklist thực thi

- [ ] Estimated SUS score (0-100) + grade A-F
- [ ] UEQ 6 scale (Attractiveness, Perspicuity, Efficiency, Dependability, Stimulation, Novelty)
- [ ] WAMMI 5 scale (Attractiveness, Controllability, Efficiency, Helpfulness, Learnability)
- [ ] So sánh before/after (điểm có cải thiện không)
- [ ] Ghi bias & giới hạn method (heuristic ≠ user thật)
- [ ] Nếu điểm GIẢM sau sprint → flag review lại thay đổi

## Lý thuyết cốt lõi

### A. SUS (System Usability Scale) — Brooke 1996

**10 câu Likert 5 điểm** (1 = Strongly Disagree / Rất không đồng ý → 5 = Strongly Agree / Rất đồng ý). 10 câu gốc (verbatim, song ngữ):

1. I think that I would like to use this system frequently — *Tôi nghĩ mình muốn dùng hệ thống này thường xuyên*
2. I found the system unnecessarily complex — *Tôi thấy hệ thống phức tạp không cần thiết*
3. I thought the system was easy to use — *Tôi thấy hệ thống dễ dùng*
4. I think that I would need the support of a technical person to be able to use this system — *Tôi nghĩ cần hỗ trợ kỹ thuật mới dùng được*
5. I found the various functions in this system were well integrated — *Các chức năng tích hợp tốt với nhau*
6. I thought there was too much inconsistency in this system — *Tôi thấy quá nhiều thiếu nhất quán*
7. I would imagine that most people would learn to use this system very quickly — *Đa số người sẽ học cách dùng rất nhanh*
8. I found the system very cumbersome to use — *Tôi thấy hệ thống rất cồng kềnh, khó chịu*
9. I felt very confident using the system — *Tôi rất tự tin khi dùng*
10. I needed to learn a lot of things before I could get going with this system — *Tôi cần học nhiều thứ trước khi dùng được*

**Công thức chấm (BẮT BUỘC chính xác):**

- Câu **lẻ** (1, 3, 5, 7, 9 — positive): điểm đóng góp = **(X − 1)**
- Câu **chẵn** (2, 4, 6, 8, 10 — negative): điểm đóng góp = **(5 − X)**
- Tổng đóng góp (0-40) × **2.5** = SUS score (0-100)

**Ví dụ chấm 1 user:**

| Câu | X | Công thức | Đóng góp |
|----|---|-----------|----------|
| 1 (lẻ) | 4 | 4−1 | 3 |
| 2 (chẵn) | 2 | 5−2 | 3 |
| 3 (lẻ) | 4 | 4−1 | 3 |
| ... | | | |
| Tổng | | | 30/40 |
| SUS = 30 × 2.5 | | | **75** |

**Benchmark (Bangor et al, Sauro & Lewis):**

- **68** = trung bình toàn cầu (50th percentile)
- Thang A-F (Sauro-Lewis adjective):
  - **A** = 84.1+
  - **B** = 80.0-84.1
  - **C** = 70.0-79.9
  - **D** = 65.0-69.9
  - **F** = < 65
- Percentile: 68 = 50th, 75.9 = ~70th, 80 = ~85th, 85.5 = 90th, 90 = 99th
- **Cảnh báo:** adjective rating chỉ tham khảo, không tuyệt đối. SUS ≥ 80 không tự động = "good" — còn phụ thuộc context.

### B. UEQ (User Experience Questionnaire) — Laugwitz 2008

**26 cặp từ đối lập** (semantic differential), thang 7 điểm (-3 → +3). Mỗi item thuộc đúng **1** scale. Reproducing đúng 26 item theo Laugwitz 2008 (nguồn chuẩn: ueq-online.org) — khi áp dụng, đối chiếu bản chính thức để tránh sai item-to-scale mapping.

**6 scale (mỗi scale ý nghĩa):**

- **Attractiveness** (6 item) — tổng thể dễ thích, dễ chịu, hấp dẫn. Trực quan tổng thể
- **Perspicuity** (6 item) — dễ hiểu, dễ học, rõ ràng. Câu hỏi: user mới có hiểu ngay không?
- **Efficiency** (4 item) — nhanh, hiệu quả, không rườm rà. Câu hỏi: hoàn thành task bao lâu?
- **Dependability** (4 item) — đáng tin, dự đoán được, ổn định. Câu hỏi: hành vi có nhất quán không?
- **Stimulation** (4 item) — thú vị, kích thích, đáng giá, không nhàm chán. Câu hỏi: user có muốn quay lại?
- **Novelty** (3 item) — mới mẻ, sáng tạo, độc đáo. Câu hỏi: có gì nổi bật so với app khác?

**Đánh giá:**

- mean > **+0.8** = tốt
- **-0.8** đến **+0.8** = trung tính
- mean < **-0.8** = kém

**Scale quan trọng cho gamified EdTech:**

- **Stimulation** — đẩy bởi P3 ranking/tier/podium, P4 economy, P6 social. Đây là Scale giao thoa với gamification engagement
- **Perspicuity** — đẩy bởi P2 onboarding tour, "Gợi ý hôm nay"
- **Dependability** — đẩy bởi P1 consistency (currency, text fix), P5 phonetic explanation (feedback rõ)

### C. WAMMI (Website Analysis and MeasureMent Inventory)

**20 item Likert 5 điểm.** Reproducing đúng 20 item theo WAMMI specification (nguồn: wammi.com) — khi áp dụng, đối chiếu bản chính thức.

**5 scale (mỗi scale ý nghĩa):**

- **Attractiveness** — hấp dẫn thị giác, dễ thích
- **Controllability** — user kiểm soát được flow, không bị đẩy
- **Efficiency** — hiệu quả hoàn thành task, ít bước
- **Helpfulness** — có help, onboarding, tooltip, FAQ. **Cao priority cho app có onboarding**
- **Learnability** — dễ học, dễ nhớ cách dùng

**Trọng số cho app có onboarding/help (như Web_HoTroPhatAmEN):**

- Helpfulness + Learnability cao priority — đẩy bởi P2 onboarding tour (P2-2.3), help page
- Attractiveness — đẩy bởi P1 visual polish, P3 tier color

### D. Phương pháp heuristic estimation (KHÔNG có user thật)

Dự án là đồ án tốt nghiệp, không có budget user test → dùng **heuristic estimation**: expert walkthrough ước điểm. Quy trình 4 bước:

**Bước 1 — Walkthrough task:** làm hết 1 user flow thật. Ví dụ:
1. User mới → landing → signup → onboarding tour → chọn bài đầu
2. Học 1 bài phát âm: nghe → ghi âm → nhận feedback → xem BXH → mua item shop
3. Quay lại ngày 2: daily reward → streak → "Gợi ý hôm nay"

**Bước 2 — Ánh xạ tới câu/scale:** mỗi bước flow chạm câu SUS nào, scale UEQ/WAMMI nào
- Vd: "sidebar nhiều widget" → SUS câu 2 (complex), câu 8 (cumbersome), UEQ Perspicuity ↓
- Vd: "onboarding tour" → SUS câu 4 (need support ↓), câu 10 (need learn ↓), WAMMI Helpfulness ↑

**Bước 3 — Ước điểm:** expert chấm từng câu/scale (1-5 cho SUS, -3→+3 cho UEQ, 1-5 WAMMI) + **ghi lý do**

**Bước 4 — Ghi bias & giới hạn:** expert ≠ user thật, ghi nhận đâu chủ quan

**Template ước lượng (AI/expert dùng):**

```
| Câu SUS | Điểm ước (1-5) | Lý do |
|---------|----------------|-------|
| 1. Dùng thường xuyên | 4 | Streak + daily reward kéo về hàng ngày |
| 2. Phức tạp không cần thiết | 3 | Sidebar nhiều widget (sau P2-2.1 sẽ giảm) |
| 3. Dễ dùng | 4 | Flow học bài rõ, ít bước |
| 4. Cần hỗ trợ kỹ thuật | 2 | Onboarding tour sau P2-2.3 sẽ giảm |
| 5. Chức năng tích hợp tốt | 3 | Currency chưa thống nhất (sau P1-1.1 tăng) |
| 6. Quá nhiều thiếu nhất quán | 3 | "xu" vs "gems" (sau P1-1.1 giảm) |
| 7. Đa số học nhanh | 3 | Hiện chưa có tour (sau P2-2.3 tăng) |
| 8. Cồng kềnh | 3 | Warning block + badge thừa (sau P1 giảm) |
| 9. Tự tin khi dùng | 3 | Feedback phát âm chưa giải thích sai (sau P5-5.1 tăng) |
| 10. Cần học nhiều trước khi dùng | 3 | Chưa onboarding (sau P2-2.3 giảm) |

Tính: lẻ (1,3,5,7,9): (4-1)+(4-1)+(3-1)+(3-1)+(3-1) = 3+3+2+2+2 = 12
     chẵn (2,4,6,8,10): (5-3)+(5-2)+(5-3)+(5-3)+(5-3) = 2+3+2+2+2 = 11
     Tổng = 23/40 × 2.5 = **57.5** (D)

Lý do thấp: chưa làm P2 onboarding, P3 ranking visibility, P5 phonetic feedback.
Baseline hiện tại UI_UX_COMPREHENSIVE_EVALUATION ước ~75 — khác biệt do khác flow test.
```

### E. Before/after comparison cho roadmap

- **Baseline** (hiện tại, từ `UI_UX_COMPREHENSIVE_EVALUATION`): SUS ~75 (C), Gamification Engagement 6.3/10, Production 4.4/10
- **Sau mỗi sprint:** ước lại SUS + UEQ Stimulation + WAMMI Helpfulness → so sánh → xác nhận
- **Quy tắc:** nếu sau sprint điểm GIẢM → flag review lại (thay đổi có thể hại UX, dù code đúng)

**Dự đoán roadmap (heuristic):**

| Sprint | Task | SUS ảnh hưởng | UEQ scale | WAMMI scale |
|--------|------|---------------|-----------|-------------|
| S1 | P1 quick wins | +2-3 (câu 5,6,8) | Perspicuity↑, Dependability↑ | — |
| S1 | P3-3.1 + 3.2 ranking+tier | +2 (câu 5) | **Stimulation↑** | — |
| S2 | P2-2.2 gợi ý hôm nay | +1-2 (câu 7,8) | Efficiency↑ | Efficiency↑ |
| S2 | P3-3.3 + 3.4 podium+notif | +1 | **Stimulation↑** | — |
| S3 | P5-5.1 phonetic feedback | +2 (câu 9) | Dependability↑ | — |
| S3 | P6-6.1 share | +1 | Novelty↑ | — |
| S4 | P2-2.3 onboarding tour | +3-4 (câu 4,7,10) | Perspicuity↑ | **Helpfulness↑**, **Learnability↑** |
| S4 | P3-3.5 season ceremony | +1 | **Stimulation↑** | — |
| **Tổng** | | **~85+ (A)** | Stimulation +1.5 | Helpfulness +1.2 |

### F. Giới hạn method

- **Heuristic estimation CHỈ dùng so sánh tương đối before/after**, KHÔNG dùng công bố số tuyệt đối (vd: không nói "SUS = 85" như đo thật)
- **Bias:** expert thường chấm **cao hơn** user thật (vì quen app, biết intent)
- **Không thay thế user test thật** (5+ user) trước production release lớn
- Đưa kết quả heuristic kèm caveat: *"ước lượng expert, chưa validate với user"*

## Ví dụ before/after (từ PLAN IMPROVEMENT)

### Ví dụ 1: P1-1.1 currency unification → SUS câu 6 (consistency)

```
BEFORE: "xu" + "gems" + "XP" → user thấy 3 tiền tệ → SUS câu 6 ước 3 (thiếu nhất quán)
AFTER:  XP + Gems thống nhất    → câu 6 ước 4
Đóng góp: (5-3) → (5-4) = 2 → 1 → SUS +1 × 2.5 = +2.5
```

### Ví dụ 2: P2-2.3 onboarding tour → 4 câu SUS + WAMMI Helpfulness

```
BEFORE: user mới không tour → lạc → câu 4 (need support) 4, câu 7 (learn quickly) 2, câu 10 (need learn) 4
AFTER:  tour 5 bước          → câu 4 ước 2, câu 7 ước 4, câu 10 ước 2
Đóng góp:
  câu 4 chẵn: (5-4)→(5-2) = 1→3 = +2
  câu 7 lẻ: (2-1)→(4-1) = 1→3 = +2
  câu 10 chẵn: (5-4)→(5-2) = 1→3 = +2
  Tổng +6 × 2.5 = +15 SUS
WAMMI: Helpfulness mean ước từ +0.3 → +1.2
```

### Ví dụ 3: P3-3.1 + 3.2 ranking visibility + tier → UEQ Stimulation

```
BEFORE: Ranking Score ẩn, không tier → Stimulation ước +0.3
AFTER:  Hiện +X điểm hạng trong summary, tier Bronze→Diamond trên avatar → +1.0
Lý do: Goal-Gradient + identity "Gold player" → user muốn quay lại cạnh tranh
```

### Ví dụ 4: P5-5.1 phonetic explanation → SUS câu 9 (confident) + UEQ Dependability

```
BEFORE: feedback "sai" không giải thích → câu 9 ước 2, Dependability +0.3
AFTER:  "Bạn sai /ʃ/ vì lưỡi chưa cong"  → câu 9 ước 4, Dependability +0.9
Lý do: user biết sai ở đâu → tự tin sửa → Dependability "dự đoán được hành vi"
```

## Quan hệ với skill khác

- **Hoàn toàn mới** — không skill nào đo lường usability. Skill gốc gần nhất là `project-quality-gate` (code quality/build/test), skill này cho *UX quality*.
- **Cặp với `project-quality-gate`** (skill gốc): quality-gate cho *code validation cuối sprint*, skill này cho *UX validation cuối sprint*. Dùng song song: quality-gate pass + web-usability-scales đo → sprint hoàn tất.
- **Cặp với `nielsen-ux-heuristics`** (cùng nhóm): nielsen cho *nhận định* (heuristic có vi phạm không), skill này cho *đo lường* (điểm số). Nhận định rồi mới đo được cụ thể.
- **Cặp với `ui-color-harmony`** (cùng nhóm): SUS câu 6 (consistency) + UEQ Attractiveness bị ảnh hưởng color harmony. Đo trước/sau khi đổi màu.
