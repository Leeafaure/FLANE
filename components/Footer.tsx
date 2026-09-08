import Link from "next/link";
export function Footer() {
  return (
    <footer className="site-footer">
      <span className="footer-brand">FLÂNE</span>
      <span>Moins de plans. Plus de Paris.</span>
      <Link href="/a-propos">
        À propos & crédits <span>↗</span>
      </Link>
    </footer>
  );
}
