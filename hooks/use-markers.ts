import { useCallback } from "react";
import { useMarkersStore } from "@/store";
import { CreateMarkerData, MarkerUpdate, Coordinate } from "@/types";

export function useMarkers() {
  const {
    markers,
    error,
    isLoading,
    addMarker: addMarkerAction,
    removeMarker: removeMarkerAction,
    updateMarker: updateMarkerAction,
    updateMarkerImages,
    getMarker,
    clearError,
  } = useMarkersStore();

  const addMarker = useCallback(
    async (coordinate: Coordinate) => {
      const data: CreateMarkerData = { coordinate };
      return await addMarkerAction(data);
    },
    [addMarkerAction]
  );

  const updateMarker = useCallback(
    async (markerId: string, updates: MarkerUpdate) => {
      return await updateMarkerAction(markerId, updates);
    },
    [updateMarkerAction]
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
    updateMarker,
    updateMarkerImages,
    getMarker,
    clearError,
  } as const;
}
