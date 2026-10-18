/**
 * Auth router — endpoints stubbed pending implementation.
 *
 * Persistence goes through the `store` (see src/store/types.ts).
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
export function authRouter(store: Store): Router {
  const router = Router();

  /**
   * TODO: register a new user.
   * Should validate the input (name, email, password), reject an email that
   * is already registered, and never store or return the plain-text password.
   */
  router.post("/auth/register", (_req, res) => {
    res.status(501).json(notImplemented("POST /auth/register is not implemented yet."));
  });

  /**
   * TODO: log a registered user in.
   * Should check the credentials and return something the client can send
   * on later requests to prove who they are.
   */
  router.post("/auth/login", (_req, res) => {
    res.status(501).json(notImplemented("POST /auth/login is not implemented yet."));
  });

  return router;
}
