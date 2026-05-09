import { NextRequest, NextResponse } from "next/server";
import { HotelServiceApi } from "@/lib/services/hotel";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const locationId = req.nextUrl.searchParams.get("locationId");
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? 4);
    const data = locationId
      ? await HotelServiceApi.getHotelsByLocationId(Number(locationId), limit)
      : await HotelServiceApi.getHotels();
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
