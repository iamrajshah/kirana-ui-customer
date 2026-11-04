import { expect, test } from "@playwright/test";

const shop = {
  tenantId: "2",
  slug: "shop-2",
  name: "Kirana Theme Test",
  logoUrl: null,
  brandColor: "#087f5b",
  phone: "9000000100",
};

const contrast = (foreground: string, background: string): number => {
  const luminance = (color: string) => {
    const values = color
      .match(/[\d.]+/g)!
      .slice(0, 3)
      .map(Number)
      .map((value) => {
        const channel = value / 255;
        return channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4;
      });
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
  };
  const a = luminance(foreground),
    b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

for (const theme of ["light", "dark"]) {
  for (const width of [390, 820, 1440]) {
    test(`${theme} language overlays stay readable at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.route("**/api/v1/**", (route) => {
        const pathname = new URL(route.request().url()).pathname;
        const data = pathname.endsWith("/storefront/shop-2")
          ? shop
          : pathname.endsWith("/catalog/products")
            ? { products: [] }
            : [];
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data }),
        });
      });
      await page.addInitScript(
        ({ theme, shop }) => {
          localStorage.setItem("theme", theme);
          localStorage.setItem("i18nextLng", "en");
          localStorage.setItem("kirana_storefront", JSON.stringify(shop));
        },
        { theme, shop },
      );
      await page.goto("/shop/shop-2/home");
      await expect(page.getByText(shop.name).first()).toBeVisible();
      await page.locator("ion-select").first().click();
      const popover = page.locator("ion-popover:not(.overlay-hidden)");
      await expect(popover).toBeVisible();
      const popupColors = await popover.evaluate((element) => ({
        background: getComputedStyle(
          element.shadowRoot!.querySelector(".popover-content")!,
        ).backgroundColor,
        foreground: getComputedStyle(element.querySelector("ion-radio")!).color,
      }));
      expect(
        contrast(popupColors.foreground, popupColors.background),
      ).toBeGreaterThanOrEqual(4.5);
      await popover.evaluate((element) =>
        (element as HTMLIonPopoverElement).dismiss(),
      );
      await page.goto("/shop/shop-2/login");
      await page.locator("ion-select").first().click();
      const sheet = page.locator("ion-action-sheet:not(.overlay-hidden)");
      await expect(sheet).toBeVisible();
      const sheetColors = await sheet.evaluate((element) => ({
        background: getComputedStyle(
          element.querySelector(".action-sheet-group")!,
        ).backgroundColor,
        foreground: getComputedStyle(
          element.querySelector(".action-sheet-button")!,
        ).color,
      }));
      expect(
        contrast(sheetColors.foreground, sheetColors.background),
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        await page.evaluate(() => getComputedStyle(document.body).colorScheme),
      ).toBe(theme);
      expect(errors).toEqual([]);
    });
  }
}
