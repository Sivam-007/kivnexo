import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type ActionBody = {
  requestId?: string;
  action?: "approve" | "reject" | "complete";
  adminNotes?: string;
  giftCardCode?: string;
  payoutReference?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in as an admin." },
        { status: 401 },
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
        { status: 403 },
      );
    }

    let body: ActionBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 },
      );
    }

    const { requestId, action, adminNotes, giftCardCode, payoutReference } =
      body;

    if (
      typeof requestId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        requestId,
      ) ||
      !["approve", "reject", "complete"].includes(action ?? "")
    ) {
      return NextResponse.json(
        { error: "Invalid withdrawal request or action." },
        { status: 400 },
      );
    }

    if (
      (adminNotes !== undefined &&
        adminNotes !== null &&
        typeof adminNotes !== "string") ||
      (giftCardCode !== undefined &&
        giftCardCode !== null &&
        typeof giftCardCode !== "string") ||
      (payoutReference !== undefined &&
        payoutReference !== null &&
        typeof payoutReference !== "string")
    ) {
      return NextResponse.json(
        { error: "Invalid action details." },
        { status: 400 },
      );
    }

    if (
      (adminNotes?.length ?? 0) > 2000 ||
      (giftCardCode?.length ?? 0) > 200 ||
      (payoutReference?.length ?? 0) > 200
    ) {
      return NextResponse.json(
        { error: "Action details exceed the allowed length." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase.rpc("admin_review_withdrawal", {
      p_request_id: requestId,
      p_action: action,
      p_admin_notes: adminNotes ?? null,
      p_gift_card_code: giftCardCode ?? null,
      p_payout_reference: payoutReference ?? null,
    });

    if (error) {
      const message = error.message || "Unable to process withdrawal.";

      const status = /login required|admin access required/i.test(message)
        ? 403
        : /not found/i.test(message)
          ? 404
          : 400;

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json({
      success: true,
      requestId: data,
      action,
    });
  } catch (error) {
    console.error("Withdrawal action API error:", error);

    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 },
    );
  }
}
