"use client";
import { useFlane } from "./AppProvider";
export function DiscoveryStatus({
  loading: suppliedLoading,
  error: suppliedError,
  onRetry,
}: {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const { discoveryLoading, discoveryError, retryDiscovery } = useFlane();
  const loading = suppliedLoading ?? discoveryLoading;
  const error = suppliedError ?? discoveryError;
  if (loading)
    return (
      <p className="discovery-status" role="status">
        On repère les petits détours du quartier…
      </p>
    );
  if (error)
    return (
      <div className="discovery-status error" role="status">
        {error}{" "}
        <button className="text-link" onClick={onRetry ?? retryDiscovery}>
          Réessayer
        </button>
      </div>
    );
  return null;
}
