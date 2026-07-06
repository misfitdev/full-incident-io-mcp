# incident-api-mcp

[![CI](https://github.com/misfitdev/full-incident-io-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/misfitdev/full-incident-io-mcp/actions/workflows/ci.yml)
[![SLSA Level 3](https://slsa.dev/images/gh-badge-level3.svg)](https://slsa.dev/spec/v1.0/levels#build-l3)

A read/write [Model Context Protocol](https://modelcontextprotocol.io) server
for the **full** [incident.io API](https://docs.incident.io/api-reference) —
including the configuration endpoints (catalog, custom fields, severities,
incident roles/statuses/types, schedules, escalation paths, alert routes, status
pages, and more) that the official incident.io MCP does not expose.

The server is generated from incident.io's published OpenAPI spec using
[`openapi-mcp-generator`](https://github.com/harsha-iiiv/openapi-mcp-generator),
so it covers all 142 operations across 33 resource groups.

> **On the official incident.io MCP:** incident.io ships [its own MCP
> server](https://docs.incident.io/), and it's genuinely good — use it for
> incident response and the interactive workflows it's built for. This project
> exists for a different reason: I wanted to **manage incident.io configuration
> with an LLM** (catalog, custom fields, severities, roles, schedules, and the
> rest of the admin surface), which the official server doesn't cover. So I
> built this to scratch that itch. No bad feelings toward the official one —
> only love. 💛

## Layout

| Path | What it is |
|------|------------|
| `spec/incident-io.openapi.json` | Pinned OpenAPI spec, with a bearer-auth scheme. |
| `scripts/prepare-spec.mjs` | Fetches and pins the spec from incident.io. |
| `scripts/post-gen.mjs` | Post-generation fixups (run by `just gen`). |
| `server/` | The generated TypeScript MCP server. |
| `server/src/auth.ts` | The write-gate. The only hand-written source file. |
| `server/src/auth.test.ts` | Tests for the write-gate. |
| `lefthook.yml` | Git hooks (lint and test on commit). |

## Setup

Requires Node 20+. The server source is committed, so a fresh clone just needs
dependencies and a build:

```sh
mise install          # Node 20 (or install Node 20+ yourself)
just install          # install server dependencies
just build            # compile to server/build/
just hooks            # install git hooks (optional)
```

## Get an API key

You need an incident.io API key. In the incident.io dashboard, go to
**Settings → API keys → Create**, choose the permissions the key should have,
and copy the token (it is shown only once).

The key's permissions are enforced by incident.io independently of this server.
A read-only key keeps the whole server read-only no matter how it's configured —
a good choice for a first run.

## Configuration

Set these in the environment (or in `server/.env`, copied from
`server/.env.example`; `.env` is gitignored):

| Variable | Required | Purpose |
|----------|----------|---------|
| `BEARER_TOKEN_BEARERAUTH` | yes | Your incident.io API key, sent as `Authorization: Bearer <key>`. |
| `INCIDENT_IO_ALLOW_WRITES` | no | `true`/`1`/`yes` enables mutating tools. Anything else (or unset) is **read-only**. |
| `API_BASE_URL` | no | Override the API base URL. Leave unset to use `https://api.incident.io`. |

### Read vs. write

The server always exposes the full read/write tool surface (all 142 tools show
up). What changes is whether the writes *execute*:

- Read tools (`GET`) always run.
- Write tools (`POST`/`PUT`/`PATCH`/`DELETE`) are **blocked by default** and run
  only when `INCIDENT_IO_ALLOW_WRITES` is truthy.

This is a convenience guard, not a security boundary; the real limit on what the
key can do is its incident.io permissions.

## Running standalone

```sh
BEARER_TOKEN_BEARERAUTH=<YOUR_API_KEY> just run                                # read-only
BEARER_TOKEN_BEARERAUTH=<YOUR_API_KEY> INCIDENT_IO_ALLOW_WRITES=true just run   # read/write
```

The server speaks the Model Context Protocol over stdio, so running it directly
just waits for a client. Normally you register it with an MCP client instead.

## Use with Claude Code

From this directory, register the built server (replace the key):

```sh
claude mcp add incident-io \
  --env BEARER_TOKEN_BEARERAUTH=<YOUR_API_KEY> \
  --env INCIDENT_IO_ALLOW_WRITES=false \
  -- node "$PWD/server/build/index.js"
```

Add `-s user` to make it available across all your projects rather than just
this one.

## Use with Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` and add
an entry under `mcpServers` (use an absolute path to the built file):

```json
{
  "mcpServers": {
    "incident-io": {
      "command": "node",
      "args": ["/absolute/path/to/incident-api-mcp/server/build/index.js"],
      "env": {
        "BEARER_TOKEN_BEARERAUTH": "<YOUR_API_KEY>",
        "INCIDENT_IO_ALLOW_WRITES": "false"
      }
    }
  }
}
```

Restart Claude Desktop after editing the config.

## Tests

```sh
just test
```

Tests cover the write-gate (`server/src/auth.test.ts`); the generated code is
not unit-tested. They also run on `pre-commit` via lefthook.

## Regenerating

To pull a newer incident.io spec or change how the server is generated:

```sh
just spec    # re-fetch and re-pin the OpenAPI spec
just gen     # regenerate server/ from the pinned spec
```

`just gen` is idempotent and preserves the hand-written `server/src/auth.ts`.
Review that file after regenerating.

## Releases & provenance

Pushing a `v*` tag builds a release. Each release ships a tarball of the built
server plus the pinned spec, and a
[SLSA Build L3](https://slsa.dev/spec/v1.0/levels#build-l3) provenance
attestation (`incident-api-mcp.intoto.jsonl`).

```sh
git tag v1.0.0
git push origin v1.0.0
```

Verify a downloaded artifact against its provenance with
[`slsa-verifier`](https://github.com/slsa-framework/slsa-verifier):

```sh
slsa-verifier verify-artifact incident-api-mcp-v1.0.0.tgz \
  --provenance-path incident-api-mcp.intoto.jsonl \
  --source-uri github.com/misfitdev/full-incident-io-mcp
```
