# Ke hoach tinh diem va bang xep hang

Ngay chot: 14/06/2026

Skill can doc khi code phan nay:

- `english_pronunciation_app/.agents/skills/gamification_designer/SKILL.md`
- `english_pronunciation_app/.agents/skills/question-bank-curator/SKILL.md` neu scoring phu thuoc cau hoi/kho du lieu.
- `english_pronunciation_app/.agents/skills/project-quality-gate/SKILL.md` truoc khi ket thuc dot code.

## 1. Nguyen tac chinh

- Tach `XP` va `Ranking Score`.
- `XP` dung cho dong luc hoc lau dai: level, streak, badge, lich su hoc.
- `Ranking Score` dung de leo bang xep hang theo ky: tuan/thang.
- Khong khoa bai hoc theo XP.
- Neu co unlock bai hoc, chi nen unlock theo tien do hoan thanh bai truoc hoac dieu kien hoc tap, khong dua vao XP tich luy.
- Khuyen khich hoc nhieu bai trong ngay bang daily bonus cho ca XP va `Ranking Score`, nhung can co gioi han de tranh spam.

Ly do khong dung XP tong de xep hang chinh:

- User cu se co loi the qua lon.
- User moi kho canh tranh, de nan.
- Bang tuan/thang reset theo ky se cong bang va tao dong luc quay lai hoc.

## 2. Diem theo loai bai

| Loai bai | Muc tieu | Diem goc goi y |
|---|---|---:|
| `listen_choose` | Nghe va chon dung | 5 |
| `speak_word` | Doc 1 tu | 10 |
| `speak_minimal_pair` | Doc cap tu de nham | 15 |
| `speak_sentence` | Doc cau hoan chinh | 20 |

Quy tac:

- Bai trac nghiem nghe/chon: dung thi nhan diem goc, sai thi 0 hoac diem rat thap.
- Bai noi: diem cau phu thuoc `accuracyScore`.
- Transcript rong hoac loi mic: khong cong diem cho cau do.

Cong thuc goi y cho bai noi:

```text
questionScore = baseScore * accuracyScore / 100
```

Vi du:

```text
speak_sentence co baseScore = 20
accuracyScore = 80
questionScore = 20 * 80 / 100 = 16
```

## 3. Diem bai lam

`ExerciseAttempt.score` nen la tong diem bai lam sau khi quy doi ve thang 100 hoac tong raw score.

De de demo va hien thi, nen dung thang 100:

```text
exerciseScore = totalQuestionScore / maxQuestionScore * 100
```

Vi du:

```text
Tong diem dat duoc = 68
Tong diem toi da = 80
exerciseScore = 68 / 80 * 100 = 85
```

## 4. XP

XP la diem tich luy lau dai, dung cho:

- Level.
- Huy hieu.
- Streak/daily activity.
- Cam giac tien bo cua nguoi hoc.

Goi y:

```text
xpEarned = round(exerciseScore * difficultyMultiplier)
```

Multiplier goi y:

| Loai bai | Multiplier |
|---|---:|
| `listen_choose` | 0.5 |
| `speak_word` | 0.8 |
| `speak_minimal_pair` | 1.0 |
| `speak_sentence` | 1.2 |
| Review unit | 1.3 |

Luu y:

- XP khong dung de khoa bai hoc.
- XP co the dung de hien level, badge va thanh tien do.
- XP co the van cong mot luong nho khi user lam lai bai, ke ca diem thap hon lan cu, vi day la hanh vi on tap.

### Daily bonus

De khuyen khich nguoi dung hoc nhieu bai trong mot ngay, them bonus theo so bai hoan thanh hop le trong ngay. Bonus nay nen cong vao ca XP va `Ranking Score`, nhung `Ranking Score` bonus phai nho hon va co tran ngay.

Goi y:

| Bai hoan thanh trong ngay | Bonus XP | Bonus Ranking Score |
|---:|---:|---:|
| 1 bai | +0 | +0 |
| 2 bai | +5 | +2 |
| 3 bai | +10 | +4 |
| 5 bai | +20 | +8 |
| 8 bai tro len | +30 toi da | +12 toi da |

Quy tac:

- Chi tinh bai hoan thanh hop le, khong tinh cau transcript rong hoac bai loi mic.
- Bonus tinh theo ngay trong `DailyActivity`.
- Nen co tran bonus ngay, vi du toi da +30 XP/ngay va +12 Ranking Score/ngay.
- Bonus `Ranking Score` chi cong khi bai hoan thanh hop le va co diem toi thieu, vi du `exerciseScore >= 50`.

Ly do:

- Khuyen khich hoc deu va hoc nhieu hon trong ngay.
- Van tao dong luc tranh hang.
- Khong lam leaderboard bi spam qua manh vi co tran diem.
- De hien UI: "Hom nay ban da hoan thanh 3 bai, +10 XP va +4 diem hang bonus".

## 5. Ranking Score

Ranking Score la diem canh tranh tren bang xep hang.

Nen co trong MVP:

- Bang xep hang tuan.
- Bang xep hang thang.
- Bang xep hang chung tat ca loai bai.
- All-time leaderboard chi de xem them, khong phai bang canh tranh chinh.

Chua can chia theo loai bai trong MVP vi du lieu se bi loang.

Sau nay co the them:

- Bang nghe.
- Bang noi.
- Bang minimal pair.
- Bang doc cau.
- Bang theo chu de: nguyen am, phu am, phu am kho.

## 6. Chong farm diem

Khong nen cong leaderboard lap lai full diem moi lan lam lai bai de, nhung van nen cong it XP va it `Ranking Score` cho viec on tap hop le.

Quy tac de xuat:

- Lan dau hoan thanh bai: cong full `Ranking Score`.
- Lam lai bai: chi cong phan cai thien so voi diem tot nhat truoc do.
- Neu diem moi thap hon hoac bang diem cu: cong it `Ranking Score` on tap va XP on tap o muc thap.
- XP on tap co the bang 10-25% XP bai lam, tuy muc diem va so lan lam lai.
- `Ranking Score` on tap nen rat nho, vi du 5-10% diem bai lam, va co tran theo ngay.

Vi du:

```text
Lan 1: dat 70 diem -> leaderboard +70
Lan 2: dat 85 diem -> leaderboard +15
Lan 3: dat 80 diem -> leaderboard +4 diem on tap, van co the +5 XP on tap
```

Quy tac nay khuyen khich hoc de cai thien, van ghi nhan viec on tap/tranh hang, nhung khong khuyen khich spam bai de de leo bang xep hang.

Goi y cong diem khi lam lai:

| Truong hop lam lai | Ranking Score | XP |
|---|---:|---:|
| Diem moi cao hon best score | Cong phan diem cai thien | 50-100% XP tuy muc diem |
| Diem moi bang best score | 10% diem bai lam, co tran | 20% XP bai lam |
| Diem moi thap hon best score | 5% diem bai lam, co tran | 10% XP bai lam |
| Transcript rong/loi mic | +0 | +0 |

Co the them gioi han:

- Moi exercise chi duoc nhan XP on tap toi da 2-3 lan/ngay.
- Moi exercise chi duoc nhan `Ranking Score` on tap toi da 1-2 lan/ngay.
- Tong `Ranking Score` on tap toi da moi ngay, vi du +20 diem/ngay.
- Neu lam lai qua nhieu lan trong ngay, chi luu attempt, khong cong XP/Ranking Score them.

## 7. Badge va dong luc hoc

Nen co badge theo cac nhom:

- Hoan thanh nhom am: nguyen am don, nguyen am doi, phu am co ban, phu am kho.
- Dat diem cao: bai dau tien >= 80, bai dau tien >= 90.
- Streak: 3 ngay, 7 ngay, 14 ngay, 30 ngay.
- Cai thien ca nhan: tang diem mot bai len >= 20 diem so voi lan cu.
- Review master: hoan thanh review unit voi diem >= 80.

Dong luc UI:

- Weekly leaderboard reset moi tuan.
- Hien "best score" cua tung bai.
- Hien "ban da cai thien +15 diem" khi lam lai tot hon.
- Hien "on tap +5 XP, +4 diem hang" khi lam lai diem thap hon nhung van hoan thanh hop le.
- Hien daily bonus khi hoan thanh nhieu bai trong ngay: "+10 XP, +4 diem hang".
- Hien XP/level/streak, nhung khong khoa bai theo XP.

## 8. Daily check-in

Daily check-in nen cong diem de khuyen khich nguoi dung quay lai hoc moi ngay.

MVP chot:

```text
Daily Check-in:
+10 XP
+2 Ranking Score
```

Quy tac:

- Moi user chi check-in 1 lan/ngay.
- Diem check-in cong vao XP va Ranking Score trong ky hien tai.
- Ranking Score tu check-in nho de tranh viec chi diem danh cung leo top.
- Neu co streak bonus, de sau hoac cong rat nho.

## 9. Nguong danh gia bai lam

Chot nguong MVP:

```text
>= 70 diem: hoan thanh
>= 80 diem: tot
>= 90 diem: xuat sac / co the cap badge
```

Y nghia:

- Duoi 70: van luu attempt va co the co XP/diem on tap, nhung chua tinh la hoan thanh bai.
- Tu 70 tro len: tinh la hoan thanh va co the unlock bai tiep theo neu learning map dung unlock theo tien do.
- Tu 90 tro len: ung vien cap badge thanh tich.

## 10. Anh xa vao schema hien tai

Schema hien co da du cac truong co ban:

- `QuestionAttempt.score`: diem tung cau.
- `QuestionAttempt.accuracyScore`: diem chinh xac bai noi.
- `QuestionAttempt.fluencyScore`: diem troi chay, de dung sau.
- `QuestionAttempt.feedback`: phan hoi ngan.
- `ExerciseAttempt.score`: diem tong bai lam.
- `User.xp`: XP tich luy.
- `User.level`: level hien thi.
- `DailyActivity.xpEarned`: XP theo ngay.
- `DailyActivity.completedExercises`: so bai hoan thanh trong ngay, dung de tinh daily bonus.
- `DailyActivity.checkIns`: so lan diem danh trong ngay, MVP toi da 1.
- `Leaderboard.score`: ranking score theo tuan/thang.
- `Leaderboard.type`: `tuan` hoac `thang`.
- `Leaderboard.period`: ky xep hang, vi du `2026-W24` hoac `2026-06`.

Neu can chong farm diem tot hon, sau nay co the them bang/field theo doi best score per user per exercise va daily ranking bonus detail. MVP co the tinh bang query tu `ExerciseAttempt` va `DailyActivity`.

## 11. Can cap nhat khi code

Phase 2:

- Tao `src/lib/scoring.ts`.
- API submit can tinh `QuestionAttempt.score`, `ExerciseAttempt.score`, `xpEarned`, `dailyBonusXp`, `dailyBonusRanking`, `rankingDelta`, `retakeXp`, `retakeRanking`.
- Luu chi tiet tung cau.

Phase 3:

- Tao/cap nhat `src/lib/gamification.ts`.
- Cap nhat `User.xp`, `User.level`, `DailyActivity`, `Leaderboard`.
- Tinh daily bonus XP va daily bonus Ranking Score dua tren so bai hoan thanh hop le trong ngay.
- Gioi han retake bonus va daily ranking bonus de leaderboard khong bi spam.
- UI dashboard/leaderboard/badges dung du lieu that.
