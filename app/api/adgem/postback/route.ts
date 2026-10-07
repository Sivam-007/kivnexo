import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Read the raw body first.
    // AdGem's signature is calculated from the exact raw request body.
    const rawBody = await request.text();

    const receivedSignature = request.headers.get("Signature") ?? "";
    const secret = process.env.ADGEM_POSTBACK_KEY;

    if (!secret) {
      console.error("ADGEM_POSTBACK_KEY is not configured");
      return new NextResponse(null, { status: 500 });
    }

    // Calculate HMAC-SHA256 using the AdGem postback key.
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    // Safely compare signatures.
    const expected = Buffer.from(expectedSignature, "utf8");
    const received = Buffer.from(receivedSignature, "utf8");

    const isValid =
      expected.length === received.length &&
      crypto.timingSafeEqual(expected, received);

    if (!isValid) {
      console.warn("Invalid AdGem postback signature");
      return new NextResponse(null, { status: 401 });
    }

    // Signature is valid, so now parse the JSON.
    const payload = JSON.parse(rawBody);

    const {
      request_id,
      timestamp,
      data,
    } = payload;

    console.log("Valid AdGem postback:", {
      request_id,
      timestamp,
      player_id: data?.player_id,
      amount: data?.amount,
      payout: data?.payout,
      conversion_id: data?.conversion_id,
      conversion_type: data?.conversion_type,
      offer_id: data?.offer_id,
      offer_name: data?.offer_name,
    });

    /*
      IMPORTANT:
      We are NOT crediting the user's wallet yet.

      The Kivnexo authentication + database + wallet transaction
      system still needs to be connected.

      After that is ready, this is where we will:
      1. Find the Kivnexo user using player_id
      2. Check conversion_id for duplicate processing
      3. Credit the correct reward
      4. Store the conversion
    */

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("AdGem postback error:", error);
    return new NextResponse(null, { status: 400 });
  }
}