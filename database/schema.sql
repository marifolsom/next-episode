DROP DATABASE IF EXISTS tv_tracker;
CREATE DATABASE tv_tracker;

\c tv_tracker;

CREATE TABLE user_info (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE user_favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES user_info(id),
  show_id INTEGER,
  show_title VARCHAR(255),
  show_img VARCHAR(255),
  notes VARCHAR(255)
);

-- CREATE TABLE watchlist (
--   id BIGSERIAL PRIMARY KEY,
--   show_id INTEGER,
--   show_title VARCHAR(255),
--   episode_id INTEGER,
--   episode_title VARCHAR(255),
--   number_of_episodes INTEGER,
--   watched BOOLEAN,
--   img_url VARCHAR(255)
-- );
