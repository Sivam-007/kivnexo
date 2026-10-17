
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function response(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

function validHash(
  transId: string,
  suppliedHash: string,
  secret: string
): boolean {
  const expected = createHash("md5")
    .update(`${transId}-${secret}`)
    .digest("hex");

  if (!/^[a-fA-F0-9]{32}$/.test(suppliedHash)) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected, "hex");
  const suppliedBuffer = Buffer.from(suppliedHash, "hex");

  return (
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer)
  );
}

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;

    const transId = params.get("trans_id")?.trim() ?? "";
    const userId = params.get("user_id")?.trim() ?? "";
    const statusText = params.get("status") ?? "";
    const eventType = params.get("type")?.trim().toLowerCase() ?? "";
    const amountLocalText = params.get("amount_local") ?? "";
    const amountUsdText = params.get("amount_usd") ?? "";
    const suppliedHash = params.get("hash") ?? "";

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (
      !transId ||
      transId.length > 200 ||
      !uuidPattern.test(userId) ||
      !["1", "2"].includes(statusText) ||
      !["complete", "out", "bonus"].includes(eventType)
    ) {
      return response("Invalid callback parameters.", 400);
    }

    const amountLocal = Number(amountLocalText);
    const amountUsd = Number(amountUsdText);

    if (
      amountLocalText.trim() === "" ||
      amountUsdText.trim() === "" ||
      !Number.isFinite(amountLocal) ||
      !Number.isFinite(amountUsd) ||
      amountLocal < 0 ||
      amountUsd < 0 ||
      amountLocal > 100000 ||
      amountUsd > 100000
    ) {
      return response("Invalid reward amount.", 400);
    }

    const secret = process.env.CPX_APP_SECRET;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!secret || !supabaseUrl || !serviceRoleKey) {
      console.error("CPX server configuration is incomplete.");
      return response("Server configuration error.", 500);
    }

    if (!validHash(transId, suppliedHash, secret)) {
      return response("Invalid signature.", 401);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase.rpc(
      "process_cpx_postback_v2",
      {
        p_trans_id: transId,
        p_user_id: userId,
        p_status: Number(statusText),
        p_event_type: eventType,
        p_amount_local: amountLocal,
        p_amount_usd: amountUsd,
      }
    );

    if (error) {
      console.error("CPX database processing failed:", error.message);
      return response("Unable to process callback.", 500);
    }

    const result = data as string;

    const acceptedResults = [
      "credited",
      "duplicate",
      "already_reversed",
      "reversed",
      "recorded_no_credit",
      "unknown_reversal",
      "recovered_pending",
    ];

    if (!acceptedResults.includes(result)) {
      console.error("Unexpected CPX database result:", result);
      return response("Unexpected processing result.", 500);
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("CPX postback error:", error);
    return response("Unexpected server error.", 500);
  }
}
