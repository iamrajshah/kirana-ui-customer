# Kirana Customer Storefront Handbook

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

## Supported workflow

- Branded storefront link resolution
- Phone/password customer registration and login
- Catalog, category and product search
- Stock-aware cart synchronized with the server
- Cash, shop-payment and tenant-configured UPI selection
- Order placement, history, detail and eligible cancellation
- Light/dark theme
- English, Hindi, Marathi and Gujarati with persisted language choice

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

## Failure diagnosis

- **Shop unavailable:** verify the tenant storefront is enabled and the slug is correct.
- **Login rejected:** verify the customer belongs to the resolved tenant; do not bypass tenant checks.
- **Catalog empty:** verify products are active, visible and have saleable variants for that tenant.
- **Cart mismatch:** inspect `/api/v1/cart` responses and variant IDs; local storage is only a UI cache.
- **Cloudflare deep link 404:** confirm `public/_redirects` is present in `dist`.
- **Completely blank page:** inspect the browser console first. Production builds now fail before release when the API URL is missing, local, non-HTTPS, or includes `/api/v1`.

## Ownership

Built by Rajesh Shah (@iamrajshah). Keep this handbook updated whenever storefront routes, tenant resolution, languages, cart contracts or deployment ownership change.
