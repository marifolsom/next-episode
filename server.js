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

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Set up static files
app.use('/client', express.static('./client'));
// Set up the session middleware which will let use `request.session`
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  })
);

const username = 'marisa';
const password = 'tvtracker';

// Declare salt as a global variable
const salt = '$2a$10$bKzWzZ9c21oHCFBYCUT4re';


// Middleware to check whether the user is authenticated
const requireLogin = (request, response, next) => {
  if (!request.session.authenticated) {
    response.redirect('/login');
    return;
  }
  next();
};


// '/signup' that renders a signup form
app.get('/signup', (request, response) => {
  const message = '';
  response.render('signup', { message });
})

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


// '/login' that renders a login form and logs the user in if their username and password are correct
app.get('/login', (request, response) => {
  const message = '';
  response.render('login', { message });
})

// Log the user in if their username and password are correct
app.post('/login', (request, response) => {
  let message = '';
  if (
    request.body.username === username &&
    request.body.password === password
  ) {
    // Set the session data
    message = 'You have been logged in. Now you can add shows to your favorites and watchlist!';
    request.session.authenticated = true;
    response.render('favorites/favorites', { message });
    return;
  }
    message = 'Invalid login.';
    response.render('home', { message });
});



// '/' that displays the user's watchlist (if logged in), trending, popular, and airing today
// Display show's poster, title, airdate
app.get('/', (request, response) => {
  // Create an array to hold all API urls for homepage
  const urls = [
    // URL to most popular shows
    `https://api.themoviedb.org/3/tv/popular?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`,
    // URL to top rated shows
    `https://api.themoviedb.org/3/tv/top_rated?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`,
    // URL to shows airing today
    `https://api.themoviedb.org/3/tv/airing_today?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
  ]
  // Create an array to hold all promises, and map over them to fetch
  const promises = urls.map(url => fetch(url));
  // Resolve all promises
  Promise
    .all(promises)
    .then(responses => {
      console.log(responses);
    })
    .then(homepageData => {
      // response.json(homepageData);
      response.render('home', { homepageData, message: '' });
    })
})

// //// FOR HOME.EJS FILE // ////
// <% for (let i = 0; i < homepageData.results.length; i++) { %>
//   <h2><%= homepageData.results[i].name %></h2>
//   <p><%= homepageData.results[i].overview %></p>
//   <p>Rating: <%= homepageData.results[i].vote_average %></p>
//   <p>Popularity: <%= homepageData.results[i].popularity %></p>
//   <img src="http://image.tmdb.org/t/p/w185<%= homepageData.results[i].poster_path %>">
//   <a href="https://api.themoviedb.org/3/tv/<%=homepageData.results[i].id%>?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US"> API link </a>
// <% } %>


// '/shows' that displays all shows currently running
// Display show's poster, title, airdate
app.get('/shows', (request, response) => {
  fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
    .then(apiResponse => apiResponse.json())
    .then(currentData => {
      // response.json(currentData);
      response.render('shows', { currentData })
    })
})

// Take added show and insert into the user's user_favorites table
app.post('/shows', (request, response) => {
  // Get the clicked button's value attribute which is the show's id
  // Not sure the best way to do this... DOM? bodyparser?
  const newShowId = Number(request.body);
  console.log(newShowId);
  // Also need to know the user's id
  // const userId = ;
  // Take the newShowId and add to favorites
  Favorite.add(newShowId)
    .then(show => {
      response.redirect('/shows');
    })
})


// Make a function that takes the user's search, converts it to the right format, and returns the show's id
const getShowId = (userInput) => {
  // Make a variable to store the search query
  let searchQuery = '';
  // Make a variable to store the show id
  let showId = 0;
  // Take the user's input, correct the format, and store in searchQuery variable
  // Replace spaces with % and changes to lower case
  searchQuery = userInput.split(' ').join('%20').toLowerCase();
  console.log(searchQuery);
  // Make an API request with the searchQuery
  fetch(`https://api.themoviedb.org/3/search/tv?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US&query=${searchQuery}`)
    .then(apiResponse => apiResponse.json())
    .then(showData => {
      // Assign the found show id to the showId variable
      showId = showData.results[0].id;
      console.log('show id:', showId);
    })
}


// '/show/:id' that displays details of a specific show
// Display show poster, show title, show description, show rating, show popularity, start date, status, all seasons, all episodes, where it can be watched, and recommendations
// User can click on an episode to get the episode description
// User can click to add to favorites or watchlist
app.get('/show/:id', (request, response) => {
  // Make a variable to hold the show id
  let showId = 0;
  if (!request.params.id) {
    // On search submit take the user input to find the idea
    // const userInput = request.body;
    // Just hard coding for now! (Something with lots of spaces to check the input is being converted properly)
    const userInput = 'How I Met Your Mother';
    // Call getShowId function to find show id, and assign that value to a variable
    showId = getShowId(userInput);
    console.log(showId);
  } else {
    // Take show id from url
    showId = Number(request.params.id);
  }
  // Make an API request with the showId
  fetch(`https://api.themoviedb.org/3/tv/${showId}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
    .then(apiResponse => apiResponse.json())
    .then(showData => {
      // response.json(showData);
      response.render('show', { showData });
    })
  // Make an API request with the showId
  // fetch(`https://api.themoviedb.org/3/tv/${showId}/recommendations?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
  //   .then(apiResponse => {
  //     return apiResponse.json();
  //   })
  //   .then(recsData => {
  //     // response.json(recsData);
  //     response.render('show', { recsData: recsData });
  //   })
})

// //// FOR SHOW.EJS FILE // ////
// <!-- For each show, display data -->
// <% for (let i = 0; i < recsData.results.length; i++) { %>
//   <!-- store recommendation id -->
//   <% recId = recsData.results[i].id %>
//   <!-- Display show title -->
//   <h3><%= recsData.results[i].name %></h3>
//   <!-- If there's a show poster, display poster -->
//   <% if (recsData.results[i].poster_path) { %>
//     <img src="http://image.tmdb.org/t/p/w185<%= recsData.results[i].poster_path %>">
//   <% } %>
//   <!-- Display show description -->
//   <p><%= recsData.results[i].overview %></p>
//   <!-- Display show rating -->
//   <p><%= Rating: recsData.results[i].vote_average %></p>
//   <!-- Display link to show's API -->
//   <a href"https://api.themoviedb.org/3/tv/${recId}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US">API Link</a>
// <% } %>


// '/episode/:id' that displays details of a specific episode
// Display show season poster, show title, season number, episode number, airdate, episode description
app.get('/show/:showId/season/:seasonNumber', (request, response) => {
  const showId = Number(request.params.showId);
  const seasonNumber = Number(request.params.seasonNumber);
  fetch(`https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
    .then(apiResponse => apiResponse.json())
    .then(seasonData => {
      // response.json(seasonData);
      response.render('episode', { seasonData, showId });
    })
})


// '/favorites' that prompts user to log in (if not logged in) and displays the user's favorited shows
// Display show's poster and title, sorted by start date
// Clicking on a show in favorites would take the user to '/show/:id'
app.get('/favorites', requireLogin, (request, response) => {

  response.render('favorites/favorites', { message: '' });
})


// '/watchlist' that prompts user to log in (if not logged in) and displays the user's watchlist with a "to watch" and "caught up" section
// Display the show's poster, title, and a number displaying the episodes that still need to be watched
app.get('/watchlist', (request, response) => {

  response.render('watchlist', { });
})


// '/watchlist/show/:id' that prompts user to log in (if not logged in) and displays a specific show on the user's watchlist with the user's watch progress
// Display breakdown of how many seasons and episodes the show has in total, and recommendations
// User can also tick the episodes they've already watched
// Clicking on an episode would take the user to '/episode/:id'
app.get('/watchlist/show/:id', (request, response) => {

  response.render('watchlist/show', { });
})


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
