import { describe, expect, it } from "vitest";
import axios from "axios";


let BASE_URL = "http://localhost:3000";

describe("Website got created", () => {
  it("should return a 200 status code", async () => {
    const response = await axios.get(`${BASE_URL}/`);
    expect(response.status).toBe(200);
  });
});