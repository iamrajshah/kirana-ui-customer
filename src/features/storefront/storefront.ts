export const normalizeShopSlug = (slug: string) => slug.trim().toLowerCase();

export const shouldResetCustomerSession = (
  isAuthenticated: boolean,
  currentTenantId: string | undefined,
  nextTenantId: string
) => isAuthenticated && currentTenantId !== nextTenantId;
