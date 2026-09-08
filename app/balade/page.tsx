import { Suspense } from "react";
import { WalkPage } from "@/components/WalkPage";
export default function Page() {
  return (
    <Suspense
      fallback={<div className="loading-block">On dessine ta balade…</div>}
    >
      <WalkPage />
    </Suspense>
  );
}
