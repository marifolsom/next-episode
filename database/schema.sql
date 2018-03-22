DROP DATABASE IF EXISTS tv_tracker;
CREATE DATABASE tv_tracker;

\c tv_tracker

CREATE TABLE user (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(15),
  email VARCHAR(100),
  password VARCHAR(60),
  favorites_id INTEGER REFERENCES favorites (id),
  watchlist_id INTEGER REFERENCES watchlist (id)
);

CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  show_id INTEGER,
  title VARCHAR(255),
  description VARCHAR(255),
  img_url VARCHAR(255),
  next_episode_airdate DATETIME,
  number_of_episodes INTEGER,
  number_of_seasons INTEGER
);

CREATE TABLE watchlist (
  id BIGSERIAL PRIMARY KEY,
  favorites_id INTEGER REFERENCES favorites (id),
  episodes_watched INTEGER
);
