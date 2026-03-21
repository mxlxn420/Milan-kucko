import { NextResponse } from "next/server";

export const revalidate = 3600; // 1 óránként frissül

export async function GET() {
  try {
    const apiKey  = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      return NextResponse.json(
        { success: false, error: "API kulcs vagy Place ID hiányzik" },
        { status: 500 }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&language=hu&key=${apiKey}`;

    const res  = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { success: false, error: data.status },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        rating:       data.result.rating,
        totalRatings: data.result.user_ratings_total,
        reviews:      data.result.reviews ?? [],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}