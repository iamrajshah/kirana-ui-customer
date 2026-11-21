const storageKey = (tenantId: string, customerId: string): string =>
  `kirana_checkout_attempt:${tenantId}:${customerId}`;

interface Attempt {
  fingerprint: string;
  key: string;
}

const readAttempt = (key: string): Attempt | null => {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(key) || "null");
    if (
      value &&
      typeof value === "object" &&
      "fingerprint" in value &&
      typeof value.fingerprint === "string" &&
      "key" in value &&
      typeof value.key === "string"
    ) {
      return { fingerprint: value.fingerprint, key: value.key };
    }
    return null;
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
};

/** Retain only a digest and opaque key, never the delivery address or phone. */
export const checkoutRequestKey = async (
  tenantId: string,
  customerId: string,
  intent: unknown,
): Promise<string> => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(JSON.stringify(intent)),
  );
  const fingerprint = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  const key = storageKey(tenantId, customerId);
  const previous = readAttempt(key);
  if (previous?.fingerprint === fingerprint) return previous.key;
  const attempt: Attempt = { fingerprint, key: crypto.randomUUID() };
  sessionStorage.setItem(key, JSON.stringify(attempt));
  return attempt.key;
};

export const completeCheckoutAttempt = (
  tenantId: string,
  customerId: string,
  completedKey: string,
): void => {
  const key = storageKey(tenantId, customerId);
  if (readAttempt(key)?.key === completedKey) sessionStorage.removeItem(key);
};
