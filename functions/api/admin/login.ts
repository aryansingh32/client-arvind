import type { Env } from "../../_lib/env";
import { badRequest, json, unauthorized } from "../../_lib/env";
import { buildSetCookie, createSessionToken, safeEqual } from "../../_lib/auth";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
    return json(
      { error: "Admin panel is not configured. Set ADMIN_PASSWORD and SESSION_SECRET secrets." },
      { status: 500 }
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body");
  }

  if (!body.password || !safeEqual(body.password, env.ADMIN_PASSWORD)) {
    return unauthorized("Incorrect password");
  }

  const token = await createSessionToken(env.SESSION_SECRET);
  return json(
    { ok: true },
    { headers: { "Set-Cookie": buildSetCookie(token, request) } }
  );
};
