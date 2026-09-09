import type { RankedPlace, RecommendationInput } from "@/types";

export type AiAnswer = {
  message: string;
  places: RankedPlace[];
  searched: boolean;
};

export async function askOpenAI(
  question: string,
  context: RecommendationInput,
): Promise<AiAnswer> {
  const response = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      location: context.location,
      weather: context.weather,
    }),
    signal: AbortSignal.timeout(30000),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error ?? "L’assistant n’est pas disponible.");
  return data as AiAnswer;
}
