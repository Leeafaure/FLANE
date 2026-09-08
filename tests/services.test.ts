import { test } from "node:test";
import assert from "node:assert/strict";
import { getRecommendations } from "../services/recommendations";
import { getMockWeather } from "../services/weather";
import { defaultLocation, distanceBetween } from "../services/location";
import { parseRequest, localAssistant } from "../services/assistant";
import { buildWalk } from "../services/walks";
import { neighborhoods } from "../data/neighborhoods";
const context = { location: defaultLocation, weather: getMockWeather() };
test("the assistant tells a neighborhood story when asked", async () => {
  const answer = await localAssistant.ask("Raconte-moi ce quartier", context);
  assert.match(answer.message, /1860/);
  assert.match(answer.message, /Batignolles/);
  assert.ok(answer.places.length > 0);
});
test("recommendations respect category, budget, duration and the six-place cap", () => {
  const results = getRecommendations({
    ...context,
    category: "cafe",
    budget: 1,
    timeAvailable: 30,
  });
  assert.ok(results.length > 0);
  assert.ok(results.length <= 6);
  for (const place of results) {
    assert.equal(place.category, "cafe");
    assert.ok(place.priceLevel <= 1);
    assert.ok(place.walkingTime + 10 <= 30);
  }
});
test("rain elevates covered places and mood elevates matching tags", () => {
  const rainy = getRecommendations({
    ...context,
    weather: { ...context.weather, rain: true },
  });
  assert.ok(rainy.slice(0, 3).every((p) => p.indoor));
  const cosy = getRecommendations({ ...context, mood: ["cosy"] });
  assert.ok(cosy[0].tags.includes("cosy"));
});
test("natural language recognizes time, budget, location and activity", () => {
  const intent = parseRequest(
    "J’ai 2h à Montmartre pour un café cosy à moins de 10 euros",
  );
  assert.equal(intent.neighborhood, "montmartre");
  assert.equal(intent.timeAvailable, 120);
  assert.equal(intent.category, "cafe");
  assert.equal(intent.budget, 1);
  assert.ok(intent.mood?.includes("cosy"));
});
test("vintage in the Marais stays in the requested neighborhood", async () => {
  const answer = await localAssistant.ask("Du vintage dans le Marais", context);
  assert.ok(answer.places.length > 0);
  assert.ok(
    answer.places.every(
      (p) => p.neighborhood === "marais" && p.category === "shop",
    ),
  );
});
test("rain plan never recommends an outdoor-only place", async () => {
  const answer = await localAssistant.ask("Un plan pluie", context);
  assert.ok(answer.places.length > 0);
  assert.ok(answer.places.every((p) => p.indoor));
});
test("walks include all transfers and visits within every duration", () => {
  for (const n of neighborhoods)
    for (const duration of [30, 60, 120, 240])
      for (const rain of [false, true]) {
        const walk = buildWalk(
          n.id,
          duration,
          { ...context.weather, rain },
          new Date("2026-09-08T10:00:00"),
        );
        assert.ok(walk.stops.length > 0, `${n.id} ${duration} rain=${rain}`);
        assert.ok(walk.totalMinutes <= duration);
        assert.ok(
          walk.totalMinutes >=
            walk.stops.reduce((sum, s) => sum + s.minutes, 0),
        );
        if (rain) assert.ok(walk.stops.every((s) => s.place.indoor));
      }
});
test("a short itinerary cannot silently ignore a distant origin", () => {
  const walk = buildWalk(
    "marais",
    30,
    context.weather,
    new Date(),
    defaultLocation,
  );
  assert.equal(walk.stops.length, 0);
});
test("distance calculations are symmetric and zero at identical coordinates", () => {
  assert.equal(distanceBetween(defaultLocation, defaultLocation), 0);
  assert.equal(
    distanceBetween(neighborhoods[0], neighborhoods[1]),
    distanceBetween(neighborhoods[1], neighborhoods[0]),
  );
});
