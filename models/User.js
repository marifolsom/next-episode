const db = require('../database/connection');

const User = {};


User.create = (newUsername, hashedPassword) => {
  return db.one(`
    INSERT INTO user_info (username, password)
    VALUES ($1, $2)
    RETURNING id`,
    [newUsername, hashedPassword]
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


module.exports = User;
