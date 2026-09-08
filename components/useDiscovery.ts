"use client";
import { useEffect,useState } from "react";
import { discoverPlaces } from "@/services/discovery";
import { distanceBetween } from "@/services/location";
import { useFlane } from "./AppProvider";
import type { Coordinates } from "@/types";
export function useDiscovery(point:Coordinates){const {allPlaces,registerPlaces}=useFlane();const [loading,setLoading]=useState(true),[error,setError]=useState(""),[retry,setRetry]=useState(0);useEffect(()=>{let active=true;const timer=setTimeout(()=>{setLoading(true);setError("");discoverPlaces(point).then(r=>{if(active)registerPlaces(r.places);}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});},0);return()=>{active=false;clearTimeout(timer);};},[point.latitude,point.longitude,retry,registerPlaces]);return{places:allPlaces.filter(p=>distanceBetween(point,p)<=1.8),loading,error,retry:()=>setRetry(v=>v+1)};}
