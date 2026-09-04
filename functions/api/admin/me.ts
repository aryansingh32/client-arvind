import type { Env } from "../../_lib/env";
import { json } from "../../_lib/env";
import { isAuthenticated } from "../../_lib/auth";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const authed = await isAuthenticated(request, env);
  return json({ authenticated: authed });
};
