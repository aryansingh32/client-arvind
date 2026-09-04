import type { Env } from "./env";

export async function getAllContent(env: Env): Promise<Record<string, unknown>> {
  const { results } = await env.DB.prepare("SELECT key, value FROM content").all<{
    key: string;
    value: string;
  }>();
  const out: Record<string, unknown> = {};
  for (const row of results ?? []) {
    try {
      out[row.key] = JSON.parse(row.value);
    } catch {
      // skip malformed rows rather than failing the whole payload
    }
  }
  return out;
}

export async function setContent(env: Env, key: string, value: unknown): Promise<void> {
  await env.DB.prepare(
    "INSERT INTO content (key, value, updated_at) VALUES (?1, ?2, datetime('now')) " +
      "ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
  )
    .bind(key, JSON.stringify(value))
    .run();
}
