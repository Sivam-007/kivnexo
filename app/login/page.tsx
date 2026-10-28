
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import OfferwallBanner from "@/components/OfferwallBanner";

type GuideMood = "welcome" | "email" | "password" | "peek" | "success";

export default function LoginPage() {
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
      "Welcome back! I've been waiting for you. Let's get you signed in!",
    email:
      email.trim().length > 0
        ? "Hey, checking your email? Make sure it's the one you registered with!"
        : "Enter the email address you used to join Kivnexo.",
    password:
      password.length > 0
        ? "Your secret is safe! Enter your password to continue."
        : "Password time! I'll cover my eyes while you type.",
    peek: "Want to check your password? Go ahead, take a peek!",
    success: "You're in! Taking you to your Kivnexo dashboard...",
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

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(
          error.message === "Invalid login credentials"
            ? "Email or password is incorrect. Please try again."
            : error.message
        );
        setIsError(true);
        reactAs("welcome");
        return;
      }

      setMessage("Login successful! Opening your dashboard...");
      reactAs("success");

      window.location.href = "/dashboard";
    } catch {
      setMessage("Something went wrong. Please try again.");
      setIsError(true);
      reactAs("welcome");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-x-clip bg-[#05080d] px-4 py-6 text-white sm:px-6 sm:py-8">
      {/* Shared Kivnexo background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/kivnexo-home-bg.png')",
            opacity: 0.5,
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
          href="/signup"
          className="rounded-full border border-white/15 bg-[#091018]/90 px-4 py-2 text-sm font-medium text-zinc-200 backdrop-blur-xl transition hover:border-emerald-300/50 hover:text-emerald-300"
        >
          Create account
        </Link>
      </header>

      {/* Login layout */}
      <section className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-8 py-8 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-14">
        {/* Interactive mascot */}
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
                  {mood === "success" ? "Welcome back!" : "Kivnexo Guide"}
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-300">
                  {guideText[mood]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login form */}
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-5">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              WELCOME BACK
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Good to see
              <span className="block text-emerald-300">you again.</span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
              Log in to access your Kivnexo account and continue your journey.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5 rounded-3xl border border-white/[0.13] bg-[#091018]/95 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Email address
              </label>

              <input
                id="login-email"
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

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onFocus={() =>
                    reactAs(showPassword ? "peek" : "password")
                  }
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setMessage("");
                    reactAs(showPassword ? "peek" : "password");
                  }}
                  placeholder="Enter your password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-300 px-4 py-3.5 font-bold text-[#04100b] shadow-[0_8px_30px_rgba(52,211,153,0.16)] transition hover:-translate-y-0.5 hover:bg-emerald-200 hover:shadow-[0_8px_35px_rgba(52,211,153,0.28)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login to Kivnexo →"}
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
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-emerald-300 transition hover:text-emerald-200"
              >
                Sign up
              </Link>
            </p>

            <p className="text-center text-xs text-zinc-500">
              Your account, your tasks, your Kivnexo journey.
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
