console.log('main.js is connected!');


// Make a variable to store the user's input
let searchQuery = '';

let userInput = 'This Is Us';

// Make a function that grabs the user's input, corrects the format, and stores it in the searchQuery variable
const getSearchQuery = () => {
  // Select the user's search input
  // let userInput = document.querySelector('');
  // Replace spaces with %
  searchQuery = userInput.replace(' ', '%');
  console.log(searchQuery);
}
getSearchQuery();


// Make a function that creates an API request and returns a response in JSON
const getJSON = (url) => {
  return fetch(url).then(response => response.json());
}


// Make a variable for the show id, name, genre, status, official site, schedule, rating, image, summary
let showId, showName, showGenre, showStatus, showSite, showDay, showTime, showRating, showImg, showDesc;

// TV MAZE API
// Get tv show by keyword
const getShow = (searchQuery) => {
  // Make an API request with the user's inputted keywords
  getJSON(`http://api.tvmaze.com/singlesearch/shows?q=${searchQuery}`)
  .then(json => {
    console.log(json);
    // Asign a JSON value to each variable
    showId = json.id;
    showName = json.name;
    showGenre = json.genres;
    showStatus = json.status;
    showSite = json.url;
    showDay = json.schedule.days;
    showTime = json.schedule.time;
    showRating = json.rating.average;
    showImg = json.image.original;
    showDesc = json.summary;
    console.log('id:', showId);
    console.log('name:', showName);
    console.log('genre:', showGenre); console.log('status:', showStatus);
    console.log('url:', showSite);
    console.log('day:', showDay);
    console.log('time:', showTime);
    console.log('rating:', showRating);
    console.log('img:', showImg);
    console.log('desc:', showDesc);
  })
}
getShow(searchQuery);


// Get tv show episodes by show id
// name, season, episode, airdate, summary, count total to get number of episodes
const getEpisode = (showId) => {
  // Make an API request with show's id
  getJSON(`http://api.tvmaze.com/shows/${showId}/episodes`)
  .then(json => {
    console.log(json);
  })
}
getEpisode(showId);

// Get tv show seasons by show id `http://api.tvmaze.com/shows/${showId}/seasons`
// count total to get number of seasons or season number


// TMDB API
// Get show content rating by ID `https://api.themoviedb.org/3/tv/${showId}/content_ratings?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`

// Get show recommendations by ID `https://api.themoviedb.org/3/tv/${showId}/recommendations?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`

// Get most popular shows `https://api.themoviedb.org/3/tv/popular?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`

// Get top rated shows `https://api.themoviedb.org/3/tv/top_rated?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`

// Get shows airing today `https://api.themoviedb.org/3/tv/airing_today?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
