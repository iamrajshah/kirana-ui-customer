# Customer Storefront QA Regression Suite

## Release evidence — 4 November 2026

Deployed revision `5c972bc` passed 10 release checks, 14 test files / 36 tests,
ESLint, TypeScript and production Vite build. The final cross-application browser
matrix passed 62/62 scenarios; Customer Bazaar, tenant identity, offer action and
product navigation passed on 1440x900, 820x1180 and 390x844 with no console or
page error. This run specifically closed the Ionic selected-tab exception found
by the preceding deployed-browser pass.

## Release evidence — 3 November 2026

Customer baseline `b709620` passed 9 test files / 19 tests, lint, production
build, API storefront reads, and deployed desktop/tablet/mobile browser journeys.
Deployed Modern Bazaar revision `e23949a` passed 14 test files / 34 tests, lint,
production build, and production browser checks at 390, 820 and 1440 pixels.
Both showcase slugs resolved to different tenant branding, visible offer/product
media loaded, anonymous checkout was rejected, and changing shop cleared the
tenant-scoped cart. The document width matched every tested viewport, with all
header and bottom-navigation actions visible. Repeat this journey for each exact
release revision.

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
7. Leave owner stock sharing OFF. Cards and product detail show Available/Out of
   stock, and public JSON omits both quantity and low-stock threshold.
8. Turn owner stock sharing ON, reload the storefront, and confirm exact counts
   appear only for that tenant and cart increment is capped at the known count.

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

Theme overlays are browser-tested by `e2e/theme-overlays.e2e.ts` in both themes
at 390, 820 and 1440 pixels. `npm run build && npm run test:browser` checks the
real Ionic language popover and action sheet, including a 4.5:1 minimum text
contrast. Keep the overlay surface distinct from the page, labels and selected
options readable, and native form controls on the app's chosen color scheme.
Repeat the same visual check for checkout inputs and confirmation alerts; unit
tests that mock Ionic cannot prove shadow-root CSS or rendered contrast.

Run at 390x844, 768x1024, and at least 1440x900 in light/dark mode. Check long
shop/product/offer names, keyboard checkout, safe bottom navigation, intentional
horizontal rails, and English/Hindi/Marathi/Gujarati completeness.

Before signing in, change language and theme from the compact header. Confirm the
choice persists after navigation and refresh. The main category row must contain
exactly six tiles. At each viewport, open the inline category browser using both
`See all` and `All Categories`, select a category outside the first four, and
confirm the browser closes, the chosen category remains visible/selected, and
only matching products remain. Then open one published offer and one product
card: both URLs must keep the current `/shop/<slug>` prefix. Confirm the browser
console has no interaction exception and the tenant-scoped cart is unchanged.

## Stop-release defects

Wrong tenant, retained cross-shop cart/session, OTP loop, duplicated order,
stale customer status, broken media without fallback, incorrect price/stock,
inert category/offer/product actions, unusable mobile checkout, raw
server/provider error, or a broken deep link stops release.

## Repeat-order and live-status regression

Place an order, remain signed in, return Home and add a second order without
reloading. There must be no `selectedTab`, overlay, or toast exception and no
blank route. Keep the first order detail open while POS moves it through Accepted,
Preparing, Ready, Paid and Completed. Each state and payment badge must update in
at most one polling interval while the tab is visible; background tabs must not
continue polling.
