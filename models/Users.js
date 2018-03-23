const db = require('../database/connection');

const Users = {};

Users.create = userData => {
  return db.one(`
    INSERT INTO user_info (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING password`,
    [
      userData.username,
      userData.email,
      userData.password
    ]
  )
}

Users.find = username => {
  return db.one(`
    SELECT *
    FROM user_info
    WHERE username = $1`,
    [username]
  )
}

module.exports = Users;
