import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Footprints } from "lucide-react";
import type { Neighborhood } from "@/types";
export function NeighborhoodCard({
  neighborhood: n,
  walkingTime,
}: {
  neighborhood: Neighborhood;
  walkingTime?: number;
}) {
  return (
    <Link href={`/quartier/${n.id}`} className="neighborhood-card">
      <div className="neighborhood-photo">
        <Image
          src={n.image}
          alt={`Une atmosphère de Paris, pour flâner à ${n.name}`}
          fill
          sizes="(max-width: 600px) 82vw, (max-width: 900px) 45vw, 360px"
        />
        <span className="photo-tag">
          PARIS {n.arrondissement}
          <sup>e</sup>
        </span>
        <span className="photo-arrow">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="neighborhood-info">
        <div className="card-title-row">
          <h3>{n.name}</h3>
          <span className="walking">
            <Footprints size={13} />
            {walkingTime ?? n.walkingTime} min
          </span>
        </div>
        <p>{n.description}</p>
      </div>
    </Link>
  );
}
