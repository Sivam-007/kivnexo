
import Link from "next/link";
import OfferwallBanner from "@/components/OfferwallBanner";

const glass =
  "rounded-2xl border border-white/10 bg-[#0b151b]/90 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-300/30 hover:shadow-[0_12px_40px_rgba(16,185,129,0.10)]";

const categories = [
  {
    icon: "✦",
    title: "Tasks",
    desc: "Explore available activities",
    href: "/earn",
    color: "text-emerald-300",
  },
  {
    icon: "◎",
    title: "Surveys",
    desc: "Share your opinions",
    href: "/surveys",
    color: "text-cyan-300",
  },
  {
    icon: "▶",
    title: "Games",
    desc: "Discover exciting games",
    href: "/games",
    color: "text-violet-300",
  },
  {
    icon: "◈",
    title: "Offerwalls",
    desc: "Explore available offers",
    href: "/earn",
    color: "text-amber-300",
  },
];

const steps = [
  {
    number: "01",
    title: "Explore",
    desc: "Browse available tasks, surveys, games and offers.",
    icon: "✦",
  },
  {
    number: "02",
    title: "Participate",
    desc: "Read the requirements and complete eligible activities.",
    icon: "◈",
  },
  {
    number: "03",
    title: "Get verified",
    desc: "Allow time for eligible activity completion to be verified.",
    icon: "✓",
  },
  {
    number: "04",
    title: "Redeem",
    desc: "Review available rewards and redemption requirements.",
    icon: "◇",
  },
];

const faqs = [
  [
    "What is Kivnexo?",
    "Kivnexo brings eligible tasks, surveys, games and reward opportunities together in one platform.",
  ],
  [
    "How can I earn rewards?",
    "Explore the opportunities available to you, read the instructions and complete eligible activities. Rewards depend on verification and applicable conditions.",
  ],
  [
    "When can I withdraw?",
    "Withdrawal availability and minimum requirements depend on your account and the applicable reward rules. Check your account for current details.",
  ],
  [
    "Which redemption methods are available?",
    "UPI withdrawal requests and Google Play Gift Card redemption may be available subject to eligibility, verification and applicable terms.",
  ],
];

export default function Home() {
  return (
    
    <main className="relative isolate min-h-screen overflow-x-clip bg-[#05080d] text-white selection:bg-emerald-400/30">
            <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Kivnexo",
            url: "https://kivnexo.vercel.app/",
          }),
        }}
      />
      {/* Background stays behind all page content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
  style={{ backgroundImage: "url('/kivnexo-home-bg.png')" }}
/>

<div className="absolute inset-0 bg-gradient-to-b from-[#05080d]/25 via-[#05080d]/45 to-[#05080d]/75" />

        <div className="absolute -top-40 left-1/2 h-[420px] w-[min(90vw,700px)] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[120px]" />

        <div className="absolute left-0 top-[850px] h-[300px] w-[300px] rounded-full bg-cyan-400/[0.05] blur-[110px]" />

        <div className="absolute right-0 top-[1600px] h-[350px] w-[350px] rounded-full bg-emerald-400/[0.05] blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_0.7px,transparent_0.7px)] bg-[size:30px_30px] opacity-20" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/[0.08] bg-[#05080d]/95 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[68px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:min-h-[76px] sm:px-8">
          <Link
            href="/"
            aria-label="Kivnexo home"
            className="flex min-w-0 shrink items-center"
          >
            <img
              src="/kivnexo-logo.png"
              alt="Kivnexo"
              className="block h-auto max-h-10 w-auto max-w-[150px] object-contain sm:max-h-12 sm:max-w-[190px]"
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-5 whitespace-nowrap text-sm text-zinc-300 lg:flex xl:gap-7"
          >
            <a href="#how-it-works" className="transition hover:text-emerald-300">
              How it works
            </a>
            <Link href="/games" className="transition hover:text-emerald-300">
              Games
            </Link>
            <a href="#rewards" className="transition hover:text-emerald-300">
              Rewards
            </a>
            <a href="#faq" className="transition hover:text-emerald-300">
              FAQ
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <Link
              href="/login"
              className="inline-flex min-h-10 items-center justify-center rounded-xl px-2.5 text-sm text-zinc-200 transition hover:bg-white/5 sm:px-4"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-xl bg-emerald-400 px-3 text-xs font-extrabold text-[#04100b] shadow-[0_0_25px_rgba(52,211,153,0.16)] transition hover:bg-emerald-300 sm:px-5 sm:text-sm"
            >
              Join Now <span className="ml-1">↗</span>
            </Link>
          </div>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="flex items-center gap-6 overflow-x-auto border-t border-white/5 px-4 py-3 text-xs text-zinc-300 lg:hidden"
        >
          <a href="#how-it-works" className="shrink-0">
            How it works
          </a>
          <Link href="/games" className="shrink-0">
            Games
          </Link>
          <a href="#rewards" className="shrink-0">
            Rewards
          </a>
          <a href="#faq" className="shrink-0">
            FAQ
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-10 lg:py-20 xl:py-24">
          <div className="relative z-10 min-w-0">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/[0.08] px-3 py-2 text-[10px] font-bold tracking-wide text-emerald-200 sm:px-4 sm:text-xs">
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
              YOUR REWARDS ADVENTURE STARTS HERE
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl xl:text-7xl">
              Explore more.
              <br />
              Complete tasks.
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                Earn rewards.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-300 sm:mt-6 sm:text-base sm:leading-8 lg:text-lg">
              Discover tasks, surveys, games and eligible reward opportunities
              in one exciting place. Your next adventure starts with Kivnexo.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-300 px-6 py-3.5 text-sm font-extrabold text-[#04100b] shadow-[0_0_30px_rgba(52,211,153,0.18)] transition hover:-translate-y-0.5 hover:from-emerald-300 hover:to-emerald-200 sm:px-7"
              >
                Start your journey ↗
              </Link>

              <Link
                href="/games"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-6 py-3.5 text-sm font-bold transition hover:border-emerald-300/30 hover:bg-white/10"
              >
                <span className="text-emerald-300">▶</span>
                Explore games
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs text-zinc-300 sm:text-sm">
              <span>
                <span className="mr-2 text-emerald-400">✓</span>
                Easy to explore
              </span>
              <span>
                <span className="mr-2 text-emerald-400">✓</span>
                Multiple opportunities
              </span>
              <span>
                <span className="mr-2 text-emerald-400">✓</span>
                Mobile friendly
              </span>
            </div>
          </div>

          {/* Mascot illustration */}
          <div className="relative mx-auto w-full max-w-[470px] min-w-0">
            <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/15 blur-[80px] sm:h-[330px] sm:w-[330px] sm:blur-[100px]" />

            <div className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/15 sm:h-[300px] sm:w-[300px]" />

            <div className="absolute left-1/2 top-1/2 h-[165px] w-[165px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 sm:h-[245px] sm:w-[245px]" />

            <div className="relative z-10 flex min-h-[280px] items-center justify-center sm:min-h-[390px] lg:min-h-[440px]">
              <img
                src="/kivnexo-mascot.png"
                alt="Kivnexo mascot"
                className="kivnexo-float relative z-10 block h-auto max-h-[290px] w-full max-w-[330px] object-contain drop-shadow-[0_0_35px_rgba(16,255,166,0.22)] sm:max-h-[390px] sm:max-w-[410px] lg:max-h-[430px]"
              />

              <div className="absolute left-[2%] top-[18%] flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/25 bg-[#10221f] text-xl text-emerald-300 shadow-lg sm:h-12 sm:w-12">
                ✦
              </div>

              <div className="absolute right-[3%] top-[15%] flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/25 bg-[#0b1a20] text-lg text-cyan-200 shadow-lg sm:h-12 sm:w-12">
                ◈
              </div>

              <div className="absolute bottom-[10%] right-0 rounded-xl border border-emerald-300/20 bg-[#0b1717] px-3 py-2.5 shadow-xl sm:px-4 sm:py-3">
                <p className="text-[10px] font-bold text-emerald-300 sm:text-xs">
                  KIVNEXO
                </p>
                <p className="mt-1 text-xs font-bold sm:text-sm">
                  Let&apos;s explore!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* How it works */}
      <section
        id="how-it-works"
        className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24"
      >
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
          THE PROCESS
        </p>

        <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
          Four steps. <span className="text-zinc-400">One journey.</span>
        </h2>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
          Explore available opportunities, understand the requirements and
          follow the applicable reward process.
        </p>

        <div className="mt-9 grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className={`${glass} min-w-0 p-5 sm:p-6`}>
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/[0.08] text-xl text-emerald-300">
                  {step.icon}
                </span>
                <span className="text-sm font-bold tracking-widest text-zinc-500">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-bold">{step.title}</h3>

              <p className="mt-3 text-sm leading-7 text-zinc-300">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Existing offerwall integration */}
      <section className="relative z-10 border-y border-white/[0.08] bg-[#05080d]/75">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-2 sm:p-4">
            <div className="mx-auto w-full max-w-full overflow-x-auto">
              <OfferwallBanner size="728x90" />
            </div>
          </div>
        </div>
      </section>

      {/* Rewards and redemption */}
      <section
        id="rewards"
        className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
            REWARDS &amp; REDEMPTION
          </p>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
            Rewards with clarity.
          </h2>

          <p className="mt-5 text-sm leading-7 text-zinc-300 sm:text-base">
            Explore redemption methods available on Kivnexo. Requests are
            subject to eligibility and verification.
          </p>
        </div>

        <div className="mx-auto mt-9 grid w-full max-w-3xl grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2">
          <div className={`${glass} min-w-0 p-5 sm:p-7`}>
            <div className="flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-white p-4">
              <img
                src="/upi-logo.png"
                alt="UPI"
                className="block max-h-16 max-w-full object-contain"
              />
            </div>

            <h3 className="mt-6 text-lg font-bold">UPI Withdrawal</h3>

            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Request an eligible payout to your UPI ID, subject to account
              verification and withdrawal conditions.
            </p>
          </div>

          <div className={`${glass} min-w-0 p-5 sm:p-7`}>
            <div className="flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-white p-4">
              <img
                src="/google-play-gift-card.png"
                alt="Google Play Gift Card"
                className="block max-h-16 max-w-full object-contain"
              />
            </div>

            <h3 className="mt-6 text-lg font-bold">
              Google Play Gift Card
            </h3>

            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Request eligible gift card redemption, subject to verification
              and gift card terms.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-6 text-zinc-400">
          Availability and processing conditions may vary. Check your account
          for current details.
        </p>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="relative z-10 scroll-mt-28 border-y border-white/[0.08] bg-[#05080d]/75"
      >
        <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
              FAQ
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
              Questions, answered.
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-300">
              The essentials to help you get started.
            </p>
          </div>

          <div className="mt-9 space-y-3 sm:mt-12">
            {faqs.map(([question, answer], index) => (
              <details
                key={question}
                className={`${glass} p-5 sm:p-6`}
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  <span>{question}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-lg text-emerald-300">
                    +
                  </span>
                </summary>

                <p className="mt-4 border-t border-white/[0.08] pt-4 text-sm leading-7 text-zinc-300">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-300/20 bg-gradient-to-br from-emerald-300/10 via-[#0b1518]/95 to-cyan-300/[0.06] p-6 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-[90px]" />

          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
              YOUR NEXT STEP
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
              Ready to explore Kivnexo?
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
              Create your account and discover eligible opportunities on
              Kivnexo.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-extrabold text-[#04100b] transition hover:bg-emerald-300"
              >
                Create an account ↗
              </Link>

              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold transition hover:bg-white/[0.08]"
              >
                Member login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#05080d]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <Link href="/" aria-label="Kivnexo home" className="inline-flex">
              <img
                src="/kivnexo-logo.png"
                alt="Kivnexo"
                className="block h-auto max-h-9 w-auto max-w-[150px] object-contain"
              />
            </Link>

            <p className="mt-3 max-w-sm text-xs leading-6 text-zinc-400">
              Discover opportunities. Complete eligible activities. Explore
              your rewards journey.
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              © 2026 Kivnexo. All rights reserved.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-zinc-300"
          >
            <Link href="/privacy" className="hover:text-emerald-300">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-emerald-300">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-emerald-300">
              Contact
            </Link>
            <Link href="/games" className="hover:text-emerald-300">
              Games
            </Link>
            <Link href="/login" className="hover:text-emerald-300">
              Login
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
