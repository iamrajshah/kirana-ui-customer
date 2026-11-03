interface AppHeaderViewInput {
  isAuthenticated: boolean;
  storefrontName?: string | null;
  tenantName?: string | null;
  customerName?: string | null;
  fallbackName: string;
  welcome: string;
  guestNote: string;
}

export const getAppHeaderView = ({
  isAuthenticated,
  storefrontName,
  tenantName,
  customerName,
  fallbackName,
  welcome,
  guestNote,
}: AppHeaderViewInput) => ({
  title: storefrontName || tenantName || fallbackName,
  subtitle: isAuthenticated ? `${welcome}, ${customerName || ""}`.trim() : guestNote,
  showLogout: isAuthenticated,
});
