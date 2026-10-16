
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    // Verify the logged-in user from their Supabase session.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in to submit a withdrawal request." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const method = body.method;
    const walletType = body.walletType;
    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const amount = Number(body.amount);

    const upiId =
      typeof body.upiId === "string" ? body.upiId.trim() : null;
    const whatsappNumber =
      typeof body.whatsappNumber === "string"
        ? body.whatsappNumber.trim()
        : null;
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : null;

    if (
      !["upi", "giftcard"].includes(method) ||
      !["normal", "special"].includes(walletType) ||
      !fullName ||
      fullName.length > 120 ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      Math.round(amount * 100) !== amount * 100
    ) {
      return NextResponse.json(
        { error: "Please check your withdrawal details." },
        { status: 400 }
      );
    }

    if (
      (method === "upi" &&
        (!upiId ||
          upiId.length > 200 ||
          whatsappNumber ||
          email)) ||
      (method === "giftcard" &&
        (upiId ||
          !whatsappNumber ||
          whatsappNumber.length > 30 ||
          !email ||
          email.length > 254))
    ) {
      return NextResponse.json(
        { error: "Please provide valid details for the selected method." },
        { status: 400 }
      );
    }

    
const idempotencyKey = crypto.randomUUID();

const {
  data: requestId,
  error: submitError,
} = await supabase.rpc("submit_withdrawal_request", {
  p_idempotency_key: idempotencyKey,
  p_wallet_type: walletType,
  p_method: method === "giftcard" ? "google_play_gift_card" : "upi",
  p_full_name: fullName,
  p_amount: amount,
  p_upi_id: method === "upi" ? upiId : null,
  p_whatsapp_number: method === "giftcard" ? whatsappNumber : null,
  p_contact_email: method === "giftcard" ? email : null,
});


    if (submitError) {
      console.error("Withdrawal submission failed:", submitError);

      return NextResponse.json(
        {
          error:
            submitError.message.includes("Insufficient available wallet balance")
              ? "Your available wallet balance is insufficient for this request."
              : submitError.message.includes("Wallet not found")
                ? "Your wallet could not be found. Please contact support."
                : "We couldn't submit your request. Please check your details and try again.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        requestId,
        status: "pending",
        message:
          "Your withdrawal request has been submitted for manual verification.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Withdrawal API error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
