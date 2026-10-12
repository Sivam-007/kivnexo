
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Withdrawal = {
  id: string;
  user_id: string;
  email: string | null;
  amount: number;
  wallet_type: string;
  withdrawal_method: string;
  status: string;
  upi_account_holder_name: string | null;
  upi_id: string | null;
  whatsapp_number: string | null;
  contact_email: string | null;
  payout_reference: string | null;
  admin_notes: string | null;
  created_at: string;
};

const statusStyle: Record<string, string> = {
  pending: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
  approved: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  rejected: "border-red-500/40 bg-red-500/10 text-red-300",
  completed: "border-green-500/40 bg-green-500/10 text-green-300",
  processing: "border-purple-500/40 bg-purple-500/10 text-purple-300",
};

export default function Withdrawals() {
  const [items, setItems] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadWithdrawals = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/withdrawals", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to load withdrawal requests.");
        return;
      }

      setItems(result.withdrawals ?? []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWithdrawals();
  }, [loadWithdrawals]);

  const money = (value: number) =>
    `₹${Number(value ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        (item.email ?? "").toLowerCase().includes(query) ||
        (item.contact_email ?? "").toLowerCase().includes(query) ||
        (item.user_id ?? "").toLowerCase().includes(query) ||
        (item.upi_id ?? "").toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        item.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const pendingCount = items.filter(
    (item) => item.status.toLowerCase() === "pending"
  ).length;

  const totalRequested = items.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  return (
    <section className="mt-8 rounded-xl border border-white/10 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Withdrawal Management</h2>
          <p className="mt-2 text-sm text-gray-400">
            Search requests, check statuses and review payout details.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadWithdrawals()}
          disabled={loading}
          className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 p-4">
              <p className="text-sm text-gray-400">Total requests loaded</p>
              <p className="mt-1 text-2xl font-bold">{items.length}</p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <p className="text-sm text-gray-400">Pending requests</p>
              <p className="mt-1 text-2xl font-bold text-yellow-300">
                {pendingCount}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <p className="text-sm text-gray-400">
                Total requested (loaded)
              </p>
              <p className="mt-1 text-2xl font-bold text-green-400">
                {money(totalRequested)}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_200px]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search email, user ID, UPI ID or request ID"
              aria-label="Search withdrawal requests"
              className="w-full rounded-lg border border-white/15 bg-transparent px-3 py-3 text-sm outline-none focus:border-white/40"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by withdrawal status"
              className="rounded-lg border border-white/15 bg-gray-900 px-3 py-3 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="mt-5 rounded-lg bg-gray-900 p-5 text-center">
          <p className="font-medium">No withdrawal requests yet</p>
          <p className="mt-2 text-sm text-gray-400">
            New requests will appear here when users submit them.
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && filteredItems.length === 0 && (
        <div className="mt-5 rounded-lg bg-gray-900 p-5 text-center">
          <p className="font-medium">No matching requests</p>
          <p className="mt-2 text-sm text-gray-400">
            Try another search term or status.
          </p>
        </div>
      )}

      {filteredItems.length > 0 && (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-gray-400">
            Showing {filteredItems.length} of {items.length} loaded request(s).
            {" "}Latest 100 requests maximum.
          </p>

          {filteredItems.map((item) => {
            const status = item.status.toLowerCase();

            return (
              <article
                key={item.id}
                className="rounded-lg border border-white/10 bg-gray-900 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-bold text-green-400">
                      {money(item.amount)}
                    </p>
                    <p className="mt-1 text-sm break-all">
                      {item.email || item.contact_email || "Email unavailable"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Request ID: {item.id}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      User ID: {item.user_id}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      statusStyle[status] ??
                      "border-white/15 bg-white/5 text-gray-300"
                    }`}
                  >
                    {item.status || "Unknown"}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-gray-500">Wallet</p>
                    <p>{item.wallet_type || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Method</p>
                    <p>{item.withdrawal_method || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">UPI account holder</p>
                    <p>{item.upi_account_holder_name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">UPI ID</p>
                    <p className="break-all">{item.upi_id || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Contact email</p>
                    <p className="break-all">
                      {item.contact_email || item.email || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">WhatsApp</p>
                    <p>{item.whatsapp_number || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Requested at</p>
                    <p>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payout reference</p>
                    <p className="break-all">
                      {item.payout_reference || "—"}
                    </p>
                  </div>
                </div>

                {item.admin_notes && (
                  <p className="mt-3 text-sm text-gray-400">
                    Admin notes: {item.admin_notes}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
