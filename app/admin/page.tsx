import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import RewardForm from "./RewardForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?next=%2Fadmin");
  }

  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminRecord) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-green-400">
          Kivnexo Admin Panel
        </h1>

        <p className="mt-3 text-gray-300">
          Welcome, {user.email}
        </p>

        <section className="mt-8 rounded-xl border border-white/10 p-5">
          <h2 className="text-xl font-semibold">
            Reward Management
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Credit verified rewards to a user wallet.
          </p>

          <RewardForm />
        </section>
      </div>
    </main>
  );
}