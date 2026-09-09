"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { searchAreas } from "@/services/areas";
import type { Area } from "@/types";
export function AreaSearch({
  onSelect,
  selected,
  linkPrefix,
}: {
  onSelect?: (area: Area) => void;
  selected?: string;
  linkPrefix?: string;
}) {
  const [query, setQuery] = useState("");
  const matches = searchAreas(query);
  return (
    <div className="area-search">
      <label className="area-search-field">
        <Search size={19} />
        <input
          aria-label="Rechercher un quartier de Paris"
          type="search"
          placeholder="Belleville, Oberkampf, Paris 15e…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <p className="area-search-hint">
        Tous les arrondissements, les 80 quartiers et les petits noms des
        Parisiens.
      </p>
      <div className="area-search-results" aria-live="polite">
        {matches.map((a) =>
          linkPrefix ? (
            <Link
              key={a.id}
              className={`area-option ${selected === a.id ? "selected" : ""}`}
              href={`${linkPrefix}${encodeURIComponent(a.id)}`}
            >
              <span>{a.name}</span>
              <small>
                Paris {a.arrondissement} <ArrowUpRight size={13} />
              </small>
            </Link>
          ) : (
            <button
              key={a.id}
              className={`area-option ${selected === a.id ? "selected" : ""}`}
              onClick={() => onSelect?.(a)}
            >
              <span>{a.name}</span>
              <small>
                Paris {a.arrondissement} <ArrowUpRight size={13} />
              </small>
            </button>
          ),
        )}
        {!matches.length && (
          <p className="muted">
            Ce nom ne me dit rien. Essaie un nom voisin ou un arrondissement,
            comme « Paris 11e ».
          </p>
        )}
      </div>
    </div>
  );
}
