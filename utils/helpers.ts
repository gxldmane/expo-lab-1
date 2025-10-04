import {MarkerImage, ErrorState, ErrorType} from "@/types";
import {ERROR_MESSAGES} from "@/constants/config";

export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatCoordinate = (value: number, digits = 6): string => {
    return value.toFixed(digits);
};

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const createError = (type: ErrorType, message?: string): ErrorState => ({
    type,
    message: message || ERROR_MESSAGES.MARKER_ADD_FAILED,
    timestamp: new Date(),
});

export const validateImage = (asset: any): boolean => {
    if (!asset?.uri) return false;
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) return false; // 5MB max
    return true;
};

export const createMarkerImage = (asset: any): MarkerImage => ({
    id: generateId(),
    uri: asset.uri,
    name: asset.fileName || `Изображение_${Date.now()}`,
    dateAdded: new Date(),
    size: asset.fileSize,
    type: asset.type,
});

export const handleError = (
    error: unknown,
    fallbackMessage: string
): ErrorState => {
    const message = error instanceof Error ? error.message : fallbackMessage;
    console.error("Application Error:", error);

    return {
        type: "general",
        message,
        timestamp: new Date(),
    };
};
