
"use client";

import { useEffect, useState } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function SurveysPage() {
  const [surveyUrl, setSurveyUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSurveyUrl() {
      try {
        const response = await fetch("/api/cpx/frame", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href =
              "/login?next=%2Fsurveys";
            return;
          }

          throw new Error(data.error || "Unable to load surveys.");
        }

        if (active) {
          setSurveyUrl(data.url);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load surveys. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSurveyUrl();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <a
          href="/dashboard"
          className="text-sm text-green-400 hover:text-green-300"
        >
          ← Back to Dashboard
        </a>

        <h1 className="mt-6 text-3xl font-bold">
          CPX Research Surveys
        </h1>

        <p className="mt-2 text-gray-400">
          Complete eligible surveys to earn rewards.
        </p>

        <div className="mt-6 min-h-[600px] overflow-hidden rounded-2xl border border-white/10 bg-white">
          {loading ? (
            <p className="p-6 text-black">
              Loading surveys...
            </p>
          ) : error ? (
            <div className="p-6 text-black">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-green-500 px-4 py-2 font-semibold text-black"
              >
                Try Again
              </button>
            </div>
          ) : surveyUrl ? (
            <iframe
              title="CPX Research Survey Wall"
              src={surveyUrl}
              width="100%"
              height="2000"
              style={{ border: 0 }}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="clipboard-write"
            />
          ) : (
            <p className="p-6 text-black">
              No survey URL available.
            </p>
          )}
        </div>
      </div>
      <MobileBottomNav />
    </main>
  );
}
