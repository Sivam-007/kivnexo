
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EarnPage() {
  const [view, setView] = useState<"categories" | "special" | "paytm">(
    "categories"
  );
  const [taskName, setTaskName] = useState("");
  const [taskFirstTwo, setTaskFirstTwo] = useState("");
  const [taskLastTwo, setTaskLastTwo] = useState("");
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskMessage, setTaskMessage] = useState("");
  const [taskError, setTaskError] = useState("");

  const submitPaytmTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTaskMessage("");
    setTaskError("");

    if (!taskName.trim()) {
      setTaskError("Enter the referred user's name.");
      return;
    }

    if (!/^\d{2}$/.test(taskFirstTwo) || !/^\d{2}$/.test(taskLastTwo)) {
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
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <a
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-green-400"
        >
          ← Back to Dashboard
        </a>

        <h1 className="mt-6 text-3xl font-extrabold">
          Start <span className="text-green-400">Earning</span>
        </h1>

        <p className="mt-2 text-gray-400">
          Choose a category and explore available earning tasks.
        </p>

        {view === "categories" && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-3xl">📋</div>
              <h2 className="mt-4 text-xl font-bold">Normal Tasks</h2>
              <p className="mt-2 text-sm text-gray-400">
                Regular earning tasks will be added here soon.
              </p>
              <span className="mt-5 inline-block text-sm text-gray-500">
                Coming soon
              </span>
            </div>

            <div className="rounded-2xl border border-green-400/30 bg-green-400/[0.04] p-6">
              <div className="text-3xl">🎁</div>
              <h2 className="mt-4 text-xl font-bold text-green-400">
                Special Tasks
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Complete eligible partner offers and submit them for verification.
              </p>
              <button
                type="button"
                onClick={() => setView("special")}
                className="mt-5 w-full rounded-xl bg-green-400 px-5 py-3 font-bold text-black hover:bg-green-300"
              >
                View Special Tasks →
              </button>
            </div>
          </div>
        )}

        {view === "special" && (
          <section className="mt-8">
            <button
              type="button"
              onClick={() => setView("categories")}
              className="text-sm text-gray-400 hover:text-green-400"
            >
              ← Back to Categories
            </button>

            <h2 className="mt-5 text-2xl font-bold">Special Tasks</h2>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-2xl font-extrabold text-sky-400">
                Paytm
              </div>
              <h3 className="mt-2 text-lg font-semibold">
                Paytm Referral Task
              </h3>
              <p className="mt-2 text-sm text-green-400">
                Earn up to ₹40, subject to offer eligibility and verification.
              </p>
              <p className="mt-3 text-sm text-gray-400">
                Referral number: 9943410292
              </p>
              <p className="mt-4 text-sm leading-6 text-gray-400">
                Sign up as a new Paytm user through the referral link and
                follow the current offer terms. If required, complete your
                first UPI payment of ₹10 within 7 days of signup.
              </p>
              <button
                type="button"
                onClick={() => setView("paytm")}
                className="mt-5 w-full rounded-xl border border-green-400/40 px-5 py-3 font-semibold text-green-400 hover:bg-green-400/10"
              >
                View Task Details & Submit →
              </button>
            </div>
          </section>
        )}

        {view === "paytm" && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <button
              type="button"
              onClick={() => {
                setView("special");
                setTaskMessage("");
                setTaskError("");
              }}
              className="text-sm text-gray-400 hover:text-green-400"
            >
              ← Back to Special Tasks
            </button>

            <div className="mt-5 text-2xl font-extrabold text-sky-400">
              Paytm
            </div>
            <h2 className="mt-2 text-xl font-bold">Paytm Referral Details</h2>

            <p className="mt-2 text-sm text-green-400">
              Earn up to ₹40, subject to offer eligibility and verification.
            </p>

            <p className="mt-4 text-sm text-gray-300">
              Referral number: <strong>9943410292</strong>
            </p>

            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-gray-400">
              <li>Open the referral link and sign up as a new Paytm user.</li>
              <li>
                Follow the current offer terms. If required, complete your
                first UPI payment of ₹10 within 7 days of signup.
              </li>
              <li>
                After completing the eligible activity, submit the referred
                user's details below for manual verification.
              </li>
            </ol>

            <a
              href="https://p.paytm.me/xCTH/zhfslhwl?utmt=101319"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block rounded-xl bg-sky-400 px-5 py-3 text-center font-bold text-black hover:bg-sky-300"
            >
              Open Paytm Referral Link ↗
            </a>

            <form onSubmit={submitPaytmTask} className="mt-7 space-y-4">
              <h3 className="text-lg font-semibold">
                Submit Referral for Verification
              </h3>

              <label className="block text-sm text-gray-300">
                Referred user's name
                <input
                  value={taskName}
                  onChange={(event) => setTaskName(event.target.value)}
                  maxLength={100}
                  required
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-white outline-none focus:border-green-400"
                  placeholder="Enter name"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-gray-300">
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
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-white outline-none focus:border-green-400"
                    placeholder="XX"
                  />
                </label>

                <label className="block text-sm text-gray-300">
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
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-white outline-none focus:border-green-400"
                    placeholder="XX"
                  />
                </label>
              </div>

              {taskError && (
                <p className="text-sm text-red-400" role="alert">
                  {taskError}
                </p>
              )}

              {taskMessage && (
                <p className="text-sm text-green-400" role="status">
                  {taskMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={taskSubmitting}
                className="w-full rounded-xl bg-green-400 px-5 py-3 font-bold text-black hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {taskSubmitting ? "Submitting..." : "Submit for Verification"}
              </button>
            </form>

            <p className="mt-4 text-xs leading-5 text-gray-500">
              Submit genuine referrals only. Rewards are not guaranteed and
              will be credited to your Special Wallet only after verification.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
