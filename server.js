// Dependencies
// -----------------------------------------------------------------------
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const bcrypt = require('bcrypt');
const es6 = require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
// Import all models
const User = require('./models/User');
const Favorite = require('./models/Favorite');
// const Watchlist = require('./models/Watchlist');
// App configuration
const app = express();
const PORT = process.env.PORT || 3000;
// Declare salt as a global variable to create a password salt
const salt = '$2a$10$bKzWzZ9c21oHCFBYCUT4re';
// Set view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
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


// SIGNUP
// -----------------------------------------------------------------------
// Render a signup form
app.get('/signup', (request, response) => {
  response.render('signup', { message: '' });
})

// Add new user info from signup form into database
app.post('/signup', (request, response) => {
  let message = '';
  // Get user's entered username and password
  const newUsername = request.body.username;
  const newPassword = request.body.password;
  const checkPassword = request.body.confirmPassword;
  // If the the two entered passwords match, create new user
  if (newPassword === checkPassword) {
    // Salt and hash password using bcrypt
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    // Insert new user info into database
    User.create(newUsername, hashedPassword)
      .then(() => {
        message = 'You\'ve created a new account! Please log in.';
        // // response.render('login', { message });
        response.redirect('/login');
      })
      .catch(error => {
        response.send(`Error: ${error.message}`);
      });
  } else {
    message = 'Error: passwords don\'t match, please try again.';
    // // response.render('login', { message });
    response.redirect('/');
  }
})


// LOGIN
// -----------------------------------------------------------------------
// Render a login form
app.get('/login', (request, response) => {
  response.render('login', { message: '' });
})

// Log the user in if the username and password entered in login form are correct
app.post('/login', (request, response) => {
  let message = '';
  // Get user's entered username and password
  const enteredUsername = request.body.username;
  const enteredPassword = request.body.password;
  // Salt and hash password
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
        // Render user's favorites page once logged in
        // // response.render('favorites/favorites', { message });
        response.redirect('/favorites');
        // Store the user's id for the session
        request.session.userId = Number(userInfo.id);
        // Call save() to save any changes to the session object
        request.session.save();
        return;
      }
      // If the username/password don't match, render an error
      message = 'Error: invalid login.';
      // // response.render('login', { message });
      response.redirect('/');
    })
    .catch(error => {
      response.send(`Error: ${error.message}`);
    });
});


// HOME
// -----------------------------------------------------------------------
// Display trending, popular, and airing today
// Shows' posters, titles, airdates
app.get('/', (request, response) => {
  // Fetch most popular shows
  const getPopular = fetch('https://api.themoviedb.org/3/tv/popular?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US')
    .then(popularData => popularData.json());
  // Fetch top rated shows
  const getTop = fetch('https://api.themoviedb.org/3/tv/top_rated?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US')
    .then(topData => topData.json());
  // Fetch shows airing today
  const getToday = fetch('https://api.themoviedb.org/3/tv/airing_today?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US')
    .then(airingData => airingData.json());
  // Resolve all promises
  Promise.all([getPopular, getTop, getToday])
    .then(homepageData => {
      // Render data from each fetch onto the page
      response.render('home', {
        popularData: homepageData[0],
        topData: homepageData[1],
        airingData: homepageData[2],
        message: ''
      })
    })
    .catch(error => {
      response.send(`Error: ${error.message}`);
    })
})


// SHOWS
// -----------------------------------------------------------------------
// Display all shows currently running
// Shows' posters, titles, airdates
app.get('/shows', (request, response) => {
  // Make a variable to store the current page
  // Default to 1 if not specified
  const currentPage = 1;
  // Make an API request with the current page
  fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US&page=${currentPage}`)
    .then(apiResponse => apiResponse.json())
    .then(currentData => {
      // // response.json(currentData);
      response.render('shows', { currentData, currentPage, message: '' })
    })
    .catch(error => {
      response.send(`Error: ${error.message}`);
    });
})

// Display a certain page of the current shows running
app.get('/shows/:pageNumber', (request, response) => {
  // Make a variable to store the current page
  const currentPage = request.params.pageNumber;
  // // console.log(currentPage);
  // Make an API request with the current page
  fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US&page=${currentPage}`)
  .then(apiResponse => apiResponse.json())
  .then(currentData => {
    // // response.json(currentData);
    response.render('shows', { currentData, currentPage, message: '' })
  })
  .catch(error => {
    response.send(`Error: ${error.message}`);
  });
})


// SEARCH
// -----------------------------------------------------------------------
// Make a function that takes the user's input and converts it to the right format to be inserted into API
// Take the user's input, correct the format, and store in searchQuery variable
// Replace spaces with %20 and changes to lower case
const convertInput = userInput => userInput.split(' ').join('%20').toLowerCase();

// Display search results from the user's search input
app.post('/results', (request, response) => {
  // Grab the user's input from the search bar
  const userInput = request.body.userSearch;
  // Call convertInput on the userInput
  const userSearch = convertInput(userInput);
  // // console.log(`user input: ${userInput}, user search: ${userSearch}`);
  // Make an API request with the searchQuery
  fetch(`https://api.themoviedb.org/3/search/tv?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US&query=${userSearch}`)
    .then(apiResponse => apiResponse.json())
    .then(showData => {
      // // console.log(showData);
      response.render('results', { showData, message: '' });
    })
    .catch(error => {
      response.send(`Error: ${error.message}`);
    });
})


// SHOW DETAILS
// -----------------------------------------------------------------------
// Display the details of a specific show (by id)
// Show's poster, title, description, rating, popularity, start date, status, all seasons, all episodes, where it can be watched, and similar show recommendations
// User can click to add to favorites or watchlist
app.get('/show/:id', (request, response) => {
  // Take show id from url
  const showId = Number(request.params.id);
  // Fetch show and recommendation data
  const getShow = fetch(`https://api.themoviedb.org/3/tv/${showId}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
    .then(showData => showData.json());
  // Fetch show recommendations
  const getRecs = fetch(`https://api.themoviedb.org/3/tv/${showId}/recommendations?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
    .then(recData => recData.json());
  // Resolve all promises
  Promise.all([getShow, getRecs])
    .then(showPageData => {
      // Render data from each fetch
      response.render('show', {
        showData: showPageData[0],
        recsData: showPageData[1],
        message: ''
      })
    })
    .catch(error => {
      response.send(`Error: ${error.message}`);
    })
})


// SEASON DETAILS
// -----------------------------------------------------------------------
// Display details of a specific season
// Show's season poster, show title, season title, episode numbers and titles, airdates, and episode descriptions
app.get('/show/:showId/season/:seasonNumber', (request, response) => {
  // Take show id from url
  const showId = Number(request.params.showId);
  // Take season number from url
  const seasonNumber = Number(request.params.seasonNumber);
  // Make an API request with the showId and seasonNumber
  fetch(`https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
    .then(apiResponse => apiResponse.json())
    .then(seasonData => {
      // // response.json(seasonData);
      response.render('episode', {
        seasonData,
        showId,
        message: ''
      });
    })
    .catch(error => {
      response.send(`Error: ${error.message}`);
    });
})


// FAVORITES
// -----------------------------------------------------------------------
// Prompt user to log in (if not logged in) and display the user's favorited shows
// Shows' posters, titles, airdates
// Clicking on a show in favorites would take the user to that show's detail page -> '/show/:id'
app.get('/favorites', requireLogin, (request, response) => {
  // Get the user's id that's stored in the session
  const userId = Number(request.session.userId);
  // // console.log(`user ${userId} is the current user stored in session`);
  // Get the user's favorited show ids from the database
  Favorite.find(userId)
    .then(favoritesData => {
      // // console.log('favorited shows:', favoritesData);
      response.render('favorites/favorites', { favoritesData, message: '' });
    })
    .catch(error => {
      response.send(`Error: ${error.message}`);
    });
})

// User can add/update notes on a favorite
app.put('/favorites', requireLogin, (request, response) => {
  // Get the user's id that's stored in the session
  const userId = Number(request.session.userId);
  // // console.log(`user ${userId} is the current user stored in session`);
  // Get the clicked button's hidden value attributes containing the show's id and notes
  const showId = Number(request.body.favoritesId);
  const notesContent = request.body.notes;
  // Take the userId and showId to locate the row in the table, and update with notesContent
  Favorite.editNotes(notesContent, userId, showId)
    .then(() => {
      // Redirect user to that updated show's spot on the favorites page
      response.redirect(`/favorites#${showId}`);
    })
  // // console.log(`you just updated ${showId}\'s notes with ${notesContent}`);
})


// ADDING TO FAVORITES
// -----------------------------------------------------------------------
// From home page, take any show added with the "add to favorites" button and insert into the user's user_favorites table
app.post('/', requireLogin, (request, response) => {
  let message = '';
  // Get the user's id that's stored in the session
  const userId = Number(request.session.userId);
  // // console.log(`user ${userId} is the current user stored in session`);
  // Get the clicked button's hidden value attributes containing the show's info and store it in a variable
  const addedShowId = Number(request.body.showId);
  const addedShowTitle = request.body.showTitle;
  const addedShowImg = request.body.showImg;
  // Take the new info and insert into database
  // If the show is already in the user's favorites, don't insert (in Favorites.js added WHERE NOT EXISTS, but not sure if that's the best way)
  // Maybe add a message if unable to insert because already added?
  Favorite.add(userId, addedShowId, addedShowTitle, addedShowImg)
    .then(() => {
      message = `You just added ${addedShowTitle} to your favorites!`;
      // Once inserted, redirect user to that specific show's spot on the home page so they can pick up where they left off
      response.redirect(`/#${addedShowId}`);
    })
    .catch(error => {
      response.send(`Error: ${error.message}`);
    });
  // // console.log(`you just added ${addedShowTitle} to your favorites!`);
})

// From shows page, take any show added with the "add to favorites" button and insert into the user's user_favorites table
app.post('/shows', requireLogin, (request, response) => {
  // Same as above, but redirecting to different location
  const userId = Number(request.session.userId);
  // // console.log(`user ${userId} is the current user stored in session`);
  const addedShowId = Number(request.body.showId);
  const addedShowTitle = request.body.showTitle;
  const addedShowImg = request.body.showImg;
  Favorite.add(userId, addedShowId, addedShowTitle, addedShowImg)
    .then(() => {
      // Once inserted, redirect user to that specific show's spot on the shows page so they can pick up where they left off
      response.redirect(`/shows#${addedShowId}`);
    })
    .catch(error => {
      response.send(`Error: ${error.message}`);
    });
  // // console.log(`you just added ${addedShowTitle} to your favorites!`);
})

// From a show's detail page or from search results, take added show and insert into the user's user_favorites table
app.post('/show/:id', requireLogin, (request, response) => {
  // Same as above, but redirecting to different location
  const userId = Number(request.session.userId);
  // // console.log(`user ${userId} is the current user stored in session`);
  const addedShowId = Number(request.body.showId);
  const addedShowTitle = request.body.showTitle;
  const addedShowImg = request.body.showImg;
  Favorite.add(userId, addedShowId, addedShowTitle, addedShowImg)
    .then(() => {
      // Redirect user to that added show on their favorites page
      response.redirect(`/favorites#${addedShowId}`);
    })
    .catch(error => {
      response.send(`Error: ${error.message}`);
    });
  console.log(`you just added ${addedShowTitle} to your favorites!`);
})


// REMOVING FROM FAVORITES
// -----------------------------------------------------------------------
// From the favorites page, remove show and delete from the user_favorites table
app.delete('/favorites', requireLogin, (request, response) => {
  // Get the user's id that's stored in the session
  const userId = Number(request.session.userId);
  // // console.log(`user ${userId} is the current user stored in session`);
  // Get the clicked button's value attribute containing the show's id and store it in a variable
  const removedShowId = Number(request.body.showId);
  // Take the removedShowId and delete that row from database
  Favorite.remove(userId, removedShowId)
    .then(() => {
      // Once deleted, redirect user to their favorites page
      response.redirect('/favorites');
    })
    .catch(error => {
      response.send(`Error: ${error.message}`);
    });
  // // console.log(`you just removed show ${removedShowId} from your favorites!`);
})


// Didn't get to any of this stuff -- Post MVP
// WATCHLIST
// -----------------------------------------------------------------------
// Prompt user to log in (if not already logged in) and display the user's watchlist with a "to watch" and "caught up" section
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

// Prompts user to log in (if not logged in) and display the shows from the user's watchlist that are currently on air in a week format
app.get('/watchlist/week', requireLogin, (request, response) => {

  response.render('watchlist/week');
})


// Start server
// -----------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`server is listening on PORT ${PORT}!`);
});
