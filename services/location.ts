import type { Coordinates } from "@/types";
export const defaultLocation: Coordinates = {
  latitude: 48.8925,
  longitude: 2.3274,
};
export function distanceBetween(a: Coordinates, b: Coordinates): number {
  const rad = (n: number) => (n * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude),
    dLon = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) *
      Math.cos(rad(b.latitude)) *
      Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
export function walkingMinutes(distance: number) {
  return Math.max(1, Math.ceil(((distance * 1.25) / 4.5) * 60));
}
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation)
      return reject(
        new Error("La localisation n’est pas disponible sur cet appareil."),
      );
    navigator.geolocation.getCurrentPosition(
      (p) =>
        resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      () =>
        reject(
          new Error(
            "La localisation est indisponible. Choisis un quartier pour continuer.",
          ),
        ),
      { timeout: 10000, maximumAge: 120000, enableHighAccuracy: false },
    );
  });
}
