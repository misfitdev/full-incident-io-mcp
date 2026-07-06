/**
 * Custom authentication hook.
 *
 * This file is generated once and is safe to edit. It is imported by the
 * generated MCP server and invoked for every tool call BEFORE the built-in
 * environment-variable-based authentication is applied.
 *
 * Mutate `ctx.headers` / `ctx.queryParams` to inject your own credentials.
 * Return `true` to indicate auth is fully handled and built-in auth should be
 * skipped for this request; return `false` (the default) to fall through to
 * built-in auth.
 */

export interface CustomAuthContext {
  /** Mutable request headers (lower-cased keys). */
  headers: Record<string, string>;
  /** Mutable query parameters. */
  queryParams: Record<string, unknown>;
  /** Name of the tool being executed. */
  toolName: string;
  /** Tool definition fields the auth hook may read. */
  definition: {
    name: string;
    method: string;
    pathTemplate: string;
    securityRequirements: unknown[];
  };
}

/**
 * Apply custom authentication. Edit this function to implement your scheme.
 *
 * @param ctx Mutable auth context for the current request
 * @returns true if auth was fully handled (skip built-in auth), else false
 */
export async function applyCustomAuth(ctx: CustomAuthContext): Promise<boolean> {
  enforceWriteGate(ctx);

  // Do nothing else and let built-in bearer auth (BEARER_TOKEN_BEARERAUTH) run.
  return false;
}

// HTTP methods that mutate state on the incident.io API.
const writeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// enforceWriteGate blocks mutating tool calls unless writes are explicitly
// enabled. The server always exposes the full read/write tool surface, but
// writes only execute when INCIDENT_IO_ALLOW_WRITES is set to a truthy value.
// This keeps a single build that an operator toggles per deployment, rather
// than regenerating to add or remove write tools.
export function enforceWriteGate(ctx: CustomAuthContext): void {
  const method = ctx.definition.method?.toUpperCase() ?? "";
  if (!writeMethods.has(method)) {
    return;
  }
  if (writesAllowed()) {
    return;
  }
  throw new Error(
    `Tool '${ctx.toolName}' performs a write (${method}) but writes are disabled. ` +
      `Set INCIDENT_IO_ALLOW_WRITES=true to enable mutating operations.`,
  );
}

function writesAllowed(): boolean {
  const value = process.env.INCIDENT_IO_ALLOW_WRITES?.trim().toLowerCase();
  return value === "true" || value === "1" || value === "yes";
}
