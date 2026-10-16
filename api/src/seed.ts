/**
 * Seed data. Written to the store on first start (SQLite locally, DynamoDB
 * when deployed) if the rooms / game masters tables are empty.
 * Bookings start empty and are created through the API.
 */

import { GameMaster, Room } from "./models";

export function seedRooms(): Room[] {
  const createdAt = new Date().toISOString();
  return [
    {
      id: "11111111-1111-1111-1111-111111111111",
      name: "The Vault",
      theme: "Heist",
      minPartySize: 2,
      maxPartySize: 6,
      durationMinutes: 60,
      createdAt,
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Cursed Manor",
      theme: "Horror",
      minPartySize: 3,
      maxPartySize: 8,
      durationMinutes: 75,
      createdAt,
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      name: "Lost Signal",
      theme: "Sci-Fi",
      minPartySize: 2,
      maxPartySize: 4,
      durationMinutes: 45,
      createdAt,
    },
  ];
}

export const SEED_GAME_MASTERS: GameMaster[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    name: "Alex Rivera",
    email: "alex@escapequeue.test",
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    name: "Sam Okafor",
    email: "sam@escapequeue.test",
  },
];
