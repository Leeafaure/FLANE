import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Coffee,
  Utensils,
  Footprints,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import type { Place } from "@/types";
const icons = {
  cafe: Coffee,
  restaurant: Utensils,
  walk: Footprints,
  shop: ShoppingBag,
  curiosity: Sparkles,
};
type CommonsImage = { image: string; source: string; credit: string };
export function PlaceVisual({
  place,
  priority = false,
}: {
  place: Place;
  priority?: boolean;
}) {
  const Icon = icons[place.category];
  const [commons, setCommons] = useState<CommonsImage | null>(null);
  useEffect(() => {
    if (place.image || !["walk", "curiosity"].includes(place.category)) return;
    const controller = new AbortController();
    fetch(
      `/api/place-image?name=${encodeURIComponent(place.name)}&category=${place.category}`,
      {
        signal: controller.signal,
      },
    )
      .then((response) => response.json())
      .then((data) => data.image && setCommons(data as CommonsImage))
      .catch(() => undefined);
    return () => controller.abort();
  }, [place.category, place.image, place.name]);
  return place.image ? (
    <Image
      src={place.image}
      alt={priority ? `Photographie d’ambiance pour ${place.name}` : ""}
      fill
      priority={priority}
      sizes="(max-width: 600px) 90vw, 500px"
    />
  ) : commons ? (
    <a
      href={commons.source}
      target="_blank"
      rel="noreferrer"
      className="commons-photo"
    >
      <Image
        src={commons.image}
        alt={`Image Wikimedia Commons de ${place.name}`}
        fill
        sizes="(max-width: 600px) 90vw, 500px"
      />
      <span>Wikimedia Commons</span>
    </a>
  ) : (
    <div
      className={`place-illustration illustration-${place.category}`}
      aria-hidden="true"
    >
      <span className="illustration-district">{place.arrondissement}</span>
      <Icon size={40} strokeWidth={1} />
      <span>UN PETIT DÉTOUR DANS LE {place.arrondissement}e</span>
    </div>
  );
}
