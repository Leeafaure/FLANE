"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Footprints,
  ArrowUpRight,
  Clock,
  CloudRain,
} from "lucide-react";
import { useFlane } from "./AppProvider";
import { TimeSelector, timeOptions } from "./TimeSelector";
import { WalkingTimeline } from "./WalkingTimeline";
import { allAreas, findArea } from "@/services/areas";
import { neighborhoods as editorialNeighborhoods } from "@/data/neighborhoods";
import { buildWalk } from "@/services/walks";
import { useDiscovery } from "./useDiscovery";
import { DiscoveryStatus } from "./DiscoveryStatus";
export function WalkPage() {
  const query = useSearchParams();
  const { weather, area, location } = useFlane();
  const initial = Number(query.get("duree"));
  const [duration, setDuration] = useState(
      timeOptions.some((t) => t.value === initial) ? initial : 60,
    ),
    [neighborhood, setNeighborhood] = useState(
      findArea(query.get("quartier")) ? query.get("quartier")! : area,
    ),
    [fromHere, setFromHere] = useState(false),
    [start, setStart] = useState<Date | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => setStart(new Date()), 0);
    return () => clearTimeout(timer);
  }, []);
  const n = findArea(neighborhood) ?? findArea("batignolles")!;
  const editorial = editorialNeighborhoods.find((item) => item.id === n.id);
  const { places, loading, error, retry } = useDiscovery(n);
  const walk = buildWalk(
    neighborhood,
    duration,
    weather,
    start ?? new Date("2026-01-01T10:00:00"),
    fromHere ? location : undefined,
    places,
  );
  return (
    <div className="page-shell">
      <Link href="/" className="back-link">
        <ArrowLeft size={14} />
        Revenir flâner
      </Link>
      <div className="page-intro">
        <span className="eyebrow">PAS DE COURSE CONTRE LA MONTRE</span>
        <h1>
          {duration < 60
            ? `${duration} minutes`
            : duration === 240
              ? "Un après-midi"
              : `${duration / 60} heure${duration > 60 ? "s" : ""}`}
          <br />à <em>{n.name.replace("Le ", "")}.</em>
        </h1>
        <p>
          Un petit parcours, quelques bonnes pauses. Le reste, c’est toi qui le
          décides.
        </p>
      </div>
      <div className="walk-controls">
        <TimeSelector selected={duration} onChange={setDuration} />
        <select
          className="select"
          aria-label="Quartier de la balade"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
        >
          {allAreas.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
        <button
          className={`chip ${fromHere ? "selected" : ""}`}
          aria-pressed={fromHere}
          onClick={() => setFromHere(!fromHere)}
        >
          Inclure le trajet depuis ma position
        </button>
      </div>
      <DiscoveryStatus loading={loading} error={error} onRetry={retry} />
      <div className="walk-layout">
        <div>
          <div className="walk-summary">
            {weather.rain ? (
              <CloudRain size={28} strokeWidth={1.2} />
            ) : (
              <Footprints size={28} strokeWidth={1.2} />
            )}
            <p>
              <strong>
                {walk.stops.length} pauses · {walk.totalMinutes} min environ ·{" "}
                {walk.distance.toFixed(1)} km à pied
              </strong>
              <br />
              {weather.rain
                ? "Une balade à l’abri, adaptée à la pluie."
                : weather.dryMinutes < 60
                  ? "On garde un œil sur la pluie, avec des pauses à l’intérieur."
                  : "Les trajets et les pauses sont compris. Prends ton temps."}
            </p>
          </div>
          {!start || loading ? (
            <div className="loading-block">On prépare les étapes…</div>
          ) : walk.stops.length ? (
            <WalkingTimeline stops={walk.stops} />
          ) : (
            <div className="empty-state">
              <Clock size={32} />
              <h2>Laissons-nous un peu plus de temps.</h2>
              <p>
                Avec ce point de départ et la météo, cette durée est un peu
                courte. Prolonge la balade ou commence directement dans le
                quartier.
              </p>
              <button
                className="button outline"
                onClick={() => {
                  setFromHere(false);
                  setDuration(120);
                }}
              >
                Prévoir deux heures dans le quartier
              </button>
            </div>
          )}
          <p className="demo-note">
            Départ {fromHere ? "depuis ta position" : "à la première adresse"}.
            Temps de marche estimés, sans calcul d’itinéraire routier. Les
            horaires des lieux ne sont pas vérifiés. À Montmartre, prévois des
            pentes et des escaliers.
          </p>
        </div>
        <aside className="walk-side">
          <div className="walk-side-image">
            {editorial ? (
              <Image
                src={editorial.image}
                alt={`Une invitation à flâner à ${n.name}`}
                fill
                sizes="40vw"
              />
            ) : (
              <div className="walk-area-visual">{n.name}</div>
            )}
            <div>
              <span className="eyebrow">LE BONHEUR EST EN CHEMIN</span>
              <h2>{n.name}</h2>
              <span>
                {editorial?.subtitle ?? "Des idées choisies autour de toi."}
              </span>
            </div>
          </div>
          <p>
            Un arrêt te plaît ? Garde-le dans ton carnet pour une prochaine
            fois.
          </p>
          {walk.stops.length > 0 && (
            <Link
              className="button primary full"
              href={`/carte?parcours=${walk.stops.map((s) => s.place.id).join(",")}`}
            >
              Voir les étapes sur la carte <ArrowUpRight size={16} />
            </Link>
          )}
        </aside>
      </div>
      {walk.stops.length > 0 && (
        <Link
          className="button outline full mobile-walk-map"
          href={`/carte?parcours=${walk.stops.map((s) => s.place.id).join(",")}`}
        >
          Voir les étapes sur la carte <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
