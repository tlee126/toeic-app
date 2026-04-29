import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const moreItems = [
  {
    href: "/review",
    icon: "🔁",
    title: "Ôn lại từ yếu",
    description: "Tập trung vào các từ bạn đã đánh dấu Quên hoặc Khó.",
  },
  {
    href: "/grammar",
    icon: "✍️",
    title: "Ngữ pháp",
    description: "Ôn các chủ điểm ngữ pháp TOEIC Part 5.",
  },
  {
    href: "/stats",
    icon: "📊",
    title: "Thống kê",
    description: "Xem tiến độ học từ vựng và luyện tập.",
  },
  {
    href: "/settings",
    icon: "🎯",
    title: "Mục tiêu TOEIC",
    description: "Chọn mục tiêu TOEIC 450, 650 hoặc 750+.",
  },
];

export default function MorePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">
      <section className="mx-auto max-w-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Thêm</h1>
          <p className="mt-2 text-sm text-slate-600">
            Các chức năng học tập và cài đặt khác.
          </p>
        </div>

        <div className="space-y-3">
          {moreItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-3xl bg-white p-5 shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  {item.icon}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
