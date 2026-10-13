
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type ActionBody = {
  submissionId?: string;
  action?: "approved" | "rejected";
  rewardAmount?: number;
  adminNotes?: string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

    let body: ActionBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 }
      );
    }

    const { submissionId, action, rewardAmount, adminNotes } = body;

    if (
      typeof submissionId !== "string" ||
      !UUID_PATTERN.test(submissionId) ||
      !["approved", "rejected"].includes(action ?? "")
    ) {
      return NextResponse.json(
        { error: "Invalid submission ID or action." },
        { status: 400 }
      );
    }

    if (
      adminNotes !== undefined &&
      adminNotes !== null &&
      (typeof adminNotes !== "string" || adminNotes.length > 2000)
    ) {
      return NextResponse.json(
        { error: "Admin notes must be 2000 characters or fewer." },
        { status: 400 }
      );
    }

    if (
      action === "approved" &&
      (typeof rewardAmount !== "number" ||
        !Number.isFinite(rewardAmount) ||
        rewardAmount <= 0 ||
        rewardAmount > 100000 ||
        Math.round(rewardAmount * 100) !== rewardAmount * 100)
    ) {
      return NextResponse.json(
        { error: "Enter a valid reward amount with at most 2 decimals." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc(
      "admin_review_special_task",
      {
        p_submission_id: submissionId,
        p_action: action,
        p_reward_amount: action === "approved" ? rewardAmount : null,
        p_admin_notes: adminNotes ?? null,
      }
    );

    if (error) {
      console.error("Special task review failed:", error.message);

      const status = /authentication required|admin access denied/i.test(
        error.message
      )
        ? 403
        : /submission not found/i.test(error.message)
          ? 404
          : 400;

      return NextResponse.json(
        { error: error.message || "Unable to review submission." },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      submissionId,
      action,
      transactionId: data ?? null,
    });
  } catch (error) {
    console.error("Special task action API error:", error);

    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
