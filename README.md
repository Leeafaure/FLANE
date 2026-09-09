# FLÂNE

Paris, au gré de tes envies. Application mobile-first en Next.js App Router, TypeScript, Tailwind CSS, Framer Motion et Leaflet / OpenStreetMap.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000. Node.js 20.9 minimum (développement effectué avec Node 24).

Pour activer l’assistant OpenAI et sa recherche web, copier `.env.example` vers `.env.local`, puis renseigner `OPENAI_API_KEY`. La clé reste uniquement côté serveur dans `/api/ask` et ne doit jamais être préfixée par `NEXT_PUBLIC_`.

Pour les établissements réels, activer **Places API (New)** dans Google Cloud puis renseigner `GOOGLE_PLACES_API_KEY`. La route serveur demande au maximum 10 résultats et uniquement les champs utiles ; sans cette clé, FLÂNE utilise son catalogue local OpenStreetMap.

## Vérifier

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run start
```

Tests navigateur (le serveur de production doit être lancé) :

```bash
# Les tests utilisent Google Chrome installé sur l’appareil.
npm run test:e2e
```

## Parcours disponibles

- `/` : accueil, envies, météo, quartiers, humeurs, surprise.
- `/carte` : carte interactive, géolocalisation, catégories, adresses et étapes de balade.
- `/demander` : assistant OpenAI avec recherche web quand `OPENAI_API_KEY` est configurée ; secours local sinon.
- `/carnet` : favoris et collections personnalisées persistantes.
- `/paris` : recherche parmi les 80 quartiers administratifs, les 20 arrondissements et les appellations usuelles.
- `/quartier/batignolles`, `/quartier/montmartre`, `/quartier/marais` : carnets éditoriaux.
- `/lieu/[slug]`, `/rue/rue-des-dames` : fiches détaillées.
- `/balade?duree=120&quartier=montmartre` : mini parcours ajusté à la durée et à la météo.
- `/envies?category=cafe` : sélection par catégorie, humeur et budget.
- `/meteo` : prévisions de démonstration et actualisation réelle Open-Meteo.

## Architecture

`app/` contient les routes ; `components/` les composants visuels ; `data/` les quartiers, lieux, anecdotes, rues et parcours ; `types/` les contrats ; `services/` les fonctions indépendantes de l’interface.

- `weather.ts` : contrat `WeatherProvider`, données mockées et adaptateur Open-Meteo sans clé. Le bouton d’actualisation demande le direct et conserve le mock en cas d’échec. Paramètres documentés sur https://open-meteo.com/en/docs.
- `location.ts` : géolocalisation volontaire, distance haversine et estimation piétonne. Choix manuel du quartier en cas de refus.
- `recommendations.ts` : `getRecommendations()` filtre les contraintes puis trie par distance, météo, humeurs et temps disponible ; 6 adresses maximum.
- `catalog.server.ts` et `osm.ts` : catalogue local issu d’un instantané OpenStreetMap, filtré autour du quartier choisi. L’API `/api/places` conserve les données hors du navigateur jusqu’à la demande.
- `ai.ts` et `/api/ask` : client minimal et route serveur OpenAI Responses API. L’assistant reçoit le contexte local et peut effectuer une recherche web ; la clé ne sort jamais du serveur.
- `walks.ts` : pauses et temps de liaison compris dans le budget. Les trajets depuis la position sont optionnels. Le calcul reste géographique, sans moteur d’itinéraire.
- `notebook.ts` : contrat `NotebookRepository`, données versionnées et validation à la lecture. Pour Supabase, remplacer ce dépôt par une implémentation asynchrone et adapter les actions du provider.

## Données, attribution et limites

- Les 80 quartiers administratifs proviennent du jeu [Quartiers administratifs de Paris](https://opendata.paris.fr/explore/dataset/quartier_paris/information/) de la Ville de Paris. Les appellations usuelles sont des repères de navigation supplémentaires.
- Les lieux hors sélection éditoriale viennent d’un instantané OpenStreetMap. © contributeurs OpenStreetMap, sous licence [ODbL](https://www.openstreetmap.org/copyright). La date de l’instantané est exposée dans l’application. Prévoir un rafraîchissement régulier avant une mise en production durable.
- Les horaires, prix, disponibilité et résultats de recherche web peuvent changer : l’application les présente comme des pistes à vérifier, jamais comme une promesse.
- Les images locales sont créditées dans `/a-propos`. Les fiches utilisent des photographies d’ambiance, pas une photo vérifiée de chaque établissement.
- Le carnet utilise `localStorage` sans compte, synchronisation ni backend. Une erreur de stockage est signalée.
- La position et la conversation restent en mémoire et ne sont pas sauvegardées. Open-Meteo reçoit les coordonnées lors de l’actualisation. Le fond OSM nécessite Internet.
- Manifest et icônes pour ajout à l’écran d’accueil ; pas de service worker ni de promesse hors ligne.
- Typographies hébergées localement ; licences dans `public/fonts/`.
- Les composants respectent la préférence de réduction des animations ; dialogues natifs avec focus et fermeture Échap ; navigation clavier et libellés accessibles.

Documentation du framework : https://nextjs.org/docs/app/getting-started

## GitHub et Vercel

Le dépôt est déjà relié à `https://github.com/Leeafaure/FLANE.git`. Pour publier les changements :

```bash
git add -A
git commit -m "Connect Paris discovery and OpenAI search"
git push origin main
```

Dans Vercel, importer ce dépôt et ajouter `OPENAI_API_KEY` (et éventuellement `OPENAI_MODEL`) dans **Settings → Environment Variables** pour Production, Preview et Development. Vercel détecte Next.js automatiquement ; aucune configuration supplémentaire n’est nécessaire. Après chaque `git push` sur `main`, Vercel crée le déploiement de production.
