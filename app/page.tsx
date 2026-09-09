"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Utensils,
  Coffee,
  Footprints,
  Sparkles,
  Shuffle,
  MapPin,
  Clock,
  MoveUpRight,
} from "lucide-react";
import { neighborhoods } from "@/data/neighborhoods";
import { NeighborhoodCard } from "@/components/NeighborhoodCard";
import { PlaceCard } from "@/components/PlaceCard";
import { WeatherCard } from "@/components/WeatherCard";
import { MoodFilters } from "@/components/MoodFilters";
import { TimeSelector } from "@/components/TimeSelector";
import { Reveal } from "@/components/Reveal";
import { Sheet } from "@/components/Sheet";
import { useFlane } from "@/components/AppProvider";
import { getRecommendations } from "@/services/recommendations";
import { DiscoveryStatus } from "@/components/DiscoveryStatus";
import { distanceBetween, walkingMinutes } from "@/services/location";
const intents = [
  {
    title: "J’ai faim",
    description: "Une bonne table, tout simplement.",
    icon: Utensils,
    href: "/envies?category=restaurant",
    className: "food",
  },
  {
    title: "Je me balade",
    description: "Le plaisir de prendre un détour.",
    icon: Footprints,
    href: "/balade",
    className: "walk",
  },
  {
    title: "Un café",
    description: "Une petite pause qui fait du bien.",
    icon: Coffee,
    href: "/envies?category=cafe",
    className: "coffee",
  },
  {
    title: "Une anecdote",
    description: "Paris a des choses à te raconter.",
    icon: Sparkles,
    href: "/rue/rue-des-dames",
    className: "story",
  },
];
export default function Home() {
  const { location, weather, nearbyPlaces } = useFlane();
  const [mood, setMood] = useState<string[]>([]),
    [time, setTime] = useState(60),
    [surprise, setSurprise] = useState<(typeof nearbyPlaces)[number] | null>(
      null,
    );
  const picks = getRecommendations(
    { location, weather, mood },
    nearbyPlaces,
  ).slice(0, 3);
  function random() {
    const options = getRecommendations(
      { location, weather },
      nearbyPlaces,
    ).filter((p) => p.id !== surprise?.id);
    setSurprise(
      options[Math.floor(Math.random() * options.length)] ??
        nearbyPlaces[0] ??
        null,
    );
  }
  return (
    <div className="page-shell home">
      <section className="hero">
        <Reveal className="hero-copy">
          <div className="eyebrow hero-eyebrow">
            <span className="live-dot" /> TON PETIT PARIS, JUSTE ICI
          </div>
          <h1>
            Bonsoir,
            <br />
            on fait <em>quoi ?</em>
            <span className="hand-star">✳</span>
          </h1>
          <p>
            Une envie, un peu de temps. <br />
            Et Paris qui s’ouvre à toi.
          </p>
          <Link href="/demander" className="button primary">
            On trouve ton prochain détour <ArrowUpRight size={18} />
          </Link>
          <div className="hero-note">
            <span className="little-line" /> Les meilleures choses sont souvent
            à deux rues.
          </div>
        </Reveal>
        <Reveal className="hero-visual" delay={0.1}>
          <Image
            className="hero-image"
            src="/images/hero.jpg"
            alt="Une terrasse de café parisien, pour prendre le temps de flâner"
            fill
            priority
            sizes="(max-width: 700px) 100vw, 58vw"
          />
          <span className="image-top-note">
            <span /> LA VILLE EST À TOI
          </span>
          <div className="hero-photo-caption">
            <MapPin size={15} />
            <span>
              Quelque part à Paris.
              <br />
              <strong>Exactement là où il faut être.</strong>
            </span>
          </div>
          <div className="postcard">
            <span>LE PROGRAMME ?</span>
            <p>
              Ne pas en
              <br />
              avoir.
            </p>
            <MoveUpRight size={23} strokeWidth={1.2} />
          </div>
          <div className="round-stamp">
            <span>PRENDS TON TEMPS</span>
            <Sparkles size={21} strokeWidth={1} />
            <span>TU ES À PARIS</span>
          </div>
        </Reveal>
      </section>
      <Reveal className="intent-section">
        <div className="section-kicker">
          <span>SUIS TON ENVIE</span>
          <span>
            Il n’y a pas de mauvais choix <ArrowRight size={13} />
          </span>
        </div>
        <div className="intent-grid">
          {intents.map(
            ({ title, description, icon: Icon, href, className }) => (
              <Link
                key={title}
                className={`intent-card ${className}`}
                href={href}
              >
                <div className="intent-top">
                  <Icon size={27} strokeWidth={1.25} />
                  <ArrowUpRight size={17} />
                </div>
                <h2>{title}</h2>
                <p>{description}</p>
              </Link>
            ),
          )}
        </div>
      </Reveal>
      <Reveal>
        <WeatherCard />
      </Reveal>
      <section className="home-section">
        <Reveal className="section-heading">
          <div>
            <span className="eyebrow">PAS BESOIN D’ALLER LOIN</span>
            <h2>
              À quelques pas <em>de toi.</em>
            </h2>
          </div>
          <Link href="/paris" className="text-link">
            Tous les quartiers <ArrowUpRight size={16} />
          </Link>
        </Reveal>
        <div className="neighborhood-grid">
          {neighborhoods.map((n, i) => (
            <Reveal key={n.id} delay={i * 0.06}>
              <NeighborhoodCard
                neighborhood={n}
                walkingTime={walkingMinutes(distanceBetween(location, n))}
              />
            </Reveal>
          ))}
        </div>
      </section>
      <Reveal className="time-banner">
        <div className="time-illustration">
          <Clock size={49} strokeWidth={0.8} />
          <span>à ton rythme</span>
        </div>
        <div className="time-banner-copy">
          <span className="eyebrow">UNE PARENTHÈSE DANS TA JOURNÉE</span>
          <h2>Tu as combien de temps ?</h2>
          <p>On te prépare une balade. Tu n’as plus qu’à suivre ton envie.</p>
        </div>
        <div className="time-banner-controls">
          <TimeSelector selected={time} onChange={setTime} />
          <Link href={`/balade?duree=${time}`} className="text-link">
            Dessine-moi une balade <ArrowRight size={16} />
          </Link>
        </div>
      </Reveal>
      <section className="home-section mood-section">
        <Reveal className="section-heading">
          <div>
            <span className="eyebrow">LE PARIS QUI TE RESSEMBLE</span>
            <h2>Aujourd’hui, je veux…</h2>
          </div>
          <span className="small-note">Un peu de ceci, un peu de cela.</span>
        </Reveal>
        <MoodFilters selected={mood} onChange={setMood} />
        <DiscoveryStatus />
        <div className="place-grid mood-results">
          {picks.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      </section>
      <Reveal className="surprise-banner">
        <div className="surprise-symbol">✳</div>
        <div>
          <span className="eyebrow">
            LES JOLIS HASARDS FONT LES BELLES JOURNÉES
          </span>
          <h2>Et si tu te laissais surprendre ?</h2>
          <p>
            Une adresse, un petit secret, un détour que tu n’avais pas prévu.
          </p>
        </div>
        <button className="button light" onClick={random}>
          <Shuffle size={17} />
          Flâne au hasard <ArrowUpRight size={16} />
        </button>
      </Reveal>
      <Sheet
        open={!!surprise}
        onClose={() => setSurprise(null)}
        title="Ton prochain joli hasard"
      >
        {surprise && (
          <>
            <p className="muted">
              À deux rues d’ici, il y a quelque chose que tu devrais voir.
            </p>
            <PlaceCard place={surprise} />
            <p className="surprise-note">
              Le petit détail :{" "}
              {surprise.id === "place-felix"
                ? "ce quartier était encore un village indépendant avant 1860."
                : "prends une minute pour regarder les façades autour de toi avant de repartir."}
            </p>
            <button className="button outline full" onClick={random}>
              <Shuffle size={16} />
              Un autre petit hasard
            </button>
          </>
        )}
      </Sheet>
    </div>
  );
}
