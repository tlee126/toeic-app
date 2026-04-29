# CSV Import Templates

Tài liệu này giải thích mục đích và cấu trúc của các file CSV mẫu dùng để chuẩn bị dữ liệu cho ứng dụng TOEIC:

- `templates/vocabulary-template.csv`
- `templates/questions-template.csv`
- `templates/grammar-template.csv`

Các template này giúp nhập dữ liệu bằng spreadsheet app như Excel hoặc Google Sheets trước khi chuyển sang JSON hoặc database trong tương lai.

## 1. Vocabulary Template

File `templates/vocabulary-template.csv` dùng để chuẩn bị dữ liệu từ vựng TOEIC.

| Column | Ý nghĩa |
| --- | --- |
| id | Mã định danh duy nhất của từ vựng. |
| word | Từ tiếng Anh cần học. |
| pronunciation | Phiên âm hoặc cách đọc của từ. |
| meaning | Nghĩa tiếng Việt của từ. |
| example | Câu ví dụ tiếng Anh. |
| exampleMeaning | Nghĩa tiếng Việt của câu ví dụ. |
| topic | Chủ đề của từ vựng như Office, Business, Travel. |
| level | Cấp độ học như beginner, intermediate, advanced. |
| toeicTarget | Mốc điểm TOEIC mục tiêu, gồm 450, 650 hoặc 750. |
| difficulty | Độ khó dạng số: 1 dễ, 2 trung bình, 3 khó. |
| tags | Danh sách nhãn phân loại, dùng dấu chấm phẩy để tách nhiều giá trị. |
| partOfSpeech | Từ loại như noun, verb, adjective hoặc adverb. |

## 2. Questions Template

File `templates/questions-template.csv` dùng để chuẩn bị dữ liệu câu hỏi luyện tập TOEIC.

| Column | Ý nghĩa |
| --- | --- |
| id | Mã định danh duy nhất của câu hỏi. |
| part | Phần thi TOEIC, ví dụ Part 5. |
| question | Nội dung câu hỏi hoặc câu cần điền đáp án. |
| optionA | Lựa chọn A. |
| optionB | Lựa chọn B. |
| optionC | Lựa chọn C. |
| optionD | Lựa chọn D. |
| answer | Đáp án đúng, phải khớp chính xác với một trong bốn lựa chọn. |
| explanation | Giải thích vì sao đáp án đúng. |
| grammarPoint | Điểm ngữ pháp được kiểm tra. |
| difficulty | Độ khó dạng số: 1 dễ, 2 trung bình, 3 khó. |
| toeicTarget | Mốc điểm TOEIC mục tiêu, gồm 450, 650 hoặc 750. |
| topic | Chủ đề của câu hỏi như Office, Business, Travel. |

## 3. Grammar Template

File `templates/grammar-template.csv` dùng để chuẩn bị dữ liệu bài học ngữ pháp TOEIC.

| Column | Ý nghĩa |
| --- | --- |
| id | Mã định danh duy nhất của bài học ngữ pháp. |
| title | Tiêu đề tiếng Anh của bài học. |
| titleVi | Tiêu đề tiếng Việt của bài học. |
| level | Cấp độ bài học, ví dụ Basic hoặc Intermediate. |
| toeicPart | Phần thi TOEIC liên quan, ví dụ Part 5. |
| summary | Tóm tắt ngắn nội dung bài học. |
| rules | Danh sách quy tắc ngữ pháp, dùng dấu chấm phẩy để tách nhiều giá trị. |
| exampleEn1 | Ví dụ tiếng Anh thứ nhất. |
| exampleVi1 | Nghĩa tiếng Việt của ví dụ thứ nhất. |
| exampleEn2 | Ví dụ tiếng Anh thứ hai. |
| exampleVi2 | Nghĩa tiếng Việt của ví dụ thứ hai. |
| relatedQuestionIds | Danh sách id câu hỏi liên quan, dùng dấu chấm phẩy để tách nhiều giá trị. |

## 4. Rules for Writing CSV

- Giữ `id` duy nhất trong từng file.
- Tránh dùng dấu phẩy trong nội dung văn bản nếu có thể.
- Dùng dấu chấm phẩy cho các trường dạng danh sách như `tags`, `rules` và `relatedQuestionIds`.
- Dùng tiếng Việt có dấu cho nội dung học thật.
- Dùng giá trị `level` một cách nhất quán.
- Dùng `toeicTarget` là `450`, `650` hoặc `750`.
- Dùng `difficulty` là `1`, `2` hoặc `3`.
- Trường `answer` trong questions phải khớp chính xác với một trong các trường `optionA`, `optionB`, `optionC` hoặc `optionD`.

## 5. Future Use

Các template CSV này là bước chuẩn bị cho tính năng import dữ liệu vào database hoặc trang admin trong tương lai.

Ứng dụng hiện tại vẫn đọc dữ liệu từ các file JSON trong thư mục `data/`. Về sau, chúng ta có thể xây dựng công cụ import để chuyển từng dòng CSV thành bản ghi JSON hoặc bản ghi database tương ứng.
