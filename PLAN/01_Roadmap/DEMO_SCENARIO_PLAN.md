# Demo Scenario Plan - Kich ban bao ve khoa luan

Ngay lap: 14/06/2026

Muc tieu cua file nay la giu mot kich ban demo so bo de qua trinh code khong lech muc tieu bao ve. Ban chi tiet tung click/man hinh se cap nhat sau khi UI/API gan hoan thien.

## 1. Thong diep demo chinh

He thong ho tro nguoi hoc luyen phat am tieng Anh theo IPA, dua tren phuong phap minimal pairs va gamification.

Luot demo can chung minh duoc:

```text
Dang ky/dang nhap
-> vao learning map
-> chon bai hoc IPA
-> lam bai tap
-> submit ket qua
-> nhan XP + Ranking Score
-> check-in moi ngay
-> nhan/kiem tra huy hieu
-> xem leaderboard
```

## 2. Luong demo chinh

### Buoc 1 - Dang ky / dang nhap

Muc tieu:

- Chung minh he thong co quan ly tai khoan.
- User co session/role.

Du lieu can co:

- User demo thuong.
- User admin neu can demo admin.

Ket qua mong muon:

- Login thanh cong.
- Navbar/dashboard hien dung user.

### Buoc 2 - Learning Map

Muc tieu:

- Chung minh he thong co lo trinh hoc.
- Bai hoc duoc chia theo nhom am IPA.

Du lieu can co:

- It nhat 3 sound groups:
  - `/i:/` vs `/ɪ/`
  - `/e/` vs `/æ/`
  - `/ʊ/` vs `/u:/`
- Moi group co 4 dang bai:
  - `listen_choose`
  - `speak_word`
  - `speak_minimal_pair`
  - `speak_sentence`

Ket qua mong muon:

- Learning map hien cac bai.
- User chon duoc bai dau tien.
- Neu co unlock, unlock theo tien do hoan thanh, khong theo XP.

### Buoc 3 - Lam bai nghe/chon

Muc tieu:

- Chung minh ung dung co audio + IPA.
- Ap dung y tuong nghe truoc, hien/doi chieu dap an sau.

Du lieu can co:

- Audio URL/local audio cho cau hoi.
- Options hop le.

Ket qua mong muon:

- Audio phat duoc.
- User chon dap an.
- He thong hien dung/sai va hint.

### Buoc 4 - Lam bai noi

Muc tieu:

- Chung minh co Web Speech API.
- User doc tu/cap tu/cau.
- He thong ghi transcript va cham diem.

Du lieu can co:

- `speak_word`: 3-5 cau.
- `speak_minimal_pair`: 3-5 cap tu.
- `speak_sentence`: 2-3 cau ngan.

Ket qua mong muon:

- Browser nhan transcript.
- Ket qua duoc submit.
- Neu browser/mic loi, co thong bao fallback ro rang.

### Buoc 5 - Submit ket qua va tinh diem

Muc tieu:

- Chung minh logic scoring nam o server.
- Ket qua duoc luu vao database.

Can demo:

- `ExerciseAttempt`.
- `QuestionAttempt`.
- `ExerciseAttempt.score`.
- XP.
- Ranking Score.
- DailyActivity.

Ket qua mong muon:

- Popup/man hinh ket qua hien:
  - diem bai lam;
  - XP nhan duoc;
  - Ranking Score nhan duoc;
  - daily bonus neu co;
  - badge neu dat.

### Buoc 6 - Daily check-in

Muc tieu:

- Chung minh co dong luc hoc moi ngay.

Quy tac demo:

```text
Daily Check-in:
+10 XP
+2 Ranking Score
```

Ket qua mong muon:

- Check-in 1 lan/ngay.
- Cap nhat streak.
- Cap nhat DailyActivity.
- Neu da check-in hom nay, API/UI bao da diem danh.

### Buoc 7 - Huy hieu

Muc tieu:

- Chung minh gamification khong chi co diem.

Can demo it nhat:

- 1 badge progress hoac skill.
- 1 badge streak neu co.

Ket qua mong muon:

- Trang `/badges` hien huy hieu da dat/chua dat.
- Sau submit/check-in, user co the nhan badge.

### Buoc 8 - Leaderboard

Muc tieu:

- Chung minh Ranking Score duoc dung de xep hang.

Can demo:

- Weekly leaderboard.
- Monthly leaderboard neu kip.
- User hien trong bang xep hang.

Ket qua mong muon:

- Leaderboard sort theo Ranking Score giam dan.
- Hien username, score, completedExercises, level/badge neu co.
- Giai thich ro: XP khong phai diem xep hang chinh.

## 3. Du lieu demo can seed

Can co:

- 1 admin.
- 3-5 user demo.
- 3 sound groups dau tien.
- Kho word/minimal pair/sentence cho tung sound group.
- It nhat 1 user co san diem leaderboard de bang xep hang khong trong.
- It nhat 5-10 badges seed san.

User demo goi y:

```text
student1@example.com
student2@example.com
admin@example.com
```

## 4. Tinh nang bat buoc on dinh truoc bao ve

Bat buoc:

- Login/register.
- Learning map doc data that.
- Exercise detail doc questions that.
- Submit attempt thanh cong.
- XP/Ranking Score cap nhat dung.
- Check-in chong trung trong ngay.
- Leaderboard co data.
- Badge page co data.

Nen co:

- Admin quan ly data co ban.
- FastAPI `/health`.
- UI mobile co the xem duoc.

Co the noi la huong phat trien:

- Diagnostic Test dau vao.
- Random question pool nang cao.
- Whisper/audio scoring nang cao.
- Mouth diagram/mirror mode.
- Bang xep hang theo tung loai bai.

## 5. Rủi ro demo va cach xu ly

### Web Speech API khong hoat dong

Nguyen nhan:

- Browser khong ho tro.
- Mic bi khoa.
- May khong co internet/permission.

Xu ly:

- Demo tren Chrome/Edge.
- Kiem tra mic truoc.
- UI co fallback thong bao loi.
- Co the co nut "bo qua/submit transcript demo" chi cho demo neu can, nhung khong nen de mac dinh.

### Audio ngoai khong phat

Nguyen nhan:

- API/audio URL die.
- Mang yeu.

Xu ly:

- Cac bai demo quan trong nen co local audio fallback.

### Leaderboard trong

Nguyen nhan:

- Chua co user data.

Xu ly:

- Seed san 3-5 user leaderboard.

### Badge khong cap

Nguyen nhan:

- Dieu kien qua kho.

Xu ly:

- Seed badge MVP va co 1 dieu kien de dat trong demo, vi du dat >=90 o bai noi hoac check-in 3 ngay voi data seed.

## 6. Ban demo chi tiet se cap nhat sau

Sau khi code gan xong, cap nhat file nay thanh script demo chi tiet:

```text
1. Mo URL
2. Dang nhap user demo
3. Vao Learning Map
4. Chon bai /i:/ vs /ɪ/
5. Lam 3 cau nghe
6. Lam 1 cau noi
7. Submit
8. Xem ket qua +XP/+Ranking
9. Check-in
10. Xem badge
11. Xem leaderboard
12. Neu can, vao admin xem data
```

