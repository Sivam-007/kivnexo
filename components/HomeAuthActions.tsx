"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function HomeAuthActions() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (mounted) {
        setIsLoggedIn(!error && !!data.session);
      }
    };

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setIsLoggedIn(!!session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoggedIn === null) {
    return <div className="h-10 w-32" aria-hidden="true" />;
  }

  if (isLoggedIn) {
    return (
      <Link
        href="/dashboard"
        className="inline-flex min-h-10 items-center justify-center rounded-xl bg-emerald-400 px-4 text-sm font-bold text-[#04100b] transition hover:bg-emerald-300 sm:px-5"
      >
        Dashboard →
      </Link>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
      <Link
        href="/login"
        className="inline-flex min-h-10 items-center justify-center rounded-xl px-2.5 text-sm text-zinc-200 transition hover:bg-white/5 sm:px-4"
      >
        Login
      </Link>

      <Link
        href="/signup"
        className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-xl bg-emerald-400 px-3 text-xs font-extrabold text-[#04100b] transition hover:bg-emerald-300 sm:px-5 sm:text-sm"
      >
        Join Now ↗
      </Link>
    </div>
  );
}