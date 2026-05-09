import { supabase } from "../supabase";

export const bookingsAPI = {
  async fetchGuestBookings(
    userId: string,
    bookingLabel: "upcoming" | "completed" | "cancelled",
    page: number = 0,
    limit: number = 20,
  ) {
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("user_bookings_detailed")
      .select(
        `
        booking_id,
        start_date,
        end_date,
        status_name,
        listing_title,
        cover_photo_url,
        booking_label
      `,
      )
      .eq("user_id", userId)
      .eq("booking_label", bookingLabel)
      .range(from, to)
      .order("start_date", { ascending: bookingLabel === "upcoming" });

    if (error) throw error;
    return data || [];
  },

  async fetchGuestBookingDetail(bookingId: string | number) {
    const { data, error } = await supabase
      .from("user_bookings_detailed")
      .select("*")
      .eq("booking_id", Number(bookingId))
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createReview(payload: {
    listing_id: number;
    user_id: string;
    rating: number;
    comment?: string | null;
  }) {
    const { data, error } = await supabase
      .from("review")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async fetchBookings(userId: string) {
    const { data: hostData, error: hostError } = await supabase
      .from("host")
      .select("host_uuid")
      .eq("user_id", userId)
      .single();

    if (hostError || !hostData) {
      console.warn("Could not find host profile for user:", userId, hostError);
      return [];
    }

    const hostUuid = hostData.host_uuid;
    const { data, error } = await supabase
      .from("bookings")
      .select(`*, property:listings(*)`)
      .eq("host_uuid", hostUuid);

    if (error) throw error;
    return data;
  },

  async updateBookingStatus(
    bookingId: string | number,
    status: string,
    _cancelledBy: "host" | "user" = "user",
    _reason?: string,
  ) {
    const updateData: any = {};

    if (status.toLowerCase() === "cancelled") {
      updateData.status_id = 3;
      if (_reason) updateData.cancellation_reason = _reason;
    } else if (status.toLowerCase() === "confirmed") {
      updateData.status_id = 2;
    } else if (status.toLowerCase() === "pending") {
      updateData.status_id = 1;
    }

    const { data, error } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("booking_id", Number(bookingId))
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBookingDates(bookingId: string | number, checkIn: string, checkOut: string) {
    const formattedCheckIn = checkIn.split("T")[0];
    const formattedCheckOut = checkOut.split("T")[0];

    const { data, error } = await supabase
      .from("bookings")
      .update({ start_date: formattedCheckIn, end_date: formattedCheckOut })
      .eq("booking_id", Number(bookingId))
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBookingGuests(
    bookingId: string | number,
    adults: number,
    children: number,
    _pets: number = 0,
  ) {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        num_adults: adults,
        num_children: children,
        nom_guests: adults + children,
      })
      .eq("booking_id", Number(bookingId))
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addBookingAddon(bookingId: string, addon: any) {
    const { data, error } = await supabase
      .from("booking_addons")
      .insert([
        {
          booking_id: bookingId,
          name: addon.name,
          price: addon.price,
          type: addon.type,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
