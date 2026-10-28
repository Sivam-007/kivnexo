
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import OfferwallBanner from "@/components/OfferwallBanner";

type GuideMood = "welcome" | "email" | "password" | "peek" | "success";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [mood, setMood] = useState<GuideMood>("welcome");
  const [showPassword, setShowPassword] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const reactAs = (nextMood: GuideMood) => {
    setMood(nextMood);
    setAnimationKey((previous) => previous + 1);
  };

  const guideText: Record<GuideMood, string> = {
    welcome:
      "Hey there! Welcome to Kivnexo. Let's create your account together!",
    email:
      email.trim().length > 0
        ? "Nice! Make sure you use an email address you can access."
        : "Let's start with your email address. I'll guide you along the way!",
    password:
      password.length === 0
        ? "Let's create your password together!"
        : password.length < 6
          ? `Almost there! You need ${
              6 - password.length
            } more character${6 - password.length === 1 ? "" : "s"}.`
          : "Awesome! Your password meets the minimum length requirement.",
    peek: "Taking a peek? Check your password before continuing!",
    success:
      "Amazing! Your signup request is complete. Check your inbox for the verification email.",
  };

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setMessage("Please enter your email address.");
      setIsError(true);
      reactAs("email");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setIsError(true);
      reactAs("password");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: "https://kivnexo.vercel.app/dashboard",
        },
      });

      if (error) {
        setMessage(error.message);
        setIsError(true);
        reactAs("welcome");
        return;
      }

      setMessage(
        "Signup request submitted! Please check your email to verify your account."
      );
      setShowPassword(false);
      setPassword("");
      reactAs("success");
    } catch {
      setMessage("Something went wrong. Please try again.");
      setIsError(true);
      reactAs("welcome");
    } finally {
      setLoading(false);
    }
  };

  
const mascotImage =
  mood === "email"
    ? "/kivnexo-mascot-peek.png"
    : mood === "password" && !showPassword
      ? "/kivnexo-mascot-shy.png"
      : "/kivnexo-mascot.png";

const mascotMotion =
  mood === "success"
    ? "signup-mascot-success"
    : mood === "email"
      ? "signup-mascot-email"
      : mood === "password" && !showPassword
        ? "signup-mascot-shy"
        : mood === "peek"
          ? "signup-mascot-peek"
          : "signup-mascot-idle";


  const passwordHint =
    password.length === 0
      ? "Use at least 6 characters."
      : password.length < 6
        ? `${6 - password.length} more character${
            6 - password.length === 1 ? "" : "s"
          } needed.`
        : "Minimum length reached!";

  return (
    <main className="relative isolate min-h-screen overflow-x-clip bg-[#05080d] px-4 py-6 text-white sm:px-6 sm:py-8">
      {/* Background image */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
>
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('/kivnexo-home-bg.png')",
      opacity: 0.50,
    }}
  />
  <div className="absolute inset-0 bg-gradient-to-b from-[#05080d]/25 via-[#05080d]/45 to-[#05080d]/75" />
  <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-400/15 blur-[100px]" />
  <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-teal-400/10 blur-[100px]" />
</div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" aria-label="Kivnexo home">
          <img
            src="/kivnexo-logo.png"
            alt="Kivnexo"
             className="block h-auto max-h-10 w-auto max-w-[150px] object-contain sm:max-h-12 sm:max-w-[190px]"
          />
        </Link>

        <Link
          href="/login"
          className="rounded-full border border-white/15 bg-[#091018]/90 px-4 py-2 text-sm font-medium text-zinc-200 backdrop-blur-xl transition hover:border-emerald-300/50 hover:text-emerald-300"
        >
          Log in
        </Link>
      </header>

      {/* Main content */}
      <section className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-8 py-8 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-14">
        {/* Interactive character guide */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="relative w-full max-w-[230px] sm:max-w-[290px] lg:max-w-[350px]">
            <div
              aria-hidden="true"
              className="absolute inset-10 rounded-full bg-emerald-400/20 blur-3xl"
            />

            <img
              key={animationKey}
              src={mascotImage}
              alt="Your friendly Kivnexo guide"
              className={`relative mx-auto h-auto max-h-[250px] w-full object-contain drop-shadow-[0_0_32px_rgba(52,211,153,0.25)] sm:max-h-[320px] lg:max-h-[370px] ${mascotMotion}`}
            />
          </div>

          <div
            aria-live="polite"
            className="relative -mt-1 w-full max-w-md rounded-2xl border border-emerald-300/25 bg-[#07130f]/95 p-4 text-left shadow-[0_15px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-5"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/15 text-lg text-emerald-300 ${
                  mood === "success" ? "signup-guide-check" : ""
                }`}
              >
                {mood === "success" ? "✓" : "✦"}
              </div>

              <div>
                <p className="text-sm font-bold text-emerald-300">
                  {mood === "success"
                    ? "Mission accomplished!"
                    : "Your Kivnexo Guide"}
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-300">
                  {guideText[mood]}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 hidden text-xs text-zinc-400 lg:block">
            Explore tasks. Track rewards. Start your journey.
          </p>
        </div>

        {/* Signup form */}
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-5">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              JOIN KIVNEXO
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your journey
              <span className="block text-emerald-300">starts here.</span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
              Create your account and explore eligible tasks and reward
              opportunities.
            </p>
          </div>

          <form
            onSubmit={handleSignup}
            className="space-y-5 rounded-3xl border border-white/[0.13] bg-[#091018]/95 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7"
          >
            {/* Email field */}
            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Email address
              </label>

              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                
onFocus={() => reactAs("email")}
onChange={(event) => {
  setEmail(event.target.value);
  setMessage("");
  reactAs("email");
}}
placeholder="you@example.com"

                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3.5 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/70 focus:ring-4 focus:ring-emerald-300/10"
              />
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="signup-password"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onFocus={() =>
  reactAs(showPassword ? "peek" : "password")
}
                  onChange={(event) => {
  setPassword(event.target.value);
  setMessage("");
  reactAs(showPassword ? "peek" : "password");
}}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3.5 pr-20 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/70 focus:ring-4 focus:ring-emerald-300/10"
                />

                <button
                  type="button"
                  onClick={() => {
                    const next = !showPassword;
                    setShowPassword(next);
                    reactAs(next ? "peek" : "password");
                  }}
                  className="absolute inset-y-0 right-3 text-xs font-semibold text-emerald-300 transition hover:text-emerald-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p
                aria-live="polite"
                className={`mt-2 text-xs ${
                  password.length >= 6
                    ? "text-emerald-300"
                    : "text-zinc-400"
                }`}
              >
                {passwordHint}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-300 px-4 py-3.5 font-bold text-[#04100b] shadow-[0_8px_30px_rgba(52,211,153,0.16)] transition hover:-translate-y-0.5 hover:bg-emerald-200 hover:shadow-[0_8px_35px_rgba(52,211,153,0.28)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating your account..." : "Create account →"}
            </button>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className={`rounded-xl border p-3 text-sm leading-6 ${
                  isError
                    ? "border-red-400/25 bg-red-400/[0.08] text-red-200"
                    : "border-emerald-300/25 bg-emerald-300/[0.08] text-emerald-100"
                }`}
              >
                {message}
              </p>
            )}

            <p className="text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-emerald-300 transition hover:text-emerald-200"
              >
                Log in
              </Link>
            </p>

            <p className="text-center text-xs leading-5 text-zinc-500">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-zinc-300 underline underline-offset-4 hover:text-emerald-300"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-zinc-300 underline underline-offset-4 hover:text-emerald-300"
              >
                Privacy Policy
              </Link>.
            </p>
          </form>
        </div>
      </section>

      {/* Existing offerwall banner */}
      <div className="relative z-10 mx-auto mt-2 flex max-w-5xl justify-center">
        <OfferwallBanner size="300x250" />
      </div>
    </main>
  );
}
