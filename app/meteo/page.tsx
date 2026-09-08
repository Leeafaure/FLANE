"use client";
import Link from "next/link";
import {
  CloudSun,
  CloudRain,
  ArrowLeft,
  Sunset,
  Droplets,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { useFlane } from "@/components/AppProvider";
import { weatherAdvice } from "@/services/weather";
export default function WeatherPage() {
  const { weather, refreshWeather, weatherLoading } = useFlane();
  return (
    <div className="page-shell weather-page">
      <Link href="/" className="back-link">
        <ArrowLeft size={14} />
        Revenir flâner
      </Link>
      <div className="page-intro">
        <span className="eyebrow">LE CIEL DONNE LE TON</span>
        <h1>
          Paris, côté <em>ciel.</em>
        </h1>
        <p>
          Un rayon de soleil, une averse : il y a toujours une bonne façon de
          flâner.
        </p>
      </div>
      <section className="weather-main">
        <span className="temperature">{weather.temperature}°</span>
        {weather.rain ? (
          <CloudRain size={75} strokeWidth={1} />
        ) : (
          <CloudSun size={75} strokeWidth={1} />
        )}
        <div>
          <h2>{weather.condition}</h2>
          <p>
            Ressenti {weather.feelsLike}°C
            <br />
            {weatherAdvice(weather)}
          </p>
        </div>
      </section>
      <div className="hourly-grid">
        {weather.hourly.slice(0, 5).map((h) => (
          <div className="hourly-item" key={h.time}>
            <time>{h.time}</time>
            {h.rainProbability >= 50 ? (
              <CloudRain size={25} strokeWidth={1} />
            ) : (
              <CloudSun size={25} strokeWidth={1} />
            )}
            <strong>{h.temperature}°</strong>
            <span>{h.rainProbability}% de pluie</span>
          </div>
        ))}
      </div>
      <div className="weather-extras">
        <span>
          <Sunset size={19} />
          Coucher du soleil · {weather.sunset}
        </span>
        <span>
          <Droplets size={17} />
          {weather.rain ? "Il pleut actuellement" : "Pas de pluie actuellement"}
        </span>
      </div>
      <button
        className="button outline"
        disabled={weatherLoading}
        onClick={refreshWeather}
      >
        <RefreshCw size={15} className={weatherLoading ? "animate-spin" : ""} />
        {weatherLoading
          ? "Un œil sur le ciel…"
          : "Actualiser la météo en direct"}
      </button>
      <p className="demo-note">
        {weather.source === "demo"
          ? "Ces prévisions sont une démonstration. Actualise pour obtenir la météo réelle de ton point de départ."
          : "Prévisions Open-Meteo pour ton point de départ. Les probabilités de pluie sont horaires."}
      </p>
      <div className="mini-walk-banner editorial-section">
        <div>
          <h2>
            {weather.rain
              ? "Une parenthèse au sec."
              : "Profitons de cette éclaircie."}
          </h2>
          <p>
            {weather.rain
              ? "Cafés, passages et petits refuges."
              : "Les petites rues n’attendent que toi."}
          </p>
        </div>
        <Link
          className="button primary"
          href={weather.rain ? "/demander?q=Un%20plan%20pluie" : "/balade"}
        >
          Trouvons une idée <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  );
}
