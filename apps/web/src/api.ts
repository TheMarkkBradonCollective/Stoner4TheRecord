export type SiteConfig = {
  siteName: string;
  tagline: string;
  domain: string;
  liveStreamUrl: string;
  officialShowRuntimeMinutes: number;
  preShowLengthLabel: string;
};

export type RunOfShowItem = {
  id: number;
  sort_order: number;
  segment_name: string;
  segment_type: string;
  length_minutes: number | null;
  length_label: string | null;
  is_pre_show: boolean;
};

export type Sponsor = {
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

export type ShowSegment = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  display_order: number;
};

const apiBase =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBase}${path}`);
  if (!res.ok) {
    throw new Error(`API ${path} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function getConfig() {
  return fetchJson<SiteConfig>("/api/config");
}

export function getRunOfShow() {
  return fetchJson<{ items: RunOfShowItem[] }>("/api/run-of-show");
}

export function getSponsors(featuredOnly = false) {
  const q = featuredOnly ? "?featured=1" : "";
  return fetchJson<{ sponsors: Sponsor[] }>(`/api/sponsors${q}`);
}

export function getSegments(category?: string) {
  const q = category ? `?category=${encodeURIComponent(category)}` : "";
  return fetchJson<{ segments: ShowSegment[] }>(`/api/segments${q}`);
}

export function embedUrlForStream(rawUrl: string): string {
  if (rawUrl.includes("youtube.com/watch")) {
    const id = new URL(rawUrl).searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=0`;
  }
  if (rawUrl.includes("youtu.be/")) {
    const id = rawUrl.split("youtu.be/")[1]?.split(/[?&]/)[0];
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=0`;
  }
  return rawUrl;
}

export function segmentTypeClass(type: string): string {
  const key = type.toLowerCase().replace(/\s+/g, "-");
  return `type-${key}`;
}
