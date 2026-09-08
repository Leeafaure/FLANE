import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categoryLabels } from "@/data/places";
import { FavoriteButton } from "./PlaceCard";
import { Reveal } from "./Reveal";
import type { WalkStop } from "@/types";
export function WalkingTimeline({ stops }: { stops: WalkStop[] }) {
  return (
    <ol className="timeline" aria-label="Les étapes de ta balade">
      {stops.map((stop, i) => (
        <li className="timeline-stop" key={stop.place.id}>
          <time>{stop.time}</time>
          <span className="timeline-dot" />
          <Reveal className="timeline-card" delay={i * 0.05}>
            <span className="eyebrow">
              0{i + 1} · {categoryLabels[stop.place.category]}
            </span>
            <FavoriteButton id={stop.place.id} name={stop.place.name} />
            <Link href={`/lieu/${stop.place.id}`}>
              <h3>
                {stop.place.name}{" "}
                <ArrowUpRight size={14} style={{ display: "inline" }} />
              </h3>
            </Link>
            <p>{stop.place.shortDescription}</p>
            <small>{stop.note}</small>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
