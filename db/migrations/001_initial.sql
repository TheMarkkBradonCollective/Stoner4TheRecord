-- Stoner4TheRecord initial schema

CREATE TABLE IF NOT EXISTS run_of_show (
  id SERIAL PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  segment_name TEXT NOT NULL,
  segment_type TEXT NOT NULL,
  length_minutes INTEGER,
  length_label TEXT,
  is_pre_show BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_run_of_show_sort ON run_of_show (sort_order);

CREATE TABLE IF NOT EXISTS sponsors (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  category TEXT,
  promo_code TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sponsors_display ON sponsors (display_order);

CREATE TABLE IF NOT EXISTS show_segments (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_show_segments_category ON show_segments (category, display_order);
