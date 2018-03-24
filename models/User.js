const db = require('../database/connection');

const User = {};


User.create = newUser => {
  return db.one(`
    INSERT INTO user_info (username, password)
    VALUES ($1, $2)
    RETURNING id`,
    [newUser.username, newUser.password]
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
