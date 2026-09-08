import type { Notebook, Place } from "@/types";
const key = "flane:notebook:v1";
export const emptyNotebook: Notebook = {
  version: 1,
  favorites: [],
  collections: [
    { id: "a-tester", name: "À tester", placeIds: [] },
    { id: "adore", name: "J’ai adoré", placeIds: [] },
  ],
};
export interface NotebookRepository {
  load(): Notebook;
  save(notebook: Notebook): void;
}
export const localNotebookRepository: NotebookRepository = {
  load() {
    try {
      const value = JSON.parse(localStorage.getItem(key) ?? "null");
      if (
        value?.version === 1 &&
        Array.isArray(value.favorites) &&
        value.favorites.every((id: unknown) => typeof id === "string") &&
        Array.isArray(value.collections) &&
        value.collections.every(
          (c: { id?: unknown; name?: unknown; placeIds?: unknown }) =>
            typeof c?.id === "string" &&
            typeof c?.name === "string" &&
            Array.isArray(c?.placeIds) &&
            c.placeIds.every((id: unknown) => typeof id === "string"),
        )
      )
        return {...value,savedPlaces:Array.isArray(value.savedPlaces)?value.savedPlaces.filter((p:Place)=>p&&typeof p.id==="string"&&/^osm-(node|way|relation)-\d+$/.test(p.id)&&typeof p.name==="string"&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&["cafe","restaurant","walk","shop","curiosity"].includes(p.category)&&Array.isArray(p.tags)&&Array.isArray(p.weatherSuitability)&&typeof p.address==="string"&&typeof p.shortDescription==="string"&&typeof p.editorialDescription==="string"&&p.image===""&&p.source==="osm"):[]};
    } catch {}
    return structuredClone(emptyNotebook);
  },
  save(notebook) {
    localStorage.setItem(key, JSON.stringify(notebook));
  },
};
