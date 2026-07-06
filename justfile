# Run `just` to see available recipes.
default:
    @just --list

# Refresh and pin the incident.io OpenAPI spec (injects bearer auth).
spec:
    node scripts/prepare-spec.mjs

# Regenerate the MCP server from the pinned spec (review src/auth.ts after).
gen:
    npx -y openapi-mcp-generator@latest \
        --input spec/incident-io.openapi.json \
        --output server \
        --server-name incident-api-mcp \
        --transport stdio \
        --custom-auth \
        --force
    node scripts/post-gen.mjs

# Install server dependencies.
install:
    cd server && npm install

# Build the TypeScript server.
build:
    cd server && npm run build

# Run the MCP server over stdio (needs BEARER_TOKEN_BEARERAUTH in the env).
run:
    cd server && node build/index.js

# Lint the hand-written code (ESLint flat config; generated code is ignored).
lint:
    cd server && npm run lint

# Run unit tests for the hand-written code (write-gate, etc.).
test:
    cd server && npm test

# Install git hooks via lefthook (beads runs as a step; see lefthook.yml).
hooks:
    lefthook install

# Build, then assert the server lists its full tool surface over stdio.
check: build
    #!/usr/bin/env bash
    set -euo pipefail
    cd server
    count=$(printf '%s\n' \
        '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"check","version":"0"}}}' \
        '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
        '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
        | BEARER_TOKEN_BEARERAUTH=dummy node build/index.js 2>/dev/null \
        | node -e 'let b="";process.stdin.on("data",c=>b+=c).on("end",()=>{for(const l of b.split("\n")){if(!l.trim())continue;let m;try{m=JSON.parse(l)}catch{continue}if(m.id===2&&m.result?.tools){console.log(m.result.tools.length);return}}console.log(0)})')
    echo "tools exposed: ${count}"
    test "${count}" -gt 0 || { echo "FAIL: server listed no tools" >&2; exit 1; }
