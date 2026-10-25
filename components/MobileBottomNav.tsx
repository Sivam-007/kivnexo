
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/dashboard", icon: "⌂" },
  { label: "Earn", href: "/earn", icon: "◈" },
  { label: "Games", href: "/games", icon: "🎮" },
  { label: "Surveys", href: "/surveys", icon: "▤" },
  { label: "Withdraw", href: "/withdraw", icon: "₹" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#101014]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-3 text-center text-xs transition ${
                active
                  ? "text-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span aria-hidden="true" className="text-xl leading-5">
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
