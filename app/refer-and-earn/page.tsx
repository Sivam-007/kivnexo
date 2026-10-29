"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MobileBottomNav from "@/components/MobileBottomNav";

type ReferralInfo = {
  code: string;
  coin_balance: number;
};

export default function ReferAndEarnPage() {
  const router = useRouter();

  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadReferralInfo() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase.rpc("get_my_referral_code");

      if (!active) return;

      if (error) {
        setMessage("Unable to load referral details. Please refresh.");
        setSuccess(false);
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
        setMessage("Referral details are currently unavailable.");
        setSuccess(false);
      }

      setLoading(false);
    }

    void loadReferralInfo();

    return () => {
      active = false;
    };
  }, [router]);

  async function copyCode() {
    if (!info?.code) return;

    try {
      await navigator.clipboard.writeText(info.code);
      setMessage("Referral code copied!");
      setSuccess(true);
    } catch {
      setMessage(
        "Copy failed. Please select and copy your referral code manually."
      );
      setSuccess(false);
    }
  }

  async function applyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    const code = referralCode.trim().toUpperCase();

    if (!code) {
      setMessage("Please enter a referral code.");
      return;
    }

    setApplying(true);

    try {
      const { data, error } = await supabase.rpc("apply_referral_code", {
        p_code: code,
      });

      if (error) {
        const errorText = error.message.toLowerCase();

        if (errorText.includes("own referral")) {
          setMessage("You cannot use your own referral code.");
        } else if (errorText.includes("already been applied")) {
          setMessage(
            "A referral code has already been applied to your account."
          );
        } else if (errorText.includes("invalid referral")) {
          setMessage("Invalid referral code. Please check and try again.");
        } else {
          setMessage("Referral could not be applied. Please try again.");
        }

        return;
      }

      const row = Array.isArray(data) ? data[0] : data;

      if (row && row.coin_balance !== undefined) {
        setInfo((current) =>
          current
            ? {
                ...current,
                coin_balance: Number(row.coin_balance),
              }
            : current
        );
      }

      setReferralCode("");
      setMessage("Referral applied successfully!");
      setSuccess(true);
    } catch {
      setMessage("Something went wrong. Please try again.");
      setSuccess(false);
    } finally {
      setApplying(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 pb-28 text-white sm:px-6 sm:py-10 md:pb-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-emerald-400"
        >
          <span aria-hidden="true">←</span>
          Back to Dashboard
        </Link>

        <header className="mt-7">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Kivnexo Rewards
          </p>

          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            Refer & Earn
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-base">
            Share your referral code with friends and earn Kivnexo Coins.
          </p>
        </header>

        <section className="mt-7 rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">Your coin balance</p>
              <p className="mt-2 text-3xl font-extrabold text-emerald-400">
                {loading ? "..." : `${info?.coin_balance ?? 0}`}
                <span className="ml-2 text-base font-semibold">Coins</span>
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-3xl">
              🪙
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <label
              htmlFor="my-referral-code"
              className="text-sm font-medium text-gray-300"
            >
              Your referral code
            </label>

            <div className="mt-2 flex min-w-0 gap-2">
              <input
                id="my-referral-code"
                value={loading ? "Loading..." : info?.code ?? "Unavailable"}
                readOnly
                aria-label="Your referral code"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-3 font-mono text-sm font-bold tracking-wider text-white outline-none sm:px-4"
              />

              <button
                type="button"
                onClick={copyCode}
                disabled={loading || !info?.code}
                className="shrink-0 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Copy
              </button>
            </div>

            <p className="mt-3 text-xs leading-5 text-gray-500">
              Share this code with your friends so they can apply it to their
              accounts.
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
          <h2 className="text-xl font-bold">Have a referral code?</h2>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Enter your friend&apos;s code to receive 5 Kivnexo Coins. You can
            apply a referral code only once.
          </p>

          <form onSubmit={applyCode} className="mt-5 space-y-3">
            <label
              htmlFor="referral-code"
              className="block text-sm font-medium text-gray-300"
            >
              Enter referral code
            </label>

            <input
              id="referral-code"
              type="text"
              value={referralCode}
              onChange={(event) =>
                setReferralCode(event.target.value.toUpperCase())
              }
              maxLength={8}
              autoCapitalize="characters"
              autoComplete="off"
              placeholder="e.g. ABC123"
              disabled={loading || applying}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-400 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={loading || applying || !referralCode.trim()}
              className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-bold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {applying ? "Applying..." : "Apply Referral Code"}
            </button>
          </form>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`mt-4 rounded-lg border p-3 text-sm ${
                success
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                  : "border-amber-400/20 bg-amber-400/10 text-amber-300"
              }`}
            >
              {message}
            </p>
          )}
        </section>

        <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-bold">How it works</h2>

          <ol className="mt-4 space-y-4">
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-bold text-emerald-400">
                1
              </span>
              <div>
                <p className="font-medium">Share your code</p>
                <p className="mt-1 text-sm text-gray-400">
                  Copy your referral code and share it with a friend.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-bold text-emerald-400">
                2
              </span>
              <div>
                <p className="font-medium">Your friend applies the code</p>
                <p className="mt-1 text-sm text-gray-400">
                  Your friend enters your code on the Refer & Earn page.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-bold text-emerald-400">
                3
              </span>
              <div>
                <p className="font-medium">Earn Kivnexo Coins</p>
                <p className="mt-1 text-sm text-gray-400">
                  Referral rewards are credited according to Kivnexo&apos;s
                  referral rules.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-gray-500">
          Kivnexo Coins are separate from cash rewards and cannot be withdrawn
          or converted to cash.
        </p>
      </div>

      <MobileBottomNav />
    </main>
  );
}