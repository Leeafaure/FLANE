import { places } from "@/data/places";
import { distanceBetween, walkingMinutes } from "@/services/location";
import type { RankedPlace, RecommendationInput, Place } from "@/types";
export function getRecommendations(input: RecommendationInput, pool:Place[]=places): RankedPlace[] {
  return pool
    .filter(
      (p) =>
        (!input.category || p.category === input.category) &&
        (input.radius===undefined || distanceBetween(input.location,p)<=input.radius) &&
        (!input.neighborhood || p.neighborhood === input.neighborhood) &&
        (input.budget === undefined || input.budget === 3 || (p.priceLevel !== null && p.priceLevel <= input.budget)),
    )
    .map((p) => {
      const distance = distanceBetween(input.location, p),
        walkingTime = walkingMinutes(distance);
      let score = 25 - Math.min(distance * 4, 30);
      score += p.weatherSuitability.includes(
        input.weather.rain ? "rain" : "sun",
      )
        ? 18
        : -25;
      if (input.weather.dryMinutes < 45 && !p.indoor) score -= 12;
      score += (input.mood ?? []).filter((m) => p.tags.includes(m)).length * 16;
      if (input.timeAvailable && walkingTime > input.timeAvailable / 2)
        score -= 40;
      return { ...p, distance, walkingTime, score };
    })
    .filter(
      (p) => !input.timeAvailable || p.walkingTime + 10 <= input.timeAvailable,
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}
