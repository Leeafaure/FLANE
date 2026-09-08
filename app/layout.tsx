import type { Metadata, Viewport } from "next";
import { AppProvider } from "@/components/AppProvider";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Footer } from "@/components/Footer";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "FLÂNE — Paris, au gré de tes envies.",
    template: "%s · FLÂNE",
  },
  description:
    "Un ami parisien dans ta poche. De petites rues en bonnes adresses, découvre Paris à ton rythme.",
  applicationName: "FLÂNE",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "FLÂNE" },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4F0E8",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AppProvider>
          <a href="#main" className="skip-link">
            Aller au contenu
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <BottomNavigation />
        </AppProvider>
      </body>
    </html>
  );
}
