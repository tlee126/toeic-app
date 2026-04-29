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
    href: "/practice",
    icon: "✅",
    label: "Luyện",
  },
  {
    href: "/more",
    icon: "☰",
    label: "Thêm",
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-3 pb-3 pt-2 shadow-lg backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 text-center text-[11px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-1 py-2.5 transition ${
                isActive
                  ? "bg-blue-50 font-semibold text-blue-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              <div className="text-xl leading-none">{item.icon}</div>
              <div className="mt-1 truncate">{item.label}</div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
