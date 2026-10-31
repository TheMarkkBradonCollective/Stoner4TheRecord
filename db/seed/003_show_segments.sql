-- Stoner Games and recurring segment types from programming guide

TRUNCATE show_segments RESTART IDENTITY CASCADE;

INSERT INTO show_segments (slug, name, description, category, display_order) VALUES
  ('chit-chat-smoke-sesh', 'Chit Chat Smoke Sesh', 'The conversational home base — host, guests, and chat hang out between every major block.', 'Host', 1),
  ('live-sponsor-spotlight', 'Live Sponsor Spotlight', 'Eight-minute live sponsor segments. No prerecorded ads — always live with the host.', 'Sponsor', 2),
  ('host-dj-set', 'Host DJ Set', 'Live DJ performance from the elevated booth — hip-hop, house, lo-fi, and independent artists.', 'Music', 3),
  ('guest-dj-set', 'Guest DJ Set', 'Guest DJs perform live sets introduced by the host after each sponsor spotlight.', 'Music', 4),
  ('comedy-corner', 'Comedy Corner', 'Stand-up, storytelling, meme review, smoke stories, and viewer submissions.', 'Comedy', 5),
  ('community-spotlight', 'Community Spotlight', 'Artists, growers, glass blowers, musicians, and local businesses.', 'Community', 6),
  ('stoner-bingo', 'Stoner Bingo', 'Downloadable bingo cards with live prizes. Viewers play through the mobile companion.', 'Games', 10),
  ('stoner-trivia', 'Stoner Trivia', 'Cannabis, movies, music, history, and pop culture trivia with live leaderboards.', 'Games', 11),
  ('guess-the-strain', 'Guess The Strain', 'Audience guesses the strain from clues revealed live by the host.', 'Games', 12),
  ('smoke-or-joke', 'Smoke or Joke', 'True story or completely made up? The audience decides.', 'Games', 13),
  ('high-or-history', 'High or History', 'Did it actually happen? Cannabis history meets improv.', 'Games', 14),
  ('wheel-of-weed', 'Wheel of Weed', 'Random wheel chooses challenges, stories, giveaways, dabs, confessions, or music requests.', 'Games', 15),
  ('smoke-olympics', 'Smoke Olympics', 'Competitive party games — memory, drawing, team challenges, fastest answer.', 'Games', 16);
