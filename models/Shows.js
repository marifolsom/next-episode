const pgp = require('pg-promise')({});

// Prepare the connection URL from the format: 'postgres://username:password@host:port/database';
const connectionURL = 'postgres://localhost:5432/todo_app';
const db = pgp(connectionURL);

const Shows = {};



module.exports = Shows;
