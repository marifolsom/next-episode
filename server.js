const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');

// Require models
const Users = require('./models/Users');
const Favorites = require('./models/Favorites');
const Watchlist = require('./models/Watchlist');

// Create an Express application (web server)
const app = express();

// Set template engine to ejs
app.set('view engine', 'ejs');

// Set up static files
app.use('/client', express.static('./client'));

// Set port
const PORT = 3000;

// Create application/json parser
const jsonParser = bodyParser.json();

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });


// '/login' that renders a login form and logs the user in if their username and password are correct


// '/' that displays the user's watchlist (if logged in), trending, popular, and airing today, all with show posters


// '/show/:id' that displays details of a specific show // Display show poster, show title, show description, show rating, show popularity, start date, status, all seasons, all episodes, where it can be watched
// User can click on an episode to get the episode description
// User can click to add to favorites or watchlist


// '/episode/:id' that displays details of a specific episode
// Display show season poster, show title, season number, episode number, airdate, episode description


// '/favorites' that prompts user to log in (if not logged in) and displays the user's favorited shows
// Display show's poster and title, sorted by start date
// Clicking on a show in favorites would take the user to '/show/:id'


// '/watchlist' that prompts user to log in (if not logged in) and displays the user's watchlist with a "to watch" and "caught up" section
// Display the show's poster, title, and a number displaying the episodes that still need to be watched


// '/watchlist/show/:id' that prompts user to log in (if not logged in) and displays a specific show on the user's watchlist with the user's watch progress
// Display breakdown of how many seasons and episodes the show has in total, and recommendations
// User can also tick the episodes they've already watched
// Clicking on an episode would take the user to '/episode/:id'


// Post MVP? // 
// '/watchlist/week' that prompts user to log in (if not logged in) and displays the shows from the user's watchlist that are currently on air in a week format



// Start server
app.listen(PORT, () => {
  console.log(`server is listening on PORT ${PORT}!`);
});
