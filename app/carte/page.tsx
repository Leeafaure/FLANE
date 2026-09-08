import { Suspense } from "react";
import { MapPage } from "@/components/MapPage";
export default function Page() {
  return (
    <Suspense fallback={<div className="loading-block">Paris se dessine…</div>}>
      <MapPage />
    </Suspense>
  );
}
