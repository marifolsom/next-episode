const db = require('../database/connection');

const User = {};

User.create = userData => {
  db.one(`
    INSERT INTO user_info (username, email, password)
    VALUES ($1, $2, $3)`,
    [
      userData.username,
      userData.email,
      userData.password
    ]
  )
}

User.find = username => {
  db.one(`
    SELECT *
    FROM user_info
    WHERE username = $1`,
    [username]
  )
}

module.exports = User;
