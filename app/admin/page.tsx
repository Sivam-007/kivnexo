import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

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

  const adminEmail = process.env.KIVNEXO_ADMIN_EMAIL;

  if (
    !adminEmail ||
    user.email?.toLowerCase() !== adminEmail.toLowerCase()
  ) {
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

        <div className="mt-8 rounded-xl border border-white/10 p-5">
          <h2 className="text-xl font-semibold">
            Reward Management
          </h2>

          <p className="mt-2 text-gray-400">
            Admin access verified. Reward controls will be added next.
          </p>
        </div>
      </div>
    </main>
  );
}