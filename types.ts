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
  | "permission"
  | "database"
  | "transaction"
  | "connection";

export interface ErrorState {
  readonly message: string;
  readonly type: ErrorType;
  readonly timestamp?: Date;
  readonly details?: string;
}

// Database types
export interface DatabaseMarker {
  readonly id: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly title: string;
  readonly description: string;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface DatabaseImage {
  readonly id: string;
  readonly marker_id: string;
  readonly uri: string;
  readonly name: string;
  readonly date_added: string;
  readonly size?: number;
  readonly type?: string;
}

export interface DatabaseConfig {
  readonly name: string;
  readonly version: number;
  readonly migrations: readonly DatabaseMigration[];
}

export interface DatabaseMigration {
  readonly version: number;
  readonly queries: readonly string[];
}

export interface DatabaseTransaction {
  readonly queries: readonly { sql: string; args?: readonly any[] }[];
}

export interface DatabaseError extends Error {
  readonly code?: string | number;
  readonly constraint?: string;
}

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

// Location types
export interface LocationConfig {
  readonly accuracy: number;
  readonly timeInterval: number;
  readonly distanceInterval: number;
}

export interface LocationState {
  readonly location: {
    coords: {
      latitude: number;
      longitude: number;
      altitude: number | null;
      accuracy: number | null;
      altitudeAccuracy: number | null;
      heading: number | null;
      speed: number | null;
    };
    timestamp: number;
  } | null;
  readonly errorMsg: string | null;
  readonly isTracking: boolean;
}

// Notification types
export interface ActiveNotification {
  readonly markerId: string;
  readonly notificationId: string;
  readonly timestamp: number;
}

export interface NotificationContent {
  readonly title: string;
  readonly body: string;
  readonly data?: Record<string, any>;
}

export interface ProximityCheckResult {
  readonly markerId: string;
  readonly distance: number;
  readonly isInRange: boolean;
}
