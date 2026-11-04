import { expect, test } from "@playwright/test";

test("checkout creates one order and navigates without Ionic runtime errors", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  let checkoutRequests = 0;

  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.route("**/api/v1/**", async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;

    if (pathname.endsWith("/storefront/shop-2")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            tenantId: "2",
            slug: "shop-2",
            name: "Kirana Demo Store",
            logoUrl: null,
            brandColor: "#087f5b",
            phone: "9000000100",
            preferences: { showStockQuantity: false },
          },
        }),
      });
      return;
    }

    if (pathname.endsWith("/orders/checkout") && request.method() === "POST") {
      checkoutRequests += 1;
      await new Promise((resolve) => setTimeout(resolve, 250));
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Order placed successfully",
          data: { id: "999" },
        }),
      });
      return;
    }

    if (pathname.endsWith("/orders/999/status")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            status: "PLACED",
            invoice_id: null,
            invoice_number: null,
            invoice_status: null,
            paid_amount: 0,
            total_amount: 62,
            updated_at: "2026-11-04T08:54:28.000Z",
          },
        }),
      });
      return;
    }

    if (pathname.endsWith("/orders/999")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            id: "999",
            status: "PLACED",
            invoice_id: null,
            invoice_number: null,
            created_at: "2026-11-04T08:54:28.000Z",
            total_amount: 62,
            paid_amount: 0,
            items: [
              {
                id: "1",
                product_name: "Aashirvaad Whole Wheat Atta 1 kg",
                brand: "Aashirvaad",
                size: "1 kg",
                packaging: "PACKET",
                sku: "DEMO-CATALOG-001",
                quantity: 1,
                unit_price: 62,
                total_price: 62,
              },
            ],
          },
        }),
      });
      return;
    }

    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ success: false, message: "Unexpected test API" }),
    });
  });

  await page.addInitScript(() => {
    localStorage.setItem("kirana_auth_token", "browser-regression-token");
    localStorage.setItem(
      "kirana_user_data",
      JSON.stringify({ id: "96", name: "Rahul Desai", phone: "9000000203" }),
    );
    localStorage.setItem(
      "kirana_tenant_data",
      JSON.stringify({ id: "2", name: "Kirana Demo Store" }),
    );
    localStorage.setItem(
      "kirana_storefront",
      JSON.stringify({
        tenantId: "2",
        slug: "shop-2",
        name: "Kirana Demo Store",
        logoUrl: null,
        brandColor: "#087f5b",
        phone: "9000000100",
      }),
    );
    localStorage.setItem(
      "kirana_cart",
      JSON.stringify({
        tenantId: "2",
        items: [
          {
            variant_id: "235",
            product_id: "235",
            product_name: "Aashirvaad Whole Wheat Atta 1 kg",
            price: 62,
            quantity: 1,
          },
        ],
      }),
    );
  });

  await page.goto("/shop/shop-2/checkout");
  await expect(page.getByText(/verified/i).first()).toBeVisible();
  const submit = page
    .locator("ion-button:visible")
    .filter({ hasText: /send order request/i })
    .first();
  await expect(submit).toBeVisible();

  await submit.click();
  await expect(page).toHaveURL(/\/shop\/shop-2\/order\/999$/);
  await expect(page.getByText("Order ID: #999", { exact: true })).toBeVisible();
  await page.waitForTimeout(500);

  expect(checkoutRequests).toBe(1);
  expect(browserErrors).toEqual([]);
});
