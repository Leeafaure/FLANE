import { Suspense } from "react";
import { AskPage } from "@/components/AskPage";
export default function Page() {
  return (
    <Suspense fallback={<div className="loading-block">FLÂNE est à toi…</div>}>
      <AskPage />
    </Suspense>
  );
}
