import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { mswServer } from "./msw-mocks";

beforeAll(() => mswServer.listen());

afterEach(() => {
  mswServer.resetHandlers();
});

afterAll(() => mswServer.close());
