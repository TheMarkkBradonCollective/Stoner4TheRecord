-- Placeholder sponsors aligned with programming guide categories (not real businesses)

TRUNCATE sponsors RESTART IDENTITY CASCADE;

INSERT INTO sponsors (slug, name, description, website_url, category, promo_code, display_order, is_featured) VALUES
  (
    'green-leaf-collective',
    'Green Leaf Collective',
    'Independent dispensary spotlight — live product demos and community Q&A during every sponsor block.',
    'https://example.com/green-leaf-collective',
    'Dispensary',
    'S4TR-GREEN15',
    1,
    TRUE
  ),
  (
    'cloud-nine-glass',
    'Cloud Nine Glass',
    'Hand-blown pieces from local artists. Giveaways and discount codes during live sponsor spotlights.',
    'https://example.com/cloud-nine-glass',
    'Glass Artist',
    'S4TR-CLOUD10',
    2,
    TRUE
  ),
  (
    'munchie-mobile',
    'Munchie Mobile',
    'Food truck favorites for late-night sessions. Sponsor of Comedy Corner snack breaks.',
    'https://example.com/munchie-mobile',
    'Food Truck',
    'MUNCHIE-S4TR',
    3,
    TRUE
  ),
  (
    'cbd-wellness-co',
    'CBD Wellness Co.',
    'CBD and wellness products with responsible-use education segments.',
    'https://example.com/cbd-wellness-co',
    'CBD Brand',
    NULL,
    4,
    FALSE
  ),
  (
    'hydro-haven-supply',
    'Hydro Haven Supply',
    'Grow supplies and hydroponics for home cultivators. Featured during Grow Talk specials.',
    'https://example.com/hydro-haven',
    'Hydroponic Supplier',
    'HYDRO-S4TR',
    5,
    FALSE
  );
