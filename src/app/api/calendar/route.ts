import { NextRequest, NextResponse } from "next/server";
import { calendarServiceAPI } from "@/lib/services/calendar";

export const dynamic = "force-dynamic";

const jsonError = (err: unknown, status = 500) =>
  NextResponse.json({ error: err instanceof Error ? err.message : "Request failed" }, { status });

export async function GET(req: NextRequest) {
  try {
    const listingId = Number(req.nextUrl.searchParams.get("listingId"));
    const startDate = req.nextUrl.searchParams.get("startDate");
    const endDate = req.nextUrl.searchParams.get("endDate");
    if (!listingId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "listingId, startDate, and endDate are required" },
        { status: 400 },
      );
    }

    const [entries, bookings] = await Promise.all([
      calendarServiceAPI.fetchCalendarEntries(listingId, startDate, endDate),
      calendarServiceAPI.fetchBookingsForListing(listingId, startDate, endDate),
    ]);

    return NextResponse.json({ data: { entries, bookings } });
  } catch (err) {
    return jsonError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await calendarServiceAPI.upsertCalendarEntry(await req.json());
    return NextResponse.json({ data });
  } catch (err) {
    return jsonError(err);
  }
}
