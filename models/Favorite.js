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
  // return db.one(`
  //   INSERT INTO user_favorites (user_id, show_id)
  //   VALUES ($1, $2)
  //   RETURNING *`,
  return db.one(`
    INSERT INTO user_favorites (user_id, show_id)
    SELECT $1, $2
    WHERE NOT EXISTS (
      SELECT *
      FROM user_favorites
      WHERE user_id = $1 AND show_id = $2
    )
    RETURNING *`,
    [userId, addedShowId]
  );
};

Favorite.remove = (userId, removedShowId) => {
  return db.result(`
    DELETE FROM user_favorites
    WHERE user_id = $1 AND show_id = $2`,
    [userId, removedShowId]
  );
};

module.exports = Favorite;
