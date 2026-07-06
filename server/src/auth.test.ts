// Tests for the hand-written write-gate in auth.ts. The rest of the server is
// generated from the OpenAPI spec and is not unit-tested here.
//
// Run via `npm test`, which builds first and runs the compiled output with
// node:test (no jest/ts-jest dependency needed).

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { enforceWriteGate, type CustomAuthContext } from "./auth.js";

function ctx(method: string): CustomAuthContext {
  return {
    headers: {},
    queryParams: {},
    toolName: `Tool_${method}`,
    definition: {
      name: `Tool_${method}`,
      method,
      pathTemplate: "/v2/example",
      securityRequirements: [],
    },
  };
}

const original = process.env.INCIDENT_IO_ALLOW_WRITES;
afterEach(() => {
  if (original === undefined) delete process.env.INCIDENT_IO_ALLOW_WRITES;
  else process.env.INCIDENT_IO_ALLOW_WRITES = original;
});

describe("enforceWriteGate", () => {
  it("always allows read methods regardless of the flag", () => {
    delete process.env.INCIDENT_IO_ALLOW_WRITES;
    for (const method of ["GET", "get", "HEAD"]) {
      assert.doesNotThrow(() => enforceWriteGate(ctx(method)));
    }
  });

  it("blocks write methods when the flag is unset", () => {
    delete process.env.INCIDENT_IO_ALLOW_WRITES;
    for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
      assert.throws(() => enforceWriteGate(ctx(method)), /writes are disabled/);
    }
  });

  it("blocks writes for falsy flag values", () => {
    for (const value of ["false", "0", "no", ""]) {
      process.env.INCIDENT_IO_ALLOW_WRITES = value;
      assert.throws(() => enforceWriteGate(ctx("POST")), /writes are disabled/);
    }
  });

  it("allows writes for truthy flag values", () => {
    for (const value of ["true", "TRUE", "1", "yes", " true "]) {
      process.env.INCIDENT_IO_ALLOW_WRITES = value;
      assert.doesNotThrow(() => enforceWriteGate(ctx("POST")));
    }
  });

  it("is case-insensitive about the method", () => {
    delete process.env.INCIDENT_IO_ALLOW_WRITES;
    assert.throws(() => enforceWriteGate(ctx("post")), /writes are disabled/);
  });
});
