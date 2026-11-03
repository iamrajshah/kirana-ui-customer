# Kirana Customer Storefront Handbook

## Canonical tenant links and demo media

The root URL is a neutral landing page. A shop is always opened with `/shop/<storefront-slug>`, and product, cart, checkout and order URLs retain that slug. The shell resolves the slug with the server before tenant-scoped requests begin; there is no build-time tenant fallback.

Demo catalogue artwork is checked in under `public/demo-products/`. The server's demo-media seed attaches those stable Cloudflare-hosted assets to all demo products and offers. The client keeps a local grocery fallback so a broken image URL never exposes a raw placeholder.

## Public shopping flow

Customers enter through `/shop/:slug`. The slug is resolved by the server to
one tenant before catalogue or offer data is loaded. Catalogue, search,
published offers, product details and the cart are public; the cart remains
local on that device. Checkout asks for name and mobile, verifies the mobile
with OTP, and then allows shop pickup or home delivery. A delivery address is
saved only with customer consent. Submission creates an order request awaiting
shop confirmation, not a completed sale.

Server prices and stock are authoritative. Product recommendations come from prior same-order purchases; an empty list is valid for a new shop. Product images use the shop's stored URL with a safe fallback.

## Purpose

This app is the optional buyer-facing storefront for a shop using Kirana POS. It is not the owner/cashier POS and it is not a separate backend service. Catalog, cart, customer login and orders all use `kirana-server`.

## Tenant and authentication rules

- A customer must enter through `/shop/:slug`; the app resolves tenant identity before login.
- The resolved tenant ID is sent as `X-Tenant-ID` and the customer JWT must belong to that tenant.
- Switching to another shop clears the previous customer session.
- Do not accept a tenant ID from a query string or a customer-editable form.
- A production build must have `VITE_API_BASE_URL`; it must never silently point at localhost.
- `VITE_API_BASE_URL` is the HTTPS server origin only. The client adds `/api/v1` itself.
- Customer storefront access is a Business-plan entitlement. Hiding a link in a UI is not an access control.
- Offers are read from the resolved tenant only. The server filters out drafts,
  paused offers and offers outside their configured schedule.

## Supported workflow

- Branded storefront link resolution
- Public catalogue, category, product and published-offer search
- Modern Bazaar home with six uncluttered category shortcuts; every remaining
  category stays available in the All Categories sheet
- Language and light/dark controls remain available before customer sign-in
- Tenant-isolated device-local cart with server-authoritative checkout
- Phone OTP identity at checkout
- Pickup or consented saved delivery address
- Order placement, foreground status refresh, history, detail and eligible cancellation
- Light/dark theme
- English, Hindi, Marathi and Gujarati with persisted language choice

## Public stock privacy

Exact inventory is private by default. The storefront consumes the public
`in_stock` value and shows only Available or Out of stock. Numeric `quantity`
is optional and may be rendered (and used as a client-side cart cap) only when
the resolved shop returns `preferences.showStockQuantity: true`. Never infer a
missing quantity as zero and never display `low_stock_threshold` to shoppers.
The server remains authoritative at checkout in either mode.

## Release checklist

1. Server migration and Railway deployment are healthy.
2. `npm ci`, lint, tests and production build pass.
3. All four locale files have identical non-empty keys.
4. Cloudflare deployment reports the intended Git SHA in `/release.json`.
5. `/shop/<known-slug>` resolves to the expected tenant branding.
6. Registration/login cannot cross tenants.
7. Add, update, remove and clear cart operations survive refresh.
8. Place an order and verify it appears in the customer order list and POS order intake.
9. Verify 390px mobile, 768px tablet and desktop layouts in light and dark modes.
10. With exact stock disabled, inspect catalogue and product-detail responses:
    `quantity` and `low_stock_threshold` must be absent while `in_stock` remains.
11. Enable exact stock as the tenant owner, reload the shop link, and verify the
    count appears without affecting another tenant.

## Failure diagnosis

- **Shop unavailable:** verify the tenant storefront is enabled and the slug is correct.
- **Login rejected:** verify the customer belongs to the resolved tenant; do not bypass tenant checks.
- **Catalog empty:** verify products are active, visible and have saleable variants for that tenant.
- **Cart mismatch:** inspect `/api/v1/cart` responses and variant IDs; local storage is only a UI cache.
- **Cloudflare deep link 404:** confirm `public/_redirects` is present in `dist`.
- **Completely blank page:** inspect the browser console first. Production builds now fail before release when the API URL is missing, local, non-HTTPS, or includes `/api/v1`.

## Ownership

Built by Rajesh Shah (@iamrajshah). Keep this handbook updated whenever storefront routes, tenant resolution, languages, cart contracts or deployment ownership change.

## Current release qualification

On 3 November 2026, the deployed storefront baseline passed 9 files / 19 tests,
lint, production build, API checks, and desktop/tablet/mobile browser journeys.
The deployed Modern Bazaar revision `e23949a` passed 14 files / 34 tests, lint,
production build, and production viewport checks at 390, 820 and 1440 pixels.
Both showcase storefronts resolved independently, visible offer/product media
loaded, anonymous checkout was denied, duplicate OTP verification was guarded,
customer order polling remained foreground-only, switching shops cleared the
cart, and the document remained contained to each tested viewport.

Use [`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md) for diagnosis and
[`docs/QA_REGRESSION_SUITE.md`](docs/QA_REGRESSION_SUITE.md) for future runs.

## Live order and marketplace update — 3 November 2026

Order list and detail poll only while the page is visible, every five seconds.
The lightweight status response updates order status plus linked invoice number,
payment status, paid amount and total; no full browser refresh is required. The
authenticated tab bar keeps a stable DOM shape, and global feedback uses a plain
React status element rather than an Ionic overlay, preventing the prior
`selectedTab`/`isOpen` crash after checkout. The home screen now uses a responsive
marketplace hierarchy, tenant branding, benefits, offer rail and richer product
cards while preserving the original Kirana identity.
