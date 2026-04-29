import { grammarLessons } from "@/data/grammar";
import BottomNav from "@/components/BottomNav";

export default function GrammarPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">
      <section className="mx-auto max-w-md">
        <div className="mb-6">
          <p className="text-sm text-slate-500">Bài học ngữ pháp</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            TOEIC Grammar
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Học nhanh các điểm ngữ pháp thường gặp trong TOEIC Part 5.
          </p>
        </div>

        <div className="space-y-4">
          {grammarLessons.map((lesson) => (
            <div key={lesson.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {lesson.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {lesson.titleVi}
                  </p>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                  {lesson.toeicPart}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-600">{lesson.summary}</p>

              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-800">
                  Quy tắc cần nhớ:
                </p>

                <ul className="mt-2 space-y-1">
                  {lesson.rules.map((rule) => (
                    <li key={rule} className="text-sm text-slate-600">
                      • {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">Ví dụ:</p>

                <p className="mt-2 text-sm text-slate-700">
                  {lesson.examples[0].en}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {lesson.examples[0].vi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}