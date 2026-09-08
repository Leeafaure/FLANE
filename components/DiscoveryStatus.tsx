"use client";
import { useFlane } from "./AppProvider";
export function DiscoveryStatus(){const {discoveryLoading,discoveryError,retryDiscovery}=useFlane();if(discoveryLoading)return <p className="discovery-status" role="status">On repère les petits détours du quartier…</p>;if(discoveryError)return <div className="discovery-status error" role="status">{discoveryError} <button className="text-link" onClick={retryDiscovery}>Réessayer</button></div>;return null;}
