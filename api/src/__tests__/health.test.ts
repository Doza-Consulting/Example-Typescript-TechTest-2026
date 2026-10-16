/**
 * Reference test showing the pattern: build the app with createApp() and
 * drive it in-process with supertest (no port, no running server needed).
 * Each test gets its own throwaway in-memory SQLite store.
 */

import request from "supertest";

import { createApp } from "../app";
import { createSqliteStore } from "../store/sqlite";

describe("GET /health", () => {
  it("returns 200 and status ok", async () => {
    const res = await request(createApp(createSqliteStore(":memory:"))).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
