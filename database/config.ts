import { DatabaseConfig, DatabaseMigration } from "@/types";

const INITIAL_MIGRATION: DatabaseMigration = {
  version: 1,
  queries: [
    `CREATE TABLE IF NOT EXISTS markers (
      id TEXT PRIMARY KEY,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      marker_id TEXT NOT NULL,
      uri TEXT NOT NULL,
      name TEXT NOT NULL,
      date_added TEXT NOT NULL,
      size INTEGER,
      type TEXT,
      FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
    );`,
    `CREATE INDEX IF NOT EXISTS idx_images_marker_id ON images (marker_id);`,
    `CREATE INDEX IF NOT EXISTS idx_markers_created_at ON markers (created_at);`,
  ],
};

export const DATABASE_CONFIG: DatabaseConfig = {
  name: "maplab.db",
  version: 1,
  migrations: [INITIAL_MIGRATION],
};

export const DB_CONSTANTS = {
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  TRANSACTION_TIMEOUT: 10000,
  CONNECTION_TIMEOUT: 5000,
  LOG_QUERIES: __DEV__,
} as const;
