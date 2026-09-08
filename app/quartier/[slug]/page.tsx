import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Footprints } from "lucide-react";
import { neighborhoods } from "@/data/neighborhoods";
import { anecdotes } from "@/data/anecdotes";
import { places } from "@/data/places";
import { AnecdoteCard } from "@/components/AnecdoteCard";
import { PlaceCard } from "@/components/PlaceCard";
import { Reveal } from "@/components/Reveal";
export function generateStaticParams() {
  return neighborhoods.map((n) => ({ slug: n.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: neighborhoods.find((n) => n.id === slug)?.name ?? "Quartier",
  };
}
export default async function NeighborhoodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const n = neighborhoods.find((n) => n.id === slug);
  if (!n) notFound();
  const local = places.filter((p) => p.neighborhood === n.id);
  return (
    <div className="page-shell neighborhood-section">
      <Link href="/paris" className="back-link">
        <ArrowLeft size={14} />
        Les petits Paris
      </Link>
      <Reveal className="detail-hero">
        <Image
          src={n.image}
          alt={`Une ambiance parisienne à découvrir à ${n.name}`}
          fill
          priority
          sizes="100vw"
        />
        <div className="detail-hero-copy">
          <span className="eyebrow">
            LE CARNET DE QUARTIER · PARIS {n.arrondissement}e
          </span>
          <h1>{n.name}</h1>
          <p>{n.subtitle}</p>
        </div>
        <span className="district-number" aria-hidden="true">
          {n.arrondissement.split(" ")[0]}
        </span>
      </Reveal>
      <nav className="neighborhood-subnav" aria-label="Dans ce quartier">
        <a href="#histoire">La petite histoire</a>
        <a href="#anecdotes">À raconter</a>
        <a href="#rues">Les jolies rues</a>
        <a href="#balade">La balade</a>
        <a href="#adresses">Bonnes adresses</a>
      </nav>
      <section id="histoire" className="history-section editorial-section">
        <h2>
          L’histoire
          <br />
          en <em>1 minute.</em>
        </h2>
        <div>
          <p>{n.history}</p>
          <a
            className="text-link"
            href={n.source}
            target="_blank"
            rel="noreferrer"
          >
            Pour les curieux <ArrowUpRight size={13} />
          </a>
        </div>
      </section>
      <section id="anecdotes" className="editorial-section">
        <h2>3 histoires à glisser dans la conversation.</h2>
        <div className="anecdote-grid">
          {anecdotes
            .filter((a) => a.neighborhood === n.id)
            .map((a, i) => (
              <AnecdoteCard key={a.id} {...a} index={i} />
            ))}
        </div>
      </section>
      <section id="rues" className="editorial-section">
        <h2>
          Les rues à <em>regarder.</em>
        </h2>
        <div className="streets-list">
          {n.streets.map((s) => (
            <div key={s.name}>
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              {s.name === "Rue des Dames" && (
                <Link className="text-link" href="/rue/rue-des-dames">
                  Raconte-moi cette rue <ArrowUpRight size={14} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
      <section id="balade" className="editorial-section mini-walk-banner">
        <div>
          <span className="eyebrow">UN PAS APRÈS L’AUTRE</span>
          <h2 style={{ marginTop: 8 }}>La balade idéale.</h2>
          <p>Un café, de petites rues et quelques pauses bien choisies.</p>
        </div>
        <Link
          className="button primary"
          href={`/balade?quartier=${n.id}&duree=120`}
        >
          <Footprints size={17} />
          On y va ? <ArrowUpRight size={16} />
        </Link>
      </section>
      <div id="adresses">
        {[
          { category: "restaurant", title: "On passe à table ?" },
          { category: "cafe", title: "Le temps d’un café." },
          { category: "walk", title: "À ne pas rater." },
        ].map((section) => (
          <section key={section.category} className="editorial-section">
            <h2>{section.title}</h2>
            <div className="place-grid">
              {local
                .filter((p) => p.category === section.category)
                .slice(0, 2)
                .map((p) => (
                  <PlaceCard key={p.id} place={p} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
