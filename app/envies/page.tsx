import { Suspense } from "react";
import { RecommendationsPage } from "@/components/RecommendationsPage";
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="loading-block">On cherche tes petits détours…</div>
      }
    >
      <RecommendationsPage />
    </Suspense>
  );
}
