import * as SQLite from "expo-sqlite";
import {DatabaseError, DatabaseTransaction} from "@/types";
import {DATABASE_CONFIG, DB_CONSTANTS} from "./config";

class DatabaseService {
    private database: SQLite.SQLiteDatabase | null = null;
    private isInitialized = false;
    private initPromise: Promise<void> | null = null;

    async initialize(): Promise<void> {
        if (this.isInitialized) return;
        if (this.initPromise) return this.initPromise;
        this.initPromise = this.performInitialization();
        return this.initPromise;
    }

    private async performInitialization(): Promise<void> {
        try {
            this.logOperation("Initializing database", DATABASE_CONFIG.name);
            this.database = await SQLite.openDatabaseAsync(DATABASE_CONFIG.name);
            await this.runMigrations();
            this.isInitialized = true;
            this.logOperation("Database initialized successfully");
        } catch (error) {
            const dbError = this.createDatabaseError(
                "Database initialization failed",
                error
            );
            this.logError("Database initialization error", dbError);
            throw dbError;
        }
    }

    private async runMigrations(): Promise<void> {
        if (!this.database) throw new Error("Database not initialized");
        try {
            await this.database.execAsync("PRAGMA foreign_keys = ON;");
            const currentVersion = await this.getCurrentVersion();
            this.logOperation("Current database version", currentVersion.toString());
            for (const migration of DATABASE_CONFIG.migrations) {
                if (migration.version > currentVersion) {
                    this.logOperation("Running migration", `v${migration.version}`);
                    await this.runMigration(migration);
                }
            }
            await this.setCurrentVersion(DATABASE_CONFIG.version);
            this.logOperation("Migrations completed", `v${DATABASE_CONFIG.version}`);
        } catch (error) {
            throw this.createDatabaseError("Migration failed", error);
        }
    }

    private async getCurrentVersion(): Promise<number> {
        if (!this.database) return 0;
        try {
            const result = await this.database.getFirstAsync<{
                user_version: number;
            }>("PRAGMA user_version;");
            return result?.user_version ?? 0;
        } catch {
            return 0;
        }
    }

    private async setCurrentVersion(version: number): Promise<void> {
        if (!this.database) return;
        try {
            await this.database.execAsync(`PRAGMA user_version = ${version};`);
        } catch (error) {
            throw this.createDatabaseError("Failed to set database version", error);
        }
    }

    private async runMigration(migration: {
        version: number;
        queries: readonly string[];
    }): Promise<void> {
        if (!this.database) throw new Error("Database not initialized");
        try {
            await this.database.withTransactionAsync(async () => {
                for (const query of migration.queries) {
                    await this.database!.execAsync(query);
                }
            });
        } catch (error) {
            throw this.createDatabaseError(
                `Migration v${migration.version} failed`,
                error
            );
        }
    }

    async executeTransaction(transaction: DatabaseTransaction): Promise<void> {
        await this.ensureInitialized();
        let lastError: DatabaseError | null = null;
        for (
            let attempt = 1;
            attempt <= DB_CONSTANTS.MAX_RETRY_ATTEMPTS;
            attempt++
        ) {
            try {
                this.logOperation("Executing transaction", `attempt ${attempt}`);
                await this.database!.withTransactionAsync(async () => {
                    for (const query of transaction.queries) {
                        this.logQuery(query.sql, query.args);
                        if (query.args) {
                            await this.database!.runAsync(query.sql, query.args as any[]);
                        } else {
                            await this.database!.runAsync(query.sql);
                        }
                    }
                });
                this.logOperation("Transaction completed successfully");
                return;
            } catch (error) {
                lastError = this.createDatabaseError(
                    `Transaction failed (attempt ${attempt})`,
                    error
                );
                this.logError("Transaction error", lastError);
                if (attempt < DB_CONSTANTS.MAX_RETRY_ATTEMPTS) {
                    await this.delay(DB_CONSTANTS.RETRY_DELAY * attempt);
                }
            }
        }
        throw lastError;
    }

    async executeQuery<T = any>(
        sql: string,
        params?: readonly any[]
    ): Promise<T[]> {
        await this.ensureInitialized();
        try {
            this.logQuery(sql, params);
            const result = params
                ? await this.database!.getAllAsync<T>(sql, params as any[])
                : await this.database!.getAllAsync<T>(sql);
            this.logOperation("Query executed successfully", `${result.length} rows`);
            return result;
        } catch (error) {
            const dbError = this.createDatabaseError("Query execution failed", error);
            this.logError("Query error", dbError);
            throw dbError;
        }
    }

    async executeMutation(
        sql: string,
        params?: readonly any[]
    ): Promise<{ insertId?: number; changes: number }> {
        await this.ensureInitialized();
        try {
            this.logQuery(sql, params);
            const result = params
                ? await this.database!.runAsync(sql, params as any[])
                : await this.database!.runAsync(sql);
            this.logOperation(
                "Mutation executed successfully",
                `${result.changes} changes`
            );
            return {
                insertId: result.lastInsertRowId,
                changes: result.changes,
            };
        } catch (error) {
            const dbError = this.createDatabaseError(
                "Mutation execution failed",
                error
            );
            this.logError("Mutation error", dbError);
            throw dbError;
        }
    }
    private async ensureInitialized(): Promise<void> {
        if (!this.isInitialized) {
            await this.initialize();
        }
    }

    private createDatabaseError(
        message: string,
        originalError: any
    ): DatabaseError {
        const error = new Error(message) as DatabaseError;
        if (originalError) {
            error.cause = originalError;
            error.stack = originalError.stack;
            if (typeof originalError === "object") {
                (error as any).code = originalError.code;
                (error as any).constraint = originalError.constraint;
            }
        }
        return error;
    }

    private async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private logOperation(operation: string, details?: string): void {
        if (DB_CONSTANTS.LOG_QUERIES) {
            console.log(`[DB] ${operation}${details ? `: ${details}` : ""}`);
        }
    }

    private logQuery(sql: string, params?: readonly any[]): void {
        if (DB_CONSTANTS.LOG_QUERIES) {
            console.log(`[DB Query] ${sql}`, params ? params : "");
        }
    }

    private logError(message: string, error: any): void {
        if (DB_CONSTANTS.LOG_QUERIES) {
            console.error(`[DB Error] ${message}:`, error);
        }
    }
}

export const databaseService = new DatabaseService();
