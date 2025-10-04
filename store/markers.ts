import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  MapMarker,
  MarkerImage,
  ErrorState,
  CreateMarkerData,
  MarkerUpdate,
} from "@/types";
import { generateId, createError, handleError } from "@/utils/helpers";
import { MAP_CONFIG, ERROR_MESSAGES } from "@/constants/config";

interface MarkersState {
  readonly markers: readonly MapMarker[];
  readonly error: ErrorState | null;
  readonly isLoading: boolean;

  addMarker: (data: CreateMarkerData) => Promise<string | null>;
  removeMarker: (markerId: string) => Promise<boolean>;
  updateMarker: (markerId: string, updates: MarkerUpdate) => Promise<boolean>;
  updateMarkerImages: (
    markerId: string,
    images: readonly MarkerImage[]
  ) => Promise<boolean>;
  getMarker: (markerId: string) => MapMarker | undefined;
  clearError: () => void;
  setError: (error: ErrorState | null) => void;
  setLoading: (loading: boolean) => void;
}

const createNewMarker = (data: CreateMarkerData): MapMarker => {
  const now = new Date();
  return {
    id: generateId(),
    coordinate: data.coordinate,
    title: data.title || MAP_CONFIG.MARKER_DEFAULTS.title,
    description: data.description || MAP_CONFIG.MARKER_DEFAULTS.description,
    images: [],
    createdAt: now,
    updatedAt: now,
  };
};

export const useMarkersStore = create<MarkersState>()(
  subscribeWithSelector((set, get) => ({
    markers: [],
    error: null,
    isLoading: false,

    addMarker: async (data: CreateMarkerData): Promise<string | null> => {
      try {
        set({ isLoading: true, error: null });

        const newMarker = createNewMarker(data);

        set((state) => ({
          markers: [...state.markers, newMarker],
          isLoading: false,
          error: null,
        }));

        return newMarker.id;
      } catch (error) {
        const errorState = handleError(error, ERROR_MESSAGES.MARKER_ADD_FAILED);
        set({ error: errorState, isLoading: false });
        return null;
      }
    },

    removeMarker: async (markerId: string): Promise<boolean> => {
      try {
        set({ isLoading: true, error: null });

        const { markers } = get();
        const markerExists = markers.some((m) => m.id === markerId);

        if (!markerExists) {
          set({
            error: createError("general", ERROR_MESSAGES.MARKER_NOT_FOUND),
            isLoading: false,
          });
          return false;
        }

        set((state) => ({
          markers: state.markers.filter((marker) => marker.id !== markerId),
          isLoading: false,
          error: null,
        }));

        return true;
      } catch (error) {
        const errorState = handleError(
          error,
          ERROR_MESSAGES.MARKER_DELETE_FAILED
        );
        set({ error: errorState, isLoading: false });
        return false;
      }
    },

    updateMarker: async (
      markerId: string,
      updates: MarkerUpdate
    ): Promise<boolean> => {
      try {
        set({ isLoading: true, error: null });

        const { markers } = get();
        const markerIndex = markers.findIndex((m) => m.id === markerId);

        if (markerIndex === -1) {
          set({
            error: createError("general", ERROR_MESSAGES.MARKER_NOT_FOUND),
            isLoading: false,
          });
          return false;
        }

        set((state) => ({
          markers: state.markers.map((marker) =>
            marker.id === markerId
              ? { ...marker, ...updates, updatedAt: new Date() }
              : marker
          ),
          isLoading: false,
          error: null,
        }));

        return true;
      } catch (error) {
        const errorState = handleError(
          error,
          ERROR_MESSAGES.MARKER_UPDATE_FAILED
        );
        set({ error: errorState, isLoading: false });
        return false;
      }
    },

    updateMarkerImages: async (
      markerId: string,
      images: readonly MarkerImage[]
    ): Promise<boolean> => {
      try {
        set({ isLoading: true, error: null });

        const success = await get().updateMarker(markerId, {
          images: [...images],
        });
        set({ isLoading: false });

        return success;
      } catch (error) {
        const errorState = handleError(
          error,
          ERROR_MESSAGES.MARKER_UPDATE_FAILED
        );
        set({ error: errorState, isLoading: false });
        return false;
      }
    },

    getMarker: (markerId: string): MapMarker | undefined => {
      return get().markers.find((marker) => marker.id === markerId);
    },

    clearError: () => {
      set({ error: null });
    },

    setError: (error: ErrorState | null) => {
      set({ error });
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },
  }))
);
