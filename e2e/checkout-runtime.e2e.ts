import { expect, test, type Page } from "@playwright/test";

async function checkoutRuntime(page: Page) {
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

    if (pathname.endsWith("/customer-auth/otp/request")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { expiresInSeconds: 900 },
        }),
      });
      return;
    }

    if (pathname.endsWith("/customer-auth/otp/verify")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            token: "browser-regression-token",
            customer: {
              id: "96",
              name: "Browser Customer",
              phone: "9000000203",
            },
          },
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
  await page
    .locator('ion-input[label="Name"] input')
    .pressSequentially("Browser Customer", { delay: 15 });
  await page
    .locator('ion-input[label="Phone"] input')
    .pressSequentially("9000000203", { delay: 15 });
  await page
    .locator("ion-button:visible")
    .filter({ hasText: "Send verification code" })
    .click();
  await expect(page.locator(".storefront-toast--success")).toBeVisible();
  await page
    .locator('ion-input[label="Verification code"] input')
    .pressSequentially("123456", { delay: 15 });
  await page
    .locator("ion-button:visible")
    .filter({ hasText: "Verify mobile" })
    .click();
  await expect(page.getByText(/verified/i).first()).toBeVisible();
  await page.locator('ion-segment-button[value="DELIVERY"]').click();
  const address = page.locator('ion-textarea[label="Address"] textarea');
  await address.pressSequentially("12 Market Road", { delay: 15 });
  await page
    .locator("ion-input")
    .filter({ hasText: /city/i })
    .locator("input")
    .pressSequentially("Mumbai", { delay: 15 });
  await page
    .locator("ion-input")
    .filter({ hasText: "PIN code" })
    .locator("input")
    .pressSequentially("400001", { delay: 15 });
  await page
    .locator("ion-textarea")
    .last()
    .locator("textarea")
    .pressSequentially("Please call before delivery", { delay: 15 });
  await expect(address).toHaveValue("12 Market Road");
  await page.locator("ion-checkbox").click();
  await page.locator("ion-checkbox").click();
  const submit = page
    .locator("ion-button:visible")
    .filter({ hasText: /send order request/i })
    .first();
  await expect(submit).toBeVisible();

  await test.info().attach("checkout-ready", {
    body: await page.screenshot(),
    contentType: "image/png",
  });

  await submit.click();
  await expect(page).toHaveURL(/\/shop\/shop-2\/order\/999$/);
  await expect(page.getByText("Order ID: #999", { exact: true })).toBeVisible();
  await page.waitForTimeout(500);

  expect(checkoutRequests).toBe(1);
  await expect(page.locator(".storefront-toast--success")).toBeVisible();
  const basket = page.locator('nav.storefront-bottom-nav a[href$="/cart"]');
  if (await basket.isVisible()) {
    await basket.click();
    await expect(page).toHaveURL(/\/shop\/shop-2\/cart$/);
  }
  expect(browserErrors).toEqual([]);
}

for (const width of [390, 820, 1440]) {
  test(`guest checkout typing and order navigation have no runtime errors at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await checkoutRuntime(page);
  });
}
