"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";
import { findArea, nearestArea } from "@/services/areas";
import { places as editorialPlaces } from "@/data/places";
import { discoverPlaces } from "@/services/discovery";
import {
  defaultLocation,
  distanceBetween,
  getCurrentLocation,
} from "@/services/location";
import { getMockWeather, openMeteoProvider } from "@/services/weather";
import { emptyNotebook, localNotebookRepository } from "@/services/notebook";
import type { Coordinates, Notebook, Weather, Place } from "@/types";
type AppContextValue = {
  location: Coordinates;
  area: string;
  allPlaces: Place[];
  nearbyPlaces: Place[];
  registerPlaces: (places: Place[]) => void;
  discoveryLoading: boolean;
  discoveryError: string;
  retryDiscovery: () => void;
  setArea: (id: string) => void;
  locate: () => Promise<void>;
  locating: boolean;
  weather: Weather;
  refreshWeather: () => Promise<void>;
  weatherLoading: boolean;
  notebook: Notebook;
  toggleFavorite: (id: string) => void;
  createCollection: (name: string) => string | undefined;
  addToCollection: (collectionId: string, placeId: string) => void;
  removeCollection: (id: string) => void;
  toast: (message: string) => void;
  ready: boolean;
};
const Context = createContext<AppContextValue | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(defaultLocation),
    [area, setAreaName] = useState("guy-moquet"),
    [locating, setLocating] = useState(false);
  const [allPlaces, setAllPlaces] = useState<Place[]>(editorialPlaces);
  const [discoveryLoading, setDiscoveryLoading] = useState(false),
    [discoveryError, setDiscoveryError] = useState(""),
    [retry, setRetry] = useState(0);
  const registerPlaces = useCallback(
    (incoming: Place[]) =>
      setAllPlaces((previous) => {
        const map = new Map(previous.map((p) => [p.id, p]));
        for (const p of incoming) map.set(p.id, p);
        return [...map.values()];
      }),
    [],
  );
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setDiscoveryLoading(true);
      setDiscoveryError("");
      discoverPlaces(location)
        .then((result) => {
          if (active) registerPlaces(result.places);
        })
        .catch((error) => {
          if (active) setDiscoveryError(error.message);
        })
        .finally(() => {
          if (active) setDiscoveryLoading(false);
        });
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [location, retry, registerPlaces]);
  const nearbyPlaces = allPlaces.filter(
    (p) => distanceBetween(location, p) <= 1.8,
  );
  const [weather, setWeather] = useState<Weather>(getMockWeather),
    [weatherLoading, setWeatherLoading] = useState(false);
  const [notebook, setNotebook] = useState<Notebook>(emptyNotebook),
    [ready, setReady] = useState(false),
    [notice, setNotice] = useState("");
  useEffect(() => {
    const handle = setTimeout(() => {
      const saved = localNotebookRepository.load();
      setNotebook(saved);
      if (saved.savedPlaces?.length) registerPlaces(saved.savedPlaces);
      try {
        const previous = findArea(localStorage.getItem("flane:area"));
        if (previous) {
          setAreaName(previous.id);
          setLocation(previous);
        }
      } catch {}
      setReady(true);
    }, 0);
    return () => clearTimeout(handle);
  }, [registerPlaces]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);
  const toast = useCallback((message: string) => setNotice(message), []);
  function persist(next: Notebook) {
    try {
      const complete = {
        ...next,
        savedPlaces: allPlaces.filter(
          (p) => p.source === "osm" && next.favorites.includes(p.id),
        ),
      };
      localNotebookRepository.save(complete);
      setNotebook(complete);
      return true;
    } catch {
      toast(
        "Le stockage de cet appareil est indisponible. Tes modifications ne sont pas enregistrées.",
      );
      return false;
    }
  }
  function setArea(id: string) {
    const selected = findArea(id);
    if (selected) {
      setAreaName(id);
      try {
        localStorage.setItem("flane:area", id);
      } catch {}
      setLocation(selected);
      setWeather(getMockWeather());
    }
  }
  async function locate() {
    setLocating(true);
    try {
      const point = await getCurrentLocation();
      setLocation(point);
      setWeather(getMockWeather());
      const nearest = nearestArea(point);
      setAreaName(distanceBetween(point, nearest) < 3 ? nearest.id : "current");
      toast("Position actualisée. À nous les petits détours.");
    } catch (e) {
      toast((e as Error).message);
    } finally {
      setLocating(false);
    }
  }
  async function refreshWeather() {
    setWeatherLoading(true);
    try {
      setWeather(await openMeteoProvider.getWeather(location));
      toast("La météo est à jour.");
    } catch {
      toast(
        "La météo en direct est indisponible. Les prévisions de démonstration restent affichées.",
      );
    } finally {
      setWeatherLoading(false);
    }
  }
  function toggleFavorite(id: string) {
    if (!ready) return;
    const exists = notebook.favorites.includes(id);
    if (
      persist({
        ...notebook,
        favorites: exists
          ? notebook.favorites.filter((p) => p !== id)
          : [...notebook.favorites, id],
        collections: exists
          ? notebook.collections.map((c) => ({
              ...c,
              placeIds: c.placeIds.filter((p) => p !== id),
            }))
          : notebook.collections,
      })
    )
      toast(
        exists
          ? "Adresse retirée du carnet."
          : "Une nouvelle adresse dans ton Paris.",
      );
  }
  function createCollection(name: string) {
    if (!ready) return;
    const clean = name.trim().slice(0, 50);
    if (!clean) return;
    if (
      notebook.collections.some(
        (c) => c.name.toLowerCase() === clean.toLowerCase(),
      )
    ) {
      toast("Cette collection existe déjà.");
      return;
    }
    const id = crypto.randomUUID();
    if (
      !persist({
        ...notebook,
        collections: [
          ...notebook.collections,
          { id, name: clean, placeIds: [] },
        ],
      })
    )
      return;
    toast(`« ${clean} » est prête à se remplir.`);
    return id;
  }
  function addToCollection(collectionId: string, placeId: string) {
    if (!ready) return;
    const collection = notebook.collections.find((c) => c.id === collectionId);
    if (!collection) return;
    const exists = collection.placeIds.includes(placeId);
    if (
      persist({
        ...notebook,
        favorites: notebook.favorites.includes(placeId)
          ? notebook.favorites
          : [...notebook.favorites, placeId],
        collections: notebook.collections.map((c) =>
          c.id === collectionId
            ? {
                ...c,
                placeIds: exists
                  ? c.placeIds.filter((p) => p !== placeId)
                  : [...c.placeIds, placeId],
              }
            : c,
        ),
      })
    )
      toast(
        exists
          ? "Adresse retirée de la collection."
          : `Adresse ajoutée à « ${collection.name} ».`,
      );
  }
  function removeCollection(id: string) {
    if (
      persist({
        ...notebook,
        collections: notebook.collections.filter((c) => c.id !== id),
      })
    )
      toast("Collection supprimée. Tes favoris sont conservés.");
  }
  return (
    <Context.Provider
      value={{
        location,
        area,
        allPlaces,
        nearbyPlaces,
        registerPlaces,
        discoveryLoading,
        discoveryError,
        retryDiscovery: () => setRetry((v) => v + 1),
        setArea,
        locate,
        locating,
        weather,
        refreshWeather,
        weatherLoading,
        notebook,
        toggleFavorite,
        createCollection,
        addToCollection,
        removeCollection,
        toast,
        ready,
      }}
    >
      <MotionConfig reducedMotion="user">
        {children}
        <div className={`toast ${notice ? "visible" : ""}`} role="status">
          {notice}
        </div>
      </MotionConfig>
    </Context.Provider>
  );
}
export function useFlane() {
  const value = useContext(Context);
  if (!value) throw new Error("FLÂNE provider is missing");
  return value;
}
