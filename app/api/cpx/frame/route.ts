
import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: "Please log in." },
        { status: 401 }
      );
    }

    const secret = process.env.CPX_APP_SECRET;

    if (!secret) {
      console.error("CPX_APP_SECRET is missing.");
      return NextResponse.json(
        { error: "CPX configuration is incomplete." },
        { status: 500 }
      );
    }

    const secureHash = createHash("md5")
      .update(`${user.id}-${secret}`)
      .digest("hex");

    const params = new URLSearchParams({
      app_id: "37219",
      ext_user_id: user.id,
      secure_hash: secureHash,
      username:
        user.user_metadata?.username ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Kivnexo User",
      email: user.email || "",
    });

    return NextResponse.json({
      url: `https://offers.cpx-research.com/index.php?${params.toString()}`,
    });
  } catch (error) {
    console.error("CPX frame URL error:", error);
    return NextResponse.json(
      { error: "Unable to load surveys." },
      { status: 500 }
    );
  }
}
