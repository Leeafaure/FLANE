import { areas, neighborhoods } from "@/data/neighborhoods";
import { anecdotes } from "@/data/anecdotes";
import { streets } from "@/data/streets";
import { distanceBetween } from "@/services/location";
import { getRecommendations } from "@/services/recommendations";
import type { Category, RecommendationInput } from "@/types";
export function parseRequest(text: string): Partial<RecommendationInput> & {
  rainy?: boolean;
  ambiance?: string;
  moment?: string;
  maxDistance?: number;
} {
  const q = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const place =
    areas.find((a) =>
      q.includes(
        a.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
      ),
    ) ??
    (q.includes("marais") ? areas.find((a) => a.id === "marais") : undefined);
  const category: Category | undefined = /cafe|coffee/.test(q)
    ? "cafe"
    : /dejeun|manger|restaurant|faim|diner/.test(q)
      ? "restaurant"
      : /vintage|boutique|shopping/.test(q)
        ? "shop"
        : /raconte|histoire|anecdote/.test(q)
          ? "curiosity"
          : /balad|marcher|promen/.test(q)
            ? "walk"
            : undefined;
  const time = q.match(/(\d+)\s*(h|heure|min)/);
  const timeAvailable = time
    ? Number(time[1]) * (time[2].startsWith("h") ? 60 : 1)
    : /apres.midi/.test(q)
      ? 240
      : undefined;
  const mood = [
    /cosy/.test(q) && "cosy",
    /calme/.test(q) && "du calme",
    /joli/.test(q) && "du joli",
    /vintage/.test(q) && "du vintage",
    /terrasse/.test(q) && "une terrasse",
    /cache/.test(q) && "caché",
    /pas cher/.test(q) && "pas cher",
  ].filter((s): s is string => Boolean(s));
  const budgetMatch = q.match(/(\d+)\s*(€|euros?)/);
  const budget = budgetMatch
    ? Number(budgetMatch[1]) <= 10
      ? 1
      : Number(budgetMatch[1]) <= 30
        ? 2
        : 3
    : /pas cher|petit budget/.test(q)
      ? 1
      : undefined;
  const distance = q.match(/(\d+)\s*(km|metres?|m\b)/);
  return {
    category,
    timeAvailable,
    mood,
    budget,
    rainy: /pluie|pleut/.test(q),
    ...(place
      ? {
          location: place,
          neighborhood:
            place.id === "abbesses"
              ? "montmartre"
              : place.id === "saint-paul"
                ? "marais"
                : place.id,
        }
      : {}),
    ambiance: mood.join(", "),
    moment: /soir|diner/.test(q)
      ? "soir"
      : /matin/.test(q)
        ? "matin"
        : /dejeun/.test(q)
          ? "midi"
          : undefined,
    maxDistance: distance
      ? Number(distance[1]) / (distance[2] === "km" ? 1 : 1000)
      : undefined,
  };
}
export interface AssistantProvider {
  ask(
    text: string,
    context: RecommendationInput,
  ): Promise<{
    message: string;
    places: ReturnType<typeof getRecommendations>;
  }>;
}
export const localAssistant: AssistantProvider = {
  async ask(text, context) {
    const intent = parseRequest(text);
    if (
      /raconte|histoire|anecdote/i.test(text) &&
      intent.category === "curiosity"
    ) {
      const point = intent.location ?? context.location;
      const neighborhood =
        neighborhoods.find((n) => n.id === intent.neighborhood) ??
        [...neighborhoods].sort(
          (a, b) => distanceBetween(point, a) - distanceBetween(point, b),
        )[0];
      const story = anecdotes.find((a) => a.neighborhood === neighborhood.id);
      const street = /rue des dames/i.test(text) ? streets[0] : undefined;
      return {
        message: street
          ? `${street.name}. ${street.origin} ${street.lookUp}`
          : `${neighborhood.name}. ${neighborhood.history} ${story ? `Et le petit détail à raconter : ${story.text}` : ""}`,
        places: getRecommendations({
          ...context,
          location: point,
          neighborhood: street ? "batignolles" : neighborhood.id,
          category: "curiosity",
        }).slice(0, 3),
      };
    }
    const weather = intent.rainy
      ? { ...context.weather, rain: true }
      : context.weather;
    let results = getRecommendations({ ...context, ...intent, weather });
    if (intent.maxDistance !== undefined)
      results = results.filter((p) => p.distance <= intent.maxDistance!);
    if (intent.rainy) results = results.filter((p) => p.indoor);
    const selected = results.slice(0, 3);
    const message = selected.length
      ? `${intent.rainy ? "On reste au sec. " : ""}${intent.neighborhood ? "Pour ce quartier, " : "À ta place, "}je commencerais par ${selected[0].name}. ${intent.timeAvailable ? `J’ai gardé en tête tes ${intent.timeAvailable} minutes. ` : ""}Voici ${selected.length === 1 ? "une adresse qui devrait te plaire" : "quelques idées pour prendre ton temps"}.`
      : "Pas encore de pépite qui coche toutes ces envies dans notre petit carnet. Essaie un autre quartier ou un peu plus de temps.";
    return { message, places: selected };
  },
};
