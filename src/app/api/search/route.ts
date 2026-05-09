import { NextRequest, NextResponse } from "next/server";
import { HotelServiceApi } from "@/lib/services/hotel";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filters, page = 0, pageSize = 10 } = body;
    console.log("[/api/search] Received filters:", JSON.stringify(filters, null, 2));
    const data = await HotelServiceApi.filterHotels(filters, page, pageSize);
    console.log("[/api/search] Result count:", data?.length ?? 0);
    if (data?.length > 0) console.log("[/api/search] Sample row:", JSON.stringify(data[0], null, 2).slice(0, 500));
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("[/api/search] Error:", err.message, err.details ?? "");
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
