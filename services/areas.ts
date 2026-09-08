import districts from "@/data/paris-districts.json";
import { areas as originalAreas } from "@/data/neighborhoods";
import type { Area, Coordinates } from "@/types";
import { distanceBetween } from "./location";
export function normalizeSearch(value:string){return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();}
const popular: [string,string,number,number,number,string?][] = [
 ["oberkampf","Oberkampf",11,48.865,2.3773], ["republique","République",11,48.8675,2.3638],
 ["canal-saint-martin","Canal Saint-Martin",10,48.8717,2.3637], ["bastille","Bastille",11,48.8531,2.3692],
 ["butte-aux-cailles","Butte-aux-Cailles",13,48.8278,2.3496], ["quartier-latin","Quartier latin",5,48.8493,2.346],
 ["menilmontant","Ménilmontant",20,48.8688,2.3915], ["pigalle","Pigalle",9,48.8823,2.3375],
 ["south-pigalle","South Pigalle",9,48.8788,2.337,"SoPi"], ["sentier","Sentier",2,48.8675,2.3475],
 ["buttes-chaumont","Buttes-Chaumont",19,48.8809,2.3823], ["jaures","Jaurès",19,48.8829,2.3703],
 ["stalingrad","Stalingrad",19,48.8842,2.3695], ["nation","Nation",12,48.8483,2.3959],
 ["daumesnil","Daumesnil",12,48.8396,2.3958], ["aligre","Aligre",12,48.8487,2.3785],
 ["mouffetard","Mouffetard",5,48.8423,2.3499], ["saint-michel","Saint-Michel",5,48.853,2.344],
 ["denfert-rochereau","Denfert-Rochereau",14,48.8338,2.3325], ["alesia","Alésia",14,48.8283,2.3272],
 ["daguerre","Daguerre",14,48.8334,2.3283], ["commerce","Commerce",15,48.8446,2.2933],
 ["beaugrenelle","Beaugrenelle",15,48.8482,2.2823], ["passy","Passy",16,48.8577,2.2803],
 ["trocadero","Trocadéro",16,48.8635,2.287], ["la-villette","La Villette",19,48.8893,2.3866],
 ["jourdain","Jourdain",19,48.8753,2.3893], ["gambetta","Gambetta",20,48.8647,2.3985],
 ["belleville-village","Village de Belleville",20,48.8738,2.3868], ["saint-lazare","Saint-Lazare",8,48.8756,2.325],
 ["ile-saint-louis","Île Saint-Louis",4,48.8517,2.3567], ["ile-de-la-cite","Île de la Cité",4,48.8546,2.3485],
 ["palais-garnier","Grands Boulevards",9,48.8714,2.343], ["rue-des-martyrs","Rue des Martyrs",9,48.878,2.3394],
 ["saint-sebastien-froissart","Saint-Sébastien–Froissart",11,48.8612,2.3676], ["parmentier","Parmentier",11,48.8652,2.3745],
];
const merged = new Map<string,Area>();
for(const d of districts)merged.set(d.id,{...d,kind:"official"});
for(const a of originalAreas)merged.set(a.id,{...a,kind:merged.has(a.id)?"official":"popular"});
for(const [id,name,arr,latitude,longitude,alias] of popular)merged.set(id,{id,name,arrondissement:`${arr}e`,latitude,longitude,kind:"popular",aliases:alias?[alias]:[]});
const quarterAreas=[...merged.values()];
const arrondissementAreas:Area[]=Array.from({length:20},(_,i)=>{const group=districts.filter(d=>parseInt(d.arrondissement)===i+1);return{id:`paris-${i+1}`,name:`Paris ${i+1}${i===0?"er":"e"}`,arrondissement:`${i+1}${i===0?"er":"e"}`,latitude:group.reduce((s,a)=>s+a.latitude,0)/4,longitude:group.reduce((s,a)=>s+a.longitude,0)/4,kind:"arrondissement"};});
export const allAreas:Area[]=[...quarterAreas,...arrondissementAreas];
export function findArea(id:string|null|undefined){return allAreas.find(a=>a.id===id);}
export function searchAreas(query:string,limit=8):Area[]{const q=normalizeSearch(query);if(!q)return originalAreas.slice(0,limit).map(a=>findArea(a.id)!);const district=q.match(/^(?:paris )?(\d{1,2})(?:e|eme|er| arrondissement)?$/);if(district){const n=Number(district[1]);return [findArea(`paris-${n}`),...quarterAreas.filter(a=>parseInt(a.arrondissement)===n)].filter((a):a is Area=>!!a).slice(0,limit);}return allAreas.map(a=>({a,terms:[a.name,a.id,...a.aliases??[]].map(normalizeSearch)})).filter(({terms})=>terms.some(t=>t.includes(q)||q.split(" ").every(w=>t.includes(w)))).sort((a,b)=>Number(b.terms.includes(q))-Number(a.terms.includes(q))||a.a.name.localeCompare(b.a.name,"fr")).slice(0,limit).map(x=>x.a);}
export function matchArea(text:string):Area|undefined{const q=` ${normalizeSearch(text)} `;const arr=q.match(/(?:paris |dans le |du |le )(\d{1,2})(?:e|eme|er)(?: arrondissement)?\b/);if(arr&&findArea(`paris-${Number(arr[1])}`))return findArea(`paris-${Number(arr[1])}`);return allAreas.flatMap(a=>[a.name,...a.aliases??[]].map(term=>({a,term:normalizeSearch(term)}))).filter(x=>q.includes(` ${x.term} `)).sort((a,b)=>b.term.length-a.term.length)[0]?.a;}
export function nearestArea(point:Coordinates):Area{return [...quarterAreas].sort((a,b)=>distanceBetween(point,a)-distanceBetween(point,b))[0];}
