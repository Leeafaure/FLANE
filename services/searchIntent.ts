import { parseRequest } from "./assistant";
import type { SearchIntent } from "@/types/search";

export function parseSearchIntent(query: string): SearchIntent {
  const local = parseRequest(query);
  const categoryIntent: Partial<Record<string, SearchIntent["intent"]>> = {
    restaurant: "restaurant",
    cafe: "cafe",
    shop: "shopping",
    walk: "walk",
    curiosity: "sightseeing",
  };
  const intent =
    categoryIntent[local.category ?? ""] ??
    (/verre|bar|apero/i.test(query)
      ? "bar"
      : /boulanger|brunch/i.test(query)
        ? "bakery"
        : "surprise");
  const radiusMeters = local.maxDistance
    ? local.maxDistance * 1000
    : local.timeAvailable
      ? Math.min(1800, local.timeAvailable * 80)
      : 1200;
  return {
    intent,
    radiusMeters: Math.max(300, radiusMeters),
    budgetMaxPerPerson:
      local.budget === 1 ? 15 : local.budget === 2 ? 35 : undefined,
    priceLevels:
      local.budget === 1
        ? ["PRICE_LEVEL_INEXPENSIVE"]
        : local.budget === 2
          ? ["PRICE_LEVEL_INEXPENSIVE", "PRICE_LEVEL_MODERATE"]
          : undefined,
    moods: local.mood ?? [],
    timeAvailableMinutes: local.timeAvailable,
    mustBeOpen: !/demain|plus tard|ce soir|week.end/i.test(query),
    keywords: local.mood ?? [],
    confidence: 0.65,
  };
}
