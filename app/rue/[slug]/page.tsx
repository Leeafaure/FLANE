import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ScanEye } from "lucide-react";
import { streets } from "@/data/streets";
export function generateStaticParams() {
  return streets.map((s) => ({ slug: s.id }));
}
export default async function StreetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const street = streets.find((s) => s.id === slug);
  if (!street) notFound();
  return (
    <div className="page-shell street-page">
      <Link className="back-link" href="/quartier/batignolles">
        <ArrowLeft size={14} />
        Les Batignolles
      </Link>
      <header className="street-heading">
        <span className="eyebrow">RACONTE-MOI CETTE RUE · PARIS 17e</span>
        <h1>
          Rue des <em>Dames.</em>
        </h1>
        <p>À chaque rue sa petite histoire.</p>
      </header>
      <div className="street-content">
        <section>
          <h2>D’où vient ce nom ?</h2>
          <p>{street.origin}</p>
        </section>
        <section>
          <h2>Au fil de la rue.</h2>
          <p>{street.history}</p>
        </section>
        <section>
          <h2>Le petit détail à raconter.</h2>
          <p>{street.anecdote}</p>
        </section>
        <section>
          <h2>Le personnage du jour ?</h2>
          <p>
            La rue elle-même. Ici, on prend le temps de regarder les portes, les
            enseignes et les fenêtres qui font le caractère du quartier.
          </p>
        </section>
      </div>
      <section className="look-up">
        <ScanEye size={35} strokeWidth={1.2} />
        <div>
          <span className="eyebrow">JUSTE AUTOUR DE TOI</span>
          <h2>Lève les yeux.</h2>
          <p>{street.lookUp}</p>
        </div>
      </section>
      <a
        className="text-link"
        style={{ marginTop: 20 }}
        href={street.source}
        target="_blank"
        rel="noreferrer"
      >
        La source de cette petite histoire <ArrowUpRight size={14} />
      </a>
      <div className="mini-walk-banner editorial-section">
        <div>
          <h2>Une histoire en appelle une autre.</h2>
          <p>Les Batignolles ont encore quelques secrets à partager.</p>
        </div>
        <Link className="button primary" href="/quartier/batignolles#anecdotes">
          Je suis curieux <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
