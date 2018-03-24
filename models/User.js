const db = require('../database/connection');

const User = {};

User.create = userData => {
  return db.one(`
    INSERT INTO user_info (username, email, password)
    VALUES ($1, $2, $3)`,
    [
      userData.username,
      userData.email,
      userData.password
    ]
  )
}

User.find = enteredUsername => {
  return db.one(`
    SELECT *
    FROM user_info
    WHERE username = $1`,
    [enteredUsername]
  )
}

User.new = (newUsername, hashedPassword) => {
  return db.one(`
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id`,
    [newUsername, hashedPassword]
  )
}

module.exports = User;
