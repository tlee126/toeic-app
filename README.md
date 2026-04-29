# TOEIC Study App

## Giới thiệu

TOEIC Study App là ứng dụng học TOEIC theo hướng mobile-first, hỗ trợ học từ vựng, luyện flashcards, ôn ngữ pháp, làm bài practice, review nội dung yếu và theo dõi tiến độ học tập.

## Tính năng hiện có

- Vocabulary search and filters
- Pronunciation using browser speech synthesis
- Flashcard sessions: 5 / 10 / 20 / all
- Review weak words
- Grammar lessons
- TOEIC Part 5 practice sessions
- Stats
- TOEIC goal settings
- CSV content import workflow

## Công nghệ sử dụng

- Next.js
- TypeScript
- Tailwind CSS
- localStorage
- CSV/JSON data workflow

## Cách chạy local

```bash
npm install
npm run dev
```

Mở ứng dụng tại:

```text
http://localhost:3000
```

Ví dụ chạy để kiểm thử trên thiết bị cùng mạng:

```bash
npm run dev -- -H 192.168.1.2
```

## Cách build kiểm tra

```bash
npm run build
```

## Quy trình dữ liệu hiện tại

App hiện đọc dữ liệu thật từ:

- `data/words.json`
- `data/questions.json`
- `data/grammar.json`

CSV templates nằm trong:

- `templates/`

Import scripts nằm trong:

- `scripts/`

Documentation nằm trong:

- `docs/`

## Ghi chú quan trọng

- Current progress is stored in localStorage.
- Progress is not synced across devices yet.
- Database and login will be added in a later phase.
- Do not push/deploy before testing locally because Vercel auto-deploys after git push.
