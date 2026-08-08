import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { BASE_URL } from "../../configs/env.js";
import URLs from "../../utils/URLs.js";
import app from "../../index.js";
const scenarios = [
  {
    description: "Valid credentials",
    user: { email: "test@gmw22ail.com", password: "Zxcvbnm@123" },
    expectedStatus: 200,
    expectedProperty: "authToken",
  },
  {
    description: "Empty email",
    user: { email: "", password: "Zxcvbnm@123" },
    expectedStatus: 400,
    expectedProperty: undefined,
  },
  {
    description: "Invalid email format",
    user: { email: "invalid-email", password: "Zxcvbnm@123" },
    expectedStatus: 400,
    expectedProperty: undefined,
  },
  {
    description: "Weak password",
    user: { email: "test@gmw22ail.com", password: "weakpass" },
    expectedStatus: 400,
    expectedProperty: undefined,
  },
];

describe("User Routes", () => {
  beforeAll(() => {
    vi.stubEnv("NODE_ENV", "test");

    app.use((req, res, next) => {
      if (process.env.NODE_ENV === "test") {
        req.user = { username: "TEST", id: "123123123", email:"test@gmail.com", password: "weakpass" };
      }
    });
  });

  scenarios.forEach(
    ({ description, user, expectedStatus, expectedProperty }) => {
      test(`should handle ${description}`, async () => {
        const response = await fetch(`${BASE_URL}/apiv1/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        expect(response.status).toBe(expectedStatus);

        const data = await response.json();

        // expect(data).toHaveProperty(expectedProperty);
      });
    }
  );

});
