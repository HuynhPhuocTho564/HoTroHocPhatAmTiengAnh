# Ke hoach he thong huy hieu

Ngay chot: 14/06/2026

Skill can doc khi code phan nay:

- `english_pronunciation_app/.agents/skills/gamification_designer/SKILL.md`
- `english_pronunciation_app/.agents/skills/project-quality-gate/SKILL.md` truoc khi ket thuc dot code.

## 1. Muc tieu cua huy hieu

Huy hieu khong dung de khoa bai hoc. Huy hieu dung de:

- Ghi nhan thanh tich hoc tap.
- Tao cam giac tien bo.
- Khuyen khich hoc deu, hoc nhieu va cai thien diem.
- Lam profile/bang xep hang co tinh ca nhan hon.

## 2. Nguyen tac thiet ke

- Dieu kien dat huy hieu phai ro rang, de giai thich trong UI.
- MVP khong nen co qua nhieu huy hieu, tranh loang va kho seed data.
- Moi huy hieu nen co:
  - `name`
  - `description`
  - `condition`
  - `type`
  - `image` hoac icon/key de render UI
- Khong cap trung mot huy hieu vinh vien cho cung user.

Schema hien tai da co:

- `Badge`
- `UserBadge`
- `UserBadge.validPeriod`

## 3. Phan loai huy hieu

Nen chia 5 nhom:

| Nhom | Muc tieu | Vi du |
|---|---|---|
| Progress Badge | Hoan thanh noi dung hoc | Hoan thanh nguyen am don |
| Skill Badge | Dat diem cao o mot ky nang | Nghe tot, noi tot |
| Streak Badge | Duy tri hoc moi ngay | 3 ngay, 7 ngay |
| Improvement Badge | Cai thien diem ca nhan | Tang 20 diem so voi lan cu |
| Ranking Badge | Thanh tich bang xep hang theo ky | Top 10 tuan |

## 4. MVP nen co bao nhieu huy hieu?

MVP nen co khoang 12 huy hieu. Du de demo gamification, nhung khong qua nhieu.

### A. Progress Badge - 4 huy hieu

| Ma goi y | Ten | Dieu kien |
|---|---|---|
| `monophthong_starter` | Nguoi mo khoa nguyen am don | Hoan thanh bai dau tien cua nhom nguyen am don |
| `monophthong_master` | Lam chu nguyen am don | Hoan thanh tat ca bai nguyen am don |
| `minimal_pair_starter` | Tho san cap am | Hoan thanh 3 bai `speak_minimal_pair` |
| `sentence_speaker` | Noi trong ngu canh | Hoan thanh 3 bai `speak_sentence` |

### B. Skill Badge - 3 huy hieu

| Ma goi y | Ten | Dieu kien |
|---|---|---|
| `good_listener` | Tai nghe tinh | Dat >= 80 diem o 5 bai `listen_choose` |
| `clear_speaker` | Phat am ro rang | Dat >= 80 diem o 5 bai noi |
| `excellent_pronunciation` | Phat am xuat sac | Dat >= 90 diem o bat ky bai noi nao |

### C. Streak Badge - 3 huy hieu

| Ma goi y | Ten | Dieu kien |
|---|---|---|
| `streak_3` | Khoi dong thoi quen | Check-in/hoc 3 ngay lien tiep |
| `streak_7` | Mot tuan ben bi | Check-in/hoc 7 ngay lien tiep |
| `streak_14` | Nhip hoc on dinh | Check-in/hoc 14 ngay lien tiep |

Ghi chu: `streak_30` co the de sau neu muon tranh MVP qua dai.

### D. Improvement Badge - 1 huy hieu

| Ma goi y | Ten | Dieu kien |
|---|---|---|
| `comeback_improver` | Tien bo ro ret | Lam lai mot bai va tang >= 20 diem so voi best/lan truoc |

### E. Ranking Badge - 1 huy hieu

| Ma goi y | Ten | Dieu kien |
|---|---|---|
| `weekly_top_10` | Top 10 tuan | Nam trong top 10 weekly leaderboard khi ket thuc hoac trong ky hien tai |

Ghi chu: Ranking badge co the dung `validPeriod`, vi thanh tich theo tuan/thang co tinh thoi diem.

## 5. Huy hieu de sau

Sau MVP co the them:

- `diphthong_master`: lam chu nguyen am doi.
- `consonant_master`: lam chu phu am.
- `tricky_sound_master`: lam chu phu am kho voi nguoi Viet.
- `review_master`: hoan thanh review unit >= 80 diem.
- `daily_grinder`: hoan thanh 5 bai trong 1 ngay.
- `perfect_score`: dat 100 diem.
- `monthly_top_10`: top 10 thang.
- `top_1_week`: hang 1 tuan.

## 6. Do hiem huy hieu

Co the them do hiem bang `Badge.type` hoac quy uoc trong `condition`.

MVP co the dung:

| Rarity | Muc dich |
|---|---|
| `COMMON` | De dat, giup user moi co dong luc |
| `RARE` | Can no luc on dinh |
| `EPIC` | Thanh tich kho |
| `PERIODIC` | Huy hieu theo ky, co `validPeriod` |

Neu chua muon sua schema, co the luu rarity trong `Badge.type`.

## 7. Khi nao cap huy hieu?

Nen goi logic cap huy hieu sau cac hanh dong:

- Submit bai tap thanh cong.
- Daily check-in.
- Cap nhat leaderboard.

Vi du trong Phase 3:

- `checkAndAwardBadges(userId)` trong `src/lib/gamification.ts`.
- Ham nay query attempts, daily activity, leaderboard va user badges de cap moi neu du dieu kien.

## 8. UI hien thi

Nen co:

- Trang `/badges`: tat ca huy hieu, chia `Da dat` va `Chua dat`.
- Dashboard: hien 3-5 huy hieu gan nhat.
- Leaderboard: hien 1-2 huy hieu noi bat cua user.
- Sau khi dat huy hieu: popup/toast ngan.

Text UI nen ngan:

```text
Ban vua dat huy hieu: Phat am xuat sac
```

## 9. Khong nen lam trong MVP

- Huy hieu qua nhieu cap phuc tap.
- Huy hieu co anh minh hoa rieng neu chua co asset.
- Huy hieu khoa bai hoc.
- Huy hieu mat di vinh vien, tru ranking badge theo ky co `validPeriod`.
