
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ReferralInfo = {
  code: string;
  coin_balance: number;
};

export default function ReferralCoinsCard() {
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function loadReferralInfo() {
    setLoading(true);

    const { data, error } = await supabase.rpc("get_my_referral_code");

    if (error) {
      setMessage("Unable to load referral details. Please refresh.");
      setLoading(false);
      return;
    }

    const row = Array.isArray(data) ? data[0] : data;

    if (row) {
      setInfo({
        code: row.code,
        coin_balance: Number(row.coin_balance),
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadReferralInfo();
  }, []);

  async function copyCode() {
    if (!info?.code) return;

    try {
      await navigator.clipboard.writeText(info.code);
      setMessage("Referral code copied!");
      setSuccess(true);
    } catch {
      setMessage("Copy failed. Please copy the code manually.");
      setSuccess(false);
    }
  }

  async function applyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!referralCode.trim()) {
      setMessage("Please enter a referral code.");
      setSuccess(false);
      return;
    }

    setApplying(true);

    const { data, error } = await supabase.rpc("apply_referral_code", {
      p_code: referralCode.trim().toUpperCase(),
    });

    if (error) {
      const text = error.message.toLowerCase();

      if (text.includes("own referral")) {
        setMessage("You cannot use your own referral code.");
      } else if (text.includes("already been applied")) {
        setMessage("A referral code has already been applied to your account.");
      } else if (text.includes("invalid referral")) {
        setMessage("Invalid referral code. Please check and try again.");
      } else {
        setMessage("Referral could not be applied. Please try again.");
      }

      setSuccess(false);
      setApplying(false);
      return;
    }

    const row = Array.isArray(data) ? data[0] : data;

    if (row) {
      setInfo((current) =>
        current
          ? { ...current, coin_balance: Number(row.coin_balance) }
          : current
      );
    }

    setMessage("Referral applied! You received 5 Kivnexo Coins.");
    setSuccess(true);
    setReferralCode("");
    setApplying(false);
  }

  return (
    <section className="rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-5 text-white sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-400">Refer & Earn</p>
          <h2 className="mt-1 text-2xl font-bold">Kivnexo Coins</h2>
          <p className="mt-2 text-sm text-gray-400">
            Invite friends and earn 20 coins when they apply your code.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
          <p className="text-xs text-gray-400">Your coin balance</p>
          <p className="mt-1 text-xl font-bold text-emerald-400">
            {loading ? "..." : `${info?.coin_balance ?? 0} coins`}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <label className="text-sm text-gray-300">Your referral code</label>
        <div className="mt-2 flex gap-2">
          <div className="flex min-w-0 flex-1 items-center rounded-lg border border-white/10 bg-black/30 px-3 py-3 font-mono font-semibold tracking-wider">
            {loading ? "Loading..." : info?.code ?? "Unavailable"}
          </div>
          <button
            type="button"
            onClick={copyCode}
            disabled={loading || !info?.code}
            className="rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-black disabled:opacity-50"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="my-6 border-t border-white/10" />

      <h3 className="text-lg font-semibold">Have a refer code?</h3>
      <p className="mt-1 text-sm text-gray-400">
        Enter your friend&apos;s code to receive 5 coins. You can apply a code
        only once.
      </p>

      <form onSubmit={applyCode} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={referralCode}
          onChange={(event) => setReferralCode(event.target.value.toUpperCase())}
          maxLength={8}
          autoCapitalize="characters"
          autoComplete="off"
          placeholder="Enter referral code"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-white outline-none focus:border-emerald-400"
        />
        <button
          type="submit"
          disabled={applying || loading}
          className="rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-black disabled:opacity-50"
        >
          {applying ? "Applying..." : "Apply code"}
        </button>
      </form>

      {message && (
        <p
          role="status"
          className={`mt-3 text-sm ${
            success ? "text-emerald-400" : "text-amber-300"
          }`}
        >
          {message}
        </p>
      )}

      <p className="mt-4 text-xs text-gray-500">
        Coins are separate from cash rewards and cannot be withdrawn or
        converted to cash.
      </p>
    </section>
  );
}
