# Customer Storefront QA Regression Suite

## Release evidence — 3 November 2026

Customer baseline `b709620` passed 9 test files / 19 tests, lint, production
build, API storefront reads, and deployed desktop/tablet/mobile browser journeys.
Both showcase slugs resolved to different tenant branding, visible offer/product
media loaded, anonymous checkout was rejected, and changing shop cleared the
tenant-scoped cart. No crash boundary, console exception, failed request, or page
overflow was observed.

## Public catalogue

1. Generic root is neutral and does not leak a tenant.
2. `/shop/<slug>` retains the slug across home, product, cart, checkout, and order
   routes and shows the expected shop name.
3. Search/category filters show only that tenant's active saleable products.
4. Published offers obey schedule/sort order and link to the correct product.
5. Product/offer media loads or uses the designed fallback; no raw placeholder or
   broken-image icon appears.
6. Add/increment/decrement/remove/clear cart, refresh, then change to another shop
   and confirm the previous cart/session is gone.

## OTP checkout and orders

Use an approved test mobile and avoid repeated paid OTP sends:

1. Start checkout once; verify one OTP request, countdown, resend guard, and
   translated provider failure.
2. Wrong OTP increments attempts once. Correct OTP creates/restores the customer
   only in the current tenant.
3. Pickup needs no address. Delivery requires and snapshots a valid address;
   save/reuse only when the customer agrees.
4. Change price/stock after adding to cart; checkout must use server truth and
   explain unavailable items.
5. Place the order once; double-click/retry must not duplicate it.
6. Confirm it appears in POS incoming orders. Accept it once, transition through
   supported states, and verify customer status foreground polling updates.
7. Verify eligible cancellation and invalid transition handling.

## Responsive and localization

Run at 390x844, 768x1024, and at least 1440x900 in light/dark mode. Check long
shop/product/offer names, keyboard checkout, safe bottom navigation, intentional
horizontal rails, and English/Hindi/Marathi/Gujarati completeness.

## Stop-release defects

Wrong tenant, retained cross-shop cart/session, OTP loop, duplicated order,
stale customer status, broken media without fallback, incorrect price/stock,
unusable mobile checkout, raw server/provider error, or a broken deep link stops
release.
