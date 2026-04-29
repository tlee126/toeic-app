# CSV Import Scripts

## 1. Purpose

Các script import CSV dùng để chuyển các file CSV mẫu thành các file JSON được sinh ra để kiểm tra dữ liệu. Mục đích hiện tại là giúp nhập thử dữ liệu từ template, xem kết quả import, và phát hiện lỗi định dạng trước khi đưa dữ liệu vào app thật.

Các script hiện có:

- `scripts/import-vocabulary.js`: chuyển dữ liệu từ template từ vựng sang JSON.
- `scripts/import-questions.js`: chuyển dữ liệu từ template câu hỏi luyện tập sang JSON.
- `scripts/import-grammar.js`: chuyển dữ liệu từ template bài học ngữ pháp sang JSON.
- `scripts/import-all.js`: chạy toàn bộ các script import theo đúng thứ tự.

## 2. Input Files

Các file CSV đầu vào:

- `templates/vocabulary-template.csv`
- `templates/questions-template.csv`
- `templates/grammar-template.csv`

## 3. Output Files

Các file JSON đầu ra:

- `data/generated-words.json`
- `data/generated-questions.json`
- `data/generated-grammar.json`

Đây là các file test được sinh tự động từ CSV. Chúng chưa thay thế các file dữ liệu thật của app.

## 4. Commands

Chạy import từ vựng:

```bash
node scripts/import-vocabulary.js
```

Chạy import câu hỏi luyện tập:

```bash
node scripts/import-questions.js
```

Chạy import bài học ngữ pháp:

```bash
node scripts/import-grammar.js
```

Chạy toàn bộ import:

```bash
node scripts/import-all.js
```

`scripts/import-all.js` sẽ chạy lần lượt:

1. `scripts/import-vocabulary.js`
2. `scripts/import-questions.js`
3. `scripts/import-grammar.js`

Nếu một script bị lỗi, quá trình import sẽ dừng ngay.

## 5. Safety Notes

- Các script không ghi đè `data/words.json`, `data/questions.json`, hoặc `data/grammar.json`.
- App hiện tại vẫn đọc các file JSON thật trong thư mục `data/`.
- Các file `generated-*.json` chỉ dùng để kiểm tra kết quả import trước.
- Sau này có thể thêm một bước "promote" rõ ràng để copy dữ liệu đã kiểm tra từ file generated sang file dữ liệu thật của app.

## 6. Validation Rules

Các script có kiểm tra dữ liệu trước khi ghi file JSON. Nếu dữ liệu không hợp lệ, script sẽ in lỗi rõ ràng và dừng lại.

Một số quy tắc kiểm tra chính:

- `id` phải là số.
- Các trường bắt buộc như `level`, `toeicTarget`, `difficulty`, `options`, `answer`, `rules`, và `examples` phải hợp lệ theo từng loại dữ liệu.
- Với câu hỏi luyện tập, `answer` phải khớp chính xác với một trong bốn đáp án.
- Với bài học ngữ pháp, `rules` phải có ít nhất một rule và ví dụ đầu tiên phải có cả tiếng Anh lẫn tiếng Việt.
