export type SearchIntent = {
  intent:
    | "restaurant"
    | "cafe"
    | "bar"
    | "bakery"
    | "shopping"
    | "museum"
    | "gallery"
    | "walk"
    | "park"
    | "sightseeing"
    | "neighborhood"
    | "street_story"
    | "surprise";
  radiusMeters: number;
  budgetMaxPerPerson?: number;
  priceLevels?: string[];
  moods: string[];
  timeAvailableMinutes?: number;
  mustBeOpen: boolean;
  keywords: string[];
  confidence: number;
};
