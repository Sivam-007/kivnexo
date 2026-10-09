import Link from "next/link";
const features = [
  {
    number: "01",
    title: "Create an account",
    description: "Join Kivnexo and create your rewards profile.",
  },
  {
    number: "02",
    title: "Complete tasks",
    description: "Choose eligible offers and complete them as instructed.",
  },
  {
    number: "03",
    title: "Earn rewards",
    description: "Verified completions are added to your rewards balance.",
  },
  {
    number: "04",
    title: "Withdraw",
    description: "Request your eligible balance when withdrawal is available.",
  },
];

const benefits = [
  "Simple and easy to use",
  "Transparent reward tracking",
  "Mobile-friendly experience",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center">
  <img
    src="/kivnexo-logo.png"
    alt="Kivnexo"
    className="h-10 w-auto"
  />
</a>

          <nav className="hidden items-center gap-8 text-sm text-zinc-400 sm:flex">
            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>
            <a href="#why-kivnexo" className="transition hover:text-white">
              Why Kivnexo
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              Login
            </a>
            <a
              href="/signup"
              className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300"
            >
              Sign up
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute left-1/2 top-0 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              A simple way to earn rewards
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.05em] sm:text-7xl">
              Complete tasks.
              <br />
              <span className="text-emerald-400">Earn rewards.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Kivnexo brings eligible offers and reward opportunities together
              in one simple platform. Complete tasks, track your progress, and
              earn from verified activities.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-400 px-6 text-sm font-bold text-black transition hover:bg-emerald-300"
              >
                Start earning
                <span className="ml-2">→</span>
              </a>

              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/[0.12] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
              >
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-white/[0.08] bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/[0.08] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-3 py-5 text-sm text-zinc-300 sm:justify-center"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-xs text-emerald-400">
                ✓
              </span>
              {benefit}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            Four simple steps.
          </h2>

          <p className="mt-4 text-zinc-400">
            Start with eligible tasks and follow the requirements carefully.
            Rewards are based on verified completions.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="bg-[#0b0f15] p-6 sm:p-7"
            >
              <span className="text-sm font-semibold text-emerald-400">
                {feature.number}
              </span>

              <h3 className="mt-8 text-lg font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Kivnexo */}
      <section
        id="why-kivnexo"
        className="border-y border-white/[0.08] bg-white/[0.02]"
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Why Kivnexo
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              Built to stay simple.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-zinc-400">
              No complicated process. Find an eligible opportunity, understand
              the requirements, complete it, and track your reward status.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0b0f15] p-7 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
              <span className="text-sm text-zinc-400">Your rewards</span>
              <span className="text-xs text-emerald-400">Kivnexo</span>
            </div>

            <div className="py-7">
              <p className="text-sm text-zinc-500">Available balance</p>
              <p className="mt-2 text-4xl font-bold tracking-tight">
                ₹0.00
              </p>
              <p className="mt-2 text-xs text-zinc-600">
                Your balance will appear here after verified activity.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="w-full rounded-lg bg-white/[0.06] py-3 text-sm font-semibold text-zinc-500"
            >
              Withdraw
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="mx-auto max-w-4xl px-5 py-24 sm:px-8 sm:py-32"
      >
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
            FAQ
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            Questions, answered.
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          <details className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
            <summary className="cursor-pointer list-none font-medium">
              What is Kivnexo?
            </summary>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Kivnexo is a rewards platform designed to bring eligible earning
              opportunities together in one place.
            </p>
          </details>

          <details className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
            <summary className="cursor-pointer list-none font-medium">
              How do I earn?
            </summary>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Available earning opportunities will be shown in your account.
              Each opportunity can have its own eligibility and completion
              requirements.
            </p>
          </details>

          <details className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
            <summary className="cursor-pointer list-none font-medium">
              When can I withdraw?
            </summary>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Withdrawal availability and minimums will be shown clearly in
              your account once the reward system is active.
            </p>
          </details>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-6 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            Ready to get started?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-400">
            Create your Kivnexo account and explore available opportunities.
          </p>

          <a
            href="/signup"
            className="mt-7 inline-flex h-11 items-center rounded-lg bg-emerald-400 px-6 text-sm font-bold text-black transition hover:bg-emerald-300"
          >
            Create free account
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <span className="font-semibold text-white">Kivnexo</span>
            <span className="ml-2">© 2026 Kivnexo. All rights reserved.</span>
          </div>

          <div className="flex gap-5">
            <Link href="/privacy" className="transition hover:text-white">
  Privacy
</Link>
            <Link href="/terms" className="transition hover:text-white">
  Terms
</Link>
            <Link href="/contact" className="transition hover:text-white">
  Contact
</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}