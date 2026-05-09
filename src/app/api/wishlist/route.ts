import { NextRequest, NextResponse } from "next/server";
import { wishlistAPI } from "@/lib/services/wishlist";

export const dynamic = "force-dynamic";

const jsonError = (err: unknown, status = 500) =>
  NextResponse.json({ error: err instanceof Error ? err.message : "Request failed" }, { status });

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const resource = req.nextUrl.searchParams.get("resource") ?? "items";
    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    const categoryId = req.nextUrl.searchParams.get("categoryId") ?? undefined;
    const data =
      resource === "categories"
        ? await wishlistAPI.getWishlistCategories(userId)
        : resource === "listings"
          ? await wishlistAPI.fetchCategoricalWishlistListing(userId, categoryId)
          : resource === "ids"
            ? await wishlistAPI.getWishlistListingIds(userId)
            : await wishlistAPI.getWishlist(userId);

    return NextResponse.json({ data });
  } catch (err) {
    return jsonError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action ?? "add";

    if (action === "add") {
      const data = await wishlistAPI.addToWishlist(body);
      return NextResponse.json({ data });
    }

    if (action === "create-category") {
      const data = await wishlistAPI.addWishlistCategories(body);
      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return jsonError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { categoryId, name } = await req.json();
    if (!categoryId || !name) {
      return NextResponse.json({ error: "categoryId and name are required" }, { status: 400 });
    }

    const data = await wishlistAPI.renameWishlistCategory(categoryId, name);
    return NextResponse.json({ data });
  } catch (err) {
    return jsonError(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, listingId, categoryId } = await req.json();

    if (categoryId && !listingId) {
      await wishlistAPI.deleteWishlistCategory(categoryId);
      return NextResponse.json({ data: true });
    }

    if (!userId || !listingId) {
      return NextResponse.json({ error: "userId and listingId are required" }, { status: 400 });
    }

    await wishlistAPI.removeFromWishlist(userId, listingId, categoryId);
    return NextResponse.json({ data: true });
  } catch (err) {
    return jsonError(err);
  }
}
