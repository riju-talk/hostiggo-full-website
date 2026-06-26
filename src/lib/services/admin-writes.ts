import { supabaseAdmin } from "../supabase-admin";

// All functions here run with the service-role key (RLS bypassed) and must only
// be called from /app/api/* route handlers.

// ── Calendar ─────────────────────────────────────────────────────────────────
export async function upsertCalendarDay(input: {
  listingId: number;
  date: string; // yyyy-mm-dd
  price?: number;
  isAvailable?: boolean;
  currency?: string;
}) {
  const { listingId, date, price, isAvailable, currency } = input;

  // Find an existing row for this (listing, date) so we update in place rather
  // than relying on a specific unique-constraint name for upsert.
  const { data: existing, error: findErr } = await supabaseAdmin
    .from("listing_calendar")
    .select("calendar_id, price, is_available, currency")
    .eq("listing_id", listingId)
    .eq("date", date)
    .maybeSingle();
  if (findErr) throw findErr;

  const patch: Record<string, any> = { updated_at: new Date().toISOString() };
  if (price !== undefined) patch.price = price;
  if (isAvailable !== undefined) patch.is_available = isAvailable;
  if (currency !== undefined) patch.currency = currency;

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from("listing_calendar")
      .update(patch)
      .eq("calendar_id", existing.calendar_id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabaseAdmin
    .from("listing_calendar")
    .insert({
      listing_id: listingId,
      date,
      price: price ?? 0,
      is_available: isAvailable ?? true,
      currency: currency ?? "INR",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Bookings ─────────────────────────────────────────────────────────────────
export async function createBooking(input: {
  listingId: number;
  userId: string;
  startDate: string;
  endDate: string;
  numAdults?: number;
  numChildren?: number;
  amount?: number;
}) {
  // Resolve the owning host from the listing.
  const { data: listing, error: lerr } = await supabaseAdmin
    .from("listings")
    .select("host_uuid")
    .eq("listing_id", input.listingId)
    .maybeSingle();
  if (lerr) throw lerr;
  if (!listing?.host_uuid) throw new Error("Listing not found");

  const numAdults = input.numAdults ?? 1;
  const numChildren = input.numChildren ?? 0;

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .insert({
      listing_id: input.listingId,
      user_id: input.userId,
      start_date: input.startDate,
      end_date: input.endDate,
      num_adults: numAdults,
      num_children: numChildren,
      nom_guests: numAdults + numChildren,
      amount: input.amount ?? null,
      // booking_status only defines 2=CONFIRMED, 3=CANCELLED (no pending row),
      // so a new reservation is created as CONFIRMED.
      status_id: 2,
      host_uuid: listing.host_uuid,
      booked_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Feedback ─────────────────────────────────────────────────────────────────
export async function createFeedback(input: {
  userId?: string | null;
  type: string;
  description: string;
  category?: string | null;
  rating?: number | null;
  comment?: string | null;
}) {
  const { data, error } = await supabaseAdmin
    .from("feedback")
    .insert({
      user_id: input.userId ?? null,
      type: input.type,
      description: input.description,
      category: input.category ?? null,
      rating: input.rating ?? null,
      comment: input.comment ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── User profile ─────────────────────────────────────────────────────────────
export async function updateUserProfile(
  userId: string,
  patch: Partial<{ name: string; email: string; phone: string; age: number; emergency_contact: string }>,
) {
  const clean: Record<string, any> = { updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined && v !== null && v !== "") clean[k] = v;
  }
  const { data, error } = await supabaseAdmin
    .from("users")
    .update(clean)
    .eq("user_id", userId)
    .select("user_id, name, email, phone, age, profile_pic_url, is_verified, emergency_contact")
    .single();
  if (error) throw error;
  return data;
}
