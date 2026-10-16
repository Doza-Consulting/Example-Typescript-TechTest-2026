/**
 * SQLite store (Node's built-in node:sqlite, no native dependencies).
 * Used for local development and tests. Pass ":memory:" for a throwaway DB.
 */

import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";

import { Booking, GameMaster, Room } from "../models";
import { SEED_GAME_MASTERS, seedRooms } from "../seed";
import { Store } from "./types";

type Row = Record<string, any>;

export function createSqliteStore(filename: string): Store {
  if (filename !== ":memory:") {
    fs.mkdirSync(path.dirname(filename), { recursive: true });
  }
  const db = new DatabaseSync(filename);

  db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      theme TEXT NOT NULL,
      min_party_size INTEGER NOT NULL,
      max_party_size INTEGER NOT NULL,
      duration_minutes INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS game_masters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      party_size INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      status TEXT NOT NULL,
      game_master_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  const roomFromRow = (r: Row): Room => ({
    id: r.id,
    name: r.name,
    theme: r.theme,
    minPartySize: r.min_party_size,
    maxPartySize: r.max_party_size,
    durationMinutes: r.duration_minutes,
    createdAt: r.created_at,
  });

  const gameMasterFromRow = (r: Row): GameMaster => ({
    id: r.id,
    name: r.name,
    email: r.email,
  });

  const bookingFromRow = (r: Row): Booking => ({
    id: r.id,
    roomId: r.room_id,
    customerName: r.customer_name,
    partySize: r.party_size,
    startTime: r.start_time,
    endTime: r.end_time,
    status: r.status,
    gameMasterId: r.game_master_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  });

  // Seed reference data on first run.
  const roomCount = db.prepare("SELECT COUNT(*) AS n FROM rooms").get() as Row;
  if (roomCount.n === 0) {
    const insert = db.prepare(
      "INSERT INTO rooms VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    for (const r of seedRooms()) {
      insert.run(
        r.id,
        r.name,
        r.theme,
        r.minPartySize,
        r.maxPartySize,
        r.durationMinutes,
        r.createdAt
      );
    }
  }
  const gmCount = db
    .prepare("SELECT COUNT(*) AS n FROM game_masters")
    .get() as Row;
  if (gmCount.n === 0) {
    const insert = db.prepare("INSERT INTO game_masters VALUES (?, ?, ?)");
    for (const g of SEED_GAME_MASTERS) insert.run(g.id, g.name, g.email);
  }

  return {
    rooms: {
      async list() {
        return db.prepare("SELECT * FROM rooms ORDER BY name").all().map(roomFromRow);
      },
      async get(id) {
        const row = db.prepare("SELECT * FROM rooms WHERE id = ?").get(id);
        return row ? roomFromRow(row) : undefined;
      },
    },
    gameMasters: {
      async list() {
        return db
          .prepare("SELECT * FROM game_masters ORDER BY name")
          .all()
          .map(gameMasterFromRow);
      },
      async get(id) {
        const row = db.prepare("SELECT * FROM game_masters WHERE id = ?").get(id);
        return row ? gameMasterFromRow(row) : undefined;
      },
    },
    bookings: {
      async list() {
        return db
          .prepare("SELECT * FROM bookings ORDER BY created_at")
          .all()
          .map(bookingFromRow);
      },
      async get(id) {
        const row = db.prepare("SELECT * FROM bookings WHERE id = ?").get(id);
        return row ? bookingFromRow(row) : undefined;
      },
      async insert(b) {
        db.prepare(
          "INSERT INTO bookings VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).run(
          b.id,
          b.roomId,
          b.customerName,
          b.partySize,
          b.startTime,
          b.endTime,
          b.status,
          b.gameMasterId,
          b.createdAt,
          b.updatedAt
        );
      },
      async update(b) {
        db.prepare(
          `UPDATE bookings SET room_id = ?, customer_name = ?, party_size = ?,
             start_time = ?, end_time = ?, status = ?, game_master_id = ?,
             updated_at = ? WHERE id = ?`
        ).run(
          b.roomId,
          b.customerName,
          b.partySize,
          b.startTime,
          b.endTime,
          b.status,
          b.gameMasterId,
          b.updatedAt,
          b.id
        );
      },
    },
  };
}
