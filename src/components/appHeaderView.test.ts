import { describe, expect, it } from "vitest";
import { getAppHeaderView } from "./appHeaderView";

describe("getAppHeaderView", () => {
  it("shows storefront guidance without a logout action for guests", () => {
    expect(
      getAppHeaderView({
        isAuthenticated: false,
        storefrontName: "Kantilal Jadhavji Shop",
        fallbackName: "Kirana",
        welcome: "Welcome",
        guestNote: "Browse freely. Verify your phone at checkout.",
      }),
    ).toEqual({
      title: "Kantilal Jadhavji Shop",
      subtitle: "Browse freely. Verify your phone at checkout.",
      showLogout: false,
    });
  });

  it("keeps the signed-in customer welcome and logout action", () => {
    expect(
      getAppHeaderView({
        isAuthenticated: true,
        tenantName: "Kirana Demo Store",
        customerName: "Rajesh",
        fallbackName: "Kirana",
        welcome: "Welcome",
        guestNote: "Guest",
      }),
    ).toEqual({
      title: "Kirana Demo Store",
      subtitle: "Welcome, Rajesh",
      showLogout: true,
    });
  });
});
