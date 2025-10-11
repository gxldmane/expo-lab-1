import { useCallback, useEffect } from "react";
import { useMarkersStore } from "@/store";
import { CreateMarkerData, Coordinate } from "@/types";

export function useMarkers() {
  const {
    markers,
    error,
    isLoading,
    isInitialized,
    initialize,
    addMarker: addMarkerAction,
    removeMarker: removeMarkerAction,
    getMarker,
    clearError,
  } = useMarkersStore();

  useEffect(() => {
    if (!isInitialized) {
      console.log("Initializing markers store...");
      initialize();
    }
  }, [isInitialized, initialize]);

  const addMarker = useCallback(
    async (coordinate: Coordinate) => {
      const data: CreateMarkerData = { coordinate };
      return await addMarkerAction(data);
    },
    [addMarkerAction]
  );

  const removeMarker = useCallback(
    async (markerId: string) => {
      return await removeMarkerAction(markerId);
    },
    [removeMarkerAction]
  );

  return {
    markers,
    error,
    isLoading,
    addMarker,
    removeMarker,
    getMarker,
    clearError,
  } as const;
}
