import { NextRequest, NextResponse } from "next/server";
import { authApi } from "@/lib/services/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { action, phone, token } = await req.json();

    if (action === "send") {
      const { data, error } = await authApi.signInWithOtp(phone);
      if (error) throw error;
      return NextResponse.json({ data });
    }

    if (action === "verify") {
      const { data, error } = await authApi.verifyOtp(phone, token);
      if (error) throw error;
      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
