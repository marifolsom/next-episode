DROP DATABASE IF EXISTS tv_tracker;
CREATE DATABASE tv_tracker;

\c tv_tracker


CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  show_id INTEGER,
  title VARCHAR(255),
  description VARCHAR(255),
  airdate DATETIME,
  img_url VARCHAR(255)
);

CREATE TABLE watchlist (
  id BIGSERIAL PRIMARY KEY,
  show_id INTEGER,
  episode_id INTEGER,
  number_of_episodes INTEGER,
  watched BOOLEAN,
  img_url VARCHAR(255)
);

CREATE TABLE user_info (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(15),
  email VARCHAR(100),
  password VARCHAR(60),
  favorites_id INTEGER REFERENCES favorites(id),
  watchlist_id INTEGER REFERENCES watchlist(id)
);
