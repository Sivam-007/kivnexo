
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
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

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body.", 400);
    }

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const walletType = body.walletType;
    const amount = body.amount;

    const taskReference =
      typeof body.taskReference === "string"
        ? body.taskReference.trim()
        : "";

    const verificationNotes =
      typeof body.verificationNotes === "string"
        ? body.verificationNotes.trim()
        : null;

    if (
      !email ||
      email.length > 320 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return errorResponse("Enter a valid user email.", 400);
    }

    if (walletType !== "normal" && walletType !== "special") {
      return errorResponse("Invalid wallet type.", 400);
    }

    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 100000 ||
      Math.round(amount * 100) !== amount * 100
    ) {
      return errorResponse(
        "Enter a valid amount with at most 2 decimal places.",
        400
      );
    }

    if (
      !taskReference ||
      taskReference.length > 200 ||
      (verificationNotes !== null &&
        (typeof verificationNotes !== "string" ||
          verificationNotes.length > 2000))
    ) {
      return errorResponse(
        "Check the task reference and verification notes.",
        400
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Required server-side Supabase environment variables are missing.");
      return errorResponse("Server configuration is incomplete.", 500);
    }

    // Server-only client: used only to look up the recipient.
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    let recipientId: string | null = null;
    const pageSize = 1000;

    for (let page = 1; page <= 100; page++) {
      const { data, error } = await adminClient.auth.admin.listUsers({
        page,
        perPage: pageSize,
      });

      if (error) {
        console.error("Recipient lookup failed:", error.message);
        return errorResponse("Unable to look up the recipient.", 500);
      }

      const recipient = data.users.find(
        (candidate) =>
          candidate.email?.toLowerCase() === email
      );

      if (recipient) {
        recipientId = recipient.id;
        break;
      }

      if (data.users.length < pageSize) {
        break;
      }
    }

    if (!recipientId) {
      return errorResponse("No registered user found with that email.", 404);
    }

    // Use the authenticated user's session client for the RPC.
    // This preserves auth.uid() for the database admin check.
    const { data: transactionId, error: creditError } = await supabase.rpc(
      "admin_credit_reward",
      {
        p_user_id: recipientId,
        p_wallet_type: walletType,
        p_amount: amount,
        p_task_reference: taskReference,
        p_verification_notes: verificationNotes || null,
      }
    );

    if (creditError) {
      if (
        creditError.code === "23505" ||
        creditError.message.toLowerCase().includes("duplicate key")
      ) {
        return errorResponse(
          "This task reference has already been credited to this user. Check the transaction history.",
          409
        );
      }

      if (
        creditError.message.includes("Admin access denied") ||
        creditError.message.includes("Authentication required")
      ) {
        return errorResponse("Admin access denied.", 403);
      }

      if (creditError.message.includes("User not found")) {
        return errorResponse("Registered user not found.", 404);
      }

      if (
        creditError.message.includes("Invalid") ||
        creditError.message.includes("required")
      ) {
        return errorResponse(creditError.message, 400);
      }

      console.error("Reward credit failed:", creditError.message);
      return errorResponse("Reward could not be credited.", 500);
    }

    return NextResponse.json({
      success: true,
      transactionId,
      message: "Reward credited successfully.",
    });
  } catch (error) {
    console.error("Reward API error:", error);
    return errorResponse("Unexpected server error. Please try again.", 500);
  }
}
