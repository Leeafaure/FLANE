import { NextRequest, NextResponse } from "next/server";
import { getNearbyPlaces, validParisPoint } from "@/services/catalog.server";
import { getRecommendations } from "@/services/recommendations";
import { parseSearchIntent } from "@/services/searchIntent";
import { searchGooglePlaces } from "@/services/googlePlaces.server";
import { getMockWeather } from "@/services/weather";

export const runtime = "nodejs";

type AskBody = {
  question?: string;
  location?: { latitude?: number; longitude?: number };
  weather?: {
    temperature?: number;
    condition?: string;
    rain?: boolean;
    dryMinutes?: number;
  };
};

export async function POST(request: NextRequest) {
  let body: AskBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "La demande est invalide." },
      { status: 400 },
    );
  }
  const question = body.question?.trim();
  const location = {
    latitude: Number(body.location?.latitude),
    longitude: Number(body.location?.longitude),
  };
  if (!question || question.length > 700 || !validParisPoint(location)) {
    return NextResponse.json(
      { error: "Indique une envie et un point de départ à Paris." },
      { status: 400 },
    );
  }

  const intent = parseSearchIntent(question);
  try {
    let candidates;
    try {
      candidates = await searchGooglePlaces(question, intent, location);
    } catch {
      candidates = (await getNearbyPlaces(location)).places;
    }
    const ranked = getRecommendations(
      {
        location,
        weather: { ...getMockWeather(), ...body.weather },
        category: undefined,
        mood: intent.moods,
        budget: intent.budgetMaxPerPerson
          ? intent.budgetMaxPerPerson <= 15
            ? 1
            : 2
          : 3,
        timeAvailable: intent.timeAvailableMinutes,
        radius: intent.radiusMeters / 1000,
      },
      candidates,
    )
      .filter((p) => !intent.mustBeOpen || p.openNow !== false)
      .slice(0, 3);
    const first = ranked[0];
    const message = first
      ? `À ta place, on commencerait par ${first.name} : ${first.walkingTime} min à pied${first.openNow === true ? ", ouvert maintenant" : ""}${first.rating ? `, noté ${first.rating.toFixed(1)}` : ""}. ${ranked.length > 1 ? "Je t’ai gardé deux alternatives juste en dessous." : ""}`
      : "Je n’ai pas trouvé de lieu qui coche vraiment tous tes critères. Essaie d’élargir un peu le quartier ou le budget.";
    return NextResponse.json({
      configured: true,
      message,
      places: ranked,
      searched: Boolean(process.env.GOOGLE_PLACES_API_KEY),
    });
  } catch {
    return NextResponse.json(
      { error: "FLÂNE ne peut pas répondre tout de suite." },
      { status: 503 },
    );
  }
}
