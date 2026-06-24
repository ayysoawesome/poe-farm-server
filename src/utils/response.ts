import type { Context } from "hono";
import type { ZodType } from "zod";

import { AppError } from "./errors";

export const parseInput = <T>(schema: ZodType<T>, value: unknown): T => {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new AppError(
      400,
      "INVALID_INPUT",
      result.error.issues.map((issue) => issue.message).join("; ")
    );
  }
  return result.data;
};

export const errorResponse = (
  context: Context,
  code: string,
  message: string,
  status: 400 | 401 | 404 | 409 | 500 | 503
) => context.json({ error: { code, message } }, status);
