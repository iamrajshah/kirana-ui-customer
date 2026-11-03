export const normalizeShopSlug = (slug: string) => slug.trim().toLowerCase();

export const shouldResetCustomerSession = (
  isAuthenticated: boolean,
  currentTenantId: string | undefined,
  nextTenantId: string,
) => isAuthenticated && currentTenantId !== nextTenantId;

export const hasStorefrontChanged = (
  currentTenantId: string | undefined,
  nextTenantId: string,
) => currentTenantId !== nextTenantId;
