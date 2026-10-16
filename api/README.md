# API

Express + TypeScript REST API for Escape Queue, a booking engine for a chain
of escape room venues. Customers can see room availability publicly; venue
staff manage bookings and game-master assignments. The full contract is in
[openapi.yaml](openapi.yaml) (paste it into <https://editor.swagger.io> to
browse it).

## Running locally

From the repo root (recommended, it's an npm workspace):

```bash
npm install
make dev-api          # or: npm run dev -w api
```

The API listens on <http://localhost:3000>. Check it with:

```bash
curl http://localhost:3000/health     # {"status":"ok"}
curl http://localhost:3000/rooms
```

It hot-reloads on save (`ts-node-dev`). Set `PORT` to use a different port.

Requires Node 22.13+ (SQLite uses Node's built-in `node:sqlite`, so there's
nothing native to compile).

## Scripts

Run from the repo root with `-w api`, or from this folder without it.

| Script | What it does |
|---|---|
| `npm run dev` | run with hot reload |
| `npm test` | run Jest tests |
| `npm run test:watch` | Jest in watch mode |
| `npm run build` | type-check and compile to `dist/` |
| `npm start` | run the compiled build (`dist/server.js`) |
| `npm run build:lambda` | bundle for AWS Lambda into `dist-lambda/` |

## Folder structure

```
api/
├── openapi.yaml           API contract
├── package.json
├── tsconfig.json
├── jest.config.js
└── src/
    ├── app.ts             Express app factory: createApp(store?)
    ├── server.ts          local entry point (listens on :3000)
    ├── lambda.ts          AWS Lambda entry point (same app, via serverless-http)
    ├── models.ts          Room, GameMaster, Booking types
    ├── seed.ts            seed rooms and game masters
    ├── routes/            one router per resource
    │   ├── health.ts
    │   ├── rooms.ts
    │   └── bookings.ts
    ├── store/             storage layer
    │   ├── types.ts       the Store interface the routes use
    │   ├── index.ts       picks an implementation from env vars
    │   ├── sqlite.ts      local dev + tests
    │   └── dynamodb.ts    deployed on AWS
    └── __tests__/         Jest + supertest tests
```

## Endpoints

| Method | Path | Status |
|---|---|---|
| GET | `/health` | ✅ Implemented (reference pattern) |
| GET | `/rooms` | ✅ Implemented |
| GET | `/rooms/:id/availability` | 🔲 Stubbed (`501`) |
| GET | `/bookings` | 🔲 Stubbed (`501`) |
| POST | `/bookings` | 🔲 Stubbed (`501`) |
| GET | `/bookings/:id` | 🔲 Stubbed (`501`) |
| PATCH | `/bookings/:id` | 🔲 Stubbed (`501`) |
| POST | `/bookings/:id/assign` | 🔲 Stubbed (`501`) |

Errors use the shape `{ "error": { "code": "...", "message": "..." } }`.
Stubs return it with code `NOT_IMPLEMENTED`. Each stub has a `TODO` comment
describing what it should do.

## Domain

- **Room**: has a name, theme, min/max party size and a running time
  (`durationMinutes`). Three are seeded: The Vault (2–6 players, 60 min),
  Cursed Manor (3–8, 75 min) and Lost Signal (2–4, 45 min).
- **Booking**: a party's reservation of a room for a time window. It has a
  `status` (`confirmed` or `cancelled`) and an optional game master. Times are
  ISO 8601 strings. `endTime` is derived from the room's `durationMinutes`.
- **Game master**: a staff member who runs a session. Two are seeded.

## Storage

Routes use the `Store` interface in [src/store/types.ts](src/store/types.ts)
and never touch a database directly. The implementation is chosen by
environment variable:

| Variable | Default | Meaning |
|---|---|---|
| `STORAGE` | `sqlite` | `sqlite` or `dynamodb` |
| `SQLITE_PATH` | `./data/escapequeue.db` | SQLite file (when `STORAGE=sqlite`) |
| `TABLE_PREFIX` | none | DynamoDB table prefix (required when `STORAGE=dynamodb`) |
| `PORT` | `3000` | local server port |

- Rooms and game masters are seeded on first start if their tables are empty.
  Bookings start empty.
- Local data is a file in `api/data/` (git-ignored). Delete the folder to reset.
- The interface has `list`, `get`, `insert` and `update`. Any method you add
  must be added to the interface **and** to both implementations.
- Deployed, the tables are created by Terraform (see [../terraform](../terraform)).

## Testing

Tests use Jest + supertest and live in `src/__tests__/`. Build the app with a
throwaway in-memory store and call it in-process, with no server or port
needed:

```ts
import request from "supertest";
import { createApp } from "../app";
import { createSqliteStore } from "../store/sqlite";

const app = createApp(createSqliteStore(":memory:"));
const res = await request(app).get("/rooms");
```

Each test that builds its own store starts from a clean seeded database. See
`health.test.ts` and `rooms.test.ts` for examples.

## Good to know

- There is **no authentication** and **no request validation** yet. Every
  route is open.
- The router-per-resource layout is a starting point, not a requirement.
- On AWS the same Express app runs in Lambda behind CloudFront, which sends
  `/api/*` to it. `lambda.ts` strips the `/api` prefix, so routes are
  identical locally and deployed.
