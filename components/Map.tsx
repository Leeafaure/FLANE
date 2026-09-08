"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { ArrowUpRight, Footprints, LocateFixed, MapPin, X } from "lucide-react";
import { places, categoryLabels } from "@/data/places";
import { neighborhoods } from "@/data/neighborhoods";
import { useFlane } from "./AppProvider";
import { FavoriteButton } from "./PlaceCard";
import { distanceBetween, walkingMinutes } from "@/services/location";
import { formatDistance } from "@/lib/format";
import type { Category, Coordinates } from "@/types";
import "leaflet/dist/leaflet.css";

const symbols: Record<Category, string> = {
  restaurant: "⌁",
  cafe: "☕",
  walk: "↟",
  shop: "◇",
  curiosity: "✧",
};

function Focus({ boundsKey }: { boundsKey: string }) {
  const map = useMap();
  useEffect(() => {
    const coordinates = boundsKey
      .split(";")
      .map((value) => value.split(",").map(Number) as [number, number]);
    map.fitBounds(coordinates, {
      paddingTopLeft: [42, 42],
      paddingBottomRight: [42, Math.min(230, map.getSize().y * 0.44)],
      maxZoom: 15,
      animate: false,
    });
  }, [boundsKey, map]);
  return null;
}

function Recenter({ location }: { location: Coordinates }) {
  const map = useMap();
  return (
    <button
      className="map-reset"
      aria-label="Recentrer sur mon point de départ"
      onClick={() => {
        map.setView([location.latitude, location.longitude], 14, {
          animate: false,
        });
      }}
    >
      <LocateFixed size={20} />
    </button>
  );
}

export function Map({
  category,
  initialPlace,
  route,
}: {
  category: Category | "all";
  initialPlace: string | null;
  route?: string[];
}) {
  const { location } = useFlane();
  const [selectedId, setSelectedId] = useState<string | null>(
    initialPlace ?? route?.[0] ?? "square-batignolles",
  );
  const [tileError, setTileError] = useState(false);
  const selected = places.find((p) => p.id === selectedId);
  const routeKey = route?.join(",") ?? "";
  const routePlaces = useMemo(
    () =>
      routeKey
        .split(",")
        .map((id) => places.find((p) => p.id === id))
        .filter((p): p is (typeof places)[number] => !!p),
    [routeKey],
  );
  const shown = places.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (!route || route.includes(p.id)),
  );
  const active =
    selected && shown.some((p) => p.id === selected.id) ? selected : undefined;
  const distance = active ? distanceBetween(location, active) : 0;
  const initial = places.find((p) => p.id === initialPlace);
  const nearby = [...places]
    .sort((a, b) => distanceBetween(location, a) - distanceBetween(location, b))
    .slice(0, 6);
  const bounds: Coordinates[] =
    category !== "all" && shown.length
      ? shown
      : routePlaces.length
        ? routePlaces
        : initial
          ? [initial]
          : [location, ...nearby];
  const boundsKey = bounds.map((p) => `${p.latitude},${p.longitude}`).join(";");

  return (
    <>
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={14}
        zoomControl={false}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            tileerror: () => setTileError(true),
            tileload: () => setTileError(false),
          }}
        />
        <ZoomControl position="topright" />
        <Focus boundsKey={boundsKey} />
        <Recenter location={location} />
        <Marker
          position={[location.latitude, location.longitude]}
          icon={L.divIcon({
            html: '<div class="map-user"></div>',
            className: "",
            iconSize: [17, 17],
          })}
        >
          <Tooltip>Ton point de départ</Tooltip>
        </Marker>
        {neighborhoods.map((n) => (
          <Marker
            key={n.id}
            interactive={false}
            position={[n.latitude + 0.002, n.longitude]}
            icon={L.divIcon({
              html: `<span class="map-neighborhood">${n.name}</span>`,
              className: "",
              iconSize: [120, 25],
              iconAnchor: [60, 12],
            })}
          />
        ))}
        {shown.map((p) => (
          <Marker
            key={p.id}
            title={p.name}
            alt={p.name}
            position={[p.latitude, p.longitude]}
            icon={L.divIcon({
              html: `<div class="map-pin ${selectedId === p.id ? "selected" : ""}"><span>${symbols[p.category]}</span></div>`,
              className: "",
              iconSize: [31, 39],
              iconAnchor: [15, 36],
            })}
            eventHandlers={{ click: () => setSelectedId(p.id) }}
          >
            <Tooltip direction="top" offset={[0, -28]}>
              {p.name}
            </Tooltip>
          </Marker>
        ))}
        {routePlaces.length > 1 && (
          <Polyline
            positions={routePlaces.map((p) => [p.latitude, p.longitude])}
            pathOptions={{
              color: "#7e2938",
              weight: 3,
              dashArray: "6 8",
              opacity: 0.65,
            }}
          />
        )}
      </MapContainer>
      {tileError && (
        <div className="map-error" role="status">
          Le fond de carte est indisponible. Les adresses restent consultables.
        </div>
      )}
      {active && (
        <div className="map-bottom-card">
          <button
            className="map-card-close"
            aria-label="Fermer la fiche du lieu"
            onClick={() => setSelectedId(null)}
          >
            <X size={15} />
          </button>
          <span className="eyebrow">
            {categoryLabels[active.category]} · PARIS {active.arrondissement}e
          </span>
          <FavoriteButton id={active.id} name={active.name} />
          <Link href={`/lieu/${active.id}`}>
            <h2>{active.name}</h2>
          </Link>
          <p>{active.shortDescription}</p>
          <div className="map-card-meta">
            <span>
              <Footprints size={13} />
              {walkingMinutes(distance)} min à pied
            </span>
            <span>
              <MapPin size={12} />
              {formatDistance(distance)}
            </span>
          </div>
          <Link className="text-link" href={`/lieu/${active.id}`}>
            Ce petit détour me plaît <ArrowUpRight size={14} />
          </Link>
        </div>
      )}
    </>
  );
}
