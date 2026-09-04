import type { Env } from "../../_lib/env";
import { json } from "../../_lib/env";
import { buildClearCookie } from "../../_lib/auth";

export const onRequestPost: PagesFunction<Env> = async ({ request }) => {
  return json({ ok: true }, { headers: { "Set-Cookie": buildClearCookie(request) } });
};
