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
app.get('/', (request, response) => {
  // Fetch most popular shows
  fetch(`https://api.themoviedb.org/3/tv/popular?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
  .then(apiResponse => {
    return apiResponse.json();
  })
  .then(popularData => {
    for (let i = 0; i < popularData.results.length; i++) {
      const popId = popularData.results[i].id;
      const popTitle = popularData.results[i].name;
      const popDesc = popularData.results[i].overview;
      const rating = popularData.results[i].vote_average;
      const popularity = popularData.results[i].popularity;
      const popImg = popularData.results[i].poster_path;
      const popLink = `https://api.themoviedb.org/3/tv/${popId}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`;
      // console.log('pop title:', popTitle);
      // console.log('pop desc:', popDesc);
      // console.log('rating:', rating);
      // console.log('popularity:', popularity);
      // console.log('pop img:', popImg);
      // console.log('pop link:', popLink);
      // console.log('-------------------------------');
    }
  })
  // Fetch top rated shows
  fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
  .then(apiResponse => {
    return apiResponse.json();
  })
  .then(topRatedData => {
    for (let i = 0; i < topRatedData.results.length; i++) {
      const topId = topRatedData.results[i].id;
      const topTitle = topRatedData.results[i].name;
      const topDesc = topRatedData.results[i].overview;
      const rating = topRatedData.results[i].vote_average;
      const popularity = topRatedData.results[i].popularity;
      const topImg = topRatedData.results[i].poster_path;
      const topLink = `https://api.themoviedb.org/3/tv/${topId}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`;
      // console.log('top title:', topTitle);
      // console.log('top desc:', topDesc);
      // console.log('rating:', rating);
      // console.log('popularity:', popularity);
      // console.log('top img:', topImg);
      // console.log('top link:', topLink);
      // console.log('-------------------------------');
    }
  })
  // Fetch shows that are airing today
  fetch(`https://api.themoviedb.org/3/tv/airing_today?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
  .then(apiResponse => {
    return apiResponse.json();
  })
  .then(airingData => {
    for (let i = 0; i < airingData.results.length; i++) {
      const airingId = airingData.results[i].id;
      const airingTitle = airingData.results[i].name;
      const airingDesc = airingData.results[i].overview;
      const rating = airingData.results[i].vote_average;
      const popularity = airingData.results[i].popularity;
      const airingImg = airingData.results[i].poster_path;
      const airingLink = `https://api.themoviedb.org/3/tv/${airingId}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`;
      // console.log('airing title:', airingTitle);
      // console.log('airing desc:', airingDesc);
      // console.log('rating:', rating);
      // console.log('popularity:', popularity);
      // console.log('airing img:', airingImg);
      // console.log('airing link:', airingLink);
      // console.log('-------------------------------');
    }
    response.render('home', { airingData: airingData });
  })
})


// '/shows' that displays all shows currently running
app.get('/shows', (request, response) => {
  fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
  .then(apiResponse => {
    return apiResponse.json();
  })
  .then(currentData => {
    // for (let i = 0; i < currentData.results.length; i++) {
    //   const currentId = currentData.results[i].id;
    //   const currentTitle = currentData.results[i].name;
    //   const currentDesc = currentData.results[i].overview;
    //   const rating = currentData.results[i].vote_average;
    //   const popularity = currentData.results[i].popularity;
    //   const currentImg = currentData.results[i].poster_path;
    //   const currentLink = `https://api.themoviedb.org/3/tv/${currentId}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`;
    // }
    response.render('shows', { currentData: currentData })
  })
})


// // '/show/:id' that displays details of a specific show
// Display show poster, show title, show description, show rating, show popularity, start date, status, all seasons, all episodes, where it can be watched
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
