
"use client";

import { useState } from "react";

type WalletData = {
  user: {
    id: string;
    email: string;
  };
  wallet: {
    normal_balance: number;
    special_balance: number;
    updated_at: string | null;
  };
  transactions: {
    wallet_type: string;
    amount: number;
    task_reference: string;
    source_type: string | null;
    verification_notes: string | null;
    created_at: string;
  }[];
  spins: {
    spin_date: string;
    prize_slot: number;
    reward_amount: number;
    created_at: string;
  }[];
};

export default function UsersWallets() {
  const [email, setEmail] = useState("");
  const [data, setData] = useState<WalletData | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function searchUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setData(null);

    try {
      const response = await fetch(
        `/api/admin/users-wallets?email=${encodeURIComponent(email.trim())}`,
        { cache: "no-store" }
      );
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Unable to load user.");
        return;
      }

      setData(result as WalletData);
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const money = (value: number) =>
    `₹${Number(value ?? 0).toFixed(2)}`;

  return (
    <section className="mt-8 rounded-xl border border-white/10 p-5">
      <h2 className="text-xl font-semibold">Users & Wallets</h2>
      <p className="mt-2 text-sm text-gray-400">
        Search a registered user to inspect wallet balances and rewards.
      </p>

      <form onSubmit={searchUser} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user's email"
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-gray-900 px-4 py-3 text-white outline-none focus:border-green-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-green-500 px-5 py-3 font-semibold text-black disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search User"}
        </button>
      </form>

      {message && (
        <p role="status" className="mt-4 rounded-lg bg-gray-900 p-3 text-sm text-gray-200">
          {message}
        </p>
      )}

      {data && (
        <div className="mt-6 space-y-6">
          <div className="rounded-lg border border-white/10 bg-gray-900 p-4">
            <p className="break-all font-medium">{data.user.email}</p>
            <p className="mt-1 break-all text-xs text-gray-500">
              User ID: {data.user.id}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-black p-4">
                <p className="text-sm text-gray-400">Normal Wallet</p>
                <p className="mt-1 text-2xl font-bold text-green-400">
                  {money(data.wallet.normal_balance)}
                </p>
              </div>
              <div className="rounded-lg bg-black p-4">
                <p className="text-sm text-gray-400">Special Wallet</p>
                <p className="mt-1 text-2xl font-bold text-yellow-400">
                  {money(data.wallet.special_balance)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Last wallet update: {data.wallet.updated_at
                ? new Date(data.wallet.updated_at).toLocaleString()
                : "No wallet record"}
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">
              Spin Wheel History ({data.spins.length})
            </h3>
            {data.spins.length === 0 ? (
              <p className="text-sm text-gray-400">No spin records found.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-900 text-gray-300">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Slot</th>
                      <th className="p-3">Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.spins.map((spin) => (
                      <tr key={`${spin.spin_date}-${spin.prize_slot}`} className="border-t border-white/10">
                        <td className="p-3 whitespace-nowrap">{spin.spin_date}</td>
                        <td className="p-3">{spin.prize_slot}</td>
                        <td className="p-3">{money(spin.reward_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 font-semibold">
              Reward Transactions ({data.transactions.length})
            </h3>
            {data.transactions.length === 0 ? (
              <p className="text-sm text-gray-400">No reward transactions found.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-900 text-gray-300">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Wallet</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Source / Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.map((tx, index) => (
                      <tr key={`${tx.task_reference}-${tx.created_at}-${index}`} className="border-t border-white/10">
                        <td className="p-3 whitespace-nowrap">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                        <td className="p-3">{tx.wallet_type}</td>
                        <td className="p-3 whitespace-nowrap">{money(tx.amount)}</td>
                        <td className="p-3">
                          <p className="break-all">{tx.source_type || "—"}</p>
                          <p className="break-all text-xs text-gray-500">{tx.task_reference}</p>
                          {tx.verification_notes && (
                            <p className="mt-1 text-xs text-gray-400">{tx.verification_notes}</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
