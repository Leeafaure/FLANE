"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  LocateFixed,
  Map as MapIcon,
  Footprints,
  Coffee,
  Utensils,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useFlane } from "./AppProvider";
import type { Category } from "@/types";
const Map = dynamic(() => import("./Map").then((m) => m.Map), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <MapIcon size={24} />
      Paris se dessine…
    </div>
  ),
});
const categories = [
  { id: "all", label: "Tout Paris", icon: MapIcon },
  { id: "walk", label: "Balades", icon: Footprints },
  { id: "cafe", label: "Cafés", icon: Coffee },
  { id: "restaurant", label: "À table", icon: Utensils },
  { id: "shop", label: "Boutiques", icon: ShoppingBag },
  { id: "curiosity", label: "Petits secrets", icon: Sparkles },
];
export function MapPage() {
  const { locate, locating } = useFlane();
  const params = useSearchParams();
  const [category, setCategory] = useState<Category | "all">("all");
  return (
    <div className="map-page">
      <div className="map-heading">
        <div>
          <h1>
            Paris, <em>à tes pieds.</em>
          </h1>
          <p>Un point sur la carte. Le début d’un joli détour.</p>
        </div>
        <button className="text-link" onClick={locate} disabled={locating}>
          <LocateFixed size={16} />
          {locating ? "On te situe…" : "Me situer"}
        </button>
      </div>
      <div className="map-categories">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`chip ${category === id ? "selected" : ""}`}
            onClick={() => setCategory(id as Category | "all")}
            aria-pressed={category === id}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>
      <div className="map-container">
        <Map
          category={category}
          initialPlace={params.get("lieu")}
          route={params.get("parcours")?.split(",")}
        />
      </div>
      <p className="demo-note">
        Temps de marche estimés · Points et quartiers de notre sélection de
        démonstration. Les traits entre étapes sont des repères, pas un
        itinéraire piéton.
      </p>
    </div>
  );
}
