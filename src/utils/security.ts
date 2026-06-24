const encoder = new TextEncoder();

const digestSecret = (value: string): Promise<ArrayBuffer> =>
  crypto.subtle.digest("SHA-256", encoder.encode(value));

export const secretsMatch = async (
  provided: string | undefined,
  expected: string
): Promise<boolean> => {
  const [providedHash, expectedHash] = await Promise.all([
    digestSecret(provided ?? ""),
    digestSecret(expected)
  ]);
  return crypto.subtle.timingSafeEqual(providedHash, expectedHash);
};
