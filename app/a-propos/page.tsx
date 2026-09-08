import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function About() {
  return (
    <div className="page-shell about-page">
      <Link href="/" className="back-link">
        <ArrowLeft size={14} />
        Revenir flâner
      </Link>
      <div className="page-intro">
        <span className="eyebrow">LA PETITE HISTOIRE DE FLÂNE</span>
        <h1>
          Moins de plans.
          <br />
          Plus de <em>Paris.</em>
        </h1>
        <p>
          Un carnet de quartier, quelques bonnes intuitions et le plaisir de
          prendre son temps.
        </p>
      </div>
      <div className="prose">
        <h2>Un premier petit Paris.</h2>
        <p>
          FLÂNE est une première version de démonstration, centrée sur les
          Batignolles, Montmartre et le Marais, avec quelques détours à Guy
          Môquet, Villiers, Monceau et Opéra. Les adresses servent à explorer
          l’expérience : les horaires, les tarifs et la disponibilité ne sont
          pas actualisés. Les photographies de fiches sont des images
          d’ambiance.
        </p>
        <h2>Ton carnet, chez toi.</h2>
        <p>
          Les favoris et collections restent dans le stockage local de ton
          navigateur. Aucun compte n’est nécessaire. La géolocalisation est
          demandée uniquement lorsque tu choisis « Utiliser ma position ». Ta
          position reste dans l’application ; elle est transmise à Open-Meteo
          uniquement si tu actualises la météo.
        </p>
        <h2>Un œil sur le ciel.</h2>
        <p>
          La météo est une démonstration au premier lancement. Le bouton
          d’actualisation utilise{" "}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>{" "}
          sans clé API. L’application affiche une sélection adaptée au soleil ou
          à la pluie. Les prévisions horaires ne garantissent pas l’absence de
          pluie à la minute près.
        </p>
        <h2>Une conversation toute simple.</h2>
        <p>
          « Demander » interprète localement quelques envies, quartiers, budgets
          et durées. Aucun message n’est envoyé à un service d’intelligence
          artificielle. Les temps de marche sont des estimations géographiques,
          et les lignes de la carte relient les étapes sans calculer le chemin à
          suivre.
        </p>
        <h2>Les belles images et les petites sources.</h2>
        <ul>
          <li>
            Terrasse parisienne :{" "}
            <a href="https://unsplash.com/photos/a-restaurant-with-people-sitting-outside-R5n1KljP4Fc">
              Phil Aicken / Unsplash
            </a>
            .
          </li>
          <li>
            Rue des Batignolles :{" "}
            <a href="https://unsplash.com/photos/brown-apartment-buildings-under-clear-blue-sky-Nhe5nFN6L8U">
              Lomig / Unsplash
            </a>
            .
          </li>
          <li>
            Montmartre :{" "}
            <a href="https://unsplash.com/photos/people-walking-on-street-near-buildings-during-daytime-CKn6fbGPOpE">
              Bastien Nvs / Unsplash
            </a>
            .
          </li>
          <li>
            Place des Vosges :{" "}
            <a href="https://unsplash.com/photos/a-large-building-with-a-fountain-in-front-of-it-geJ7Q44syfg">
              Amin Zabardast / Unsplash
            </a>
            .
          </li>
          <li>
            Photographie d’intérieur de café :{" "}
            <a href="https://unsplash.com/photos/6VhPY27jdps">
              Petr Sevcovic / Unsplash
            </a>
            .
          </li>
          <li>
            Histoire des Batignolles :{" "}
            <a href="https://www.paris.fr/lieux/square-des-batignolles-1761">
              Ville de Paris
            </a>{" "}
            et{" "}
            <a href="https://www.paris.fr/pages/sept-choses-a-savoir-sur-le-square-des-batignolles-23593">
              sept histoires du square
            </a>
            .
          </li>
          <li>
            Fond de carte :{" "}
            <a href="https://www.openstreetmap.org/copyright">
              © les contributeurs OpenStreetMap
            </a>
            . Interface cartographique :{" "}
            <a href="https://leafletjs.com/">Leaflet</a>.
          </li>
          <li>
            Typographies : Instrument Serif et DM Sans, distribuées sous licence
            libre SIL Open Font License.
          </li>
        </ul>
        <h2>À emporter.</h2>
        <p>
          Sur ton téléphone, utilise « Ajouter à l’écran d’accueil » dans le
          menu de ton navigateur pour retrouver FLÂNE comme une application.
          Cette version nécessite une connexion pour charger ses pages et la
          carte.
        </p>
      </div>
    </div>
  );
}
