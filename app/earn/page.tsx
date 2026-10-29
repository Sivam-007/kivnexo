
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import MobileBottomNav from "@/components/MobileBottomNav";

type EarnView = "categories" | "special" | "paytm";

export default function EarnPage() {
  const [view, setView] = useState<EarnView>("categories");
  const [taskName, setTaskName] = useState("");
  const [taskFirstTwo, setTaskFirstTwo] = useState("");
  const [taskLastTwo, setTaskLastTwo] = useState("");
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskMessage, setTaskMessage] = useState("");
  const [taskError, setTaskError] = useState("");

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#050b08] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10";

  const submitPaytmTask = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setTaskMessage("");
    setTaskError("");

    if (!taskName.trim()) {
      setTaskError("Enter the referred user's name.");
      return;
    }

    if (
      !/^\d{2}$/.test(taskFirstTwo) ||
      !/^\d{2}$/.test(taskLastTwo)
    ) {
      setTaskError("Enter exactly 2 digits in each mobile field.");
      return;
    }

    setTaskSubmitting(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setTaskError("Please log in again and retry.");
        return;
      }

      const { error } = await supabase.rpc("submit_paytm_referral", {
        p_mobile_first_two: taskFirstTwo,
        p_mobile_last_two: taskLastTwo,
        p_proof_details: `Referred user's name: ${taskName.trim()}. Submitted for manual referral verification.`,
        p_proof_url: null,
      });

      if (error) {
        setTaskError(error.message);
        return;
      }

      setTaskMessage(
        "Submission received! Your task is pending admin verification."
      );

      setTaskName("");
      setTaskFirstTwo("");
      setTaskLastTwo("");
    } catch {
      setTaskError("Unable to submit right now. Please try again.");
    } finally {
      setTaskSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030806] px-4 py-6 pb-28 text-white sm:px-6 sm:py-10 md:pb-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300 transition hover:border-emerald-400/40 hover:text-emerald-300"
        >
          <span aria-hidden="true">←</span> Back to Dashboard
        </a>

        <header className="mt-8 sm:mt-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            KIVNEXO EARNINGS
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
            Start <span className="text-emerald-400">Earning</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
            Explore available earning opportunities, complete eligible
            activities and track your reward verification.
          </p>
        </header>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-xs text-gray-500">TASK CATEGORIES</p>
            <p className="mt-2 text-lg font-bold sm:text-xl">
              Normal & Special
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Explore opportunities
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-xs text-gray-500">REWARD PROCESS</p>
            <p className="mt-2 text-lg font-bold sm:text-xl">
              Verification
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Eligibility is checked
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4 sm:col-span-1">
            <p className="text-xs text-emerald-300/70">KIVNEXO REWARDS</p>
            <p className="mt-2 text-lg font-bold text-emerald-300 sm:text-xl">
              Earn & Redeem
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Subject to task terms
            </p>
          </div>
        </div>

        {view === "categories" && (
          <section className="mt-9">
            <div className="mb-5">
              <h2 className="text-xl font-bold sm:text-2xl">
                Choose a Category
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Select a category to explore its available activities.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#111714] to-[#070b09] p-5 transition duration-300 hover:border-white/20 sm:p-7">
                <div
                  aria-hidden="true"
                  className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/[0.025] blur-2xl"
                />

                <div className="relative">
                  <span className="inline-flex rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold tracking-wider text-gray-300">
                    CATEGORY 01
                  </span>

                  <h2 className="mt-5 text-2xl font-extrabold">
                    Normal Tasks
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Regular earning opportunities will appear here when
                    they become available.
                  </p>

                  <div className="mt-6 rounded-xl border border-white/[0.07] bg-black/20 p-4">
                    <p className="text-sm font-semibold text-gray-300">
                      Availability
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      New tasks coming soon
                    </p>
                  </div>

                  <span className="mt-5 inline-flex rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-500">
                    Coming Soon
                  </span>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-950/60 via-[#09140e] to-[#060a08] p-5 shadow-[0_12px_45px_rgba(16,185,129,0.05)] transition duration-300 hover:border-emerald-300/50 sm:p-7">
                <div
                  aria-hidden="true"
                  className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-400/[0.08] blur-2xl"
                />

                <div className="relative">
                  <span className="inline-flex rounded-lg border border-emerald-400/25 bg-emerald-400/[0.08] px-3 py-1.5 text-xs font-bold tracking-wider text-emerald-300">
                    CATEGORY 02
                  </span>

                  <h2 className="mt-5 text-2xl font-extrabold">
                    Special <span className="text-emerald-400">Tasks</span>
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-300">
                    Explore eligible partner offers and submit completed
                    activities for manual verification.
                  </p>

                  <div className="mt-6 rounded-xl border border-emerald-400/15 bg-black/20 p-4">
                    <p className="text-sm font-semibold text-emerald-300">
                      Available opportunity
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Paytm Referral Task
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setView("special")}
                    className="mt-5 w-full rounded-xl bg-emerald-400 px-5 py-3.5 font-bold text-black shadow-[0_4px_0_#047857] transition hover:bg-emerald-300 active:translate-y-1 active:shadow-none"
                  >
                    Explore Special Tasks <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            </div>
          </section>
        )}

        {view === "special" && (
          <section className="mt-9">
            <button
              type="button"
              onClick={() => setView("categories")}
              className="text-sm text-gray-400 transition hover:text-emerald-300"
            >
              ← Back to Categories
            </button>

            <div className="mt-6">
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-400">
                EARNING OPPORTUNITIES
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Special Tasks
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Review each offer's eligibility requirements before
                participating.
              </p>
            </div>

            <article className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#101914] to-[#070b09]">
              <div className="border-b border-white/10 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex rounded-lg border border-sky-400/20 bg-sky-400/[0.06] px-3 py-1.5 text-xs font-bold tracking-wider text-sky-300">
                      PARTNER OFFER
                    </span>
                    <h3 className="mt-4 text-2xl font-extrabold">
                      Paytm Referral Task
                    </h3>
                    <p className="mt-2 text-sm text-gray-400">
                      New-user referral activity
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3">
                    <p className="text-xs text-gray-400">Potential reward</p>
                    <p className="mt-1 text-xl font-black text-emerald-300">
                      Up to ₹40
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                    <p className="text-xs text-gray-500">REFERRAL NUMBER</p>
                    <p className="mt-2 text-lg font-bold tracking-wide">
                      9943410292
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                    <p className="text-xs text-gray-500">REWARD STATUS</p>
                    <p className="mt-2 text-sm font-semibold text-amber-300">
                      Verification required
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-gray-400">
                  Sign up as a new Paytm user through the referral link and
                  follow the current offer terms. If required, complete your
                  first UPI payment of ₹10 within 7 days of signup.
                </p>

                <button
                  type="button"
                  onClick={() => setView("paytm")}
                  className="mt-6 w-full rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] px-5 py-3.5 font-bold text-emerald-300 transition hover:bg-emerald-400/[0.12] sm:w-auto sm:min-w-64"
                >
                  View Task Details & Submit <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          </section>
        )}

        {view === "paytm" && (
          <section className="mt-9 overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-b from-[#0b1510] to-[#070b09]">
            <div className="border-b border-white/10 p-5 sm:p-7">
              <button
                type="button"
                onClick={() => {
                  setView("special");
                  setTaskMessage("");
                  setTaskError("");
                }}
                className="text-sm text-gray-400 transition hover:text-emerald-300"
              >
                ← Back to Special Tasks
              </button>

              <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] text-sky-300">
                    PAYTM REFERRAL
                  </p>
                  <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                    Referral Details
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Complete the eligible activity before submitting proof.
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3">
                  <p className="text-xs text-gray-400">Potential reward</p>
                  <p className="mt-1 text-xl font-black text-emerald-300">
                    Up to ₹40
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 sm:p-5">
                <p className="text-xs font-bold tracking-wider text-gray-500">
                  REFERRAL NUMBER
                </p>
                <p className="mt-2 text-xl font-bold tracking-wide">
                  9943410292
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold">How to complete the task</h3>

                <ol className="mt-4 space-y-4">
                  <li className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] text-sm font-bold text-emerald-300">
                      1
                    </span>
                    <p className="pt-1 text-sm leading-6 text-gray-300">
                      Open the referral link and sign up as a new Paytm user.
                    </p>
                  </li>

                  <li className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] text-sm font-bold text-emerald-300">
                      2
                    </span>
                    <p className="pt-1 text-sm leading-6 text-gray-300">
                      Follow the current offer terms. If required, complete
                      your first UPI payment of ₹10 within 7 days of signup.
                    </p>
                  </li>

                  <li className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] text-sm font-bold text-emerald-300">
                      3
                    </span>
                    <p className="pt-1 text-sm leading-6 text-gray-300">
                      After completing the eligible activity, submit the
                      referred user's details for manual verification.
                    </p>
                  </li>
                </ol>
              </div>

              <a
                href="https://p.paytm.me/xCTH/zhfslhwl?utmt=101319"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl bg-sky-400 px-5 py-4 text-center font-bold text-black transition hover:bg-sky-300"
              >
                Open Paytm Referral Link <span aria-hidden="true">↗</span>
              </a>

              <div className="border-t border-white/10 pt-6">
                <div>
                  <h3 className="text-xl font-bold">
                    Submit for Verification
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Enter the referred user's name and the requested mobile
                    number digits.
                  </p>
                </div>

                <form onSubmit={submitPaytmTask} className="mt-5 space-y-5">
                  <label className="block text-sm font-medium text-gray-300">
                    Referred user's name
                    <input
                      value={taskName}
                      onChange={(event) => setTaskName(event.target.value)}
                      maxLength={100}
                      required
                      className={inputClass}
                      placeholder="Enter name"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-gray-300">
                      First 2 digits of mobile number
                      <input
                        value={taskFirstTwo}
                        onChange={(event) =>
                          setTaskFirstTwo(
                            event.target.value.replace(/\D/g, "").slice(0, 2)
                          )
                        }
                        inputMode="numeric"
                        pattern="\d{2}"
                        required
                        className={inputClass}
                        placeholder="XX"
                      />
                    </label>

                    <label className="block text-sm font-medium text-gray-300">
                      Last 2 digits of mobile number
                      <input
                        value={taskLastTwo}
                        onChange={(event) =>
                          setTaskLastTwo(
                            event.target.value.replace(/\D/g, "").slice(0, 2)
                          )
                        }
                        inputMode="numeric"
                        pattern="\d{2}"
                        required
                        className={inputClass}
                        placeholder="XX"
                      />
                    </label>
                  </div>

                  {taskError && (
                    <div
                      className="rounded-xl border border-red-400/25 bg-red-400/[0.05] p-4 text-sm leading-6 text-red-300"
                      role="alert"
                    >
                      {taskError}
                    </div>
                  )}

                  {taskMessage && (
                    <div
                      className="rounded-xl border border-emerald-400/25 bg-emerald-400/[0.05] p-4 text-sm leading-6 text-emerald-300"
                      role="status"
                    >
                      {taskMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={taskSubmitting}
                    className="w-full rounded-xl bg-emerald-400 px-5 py-4 font-bold text-black shadow-[0_4px_0_#047857] transition hover:bg-emerald-300 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  >
                    {taskSubmitting
                      ? "Submitting..."
                      : "Submit for Verification"}
                  </button>
                </form>
              </div>

              <p className="border-t border-white/10 pt-5 text-xs leading-6 text-gray-500">
                Submit genuine referrals only. Rewards are not guaranteed and
                will be credited to your Special Wallet only after
                verification.
              </p>
            </div>
          </section>
        )}
      </div>

      <MobileBottomNav />
    </main>
  );
}
