import { NextRequest, NextResponse } from "next/server";
import { getNearbyPlaces, validParisPoint } from "@/services/catalog.server";
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  if (!q.has("lat") || !q.has("lon"))
    return NextResponse.json(
      { error: "Choisis un point de départ à Paris." },
      { status: 400 },
    );
  const point = {
    latitude: Number(q.get("lat")),
    longitude: Number(q.get("lon")),
  };
  if (!validParisPoint(point))
    return NextResponse.json(
      {
        error:
          "Pour le moment, on flâne à Paris. Choisis un quartier parisien.",
      },
      { status: 400 },
    );
  try {
    return NextResponse.json(await getNearbyPlaces(point), {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Les adresses ne sont pas disponibles pour le moment. Réessaie dans un instant.",
      },
      { status: 503 },
    );
  }
}
