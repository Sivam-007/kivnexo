
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("Please log in to continue.", 401);
    }

    const { data: adminRecord, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !adminRecord) {
      return errorResponse("Admin access denied.", 403);
    }

    const email = new URL(request.url).searchParams
      .get("email")
      ?.trim()
      .toLowerCase();

    if (!email || email.length > 320 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse("Enter a valid user email.", 400);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing server-side Supabase configuration.");
      return errorResponse("Server configuration is incomplete.", 500);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    let recipientId: string | null = null;
    let recipientEmail: string | null = null;
    const pageSize = 1000;

    for (let page = 1; page <= 100; page++) {
      const { data, error } = await adminClient.auth.admin.listUsers({
        page,
        perPage: pageSize,
      });

      if (error) {
        console.error("User lookup failed:", error.message);
        return errorResponse("Unable to look up this user.", 500);
      }

      const recipient = data.users.find(
        (candidate) => candidate.email?.toLowerCase() === email
      );

      if (recipient) {
        recipientId = recipient.id;
        recipientEmail = recipient.email ?? email;
        break;
      }

      if (data.users.length < pageSize) break;
    }

    if (!recipientId) {
      return errorResponse("No registered user found with that email.", 404);
    }

    const [
      { data: wallet, error: walletError },
      { data: transactions, error: transactionsError },
      { data: spins, error: spinsError },
    ] = await Promise.all([
      adminClient
        .from("wallets")
        .select("normal_balance, special_balance, updated_at")
        .eq("user_id", recipientId)
        .maybeSingle(),

      adminClient
        .from("reward_transactions")
        .select(
          "wallet_type, amount, task_reference, source_type, verification_notes, created_at"
        )
        .eq("user_id", recipientId)
        .order("created_at", { ascending: false })
        .limit(50),

      adminClient
        .from("spin_wheel_spins")
        .select("spin_date, prize_slot, reward_amount, created_at")
        .eq("user_id", recipientId)
        .order("created_at", { ascending: false })
        .limit(30),
    ]);

    if (walletError || transactionsError || spinsError) {
      console.error("Wallet lookup failed:", {
        walletError: walletError?.message,
        transactionsError: transactionsError?.message,
        spinsError: spinsError?.message,
      });

      return errorResponse("Unable to load wallet records.", 500);
    }

    return NextResponse.json({
      user: {
        id: recipientId,
        email: recipientEmail,
      },
      wallet: wallet ?? {
        normal_balance: 0,
        special_balance: 0,
        updated_at: null,
      },
      transactions: transactions ?? [],
      spins: spins ?? [],
    });
  } catch (error) {
    console.error("Admin wallet viewer error:", error);
    return errorResponse("Unexpected server error.", 500);
  }
}
