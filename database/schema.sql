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
  show_id INTEGER
);


-- ALTER TABLE favorites
-- ADD FOREIGN KEY (user_id) REFERENCES user_info(id);
--
-- ALTER TABLE user_info
-- ADD FOREIGN KEY (favorites_id) REFERENCES favorites(id);
-- ADD FOREIGN KEY (watchlist_id) REFERENCES watchlist(id);


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
