import type { Place } from "@/types";
import type { SearchIntent } from "@/types/search";
import type { Coordinates } from "@/types";

const MAX_GOOGLE_RESULTS = 10;
const cache = new Map<string, { until: number; places: Place[] }>();
const fields = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.primaryType",
  "places.types",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.currentOpeningHours",
  "places.googleMapsUri",
  "places.websiteUri",
].join(",");
const typeByIntent: Record<SearchIntent["intent"], string> = {
  restaurant: "restaurant",
  cafe: "cafe",
  bar: "bar",
  bakery: "bakery",
  shopping: "store",
  museum: "museum",
  gallery: "art_gallery",
  walk: "park",
  park: "park",
  sightseeing: "tourist_attraction",
  neighborhood: "point_of_interest",
  street_story: "point_of_interest",
  surprise: "point_of_interest",
};
const categoryByIntent: Record<SearchIntent["intent"], Place["category"]> = {
  restaurant: "restaurant",
  cafe: "cafe",
  bar: "restaurant",
  bakery: "cafe",
  shopping: "shop",
  museum: "curiosity",
  gallery: "curiosity",
  walk: "walk",
  park: "walk",
  sightseeing: "curiosity",
  neighborhood: "curiosity",
  street_story: "curiosity",
  surprise: "curiosity",
};
const price: Record<string, Place["priceLevel"]> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 3,
};

export async function searchGooglePlaces(
  query: string,
  intent: SearchIntent,
  location: Coordinates,
): Promise<Place[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("Google Places n’est pas configuré.");
  const cacheKey = `${Math.round(location.latitude * 500)}/${Math.round(location.longitude * 500)}/${intent.intent}/${query.toLowerCase()}`;
  const hit = cache.get(cacheKey);
  if (hit && hit.until > Date.now()) return hit.places;
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": fields,
      },
      body: JSON.stringify({
        textQuery: `${query} Paris`,
        includedType: typeByIntent[intent.intent],
        locationBias: {
          circle: {
            center: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            radius: intent.radiusMeters,
          },
        },
        pageSize: MAX_GOOGLE_RESULTS,
        languageCode: "fr",
      }),
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) throw new Error("Google Places ne peut pas répondre.");
  const body = (await response.json()) as {
    places?: Record<string, unknown>[];
  };
  const places = (body.places ?? []).flatMap((raw): Place[] => {
    const p = raw as {
      id?: string;
      displayName?: { text?: string };
      formattedAddress?: string;
      location?: { latitude?: number; longitude?: number };
      primaryType?: string;
      rating?: number;
      userRatingCount?: number;
      priceLevel?: string;
      currentOpeningHours?: { openNow?: boolean };
      googleMapsUri?: string;
      websiteUri?: string;
    };
    if (!p.id || !p.displayName?.text || !p.location) return [];
    const category = categoryByIntent[intent.intent];
    return [
      {
        id: `google-${p.id}`,
        name: p.displayName.text,
        category,
        neighborhood: "google-place",
        arrondissement: 0,
        latitude: p.location.latitude ?? location.latitude,
        longitude: p.location.longitude ?? location.longitude,
        shortDescription:
          p.primaryType?.replaceAll("_", " ") ??
          "Adresse trouvée autour de toi.",
        editorialDescription:
          "Adresse trouvée via Google Places et classée selon ta demande.",
        priceLevel: price[p.priceLevel ?? ""] ?? null,
        tags: intent.moods,
        indoor: ["restaurant", "cafe", "shop"].includes(category),
        outdoor: category === "walk",
        weatherSuitability: ["sun", "rain"],
        walkingTime: 0,
        address: p.formattedAddress ?? "Adresse non renseignée",
        image: "",
        source: "google",
        googleMapsUrl: p.googleMapsUri,
        website: p.websiteUri,
        rating: p.rating,
        userRatingCount: p.userRatingCount,
        openNow: p.currentOpeningHours?.openNow,
      },
    ];
  });
  cache.set(cacheKey, { places, until: Date.now() + 5 * 60_000 });
  return places;
}
