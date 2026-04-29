# Content Update Workflow

Tài liệu này giải thích quy trình cập nhật nội dung an toàn cho ứng dụng TOEIC.

Ứng dụng hiện có pipeline cập nhật nội dung theo các bước:

```text
CSV template
-> generated JSON
-> merged JSON
-> promote to real JSON
-> build test
-> only then commit/push/deploy
```

Ý tưởng chính: không ghi đè trực tiếp vào file dữ liệu thật của app. Luôn tạo file trung gian, kiểm tra kỹ, rồi mới promote khi chắc chắn dữ liệu đúng.

## 1. Vocabulary Workflow

Các file liên quan:

- `templates/vocabulary-template.csv`
- `data/generated-words.json`
- `data/merged-words.json`
- `data/words.json`
- `data/backup-words.json`

Chạy các lệnh theo thứ tự:

```bash
node scripts/import-vocabulary.js
node scripts/merge-vocabulary.js
node scripts/promote-vocabulary.js --confirm
npm run build
```

Giải thích:

- `import-vocabulary.js` đọc CSV và tạo `data/generated-words.json`.
- `merge-vocabulary.js` tạo `data/merged-words.json`.
- Bước merge không sửa `data/words.json`.
- `promote-vocabulary.js --confirm` mới ghi đè dữ liệu thật trong `data/words.json`.
- Trước khi ghi đè, script tạo backup tại `data/backup-words.json`.

## 2. Questions Workflow

Các file liên quan:

- `templates/questions-template.csv`
- `data/generated-questions.json`
- `data/merged-questions.json`
- `data/questions.json`
- `data/backup-questions.json`

Chạy các lệnh theo thứ tự:

```bash
node scripts/import-questions.js
node scripts/merge-questions.js
node scripts/promote-questions.js --confirm
npm run build
```

Giải thích:

- `import-questions.js` đọc CSV và tạo `data/generated-questions.json`.
- `merge-questions.js` tạo `data/merged-questions.json`.
- Bước merge không sửa `data/questions.json`.
- `promote-questions.js --confirm` mới ghi đè dữ liệu thật trong `data/questions.json`.
- Trước khi ghi đè, script tạo backup tại `data/backup-questions.json`.

## 3. Grammar Workflow

Các file liên quan:

- `templates/grammar-template.csv`
- `data/generated-grammar.json`
- `data/merged-grammar.json`
- `data/grammar.json`
- `data/backup-grammar.json`

Chạy các lệnh theo thứ tự:

```bash
node scripts/import-grammar.js
node scripts/merge-grammar.js
node scripts/promote-grammar.js --confirm
npm run build
```

Giải thích:

- `import-grammar.js` đọc CSV và tạo `data/generated-grammar.json`.
- `merge-grammar.js` tạo `data/merged-grammar.json`.
- Bước merge không sửa `data/grammar.json`.
- `promote-grammar.js --confirm` mới ghi đè dữ liệu thật trong `data/grammar.json`.
- Trước khi ghi đè, script tạo backup tại `data/backup-grammar.json`.

## 4. Full Import Test

Lệnh này chạy tất cả script import và tạo các file generated JSON:

```bash
node scripts/import-all.js
```

Lưu ý: `import-all.js` chỉ tạo dữ liệu generated. Lệnh này không promote dữ liệu vào các file JSON thật của app như `data/words.json`, `data/questions.json`, hoặc `data/grammar.json`.

## 5. Safety Checklist Before Promote

Trước khi chạy promote, hãy kiểm tra theo checklist này:

- Check the CSV file carefully.
- Run the import script.
- Open generated JSON and inspect it.
- Run the merge script.
- Open merged JSON and inspect it.
- Only run promote with --confirm if the merged data is correct.
- Run npm run build after promote.
- Open the app locally and check the affected page.
- Only commit/push after local testing is successful.

## 6. Do Not Deploy Too Early

Không nên chạy `git push` ngay sau khi sửa nội dung.

Lý do:

- Vercel thường tự động deploy sau khi `git push`.
- Nếu dữ liệu sai nhưng đã push, lỗi có thể lên production.
- Luôn test local trước.
- Chỉ push khi `npm run build` chạy thành công và app đã được kiểm tra trên máy local.

## 7. Current Content Counts

Nội dung hiện tại của app sau các cập nhật local mới nhất:

- 53 vocabulary words
- 23 practice questions
- 11 grammar lessons

## 8. Future Improvements

Một số cải tiến có thể làm sau:

- Tạo import và merge scripts hỗ trợ CSV lớn hơn.
- Thêm CSV parsing tốt hơn để xử lý dấu phẩy nằm trong ngoặc kép.
- Thêm admin page.
- Chuyển content vào database.
- Cho phép import content từ admin dashboard.
