const db = require('../database/connection');

const Watchlist = {};

Watchlist.add = showData => {
  db.one(
    `
    INSERT INTO watchlist (
      show_id, show_title, episode_id, episode_title, airdate, img_url
    )
    VALUES (
      $1, $2, $3, $4, $5
    )`,
    [
      showData.showId,
      showData.showTitle,
      showData.episodeNumber,
      showData.episodeTitle,
      showData.showAirdate,
      showData.showImg
    ]
  );
};

Watchlist.remove = showId => {
  db.result(
    `
    DELETE FROM watchlist
    WHERE id = $1`,
    [showId]
  );
};

module.exports = Watchlist;
