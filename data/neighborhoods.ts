import type { Neighborhood } from "@/types";
export const neighborhoods: Neighborhood[] = [
  {
    id: "batignolles",
    name: "Batignolles",
    arrondissement: "17",
    subtitle: "Un village dans la ville.",
    description: "Des petites rues, des terrasses et le temps qui ralentit.",
    image: "/images/batignolles.jpg",
    latitude: 48.8874,
    longitude: 2.3185,
    walkingTime: 12,
    history:
      "Avant d’être parisiennes, les Batignolles étaient un village à part entière. Rattachées à Paris en 1860, elles ont gardé ce goût des petites places et des rues à taille humaine. Le square, aménagé sous le Second Empire, est aujourd’hui encore le cœur vert du quartier. Installe-toi près de l’eau : le Paris pressé paraît déjà loin.",
    streets: [
      {
        name: "Rue des Batignolles",
        description:
          "Le fil rouge du quartier, entre petites devantures et place de village.",
      },
      {
        name: "Rue des Dames",
        description:
          "Des façades à observer et plein de bonnes raisons de ralentir.",
      },
      {
        name: "Rue Legendre",
        description:
          "Une jolie traversée, à prolonger vers les rues plus calmes.",
      },
    ],
    source: "https://www.paris.fr/lieux/square-des-batignolles-1761",
  },
  {
    id: "montmartre",
    name: "Montmartre",
    arrondissement: "18",
    subtitle: "Prendre un peu de hauteur.",
    description: "Des escaliers, des ateliers et un autre rythme.",
    image: "/images/montmartre.jpg",
    latitude: 48.8865,
    longitude: 2.3388,
    walkingTime: 24,
    history:
      "Montmartre se découvre à pied, en acceptant les détours et les marches. Autour des Abbesses, les rues animées laissent place à des passages plus tranquilles. Sur la place Émile-Goudeau, le Bateau-Lavoir rappelle le passé artistique de la butte. Le plus beau programme reste de quitter les grands axes et de regarder ce qui se cache au prochain tournant.",
    streets: [
      {
        name: "Rue des Abbesses",
        description:
          "Le quartier s’éveille entre cafés, librairies et devantures.",
      },
      {
        name: "Rue Ravignan",
        description: "Une montée douce jusqu’à la place Émile-Goudeau.",
      },
      {
        name: "Rue de l’Abreuvoir",
        description: "Une courbe, des arbres, et l’envie de rester un peu.",
      },
    ],
    source:
      "https://www.paris.fr/pages/balade-montmartroise-dans-les-pas-de-picasso-23399",
  },
  {
    id: "marais",
    name: "Le Marais",
    arrondissement: "3 · 4",
    subtitle: "L’art de prendre les détours.",
    description: "Des cours secrètes, du vintage et de vieilles pierres.",
    image: "/images/marais.jpg",
    latitude: 48.8575,
    longitude: 2.3622,
    walkingTime: 65,
    history:
      "Dans le Marais, les siècles se croisent à chaque coin de rue. Derrière de grandes portes se devinent des cours et des hôtels particuliers. Entre la place des Vosges et le Village Saint-Paul, on passe des grandes perspectives à un Paris plus intime. Ici, la balade se fait autant en levant les yeux qu’en poussant les portes ouvertes.",
    streets: [
      {
        name: "Rue des Francs-Bourgeois",
        description: "De beaux hôtels particuliers derrière les vitrines.",
      },
      {
        name: "Rue des Rosiers",
        description: "Une rue vivante à parcourir sans se presser.",
      },
      {
        name: "Rue Saint-Paul",
        description: "Un point de départ pour explorer les cours du village.",
      },
    ],
    source: "https://www.paris.fr/lieux/place-des-vosges-1792",
  },
];
export const areas = [
  {
    id: "guy-moquet",
    name: "Guy Môquet",
    arrondissement: "17e",
    latitude: 48.8925,
    longitude: 2.3274,
  },
  {
    id: "batignolles",
    name: "Batignolles",
    arrondissement: "17e",
    latitude: 48.8874,
    longitude: 2.3185,
  },
  {
    id: "villiers",
    name: "Villiers",
    arrondissement: "17e",
    latitude: 48.881,
    longitude: 2.3158,
  },
  {
    id: "monceau",
    name: "Monceau",
    arrondissement: "8e · 17e",
    latitude: 48.8805,
    longitude: 2.3093,
  },
  {
    id: "montmartre",
    name: "Montmartre",
    arrondissement: "18e",
    latitude: 48.8865,
    longitude: 2.3388,
  },
  {
    id: "abbesses",
    name: "Abbesses",
    arrondissement: "18e",
    latitude: 48.8845,
    longitude: 2.3387,
  },
  {
    id: "marais",
    name: "Le Marais",
    arrondissement: "3e · 4e",
    latitude: 48.8575,
    longitude: 2.3622,
  },
  {
    id: "saint-paul",
    name: "Village Saint-Paul",
    arrondissement: "4e",
    latitude: 48.8539,
    longitude: 2.3616,
  },
  {
    id: "opera",
    name: "Opéra",
    arrondissement: "9e",
    latitude: 48.8719,
    longitude: 2.3316,
  },
];
