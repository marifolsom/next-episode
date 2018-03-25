const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const bcrypt = require('bcrypt');
// Require es6-promise and isomorphic-fetch to allow for server side fetch
const es6 = require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');

// Import models
const User = require('./models/User');
const Favorite = require('./models/Favorite');
// const Watchlist = require('./models/Watchlist');

const app = express();
const PORT = 3000;

// Declare salt as a global variable to create a password salt
const salt = '$2a$10$bKzWzZ9c21oHCFBYCUT4re';

app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Set up static files
app.use('/client', express.static('./client'));
// Set up the session middleware
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  })
);

// Middleware to check whether the user is authenticated
const requireLogin = (request, response, next) => {
  if (!request.session.authenticated) {
    response.redirect('/login');
    return;
  }
  next();
};



//  SIGNUP  ////////////////////////////////////////////////////////
// '/signup' that renders a signup form
app.get('/signup', (request, response) => {
  response.render('signup');
})

// Add new user info from signup form into database
app.post('/signup', (request, response) => {
  let message = '';
  // Get user's entered username and password
  const newUsername = request.body.username;
  const newPassword = request.body.password;
  // Salt and hash password using bcrypt
  const hashedPassword = bcrypt.hashSync(newPassword, salt);
  // Insert new user info into database
  User.create(newUsername, hashedPassword)
    .then(userId => {
      message = 'You\'ve created a new account!';
      response.render('favorites/favorites', { message });
    })
})



//  LOGIN  /////////////////////////////////////////////////////////
// Render a login form
app.get('/login', (request, response) => {
  response.render('login');
})

// Log the user in if the username and password entered in login form are correct
app.post('/login', (request, response) => {
  let message = '';
  // Get user's entered username and password
  const enteredUsername = request.body.username;
  const enteredPassword = request.body.password;
  const hashedPassword = bcrypt.hashSync(enteredPassword, salt);
  // Find user's info with the entered username
  User.find(enteredUsername)
    .then(userInfo => {
      // Username and password are a match if they are the same as the ones in the user_info table
      const usernameMatch = enteredUsername === userInfo.username;
      const passwordMatch = hashedPassword === userInfo.password;
      // If both match, log the user in
      if (usernameMatch && passwordMatch) {
        // Set the session data
        message = 'You have been logged in. Now you can add shows to your favorites and watchlist!';
        request.session.authenticated = true;
        response.render('favorites/favorites', { message });
        // Store the user's id for the session
        request.session.userId = Number(userInfo.id);
        // Call save() to save any changes to the session object
        request.session.save();
      // If the username/password don't match, render an error
      } else {
        // Getting an unhandled promise rejection warning here for some reason now?
        message = 'Invalid login.';
        response.render('home', { message });
      }
    })
});



//  HOME  //////////////////////////////////////////////////////////
// Displays trending, popular, and airing today
// Shows' posters, titles, airdates
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
      // Need to figure out how to access the data inside the request bodies
      // console.log(responses);
    })
    .then(homepageData => {
      // response.json(homepageData);
      response.render('home', { homepageData, message: '' });
    })
})

// Once Promise.all() from ^ works, add this into home.ejs file
// <% for (let i = 0; i < homepageData.results.length; i++) { %>
//   <h2><%= homepageData.results[i].name %></h2>
//   <p><%= homepageData.results[i].overview %></p>
//   <p>Rating: <%= homepageData.results[i].vote_average %></p>
//   <p>Popularity: <%= homepageData.results[i].popularity %></p>
//   <img src="http://image.tmdb.org/t/p/w185<%= homepageData.results[i].poster_path %>">
//   <a href="https://api.themoviedb.org/3/tv/<%=homepageData.results[i].id%>?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US"> API link </a>
// <% } %>



//  SHOWS  /////////////////////////////////////////////////////////
// Displays all shows currently running
// Shows' posters, titles, airdates
// Need to fix and add pages! (right now only display 1st page)
app.get('/shows', (request, response) => {
  fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
    .then(apiResponse => apiResponse.json())
    .then(currentData => {
      // response.json(currentData);
      response.render('shows', { currentData, message: '' })
    })
})



//  FAVORITES  /////////////////////////////////////////////////////
// Prompts user to log in (if not logged in) and displays the user's favorited shows
// Shows' posters, titles, airdates
// Clicking on a show in favorites would take the user to that show's detail page -- '/show/:id'
app.get('/favorites', requireLogin, (request, response) => {
  // Get the user's id that's stored in the session
  const userId = request.session.userId;
  console.log('user', userId, 'is the current user stored in session');
  // Get the user's favorited show ids from the database
  Favorite.find(userId)
    .then(favoritesIds => {
      console.log('favorited show ids:', favoritesIds);
      // For each show id, fetch info from API
      for (let i = 0; i < favoritesIds.length; i++) {
        // Fetch
        // Promise.all()?
      }
      response.render('favorites/favorites', { message: '' });
    })
})



//  ADDING TO FAVORITES  ///////////////////////////////////////////
// From shows page, take any show added with the "add to favorites" button and insert into the user's user_favorites table
app.post('/shows', (request, response) => {
  // let message = '';
  // Get the user's id that's stored in the session
  const userId = request.session.userId;
  console.log(`user ${userId} is the current user stored in session`);
  // Get the clicked button's value attribute containing the show's id and store it in a variable
  const addedShowId = Number(request.body.showId);
  // Take the addedShowId and insert into database
  // If the show is already in the user's favorites, don't insert (in Favorites.js added WHERE NOT EXISTS, but not sure if that's the best way)
  Favorite.add(userId, addedShowId)
    .then(() => {
      // For some reason it doesn't like having a message...
      // message = `You just added show ${addedShowId} to your favorites!`;
      // response.redirect('/shows', { message });
      // Once inserted, redirect user to that specific show's spot on the shows page so they can pick up where they left off
      response.redirect(`/shows#${addedShowId}`);
    })
  console.log(`you just added show ${addedShowId} to your favorites!`);
})

// From a show's detail page, take added show and insert into the user's user_favorites table
app.post('/show/:id', (request, response) => {
  // let message = '';
  // Get the user's id that's stored in the session
  const userId = request.session.userId;
  console.log(`user ${userId} is the current user stored in session`);
  // Get the show's id from the url and store it in a variable
  const addedShowId = Number(request.params.id);;
  // Take the addedShowId and insert into database
  Favorite.add(userId, addedShowId)
    .then(() => {
      // For some reason it doesn't like having a message...
      // message = `You just added show ${addedShowId} to your favorites!`;
      // response.redirect('/shows', { message });
      // Once inserted, redirect the user to that specific shows detail page
      response.redirect(`/show/${addedShowId}`);
    })
  console.log(`you just added show ${addedShowId} to your favorites!`);
})



//  REMOVING FROM FAVORITES  ///////////////////////////////////////
// From shows page, remove any show removed with the "remove from favorites" button and delete from the user's user_favorites table
app.delete('/shows', (request, response) => {
  // Get the user's id that's stored in the session
  const userId = request.session.userId;
  console.log(`user ${userId} is the current user stored in session`);
  // Get the clicked button's value attribute containing the show's id and store it in a variable
  const removedShowId = Number(request.body.showId);
  // Take the removedShowId and delete that row from database
  Favorite.remove(userId, removedShowId)
    .then(() => {
      // Once deleted, redirect user to that specific show's spot on the shows page
      response.redirect(`/shows#${removedShowId}`);
    })
  console.log(`you just removed show ${removedShowId} from your favorites!`);
})

// From a show's detail page, remove show and delete from the user's user_favorites table
app.delete('/show/:id', (request, response) => {
  // Get the user's id that's stored in the session
  const userId = request.session.userId;
  console.log(`user ${userId} is the current user stored in session`);
  // Get the show's id from the url and store it in a variable
  const removedShowId = Number(request.params.id);;
  // Take the removedShowId and delete from database
  Favorite.remove(userId, removedShowId)
    .then(() => {
      response.redirect(`/show/${removedShowId}`);
    })
  console.log(`you just removed show ${removedShowId} from your favorites!`);
})



//  SHOW DETAILS  //////////////////////////////////////////////////
// Make a function that takes the user's input in the search bar, converts it to the right format, and returns the show's id
const getShowId = userInput => {
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

// Display the details of a specific show (by id)
// Show's poster, title, description, rating, popularity, start date, status, all seasons, all episodes, where it can be watched, and recommendations
// User can click to add to favorites or watchlist
app.get('/show/:id', (request, response) => {
  // Make a variable to hold the show id
  let showId = 0;
  if (!request.params.id) {
    // // On search submit take the user's input in the search bar to find the show's id
    // const userInput = request.body;
    // Just hard coding for now! (Something with lots of spaces to check the input is being converted properly)
    const userInput = 'How I Met Your Mother';
    console.log(userInput);
    // Call getShowId function to find show id, and assign that value to the showId variable
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
  // Use Promise.all() here too to get recommendations as well
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

// Once Promise.all() from ^ works, add this into show.ejs file
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



//  SEASON DETAILS  ////////////////////////////////////////////////
// Displays details of a specific seasons
// Show's season poster, show title, season title, episode numbers and titles, airdates, episode descriptions
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



//  WATCHLIST  /////////////////////////////////////////////////////
// Prompt user to log in (if not logged in) and display the user's watchlist with a "to watch" and "caught up" section
// Display each show's poster, title, and a number showing the episodes that still need to be watched
app.get('/watchlist', requireLogin, (request, response) => {

  response.render('watchlist', { });
})

// Prompt user to log in (if not logged in) and display a specific show from the user's watchlist with the user's watch progress
// Display breakdown of how many seasons and episodes the show has in total, and recommendations
// User can also tick the episodes they've already watched
// Clicking on an episode would take the user to '/episode/:id'
app.get('/watchlist/show/:id', requireLogin, (request, response) => {

  response.render('watchlist/show', { });
})


// // Post MVP? //
// Prompts user to log in (if not logged in) and display the shows from the user's watchlist that are currently on air in a week format
// app.get('/watchlist/week', (response, request) => {
//
//   response.render('watchlist/week');
// })


// Start server
app.listen(PORT, () => {
  console.log(`server is listening on PORT ${PORT}!`);
});
