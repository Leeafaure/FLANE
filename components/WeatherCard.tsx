"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  CloudSun,
  CloudRain,
  Sun,
  Umbrella,
  Armchair,
} from "lucide-react";
import { useFlane } from "./AppProvider";
import { weatherAdvice } from "@/services/weather";
export function WeatherCard() {
  const { weather } = useFlane();
  const WeatherIcon = weather.rain ? CloudRain : CloudSun;
  return (
    <section className="today-card">
      <div className="today-intro">
        <span className="eyebrow">PARIS AUJOURD’HUI</span>
        <div>
          <WeatherIcon size={38} strokeWidth={1} />
          <h2>{weather.rain ? "La pluie a du bon." : "Un air de flânerie."}</h2>
        </div>
        <p>{weatherAdvice(weather)}</p>
      </div>
      <div className="today-details">
        <div>
          <Sun size={20} />
          <span>Idéal pour</span>
          <strong>
            {weather.rain ? "Un café au chaud" : "Les Batignolles à pied"}
          </strong>
        </div>
        <div>
          <Armchair size={20} />
          <span>Terrasse ?</span>
          <strong>{weather.rain ? "Une prochaine fois" : "Oh que oui."}</strong>
        </div>
        <div>
          <Umbrella size={20} />
          <span>Parapluie ?</span>
          <strong>
            {weather.rain || weather.dryMinutes < 60
              ? "À garder près de toi"
              : "Pas nécessaire."}
          </strong>
        </div>
      </div>
      <Link
        href="/meteo"
        className="today-link"
        aria-label="Voir les prévisions météo"
      >
        <ArrowUpRight size={21} />
      </Link>
      <span className="demo-weather">
        {weather.source === "demo" ? "Météo démo" : "Open-Meteo"}
      </span>
    </section>
  );
}
