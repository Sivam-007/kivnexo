
import { createHash, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function md5(value: string): string {
  return createHash("md5").update(value, "utf8").digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  if (!/^[a-fA-F0-9]{32}$/.test(a) ||
      !/^[a-fA-F0-9]{32}$/.test(b)) {
    return false;
  }

  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");

  return left.length === right.length &&
    timingSafeEqual(left, right);
}

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.OFFERWALL_PRIVATE_SECRET;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!secret || !supabaseUrl || !serviceRoleKey) {
      console.error("Offerwall postback environment is incomplete");
      return new NextResponse("Server configuration error", {
        status: 500,
      });
    }

    // Accept URL-encoded forms, multipart forms, or JSON.
    const fields = new Map<string, string>();

    request.nextUrl.searchParams.forEach((value, key) => {
      fields.set(key, value);
    });

    const contentType = request.headers.get("content-type") ?? "";

    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await request.formData();

      form.forEach((value, key) => {
        if (typeof value === "string") {
          fields.set(key, value);
        }
      });
    } else if (contentType.includes("application/json")) {
      const body: unknown = await request.json();

      if (body && typeof body === "object" && !Array.isArray(body)) {
        for (const [key, value] of Object.entries(body)) {
          if (typeof value === "string" || typeof value === "number") {
            fields.set(key, String(value));
          }
        }
      }
    }

    const subId = fields.get("subId") ?? "";
    const transId = fields.get("transId") ?? "";
    const rewardRaw = fields.get("reward") ?? "";
    const statusRaw = fields.get("status") ?? "";
    const signature = fields.get("signature") ?? "";
    const offerName = fields.get("offer_name") ?? "";
    const offerType = fields.get("offer_type") ?? "";

    // Validate required values before processing.
    if (
      !subId ||
      !isValidUuid(subId) ||
      !transId ||
      transId.length > 255 ||
      !/^(0|[1-9]\d{0,8})(\.\d{1,2})?$/.test(rewardRaw) ||
      !["1", "2"].includes(statusRaw)
    ) {
      return new NextResponse("Invalid parameters", { status: 400 });
    }

    // Offerwall.me signature:
    // MD5(subId + transId + reward + private secret)
    // Use the exact raw reward string received.
    const expectedSignature = md5(
      subId + transId + rewardRaw + secret
    );

    if (!safeEqualHex(signature, expectedSignature)) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const reward = Number(rewardRaw);

    if (!Number.isFinite(reward) || reward < 0 || reward > 1000000) {
      return new NextResponse("Invalid reward", { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase.rpc(
      "process_offerwall_postback",
      {
        p_trans_id: transId,
        p_user_id: subId,
        p_status: Number(statusRaw),
        p_reward: reward,
        p_offer_name: offerName.slice(0, 500),
        p_offer_type: offerType.slice(0, 100),
      }
    );

    if (error) {
      console.error("Offerwall processing failed:", error.message);
      return new NextResponse("Processing failed", { status: 500 });
    }

    console.info("Offerwall callback processed", {
      transId,
      result: data?.result ?? "processed",
    });

    // Acknowledge valid callbacks, including duplicates.
    return new NextResponse("ok", { status: 200 });
  } catch (error) {
    console.error(
      "Offerwall postback error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return new NextResponse("Internal server error", { status: 500 });
  }
}
