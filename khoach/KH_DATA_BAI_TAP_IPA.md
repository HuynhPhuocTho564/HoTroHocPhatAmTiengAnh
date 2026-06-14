# Kế hoạch Thiết kế Bài tập IPA và Nguồn Dữ liệu

Tài liệu này quy định cách thức lấy dữ liệu, cấu trúc bài tập, và tư duy thiết kế lộ trình học cho các âm IPA (đặc biệt là Nguyên âm đơn).

---

## 1. Nguồn dữ liệu IPA đáng tin cậy

### Danh sách âm vị (làm nền tảng)
*   **Cambridge Dictionary** (dictionary.cambridge.org) — tra từng từ, có phiên âm IPA British + American, có audio MP3 công khai.
*   **Forvo** (forvo.com) — audio phát âm bởi người bản ngữ, miễn phí cho mục đích phi thương mại/học thuật.
*   **Oxford Learner's Dictionary** — tương tự Cambridge, có IPA + audio.

### Bộ từ mẫu theo âm vị
Cần ~5–10 từ ví dụ cho mỗi âm vị. Nguồn tốt nhất:
*   **Wikipedia – IPA for English** (en.wikipedia.org/wiki/IPA_consonant_chart_for_English): Bảng chuẩn, có ví dụ từ.
*   **Phonemic Chart (British Council)** (teachingenglish.org.uk/resources/phonemic-chart): Interactive, có audio.
*   **Rachel's English** (rachelsenglish.com): Video giải thích khẩu hình từng âm.
*   **Sound Comparisons** (soundcomparisons.com): So sánh phát âm giữa các giọng.

### Audio mẫu IPA (Tệp Âm Thanh)
*   **Cambridge Dictionary API**: không có API công khai nhưng audio URL có pattern dự đoán được: `https://dictionary.cambridge.org/media/english/us_pron/[word].mp3`
*   **Merriam-Webster API**: có API miễn phí (cần đăng ký), trả về audio + phiên âm.
*   **Free Dictionary API** (api.dictionaryapi.dev): hoàn toàn miễn phí, trả về IPA + audio URL từ Wikimedia.
    *   *Ví dụ GET:* `https://api.dictionaryapi.dev/api/v2/entries/en/ship`
    *   `phonetics[].audio` (URL mp3 từ Wikimedia)
    *   `phonetics[].text` (IPA string)

---

## 2. Phân tích cách chia nhóm bài học (Learning Maps)

**Không nên làm: 1 âm = 1 bài**
*   12 nguyên âm đơn → 12 bài riêng lẻ → học viên thấy quá manh mún.
*   Mỗi bài chỉ có ~5 từ thì quá ngắn, không có cảm giác "hoàn thành".
*   Khó tạo bài tập phân biệt vì chỉ có 1 âm, không có gì để so sánh.

**Nên làm: Nhóm theo đặc điểm âm học**
*   *Nguyên tắc nhóm:* Các âm dễ nhầm lẫn với nhau thì học cùng nhau — vừa hiệu quả sư phạm, vừa tạo được bài tập phân biệt (Luyện Tai, Thử Thách Kép).

### Gợi ý cụ thể cho 12 nguyên âm đơn (6 Bài học/Maps)

| Bài | Cặp Âm | Lý do nhóm |
| :--- | :--- | :--- |
| **Bài 1** | `/iː/ — /ɪ/` | Cặp dài/ngắn kinh điển nhất, *ship/sheep* là minimal pair số 1. (Người Việt hay đọc *sheep* thành *ship*). |
| **Bài 2** | `/e/ — /æ/` | Cùng vùng miệng phía trước, người Việt hay nhầm *bed/bad*. Nhóm lại để ý thức sự khác biệt hàm dưới hạ xuống. |
| **Bài 3** | `/ɑː/ — /ʌ/ — /ə/` | 3 âm trung tâm. `/ə/` (schwa) xuất hiện 30% nhưng hay bị bỏ qua. Phân biệt *father/fun/about*. |
| **Bài 4** | `/ɒ/ — /ɔː/` | Cặp ngắn/dài, cùng vùng miệng phía sau, *hot/horse*, *dot/door*. Người Việt hay kéo dài `/ɒ/` thành `/ɔː/`. |
| **Bài 5** | `/ʊ/ — /uː/` | Cặp ngắn/dài phía sau, *look/Luke*, *full/fool* — dễ demo bằng Web Speech API. |
| **Bài 6** | `/ɜː/` | Âm đặc trưng khó nhất, *bird/word/heard* — để riêng vì người Việt rất hay sai (đọc thành "bơd"). |

*(Tổng cộng 6 bài cho nhóm Nguyên âm đơn — vừa đủ khối lượng, không bị ngợp).*

---

## 3. Thiết kế 4 dạng bài tập (Exercises) cho mỗi chủ đề

Ánh xạ vào giao diện hệ thống:

1.  **Bài 1 - Luyện Tai** `(LOAI_CAU_HOI: "listen_choose")`
    *   *Câu hỏi:* Phát audio → chọn IPA đúng (trắc nghiệm).
    *   *Dữ liệu cần:* Audio + 4 phương án IPA/Từ.
2.  **Bài 2 - Luyện Miệng** `(LOAI_CAU_HOI: "speak_word")`
    *   *Câu hỏi:* Hiển thị từ → học viên đọc → Web Speech API so khớp.
    *   *Dữ liệu cần:* Từ + đáp án string (ví dụ "ship").
3.  **Bài 3 - Thử Thách Kép** `(LOAI_CAU_HOI: "speak_minimal_pair")`
    *   *Câu hỏi:* Đọc liên tiếp 2 từ minimal pair.
    *   *Dữ liệu cần:* Cặp từ + audio riêng từng từ.
    *   *Điều kiện mở khóa:* Bài 2 đạt ≥ 80%.
4.  **Bài 4 - Thực Chiến** `(LOAI_CAU_HOI: "speak_sentence")`
    *   *Câu hỏi:* Đọc câu hoàn chỉnh chứa âm mục tiêu.
    *   *Dữ liệu cần:* Câu + đáp án string.
    *   *Điều kiện mở khóa:* Bài 3 hoàn thành.

---

## 4. Ánh xạ vào ERD (Prisma Schema)

*   **CHUDE (Topic):** "Nguyên âm đơn" (MaCD = 1)
*   **CAPDO (Level):** "Dễ"
*   **BAITAP (LearningMap/Exercise):**
    *   `MaBT=1`, `TenBai="Âm /iː/ và /ɪ/ — Dài & Ngắn"`, `MaCD=1`
    *   `MaBT=2`, `TenBai="Âm /e/ và /æ/ — Mở Hẹp & Mở Rộng"`, `MaCD=1`
    *   `MaBT=3`, `TenBai="Âm /ɑː/ /ʌ/ /ə/ — Nhóm Trung Tâm"`, `MaCD=1`
    *   `MaBT=4`, `TenBai="Âm /ɒ/ và /ɔː/ — Tròn Ngắn & Tròn Dài"`, `MaCD=1`
    *   `MaBT=5`, `TenBai="Âm /ʊ/ và /uː/ — Sau Ngắn & Sau Dài"`, `MaCD=1`
    *   `MaBT=6`, `TenBai="Âm /ɜː/ — Âm Giữa Đặc Biệt"`, `MaCD=1`

Mỗi Learning Map này sẽ có 4 Exercises con (Luyện Tai / Luyện Miệng / Thử Thách Kép / Thực Chiến) chứa các Câu hỏi tương ứng.

---

## 5. Workflow thực tế để nạp Data

1.  **Bước 1:** Lấy danh sách từ cho từng âm vị (dùng Wikipedia / Cambridge làm nguồn).
2.  **Bước 2:** Gọi Free Dictionary API để lấy audio URL tự động:
    ```typescript
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    const audioUrl = data[0].phonetics.find(p => p.audio)?.audio;
    const ipa = data[0].phonetics.find(p => p.text)?.text;
    ```
3.  **Bước 3:** Chạy script seed (`seed.ts`) một lần để insert vào PostgreSQL (`npx prisma db seed`).
4.  **Bước 4:** Xây dựng Admin UI để chỉnh sửa/bổ sung sau này.
