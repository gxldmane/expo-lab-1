import { create } from "zustand";
import { MapMarker, MarkerImage, ErrorState, CreateMarkerData } from "@/types";
import { createError, handleError } from "@/utils/helpers";
import { ERROR_MESSAGES } from "@/constants/config";
import { markersRepository, initializeDatabase } from "@/database";

interface MarkersState {
  readonly markers: readonly MapMarker[];
  readonly error: ErrorState | null;
  readonly isLoading: boolean;
  readonly isInitialized: boolean;

  initialize: () => Promise<void>;
  loadMarkers: () => Promise<void>;
  addMarker: (data: CreateMarkerData) => Promise<string | null>;
  removeMarker: (markerId: string) => Promise<boolean>;
  saveImageToMarker: (
    markerId: string,
    image: Omit<MarkerImage, "id">
  ) => Promise<boolean>;
  deleteImageFromMarker: (
    markerId: string,
    imageId: string
  ) => Promise<boolean>;
  getMarker: (markerId: string) => MapMarker | undefined;
  clearError: () => void;
  setError: (error: ErrorState | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => Promise<void>;
}

export const useMarkersStore = create<MarkersState>((set, get) => ({
  markers: [],
  error: null,
  isLoading: false,
  isInitialized: false,

  initialize: async (): Promise<void> => {
    const { isInitialized } = get();
    if (isInitialized) {
      console.log("Markers store already initialized");
      return;
    }

    try {
      console.log("Starting markers store initialization...");
      set({ isLoading: true, error: null });
      await initializeDatabase();
      console.log("Database initialized, loading markers...");
      await get().loadMarkers();
      console.log("Markers loaded, initialization complete");
      set({ isInitialized: true, isLoading: false });
    } catch (error) {
      console.error("Failed to initialize markers store:", error);
      const errorState = handleError(
        error,
        "Failed to initialize markers store"
      );
      set({ error: errorState, isLoading: false, isInitialized: false });
      throw error;
    }
  },

  loadMarkers: async (): Promise<void> => {
    try {
      set({ isLoading: true, error: null });
      console.log("Loading markers from database...");
      const markers = await markersRepository.getAllMarkers();
      console.log(`Loaded ${markers.length} markers from database`);
      set({ markers, isLoading: false, error: null });
    } catch (error) {
      const errorState = handleError(error, "Failed to load markers");
      set({ error: errorState, isLoading: false });
      throw error;
    }
  },

  addMarker: async (data: CreateMarkerData): Promise<string | null> => {
    try {
      set({ isLoading: true, error: null });
      const markerId = await markersRepository.createMarker(data);
      await get().loadMarkers();
      set({ isLoading: false, error: null });
      return markerId;
    } catch (error) {
      const errorState = handleError(error, ERROR_MESSAGES.MARKER_ADD_FAILED);
      set({ error: errorState, isLoading: false });
      return null;
    }
  },

  removeMarker: async (markerId: string): Promise<boolean> => {
    try {
      set({ isLoading: true, error: null });
      const marker = get().getMarker(markerId);
      if (!marker) {
        set({
          error: createError("general", ERROR_MESSAGES.MARKER_NOT_FOUND),
          isLoading: false,
        });
        return false;
      }
      await markersRepository.deleteMarker(markerId);
      await get().loadMarkers();
      set({ isLoading: false, error: null });
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

  saveImageToMarker: async (
    markerId: string,
    image: Omit<MarkerImage, "id">
  ): Promise<boolean> => {
    try {
      set({ isLoading: true, error: null });
      const marker = get().getMarker(markerId);
      if (!marker) {
        set({
          error: createError("general", ERROR_MESSAGES.MARKER_NOT_FOUND),
          isLoading: false,
        });
        return false;
      }
      await markersRepository.addImageToMarker(markerId, image);
      await get().loadMarkers();
      set({ isLoading: false, error: null });
      return true;
    } catch (error) {
      const errorState = handleError(error, "Failed to save image to marker");
      set({ error: errorState, isLoading: false });
      return false;
    }
  },

  deleteImageFromMarker: async (
    markerId: string,
    imageId: string
  ): Promise<boolean> => {
    try {
      set({ isLoading: true, error: null });
      const marker = get().getMarker(markerId);
      if (!marker) {
        set({
          error: createError("general", ERROR_MESSAGES.MARKER_NOT_FOUND),
          isLoading: false,
        });
        return false;
      }
      await markersRepository.removeImageFromMarker(imageId);
      await get().loadMarkers();
      set({ isLoading: false, error: null });
      return true;
    } catch (error) {
      const errorState = handleError(
        error,
        "Failed to delete image from marker"
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

  reset: async (): Promise<void> => {
    try {
      set({ isLoading: true, error: null });
      set({
        markers: [],
        isInitialized: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorState = handleError(error, "Failed to reset markers store");
      set({ error: errorState, isLoading: false });
    }
  },
}));
