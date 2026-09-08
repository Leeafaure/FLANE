"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page-shell">
      <div className="empty-state">
        <h2>Une petite pause imprévue.</h2>
        <p>La page n’a pas pu s’ouvrir. On essaie encore ?</p>
        <button className="button primary" onClick={reset}>
          Réessayer
        </button>
        <br />
        <Link className="text-link" href="/">
          Revenir à l’accueil
        </Link>
      </div>
    </div>
  );
}
