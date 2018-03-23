const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const bcrypt = require('bcrypt');
// Require es6-promise and isomorphic-fetch to allow for server side fetch
const es6 = require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
// Require models
const User = require('./models/User');
const Favorite = require('./models/Favorite');
const Watchlist = require('./models/Watchlist');
// Set port
const PORT = 3000;

// Create an Express application (web server)
const app = express();

// Set template engine to ejs
app.set('view engine', 'ejs');

// Set up static files
app.use('/client', express.static('./client'));


// Create application/json parser
const jsonParser = bodyParser.json();

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Declare salt as a global variable
const salt = '$2a$10$bKzWzZ9c21oHCFBYCUT4re';



// // '/signup' that renders a signup form
// app.get('/signup', (response, request) => {
//   // const message = '';
//   response.render('signup');
// })

// app.post('/signup', urlencodedParser, (response, request) => {
//   // // Get username and password from database
//   // const newUsername = request.body.username;
//   // Users.create(newUsername)
//   //   .then(userData => {
//   //     // Get password entered by user
//   //     const passwordEntered = newUser.password;
//   //     const hashedPassword = bcrypt.hashSync()
//   //
//   //   })
// })


// // '/login' that renders a login form and logs the user in if their username and password are correct
// app.get('/login', (response, request) => {
//   const message = '';
//   response.render('login', { message });
// })


// '/' that displays the user's watchlist (if logged in), trending, popular, and airing today, all with show posters
app.get('/', urlencodedParser, (response, request) => {
  // Fetch most popular shows
  fetch(`https://api.themoviedb.org/3/tv/popular?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
    .then(popularData => {
      response.json(popularData);
    })
  // response.render('home', {  });
})


// // '/shows' that displays all shows with show posters
// app.get('/shows', (response, request) => {
//
//   response.render('shows', {  });
// })


// // '/show/:id' that displays details of a specific show // Display show poster, show title, show description, show rating, show popularity, start date, status, all seasons, all episodes, where it can be watched
// // User can click on an episode to get the episode description
// // User can click to add to favorites or watchlist
// app.get('/show/:id', (response, request) => {
//
//   response.render('show', { });
// })


// // '/episode/:id' that displays details of a specific episode
// // Display show season poster, show title, season number, episode number, airdate, episode description
// app.get('/episode/:id', (response, request) => {
//
//   response.render('episode', { });
// })


// // '/favorites' that prompts user to log in (if not logged in) and displays the user's favorited shows
// // Display show's poster and title, sorted by start date
// // Clicking on a show in favorites would take the user to '/show/:id'
// app.get('/favorites', (response, request) => {
//
//   response.render('favorites', { });
// })


// // '/watchlist' that prompts user to log in (if not logged in) and displays the user's watchlist with a "to watch" and "caught up" section
// // Display the show's poster, title, and a number displaying the episodes that still need to be watched
// app.get('/watchlist', (response, request) => {
//
//   response.render('watchlist', { });
// })


// // '/watchlist/show/:id' that prompts user to log in (if not logged in) and displays a specific show on the user's watchlist with the user's watch progress
// // Display breakdown of how many seasons and episodes the show has in total, and recommendations
// // User can also tick the episodes they've already watched
// // Clicking on an episode would take the user to '/episode/:id'
// app.get('/watchlist/show/:id', (response, request) => {
//
//   response.render('watchlist/show', { });
// })


// // Post MVP? //
// // '/watchlist/week' that prompts user to log in (if not logged in) and displays the shows from the user's watchlist that are currently on air in a week format
// app.get('/watchlist/week', (response, request) => {
//
//   response.render('watchlist/week');
// })


// Start server
app.listen(PORT, () => {
  console.log(`server is listening on PORT ${PORT}!`);
});
