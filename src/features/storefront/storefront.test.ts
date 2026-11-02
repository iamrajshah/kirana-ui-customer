import { describe, expect, it } from 'vitest';
import { normalizeShopSlug, shouldResetCustomerSession } from './storefront';

describe('tenant storefront selection', () => {
  it('normalizes a shared shop slug before resolving it', () => {
    expect(normalizeShopSlug(' Kantilal-Shop ')).toBe('kantilal-shop');
  });

  it('clears an authenticated session before switching tenants', () => {
    expect(shouldResetCustomerSession(true, '7', '8')).toBe(true);
    expect(shouldResetCustomerSession(true, '7', '7')).toBe(false);
    expect(shouldResetCustomerSession(false, undefined, '8')).toBe(false);
  });
});
