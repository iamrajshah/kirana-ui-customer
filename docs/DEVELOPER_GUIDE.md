# Customer Storefront Developer Guide

## Boundary

This is the public, tenant-branded storefront. It is not a second backend and it
does not trust a build-time tenant. Every journey starts at `/shop/:slug`, the
server resolves that slug, and subsequent catalogue, offer, OTP, customer, cart,
and order calls remain bound to that tenant.

## Current flow

Browsing, search, offers, product detail, and the device-local cart are public.
Checkout collects name/mobile, verifies OTP, offers pickup or delivery, and saves
a delivery address only with consent. The server revalidates product, price,
stock, entitlement, and tenant before creating an order request. POS acceptance
creates the draft invoice; storefront checkout is not a completed sale.

## Defect triage

| Symptom | Inspect first |
| --- | --- |
| Blank generic root | expected neutral landing; use `/shop/<slug>` |
| Wrong shop name/data | slug resolver response and persisted storefront tenant |
| Cart carries to another shop | `kirana_cart` tenant ID and route-bootstrap clear |
| Product/offer image broken | stored HTTPS URL, fallback asset, lazy loading |
| OTP sent but verify repeats | submit lock, challenge request ID, rate limit, provider response |
| Status stays stale | foreground polling lifecycle and order status endpoint |
| Order missing in POS | entitlement, tenant ID, customer JWT, checkout response |
| Desktop looks oversized | max-width grid/product layout and responsive breakpoints |
| `See all` does nothing | category-browser state/region; never reintroduce an Ionic sheet modal that can remain `overlay-hidden` |
| `l[p] is not a function` on input/selection | incompatible Stencil runtime in the built artifact; run the resolved-runtime check and rebuild from `npm ci` |

Never show provider secrets or raw API errors. Do not retry OTP verification in a
render/effect loop; a user action produces at most one in-flight request.

## Invariants

- Production requires an HTTPS API origin without `/api/v1`; the client adds it.
- `X-Tenant-ID` and customer JWT tenant must match.
- Changing slug clears the prior cart and customer session.
- Cart state is tenant-scoped local convenience; checkout is server-authoritative.
- Only active/scheduled offers and active products for the resolved tenant show.
- Missing `preferences.showStockQuantity` is false. Cards, detail and cart use
  `in_stock`; numeric quantity is optional and must never be reconstructed.
- Every user-visible string exists in English, Hindi, Marathi, and Gujarati.
- 390px mobile, 768px tablet, and desktop must remain readable without page
  overflow; horizontal offer/category rails may scroll intentionally.

The Modern Bazaar home keeps six primary category tiles in total: For You,
four live categories and All Categories. Do not restore an unbounded segment
row; additional categories belong in the inline category browser. Both `See all`
and `All Categories` must target `#bazaar-category-browser`; selection closes the
browser and calls the same catalogue filter used by a primary tile.

## Verification

```bash
npm ci
npm run verify:ionic-runtime
npm test
npm run lint
VITE_API_BASE_URL=https://api.example npm run build
npm run test:browser
```

Ionic 7's compiled watcher metadata requires Stencil `4.12.2` in this project.
The build verifies the runtime actually resolved from the real Ionic and
Ionicons package locations, including nested and linked dependencies. A correct
override/lockfile alone does not prove that an existing `node_modules` directory
or `dist` artifact is correct. Do not reuse a build made before dependency repair.

Then run [`QA_REGRESSION_SUITE.md`](QA_REGRESSION_SUITE.md) against both showcase
shops and one disposable order journey.

## Release

Cloudflare Pages hosts `kirana-customer.pages.dev`. Verify `/release.json`, the
root landing page, and direct `/shop/<slug>`/order routes. Publish the exact tested
main revision; documentation-only changes do not require deployment.
Compare the release manifest with the intended commit before publishing. Browser
tests must run against that same freshly built artifact.

## Post-checkout stability contract

The mobile bottom bar is ordinary tenant-aware React Router navigation. Do not
reintroduce `IonTabs`/`IonTabButton` selection state around product, cart, order
or authentication transitions without rendered-browser coverage. A mismatched
Stencil runtime previously caused repeated watcher exceptions on selected tabs,
input values and overlays; changing navigation alone did not repair input
watchers. Guard protected
route content instead. Do not drive global feedback through a controlled
`IonToast` across route transitions; the shared React toast owns its timer and
DOM lifecycle. Customer order polling must merge invoice payment fields as well
as order status and must stop while the document is hidden or the page unmounts.
