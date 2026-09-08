"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Footprints, ArrowUpRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useFlane } from "./AppProvider";
import { Sheet } from "./Sheet";
import { categoryLabels } from "@/data/places";
import { distanceBetween, walkingMinutes } from "@/services/location";
import type { Place } from "@/types";
export function FavoriteButton({ id, name }: { id: string; name: string }) {
  const { notebook, toggleFavorite, ready } = useFlane();
  const favorite = notebook.favorites.includes(id);
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      className={`favorite-button ${favorite ? "saved" : ""}`}
      aria-label={`${favorite ? "Retirer" : "Ajouter"} ${name} ${favorite ? "du" : "au"} carnet`}
      aria-pressed={favorite}
      disabled={!ready}
      onClick={() => toggleFavorite(id)}
    >
      <Heart size={18} fill={favorite ? "currentColor" : "none"} />
    </motion.button>
  );
}
export function CollectionButton({ place }: { place: Place }) {
  const { notebook, addToCollection, createCollection } = useFlane();
  const [open, setOpen] = useState(false),
    [name, setName] = useState("");
  return (
    <>
      <button className="text-link" onClick={() => setOpen(true)}>
        <Plus size={15} />
        Dans une collection
      </button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Une place dans ton carnet"
      >
        <p className="muted">Où ranger {place.name} ?</p>
        <div className="collection-options">
          {notebook.collections.map((c) => (
            <button
              className="area-option"
              key={c.id}
              onClick={() => addToCollection(c.id, place.id)}
            >
              <span>{c.name}</span>
              <span>{c.placeIds.includes(place.id) ? "✓" : "+"}</span>
            </button>
          ))}
        </div>
        <form
          className="inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            createCollection(name);
            setName("");
          }}
        >
          <input
            aria-label="Nom de la nouvelle collection"
            placeholder="Une nouvelle collection…"
            value={name}
            maxLength={50}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button
            className="icon-button primary"
            aria-label="Créer la collection"
          >
            <Plus size={20} />
          </button>
        </form>
      </Sheet>
    </>
  );
}
export function PlaceCard({
  place,
  compact = false,
}: {
  place: Place;
  compact?: boolean;
}) {
  const { location } = useFlane();
  const minutes = walkingMinutes(distanceBetween(location, place));
  return (
    <article className={`place-card ${compact ? "compact" : ""}`}>
      <div className="place-photo">
        <Link href={`/lieu/${place.id}`} tabIndex={-1} aria-hidden="true">
          <Image
            src={place.image}
            alt=""
            fill
            sizes="(max-width: 600px) 90vw, 360px"
          />
        </Link>
        <FavoriteButton id={place.id} name={place.name} />
        <span className="photo-tag">{categoryLabels[place.category]}</span>
      </div>
      <div className="place-info">
        <div className="eyebrow-row">
          <span className="eyebrow">PARIS {place.arrondissement}e</span>
          <span className="walking">
            <Footprints size={13} />
            {minutes} min
          </span>
        </div>
        <Link href={`/lieu/${place.id}`} className="place-title">
          <h3>{place.name}</h3>
          <ArrowUpRight size={17} />
        </Link>
        <p>{place.shortDescription}</p>
        <div className="place-card-bottom">
          <span>
            {place.priceLevel
              ? "€".repeat(place.priceLevel)
              : "Une pause gratuite"}
          </span>
          <CollectionButton place={place} />
        </div>
      </div>
    </article>
  );
}
