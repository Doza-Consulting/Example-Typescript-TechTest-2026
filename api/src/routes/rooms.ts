/**
 * Rooms router.
 */

import { Router } from "express";

import { Store } from "../store";

export function roomsRouter(store: Store): Router {
  const router = Router();

  /** List all rooms. Implemented. */
  router.get("/rooms", async (_req, res, next) => {
    try {
      res.status(200).json({ data: await store.rooms.list() });
    } catch (err) {
      next(err);
    }
  });

  /**
   * TODO: Implement this endpoint.
   *
   * Must be public (no auth) and must not expose booking/customer detail —
   * only slot start/end times and availability. Should honor optional
   * `from` / `to` query params (ISO 8601 date-times) if provided. Should
   * return 404 if the room doesn't exist.
   *
   * See openapi.yaml for the full response contract (AvailabilitySlot).
   */
  router.get("/rooms/:id/availability", (_req, res) => {
    res.status(501).json({
      error: {
        code: "NOT_IMPLEMENTED",
        message: "GET /rooms/{id}/availability is not implemented yet.",
      },
    });
  });

  return router;
}
