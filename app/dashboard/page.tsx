
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState("");
  const [normalBalance, setNormalBalance] = useState<number | null>(null);
  const [specialBalance, setSpecialBalance] = useState<number | null>(null);
  const [walletError, setWalletError] = useState("");

  const [bonusCode, setBonusCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [bonusMessage, setBonusMessage] = useState("");
  const [bonusSuccess, setBonusSuccess] = useState(false);
  const [showBonusPopup, setShowBonusPopup] = useState(false);
  const [showJoinChannel, setShowJoinChannel] = useState(false);

  const whatsappChannelUrl =
    process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || "";

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        window.location.href = "/login?next=%2Fdashboard";
        return;
      }

      setUserEmail(userData.user.email ?? "");

      const { data: wallet, error: loadWalletError } = await supabase
        .from("wallets")
        .select("normal_balance, special_balance")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (loadWalletError) {
        setWalletError(
          "Unable to load wallet. Please refresh and try again."
        );
        return;
      }

      if (!wallet) {
        setWalletError("Wallet not found. Please contact support.");
        return;
      }

      setNormalBalance(Number(wallet.normal_balance));
      setSpecialBalance(Number(wallet.special_balance));
    };

    loadDashboard();
  }, []);

  const refreshWallet = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data: wallet, error } = await supabase
      .from("wallets")
      .select("normal_balance, special_balance")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (!error && wallet) {
      setNormalBalance(Number(wallet.normal_balance));
      setSpecialBalance(Number(wallet.special_balance));
    }
  };

  const handleRedeemBonus = async () => {
    const code = bonusCode.trim().toUpperCase();

    if (!code) {
      setBonusMessage("Please enter a bonus code.");
      setBonusSuccess(false);
      setShowJoinChannel(false);
      setShowBonusPopup(true);
      return;
    }

    setRedeeming(true);
    setBonusMessage("");

    try {
      const { data, error } = await supabase.rpc(
        "redeem_promo_code",
        { p_code: code }
      );

      if (error) {
        const message = error.message.toLowerCase();

        if (
          message.includes("fully redeemed") ||
          message.includes("already redeemed")
        ) {
          setBonusMessage(
            "Sorry, this code has already been used. Join our WhatsApp channel for upcoming bonus codes."
          );
          setBonusSuccess(false);
          setShowJoinChannel(true);
        } else if (message.includes("expired")) {
          setBonusMessage(
            "This bonus code has expired. Join our WhatsApp channel for upcoming codes."
          );
          setBonusSuccess(false);
          setShowJoinChannel(true);
        } else if (
          message.includes("invalid or inactive") ||
          message.includes("enter a valid promo code")
        ) {
          setBonusMessage(
            "Invalid bonus code. Please check the code and try again."
          );
          setBonusSuccess(false);
          setShowJoinChannel(false);
        } else {
          setBonusMessage(
            "We couldn't redeem this code right now. Please try again later."
          );
          setBonusSuccess(false);
          setShowJoinChannel(false);
        }

        setShowBonusPopup(true);
        return;
      }

      if (!data || data.length === 0) {
        setBonusMessage(
          "We couldn't confirm the reward. Please refresh and check your wallet."
        );
        setBonusSuccess(false);
        setShowJoinChannel(false);
        setShowBonusPopup(true);
        return;
      }

      const reward = Number(data[0].credited_amount);

      setBonusMessage(
        `Success! ₹${reward.toFixed(2)} has been added to your Normal Wallet.`
      );
      setBonusSuccess(true);
      setShowJoinChannel(false);
      setBonusCode("");
      setShowBonusPopup(true);

      await refreshWallet();
    } catch {
      setBonusMessage(
        "Something went wrong. Please try again later."
      );
      setBonusSuccess(false);
      setShowJoinChannel(false);
      setShowBonusPopup(true);
    } finally {
      setRedeeming(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Logout failed. Please try again.");
      return;
    }

    window.location.href = "/";
  };

  const formatBalance = (balance: number | null) =>
    balance === null ? "Loading..." : `₹${balance.toFixed(2)}`;

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
            Welcome back {userEmail && `(${userEmail})`}
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Your Dashboard
          </h1>

          <p className="mt-2 text-gray-400">
            Complete eligible tasks and earn rewards.
          </p>
        </div>

        {walletError && (
          <p className="mb-5 rounded-lg border border-red-400/30 p-4 text-sm text-red-400">
            {walletError}
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-gray-400">Normal Wallet</p>
            <h2 className="mt-3 text-4xl font-bold">
              {formatBalance(normalBalance)}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Available from regular offers and bonus codes
            </p>
          </div>

          <div className="rounded-2xl border border-green-400/20 bg-green-400/[0.04] p-6">
            <p className="text-sm text-gray-400">Special Rewards</p>
            <h2 className="mt-3 text-4xl font-bold text-green-400">
              {formatBalance(specialBalance)}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Rewards from eligible special tasks
            </p>
          </div>
        </div>

        <section
          id="bonus-code"
          className="mt-8 rounded-2xl border border-green-400/30 bg-green-400/[0.04] p-6"
        >
          <h2 className="text-xl font-bold">
            Have a Bonus Code?
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Enter your bonus code to claim eligible rewards in your
            Normal Wallet. Each code can be redeemed only once.
          </p>

          <form
            className="mt-5 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              void handleRedeemBonus();
            }}
          >
            <input
              value={bonusCode}
              onChange={(event) =>
                setBonusCode(event.target.value.toUpperCase())
              }
              maxLength={80}
              autoComplete="off"
              placeholder="Enter bonus code"
              aria-label="Bonus code"
              disabled={redeeming}
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-green-400"
            />

            <button
              type="submit"
              disabled={redeeming || !bonusCode.trim()}
              className="rounded-xl bg-green-400 px-6 py-3 font-semibold text-black transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {redeeming ? "Redeeming..." : "Redeem Code"}
            </button>
          </form>

          <p className="mt-3 text-xs text-gray-500">
            Only redeem codes shared through official Kivnexo channels.
          </p>
        </section>

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

      {showBonusPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowBonusPopup(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bonus-popup-title"
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#101010] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowBonusPopup(false)}
              aria-label="Close popup"
              className="absolute right-4 top-4 rounded-lg px-2 py-1 text-xl text-gray-400 hover:text-white"
            >
              ×
            </button>

            <h2
              id="bonus-popup-title"
              className={`pr-8 text-xl font-bold ${
                bonusSuccess ? "text-green-400" : "text-white"
              }`}
            >
              {bonusSuccess ? "Bonus Claimed!" : "Bonus Code"}
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-300">
              {bonusMessage}
            </p>

            {showJoinChannel && whatsappChannelUrl && (
              <a
                href={whatsappChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block rounded-xl bg-green-400 px-5 py-3 text-center font-semibold text-black hover:bg-green-300"
              >
                Join WhatsApp Channel
              </a>
            )}

            {showJoinChannel && !whatsappChannelUrl && (
              <p className="mt-4 text-xs text-gray-500">
                Our WhatsApp channel link will be available here soon.
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowBonusPopup(false)}
              className="mt-4 w-full rounded-xl border border-white/15 px-5 py-3 text-sm text-gray-300 hover:bg-white/5"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
