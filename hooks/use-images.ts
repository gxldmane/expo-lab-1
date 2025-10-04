import { useCallback, useMemo } from "react";
import { useImagesStore, useMarkersStore } from "@/store";

interface UseImagesProps {
  readonly markerId: string;
}

export function useImages({ markerId }: UseImagesProps) {
  const {
    error,
    isLoading,
    addImageToMarker,
    removeImageFromMarker,
    clearError,
  } = useImagesStore();

  const {
    markers,
    getMarker,
    updateMarkerImages,
    isLoading: markersLoading,
  } = useMarkersStore();

  const marker = useMemo(
    () => markers.find((m) => m.id === markerId),
    [markers, markerId]
  );

  const images = useMemo(() => marker?.images || [], [marker?.images]);

  const addImage = useCallback(async () => {
    await addImageToMarker(markerId, async (newImage) => {
      const currentMarker = getMarker(markerId);
      if (!currentMarker) return;

      const currentImages = currentMarker.images || [];
      const updatedImages = [...currentImages, newImage];
      await updateMarkerImages(markerId, updatedImages);
    });
  }, [markerId, addImageToMarker, getMarker, updateMarkerImages]);

  const removeImage = useCallback(
    async (imageId: string) => {
      await removeImageFromMarker(markerId, imageId, async () => {
        const currentMarker = getMarker(markerId);
        if (!currentMarker) return;

        const currentImages = currentMarker.images || [];
        const updatedImages = currentImages.filter((img) => img.id !== imageId);
        await updateMarkerImages(markerId, updatedImages);
      });
    },
    [markerId, removeImageFromMarker, getMarker, updateMarkerImages]
  );

  const totalLoading = isLoading || markersLoading;

  return {
    images,
    error,
    isLoading: totalLoading,
    addImage,
    removeImage,
    clearError,
  } as const;
}
