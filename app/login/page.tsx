"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/kivnexo-logo.png"
            alt="Kivnexo"
            className="mx-auto h-12 w-auto"
          />

          <h1 className="mt-8 text-3xl font-bold">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Login to continue earning rewards.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6"
        >
          <div>
            <label htmlFor="email" className="mb-2 block text-sm">
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-green-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm">
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-green-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-400 px-4 py-3 font-semibold text-black disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-gray-300">
              {message}
            </p>
          )}

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <a href="/signup" className="text-green-400">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}