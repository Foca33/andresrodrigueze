"use client";

import { useCallback, useEffect, useState } from "react";

type Block<T> = { ok: true; data: T } | { ok: false; error: string };
interface Data {
  generado: string;
  dias: number;
  resumen: Block<{ ahora: number; hoy: number; visitantes: number; paginas: number }>;
  tiempo: Block<{ promedioSeg: number; l30: number; l60: number }>;
  embudo: Block<Record<string, number>>;
  clics: Block<Array<{ evento: string; lugar: string; n: number }>>;
  interes: Block<Array<{ evento: string; total: number; personas: number }>>;
  scroll: Block<Array<{ percent: string; personas: number }>>;
  fuentes: Block<Array<{ fuente: string; personas: number }>>;
  serie: Block<Array<{ dia: string; personas: number }>>;
  ventas: Block<{ sold: number; pending: number; total: number }>;
}

const KEY = "hela.panel";
const NOTRACK = "hela.notrack";
const fmt = (n: number) => n.toLocaleString("es-CO");
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : "—");
const mmss = (s: number) => (s > 0 ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}` : "—");

const LUGARES: Record<string, string> = { hero: "Portada", editions: "Ediciones", footer: "Pie de página", otro: "Otro" };
const INTERES: Record<string, string> = {
  hero_cta_click: "Clic en el botón principal",
  hero_chapter_click: "Clic en «leer el capítulo» (portada)",
  first_chapter_click: "Pidió el primer capítulo",
  newsletter_signup: "Registro a la lista",
};

function Card({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <section className={`rounded-sm border border-graphite bg-coal p-5 ${wide ? "md:col-span-2" : ""}`}>
      <h2 className="mono mb-4 text-[0.75rem] tracking-[0.18em] text-smoke uppercase">{title}</h2>
      {children}
    </section>
  );
}

function Show<T>({ b, children }: { b: Block<T>; children: (d: T) => React.ReactNode }) {
  if (!b.ok) return <p className="text-[0.9rem] leading-snug text-ember">No se pudo cargar: {b.error}</p>;
  return <>{children(b.data)}</>;
}

function Big({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div className="display text-[clamp(2.2rem,6vw,3.4rem)] leading-none text-bone">{value}</div>
      <div className="mono mt-2 text-[0.72rem] tracking-[0.14em] text-smoke uppercase">{label}</div>
      {hint && <div className="mt-1 text-[0.8rem] text-fog">{hint}</div>}
    </div>
  );
}

function Bar({ label, value, max, right }: { label: string; value: number; max: number; right?: string }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex justify-between gap-3 text-[0.92rem]">
        <span className="text-bone">{label}</span>
        <span className="mono shrink-0 text-smoke">{right ?? fmt(value)}</span>
      </div>
      <div className="h-1.5 bg-graphite">
        <div className="h-full bg-ember" style={{ width: `${max > 0 ? Math.max(2, (value / max) * 100) : 0}%` }} />
      </div>
    </div>
  );
}

export function PanelClient() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [noTrack, setNoTrack] = useState(false);

  const load = useCallback(async (key: string) => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/panel", { method: "POST", headers: { "x-panel-key": key }, cache: "no-store" });
      if (res.status === 401) {
        try { sessionStorage.removeItem(KEY); } catch {}
        setAuthed(false);
        setMsg("Contraseña incorrecta.");
        return;
      }
      if (res.status === 503) {
        setMsg("El panel no está configurado: falta PANEL_PASSWORD en Netlify.");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setData((await res.json()) as Data);
      setAuthed(true);
      try { sessionStorage.setItem(KEY, key); } catch {}
    } catch {
      setMsg("No se pudo conectar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Al entrar: si ya hay contraseña en esta pestaña, carga los datos de una vez.
  useEffect(() => {
    try {
      setNoTrack(localStorage.getItem(NOTRACK) === "1");
      const saved = sessionStorage.getItem(KEY);
      if (saved) { setPass(saved); void load(saved); }
    } catch {}
  }, [load]);

  const toggleTrack = () => {
    try {
      if (noTrack) localStorage.removeItem(NOTRACK);
      else localStorage.setItem(NOTRACK, "1");
      setNoTrack(!noTrack);
    } catch {}
  };

  if (!authed) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-ink px-gutter text-bone">
        <form
          className="w-full max-w-sm"
          onSubmit={(e) => { e.preventDefault(); if (pass) void load(pass); }}
        >
          <h1 className="display mb-6 text-[2.2rem] leading-none">Panel</h1>
          <label className="mono mb-2 block text-[0.72rem] tracking-[0.14em] text-smoke uppercase" htmlFor="pw">Contraseña</label>
          <input
            id="pw" type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)}
            className="w-full border border-graphite bg-coal px-4 py-3 text-bone outline-none focus:border-ember"
          />
          {msg && <p className="mt-3 text-[0.9rem] text-ember">{msg}</p>}
          <button type="submit" disabled={loading} className="mono mt-5 w-full bg-ember px-4 py-3 text-[0.8rem] tracking-[0.16em] text-ink uppercase disabled:opacity-50">
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </main>
    );
  }

  const d = data;
  const hora = d ? new Date(d.generado).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", timeZone: "America/Bogota" }) : "";

  return (
    <main className="min-h-svh bg-ink px-gutter py-8 text-bone">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="display text-[2rem] leading-none">Panel HELA</h1>
            <p className="mono mt-2 text-[0.72rem] tracking-[0.14em] text-smoke uppercase">
              Últimos {d?.dias ?? 14} días · actualizado {hora}
            </p>
          </div>
          <button
            onClick={() => void load(pass)} disabled={loading}
            className="mono border border-graphite px-4 py-3 text-[0.78rem] tracking-[0.16em] uppercase hover:border-ember disabled:opacity-50"
          >
            {loading ? "Actualizando…" : "Actualizar"}
          </button>
        </header>
        {msg && <p className="mb-4 text-[0.9rem] text-ember">{msg}</p>}

        {d && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Ahora y hoy" wide>
              <Show b={d.resumen}>
                {(r) => (
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    <Big label="Ahora (30 min)" value={fmt(r.ahora)} />
                    <Big label="Visitantes hoy" value={fmt(r.hoy)} />
                    <Big label={`Visitantes ${d.dias} días`} value={fmt(r.visitantes)} hint={`${fmt(r.paginas)} páginas vistas`} />
                    <Show b={d.ventas}>
                      {(v) => <Big label="Copias vendidas" value={`${v.sold} / ${v.total}`} hint={v.pending ? `${v.pending} pendientes de pago` : "sin pendientes"} />}
                    </Show>
                  </div>
                )}
              </Show>
              {!d.ventas.ok && <p className="mt-4 text-[0.85rem] text-ember">Copias vendidas: {d.ventas.error}</p>}
            </Card>

            <Card title="Embudo del pedido">
              <p className="mb-4 -mt-2 text-[0.8rem] text-fog">Personas únicas; el % es sobre el paso anterior.</p>
              <Show b={d.embudo}>
                {(e) => {
                  const steps: Array<[string, string]> = [
                    ["$pageview", "Visitan la página"],
                    ["order_open", "Abren el formulario"],
                    ["order_submit", "Envían el pedido"],
                    ["order_pay_click", "Pulsan pagar"],
                    ["order_paid", "Pagan"],
                  ];
                  const top = e["$pageview"] ?? 0;
                  return steps.map(([k, label], i) => {
                    const v = e[k] ?? 0;
                    const prev = i === 0 ? 0 : e[steps[i - 1][0]] ?? 0;
                    return <Bar key={k} label={label} value={v} max={top} right={i === 0 ? fmt(v) : `${fmt(v)} · ${pct(v, prev)}`} />;
                  });
                }}
              </Show>
            </Card>

            <Card title="Clics de compra: Kindle vs impreso">
              <Show b={d.clics}>
                {(c) => {
                  const total = (ev: string) => c.filter((x) => x.evento === ev).reduce((s, x) => s + x.n, 0);
                  const k = total("purchase_click_kindle");
                  const p = total("purchase_click_paperback");
                  return (
                    <>
                      <div className="mb-5 grid grid-cols-2 gap-6">
                        <Big label="Kindle" value={fmt(k)} />
                        <Big label="Impreso" value={fmt(p)} />
                      </div>
                      {c.length === 0 && <p className="text-[0.9rem] text-fog">Aún no hay clics.</p>}
                      {c.map((x) => (
                        <Bar
                          key={x.evento + x.lugar}
                          label={`${x.evento === "purchase_click_kindle" ? "Kindle" : "Impreso"} · ${LUGARES[x.lugar] ?? x.lugar}`}
                          value={x.n} max={Math.max(...c.map((y) => y.n))}
                        />
                      ))}
                    </>
                  );
                }}
              </Show>
            </Card>

            <Card title="Interés en el libro">
              <Show b={d.interes}>
                {(rows) => {
                  const keys = Object.keys(INTERES);
                  const max = Math.max(1, ...rows.map((r) => r.personas));
                  return keys.map((k) => {
                    const r = rows.find((x) => x.evento === k);
                    return <Bar key={k} label={INTERES[k]} value={r?.personas ?? 0} max={max} right={`${fmt(r?.personas ?? 0)} personas`} />;
                  });
                }}
              </Show>
            </Card>

            <Card title="Atención en la página">
              <Show b={d.tiempo}>
                {(t) => (
                  <div className="mb-5 grid grid-cols-3 gap-4">
                    <Big label="Tiempo promedio" value={mmss(t.promedioSeg)} />
                    <Big label="Llegan a 30 s" value={fmt(t.l30)} />
                    <Big label="Llegan a 60 s" value={fmt(t.l60)} />
                  </div>
                )}
              </Show>
              <Show b={d.scroll}>
                {(s) => {
                  const max = Math.max(1, ...s.map((x) => x.personas));
                  if (!s.length) return <p className="text-[0.9rem] text-fog">Aún no hay datos de scroll.</p>;
                  return s.map((x) => <Bar key={x.percent} label={`Llegan al ${x.percent}% de la página`} value={x.personas} max={max} />);
                }}
              </Show>
            </Card>

            <Card title="De dónde llegan (visitantes)">
              <Show b={d.fuentes}>
                {(f) => {
                  const max = Math.max(1, ...f.map((x) => x.personas));
                  if (!f.length) return <p className="text-[0.9rem] text-fog">Aún no hay visitas.</p>;
                  return f.map((x) => <Bar key={x.fuente} label={x.fuente} value={x.personas} max={max} />);
                }}
              </Show>
            </Card>

            <Card title="Visitantes por día" wide>
              <Show b={d.serie}>
                {(s) => {
                  const days: Array<{ dia: string; personas: number }> = [];
                  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }));
                  for (let i = d.dias - 1; i >= 0; i--) {
                    const t = new Date(today); t.setDate(t.getDate() - i);
                    const key = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
                    days.push({ dia: key, personas: s.find((x) => x.dia === key)?.personas ?? 0 });
                  }
                  const max = Math.max(1, ...days.map((x) => x.personas));
                  return (
                    <div className="flex items-end gap-1.5" role="img" aria-label="Visitantes por día">
                      {days.map((x) => (
                        <div key={x.dia} className="flex flex-1 flex-col items-center gap-1" title={`${x.dia}: ${x.personas}`}>
                          <span className="mono h-3 text-[0.62rem] text-smoke">{x.personas || ""}</span>
                          <div className="flex h-28 w-full items-end">
                            <div className="w-full bg-ember" style={{ height: `${Math.max(2, (x.personas / max) * 100)}%`, opacity: x.personas ? 1 : 0.25 }} />
                          </div>
                          <span className="mono text-[0.6rem] text-fog">{x.dia.slice(8)}</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              </Show>
            </Card>
          </div>
        )}

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 text-[0.8rem] text-fog">
          <span>Los datos de visitas y clics salen de PostHog; las copias, de tu hoja de pedidos.</span>
          <button onClick={toggleTrack} className="underline underline-offset-4 hover:text-bone">
            {noTrack ? "Este dispositivo: mis visitas NO se cuentan (reactivar)" : "No contar mis visitas desde este dispositivo"}
          </button>
        </footer>
      </div>
    </main>
  );
}
