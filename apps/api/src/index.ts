import { neon } from "@neondatabase/serverless";
import { Hono } from "hono";
import { cors } from "hono/cors";

export type Env = {
  DATABASE_URL: string;
  LIVE_STREAM_URL?: string;
};

type RunOfShowRow = {
  id: number;
  sort_order: number;
  segment_name: string;
  segment_type: string;
  length_minutes: number | null;
  length_label: string | null;
  is_pre_show: boolean;
};

type SponsorRow = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  website_url: string | null;
  category: string | null;
  promo_code: string | null;
  display_order: number;
  is_featured: boolean;
};

type ShowSegmentRow = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  display_order: number;
};

function sqlClient(env: Env) {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
  return neon(env.DATABASE_URL);
}

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: (origin) => origin ?? "*",
    allowMethods: ["GET", "HEAD", "OPTIONS"],
  }),
);

app.get("/api/health", (c) => {
  return c.json({
    ok: true,
    service: "stoner4therecord-api",
    tagline: "The Station That Never Stops Smoking.",
  });
});

app.get("/api/config", (c) => {
  const streamUrl =
    c.env.LIVE_STREAM_URL ??
    "https://www.youtube.com/embed/jfKfPfyJRdk";
  return c.json({
    siteName: "Stoner4TheRecord",
    tagline: "The Station That Never Stops Smoking.",
    domain: "https://stoner4therecord.com",
    liveStreamUrl: streamUrl,
    officialShowRuntimeMinutes: 246,
    preShowLengthLabel: "15–30 min",
  });
});

app.get("/api/run-of-show", async (c) => {
  try {
    const sql = sqlClient(c.env);
    const rows = await sql`
      SELECT id, sort_order, segment_name, segment_type, length_minutes, length_label, is_pre_show
      FROM run_of_show
      ORDER BY sort_order ASC
    `;
    return c.json({ items: rows as RunOfShowRow[] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return c.json({ error: message }, 503);
  }
});

app.get("/api/sponsors", async (c) => {
  try {
    const sql = sqlClient(c.env);
    const featured = c.req.query("featured");
    const rows =
      featured === "1" || featured === "true"
        ? await sql`
            SELECT id, slug, name, description, website_url, category, promo_code, display_order, is_featured
            FROM sponsors
            WHERE is_featured = TRUE
            ORDER BY display_order ASC
          `
        : await sql`
            SELECT id, slug, name, description, website_url, category, promo_code, display_order, is_featured
            FROM sponsors
            ORDER BY display_order ASC
          `;
    return c.json({ sponsors: rows as SponsorRow[] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return c.json({ error: message }, 503);
  }
});

app.get("/api/segments", async (c) => {
  try {
    const sql = sqlClient(c.env);
    const category = c.req.query("category");
    const rows = category
      ? await sql`
          SELECT id, slug, name, description, category, display_order
          FROM show_segments
          WHERE category = ${category}
          ORDER BY display_order ASC
        `
      : await sql`
          SELECT id, slug, name, description, category, display_order
          FROM show_segments
          ORDER BY display_order ASC
        `;
    return c.json({ segments: rows as ShowSegmentRow[] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return c.json({ error: message }, 503);
  }
});

app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
