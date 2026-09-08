import { test, expect } from "@playwright/test";

test("a full device never claims a favorite was saved", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage full", "QuotaExceededError");
    };
  });
  await page.goto("/lieu/square-batignolles");
  const favorite = page.getByRole("button", {
    name: "Ajouter Square des Batignolles au carnet",
  });
  await favorite.click();
  await expect(page.getByRole("status")).toContainText(
    "ne sont pas enregistrées",
  );
  await expect(favorite).toHaveAttribute("aria-pressed", "false");
});

test("live weather correctly estimates the next rainy hour", async ({
  page,
}) => {
  await page.route("https://api.open-meteo.com/**", (route) =>
    route.fulfill({
      json: {
        current: {
          temperature_2m: 21,
          apparent_temperature: 22,
          weather_code: 2,
          precipitation: 0,
          time: "2026-09-08T17:15",
        },
        hourly: {
          time: [
            "2026-09-08T17:00",
            "2026-09-08T18:00",
            "2026-09-08T19:00",
            "2026-09-08T20:00",
            "2026-09-08T21:00",
          ],
          temperature_2m: [21, 20, 19, 18, 17],
          precipitation_probability: [0, 70, 80, 60, 30],
        },
        daily: { sunset: ["2026-09-08T20:18"] },
      },
    }),
  );
  await page.goto("/meteo");
  await page
    .getByRole("button", { name: "Actualiser la météo en direct" })
    .click();
  await expect(page.locator(".temperature")).toHaveText("21°");
  await expect(page.locator(".weather-main")).toContainText(
    "45 min sans pluie",
  );
  await expect(page.locator(".demo-note").first()).toContainText(
    "Prévisions Open-Meteo",
  );
});

test("denied geolocation offers manual neighborhoods", async ({ page }) => {
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = (_success, error) =>
      error?.({
        code: 1,
        message: "Denied",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      });
  });
  await page.goto("/");
  await page.locator(".location-button").click();
  await page.getByRole("button", { name: "Utiliser ma position" }).click();
  await expect(page.getByRole("status")).toContainText("Choisis un quartier");
  await page.locator(".location-button").click();
  await page.getByRole("button", { name: "Montmartre Paris 18e" }).click();
  await expect(page.locator(".location-button")).toContainText("Montmartre");
});
test("home, neighborhoods and navigation work without horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "on fait",
  );
  await expect(
    page.getByRole("navigation", { name: "Navigation principale" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Paris", exact: true }).click();
  await page.locator('a[href="/quartier/batignolles"]').first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Batignolles",
  );
  await expect(page.getByRole("heading", { name: /L’histoire/ })).toBeVisible();
  expect(errors).toEqual([]);
});
test("favorite survives reload and can be removed", async ({ page }) => {
  await page.goto("/lieu/square-batignolles");
  await page
    .getByRole("button", { name: "Ajouter Square des Batignolles au carnet" })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", {
      name: "Retirer Square des Batignolles du carnet",
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: "Carnet", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Square des Batignolles" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Retirer Square des Batignolles du carnet" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Le début d’une belle collection." }),
  ).toBeVisible();
});
test("custom collection stores an address across reloads", async ({ page }) => {
  await page.goto("/carnet");
  await page.getByRole("button", { name: "Une nouvelle collection" }).click();
  await page
    .getByRole("textbox", { name: "Nom de la collection" })
    .fill("Paris avec maman");
  await page.getByRole("button", { name: "Créer ma collection" }).click();
  await expect(
    page.getByRole("heading", { name: "Paris avec maman" }),
  ).toBeVisible();
  await page.goto("/lieu/cafe-dose");
  await page.getByRole("button", { name: "Dans une collection" }).click();
  await page.getByRole("button", { name: "Paris avec maman" }).click();
  await page.getByRole("button", { name: "Fermer", exact: true }).click();
  await page.goto("/carnet");
  await page.reload();
  await page.getByRole("button", { name: /Paris avec maman/ }).click();
  await expect(
    page.getByRole("heading", { name: "Dose · Batignolles" }),
  ).toBeVisible();
});
test("assistant understands a prompt and returns relevant places", async ({
  page,
}) => {
  await page.goto("/demander");
  await page
    .getByRole("button", { name: "Du vintage dans le Marais", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Village Saint-Paul" }),
  ).toBeVisible();
  await expect(page.locator(".chat-answer")).toContainText("Pour ce quartier");
  await page
    .getByRole("textbox", { name: "Ton envie à Paris" })
    .fill("Un café cosy près de moi");
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect(page.locator(".chat-answer")).toHaveCount(2);
});
test("time controls change the itinerary and map displays its steps", async ({
  page,
}) => {
  await page.goto("/balade?duree=120&quartier=montmartre");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "2 heures",
  );
  await expect(page.locator(".timeline-stop")).toHaveCount(4);
  await page.getByRole("button", { name: "30 min", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "30 minutes",
  );
  await expect(page.locator(".timeline-stop")).toHaveCount(1);
  await page
    .getByRole("link", { name: "Voir les étapes sur la carte" })
    .last()
    .click();
  await expect(page.locator(".leaflet-container")).toBeVisible();
  await expect(page.locator(".map-bottom-card")).toContainText(
    "Café des Deux Moulins",
  );
});
test("map category markers are interactive", async ({ page }) => {
  await page.goto("/carte");
  await expect(page.locator(".leaflet-container")).toBeVisible();
  await page.getByRole("button", { name: "Cafés", exact: true }).click();
  await page.locator('[title="Dose · Batignolles"]').click();
  await expect(page.locator(".map-bottom-card h2")).toHaveText(
    "Dose · Batignolles",
  );
  await page
    .locator(".map-bottom-card")
    .getByRole("link", { name: "Ce petit détour me plaît" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Dose · Batignolles",
  );
});
test("weather failure keeps demo and reports a helpful fallback", async ({
  page,
}) => {
  await page.route("https://api.open-meteo.com/**", (route) => route.abort());
  await page.goto("/meteo");
  await page
    .getByRole("button", { name: "Actualiser la météo en direct" })
    .click();
  await expect(page.getByRole("status")).toContainText("indisponible");
  await expect(page.locator(".temperature")).toHaveText("18°");
});
test("manual location works when geolocation is denied", async ({
  page,
  context,
}) => {
  await context.clearPermissions();
  await page.goto("/");
  await page.locator(".location-button").click();
  await page.getByRole("button", { name: "Montmartre Paris 18e" }).click();
  await expect(page.locator(".location-button")).toContainText("Montmartre");
  await page.goto("/une-rue-inconnue");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("perdus");
});
