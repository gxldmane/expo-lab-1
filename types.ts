export interface Coordinate {
    readonly latitude: number;
    readonly longitude: number;
}

export interface MarkerImage {
    readonly id: string;
    readonly uri: string;
    readonly name: string;
    readonly dateAdded: Date;
    readonly size?: number;
    readonly type?: string;
}

export interface MapMarker {
    readonly id: string;
    readonly coordinate: Coordinate;
    readonly title: string;
    readonly description: string;
    readonly images: readonly MarkerImage[];
    readonly createdAt: Date;
    readonly updatedAt?: Date;
}

export interface MapLongPressEvent {
    nativeEvent: {
        coordinate: Coordinate;
    };
}

export type ErrorType =
    | "image"
    | "navigation"
    | "map"
    | "general"
    | "permission";

export interface ErrorState {
    readonly message: string;
    readonly type: ErrorType;
    readonly timestamp?: Date;
}

export type MarkerUpdate = Partial<
    Pick<MapMarker, "title" | "description" | "images">
>;
export type CreateMarkerData = Pick<MapMarker, "coordinate"> &
    Partial<Pick<MapMarker, "title" | "description">>;

export interface UIConfig {
    readonly colors: {
        readonly primary: string;
        readonly secondary: string;
        readonly success: string;
        readonly error: string;
        readonly warning: string;
        readonly background: string;
        readonly surface: string;
        readonly text: string;
        readonly textSecondary: string;
    };
    readonly spacing: {
        readonly xs: number;
        readonly sm: number;
        readonly md: number;
        readonly lg: number;
        readonly xl: number;
    };
    readonly borderRadius: {
        readonly sm: number;
        readonly md: number;
        readonly lg: number;
    };
}
