const db = require('../database/connection');

const Favorites = {};

Favorites.addToFavorites = showData => {
  db.one(
    `
    INSERT INTO favorites (
      show_id, show_title, airdate, img_url
    )
    VALUES (
      $1, $2, $3, $4, $5
    )`,
    [
      showData.showId,
      showData.showTitle,
      showData.showAirdate,
      showData.showImg
    ]
  );
};

Favorites.removeFromFavorites = showId => {
  db.result(
    `
    DELETE FROM favorites
    WHERE id = $1`,
    [showId]
  );
};

module.exports = Favorites;
