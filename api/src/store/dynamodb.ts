/**
 * DynamoDB store, used when the API is deployed to AWS (see /terraform).
 *
 * One on-demand table per entity, keyed on `id`, named `${prefix}-rooms`,
 * `${prefix}-game-masters` and `${prefix}-bookings`. Items are stored as the
 * plain model objects. `list()` is a Scan, which is fine at this scale.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import { Booking, GameMaster, Room } from "../models";
import { SEED_GAME_MASTERS, seedRooms } from "../seed";
import { Store } from "./types";

export function createDynamoStore(tablePrefix: string): Store {
  const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  const table = (name: string) => `${tablePrefix}-${name}`;

  async function scan<T>(TableName: string): Promise<T[]> {
    const items: T[] = [];
    let ExclusiveStartKey: Record<string, any> | undefined;
    do {
      const res = await doc.send(new ScanCommand({ TableName, ExclusiveStartKey }));
      items.push(...((res.Items ?? []) as T[]));
      ExclusiveStartKey = res.LastEvaluatedKey;
    } while (ExclusiveStartKey);
    return items;
  }

  async function get<T>(TableName: string, id: string): Promise<T | undefined> {
    const res = await doc.send(new GetCommand({ TableName, Key: { id } }));
    return res.Item as T | undefined;
  }

  async function put(TableName: string, Item: object): Promise<void> {
    await doc.send(new PutCommand({ TableName, Item }));
  }

  // Seed reference data once per container, only if the table is empty.
  const seeded = (async () => {
    if ((await scan<Room>(table("rooms"))).length === 0) {
      for (const r of seedRooms()) await put(table("rooms"), r);
    }
    if ((await scan<GameMaster>(table("game-masters"))).length === 0) {
      for (const g of SEED_GAME_MASTERS) await put(table("game-masters"), g);
    }
  })();
  seeded.catch(() => undefined); // surfaced on first use below

  return {
    rooms: {
      async list() {
        await seeded;
        const rooms = await scan<Room>(table("rooms"));
        return rooms.sort((a, b) => a.name.localeCompare(b.name));
      },
      async get(id) {
        await seeded;
        return get<Room>(table("rooms"), id);
      },
    },
    gameMasters: {
      async list() {
        await seeded;
        const gms = await scan<GameMaster>(table("game-masters"));
        return gms.sort((a, b) => a.name.localeCompare(b.name));
      },
      async get(id) {
        await seeded;
        return get<GameMaster>(table("game-masters"), id);
      },
    },
    bookings: {
      async list() {
        const bookings = await scan<Booking>(table("bookings"));
        return bookings.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      },
      async get(id) {
        return get<Booking>(table("bookings"), id);
      },
      async insert(b) {
        await put(table("bookings"), b);
      },
      async update(b) {
        await put(table("bookings"), b);
      },
    },
  };
}
