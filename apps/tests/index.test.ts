import { describe, expect, it } from "vitest";
import axios from "axios";

describe("Website got created", () => {
  it("should return a 200 status code", async () => {
    const response = await axios.get("http://localhost:3000");
    expect(response.status).toBe(200);
  });
});