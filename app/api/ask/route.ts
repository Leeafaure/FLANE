import { NextRequest, NextResponse } from "next/server";
import { getNearbyPlaces, validParisPoint } from "@/services/catalog.server";
import { distanceBetween, walkingMinutes } from "@/services/location";

export const runtime = "nodejs";

type AskBody = {
  question?: string;
  location?: { latitude?: number; longitude?: number };
  weather?: {
    temperature?: number;
    condition?: string;
    rain?: boolean;
    dryMinutes?: number;
  };
};

function responseText(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const response = payload as {
    output_text?: unknown;
    output?: { content?: { type?: string; text?: string }[] }[];
  };
  if (typeof response.output_text === "string")
    return response.output_text.trim();
  return (response.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((content) => content.type === "output_text")
    .map((content) => content.text ?? "")
    .join("\n")
    .trim();
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        configured: false,
        error: "L’assistant IA n’est pas encore configuré.",
      },
      { status: 503 },
    );
  }
  let body: AskBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "La demande est invalide." },
      { status: 400 },
    );
  }
  const question = body.question?.trim();
  const location = {
    latitude: Number(body.location?.latitude),
    longitude: Number(body.location?.longitude),
  };
  if (!question || question.length > 700 || !validParisPoint(location)) {
    return NextResponse.json(
      { error: "Indique une envie et un point de départ à Paris." },
      { status: 400 },
    );
  }

  const catalog = await getNearbyPlaces(location);
  const nearby = catalog.places.slice(0, 16).map((place) => ({
    id: place.id,
    name: place.name,
    type: place.category,
    address: place.address,
    distanceKm: Number(
      Math.hypot(
        place.latitude - location.latitude,
        place.longitude - location.longitude,
      ).toFixed(3),
    ),
  }));
  const instructions = `Tu es FLÂNE, un ami parisien élégant, concret et honnête. Réponds en français à une personne qui veut une idée à Paris. La question est : ${question}. Son contexte météo : ${body.weather?.temperature ?? "?"}°C, ${body.weather?.condition ?? "inconnu"}, pluie=${body.weather?.rain ? "oui" : "non"}, ${body.weather?.dryMinutes ?? "?"} minutes avant la pluie possible. Tu peux chercher le web pour les informations actuelles, mais ne prétends jamais qu’un lieu est ouvert ou que son prix est garanti. Propose un court plan de 2 à 4 phrases, adapté à la demande et à la météo. Si le web ne confirme pas une information, dis-le simplement. Voici un catalogue local de lieux proches, à privilégier pour les noms d’adresses : ${JSON.stringify(nearby)}. Ne produis ni markdown, ni liste, ni URL brute.`;
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
        input: instructions,
        tools: [{ type: "web_search" }],
        store: false,
        max_output_tokens: 350,
      }),
      signal: AbortSignal.timeout(25000),
    });
    const payload = await response.json();
    if (!response.ok) {
      const error =
        response.status === 429
          ? "L’assistant a atteint la limite de l’API OpenAI. Vérifie le crédit et les limites du projet OpenAI."
          : "FLÂNE ne peut pas répondre tout de suite.";
      return NextResponse.json({ error }, { status: response.status });
    }
    const message =
      responseText(payload) ||
      "J’ai une piste, mais pas encore les mots pour te la raconter.";
    return NextResponse.json({
      configured: true,
      message,
      places: catalog.places.slice(0, 6).map((place) => {
        const distance = distanceBetween(location, place);
        return {
          ...place,
          distance,
          walkingTime: walkingMinutes(distance),
          score: 0,
        };
      }),
      searched: true,
    });
  } catch {
    return NextResponse.json(
      { error: "FLÂNE ne peut pas répondre tout de suite." },
      { status: 503 },
    );
  }
}
