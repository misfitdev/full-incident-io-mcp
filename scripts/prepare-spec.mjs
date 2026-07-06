#!/usr/bin/env node
// Fetches the incident.io public OpenAPI spec and prepares it for MCP
// generation. The published spec declares no security scheme even though the
// API requires `Authorization: Bearer <API_KEY>`, so we inject a bearerAuth
// scheme and a global security requirement. The result is pinned to
// spec/incident-io.openapi.json so generation is reproducible offline.

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SPEC_URL = "https://docs.incident.io/openapi/public-v3.json";
const here = dirname(fileURLToPath(import.meta.url));
const outPath = join(here, "..", "spec", "incident-io.openapi.json");

async function main() {
  const source = process.argv[2] ?? SPEC_URL;
  process.stderr.write(`fetching spec from ${source}\n`);

  const response = await fetch(source);
  if (!response.ok) {
    throw new Error(`failed to fetch spec: ${response.status} ${response.statusText}`);
  }
  const spec = await response.json();

  injectBearerAuth(spec);

  const operationCount = countOperations(spec);
  await writeFile(outPath, `${JSON.stringify(spec, null, 2)}\n`);
  process.stderr.write(
    `wrote ${outPath} (${Object.keys(spec.paths ?? {}).length} paths, ${operationCount} operations)\n`,
  );
}

// injectBearerAuth adds an HTTP bearer security scheme and applies it globally.
// incident.io uses API keys passed as bearer tokens.
function injectBearerAuth(spec) {
  spec.components ??= {};
  spec.components.securitySchemes ??= {};
  spec.components.securitySchemes.bearerAuth = {
    type: "http",
    scheme: "bearer",
    description: "incident.io API key passed as a bearer token.",
  };
  spec.security = [{ bearerAuth: [] }];
}

function countOperations(spec) {
  const methods = new Set(["get", "post", "put", "patch", "delete"]);
  let count = 0;
  for (const operations of Object.values(spec.paths ?? {})) {
    for (const method of Object.keys(operations)) {
      if (methods.has(method)) count += 1;
    }
  }
  return count;
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error}\n`);
  process.exit(1);
});
