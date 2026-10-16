# Escape Queue

A full-stack booking app for escape room venues, used as the starting point
for Doza's paired-programming technical assessment. The aim is to learn how
you think as an engineer and how you approach problems. You'll be given some
tasks to attempt; we don't expect you to finish everything. A solid
explanation of what you do complete matters more than functional completeness
you can't explain.

## Repo layout

```
/
├── api/         Express + TypeScript API (see api/openapi.yaml for the contract)
├── ui/          React + Vite + TypeScript front end
├── terraform/   AWS infrastructure (S3 + CloudFront, Lambda, DynamoDB)
└── scripts/     Deployment helpers
```

This is an npm workspace: one `npm install` at the root covers `api` and `ui`.
Requires Node 22.13 or newer.

## Quick reference

Run `make help` to list all commands. The common ones:

| Command | What it does |
|---|---|
| `make install` | install dependencies |
| `make dev` | run API and UI together |
| `make test` | run API and UI tests |
| `make build` | build the API, UI and Lambda bundle for hosting |

## Running locally

```bash
npm install
npm run dev        # API on :3000 and UI on :5173
```

Or individually: `npm run dev:api`, `npm run dev:ui`.

- UI: <http://localhost:5173> (shows API status and the list of rooms)
- API: <http://localhost:3000>. Check it with `curl http://localhost:3000/health`
- The UI calls `/api/...`, which Vite proxies to the API with the prefix stripped.

```bash
npm test           # API tests (Jest + supertest) and UI tests (Vitest)
npm run test:watch -w ui   # UI tests in watch mode
npm run build      # type-check and build api + ui
```

## API

### Current endpoint status

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

Stubs return `{ "error": { "code": "NOT_IMPLEMENTED", "message": "..." } }`.
`api/openapi.yaml` describes the full contract (import it into Swagger Editor).

### Structure

```
api/src/
├── app.ts            Express app factory, mounts routers
├── server.ts         local entry point
├── lambda.ts         AWS Lambda entry point (same app)
├── models.ts         Room, GameMaster, Booking types
├── seed.ts           seed rooms and game masters
├── store/            storage layer: types.ts (interface), sqlite.ts, dynamodb.ts
├── routes/           one router per resource (health, rooms, bookings)
└── __tests__/        Jest + supertest tests (health.test.ts is the example)
```

### Storage

Routes talk to a `Store` interface (`api/src/store/types.ts`), so the same
code runs against two backends, chosen by environment variable:

| `STORAGE` | Backend | Used for |
|---|---|---|
| `sqlite` (default) | SQLite file at `SQLITE_PATH` (default `api/data/escapequeue.db`) | local dev; tests use `:memory:` |
| `dynamodb` | DynamoDB tables named `${TABLE_PREFIX}-rooms` etc. | deployed on AWS |

Rooms and game masters are seeded on first start. Bookings start empty. The
interface can be extended, but any new method needs adding to both
implementations. To reset local data, delete `api/data/`.

### Writing tests

Build the app with an in-memory store and call it with supertest:

```ts
const app = createApp(createSqliteStore(":memory:"));
const res = await request(app).get("/rooms");
```

## UI

```
ui/src/
├── main.tsx          entry point (HashRouter, so deep links work on static hosting)
├── App.tsx           layout, nav and routes
├── api.ts            API client (relative /api/... URLs)
├── pages/            Rooms (room list), About (company and app context)
├── components/       shared components (HealthBadge)
└── test/setup.ts     Vitest setup (jest-dom matchers, cleanup)
```

UI tests use Vitest + React Testing Library (jsdom), colocated with the code
as `*.test.tsx`. `src/pages/Rooms.test.tsx` shows how to stub `fetch` for
components that call the API, and `src/App.test.tsx` shows routing tests with
`MemoryRouter`.

## Other notes

- There is currently no auth and no request validation. Every route is open.
- The router-per-resource structure is a reasonable starting pattern, not a
  requirement. Restructure if you'd do it differently.

## CI

`.github/workflows/ci.yml` runs on pushes to `main` and on pull requests. It
currently only echoes a placeholder message. The Makefile has targets for
install, test and build.

## Deploying to AWS (optional)

See [terraform/README.md](terraform/README.md). In short:

```bash
npm run build:lambda -w api
terraform -chdir=terraform init
terraform -chdir=terraform apply
./scripts/deploy-ui.sh
```
