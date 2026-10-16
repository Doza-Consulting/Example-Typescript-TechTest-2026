/**
 * Domain types shared by the API, the storage layer and the seed data.
 */

export interface Room {
  id: string;
  name: string;
  theme: string;
  minPartySize: number;
  maxPartySize: number;
  durationMinutes: number;
  createdAt: string;
}

export interface GameMaster {
  id: string;
  name: string;
  email: string;
}

export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
  id: string;
  roomId: string;
  customerName: string;
  partySize: number;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  gameMasterId: string | null;
  createdAt: string;
  updatedAt: string;
}
