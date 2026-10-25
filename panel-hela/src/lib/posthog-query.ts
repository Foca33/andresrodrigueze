/**
 * Consultas de solo lectura a PostHog (HogQL) para el panel /panel. Solo se usa en el servidor.
 *
 * Variables de entorno en Netlify (solo servidor, sin NEXT_PUBLIC_):
 *   POSTHOG_PERSONAL_API_KEY — clave personal de PostHog (solo lectura, permiso "Query")
 *   POSTHOG_PROJECT_ID       — número del proyecto (sale en la URL de PostHog: /project/<número>)
 */

/** Host de la API: el de captura (us.i.posthog.com) pasa a us.posthog.com. */
function apiHost(): string {
  const raw = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
  return raw.replace(".i.posthog.com", ".posthog.com").replace(/\/+$/, "");
}

export function posthogConfigured(): boolean {
  return Boolean(process.env.POSTHOG_PERSONAL_API_KEY && process.env.POSTHOG_PROJECT_ID);
}

export type Row = Array<string | number | null>;

/** Ejecuta una consulta HogQL y devuelve las filas. Lanza un error corto si algo falla. */
export async function hogql(query: string): Promise<Row[]> {
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  const project = process.env.POSTHOG_PROJECT_ID;
  if (!key || !project) throw new Error("Falta POSTHOG_PERSONAL_API_KEY o POSTHOG_PROJECT_ID");
  const res = await fetch(`${apiHost()}/api/projects/${encodeURIComponent(project)}/query/`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 200);
    throw new Error(`PostHog ${res.status}: ${detail}`);
  }
  const json = (await res.json()) as { results?: Row[] };
  return json.results ?? [];
}
