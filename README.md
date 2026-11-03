# Kirana Customer Storefront

Tenant-branded, customer-facing ordering UI for Kirana POS. It is an Ionic React web app hosted on Cloudflare Pages and uses the same Railway Express API and MySQL tenant data as the POS.

## Customer journey

1. Open the shop-specific URL: `/shop/<storefront-slug>`.
2. The public storefront route resolves the tenant name, logo and brand colour.
3. Browse/search the public tenant catalogue, published offers, and product
   details; the device-local cart is isolated by tenant.
4. At checkout, provide name/mobile and verify OTP.
5. Choose pickup or delivery. Delivery collects an address and saves it only with
   consent.
6. Submit an order request, then review status or cancel while eligible.

Never publish a generic login URL as the customer entry point. The shop slug establishes tenant context before authentication.

## Local setup

```bash
npm ci
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to the API origin without `/api/v1`. `VITE_TENANT_ID` is a legacy local fallback; production tenant selection comes from the storefront slug.

## Quality gate

```bash
npm run lint
npm test
VITE_API_BASE_URL=https://your-api.example npm run build
```

Translations are required in English, Hindi, Marathi and Gujarati. The localization coverage test rejects missing or blank keys.

## Deployment

Production is Cloudflare Pages project `kirana-customer`, output directory `dist`, with SPA fallback in `public/_redirects`. Build with the Railway API URL and deploy the exact tested output:

```bash
VITE_API_BASE_URL=https://your-api.example npm run build
npx wrangler pages deploy dist --project-name kirana-customer --branch main
```

`dist/release.json` identifies the deployed commit. See [HANDBOOK.md](./HANDBOOK.md) for product invariants and operational checks.

Developer diagnosis is in
[`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md); the executable public,
OTP, order, responsive, media, and tenant-isolation pass is in
[`docs/QA_REGRESSION_SUITE.md`](docs/QA_REGRESSION_SUITE.md).

## Technology

- Ionic React + Vite + TypeScript
- Zustand state
- Axios API client
- i18next (English, Hindi, Marathi and Gujarati)
- Cloudflare Pages UI, Railway API, MySQL tenant data

Proprietary software.
