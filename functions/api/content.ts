import type { Env } from "../_lib/env";
import { json } from "../_lib/env";
import { getAllContent } from "../_lib/content";

// Public — the site reads its own content from here on every load.
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const content = await getAllContent(env);
  return json(content, {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" },
  });
};
