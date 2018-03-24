const db = require('../database/connection');

const Favorite = {};

Favorite.findByUser = userId => {
  return db.any(`
    SELECT *
    FROM user_favorites
    WHERE user_id = $1`,
    [userId]
  )
}

Favorite.add = (showId, userId) => {
  return db.one(`
    INSERT INTO user_favorites (show_id)
    VALUES ($1)
    WEHERE user_id = $2`,
    [showId, userId]
  );
};

Favorite.remove = (showId, userId) => {
  return db.result(`
    DELETE FROM user_favorites
    WHERE show_id = $1 && user_id = $2`,
    [showId, userId]
  );
};

module.exports = Favorite;
