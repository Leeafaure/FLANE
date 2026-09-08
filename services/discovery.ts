import type { Coordinates,Place } from "@/types";
export type DiscoveryResult={places:Place[];updatedAt:string;source:"osm-snapshot"};
const cache=new Map<string,Promise<DiscoveryResult>>();
export async function discoverPlaces(location:Coordinates):Promise<DiscoveryResult>{
 const key=`${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`;
 if(cache.has(key))return cache.get(key)!;
 const params=new URLSearchParams({lat:String(location.latitude),lon:String(location.longitude)});
 const pending=fetch(`/api/places?${params}`,{signal:AbortSignal.timeout(12000)}).then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.error??"Les adresses sont momentanément indisponibles.");if(!Array.isArray(data.places))throw new Error("Les adresses n’ont pas pu être chargées.");return data as DiscoveryResult;}).catch(error=>{cache.delete(key);throw error;});
 if(cache.size>40)cache.delete(cache.keys().next().value!);cache.set(key,pending);return pending;
}
