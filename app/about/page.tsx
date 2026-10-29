
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Kivnexo",
  description:
    "Learn about Kivnexo, our mission, how the rewards platform works, and its founder, Balamurugan P.",
  alternates: {
    canonical: "https://kivnexo.vercel.app/about",
  },
};

const steps = [
  {
    number: "01",
    title: "Explore",
    description:
      "Browse the tasks, surveys, games and reward opportunities available on Kivnexo.",
  },
  {
    number: "02",
    title: "Participate",
    description:
      "Read each activity's instructions and complete its eligibility requirements.",
  },
  {
    number: "03",
    title: "Verification",
    description:
      "Eligible activities may require verification before a reward is credited.",
  },
  {
    number: "04",
    title: "Review rewards",
    description:
      "Check your account for available rewards and applicable redemption conditions.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#05080d] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-emerald-300"
          >
            Kivnexo
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:border-emerald-300/40"
          >
            Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
          About us
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
          Get to know <span className="text-emerald-300">Kivnexo.</span>
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-300 sm:text-lg">
          Kivnexo is an online rewards platform that brings eligible tasks,
          surveys, games and offer opportunities together in one place. Users
          can explore available activities, review their requirements and
          participate in opportunities that are suitable for them.
        </p>

        <div className="mt-10 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.05] p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Our mission</h2>
          <p className="mt-4 leading-8 text-zinc-300">
            Our goal is to make online reward opportunities easier to discover
            and understand. We aim to explain activity requirements, reward
            verification and redemption conditions so users can make informed
            decisions before participating.
          </p>
        </div>

        <section className="mt-16">
          <h2 className="text-3xl font-black">How Kivnexo works</h2>
          <p className="mt-4 leading-7 text-zinc-400">
            The availability of activities and rewards can vary. Completion
            does not guarantee a reward; applicable eligibility and verification
            requirements must be met.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-white/10 bg-[#0b151b] p-6"
              >
                <p className="text-sm font-bold tracking-widest text-emerald-300">
                  {step.number}
                </p>
                <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-zinc-300">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-[#0b151b] p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
            The founder
          </p>
          <h2 className="mt-4 text-3xl font-black">Balamurugan P.</h2>
          <p className="mt-2 font-medium text-zinc-400">
            Founder of Kivnexo
          </p>
          <p className="mt-5 leading-8 text-zinc-300">
            Kivnexo was founded by Balamurugan P. with the aim of bringing
            online task and reward opportunities together in an accessible
            platform. The platform continues to develop its features and user
            experience.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold">Transparency matters</h2>
          <p className="mt-4 leading-8 text-zinc-300">
            Activities, reward amounts, eligibility, verification and
            redemption conditions may differ. Please review the instructions
            for each activity and the applicable terms before participating.
            Never assume that a reward or withdrawal is guaranteed.
          </p>
        </section>

        <nav
          aria-label="Helpful links"
          className="mt-12 flex flex-wrap gap-5 border-t border-white/10 pt-6 text-sm font-semibold text-emerald-300"
        >
          <Link href="/earn" className="hover:text-emerald-200">
            Explore tasks
          </Link>
          <Link href="/contact" className="hover:text-emerald-200">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-emerald-200">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-emerald-200">
            Terms &amp; Conditions
          </Link>
        </nav>
      </section>

      <footer className="border-t border-white/10 px-5 py-6 text-center text-sm text-zinc-500">
        © 2026 Kivnexo. All rights reserved.
      </footer>
    </main>
  );
}
