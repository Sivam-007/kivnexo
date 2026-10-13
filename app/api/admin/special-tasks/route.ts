
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

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const adminClient = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await adminClient
      .from("special_task_submissions")
      .select(
        "id,user_id,task_type,mobile_first_two,mobile_last_two,proof_details,proof_url,status,reward_amount,admin_notes,reviewed_at,created_at"
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Special task list failed:", error.message);
      return NextResponse.json(
        { error: "Unable to load special task submissions." },
        { status: 500 }
      );
    }

    return NextResponse.json({ submissions: data ?? [] });
  } catch (error) {
    console.error("Special task API error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
