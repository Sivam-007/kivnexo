import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in as an admin." },
        { status: 401 }
      );
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !admin) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase server environment variables.");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const adminClient = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: withdrawals, error } = await adminClient
      .from("withdrawal_requests")
      .select(`
        id,
        user_id,
        amount,
        wallet_type,
        withdrawal_method,
        status,
        upi_account_holder_name,
        upi_id,
        whatsapp_number,
        contact_email,
        payout_reference,
        admin_notes,
        created_at
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Withdrawal query failed:", error.message);
      return NextResponse.json(
        { error: "Unable to load withdrawal requests." },
        { status: 500 }
      );
    }

    const userIds = [
      ...new Set((withdrawals ?? []).map((item) => item.user_id)),
    ];

    const emailByUserId = new Map<string, string>();

    for (const userId of userIds) {
      const { data, error: userError } =
        await adminClient.auth.admin.getUserById(userId);

      if (userError) {
        console.error(
          "Withdrawal user email lookup failed:",
          userError.message
        );
        continue;
      }

      if (data.user.email) {
        emailByUserId.set(userId, data.user.email);
      }
    }

    return NextResponse.json({
      withdrawals: (withdrawals ?? []).map((item) => ({
        ...item,
        email: emailByUserId.get(item.user_id) ?? null,
      })),
    });
  } catch (error) {
    console.error("Withdrawal API error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}