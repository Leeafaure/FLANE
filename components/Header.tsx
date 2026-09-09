"use client";
import Link from "next/link";
import { useState } from "react";
import {
  MapPin,
  ChevronDown,
  LocateFixed,
  ArrowUpRight,
  CloudSun,
} from "lucide-react";
import { useFlane } from "./AppProvider";
import { findArea } from "@/services/areas";
import { AreaSearch } from "./AreaSearch";
import { Sheet } from "./Sheet";
export function Header() {
  const { area, setArea, locate, locating, weather } = useFlane();
  const [open, setOpen] = useState(false);
  const current = findArea(area);
  return (
    <>
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="FLÂNE, accueil">
          FLÂNE<span>PARIS, AU GRÉ DE TES ENVIES.</span>
        </Link>
        <div className="header-right">
          <button className="location-button" onClick={() => setOpen(true)}>
            <MapPin size={17} />
            <span>
              <small>Paris {current?.arrondissement ?? ""}</small>
              <strong>{current?.name ?? "Autour de moi"}</strong>
            </span>
            <ChevronDown size={14} />
          </button>
          <div className="header-divider" />
          <Link href="/meteo" className="header-weather">
            <CloudSun size={27} strokeWidth={1.3} />
            <span>
              <strong>{weather.temperature}°</strong>
              <small>{weather.condition}</small>
            </span>
          </Link>
          <Link href="/demander" className="header-ask">
            Une envie en tête ? <ArrowUpRight size={16} />
          </Link>
        </div>
      </header>
      <Sheet open={open} onClose={() => setOpen(false)} title="On flâne où ?">
        <p className="muted">
          Choisis ton point de départ, on s’occupe des idées.
        </p>
        <button
          className="button primary full"
          disabled={locating}
          onClick={async () => {
            await locate();
            setOpen(false);
          }}
        >
          <LocateFixed size={18} />
          {locating ? "On te situe…" : "Utiliser ma position"}
        </button>
        <AreaSearch
          selected={area}
          onSelect={(a) => {
            setArea(a.id);
            setOpen(false);
          }}
        />
      </Sheet>
    </>
  );
}
