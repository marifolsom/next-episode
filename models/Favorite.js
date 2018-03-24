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

Favorite.add = showId => {
  db.one(`
    INSERT INTO user_favorites (show_id)
    VALUES ($1)`,
    [showId]
  );
};

Favorite.remove = showId => {
  db.result(`
    DELETE FROM user_favorites
    WHERE id = $1`,
    [showId]
  );
};

module.exports = Favorite;
