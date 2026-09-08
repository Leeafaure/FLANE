# FLÂNE

Paris, au gré de tes envies. Première version mobile-first avec Next.js App Router, TypeScript, Tailwind CSS, Framer Motion et Leaflet / OpenStreetMap.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000. Node.js 20.9 minimum (développement effectué avec Node 24). Aucune clé API ni base de données nécessaire.

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
- `/demander` : conversation locale et suggestions.
- `/carnet` : favoris et collections personnalisées persistantes.
- `/paris` : quartiers et zones couvertes.
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
- `assistant.ts` : contrat `AssistantProvider`. L’adaptateur local extrait catégorie, quartier, budget, durée, ambiance, distance, pluie et moment. Brancher un LLM via une route serveur qui implémente le même contrat ; ne jamais exposer de clé dans le navigateur.
- `walks.ts` : pauses et temps de liaison compris dans le budget. Les trajets depuis la position sont optionnels. Le calcul reste géographique, sans moteur d’itinéraire.
- `notebook.ts` : contrat `NotebookRepository`, données versionnées et validation à la lecture. Pour Supabase, remplacer ce dépôt par une implémentation asynchrone et adapter les actions du provider.

## Choix et limites de la V1

- 21 lieux de démonstration ; seuls Batignolles, Montmartre et Marais ont un carnet éditorial complet.
- Les commerces, niveaux de prix et coordonnées sont des données de démonstration à valider avant publication. Aucun horaire d’ouverture n’est promis.
- Les images locales sont créditées dans `/a-propos`. Les fiches utilisent des photographies d’ambiance, pas une photo vérifiée de chaque établissement.
- Le carnet utilise `localStorage` sans compte, synchronisation ni backend. Une erreur de stockage est signalée.
- La position et la conversation restent en mémoire et ne sont pas sauvegardées. Open-Meteo reçoit les coordonnées lors de l’actualisation. Le fond OSM nécessite Internet.
- Manifest et icônes pour ajout à l’écran d’accueil ; pas de service worker ni de promesse hors ligne.
- Typographies hébergées localement ; licences dans `public/fonts/`.
- Les composants respectent la préférence de réduction des animations ; dialogues natifs avec focus et fermeture Échap ; navigation clavier et libellés accessibles.

Documentation du framework : https://nextjs.org/docs/app/getting-started
