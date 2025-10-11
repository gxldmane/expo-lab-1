import { databaseService } from "./service";

export { databaseService } from "./service";
export { markersRepository } from "./markersRepository";
export { DATABASE_CONFIG, DB_CONSTANTS } from "./config";

let initPromise: Promise<void> | null = null;

export const initializeDatabase = (): Promise<void> => {
  if (!initPromise) {
    initPromise = databaseService.initialize();
  }
  return initPromise!;
};

initializeDatabase().catch((error) => {
  console.error("[DB] Failed to auto-initialize database:", error);
});
