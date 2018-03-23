const express = require('express');
const bodyParser = require('body-parser');
const Shows = require('./models/Shows');
const methodOverride = require('method-override');

// Create an Express application (web server)
const app = express();

// Set template engine to ejs
app.set('view engine', 'ejs');

// Set up static files
app.use(express.static('./assets'));

// Set port
const PORT = 3000;

// Create application/json parser
const jsonParser = bodyParser.json();

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });



// Start server
app.listen(PORT, () => {
  console.log(`server is listening on PORT ${PORT}!`);
});
