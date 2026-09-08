"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, ArrowUp, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useFlane } from "./AppProvider";
import { PlaceCard } from "./PlaceCard";
import { localAssistant } from "@/services/assistant";
import type { RankedPlace } from "@/types";
const suggestions = [
  "Un café cosy près de moi",
  "J’ai 2h à Montmartre",
  "Raconte-moi ce quartier",
  "Du vintage dans le Marais",
  "Un plan pluie",
  "Un endroit joli et pas trop cher",
];
type Exchange = {
  id: string;
  question: string;
  message: string;
  places: RankedPlace[];
};
export function AskPage() {
  const params = useSearchParams();
  const { location, weather } = useFlane();
  const [input, setInput] = useState(params.get("q") ?? ""),
    [busy, setBusy] = useState(false),
    [history, setHistory] = useState<Exchange[]>([]);
  const answerRef = useRef<HTMLDivElement>(null);
  const lock = useRef(false);
  useEffect(() => {
    if (history.length)
      answerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [history.length]);
  async function ask(text: string) {
    if (!text.trim() || lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      const answer = await localAssistant.ask(text, { location, weather });
      setHistory((h) => [
        ...h,
        { id: crypto.randomUUID(), question: text.trim(), ...answer },
      ]);
      setInput("");
    } catch {
      setHistory((h) => [
        ...h,
        {
          id: crypto.randomUUID(),
          question: text,
          message:
            "J’ai perdu le fil un instant. Essaie de reformuler ton envie.",
          places: [],
        },
      ]);
    } finally {
      setBusy(false);
      lock.current = false;
    }
  }
  return (
    <div className="page-shell">
      <div className="chat-layout">
        <div className="page-intro chat-intro">
          <div className="assistant-mark">
            <Sparkles size={28} strokeWidth={1.2} />
          </div>
          <span className="eyebrow">TON AMI PARISIEN A QUELQUES IDÉES</span>
          <h1>
            Qu’est-ce qui te <em>ferait plaisir ?</em>
          </h1>
          <p>
            Un lieu, une envie, une heure devant toi.
            <br />
            Raconte-moi, on trouve ton petit bonheur.
          </p>
        </div>
        <form
          className="ask-form"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <textarea
            aria-label="Ton envie à Paris"
            placeholder="Un déjeuner sympa vers Villiers dans une jolie rue…"
            value={input}
            maxLength={700}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                ask(input);
              }
            }}
          />
          <button
            className="icon-button"
            aria-label="Envoyer ma demande"
            disabled={busy || !input.trim()}
          >
            {busy ? (
              <LoaderCircle className="animate-spin" size={21} />
            ) : (
              <ArrowUp size={22} />
            )}
          </button>
        </form>
        <div className="suggestions">
          {suggestions.map((s) => (
            <button key={s} onClick={() => ask(s)} disabled={busy}>
              {s}
            </button>
          ))}
        </div>
        <p className="chat-help">
          Une petite sélection parisienne, sans connexion à un assistant IA. Les
          idées viennent de notre carnet de démonstration.
        </p>
        <div className="conversation" aria-live="polite" aria-busy={busy}>
          {history.map((exchange, i) => (
            <motion.div
              key={exchange.id}
              ref={i === history.length - 1 ? answerRef : undefined}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="chat-user">{exchange.question}</div>
              <div className="chat-answer">
                <div className="chat-answer-header">
                  <Sparkles size={17} />
                  <strong>FLÂNE</strong>
                  <span>a une petite idée</span>
                </div>
                <p>{exchange.message}</p>
                <div className="place-grid">
                  {exchange.places.map((p) => (
                    <PlaceCard key={p.id} place={p} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
