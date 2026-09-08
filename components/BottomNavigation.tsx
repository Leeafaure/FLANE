"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Map, NotebookPen, Sparkles, Building2 } from "lucide-react";
const tabs = [
  { href: "/", label: "Explorer", icon: Compass },
  { href: "/carte", label: "Carte", icon: Map },
  { href: "/demander", label: "Demander", icon: Sparkles },
  { href: "/carnet", label: "Carnet", icon: NotebookPen },
  { href: "/paris", label: "Paris", icon: Building2 },
];
export function BottomNavigation() {
  const path = usePathname();
  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/"
            ? path === "/"
            : path.startsWith(href) ||
              (href === "/paris" && path.startsWith("/quartier"));
        return (
          <Link
            href={href}
            key={href}
            className={`nav-item ${active ? "active" : ""} ${href === "/demander" ? "nav-ask" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="nav-icon">
              <Icon size={21} strokeWidth={1.6} />
            </span>
            <span>{label}</span>
            {active && <i />}
          </Link>
        );
      })}
    </nav>
  );
}
