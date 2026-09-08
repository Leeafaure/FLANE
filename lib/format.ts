export function formatDistance(kilometers: number) {
  return kilometers < 1
    ? `${Math.round(kilometers * 1000)} m`
    : `${kilometers.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} km`;
}
