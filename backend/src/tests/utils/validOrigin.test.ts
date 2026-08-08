import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import isValidOrigin from "../../utils/validOrigin.js";

describe("isValidOrigin", () => {

  test("should validate origin in production environment", () => {
    vi.stubEnv("NODE_ENV", "production");

    // Valid production origins
    expect(isValidOrigin("https://app.foodd-mern.com")).toBe(true);
    expect(isValidOrigin("http://api.foodd-mern.dev")).toBe(true);

    // Invalid production origins
    expect(isValidOrigin("http://localhost:3000")).toBe(false);
    expect(isValidOrigin("https://other-domain.com")).toBe(false);
    expect(isValidOrigin("")).toBe(false);
  });

  test("should validate origin in development environment", () => {
    vi.stubEnv("NODE_ENV", "development");

    // Valid development origins
    expect(isValidOrigin("http://localhost:3000")).toBe(true);
    expect(isValidOrigin("https://localhost:8000")).toBe(true);

    // Invalid development origins
    expect(isValidOrigin("https://app.foodd-mern.com")).toBe(false);
    expect(isValidOrigin("http://api.foodd-mern.dev")).toBe(false);
    expect(isValidOrigin("")).toBe(false);
  });

  test("should handle missing origin", () => {
    // process.env.NODE_ENV = "production";
    vi.stubEnv("NODE_ENV", "production");
    expect(isValidOrigin("")).toBe(false);

    // process.env.NODE_ENV = "development";
    vi.stubEnv("NODE_ENV", "development");
    expect(isValidOrigin("")).toBe(false);
  });
});
