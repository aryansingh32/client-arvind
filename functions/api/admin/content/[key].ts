import type { Env } from "../../../_lib/env";
import { badRequest, json, unauthorized } from "../../../_lib/env";
import { isAuthenticated } from "../../../_lib/auth";
import { setContent } from "../../../_lib/content";

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await isAuthenticated(request, env))) return unauthorized();

  const key = String(params.key || "");
  if (!/^[a-zA-Z0-9_]+$/.test(key)) return badRequest("Invalid content key");

  let value: unknown;
  try {
    value = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  await setContent(env, key, value);
  return json({ ok: true });
};
