"use client";
import { PlaceVisual } from "./PlaceVisual";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Footprints,
  CloudSun,
  CloudRain,
} from "lucide-react";
import { formatDistance } from "@/lib/format";
import type { Place } from "@/types";
import { useFlane } from "./AppProvider";
import { FavoriteButton, CollectionButton } from "./PlaceCard";
import { categoryLabels } from "@/data/places";
import { distanceBetween, walkingMinutes } from "@/services/location";
export function PlaceDetail({ place: p }: { place: Place }) {
  const { location } = useFlane();
  const distance = distanceBetween(location, p);
  return (
    <div className="page-shell">
      <Link href="/" className="back-link">
        <ArrowLeft size={14} />
        Revenir flâner
      </Link>
      <div className="detail-layout">
        <div className="detail-image">
          <PlaceVisual place={p} priority />
        </div>
        <div className="detail-copy">
          <span className="eyebrow">
            {categoryLabels[p.category]} · PARIS {p.arrondissement}e
          </span>
          <h1>{p.name}</h1>
          <div className="detail-meta">
            <span>
              <Footprints size={16} />
              {walkingMinutes(distance)} min à pied
            </span>
            <span>{formatDistance(distance)} à vol d’oiseau</span>
            <span>
              {p.priceLevel === null
                ? "Budget non renseigné"
                : p.priceLevel
                  ? "€".repeat(p.priceLevel)
                  : "Gratuit"}
            </span>
          </div>
          <p>{p.editorialDescription}</p>
          <div className="detail-address">
            <MapPin size={18} />
            <span>{p.address}</span>
          </div>
          <div className="mood-chips">
            {p.tags.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>
          <div className="detail-meta">
            <span>
              {p.indoor ? <CloudRain size={16} /> : <CloudSun size={16} />}{" "}
              {p.indoor
                ? "Une idée, même quand il pleut"
                : "À savourer par beau temps"}
            </span>
          </div>
          <div className="detail-actions">
            <Link className="button primary" href={`/carte?lieu=${p.id}`}>
              Voir sur la carte <ArrowUpRight size={17} />
            </Link>
            <FavoriteButton id={p.id} name={p.name} />
            <CollectionButton place={p} />
          </div>
          <p className="demo-note">
            {p.source === "osm" ? (
              <>
                Adresse issue d’
                <a href={p.sourceUrl} target="_blank" rel="noreferrer">
                  OpenStreetMap ↗
                </a>
                , relevée le{" "}
                {new Date(p.updatedAt!).toLocaleDateString("fr-FR")}. Les
                horaires et les prix sont à vérifier auprès du lieu.
              </>
            ) : (
              <>
                Sélection de démonstration · Photographie d’ambiance. Les temps
                de marche sont estimés. Vérifie les horaires et les tarifs
                auprès du lieu avant de partir.
              </>
            )}
          </p>
        </div>
      </div>
      <div className="mini-walk-banner editorial-section">
        <div>
          <h2>Et après cette petite pause ?</h2>
          <p>On te prépare un parcours dans le quartier.</p>
        </div>
        <Link
          className="button outline"
          href={`/balade?quartier=${p.neighborhood}`}
        >
          Continuer à flâner <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  );
}
