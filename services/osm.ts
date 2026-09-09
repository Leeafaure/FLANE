import type { Place } from "@/types";
import { nearestArea } from "./areas";
export type OsmElement = {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
};
export function osmCategory(
  t: Record<string, string>,
): Place["category"] | undefined {
  if (t.amenity === "restaurant") return "restaurant";
  if (t.amenity === "cafe") return "cafe";
  if (["park", "garden"].includes(t.leisure)) return "walk";
  if (t.shop) return "shop";
  if (t.tourism) return "curiosity";
}
export function normalizeOsmPlace(
  e: OsmElement,
  updatedAt: string,
): Place | undefined {
  const t = e.tags,
    category = osmCategory(t);
  if (
    !category ||
    !t.name ||
    !Number.isFinite(e.lat) ||
    !Number.isFinite(e.lon) ||
    ["private", "no"].includes(t.access)
  )
    return;
  const point = { latitude: e.lat, longitude: e.lon },
    area = nearestArea(point);
  const outdoor =
    category === "walk" ||
    ["artwork", "attraction"].includes(t.tourism) ||
    t.outdoor_seating === "yes";
  const indoor =
    t.indoor === "yes" ||
    (t.indoor !== "no" && ["cafe", "restaurant", "shop"].includes(category)) ||
    ["museum", "gallery"].includes(t.tourism);
  const labels = {
    restaurant: "Une table à découvrir dans les rues du quartier.",
    cafe: "Une pause café à glisser dans ta balade.",
    walk: "Un espace vert pour une parenthèse dehors.",
    shop:
      t.shop === "books"
        ? "Une librairie à découvrir au fil de la balade."
        : "Une boutique à regarder en passant.",
    curiosity:
      t.tourism === "museum"
        ? "Un musée pour prolonger la découverte du quartier."
        : t.tourism === "gallery"
          ? "Une galerie pour une pause au fil des œuvres."
          : "Un point de curiosité à découvrir en chemin.",
  };
  const postcode = t["addr:postcode"];
  const arr =
    postcode && /^750(0[1-9]|1[0-9]|20)$/.test(postcode)
      ? Number(postcode.slice(-2))
      : parseInt(area.arrondissement);
  const free = t.fee === "no" || (category === "walk" && t.fee !== "yes");
  return {
    id: `osm-${e.type}-${e.id}`,
    name: t.name.slice(0, 150),
    category,
    neighborhood: area.id,
    arrondissement: arr,
    ...point,
    shortDescription: labels[category],
    editorialDescription: labels[category],
    priceLevel: free ? 0 : null,
    tags: [
      ...(t.outdoor_seating === "yes" ? ["une terrasse"] : []),
      ...(t.shop === "antiques" ||
      t.shop === "second_hand" ||
      t.second_hand === "yes"
        ? ["du vintage"]
        : []),
      ...(category === "walk" ? ["du joli"] : []),
      ...(free ? ["pas cher"] : []),
    ],
    indoor,
    outdoor,
    weatherSuitability: indoor ? ["sun", "rain"] : ["sun"],
    walkingTime: 0,
    address: t["addr:street"]
      ? `${t["addr:housenumber"] ?? ""} ${t["addr:street"]}, Paris ${arr}e`.trim()
      : `Paris ${arr}e · adresse précise non renseignée`,
    image: "",
    source: "osm",
    sourceUrl: `https://www.openstreetmap.org/${e.type}/${e.id}`,
    updatedAt,
  };
}
