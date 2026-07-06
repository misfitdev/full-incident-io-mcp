#!/usr/bin/env node
// Re-applies local customizations that openapi-mcp-generator overwrites on
// every run. `just gen` calls this so regeneration stays idempotent:
//
//   - adds the `test` and `lint` scripts
//   - removes the generator's unwired jest.config.js and legacy .eslintrc.json
//     (we use node:test and an ESLint flat config instead)
//   - rewrites .env.example with correct, documented variables (the generated
//     one omits INCIDENT_IO_ALLOW_WRITES and ships a truthy API_BASE_URL
//     placeholder that would override the correct default if copied verbatim)
//
// The custom auth hook (src/auth.ts), eslint.config.js, tsconfig.test.json, and
// *.test.ts files are preserved by the generator and don't need patching here.

import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const serverDir = join(here, "..", "server");
const pkgPath = join(serverDir, "package.json");
const envExamplePath = join(serverDir, ".env.example");
const scripts = {
  test: 'tsc -p tsconfig.test.json && node --test "build-test/**/*.test.js"',
  lint: "eslint .",
};

// devDependencies the generator drops on every run (it rewrites package.json
// with only its own deps). These back the `lint` script's ESLint flat config.
const devDependencies = {
  eslint: "^10.5.0",
  "@eslint/js": "^10.0.1",
  "typescript-eslint": "^8.61.1",
};

const envExample = `# Copy this file to .env and fill in your incident.io API key.
# .env is gitignored — never commit a real key.

# Required: your incident.io API key, passed as a bearer token.
# Create one at: incident.io dashboard -> Settings -> API keys.
BEARER_TOKEN_BEARERAUTH=

# Optional: allow mutating operations (POST/PUT/PATCH/DELETE).
# Omitted or anything other than true/1/yes => read-only.
INCIDENT_IO_ALLOW_WRITES=false

# Optional: override the API base URL. Leave UNSET to use the correct default
# (https://api.incident.io). Do not set this to a placeholder — any value here
# overrides the default.
# API_BASE_URL=
`;

async function main() {
  const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
  pkg.scripts ??= {};
  pkg.devDependencies ??= {};
  let changed = false;
  for (const [name, command] of Object.entries(scripts)) {
    if (pkg.scripts[name] !== command) {
      pkg.scripts[name] = command;
      changed = true;
    }
  }
  for (const [name, version] of Object.entries(devDependencies)) {
    if (pkg.devDependencies[name] !== version) {
      pkg.devDependencies[name] = version;
      changed = true;
    }
  }
  if (changed) {
    await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    process.stderr.write("post-gen: restored scripts and devDependencies in package.json\n");
  }

  await writeFile(envExamplePath, envExample);
  process.stderr.write("post-gen: rewrote .env.example\n");

  await rm(join(serverDir, "jest.config.js"), { force: true });
  await rm(join(serverDir, ".eslintrc.json"), { force: true });
  process.stderr.write("post-gen: done\n");
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error}\n`);
  process.exit(1);
});
