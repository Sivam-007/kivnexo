
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
          whatsappNumber: method === "giftcard" ? whatsappNumber : null,
          email: method === "giftcard" ? email : null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(true);
        setMessage(result.error || "Request failed. Please try again.");
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
      setMessage("Unable to contact the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full min-w-0 rounded-xl border border-white/10 bg-[#050b08] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030806] px-4 py-6 text-white sm:px-6 sm:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300 transition hover:border-emerald-400/40 hover:text-emerald-300"
        >
          <span aria-hidden="true">←</span> Back to Dashboard
        </a>

        <header className="mt-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-bold tracking-[0.18em] text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            KIVNEXO REWARDS
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
            Withdraw <span className="text-emerald-400">Rewards</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
            Choose your preferred redemption method and submit a request for
            verification.
          </p>
        </header>

        <section className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-950/60 to-[#07100c] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-xl">
              ₹
            </div>
            <p className="mt-3 font-semibold">Reward redemption</p>
            <p className="mt-1 text-xs leading-5 text-gray-400">
              Select the wallet you want to use.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl">
              <span aria-hidden="true">✓</span>
            </div>
            <p className="mt-3 font-semibold">Manual verification</p>
            <p className="mt-1 text-xs leading-5 text-gray-400">
              Details are reviewed before processing.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl">
              <span aria-hidden="true">↗</span>
            </div>
            <p className="mt-3 font-semibold">Request tracking</p>
            <p className="mt-1 text-xs leading-5 text-gray-400">
              Keep your request ID for reference.
            </p>
          </div>
        </section>

        {!method ? (
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Choose a method</h2>
              <p className="mt-1 text-sm text-gray-400">
                Select how you want to redeem your eligible rewards.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-5 transition hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_12px_40px_rgba(16,185,129,0.08)] sm:p-6">
                <div className="flex h-24 items-center justify-center rounded-xl border border-white/10 bg-white p-4">
                  <img
                    src="/upi-logo.png"
                    alt="UPI"
                    className="max-h-16 max-w-full object-contain"
                  />
                </div>

                <div className="mt-5 flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold">UPI Withdrawal</h3>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                    INR
                  </span>
                </div>

                <p className="mt-2 min-h-10 text-sm leading-5 text-gray-400">
                  Submit your UPI ID for an eligible cash withdrawal request.
                </p>

                <button
  type="button"
  onClick={() => changeMethod("upi")}
  className="mt-5 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3.5 font-bold text-white transition hover:border-emerald-400/40 hover:bg-emerald-400/10"
>
  Continue with UPI <span aria-hidden="true">→</span>
</button>
              </article>

              <article className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-5 transition hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_12px_40px_rgba(16,185,129,0.08)] sm:p-6">
                <div className="flex h-24 items-center justify-center rounded-xl border border-white/10 bg-white p-4">
                  <img
                    src="/google-play-gift-card.png"
                    alt="Google Play Gift Card"
                    className="max-h-16 max-w-full object-contain"
                  />
                </div>

                <div className="mt-5 flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold">Google Play Gift Card</h3>
                  <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-300">
                    GIFT
                  </span>
                </div>

                <p className="mt-2 min-h-10 text-sm leading-5 text-gray-400">
                  Submit your redemption details for manual review.
                </p>

                <button
                  type="button"
                  onClick={() => changeMethod("giftcard")}
                  className="mt-5 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3.5 font-bold text-white transition hover:border-emerald-400/40 hover:bg-emerald-400/10"
                >
                  Continue with Gift Card <span aria-hidden="true">→</span>
                </button>
              </article>
            </div>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-b from-[#0b1510] to-[#070b09] shadow-2xl"
          >
            <div className="border-b border-white/10 p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-emerald-400">
                    WITHDRAWAL DETAILS
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {method === "upi" ? "UPI Request" : "Gift Card Request"}
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Enter your details carefully before submitting.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => changeMethod(null)}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:border-emerald-400/40 hover:text-emerald-300"
                >
                  Change method
                </button>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-7">
              <div>
                <label
                  htmlFor="withdraw-full-name"
                  className="mb-2 block text-sm font-medium text-gray-200"
                >
                  Full name
                </label>
                <input
                  id="withdraw-full-name"
                  required
                  maxLength={120}
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder="Enter your full name"
                />
              </div>

              {method === "upi" ? (
                <div>
                  <label
                    htmlFor="withdraw-upi-id"
                    className="mb-2 block text-sm font-medium text-gray-200"
                  >
                    UPI ID
                  </label>
                  <input
                    id="withdraw-upi-id"
                    required
                    maxLength={200}
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    autoComplete="off"
                    className={inputClass}
                    placeholder="yourname@bank"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Double-check your UPI ID before submitting.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="withdraw-whatsapp"
                      className="mb-2 block text-sm font-medium text-gray-200"
                    >
                      WhatsApp number
                    </label>
                    <input
                      id="withdraw-whatsapp"
                      required
                      type="tel"
                      maxLength={30}
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      autoComplete="tel"
                      className={inputClass}
                      placeholder="Enter WhatsApp number"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="withdraw-email"
                      className="mb-2 block text-sm font-medium text-gray-200"
                    >
                      Email address
                    </label>
                    <input
                      id="withdraw-email"
                      required
                      type="email"
                      maxLength={254}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className={inputClass}
                      placeholder="Enter email address"
                    />
                  </div>
                </>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="withdraw-amount"
                    className="mb-2 block text-sm font-medium text-gray-200"
                  >
                    {method === "upi"
                      ? "Amount to withdraw (₹)"
                      : "Redemption amount (₹)"}
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400">
                      ₹
                    </span>
                    <input
                      id="withdraw-amount"
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`${inputClass} pl-9`}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="withdraw-wallet"
                    className="mb-2 block text-sm font-medium text-gray-200"
                  >
                    Select wallet
                  </label>
                  <select
                    id="withdraw-wallet"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    className={inputClass}
                  >
                    <option value="normal">Normal Wallet</option>
                    <option value="special">Special Rewards Wallet</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
                    !
                  </span>
                  <div>
                    <p className="font-bold text-amber-300">
                      Manual verification
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-300">
                      Your request will be reviewed manually. Payment or gift
                      card delivery is not instant. We will verify your wallet
                      balance, reward eligibility, and submitted details before
                      processing. Processing may take some time. Please avoid
                      duplicate requests while your request is pending.
                    </p>
                  </div>
                </div>
              </div>

              {message && (
                <div
                  role="status"
                  className={`break-words rounded-xl border p-4 text-sm leading-6 ${
                    error
                      ? "border-red-400/30 bg-red-400/[0.06] text-red-300"
                      : "border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-300"
                  }`}
                >
                  <p className="font-semibold">
                    {error ? "Request not completed" : "Request update"}
                  </p>
                  <p className="mt-1">{message}</p>
                  {requestId && (
                    <p className="mt-3 break-all rounded-lg bg-black/20 p-3 text-xs text-gray-300">
                      Request ID: {requestId}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 px-4 py-4 font-extrabold text-black shadow-[0_5px_0_#047857] transition hover:brightness-110 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
              >
                {loading
                  ? "Submitting request..."
                  : method === "upi"
                    ? "Submit Withdrawal Request →"
                    : "Submit Gift Card Request →"}
              </button>

              <p className="text-center text-xs leading-5 text-gray-500">
                Submission does not guarantee approval. All requests are
                subject to verification.
              </p>
            </div>
          </form>
        )}

        <footer className="mt-8 border-t border-white/10 py-5 text-center text-xs leading-5 text-gray-500">
          Kivnexo Rewards · Please submit accurate redemption details.
        </footer>
      </div>
    </main>
  );
}
