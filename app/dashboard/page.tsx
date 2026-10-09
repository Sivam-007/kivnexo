"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const getUserEmail = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!error && data.user) {
        setUserEmail(data.user.email ?? "");
      }
    };

    getUserEmail();
  }, []);
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert("Logout failed. Please try again.");
    return;
  }

  window.location.href = "/";
};

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/">
            <img
              src="/kivnexo-logo.png"
              alt="Kivnexo"
              className="h-10 w-auto"
            />
          </a>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-red-400 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
      
      <p className="text-sm text-green-400">
  Welcome back 👋 {userEmail && `(${userEmail})`}
</p>

          <h1 className="mt-2 text-3xl font-bold">
            Your Dashboard
          </h1>

          <p className="mt-2 text-gray-400">
            Complete eligible tasks and earn rewards.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-gray-400">
              Normal Wallet
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              ₹0.00
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Available from regular offers
            </p>
          </div>

          <div className="rounded-2xl border border-green-400/20 bg-green-400/[0.04] p-6">
            <p className="text-sm text-gray-400">
              Special Rewards
            </p>

            <h2 className="mt-3 text-4xl font-bold text-green-400">
              ₹0.00
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Rewards from eligible special tasks
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <a
            href="#offers"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-green-400/40"
          >
            <h3 className="font-semibold">Earn Rewards</h3>
            <p className="mt-2 text-sm text-gray-400">
              Discover available tasks and offers.
            </p>
          </a>

          <a
            href="#transactions"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-green-400/40"
          >
            <h3 className="font-semibold">Transactions</h3>
            <p className="mt-2 text-sm text-gray-400">
              View your reward activity.
            </p>
          </a>

          <a
            href="#withdraw"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-green-400/40"
          >
            <h3 className="font-semibold">Withdraw</h3>
            <p className="mt-2 text-sm text-gray-400">
              Withdraw your eligible rewards.
            </p>
          </a>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold">
            How your rewards work
          </h2>

          <div className="mt-5 space-y-4 text-sm text-gray-400">
            <p>
              <span className="font-medium text-white">
                Regular offers:
              </span>{" "}
              Rewards are added to your Normal Wallet.
            </p>

            <p>
              <span className="font-medium text-white">
                Special tasks:
              </span>{" "}
              Eligible special-task rewards are tracked separately.
            </p>

            <p>
              <span className="font-medium text-white">
                Verified rewards:
              </span>{" "}
              Rewards are credited only after the required activity is verified.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}