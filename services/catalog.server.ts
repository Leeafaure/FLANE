import { readFile } from "node:fs/promises";
import path from "node:path";
import { places as editorialPlaces } from "@/data/places";
import { normalizeOsmPlace, osmCategory, type OsmElement } from "./osm";
import { distanceBetween } from "./location";
import type { Coordinates, Place } from "@/types";
export type CatalogResponse={places:Place[];updatedAt:string;source:"osm-snapshot"};
type Snapshot={fetchedAt:string;elements:OsmElement[]};
let catalog:Promise<Snapshot>|undefined;
function readCatalog(){return catalog??=readFile(path.join(process.cwd(),"data/osm-paris.json"),"utf8").then(s=>JSON.parse(s) as Snapshot).catch(e=>{catalog=undefined;throw e;});}
export function validParisPoint(p:Coordinates){return Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&p.latitude>=48.80&&p.latitude<=48.92&&p.longitude>=2.22&&p.longitude<=2.43;}
export async function getNearbyPlaces(location:Coordinates):Promise<CatalogResponse>{
 const snapshot=await readCatalog();
 const pool=snapshot.elements.map(e=>({e,d:distanceBetween(location,{latitude:e.lat,longitude:e.lon})})).filter(x=>x.d<=1.8).sort((a,b)=>a.d-b.d);
 const counts=new Map<string,number>(),seen:Place[]=[];
 const local=editorialPlaces.filter(p=>distanceBetween(location,p)<=1.8);
 for(const {e} of pool){const category=osmCategory(e.tags);if(!category||(counts.get(category)??0)>=18)continue;const place=normalizeOsmPlace(e,snapshot.fetchedAt);if(!place)continue;
 const duplicate=[...local,...seen].some(p=>p.name.toLowerCase().replace(/[^\p{L}\p{N}]/gu,"")===place.name.toLowerCase().replace(/[^\p{L}\p{N}]/gu,"")&&distanceBetween(p,place)<.08);
 if(duplicate)continue;seen.push(place);counts.set(category,(counts.get(category)??0)+1);}
 return {places:[...local,...seen],updatedAt:snapshot.fetchedAt,source:"osm-snapshot"};
}
export async function getCatalogPlace(id:string){const local=editorialPlaces.find(p=>p.id===id);if(local)return local;if(!/^osm-(node|way|relation)-\d{1,15}$/.test(id))return;const snapshot=await readCatalog();const [,type,osmId]=id.split('-');const element=snapshot.elements.find(e=>e.type===type&&e.id===Number(osmId));return element?normalizeOsmPlace(element,snapshot.fetchedAt):undefined;}
