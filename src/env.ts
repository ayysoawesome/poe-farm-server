export type Env = Omit<Cloudflare.Env, "PRICE_SYNC_PROVIDER"> & {
  PRICE_SYNC_PROVIDER?: string;
  POE_API_TOKEN?: string;
  POE_API_USER_AGENT?: string;
  POE_PUBLIC_STASH_CHANGE_ID?: string;
  POE_PUBLIC_STASH_MAX_PAGES?: string;
  POE_NINJA_EXCLUDED_LEAGUE_IDS?: string;
  CRON_SECRET: string;
};

export type AppBindings = {
  Bindings: Env;
};
