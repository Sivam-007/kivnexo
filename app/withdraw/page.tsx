
"use client";

import { useState } from "react";

type Method = "upi" | "giftcard";

export default function WithdrawPage() {
  const [method, setMethod] = useState<Method | null>(null);
  const [wallet, setWallet] = useState("normal");
  const [fullName, setFullName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [requestId, setRequestId] = useState("");

  function changeMethod(next: Method | null) {
    setMethod(next);
    setMessage("");
    setRequestId("");
    setError(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!method || loading) return;

    setLoading(true);
    setMessage("");
    setRequestId("");
    setError(false);

    try {
      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          walletType: wallet,
          fullName,
          amount: Number(amount),
          upiId: method === "upi" ? upiId : null,
          whatsappNumber:
            method === "giftcard" ? whatsappNumber : null,
          email: method === "giftcard" ? email : null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(true);
        setMessage(
          result.error || "Request failed. Please try again."
        );
        return;
      }

      setRequestId(result.requestId);
      setMessage(
        "Your withdrawal request has been submitted for manual verification."
      );

      setFullName("");
      setUpiId("");
      setWhatsappNumber("");
      setEmail("");
      setAmount("");
    } catch {
      setError(true);
      setMessage(
        "Unable to contact the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070a0f] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <a
          href="/dashboard"
          className="text-sm text-emerald-400 hover:text-emerald-300"
        >
          ← Back to Dashboard
        </a>

        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
          Withdraw Rewards
        </h1>
        <p className="mt-3 text-zinc-400">
          Choose a withdrawal method to submit your request.
        </p>

        {!method ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#0b0f15] p-6">
              <div className="flex h-24 items-center justify-center rounded-xl bg-white p-4">
                <img
                  src="/upi-logo.png"
                  alt="UPI"
                  className="max-h-16 max-w-full object-contain"
                />
              </div>
              <h2 className="mt-5 text-xl font-semibold">
                UPI Withdrawal
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Request an eligible payout to your UPI ID.
              </p>
              <button
                type="button"
                onClick={() => changeMethod("upi")}
                className="mt-5 w-full rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-black hover:bg-emerald-300"
              >
                Proceed
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b0f15] p-6">
              <div className="flex h-24 items-center justify-center rounded-xl bg-white p-4">
                <img
                  src="/google-play-gift-card.png"
                  alt="Google Play Gift Card"
                  className="max-h-16 max-w-full object-contain"
                />
              </div>
              <h2 className="mt-5 text-xl font-semibold">
                Google Play Gift Card
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Submit a gift card redemption request.
              </p>
              <button
                type="button"
                onClick={() => changeMethod("giftcard")}
                className="mt-5 w-full rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-black hover:bg-emerald-300"
              >
                Proceed
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-[#0b0f15] p-6 sm:p-8"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">
                {method === "upi" ? "UPI Request" : "Gift Card Request"}
              </h2>
              <button
                type="button"
                onClick={() => changeMethod(null)}
                className="text-sm text-emerald-400"
              >
                Change method
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Full name
              </label>
              <input
                required
                maxLength={120}
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#070a0f] px-4 py-3 outline-none focus:border-emerald-400"
                placeholder="Enter your full name"
              />
            </div>

            {method === "upi" ? (
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  UPI ID
                </label>
                <input
                  required
                  maxLength={200}
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  autoComplete="off"
                  className="w-full rounded-lg border border-white/10 bg-[#070a0f] px-4 py-3 outline-none focus:border-emerald-400"
                  placeholder="yourname@bank"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    WhatsApp number
                  </label>
                  <input
                    required
                    type="tel"
                    maxLength={30}
                    value={whatsappNumber}
                    onChange={(e) =>
                      setWhatsappNumber(e.target.value)
                    }
                    autoComplete="tel"
                    className="w-full rounded-lg border border-white/10 bg-[#070a0f] px-4 py-3 outline-none focus:border-emerald-400"
                    placeholder="Enter WhatsApp number"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Email address
                  </label>
                  <input
                    required
                    type="email"
                    maxLength={254}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full rounded-lg border border-white/10 bg-[#070a0f] px-4 py-3 outline-none focus:border-emerald-400"
                    placeholder="Enter email address"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                {method === "upi"
                  ? "Amount to withdraw (₹)"
                  : "Redemption amount (₹)"}
              </label>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#070a0f] px-4 py-3 outline-none focus:border-emerald-400"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Select wallet
              </label>
              <select
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#070a0f] px-4 py-3 outline-none focus:border-emerald-400"
              >
                <option value="normal">Normal Wallet</option>
                <option value="special">Special Rewards Wallet</option>
              </select>
            </div>

            <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-6 text-zinc-300">
              <p className="font-semibold text-amber-300">
                Important: Manual Verification
              </p>
              Your request will be reviewed manually. Payment or gift
              card delivery is not instant. We will verify your wallet
              balance, reward eligibility, and submitted details before
              processing. Processing may take some time. Please avoid
              duplicate requests while your request is pending.
            </div>

            {message && (
              <div
                role="status"
                className={`break-words rounded-lg border p-3 text-sm ${
                  error
                    ? "border-red-400/30 bg-red-400/5 text-red-300"
                    : "border-emerald-400/30 bg-emerald-400/5 text-emerald-300"
                }`}
              >
                <p>{message}</p>
                {requestId && (
                  <p className="mt-2 text-xs text-zinc-300">
                    Request ID: {requestId}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-black hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Submitting..."
                : method === "upi"
                  ? "Request Withdrawal"
                  : "Request Gift Card"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
