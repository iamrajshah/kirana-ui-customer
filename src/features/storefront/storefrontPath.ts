import { storageService } from "@services/storage";

export const storefrontPath = (path = "", selectedSlug?: string): string => {
  const slug = selectedSlug ?? storageService.getStorefront()?.slug;
  if (!slug) return "/";
  const suffix = path ? `/${path.replace(/^\//, "")}` : "";
  return `/shop/${encodeURIComponent(slug)}${suffix}`;
};
