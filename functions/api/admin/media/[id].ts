import type { Env } from "../../../_lib/env";
import { json, notFound, unauthorized } from "../../../_lib/env";
import { isAuthenticated } from "../../../_lib/auth";

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!(await isAuthenticated(request, env))) return unauthorized();

  const id = String(params.id || "");
  const row = await env.DB.prepare("SELECT r2_key FROM media WHERE id = ?1").bind(id).first<{
    r2_key: string;
  }>();
  if (!row) return notFound("Media not found");

  await env.MEDIA.delete(row.r2_key);
  await env.DB.prepare("DELETE FROM media WHERE id = ?1").bind(id).run();

  return json({ ok: true });
};
