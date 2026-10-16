/**
 * Picks a store implementation from the environment:
 *
 *   STORAGE=sqlite   (default) local file DB at SQLITE_PATH (default ./data/escapequeue.db)
 *   STORAGE=dynamodb           DynamoDB tables named `${TABLE_PREFIX}-...`
 */

import { Store } from "./types";

export type { Store } from "./types";

export function createStoreFromEnv(): Store {
  const kind = process.env.STORAGE ?? "sqlite";

  if (kind === "dynamodb") {
    const prefix = process.env.TABLE_PREFIX;
    if (!prefix) throw new Error("TABLE_PREFIX is required when STORAGE=dynamodb");
    // Required lazily so each runtime only loads the driver it uses.
    return require("./dynamodb").createDynamoStore(prefix);
  }

  if (kind === "sqlite") {
    return require("./sqlite").createSqliteStore(
      process.env.SQLITE_PATH ?? "./data/escapequeue.db"
    );
  }

  throw new Error(`Unknown STORAGE "${kind}" (expected "sqlite" or "dynamodb")`);
}
