import { places } from "@/data/places";
import { walkTemplates } from "@/data/walks";
import { distanceBetween, walkingMinutes } from "@/services/location";
import type { Coordinates, Weather, WalkStop } from "@/types";
export function buildWalk(
  neighborhood: string,
  duration: number,
  weather: Weather,
  start: Date = new Date(),
  origin?: Coordinates,
): { stops: WalkStop[]; totalMinutes: number; distance: number } {
  const candidates = (walkTemplates[neighborhood] ?? walkTemplates.batignolles)
    .map((id) => places.find((p) => p.id === id)!)
    .filter((p) => !weather.rain || p.indoor);
  let elapsed = 0,
    distance = 0,
    previous: Coordinates | undefined = origin;
  const stops: WalkStop[] = [];
  for (const place of candidates) {
    if (!place.indoor && weather.dryMinutes <= elapsed + 20) continue;
    const leg = previous ? distanceBetween(previous, place) : 0;
    const transit = previous ? walkingMinutes(leg) : 0;
    const visit =
      place.category === "restaurant"
        ? 35
        : place.category === "cafe"
          ? 20
          : duration <= 30
            ? 8
            : 15;
    if (elapsed + transit + visit > duration) continue;
    elapsed += transit;
    const time = new Date(start.getTime() + elapsed * 60000).toLocaleTimeString(
      "fr-FR",
      { hour: "2-digit", minute: "2-digit" },
    );
    stops.push({
      place,
      minutes: visit,
      time,
      note: transit
        ? `${transit} min de marche · ${visit} min sur place`
        : `${visit} min pour profiter`,
    });
    elapsed += visit;
    distance += leg;
    previous = place;
  }
  return { stops, totalMinutes: elapsed, distance: distance * 1.25 };
}
