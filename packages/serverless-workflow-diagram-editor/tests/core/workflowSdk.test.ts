/*
 * Copyright 2021-Present The Serverless Workflow Specification Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { deserializeWorkflow, validateWorkflow, parseWorkflow } from "../../src/core";
import {
  BASIC_VALID_WORKFLOW_YAML,
  BASIC_VALID_WORKFLOW_JSON,
  BASIC_INVALID_WORKFLOW_YAML,
  BASIC_INVALID_WORKFLOW_JSON,
} from "../fixtures/workflows";
import { Classes, validate } from "@serverlessworkflow/sdk";

vi.mock("@serverlessworkflow/sdk", () => ({
  Classes: { Workflow: { deserialize: vi.fn() } },
  validate: vi.fn(),
}));

const mockDeserialize = vi.mocked(Classes.Workflow.deserialize);
const mockValidate = vi.mocked(validate);

describe("deserializeWorkflow", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a workflow when given valid YAML", () => {
    mockDeserialize.mockReturnValue(JSON.parse(BASIC_VALID_WORKFLOW_JSON));
    expect(deserializeWorkflow(BASIC_VALID_WORKFLOW_YAML)).toEqual(
      JSON.parse(BASIC_VALID_WORKFLOW_JSON),
    );
  });

  it("returns a workflow when given valid JSON", () => {
    mockDeserialize.mockReturnValue(JSON.parse(BASIC_VALID_WORKFLOW_JSON));
    expect(deserializeWorkflow(BASIC_VALID_WORKFLOW_JSON)).toEqual(
      JSON.parse(BASIC_VALID_WORKFLOW_JSON),
    );
  });

  it("throws when the SDK throws an error for invalid YAML", () => {
    mockDeserialize.mockImplementation(() => {
      throw new Error("yaml parse error");
    });
    expect(() => deserializeWorkflow(BASIC_INVALID_WORKFLOW_YAML)).toThrow("yaml parse error");
  });

  it("throws when the SDK throws an error for invalid JSON", () => {
    mockDeserialize.mockImplementation(() => {
      throw new Error("json parse error");
    });
    expect(() => deserializeWorkflow(BASIC_INVALID_WORKFLOW_JSON)).toThrow("json parse error");
  });
});

describe("validateWorkflow", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls SDK validate with 'Workflow' as the first argument", () => {
    mockValidate.mockReturnValue(undefined);
    validateWorkflow(JSON.parse(BASIC_VALID_WORKFLOW_JSON));
    expect(mockValidate).toHaveBeenCalledWith("Workflow", JSON.parse(BASIC_VALID_WORKFLOW_JSON));
  });

  it("does not throw for a valid workflow", () => {
    mockValidate.mockReturnValue(undefined);
    expect(() => validateWorkflow(JSON.parse(BASIC_VALID_WORKFLOW_JSON))).not.toThrow();
  });

  it("throws when the SDK throws", () => {
    mockValidate.mockImplementation(() => {
      throw new Error("invalid workflow");
    });
    expect(() => validateWorkflow(JSON.parse(BASIC_VALID_WORKFLOW_JSON))).toThrow(
      "invalid workflow",
    );
  });
});

describe("parseWorkflow", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns success:true and a workflow for valid input", () => {
    mockDeserialize.mockReturnValue(JSON.parse(BASIC_VALID_WORKFLOW_JSON));
    mockValidate.mockReturnValue(undefined);
    const result = parseWorkflow(BASIC_VALID_WORKFLOW_JSON);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.workflow).toEqual(JSON.parse(BASIC_VALID_WORKFLOW_JSON));
    }
  });

  it("returns success:false and an Error when deserialization throws error", () => {
    mockDeserialize.mockImplementation(() => {
      throw new Error("deserialize error");
    });
    const result = parseWorkflow(BASIC_INVALID_WORKFLOW_JSON);
    expect(result.success).toBe(false);
    if (result.success === false) {
      expect(result.error.message).toBe("deserialize error");
    }
  });

  it("returns success:false and an Error when validation throws error", () => {
    // deserialize succeeds so the code reaches the validation step
    mockDeserialize.mockReturnValue(JSON.parse(BASIC_VALID_WORKFLOW_JSON));
    mockValidate.mockImplementation(() => {
      throw new Error("validate error");
    });
    const result = parseWorkflow(BASIC_INVALID_WORKFLOW_JSON);
    expect(result.success).toBe(false);
    if (result.success === false) {
      expect(result.error.message).toBe("validate error");
    }
  });

  it("returns success:false and wraps non-Error thrown values in an Error", () => {
    mockDeserialize.mockImplementation(() => {
      throw "raw string";
    });
    const result = parseWorkflow(BASIC_INVALID_WORKFLOW_JSON);
    expect(result.success).toBe(false);
    if (result.success === false) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe("raw string");
    }
  });
});
