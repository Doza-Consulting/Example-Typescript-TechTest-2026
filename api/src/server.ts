import { createApp } from "./app";

// Port 3000 to match the OpenAPI spec's local dev server entry.
const PORT = Number(process.env.PORT ?? 3000);

const app = createApp();

app.listen(PORT, () => {
  console.log(`EscapeQueue API listening on http://localhost:${PORT}`);
});
