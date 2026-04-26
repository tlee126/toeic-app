"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    icon: "🏠",
    label: "Home",
  },
  {
    href: "/vocabulary",
    icon: "📘",
    label: "Từ",
  },
  {
    href: "/flashcards",
    icon: "🧠",
    label: "Card",
  },
  {
    href: "/review",
    icon: "🔁",
    label: "Ôn lại",
  },
  {
    href: "/practice",
    icon: "✅",
    label: "Luyện",
  },
  {
    href: "/stats",
    icon: "📊",
    label: "Stats",
  },
  {
    href: "/settings",
    icon: "🎯",
    label: "Mục tiêu",
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-2 py-2 shadow-lg">
      <div className="mx-auto grid max-w-md grid-cols-7 gap-1 text-center text-[10px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl p-2 ${
                isActive
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "text-slate-500"
              }`}
            >
              <div className="text-lg">{item.icon}</div>
              <div className="mt-1">{item.label}</div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}