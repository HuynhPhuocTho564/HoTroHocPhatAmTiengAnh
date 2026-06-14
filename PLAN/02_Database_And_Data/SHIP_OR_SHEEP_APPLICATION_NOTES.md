# Ghi chu ap dung Ship or Sheep vao du an

Ngay doc/tom tat: 14/06/2026

Nguon tham khao cuc bo: `D:\01_Company_Work\Projects\KHOA_LUAN\Ship_or_Sheep_Book.pdf`

Luu y ban quyen: khong copy nguyen van bai tap/audio/noi dung hoi thoai cua sach vao du an. Chi dung sach de tham khao phuong phap su pham, cau truc bai hoc va cach thiet ke dang luyen tap.

## 1. Diem cot loi cua sach co the ap dung

Sachs co cau truc rat phu hop voi ung dung luyen phat am:

- Chia noi dung theo IPA: Section A la vowels, Section B la consonants.
- Moi unit tap trung vao mot target sound.
- Nhieu unit dung minimal pairs de luyen nghe va phan biet 2 am de nham.
- Thu tu bai tap di tu de den kho:
  - nghe target sound;
  - nghe/chon minimal pair;
  - lap lai tu;
  - nghe/chon cau;
  - doc dialogue/cau;
  - hoc them stress, rhythm, intonation, spelling.
- Co review unit dinh ky de on lai nhom am.

## 2. Diem nen ap dung vao Web_HoTroPhatAmEN

### A. Chuan hoa 4 buoc bai hoc theo sach

Nen chot moi bai/nhom am co 4 dang:

1. `listen_choose`: nghe audio, chon tu/IPA dung.
2. `speak_word`: nhin tu + IPA, doc tu.
3. `speak_minimal_pair`: doc 2 tu minimal pair lien tiep.
4. `speak_sentence`: doc cau ngan co target sound.

Day khop voi file `KH_DATA_BAI_TAP_IPA.md` va nen dua vao seed data.

### B. Them review unit sau moi nhom am

Sachs co review unit sau mot so cum bai. App nen co review node tren learning map:

- Review nguyen am don.
- Review nguyen am doi.
- Review phu am vo thanh/huu thanh.
- Review phu am kho voi nguoi Viet.

Ap dung:

- `Exercise.status = ACTIVE`
- `Exercise.name` co tien to `Review - ...`
- `QuestionType` tron nhieu dang: listen_choose, speak_word, speak_sentence.
- Gamification: review cho XP cao hon bai thuong.

### C. Dua stress, rhythm, intonation vao phase sau

Sachs khong chi day tung am; no gan target sound voi:

- sentence stress;
- word stress;
- intonation trong cau hoi;
- rhythm strong/weak;
- spelling pattern.

Nen ap dung sau khi MVP am vi da on:

- Them `QuestionType`: `stress_pattern`, `intonation_choice`, `rhythm_repeat`, `spelling_pattern`.
- Them UI nho de hien stress: bold syllable hoac mark primary stress.
- Luu diem vao `QuestionAttempt.accuracyScore`, `fluencyScore`, `feedback`.

### D. Dung "mask/listen first" bang UI

Sach co y tuong che chu de nguoi hoc nghe am truoc, tranh bi mat chu viet anh huong.

Co the chuyen thanh UI:

- Lan nghe dau: chi hien 2 card A/B hoac hinh/IPA, chua hien spelling day du.
- Sau khi user chon xong: reveal tu, IPA, giai thich ngan.
- Neu lam sai: cho nghe lai minimal pair va highlight am khac nhau.

Day rat phu hop voi `listen_choose`.

### E. Tao seed data theo cap am, khong theo 1 am don le

Nen uu tien cap de nham voi nguoi Viet:

- `/i:/` vs `/ɪ/`
- `/e/` vs `/æ/`
- `/ʊ/` vs `/u:/`
- `/ɒ/` vs `/ɔ:/`
- `/ʌ/` vs `/ɑ:/` vs `/ə/`
- `/s/` vs `/z/`
- `/ʃ/` vs `/tʃ/`
- `/θ/` vs `/ð/`
- `/f/` vs `/v/`
- `/p/` vs `/b/`

Moi cap nen co:

- 6-10 minimal pairs.
- 4-6 cau ngan.
- 1 mini review.

Khong copy truc tiep danh sach bai tu sach; co the tu tao word list tu Cambridge/Free Dictionary/API nguon mo.

## 3. Phan nen de sau, chua can lam ngay

- Bang `Phoneme`: hop ly ve dai han, nhung user da quyet dinh lam sau.
- Whisper/audio scoring nang cao: chua nen dua vao MVP vi code hien tai dang dung Web Speech API.
- Dialogue dai: sach co dialogue hay nhung app nen chi dung cau ngan trong MVP; dialogue co the lam Phase UI/Content sau.
- Mouth diagram/mirror mode: tot cho HCI nhung can asset/hinh minh hoa, de Phase 6.

## 4. De xuat cap nhat roadmap hien tai

Them vao Phase 2:

- API submit can ho tro payload cho 4 dang bai: listen_choose, speak_word, speak_minimal_pair, speak_sentence.
- Scoring tach rieng cho nghe/chon va noi/transcript.

Them vao Phase 3:

- XP theo muc do kho:
  - listen_choose: thap;
  - speak_word: trung binh;
  - speak_minimal_pair: cao;
  - speak_sentence: cao nhat.
- Badge cho hoan thanh tung nhom am va review.

Them vao Phase 7:

- Admin CRUD nen co truong/bo loc theo `QuestionType`.
- Admin nen quan ly duoc word pair, IPA text, audio URL, sentence prompt.

Them vao Phase 8:

- Test seed data: moi exercise phai co du question/options/audio URL neu la listen_choose.
- Test unlock: dang 3 chi mo sau dang 2 dat nguong diem.

## 5. Ket luan uu tien

Nen ap dung ngay 4 diem:

1. 4-step exercise flow: listen -> speak word -> minimal pair -> sentence.
2. Review unit sau moi nhom am.
3. UI listen-first/reveal-after-answer.
4. Seed data theo minimal pairs cho cac cap am nguoi Viet de nham.

## 6. Quyet dinh de sau, chua tinh vao roadmap hien tai

- Khong them Diagnostic Test dau vao trong giai doan hien tai.
- Khong tao luong nghe Same/Different rieng cho bai test dau vao.
- Khong dung ket qua test dau vao de tu dong goi y lo trinh luc nay.
