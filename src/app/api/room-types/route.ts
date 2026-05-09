import { NextResponse } from "next/server";
import { HotelServiceApi } from "@/lib/services/hotel";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await HotelServiceApi.getUniqueRoomType();
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 500 },
    );
  }
}
