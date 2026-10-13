
"use client";

import { useCallback, useEffect, useState } from "react";

type Submission = {
  id: string;
  user_id: string;
  task_type: string;
  mobile_first_two: string;
  mobile_last_two: string;
  proof_details: string;
  proof_url: string | null;
  status: "pending" | "approved" | "rejected";
  reward_amount: number | null;
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export default function SpecialTasks() {
  const [items, setItems] = useState<Submission[]>([]);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/special-tasks", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load submissions.");
      }

      setItems(result.submissions ?? []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load submissions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  async function review(item: Submission, action: "approved" | "rejected") {
    if (item.status !== "pending") return;

    const amount = Number(amounts[item.id]);

    if (
      action === "approved" &&
      (!Number.isFinite(amount) ||
        amount <= 0 ||
        amount > 100000 ||
        Math.round(amount * 100) !== amount * 100)
    ) {
      setErrorMessage("Enter a valid reward amount before approving.");
      return;
    }

    const confirmed = window.confirm(
      action === "approved"
        ? `Approve this referral and credit ₹${amount.toFixed(2)} to the user's Special Wallet?`
        : "Reject this referral submission?"
    );

    if (!confirmed) return;

    setBusyId(item.id);
    setMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/special-task-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: item.id,
          action,
          rewardAmount: action === "approved" ? amount : undefined,
          adminNotes: notes[item.id] || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to review submission.");
      }

      setMessage(
        action === "approved"
          ? "Approved. Special Wallet reward credited successfully."
          : "Submission rejected."
      );

      await loadSubmissions();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to review submission."
      );
    } finally {
      setBusyId(null);
    }
  }

  const visibleItems = items.filter(
    (item) => filter === "all" || item.status === filter
  );

  return (
    <section className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-green-400">
            Special Task Reviews
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Verify Paytm referral evidence before approving any reward.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadSubmissions()}
          disabled={loading}
          className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["pending", "approved", "rejected", "all"].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-lg px-3 py-2 text-sm capitalize ${
              filter === value
                ? "bg-green-500 text-black"
                : "border border-white/15 text-gray-300"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {message && (
        <p className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
          {message}
        </p>
      )}

      {errorMessage && (
        <p role="alert" className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      {loading ? (
        <p className="mt-5 text-sm text-gray-400">Loading submissions...</p>
      ) : visibleItems.length === 0 ? (
        <p className="mt-5 text-sm text-gray-400">
          No {filter === "all" ? "" : `${filter} `}submissions found.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {visibleItems.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-white/10 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">Paytm Referral</p>
                  <p className="mt-1 break-all text-xs text-gray-500">
                    Submission: {item.id}
                  </p>
                  <p className="break-all text-xs text-gray-500">
                    User: {item.user_id}
                  </p>
                  <p className="mt-2 text-sm text-gray-300">
                    Masked mobile: {item.mobile_first_two}xxxxxx
                    {item.mobile_last_two}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Submitted: {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs capitalize ${
                    item.status === "approved"
                      ? "bg-green-500/15 text-green-300"
                      : item.status === "rejected"
                        ? "bg-red-500/15 text-red-300"
                        : "bg-yellow-500/15 text-yellow-300"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-4 rounded-lg bg-black/40 p-3">
                <p className="text-xs font-semibold uppercase text-gray-400">
                  Proof details
                </p>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-200">
                  {item.proof_details}
                </p>

                {item.proof_url && (
                  <a
                    href={item.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block break-all text-sm text-green-400 underline"
                  >
                    Open submitted proof
                  </a>
                )}
              </div>

              {item.status === "pending" ? (
                <div className="mt-4 space-y-3">
                  <div>
                    <label
                      htmlFor={`amount-${item.id}`}
                      className="mb-1 block text-sm text-gray-300"
                    >
                      Reward amount (₹)
                    </label>
                    <input
                      id={`amount-${item.id}`}
                      type="number"
                      min="0.01"
                      max="100000"
                      step="0.01"
                      value={amounts[item.id] ?? ""}
                      onChange={(event) =>
                        setAmounts((previous) => ({
                          ...previous,
                          [item.id]: event.target.value,
                        }))
                      }
                      placeholder="Enter verified reward"
                      className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`notes-${item.id}`}
                      className="mb-1 block text-sm text-gray-300"
                    >
                      Admin verification notes
                    </label>
                    <textarea
                      id={`notes-${item.id}`}
                      maxLength={2000}
                      value={notes[item.id] ?? ""}
                      onChange={(event) =>
                        setNotes((previous) => ({
                          ...previous,
                          [item.id]: event.target.value,
                        }))
                      }
                      placeholder="Record how you verified the referral"
                      className="min-h-20 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-white"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void review(item, "approved")}
                      disabled={busyId !== null}
                      className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-black disabled:opacity-50"
                    >
                      {busyId === item.id ? "Processing..." : "Approve & Credit"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void review(item, "rejected")}
                      disabled={busyId !== null}
                      className="rounded-lg border border-red-500/40 px-4 py-2 text-red-300 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-400">
                  {item.reward_amount !== null && (
                    <p>Reward recorded: ₹{Number(item.reward_amount).toFixed(2)}</p>
                  )}
                  {item.admin_notes && <p>Admin notes: {item.admin_notes}</p>}
                  {item.reviewed_at && (
                    <p>Reviewed: {new Date(item.reviewed_at).toLocaleString()}</p>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
