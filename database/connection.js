const pgp = require('pg-promise')({});

// Prepare the connection URL
// const connectionURL = 'postgres://localhost:5432/tv_tracker';
const connectionURL = process.env.DATABASE_URL || 'postgres://localhost:5432/tv_tracker';
const connection = pgp(connectionURL);

module.exports = connection;
