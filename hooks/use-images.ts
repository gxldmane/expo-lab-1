import { useCallback, useMemo } from "react";
import { useImagesStore, useMarkersStore } from "@/store";

interface UseImagesProps {
  readonly markerId: string;
}

export function useImages({ markerId }: UseImagesProps) {
  const {
    error: imagesError,
    isLoading: imagesLoading,
    pickImageForMarker,
    clearError: clearImagesError,
  } = useImagesStore();

  const {
    markers,
    isLoading: markersLoading,
    saveImageToMarker,
    deleteImageFromMarker,
    error: markersError,
    clearError: clearMarkersError,
  } = useMarkersStore();

  const marker = useMemo(
    () => markers.find((m) => m.id === markerId),
    [markers, markerId]
  );

  const images = useMemo(() => marker?.images || [], [marker?.images]);

  const addImage = useCallback(async () => {
    const imageData = await pickImageForMarker();
    if (imageData) {
      await saveImageToMarker(markerId, imageData);
    }
  }, [markerId, pickImageForMarker, saveImageToMarker]);

  const removeImage = useCallback(
    async (imageId: string) => {
      await deleteImageFromMarker(markerId, imageId);
    },
    [markerId, deleteImageFromMarker]
  );

  const error = imagesError || markersError;
  const clearError = useCallback(() => {
    clearImagesError();
    clearMarkersError();
  }, [clearImagesError, clearMarkersError]);

  const totalLoading = imagesLoading || markersLoading;

  return {
    images,
    error,
    isLoading: totalLoading,
    addImage,
    removeImage,
    clearError,
  } as const;
}
