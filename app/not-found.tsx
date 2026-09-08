import Link from "next/link";
import { Compass, ArrowUpRight } from "lucide-react";
export default function NotFound() {
  return (
    <div className="page-shell">
      <div className="empty-state" style={{ marginTop: 45 }}>
        <Compass size={40} strokeWidth={1} />
        <span className="eyebrow">UN PETIT DÉTOUR IMPRÉVU</span>
        <h1 style={{ fontSize: 58, marginTop: 15 }}>
          On s’est un peu <em>perdus.</em>
        </h1>
        <p>
          Cette adresse n’est pas dans notre carnet. Paris a encore de jolies
          choses à nous montrer.
        </p>
        <Link href="/" className="button primary">
          Revenir flâner <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  );
}
