import { createDb } from "../db/client";
import type { Env } from "../env";
import { findLeagueById, listActiveLeagues } from "../repositories/league.repository";
import { AppError } from "../utils/errors";

export class LeagueService {
  constructor(private readonly env: Env) {}

  listActive() {
    return listActiveLeagues(createDb(this.env.DB));
  }

  async requireById(leagueId: string) {
    const league = await findLeagueById(createDb(this.env.DB), leagueId);
    if (league === null) {
      throw new AppError(404, "LEAGUE_NOT_FOUND", `League '${leagueId}' was not found`);
    }
    return league;
  }
}
