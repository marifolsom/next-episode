const db = require('../database/connection');

const Favorite = {};

Favorite.find = userId => {
  return db.any(`
    SELECT *
    FROM user_favorites
    WHERE user_id = $1`,
    [userId]
  )
}

Favorite.add = (userId, addedShowId) => {
  return db.one(`
    INSERT INTO user_favorites (user_id, show_id)
    VALUES ($1, $2)
    RETURNING *`,
    [userId, addedShowId]
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
