import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { neighborhoods, areas } from "@/data/neighborhoods";
import { NeighborhoodCard } from "@/components/NeighborhoodCard";
import { Reveal } from "@/components/Reveal";
export const metadata: Metadata = { title: "Les petits Paris" };
export default function Paris() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <span className="eyebrow">UNE VILLE, MILLE FAÇONS DE LA VIVRE</span>
        <h1>
          À chacun son <em>Paris.</em>
        </h1>
        <p>
          Des villages dans la ville, des rues qui ont une âme. Choisis un
          quartier, laisse le reste venir.
        </p>
      </div>
      <div className="neighborhood-grid">
        {neighborhoods.map((n, i) => (
          <Reveal key={n.id} delay={i * 0.08}>
            <NeighborhoodCard neighborhood={n} />
          </Reveal>
        ))}
      </div>
      <section className="editorial-section">
        <div className="section-heading">
          <h2>Et juste à côté…</h2>
          <Link href="/carte" className="text-link">
            Ouvrir la carte <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="area-grid">
          {areas
            .filter((a) => !neighborhoods.some((n) => n.id === a.id))
            .map((a) => (
              <Link
                className="area-option"
                href={`/envies?quartier=${a.id === "abbesses" ? "montmartre" : a.id === "saint-paul" ? "marais" : a.id}`}
                key={a.id}
              >
                <span>{a.name}</span>
                <small>Paris {a.arrondissement} ↗</small>
              </Link>
            ))}
        </div>
      </section>
      <div className="mini-walk-banner editorial-section">
        <div>
          <h2>Paris se raconte en marchant.</h2>
          <p>Une rue, une histoire et un petit détail à regarder.</p>
        </div>
        <Link className="button outline" href="/rue/rue-des-dames">
          Raconte-moi cette rue <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  );
}
