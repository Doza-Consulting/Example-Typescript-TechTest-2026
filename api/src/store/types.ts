/**
 * Storage interface. The API only talks to this, so the same routes run
 * against SQLite locally and DynamoDB when deployed to AWS.
 *
 * Methods: whole-collection `list()` plus get/insert/update. Any method you
 * add here needs implementing in every implementation under src/store/.
 */

import { Booking, GameMaster, Room } from "../models";

export interface Store {
  rooms: {
    list(): Promise<Room[]>;
    get(id: string): Promise<Room | undefined>;
  };
  gameMasters: {
    list(): Promise<GameMaster[]>;
    get(id: string): Promise<GameMaster | undefined>;
  };
  bookings: {
    list(): Promise<Booking[]>;
    get(id: string): Promise<Booking | undefined>;
    insert(booking: Booking): Promise<void>;
    /** Replaces the stored booking with the same id. */
    update(booking: Booking): Promise<void>;
  };
}
