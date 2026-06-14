# Data Seed Plan - Question Bank trong Database

Ngay chot: 14/06/2026

## 1. Quyet dinh

Chon Cach B: tao kho du lieu trong database thay vi chi dung file seed tinh.

Ly do:

- Admin sau nay co the quan ly tu, cap tu, audio, IPA va cau hoi.
- Moi bai hoc co the rut cau hoi tu kho theo loai bai.
- Du lieu mo rong tot hon khi them nhom am moi.
- Phu hop voi he thong cham diem, leaderboard, badge va review unit.

Luu y: neu lam Cach B, nen dua bang `Phoneme` vao som hon ke hoach cu. Khong can lam qua lon, chi can ban toi thieu de lien ket am IPA voi tu/cap tu/cau hoi.

## 1.1. Yeu cau ap dung thuc te cho khoa luan

Vi day la do an khoa luan, he thong du lieu nen thiet ke theo huong co the dung thuc te, khong chi de demo.

Skill can doc truoc khi sua phan nay:

- `english_pronunciation_app/.agents/skills/question-bank-curator/SKILL.md`
- `english_pronunciation_app/.agents/skills/ipa-pronunciation-pedagogy/SKILL.md`
- `english_pronunciation_app/.agents/skills/postgresql_expert/SKILL.md` neu sua schema.

Tieu chi thuc te:

- Du lieu co nguon ro rang: moi audio/IPA nen co `audioSource`, `sourceUrl` hoac ghi chu bien soan thu cong.
- Khong phu thuoc hoan toan vao API ben ngoai khi demo/van hanh.
- Co audio fallback local cho cac bai quan trong.
- Co trang thai du lieu: `DRAFT`, `NEEDS_REVIEW`, `ACTIVE`, `ARCHIVED`.
- Khong dua item chua duyet vao bai hoc that.
- Co kha nang admin chinh sua IPA, audio, cau hoi va status.
- Co the mo rong sang nhom am moi ma khong phai sua lai logic bai hoc.
- Co quy trinh kiem duyet noi dung truoc khi seed/active.

Quy trinh du lieu de xuat:

```text
Bien soan word list/cau ngan
-> Lay/doi chieu IPA va audio tu nguon hop le
-> Luu vao kho voi status NEEDS_REVIEW
-> Kiem tra thu cong IPA/audio
-> Chuyen sang ACTIVE
-> Tao QuestionBankItem
-> Generate Question cho Exercise
```

Trong bao cao khoa luan co the trinh bay day la pipeline du lieu cua he thong.

## 2. MVP nghia la gi?

MVP = Minimum Viable Product.

Trong du an nay, MVP co nghia la "ban toi thieu du dung de demo/bao ve va chung minh luong chinh hoat dong".

MVP khong co nghia la lam so sai hoac lam tam bo. No co nghia la:

- Lam it tinh nang hon.
- Nhung nhung tinh nang da chon phai chay on dinh.
- Du lieu it nhung sach va co cau truc.
- Luong demo ro: hoc bai -> nop bai -> tinh diem -> nhan XP/diem hang -> badge/leaderboard.

## 3. Nguon IPA/audio

Khong nen scrape/download truc tiep audio tu Cambridge/Oxford website neu chua co quyen.

### Nen dung

- Tu/cau tu tao boi du an.
- IPA tu nguon mo hoac tu minh kiem tra thu cong.
- Free Dictionary API cho prototype/seed ban dau neu co audio/IPA phu hop.
- Tu ghi am audio mau bang giong doc cua chinh minh/nhom neu can demo on dinh.
- Merriam-Webster API neu du an phi thuong mai va dap ung gioi han/chinh sach.
- Local audio do du an tu tao cho cac tu/cau quan trong.

### Co the dung Cambridge/Oxford nhu the nao?

- Dung de doi chieu thu cong IPA/audio khi bien soan du lieu.
- Khong copy hang loat, khong tai audio hang loat, khong luu audio Cambridge/Oxford vao public app neu chua co license.
- Neu muon dung chinh thuc, di theo API/licensing cua Cambridge/Oxford.

Quyet dinh cho du an hien tai:

- Cambridge/Oxford: chi la nguon doi chieu thu cong.
- Seed data chinh: tu/cau tu tao + Free Dictionary API/nguon mo neu hop le.
- Audio quan trong cho demo: nen co fallback local hoac tu ghi am de tranh API/audio ngoai bi loi.
- Neu audio lay tu API ben ngoai, nen cache metadata va co co che thay the bang local audio khi can.
- Khi can doi chieu nguon, xem them `english_pronunciation_app/.agents/skills/question-bank-curator/references/sources.md`.

## 4. Mo hinh kho du lieu de xuat

### A. `Phoneme`

Luu am IPA.

Truong goi y:

- `id`
- `symbol`: `/i:/`, `/ɪ/`, `/e/`, `/æ/`
- `name`: ten ngan
- `category`: `VOWEL`, `DIPHTHONG`, `CONSONANT`
- `description`
- `mouthHint`
- `commonMistake`

### B. `SoundGroup`

Luu nhom/cap am de hoc cung nhau.

Vi du:

- `/i:/` vs `/ɪ/`
- `/e/` vs `/æ/`
- `/ʊ/` vs `/u:/`

Truong goi y:

- `id`
- `name`
- `description`
- `levelId`
- `topicId`
- `order`

Quan he:

- 1 sound group co nhieu phoneme.

### C. `WordItem`

Luu tu vung co IPA/audio.

Truong goi y:

- `id`
- `word`
- `ipa`
- `phonemeId`
- `audioUrl`
- `audioSource`: `LOCAL`, `FREE_DICTIONARY`, `MANUAL`, `LICENSED`
- `sourceUrl`
- `meaningVi`
- `difficulty`: `EASY`, `MEDIUM`, `HARD`
- `status`: `ACTIVE`, `DRAFT`, `NEEDS_REVIEW`
- `reviewNote`
- `createdBy`
- `reviewedAt`

### D. `MinimalPair`

Luu cap tu de nham.

Truong goi y:

- `id`
- `soundGroupId`
- `wordAId`
- `wordBId`
- `note`
- `difficulty`
- `status`

### E. `SentenceItem`

Luu cau ngan dung cho `speak_sentence`.

Truong goi y:

- `id`
- `soundGroupId`
- `text`
- `targetWords`
- `difficulty`
- `status`
- `sourceType`: `MANUAL`, `OPEN_SOURCE`, `LICENSED`
- `reviewNote`

### F. `QuestionBankItem`

Luu cau hoi mau de rut ra tao bai.

Truong goi y:

- `id`
- `questionTypeId`
- `soundGroupId`
- `minimalPairId`
- `wordItemId`
- `sentenceItemId`
- `prompt`
- `contentJson`
- `answer`
- `score`
- `difficulty`
- `status`
- `sourceType`
- `reviewNote`

## 5. Cach tao bai hoc tu kho du lieu

Moi `SoundGroup` se sinh 4 dang bai:

1. `listen_choose`
2. `speak_word`
3. `speak_minimal_pair`
4. `speak_sentence`

Vi du voi `/i:/` vs `/ɪ/`:

- Kho co 10 minimal pairs.
- Kho co 20 word items.
- Kho co 6 sentence items.
- Khi tao exercise, lay cau hoi tu `QuestionBankItem`.

## 6. Co nen random khong?

Co, nhung khong nen random hoan toan ngay.

Giai doan dau:

- Moi exercise nen co bo cau hoi co dinh de demo va leaderboard cong bang.
- Question bank van ton tai trong DB, nhung seed exercise lay mot tap cau hoi on dinh.

Sau khi he thong on:

- Moi lan lam bai co the rut ngau nhien co kiem soat.
- Can luu danh sach question da dung trong attempt de cham diem va xem lai.

## 7. Random co kiem soat

Neu random, phai co quy tac:

- Can bang 2 am trong cap, khong de lech qua mot am.
- Khong chon cau `DRAFT` hoac `NEEDS_REVIEW`.
- Uu tien cau phu hop difficulty cua bai.
- Khong lay audio rong cho `listen_choose`.
- Moi attempt phai luu questionId cu the.

Vi du:

```text
listen_choose:
- lay 5 cau
- 2-3 cau target /ɪ/
- 2-3 cau target /i:/
- tat ca phai co audioUrl
```

## 8. Cac truong hop co the xay ra

### Truong hop 1: Audio API khong co audio

Xu ly:

- Danh dau `WordItem.status = NEEDS_REVIEW`.
- Khong dua vao `listen_choose`.
- Van co the dung cho `speak_word` neu IPA/word dung.

### Truong hop 2: IPA tra ve khong dung voi muc tieu bai

Vi du word can `/ɪ/` nhung API tra IPA khac hoac bien the khac.

Xu ly:

- Khong auto active.
- Admin/manual review truoc khi dua vao bai.

### Truong hop 3: Random lam de kho khong deu

Xu ly:

- Moi item co `difficulty`.
- Bai de chi lay `EASY/MEDIUM`.
- Bai review co the lay tron.

### Truong hop 4: User lam lai gap bo cau khac, diem kho so sanh

Xu ly MVP:

- Ban dau dung bo cau co dinh.

Xu ly sau MVP:

- Luu question set cua tung attempt.
- Best score van tinh theo exercise, nhung UI ghi ro cau hoi co the thay doi.

### Truong hop 5: Leaderboard bi anh huong do cau hoi khac nhau

Xu ly MVP:

- Leaderboard chinh dung bo cau co dinh.

Xu ly sau MVP:

- Ranking score co normalization theo difficulty/max score.

### Truong hop 6: Kho du lieu bi phinh to nhung khong kiem soat

Xu ly:

- Bat buoc co `status`.
- Admin chi hien item `ACTIVE`.
- Seed script khong auto active neu thieu audio/IPA/source.

## 9. Du lieu nen seed dau tien

Nen seed 3 sound groups dau tien:

### Group 1: `/i:/` vs `/ɪ/`

Minimal pairs goi y tu tao/doi chieu:

- ship / sheep
- bit / beat
- fit / feet
- hit / heat
- sit / seat
- live / leave
- fill / feel
- hill / heel

### Group 2: `/e/` vs `/æ/`

- bed / bad
- pen / pan
- men / man
- said / sad
- head / had
- bet / bat
- lend / land
- left / laughed

### Group 3: `/ʊ/` vs `/u:/`

- full / fool
- pull / pool
- look / Luke
- could / cooed
- hood / who'd
- foot / food

Ghi chu:

- Danh sach tren la word list tu bien soan, can doi chieu IPA/audio truoc khi active.
- Khong copy truc tiep bai tap/audio/cau tu sach.

## 10. So luong seed de demo

Moi sound group:

- 8-10 `MinimalPair`
- 16-20 `WordItem`
- 6 `SentenceItem`
- 5 `listen_choose` questions
- 5 `speak_word` questions
- 3-5 `speak_minimal_pair` questions
- 3 `speak_sentence` questions

Tong cho 3 sound groups:

- Khoang 24-30 minimal pairs.
- Khoang 48-60 word items.
- Khoang 18 sentence items.
- Khoang 48-54 question bank items.

## 11. Tac dong den schema hien tai

Can them model moi neu lam dung Cach B:

- `Phoneme`
- `SoundGroup`
- `SoundGroupPhoneme` neu quan he n-n
- `WordItem`
- `MinimalPair`
- `SentenceItem`
- `QuestionBankItem`

`Question` hien tai van dung cho bai tap that. `QuestionBankItem` la kho nguon; khi seed/generate exercise se tao `Question` tu kho.

Trang thai 14/06/2026:

- Da them cac model tren vao `english_pronunciation_app/frontend/prisma/schema.prisma`.
- Da sync PostgreSQL local bang `npx.cmd prisma db push`.
- Chua seed du lieu IPA/question bank moi; viec seed 3 sound groups dau tien se lam sau khi chot script seed.

## 12. Tac dong den admin

Phase 7 admin nen co:

- Quan ly phoneme.
- Quan ly sound group.
- Quan ly word item.
- Quan ly minimal pair.
- Quan ly sentence item.
- Duyet item `NEEDS_REVIEW`.

Nhung trong giai doan dau, co the seed bang script truoc, admin CRUD lam sau.

## 13. Ket luan

Nen lam Cach B, nhung theo lo trinh:

1. Them schema kho du lieu toi thieu.
2. Seed 3 sound groups dau tien.
3. Dung bo cau co dinh de demo/leaderboard cong bang.
4. Sau khi on dinh moi bat random co kiem soat.
5. Cambridge/Oxford chi dung doi chieu thu cong neu chua co license/API chinh thuc.
6. Co pipeline duyet du lieu truoc khi dua item vao `ACTIVE`.
7. Co audio fallback local cho cac bai hoc quan trong de phu hop yeu cau ap dung thuc te.
