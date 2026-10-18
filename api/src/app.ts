import express, { Express } from "express";

import { healthRouter } from "./routes/health";
import { roomsRouter } from "./routes/rooms";
import { bookingsRouter } from "./routes/bookings";
import { authRouter } from "./routes/auth";
import { createStoreFromEnv, Store } from "./store";

/**
 * Builds the Express app. The store defaults to whatever the environment
 * selects (SQLite locally, DynamoDB on AWS); tests can pass their own,
 * e.g. createSqliteStore(":memory:").
 */
export function createApp(store: Store = createStoreFromEnv()): Express {
  const app = express();
  app.use(express.json());

  app.use(healthRouter);
  app.use(authRouter(store));
  app.use(roomsRouter(store));
  app.use(bookingsRouter(store));

  return app;
}
