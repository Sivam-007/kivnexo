"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ReferralInfo = {
  code: string;
  coin_balance: number;
};

export default function ReferralCoinsCard() {
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReferralInfo() {
      const { data, error } = await supabase.rpc("get_my_referral_code");

      if (!active) return;

      if (error) {
        setErrorMessage("Coin balance load aagala. Refresh panni paaru.");
        setLoading(false);
        return;
      }

      const row = Array.isArray(data) ? data[0] : data;

      if (row) {
        setInfo({
          code: row.code,
          coin_balance: Number(row.coin_balance ?? 0),
        });
      } else {
        setErrorMessage("Referral details ippo available illa.");
      }

      setLoading(false);
    }

    void loadReferralInfo();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-5 text-white sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-400">
            Refer & Earn
          </p>

          <h2 className="mt-1 text-xl font-bold sm:text-2xl">
            Invite Friends, Earn Coins
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Share your referral code and earn Kivnexo Coins.
          </p>
        </div>

        <div className="min-w-[120px] rounded-xl border border-white/10 bg-black/30 px-4 py-3">
          <p className="text-xs text-gray-400">Your coin balance</p>
          <p className="mt-1 text-xl font-bold text-emerald-400">
            {loading ? "..." : `${info?.coin_balance ?? 0} coins`}
          </p>
        </div>
      </div>

      {errorMessage && (
        <p role="status" className="mt-3 text-sm text-amber-300">
          {errorMessage}
        </p>
      )}

      <Link
        href="/refer-and-earn"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:bg-emerald-300 sm:w-auto"
      >
        Refer & Earn
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}