import { describe, it, expect, vi } from "vitest";
import api from "../../services/api";
import authService from "../../services/authService";

vi.mock("../../services/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("authService", () => {
  it("should login and return tokens", async () => {
    const fakeResponse = {
      data: {
        access: "token123",
        refresh: "refresh123",
      },
    };

    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue(fakeResponse);

    const result = await authService.login({
      email: "test@test.com",
      password: "123456",
    });

    expect(api.post).toHaveBeenCalledWith("/api/accounts/login/", {
      email: "test@test.com",
      password: "123456",
    });

    expect(result).toEqual(fakeResponse.data);
  });
  it("should register and return user data", async () => {
  const fakeResponse = {
    data: {
      id: 1,
      email: "test@test.com",
      username: "testuser",
    },
  };

  (api.post as ReturnType<typeof vi.fn>).mockResolvedValue(fakeResponse);

  const result = await authService.register({
    email: "test@test.com",
    password: "123456",
   first_name: "Sara",
    last_name: "Nassour"
  });

  expect(api.post).toHaveBeenCalledWith("/api/accounts/register/", {
    email: "test@test.com",
    password: "123456",
    first_name: "Sara",
    last_name: "Nassour"
  });

  

  expect(result).toEqual(fakeResponse.data);
});

it("should logout successfully", async () => {
  (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({});

  await authService.logout("refresh123");

  expect(api.post).toHaveBeenCalledWith("/api/accounts/logout/", {
    refresh: "refresh123",
  });
})});