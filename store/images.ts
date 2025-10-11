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
  pickImageForMarker: () => Promise<Omit<MarkerImage, "id"> | null>;
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
  } catch {
    return false;
  }
};

export const useImagesStore = create<ImagesState>((set) => ({
  error: null,
  isLoading: false,

  pickImageForMarker: async (): Promise<Omit<MarkerImage, "id"> | null> => {
    try {
      set({ isLoading: true, error: null });

      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        set({
          error: createError("permission", ERROR_MESSAGES.PERMISSION_DENIED),
          isLoading: false,
        });
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        ...IMAGE_CONFIG.PICKER_OPTIONS,
      });

      if (result.canceled) {
        set({ isLoading: false });
        return null;
      }

      const asset = result.assets?.[0];
      if (!asset || !validateImage(asset)) {
        set({
          error: createError("image", ERROR_MESSAGES.IMAGE_PICK_FAILED),
          isLoading: false,
        });
        return null;
      }

      const newImage = createMarkerImage(asset);
      const imageData: Omit<MarkerImage, "id"> = {
        uri: newImage.uri,
        name: newImage.name,
        dateAdded: newImage.dateAdded,
      };

      if (newImage.size !== undefined) {
        (imageData as any).size = newImage.size;
      }
      if (newImage.type !== undefined) {
        (imageData as any).type = newImage.type;
      }

      set({ error: null, isLoading: false });
      return imageData;
    } catch (error) {
      const errorState = handleError(error, ERROR_MESSAGES.IMAGE_PICK_FAILED);
      set({ error: errorState, isLoading: false });
      Alert.alert("Ошибка", ERROR_MESSAGES.IMAGE_PICK_FAILED);
      return null;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setError: (error: ErrorState | null) => {
    set({ error });
  },
}));
