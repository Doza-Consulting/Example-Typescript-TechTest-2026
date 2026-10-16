/**
 * Health check endpoint — already implemented and working.
 *
 * This is here as a reference for the pattern the rest of the app follows
 * (router per resource, JSON responses, standard Express routing). Nothing
 * to build here.
 */

import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
