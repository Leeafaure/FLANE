import Image from "next/image";
import { Coffee,Utensils,Footprints,ShoppingBag,Sparkles } from "lucide-react";
import type { Place } from "@/types";
const icons={cafe:Coffee,restaurant:Utensils,walk:Footprints,shop:ShoppingBag,curiosity:Sparkles};
export function PlaceVisual({place,priority=false}:{place:Place;priority?:boolean}){const Icon=icons[place.category];return place.image?<Image src={place.image} alt={priority?`Photographie d’ambiance pour ${place.name}`:""} fill priority={priority} sizes="(max-width: 600px) 90vw, 500px"/>:<div className={`place-illustration illustration-${place.category}`} aria-hidden="true"><span className="illustration-district">{place.arrondissement}</span><Icon size={40} strokeWidth={1}/><span>UN PETIT DÉTOUR DANS LE {place.arrondissement}e</span></div>;}
