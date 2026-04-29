# TOEIC App Data Schema

Tài liệu này định nghĩa cấu trúc dữ liệu nền tảng cho ứng dụng học TOEIC. Mục tiêu là giúp việc quản lý nội dung quy mô lớn trong tương lai thống nhất, dễ mở rộng và sẵn sàng chuyển từ file JSON sang cơ sở dữ liệu.

Current fields should match the JSON files in `data/`. Future fields are marked optional and can be added later when moving to database/admin.

## 1. Vocabulary Word Schema

Đối tượng vocabulary word dùng để lưu một từ vựng TOEIC, bao gồm thông tin tiếng Anh, nghĩa tiếng Việt, ví dụ sử dụng, chủ đề, cấp độ và các thông tin phục vụ cá nhân hóa lộ trình học.

| Field | Type | Required | Example | Note |
| --- | --- | --- | --- | --- |
| id | number | Required | `1` | Mã định danh duy nhất của từ vựng trong dữ liệu hiện tại. |
| word | string | Required | `"invoice"` | Từ tiếng Anh cần học. |
| pronunciation | string | Optional | `"/ˈɪnvɔɪs/"` | Phiên âm IPA hoặc cách đọc gợi ý. |
| meaning | string | Required | `"hóa đơn"` | Nghĩa tiếng Việt chính của từ. |
| example | string | Required | `"Please send the invoice by Friday."` | Câu ví dụ tiếng Anh. |
| exampleMeaning | string | Required | `"Vui lòng gửi hóa đơn trước thứ Sáu."` | Bản dịch tiếng Việt của câu ví dụ. |
| topic | string | Required | `"Business"` | Chủ đề nội dung, ví dụ: Business, Travel, Office. |
| level | string | Required | `"beginner"` | Cấp độ học, ví dụ: beginner, intermediate, advanced. |
| toeicTarget | 450 \| 650 \| 750 | Required | `650` | Mốc điểm TOEIC mục tiêu phù hợp với từ này. |
| difficulty | 1 \| 2 \| 3 | Required | `1` | Độ khó dạng số: 1 dễ, 2 trung bình, 3 khó. |
| tags | string[] | Optional | `["office", "payment"]` | Trường mở rộng cho tương lai để lọc, tìm kiếm hoặc gợi ý học. |
| partOfSpeech | string | Optional | `"noun"` | Trường mở rộng cho tương lai để lưu từ loại, ví dụ: noun, verb, adjective, adverb. |
| createdAt | string | Optional | `"2026-04-28T09:00:00.000Z"` | Trường mở rộng cho tương lai, dùng khi chuyển sang database/admin. |
| updatedAt | string | Optional | `"2026-04-28T09:00:00.000Z"` | Trường mở rộng cho tương lai, dùng khi chuyển sang database/admin. |

```json
{
  "id": 1,
  "word": "invoice",
  "pronunciation": "/ˈɪnvɔɪs/",
  "meaning": "hóa đơn",
  "example": "Please send the invoice by Friday.",
  "exampleMeaning": "Vui lòng gửi hóa đơn trước thứ Sáu.",
  "topic": "Business",
  "level": "beginner",
  "toeicTarget": 650,
  "difficulty": 1
}
```

## 2. Practice Question Schema

Đối tượng practice question dùng để lưu một câu hỏi luyện tập TOEIC. Cấu trúc này hỗ trợ nhiều phần thi khác nhau, đặc biệt là các câu hỏi trắc nghiệm như Part 5, đồng thời lưu giải thích và điểm ngữ pháp liên quan.

| Field | Type | Required | Example | Note |
| --- | --- | --- | --- | --- |
| id | number | Required | `1` | Mã định danh duy nhất của câu hỏi trong dữ liệu hiện tại. |
| part | string | Required | `"Part 5"` | Phần thi TOEIC, ví dụ: Part 5, Part 6, Part 7. |
| question | string | Required | `"The report must be submitted _____ noon."` | Nội dung câu hỏi hoặc câu cần điền đáp án. |
| options | string[] | Required | `["by", "on", "at", "for"]` | Danh sách lựa chọn trả lời. |
| answer | string | Required | `"by"` | Đáp án đúng. |
| explanation | string | Required | `"By noon nghĩa là trước hoặc muộn nhất vào buổi trưa."` | Giải thích vì sao đáp án đúng. |
| grammarPoint | string | Optional | `"Prepositions of time"` | Điểm ngữ pháp chính được kiểm tra. |
| difficulty | 1 \| 2 \| 3 | Optional | `2` | Trường mở rộng cho tương lai: 1 dễ, 2 trung bình, 3 khó. |
| toeicTarget | 450 \| 650 \| 750 | Optional | `650` | Trường mở rộng cho tương lai để gắn câu hỏi với mốc điểm TOEIC. |
| topic | string | Optional | `"Office"` | Chủ đề nội dung của câu hỏi. |
| createdAt | string | Optional | `"2026-04-28T09:00:00.000Z"` | Trường mở rộng cho tương lai, dùng khi chuyển sang database/admin. |
| updatedAt | string | Optional | `"2026-04-28T09:00:00.000Z"` | Trường mở rộng cho tương lai, dùng khi chuyển sang database/admin. |

```json
{
  "id": 1,
  "part": "Part 5",
  "question": "The report must be submitted _____ noon.",
  "options": ["by", "on", "at", "for"],
  "answer": "by",
  "explanation": "By noon nghĩa là trước hoặc muộn nhất vào buổi trưa, phù hợp với hạn nộp báo cáo.",
  "grammarPoint": "Prepositions of time"
}
```

## 3. Grammar Lesson Schema

Đối tượng grammar lesson dùng để lưu một bài học ngữ pháp TOEIC, bao gồm tiêu đề, cấp độ, phần thi liên quan, tóm tắt, quy tắc, ví dụ và liên kết tới các câu hỏi luyện tập phù hợp.

| Field | Type | Required | Example | Note |
| --- | --- | --- | --- | --- |
| id | number | Required | `1` | Mã định danh duy nhất của bài học ngữ pháp trong dữ liệu hiện tại. |
| title | string | Required | `"Prepositions of Time"` | Tiêu đề tiếng Anh của bài học. |
| titleVi | string | Required | `"Giới từ chỉ thời gian"` | Tiêu đề tiếng Việt của bài học. |
| level | string | Required | `"Basic"` | Cấp độ hiện tại dùng chuỗi như Basic, Intermediate. |
| toeicPart | string | Required | `"Part 5"` | Phần thi TOEIC liên quan trong dữ liệu hiện tại. |
| summary | string | Required | `"Cách dùng các giới từ in, on, at, by trong ngữ cảnh thời gian."` | Mô tả ngắn về nội dung bài học. |
| rules | string[] | Required | `["Use by for deadlines.", "Use at for exact times."]` | Danh sách quy tắc chính. |
| examples | object[] | Required | `[{ "en": "Submit it by Monday.", "vi": "Nộp trước hoặc muộn nhất vào thứ Hai." }]` | Danh sách ví dụ minh họa, mỗi ví dụ có câu tiếng Anh và nghĩa tiếng Việt. |
| relatedQuestionIds | number[] | Optional | `[1, 14]` | Trường mở rộng cho tương lai để liên kết tới các câu hỏi luyện tập liên quan. |
| createdAt | string | Optional | `"2026-04-28T09:00:00.000Z"` | Trường mở rộng cho tương lai, dùng khi chuyển sang database/admin. |
| updatedAt | string | Optional | `"2026-04-28T09:00:00.000Z"` | Trường mở rộng cho tương lai, dùng khi chuyển sang database/admin. |

```json
{
  "id": 1,
  "title": "Prepositions of Time",
  "titleVi": "Giới từ chỉ thời gian",
  "level": "Basic",
  "toeicPart": "Part 5",
  "summary": "Bài học giải thích cách dùng các giới từ in, on, at và by trong ngữ cảnh thời gian thường gặp ở TOEIC.",
  "rules": [
    "Use at for exact times.",
    "Use on for days and dates.",
    "Use in for months, years, and longer periods.",
    "Use by for deadlines."
  ],
  "examples": [
    {
      "en": "The meeting starts at 9 a.m.",
      "vi": "Cuộc họp bắt đầu lúc 9 giờ sáng."
    },
    {
      "en": "Please finish the task by Friday.",
      "vi": "Vui lòng hoàn thành nhiệm vụ trước hoặc muộn nhất vào thứ Sáu."
    }
  ]
}
```

## 4. Future Database Tables

Trong tương lai, ứng dụng có thể cần các bảng cơ sở dữ liệu sau:

| Table | Purpose |
| --- | --- |
| users | Lưu thông tin tài khoản người dùng, hồ sơ học tập, mục tiêu TOEIC và thiết lập cá nhân. |
| words | Lưu toàn bộ dữ liệu từ vựng TOEIC thay cho file JSON hiện tại. |
| questions | Lưu ngân hàng câu hỏi luyện tập TOEIC cho các phần thi. |
| grammar_lessons | Lưu bài học ngữ pháp, quy tắc, ví dụ và liên kết tới câu hỏi liên quan. |
| user_word_progress | Lưu tiến độ học từ vựng của từng người dùng, trạng thái đã học, số lần ôn tập và mức độ ghi nhớ. |
| user_question_history | Lưu lịch sử làm bài của người dùng, đáp án đã chọn, kết quả đúng sai và thời điểm làm bài. |
| study_plans | Lưu kế hoạch học tập, mục tiêu điểm số, lịch học và nội dung được gợi ý cho từng người dùng. |

## 5. Future Admin Content Management

Về sau, ứng dụng có thể xây dựng trang quản trị nội dung để đội vận hành hoặc giáo viên quản lý dữ liệu học tập trực tiếp trong hệ thống. Trang quản trị có thể hỗ trợ:

- Thêm, sửa, xóa từ vựng.
- Thêm, sửa, xóa câu hỏi luyện tập.
- Thêm, sửa, xóa bài học ngữ pháp.
- Import nội dung từ file CSV hoặc JSON.
- Quản lý topic, level, difficulty và TOEIC target để chuẩn hóa phân loại nội dung.

## 6. Notes for Current App

Ứng dụng hiện tại đang sử dụng các file JSON cục bộ để lưu dữ liệu học tập:

- `data/words.json`
- `data/questions.json`
- `data/grammar.json`

Các file JSON này chỉ là giải pháp tạm thời cho giai đoạn phát triển ban đầu. Khi ứng dụng cần quản lý dữ liệu lớn hơn, hỗ trợ nhiều người dùng hơn hoặc có trang quản trị nội dung, các file này sẽ được thay thế bằng các bảng cơ sở dữ liệu tương ứng như `words`, `questions` và `grammar_lessons`.
