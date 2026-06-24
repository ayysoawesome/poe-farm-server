export const nowMs = (): number => Date.now();

export const toIsoString = (timestamp: number): string =>
  new Date(timestamp).toISOString();

export const createId = (prefix: string): string =>
  `${prefix}_${crypto.randomUUID()}`;
