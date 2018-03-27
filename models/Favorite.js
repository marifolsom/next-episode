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

Favorite.add = (userId, addedShowId, addedShowTitle, addedShowImg) => {
  return db.one(`
    INSERT INTO user_favorites (user_id, show_id, show_title, show_img)
    SELECT $1, $2, $3, $4
    WHERE NOT EXISTS (
      SELECT *
      FROM user_favorites
      WHERE user_id = $1 AND show_id = $2
    )
    RETURNING *`,
    [userId, addedShowId, addedShowTitle, addedShowImg]
  );
};

Favorite.remove = (userId, removedShowId) => {
  return db.result(`
    DELETE FROM user_favorites
    WHERE user_id = $1 AND show_id = $2`,
    [userId, removedShowId]
  );
};

Favorite.editNotes = (notesContent, userId, showId) => {
  return db.none(`
    UPDATE user_favorites
    SET notes = $1
    WHERE user_id = $2 AND show_id = $3`,
    [notesContent, userId, showId]
  )
}

module.exports = Favorite;
