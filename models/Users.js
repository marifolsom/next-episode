const pgp = require('pg-promise')({});

// Prepare the connection URL from the format: 'postgres://username:password@host:port/database';
const connectionURL = 'postgres://localhost:5432/tv_tracker';
const db = pgp(connectionURL);

const Users = {};



module.exports = Users;
