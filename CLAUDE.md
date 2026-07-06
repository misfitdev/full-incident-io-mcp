# Project Instructions for AI Agents

This file provides instructions and context for AI coding agents working on this project.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:7510c1e2 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->


## Build & Test

All commands run through `just` (see the `justfile`):

```bash
just spec      # Refresh and pin the incident.io OpenAPI spec
just gen       # Regenerate server/ from the spec, then re-apply local patches
just install   # Install server dependencies
just build     # Compile the TypeScript server
just test      # Run unit tests for the hand-written code
just check     # Build, then assert the server lists its full tool surface
just run       # Run the MCP server over stdio
just hooks     # Install git hooks via lefthook
```

## Architecture Overview

This repo is an MCP server for the full incident.io API, generated from
incident.io's published OpenAPI spec rather than hand-written.

- `scripts/prepare-spec.mjs` fetches the spec and injects a bearer-auth scheme
  (the published spec omits one), pinning the result to `spec/`.
- `openapi-mcp-generator` turns that spec into the TypeScript server in
  `server/` (one MCP tool per API operation).
- `scripts/post-gen.mjs` re-applies the customizations the generator clobbers
  on each run, keeping `just gen` idempotent.

The only hand-written, behavior-bearing code is `server/src/auth.ts`, which
holds the write-gate. It is the one file in `server/` worth reading and testing
closely; everything else is generated and replaced on regeneration.

## Conventions & Patterns

- **Regenerate, don't patch generated code.** `server/src/index.ts` and most of
  `server/` are generated. To change behavior, change the spec
  (`scripts/prepare-spec.mjs`) or the post-gen step (`scripts/post-gen.mjs`),
  not the generated output.
- **`server/src/auth.ts` is the exception** — it is generated once and then
  preserved across regeneration, so it is safe to hand-edit.
- **Writes are gated.** Mutating operations only run when
  `INCIDENT_IO_ALLOW_WRITES` is truthy. Keep that behavior intact.
- **Tests cover hand-written code only** (`server/src/auth.test.ts`), via
  Node's built-in `node:test` — no jest.
