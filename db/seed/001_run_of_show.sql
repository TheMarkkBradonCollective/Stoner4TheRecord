-- Run-of-show from Stoner4TheRecord Official Live Broadcast Format v1.1

TRUNCATE run_of_show RESTART IDENTITY CASCADE;

INSERT INTO run_of_show (sort_order, segment_name, segment_type, length_minutes, length_label, is_pre_show) VALUES
  (0, 'Guest DJ Warm-Up', 'Music', NULL, '15–30 min', TRUE),
  (1, 'Opening Chit Chat Smoke Sesh', 'Host', 15, '15 min', FALSE),
  (2, 'Live Sponsor Spotlight', 'Sponsor', 8, '8 min', FALSE),
  (3, 'Host DJ Set', 'Music', 30, '30 min', FALSE),
  (4, 'Chit Chat Smoke Sesh', 'Host Break', 5, '5 min', FALSE),
  (5, 'Live Sponsor Spotlight', 'Sponsor', 8, '8 min', FALSE),
  (6, 'Guest DJ Set #1', 'Music', 30, '30 min', FALSE),
  (7, 'Chit Chat Smoke Sesh', 'Host Break', 5, '5 min', FALSE),
  (8, 'Live Sponsor Spotlight', 'Sponsor', 8, '8 min', FALSE),
  (9, 'Comedy Corner', 'Comedy', 20, '20 min', FALSE),
  (10, 'Extended Chit Chat Smoke Sesh', 'Host', 15, '15 min', FALSE),
  (11, 'Live Sponsor Spotlight', 'Sponsor', 8, '8 min', FALSE),
  (12, 'Stoner Games', 'Games', 60, '60 min', FALSE),
  (13, 'Chit Chat Smoke Sesh', 'Host Break', 5, '5 min', FALSE),
  (14, 'Live Sponsor Spotlight', 'Sponsor', 8, '8 min', FALSE),
  (15, 'Guest DJ Set #2', 'Music', 30, '30 min', FALSE),
  (16, 'Closing Chit Chat Smoke Sesh', 'Host', 15, '15 min', FALSE);
