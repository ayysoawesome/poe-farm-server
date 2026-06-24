export type Env = Omit<Cloudflare.Env, "PRICE_SYNC_PROVIDER"> & {
  PRICE_SYNC_PROVIDER?: string;
  CRON_SECRET: string;
};

export type AppBindings = {
  Bindings: Env;
};
