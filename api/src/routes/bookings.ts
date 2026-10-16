/**
 * Bookings router — all endpoints stubbed pending implementation.
 *
 * No auth and no validation yet. Persistence goes through the `store`
 * (see src/store/types.ts).
 */

import { Router } from "express";

import { Store } from "../store";

function notImplemented(message: string) {
  return {
    error: {
      code: "NOT_IMPLEMENTED",
      message,
    },
  };
}

// `store` is unused while the endpoints are stubbed.
export function bookingsRouter(store: Store): Router {
  const router = Router();

  /**
   * TODO: list bookings.
   * Should support filtering (roomId, status) and pagination.
   * Should require authentication.
   */
  router.get("/bookings", (_req, res) => {
    res.status(501).json(notImplemented("GET /bookings is not implemented yet."));
  });

  /**
   * TODO: create a booking.
   * Should validate partySize against the room's min/max capacity and
   * reject any request that overlaps an existing confirmed booking for the
   * same room. Should require authentication.
   */
  router.post("/bookings", (_req, res) => {
    res.status(501).json(notImplemented("POST /bookings is not implemented yet."));
  });

  /**
   * TODO: fetch a single booking by id. Should require authentication.
   */
  router.get("/bookings/:id", (_req, res) => {
    res.status(501).json(notImplemented("GET /bookings/{id} is not implemented yet."));
  });

  /**
   * TODO: update a booking (reschedule, change party size, cancel).
   * Should require authentication; reschedules should be checked against
   * the same overlap rule as creation.
   */
  router.patch("/bookings/:id", (_req, res) => {
    res.status(501).json(notImplemented("PATCH /bookings/{id} is not implemented yet."));
  });

  /**
   * TODO: assign a game master to a booking by gameMasterId.
   * Should require authentication.
   */
  router.post("/bookings/:id/assign", (_req, res) => {
    res
      .status(501)
      .json(notImplemented("POST /bookings/{id}/assign is not implemented yet."));
  });

  return router;
}
