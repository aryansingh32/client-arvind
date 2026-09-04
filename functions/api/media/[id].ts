import type { Env } from "../../_lib/env";
import { notFound } from "../../_lib/env";

// Public — serves uploaded media by stable id so content JSON can reference
// a URL that never changes even if the underlying R2 key does.
export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const id = String(params.id || "");
  const row = await env.DB.prepare("SELECT r2_key, content_type FROM media WHERE id = ?1")
    .bind(id)
    .first<{ r2_key: string; content_type: string }>();
  if (!row) return notFound("Media not found");

  const object = await env.MEDIA.get(row.r2_key);
  if (!object) return notFound("Media not found");

  return new Response(object.body, {
    headers: {
      "Content-Type": row.content_type,
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: object.httpEtag,
    },
  });
};
