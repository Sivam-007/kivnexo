
"use client";

import { useEffect, useState } from "react";
import OfferwallBanner from "@/components/OfferwallBanner";
import { supabase } from "@/lib/supabase";
import MobileBottomNav from "@/components/MobileBottomNav";
import ReferralCoinsCard from "@/components/ReferralCoinsCard";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState("");
  const [normalBalance, setNormalBalance] = useState<number | null>(null);
  const [specialBalance, setSpecialBalance] = useState<number | null>(null);
  const [walletError, setWalletError] = useState("");
const [taskFirstTwo, setTaskFirstTwo] = useState("");
const [taskLastTwo, setTaskLastTwo] = useState("");
const [taskProof, setTaskProof] = useState("");
const [taskProofUrl, setTaskProofUrl] = useState("");
const [taskSubmitting, setTaskSubmitting] = useState(false);
const [taskMessage, setTaskMessage] = useState("");
const [taskError, setTaskError] = useState("");
const [earningView, setEarningView] = useState<"home" | "categories" | "paytm">("home");
const [taskName, setTaskName] = useState("");
const [moneyRainKey, setMoneyRainKey] = useState(0);
  const [bonusCode, setBonusCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [bonusMessage, setBonusMessage] = useState("");
  const [bonusSuccess, setBonusSuccess] = useState(false);
  const [showBonusPopup, setShowBonusPopup] = useState(false);
  const [showJoinChannel, setShowJoinChannel] = useState(false);

  
const [spinning, setSpinning] = useState(false);
const [hasSpunToday, setHasSpunToday] = useState(false);
const [spinSlot, setSpinSlot] = useState<number | null>(null);
const [wheelRotation, setWheelRotation] = useState(0);
const [spinMessage, setSpinMessage] = useState("");
const [showSpinPopup, setShowSpinPopup] = useState(false);


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

      
const indiaToday = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const { data: todaysSpin, error: spinHistoryError } = await supabase
  .from("spin_wheel_spins")
  .select("id, prize_slot, reward_amount")
  .eq("user_id", userData.user.id)
  .eq("spin_date", indiaToday)
  .maybeSingle();

if (!spinHistoryError && todaysSpin) {
  setHasSpunToday(true);
  setSpinSlot(Number(todaysSpin.prize_slot));
  setSpinMessage(
    Number(todaysSpin.reward_amount) > 0
      ? `Today's spin reward: ₹${Number(todaysSpin.reward_amount).toFixed(2)}`
      : "You've already used today's free spin. Come back tomorrow!"
  );
}


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

  

const handleDailySpin = async () => {
  if (spinning || hasSpunToday) return;

  setSpinning(true);
  setSpinMessage("");

  try {
    const { data, error } = await supabase.rpc("spin_wheel_daily");

    if (error) {
      if (error.message.toLowerCase().includes("daily spin already used")) {
        setHasSpunToday(true);
        setSpinMessage("You've already used today's free spin. Come back tomorrow!");
      } else {
        setSpinMessage("Unable to spin right now. Please try again later.");
      }

      return;
    }

    if (!data || data.length === 0) {
      setSpinMessage("We couldn't confirm your spin. Please refresh and check your wallet.");
      return;
    }

    const slot = Number(data[0].result_slot);
    const amount = Number(data[0].result_amount);

    // Database has already selected and recorded the result.
    // Rotate the wheel to visually reveal that result.
    
const slotAngles: Record<number, number> = {
  1: 180, // ₹0
  2: 0,   // ₹1
  3: 300, // ₹2
  4: 120, // ₹0.50
  5: 60,  // ₹0
  6: 240, // ₹5
};


    const currentRotation = wheelRotation % 360;
    const desiredAngle = slotAngles[slot] ?? 0;
    const extraAngle = (desiredAngle - currentRotation + 360) % 360;

    setWheelRotation(wheelRotation + 360 * 6 + extraAngle);
    setSpinSlot(slot);

    await new Promise((resolve) => setTimeout(resolve, 4200));

    setHasSpunToday(true);
    setSpinMessage(
      amount > 0
        ? `Congratulations! You won ₹${amount.toFixed(2)}. It's been added to your Normal Wallet.`
        : "Better luck next time! You can spin again tomorrow."
    );

    await refreshWallet();
  } catch {
    setSpinMessage(
      "We couldn't confirm the result. Please refresh and check your wallet."
    );
  } finally {
    setSpinning(false);
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
    <main
  className="relative min-h-screen overflow-x-clip bg-[#030806] bg-cover bg-center bg-fixed text-white selection:bg-emerald-400/30"
  style={{
    backgroundImage:
      "linear-gradient(rgba(3, 8, 6, 0.45), rgba(3, 8, 6, 0.72)), url('/kivnexo-home-bg.png')",
  }}
>
      <header className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
          <a href="/">
            <img
              src="/kivnexo-logo.png"
              alt="Kivnexo"
               className="block h-10 w-40 object-contain object-left"
            />
          </a>

          <button
            onClick={handleLogout}
            className="shrink-0 whitespace-nowrap rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-red-400 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-8">
          <p className="text-sm text-green-400">
            Welcome back {userEmail && `(${userEmail})`}
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Your Dashboard
          </h1>

          <p className="mt-2 text-gray-400">
            Complete eligible tasks and earn rewards.
          </p>
        </div>
        <OfferwallBanner size="300x250" />
<section className="relative isolate mt-6 overflow-hidden rounded-3xl border border-emerald-400/25 bg-gradient-to-br from-emerald-950 via-[#06110d] to-black p-5 sm:p-8">
  <style>{`
    @keyframes kivnexoFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-9px); }
    }

    @keyframes kivnexoCoinFall {
      0% { transform: translateY(-65px) rotate(0deg); opacity: 0; }
      15% { opacity: 1; }
      100% { transform: translateY(280px) rotate(300deg); opacity: 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .kivnexo-float, .kivnexo-rain-coin {
        animation: none !important;
      }
    }
  `}</style>

  <div
    aria-hidden="true"
    key={moneyRainKey}
    className="pointer-events-none absolute inset-0 overflow-hidden"
  >
    {Array.from({ length: 12 }, (_, index) => (
      <span
        key={`${moneyRainKey}-${index}`}
        className="kivnexo-rain-coin absolute top-0 text-xl sm:text-2xl"
        style={{
          left: `${5 + ((index * 23) % 90)}%`,
          animation: `kivnexoCoinFall ${2.2 + (index % 4) * 0.45}s ${
            (index % 6) * 0.25
          }s ease-in infinite`,
        }}
      >
        {index % 3 === 0 ? "💸" : "🪙"}
      </span>
    ))}
  </div>

  <div className="relative z-10 grid items-center gap-5 sm:grid-cols-[1fr_0.85fr]">
    <div>
      <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
        KIVNEXO REWARDS
      </span>

      <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
        Make It Rain!
        <span className="mt-1 block text-emerald-400">
          Earn. Celebrate. Repeat.
        </span>
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-gray-300">
        Explore eligible tasks, discover rewards and collect your
        Kivnexo Coins.
      </p>

      <button
        type="button"
        onClick={() => setMoneyRainKey((current) => current + 1)}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-bold text-black transition hover:bg-emerald-300 active:scale-95"
      >
        🪙 Make It Rain!
      </button>
    </div>

    <div className="flex justify-center">
      <img
        src="/Joyful%20Neon%20Fox%20Money%20Rain.webp"
        alt="Kivnexo mascot celebrating with coins and money"
        width={480}
        height={480}
        fetchPriority="high"
        className="kivnexo-float h-auto max-h-72 w-full max-w-[340px] object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.25)] sm:max-h-96 sm:max-w-[400px]"
        style={{
          animation: "kivnexoFloat 3.5s ease-in-out infinite",
        }}
      />
    </div>
  </div>
</section>
        {walletError && (
          <p className="mb-5 rounded-lg border border-red-400/30 p-4 text-sm text-red-400">
            {walletError}
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="relative min-w-0 overflow-hidden rounded-2xl border border-emerald-400/50 bg-[#06130f]/40 p-5 shadow-xl backdrop-blur-md transition duration-300 hover:border-emerald-300 sm:p-7">
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-400/15 blur-3xl"
  />

  <div className="relative flex items-start justify-between gap-3">
    <div>
      <p className="text-sm font-semibold tracking-wide text-emerald-200">
        Normal Wallet
      </p>

      <h2 className="mt-3 break-words text-3xl font-extrabold text-white sm:text-4xl">
        {formatBalance(normalBalance)}
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-300">
        Available from regular offers and bonus codes
      </p>
    </div>

    <div className="shrink-0 rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-3">
      <span className="text-2xl" aria-hidden="true">₹</span>
    </div>
  </div>
</div>

          <div className="relative min-w-0 overflow-hidden rounded-2xl border border-green-400/50 bg-[#06130f]/40 p-5 shadow-xl backdrop-blur-md transition duration-300 hover:border-green-300 sm:p-7">
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-green-400/15 blur-3xl"
  />

  <div className="relative flex items-start justify-between gap-3">
    <div>
      <p className="text-sm font-semibold tracking-wide text-green-200">
        Special Rewards
      </p>

      <h2 className="mt-3 break-words text-3xl font-extrabold text-emerald-300 sm:text-4xl">
        {formatBalance(specialBalance)}
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-300">
        Rewards from eligible special tasks
      </p>
    </div>

    <div className="shrink-0 rounded-xl border border-green-300/20 bg-green-400/10 p-3">
      <span className="text-2xl" aria-hidden="true">✦</span>
    </div>
  </div>
</div>
        </div>

        <section
          id="bonus-code"
          className="mt-8 rounded-2xl border border-green-400/30 bg-black/30 backdrop-blur-sm p-6"
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

        


{showSpinPopup && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-3 backdrop-blur-md sm:p-6"
    onClick={() => setShowSpinPopup(false)}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="spin-popup-title"
      className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-400/40 bg-gradient-to-b from-[#10251d] via-[#07120e] to-black p-5 text-center shadow-[0_0_60px_rgba(16,185,129,0.15)] sm:p-8"
      onClick={(event) => event.stopPropagation()}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl"
      />

      <button
        type="button"
        onClick={() => setShowSpinPopup(false)}
        aria-label="Close spin wheel"
        className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl text-gray-300 transition hover:bg-white/10 hover:text-white"
      >
        ×
      </button>

      <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
        KIVNEXO REWARDS
      </p>

      <h2
        id="spin-popup-title"
        className="mt-2 text-2xl font-black sm:text-3xl"
      >
        Daily <span className="text-emerald-400">Spin Wheel</span>
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
        One free spin every day. Rewards go to your Normal Wallet.
      </p>

      <div className="relative mx-auto mt-8 w-full max-w-[310px]">
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-full bg-emerald-400/10 blur-xl"
        />

        <div
          aria-hidden="true"
          className="absolute -inset-2 rounded-full border-4 border-yellow-500/40 shadow-[0_0_25px_rgba(234,179,8,0.18)]"
        />

        <div className="relative aspect-square rounded-full border-[7px] border-[#d4a72c] bg-[#161616] p-2 shadow-[inset_0_0_0_3px_#704d0c,0_12px_0_#51380b,0_18px_30px_rgba(0,0,0,0.7)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-1 z-20 rounded-full border border-yellow-200/50"
          />

          <div
            className="relative h-full w-full overflow-hidden rounded-full border-2 border-yellow-300/70"
            style={{
              background:
                "conic-gradient(from -30deg, #047857 0deg 60deg, #111827 60deg 120deg, #ca8a04 120deg 180deg, #111827 180deg 240deg, #047857 240deg 300deg, #111827 300deg 360deg)",
              transform: `rotate(${wheelRotation}deg)`,
              transition: spinning
                ? "transform 4s cubic-bezier(0.12, 0.75, 0.15, 1)"
                : "none",
              boxShadow:
                "inset 0 0 18px rgba(0,0,0,0.75), inset 0 0 3px 2px rgba(255,215,0,0.35)",
            }}
          >
            <div className="relative h-full w-full">
              {[
                { label: "₹1", angle: 0 },
                { label: "₹2", angle: 60 },
                { label: "₹5", angle: 120 },
                { label: "₹0", angle: 180 },
                { label: "₹0.50", angle: 240 },
                { label: "₹0", angle: 300 },
              ].map((item) => (
                <span
                  key={item.angle}
                  className="absolute left-1/2 top-1/2 rounded-lg border border-yellow-200/30 bg-black/25 px-2 py-1 text-sm font-black text-white drop-shadow-md sm:text-base"
                  style={{
                    transform: `rotate(${item.angle}deg) translateY(-105px) rotate(-${item.angle}deg) translate(-50%, -50%)`,
                  }}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 z-30 flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-yellow-200 bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-900 text-xs font-black tracking-wider text-black shadow-[0_0_18px_rgba(250,204,21,0.45)] sm:h-20 sm:w-20 sm:text-sm"
          >
            SPIN
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[-19px] z-40 -translate-x-1/2"
        >
          <div className="relative flex h-12 w-9 items-start justify-center">
            <div className="absolute top-0 h-5 w-5 rounded-full border-2 border-yellow-100 bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
            <div className="mt-3 h-0 w-0 border-l-[16px] border-r-[16px] border-t-[29px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-[0_4px_3px_rgba(0,0,0,0.7)]" />
          </div>
        </div>
      </div>

      <p className="mt-7 text-xs font-medium tracking-wide text-gray-500">
        {hasSpunToday
          ? "YOUR DAILY SPIN IS COMPLETE"
          : "YOUR NEXT REWARD IS ONE SPIN AWAY"}
      </p>

      <button
        type="button"
        onClick={() => void handleDailySpin()}
        disabled={spinning || hasSpunToday}
        className="mt-4 w-full rounded-xl border border-emerald-200/30 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 px-5 py-4 font-extrabold text-black shadow-[0_5px_0_#047857,0_10px_25px_rgba(16,185,129,0.15)] transition hover:brightness-110 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        {spinning
          ? "Spinning..."
          : hasSpunToday
            ? "Come Back Tomorrow"
            : "SPIN NOW"}
      </button>

      {spinMessage && (
        <div
          aria-live="polite"
          className="mt-5 overflow-hidden rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.07] p-4"
        >
          <img
            src="/Neon%20Fox%20Victory%20Celebration.webp"
            alt="Kivnexo reward celebration mascot"
            width={130}
            height={130}
            loading="lazy"
            className="mx-auto h-24 w-24 object-contain sm:h-28 sm:w-28"
          />

          <p className="mt-2 text-lg font-extrabold text-emerald-300">
            {spinMessage.includes("Congratulations") ||
            spinMessage.includes("Today's spin reward")
              ? "Congratulations!"
              : spinMessage.includes("Better luck")
                ? "Better Luck Next Time!"
                : "Spin Wheel Update"}
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-300">
            {spinMessage}
          </p>
        </div>
      )}

      <p className="mt-5 text-xs text-gray-500">
        Rewards are verified securely by Kivnexo.
      </p>
    </div>
  </div>
)}


<section className="relative mt-8 overflow-hidden rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-[#071a12]/90 via-black/75 to-[#052e22]/80 p-5 shadow-xl backdrop-blur-md sm:p-8">
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl"
  />

  <div className="relative grid items-center gap-6 sm:grid-cols-[1fr_0.8fr] sm:gap-8">
    <div>
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-3xl">
        🎁
      </div>

      <h2 className="mt-4 text-2xl font-black sm:text-3xl">
        Daily <span className="text-emerald-400">Spin Wheel</span>
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-gray-300">
        Try your luck and win rewards in your Normal Wallet.
        One free spin every day.
      </p>

      <button
        type="button"
        onClick={() => setShowSpinPopup(true)}
        className="mt-6 w-full rounded-xl border border-emerald-200/30 bg-gradient-to-r from-emerald-400 to-green-500 px-5 py-4 font-extrabold text-black shadow-[0_4px_0_#047857] transition hover:brightness-110 active:translate-y-1 active:shadow-none sm:max-w-sm"
      >
        Spin Wheel →
      </button>
    </div>

    <div className="flex justify-center">
      <div className="relative w-full max-w-[230px]">
        <div className="absolute inset-3 rounded-full bg-emerald-400/20 blur-2xl" />

        <img
          src="/Neon%20Spin%20%26%20Win%20Mascot%20Celebration.webp"
          alt="Kivnexo Spin and Win mascot"
          width={300}
          height={300}
          loading="lazy"
          className="relative h-auto w-full object-contain drop-shadow-[0_0_25px_rgba(16,185,129,0.2)]"
        />
      </div>
    </div>
  </div>
</section>

{/* Sponsored Banner - Below Spin Wheel */}
<div className="mt-8 flex justify-center">
  <OfferwallBanner size="300x250" />
</div>

<div className="mt-8 grid gap-5 md:grid-cols-3">
        <button
  type="button"
  onClick={() => {
  window.location.href = "/earn";
}}
  className="rounded-2xl border border-white/20 bg-white/[0.08] backdrop-blur-sm p-6 text-left transition hover:border-green-400/40"
>
  <h3 className="font-semibold">Start Earning</h3>
  <p className="mt-2 text-sm text-gray-400">
    Choose Normal Tasks or Special Tasks.
  </p>
</button>
          <a
            href="#transactions"
            className="rounded-2xl border border-white/20 bg-white/[0.08] backdrop-blur-sm p-6 transition hover:border-green-400/40"
          >
            <h3 className="font-semibold">Transactions</h3>
            <p className="mt-2 text-sm text-gray-400">
              View your reward activity.
            </p>
          </a>

          
<a
  href="/withdraw"
  className="rounded-2xl border border-white/20 bg-white/[0.08] backdrop-blur-sm p-6 transition hover:border-green-400/40"
>
  <h3 className="font-semibold">Withdraw</h3>
  <p className="mt-2 text-sm text-gray-400">
    Withdraw your eligible rewards.
  </p>
</a>

        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.07] p-6">
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
      <section className="mt-8 overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-r from-emerald-950/50 to-black p-4 sm:p-6">
  <div className="flex items-center gap-4">
    <img
      src="/Winking%20Fox%20with%20Golden%20K%20Coin.webp"
      alt="Kivnexo mascot holding a golden coin"
      width={180}
      height={180}
      loading="lazy"
      className="h-28 w-28 shrink-0 object-contain sm:h-36 sm:w-36"
    />

    <div className="min-w-0">
      <p className="text-sm font-semibold text-emerald-400">
        Your Rewards Journey
      </p>

      <h2 className="mt-1 text-xl font-bold sm:text-2xl">
        Every Coin Counts!
      </h2>

      <p className="mt-2 text-sm leading-5 text-gray-400">
        Keep exploring eligible activities and track your rewards
        right here on Kivnexo.
      </p>
    </div>
  </div>
</section>
      <MobileBottomNav />
      <ReferralCoinsCard />
    </main>
  );
}
