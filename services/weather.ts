import type { Coordinates, Weather } from "@/types";
export function getMockWeather(): Weather {
  // A fixed demonstration hour keeps the server render and hydration identical.
  const hour = 17;
  return {
    temperature: 18,
    feelsLike: 19,
    condition: "Éclaircies",
    rain: false,
    dryMinutes: 180,
    sunset: "20:18",
    source: "demo",
    hourly: Array.from({ length: 5 }, (_, i) => ({
      time: `${String((hour + i) % 24).padStart(2, "0")}:00`,
      temperature: 18 - Math.floor(i / 2),
      rainProbability: i < 3 ? 5 : 15,
    })),
  };
}
export interface WeatherProvider {
  getWeather(location: Coordinates): Promise<Weather>;
}
export const mockWeatherProvider: WeatherProvider = {
  async getWeather() {
    return getMockWeather();
  },
};
type Forecast = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    precipitation: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
  };
  daily: { sunset: string[] };
};
export const openMeteoProvider: WeatherProvider = {
  async getWeather(location) {
    const params = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      current: "temperature_2m,apparent_temperature,weather_code,precipitation",
      hourly: "temperature_2m,precipitation_probability",
      daily: "sunset",
      timezone: "Europe/Paris",
      forecast_days: "2",
    });
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) throw new Error("La météo prend une petite pause.");
    const data: Forecast = await response.json();
    if (
      !data.current ||
      !data.hourly?.time?.length ||
      !data.daily?.sunset?.length
    )
      throw new Error("Prévisions indisponibles.");
    const start = Math.max(
      0,
      data.hourly.time.findIndex(
        (t) => t >= data.current.time.slice(0, 13) + ":00",
      ),
    );
    const hourly = data.hourly.time.slice(start, start + 6).map((time, i) => ({
      time: time.slice(11, 16),
      temperature: Math.round(data.hourly.temperature_2m[start + i]),
      rainProbability: data.hourly.precipitation_probability[start + i],
    }));
    const firstRain = hourly.findIndex((h) => h.rainProbability >= 50);
    // Both values are Paris wall-clock ISO timestamps from the same response.
    const dryMinutes =
      firstRain < 0
        ? 360
        : Math.max(
            0,
            Math.round(
              (Date.parse(data.hourly.time[start + firstRain]) -
                Date.parse(data.current.time)) /
                60000,
            ),
          );
    return {
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      condition:
        data.current.weather_code <= 2
          ? "Éclaircies"
          : data.current.weather_code === 3
            ? "Nuageux"
            : data.current.weather_code < 50
              ? "Brume"
              : data.current.weather_code >= 71 &&
                  data.current.weather_code <= 77
                ? "Neige"
                : "Pluie",
      rain: data.current.precipitation > 0,
      dryMinutes,
      sunset: data.daily.sunset[0].slice(11, 16),
      source: "open-meteo",
      hourly,
    };
  },
};
export function weatherAdvice(weather: Weather) {
  if (weather.rain) return "Il pleut. On se trouve un joli abri ?";
  if (weather.dryMinutes === 0)
    return "Une averse est possible. Gardons un abri en tête.";
  if (weather.dryMinutes < 60)
    return `Encore environ ${weather.dryMinutes} min sans pluie.`;
  return "Il fait bon prendre son temps dehors.";
}
