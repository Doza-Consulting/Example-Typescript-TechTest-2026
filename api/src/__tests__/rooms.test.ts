import request from "supertest";

import { createApp } from "../app";
import { createSqliteStore } from "../store/sqlite";

describe("GET /rooms", () => {
  it("returns the seeded rooms", async () => {
    const res = await request(createApp(createSqliteStore(":memory:"))).get("/rooms");

    expect(res.status).toBe(200);
    expect(res.body.data.map((r: { name: string }) => r.name)).toEqual([
      "Cursed Manor",
      "Lost Signal",
      "The Vault",
    ]);
  });
});
