import { create } from "zustand";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MarkerImage, ErrorState } from "@/types";
import {
  createMarkerImage,
  createError,
  handleError,
  validateImage,
} from "@/utils/helpers";
import { IMAGE_CONFIG, ERROR_MESSAGES, UI_TEXTS } from "@/constants/config";

interface ImagesState {
  readonly error: ErrorState | null;
  readonly isLoading: boolean;

  addImageToMarker: (
    markerId: string,
    onSuccess?: (image: MarkerImage) => void
  ) => Promise<void>;
  removeImageFromMarker: (
    markerId: string,
    imageId: string,
    onSuccess?: () => void
  ) => Promise<void>;
  clearError: () => void;
  setError: (error: ErrorState | null) => void;
}

const requestPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        UI_TEXTS.PERMISSIONS.MEDIA_LIBRARY_TITLE,
        UI_TEXTS.PERMISSIONS.MEDIA_LIBRARY_MESSAGE
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Permission request failed:", error);
    return false;
  }
};

export const useImagesStore = create<ImagesState>((set, get) => ({
  error: null,
  isLoading: false,

  addImageToMarker: async (
    markerId: string,
    onSuccess?: (image: MarkerImage) => void
  ): Promise<void> => {
    try {
      set({ isLoading: true, error: null });

      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        set({
          error: createError("permission", ERROR_MESSAGES.PERMISSION_DENIED),
          isLoading: false,
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        ...IMAGE_CONFIG.PICKER_OPTIONS,
      });

      if (result.canceled) {
        set({ isLoading: false });
        return;
      }

      const asset = result.assets?.[0];
      if (!asset || !validateImage(asset)) {
        set({
          error: createError("image", ERROR_MESSAGES.IMAGE_PICK_FAILED),
          isLoading: false,
        });
        return;
      }

      const newImage = createMarkerImage(asset);

      set({ error: null, isLoading: false });
      onSuccess?.(newImage);
    } catch (error) {
      const errorState = handleError(error, ERROR_MESSAGES.IMAGE_PICK_FAILED);
      set({ error: errorState, isLoading: false });

      Alert.alert("Ошибка", ERROR_MESSAGES.IMAGE_PICK_FAILED);
    }
  },

  removeImageFromMarker: async (
    markerId: string,
    imageId: string,
    onSuccess?: () => void
  ): Promise<void> => {
    try {
      set({ isLoading: true, error: null });

      await new Promise((resolve) => setTimeout(resolve, 100));

      set({ error: null, isLoading: false });
      onSuccess?.();
    } catch (error) {
      const errorState = handleError(error, ERROR_MESSAGES.IMAGE_DELETE_FAILED);
      set({ error: errorState, isLoading: false });

      Alert.alert("Ошибка", ERROR_MESSAGES.IMAGE_DELETE_FAILED);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setError: (error: ErrorState | null) => {
    set({ error });
  },
}));
