"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Heart,
  NotebookPen,
  FolderOpen,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { useFlane } from "@/components/AppProvider";
import { PlaceCard } from "@/components/PlaceCard";
import { Sheet } from "@/components/Sheet";
import { places } from "@/data/places";
const filters = [
  { id: "all", name: "Tout mon Paris" },
  { id: "restaurant", name: "Restaurants" },
  { id: "cafe", name: "Cafés" },
  { id: "shop", name: "Boutiques" },
  { id: "walk", name: "Balades" },
];
export default function NotebookPage() {
  const { notebook, createCollection, removeCollection, ready } = useFlane();
  const [filter, setFilter] = useState("all"),
    [collection, setCollection] = useState<string | null>(null),
    [open, setOpen] = useState(false),
    [name, setName] = useState(""),
    [deleting, setDeleting] = useState(false);
  const current = notebook.collections.find((c) => c.id === collection);
  const saved = places.filter(
    (p) =>
      notebook.favorites.includes(p.id) &&
      (!current || current.placeIds.includes(p.id)) &&
      (filter === "all" || p.category === filter),
  );
  return (
    <div className="page-shell">
      <div className="notebook-heading">
        <div className="page-intro">
          <span className="eyebrow">
            LES ADRESSES PASSENT, LES ENVIES RESTENT
          </span>
          <h1>
            Mon <em>Paris.</em>
          </h1>
          <p>
            Les endroits à essayer, ceux où revenir.
            <br />
            Un carnet qui ne ressemble qu’à toi.
          </p>
        </div>
        <button
          className="button outline"
          disabled={!ready}
          onClick={() => setOpen(true)}
        >
          <Plus size={16} />
          Une nouvelle collection
        </button>
      </div>
      <div className="collection-grid">
        {notebook.collections.map((c) => (
          <button
            key={c.id}
            className={`collection-card ${collection === c.id ? "selected" : ""}`}
            aria-pressed={collection === c.id}
            onClick={() => setCollection(collection === c.id ? null : c.id)}
          >
            <FolderOpen size={22} strokeWidth={1.3} />
            <h3>{c.name}</h3>
            <span>
              {c.placeIds.length}{" "}
              {c.placeIds.length === 1
                ? "adresse à garder"
                : "adresses à garder"}
            </span>
          </button>
        ))}
      </div>
      <div className="notebook-tabs">
        {filters.map((f) => (
          <button
            className={`chip ${filter === f.id ? "selected" : ""}`}
            key={f.id}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.name}
          </button>
        ))}
      </div>
      <div className="results-intro">
        <p>{current ? current.name : "Tes petits coups de cœur."}</p>
        {current ? (
          <button className="text-link" onClick={() => setDeleting(true)}>
            <Trash2 size={13} />
            Supprimer la collection
          </button>
        ) : (
          <span>
            {notebook.favorites.length}{" "}
            {notebook.favorites.length === 1 ? "adresse" : "adresses"}
          </span>
        )}
      </div>
      {!ready ? (
        <div className="loading-block">On ouvre ton carnet…</div>
      ) : saved.length ? (
        <div className="place-grid">
          {saved.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          {current ? (
            <NotebookPen size={39} strokeWidth={1} />
          ) : (
            <Heart size={39} strokeWidth={1} />
          )}
          <h2>
            {current
              ? "Quelques pages à remplir."
              : "Le début d’une belle collection."}
          </h2>
          <p>
            {current
              ? "Sur une adresse, choisis « Dans une collection » pour la retrouver ici."
              : "Un café qui te fait envie ? Une rue où revenir ? Touche le cœur d’une adresse pour la garder ici."}
          </p>
          <Link className="button primary" href="/envies">
            Trouver mon premier coup de cœur <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
      <p className="demo-note">
        Ton carnet est enregistré sur cet appareil, dans ce navigateur.
      </p>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Un nouveau chapitre"
      >
        <p className="muted">
          Paris avec maman, les dimanches au calme… Donne-lui le nom de tes
          envies.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const id = createCollection(name);
            if (id) {
              setCollection(id);
              setFilter("all");
              setOpen(false);
              setName("");
            }
          }}
        >
          <div className="inline-form">
            <input
              autoComplete="off"
              aria-label="Nom de la collection"
              placeholder="Paris avec maman"
              value={name}
              required
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button className="button primary full" disabled={!name.trim()}>
            Créer ma collection <Plus size={16} />
          </button>
        </form>
      </Sheet>
      <Sheet
        open={deleting}
        onClose={() => setDeleting(false)}
        title="Supprimer cette collection ?"
      >
        <p className="muted">
          La collection « {current?.name} » sera supprimée. Les adresses
          resteront dans tes favoris.
        </p>
        <button
          className="button primary full"
          onClick={() => {
            if (collection) removeCollection(collection);
            setCollection(null);
            setDeleting(false);
          }}
        >
          Supprimer la collection
        </button>
        <button
          className="button outline full"
          onClick={() => setDeleting(false)}
        >
          La garder
        </button>
      </Sheet>
    </div>
  );
}
