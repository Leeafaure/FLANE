export type Coordinates = { latitude: number; longitude: number };
export type Area = Coordinates & { id:string; name:string; arrondissement:string; kind:"official"|"popular"|"arrondissement"; aliases?:string[] };
export type Category = "restaurant" | "cafe" | "walk" | "shop" | "curiosity";
export type Place = Coordinates & {
  id: string;
  name: string;
  category: Category;
  neighborhood: string;
  arrondissement: number;
  shortDescription: string;
  editorialDescription: string;
  priceLevel: 0 | 1 | 2 | 3 | null;
  source?: "osm";
  sourceUrl?: string;
  updatedAt?: string;
  tags: string[];
  indoor: boolean;
  outdoor: boolean;
  weatherSuitability: ("sun" | "rain")[];
  walkingTime: number;
  address: string;
  image: string;
};
export type Neighborhood = Coordinates & {
  id: string;
  name: string;
  arrondissement: string;
  subtitle: string;
  description: string;
  image: string;
  walkingTime: number;
  history: string;
  streets: { name: string; description: string }[];
  source: string;
};
export type Weather = {
  temperature: number;
  feelsLike: number;
  condition: string;
  rain: boolean;
  dryMinutes: number;
  sunset: string;
  source: "demo" | "open-meteo";
  hourly: { time: string; temperature: number; rainProbability: number }[];
};
export type RecommendationInput = {
  location: Coordinates;
  weather: Weather;
  timeAvailable?: number;
  mood?: string[];
  category?: Category;
  budget?: number;
  neighborhood?: string;
  radius?: number;
};
export type RankedPlace = Place & {
  distance: number;
  walkingTime: number;
  score: number;
};
export type Collection = { id: string; name: string; placeIds: string[] };
export type Notebook = {
  version: 1;
  favorites: string[];
  collections: Collection[];
  savedPlaces?: Place[];
};
export type WalkStop = {
  place: Place;
  minutes: number;
  time: string;
  note: string;
};
