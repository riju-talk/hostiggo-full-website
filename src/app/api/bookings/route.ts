import { NextRequest, NextResponse } from "next/server";
import { bookingsAPI } from "@/lib/services/bookings";

export const dynamic = "force-dynamic";

const jsonError = (err: unknown, status = 500) =>
  NextResponse.json({ error: err instanceof Error ? err.message : "Request failed" }, { status });

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const role = req.nextUrl.searchParams.get("role") ?? "host";
    const label = req.nextUrl.searchParams.get("label") as
      | "upcoming"
      | "completed"
      | "cancelled"
      | null;
    const page = Number(req.nextUrl.searchParams.get("page") ?? 0);
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? 20);
    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    const data =
      role === "guest" && label
        ? await bookingsAPI.fetchGuestBookings(userId, label, page, limit)
        : await bookingsAPI.fetchBookings(userId);
    return NextResponse.json({ data });
  } catch (err) {
    return jsonError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, bookingId } = body;
    if (!bookingId) return NextResponse.json({ error: "bookingId is required" }, { status: 400 });

    if (action === "status") {
      const data = await bookingsAPI.updateBookingStatus(
        bookingId,
        body.status,
        body.cancelledBy,
        body.reason,
      );
      return NextResponse.json({ data });
    }

    if (action === "dates") {
      const data = await bookingsAPI.updateBookingDates(bookingId, body.checkIn, body.checkOut);
      return NextResponse.json({ data });
    }

    if (action === "guests") {
      const data = await bookingsAPI.updateBookingGuests(
        bookingId,
        Number(body.adults ?? 0),
        Number(body.children ?? 0),
        Number(body.pets ?? 0),
      );
      return NextResponse.json({ data });
    }

    if (action === "review") {
      const data = await bookingsAPI.createReview({
        listing_id: Number(body.listingId),
        user_id: body.userId,
        rating: Number(body.rating),
        comment: body.comment ?? null,
      });
      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return jsonError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { bookingId, addon } = await req.json();
    if (!bookingId || !addon) {
      return NextResponse.json({ error: "bookingId and addon are required" }, { status: 400 });
    }

    const data = await bookingsAPI.addBookingAddon(bookingId, addon);
    return NextResponse.json({ data });
  } catch (err) {
    return jsonError(err);
  }
}
