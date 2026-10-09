
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RewardForm() {
  const [email, setEmail] = useState("");
  const [walletType, setWalletType] = useState("normal");
  const [amount, setAmount] = useState("");
  const [taskReference, setTaskReference] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();
    const numericAmount = Number(amount);
    const cleanReference = taskReference.trim();

    if (!cleanEmail || !cleanReference) {
      setMessage("User email and task reference are required.");
      return;
    }

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      numericAmount > 100000 ||
      Math.round(numericAmount * 100) !== numericAmount * 100
    ) {
      setMessage("Enter a valid amount with at most 2 decimal places.");
      return;
    }

    setLoading(true);

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        setMessage("Please log in again.");
        return;
      }

      const response = await fetch("/api/admin/credit-reward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          walletType,
          amount: numericAmount,
          taskReference: cleanReference,
          verificationNotes: notes.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Unable to credit reward.");
        return;
      }

      setMessage(
        `Reward credited successfully! Transaction ID: ${result.transactionId}`
      );

      setEmail("");
      setAmount("");
      setTaskReference("");
      setNotes("");
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <label className="mb-2 block text-sm text-gray-300">
          User Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          className="w-full rounded-lg border border-white/15 bg-gray-900 px-4 py-3 text-white outline-none focus:border-green-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-300">
          Wallet Type
        </label>
        <select
          value={walletType}
          onChange={(e) => setWalletType(e.target.value)}
          className="w-full rounded-lg border border-white/15 bg-gray-900 px-4 py-3 text-white outline-none focus:border-green-400"
        >
          <option value="normal">Normal Wallet</option>
          <option value="special">Special Rewards</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-300">
          Amount (₹)
        </label>
        <input
          type="number"
          required
          min="0.01"
          max="100000"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100.00"
          className="w-full rounded-lg border border-white/15 bg-gray-900 px-4 py-3 text-white outline-none focus:border-green-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-300">
          Unique Task Reference
        </label>
        <input
          type="text"
          required
          maxLength={200}
          value={taskReference}
          onChange={(e) => setTaskReference(e.target.value)}
          placeholder="Example: OFFER-USER123-001"
          className="w-full rounded-lg border border-white/15 bg-gray-900 px-4 py-3 text-white outline-none focus:border-green-400"
        />
        <p className="mt-1 text-xs text-gray-500">
          Use a unique reference for each verified reward.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-300">
          Verification Notes (Optional)
        </label>
        <textarea
          maxLength={2000}
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How was this task verified?"
          className="w-full rounded-lg border border-white/15 bg-gray-900 px-4 py-3 text-white outline-none focus:border-green-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-green-500 px-5 py-3 font-semibold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Processing..." : "Credit Reward"}
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="break-words rounded-lg border border-white/10 bg-gray-900 p-3 text-sm text-gray-200"
        >
          {message}
        </p>
      )}
    </form>
  );
}