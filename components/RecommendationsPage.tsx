"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { useFlane } from "./AppProvider";
import { MoodFilters } from "./MoodFilters";
import { PlaceCard } from "./PlaceCard";
import { getRecommendations } from "@/services/recommendations";
import { categoryLabels } from "@/data/places";
import { areas } from "@/data/neighborhoods";
import type { Category } from "@/types";
export function RecommendationsPage() {
  const query = useSearchParams();
  const { location, weather } = useFlane();
  const initial = query.get("category");
  const [category, setCategory] = useState<Category | undefined>(
      initial && initial in categoryLabels ? (initial as Category) : undefined,
    ),
    [mood, setMood] = useState<string[]>([]),
    [budget, setBudget] = useState(3);
  const neighborhood = query.get("quartier") ?? undefined;
  const results = getRecommendations({
    location,
    weather,
    category,
    mood,
    budget,
    neighborhood,
  });
  const area = areas.find((a) => a.id === neighborhood);
  return (
    <div className="page-shell">
      <Link href="/" className="back-link">
        <ArrowLeft size={14} />
        Toutes les envies
      </Link>
      <div className="page-intro">
        <span className="eyebrow">
          {area
            ? `AUTOUR DE ${area.name.toUpperCase()}`
            : "LES BONNES ADRESSES, AU BON MOMENT"}
        </span>
        <h1>
          {category === "restaurant" ? (
            <>
              On passe <em>à table ?</em>
            </>
          ) : category === "cafe" ? (
            <>
              Le temps d’un <em>café.</em>
            </>
          ) : (
            <>
              Suivons ton <em>envie.</em>
            </>
          )}
        </h1>
        <p>
          Quelques adresses choisies avec soin. Parce que les meilleures listes
          sont souvent les plus courtes.
        </p>
      </div>
      <div className="filter-row">
        <select
          aria-label="Type d’adresse"
          value={category ?? ""}
          onChange={(e) =>
            setCategory((e.target.value as Category) || undefined)
          }
        >
          <option value="">Toutes les envies</option>
          {Object.entries(categoryLabels).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <select
          aria-label="Budget maximum"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        >
          <option value={3}>Tous les budgets</option>
          <option value={0}>Gratuit</option>
          <option value={1}>Petit budget · €</option>
          <option value={2}>Se faire plaisir · €€</option>
        </select>
      </div>
      <MoodFilters selected={mood} onChange={setMood} />
      <div className="results-intro">
        <p>À ta place, on commencerait par ici.</p>
        <span>
          {results.length}{" "}
          {results.length === 1 ? "petit détour" : "petits détours"}
        </span>
      </div>
      {results.length ? (
        <div className="place-grid">
          {results.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Compass size={35} />
          <h2>On élargit un peu l’horizon ?</h2>
          <p>
            Pas encore d’adresse pour cette combinaison. Essaie une autre envie
            ou un budget différent.
          </p>
          <button
            className="button outline"
            onClick={() => {
              setCategory(undefined);
              setBudget(3);
              setMood([]);
            }}
          >
            Revoir toutes les idées
          </button>
        </div>
      )}
    </div>
  );
}
