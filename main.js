console.log('main.js is connected!');


// Make a variable to store the user's input
let searchQuery = '';

// Make a variable to store the show id and episode id
let showId = 1;
let episodeId = 1;

// Just hard coding a show name for now! One with lots of spaces to make sure the format is converted correctly
let userInput = 'How I Met Your Mother';


// Make a function that grabs the user's input, corrects the format, and stores it in the searchQuery variable
const getSearchQuery = () => {
  // Select the user's search input
  // let userInput = document.querySelector('');
  // Replace spaces with % and changes to lower case
  searchQuery = userInput.split(' ').join('%').toLowerCase();
  console.log(searchQuery);
}
getSearchQuery();


// Make a function that creates an API request and returns a response in JSON
const getJSON = url => {
  return fetch(url).then(response => response.json());
}


// Make a function that converts 24 hour time to 12 hour
// I found this function on stackoverflow: https://stackoverflow.com/questions/13898423/javascript-convert-24-hour-time-of-day-string-to-12-hour-time-with-am-pm-and-no
const timeTo12Hr = time => {
  // Check correct time format and split into components
  time = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  // If time format correct
  if (time.length > 1) {
    // Remove full string match value
    time = time.slice (1);
    // Set AM or PM
    time[5] = +time[0] < 12 ? 'AM' : 'PM';
    // Adjust hours
    time[0] = +time[0] % 12 || 12;
  }
  // Return adjusted time or original string
  return time.join ('');
}


// TV MAZE API
// Get tv show by keyword
const getShow = (searchQuery) => {
  // Make an API request with the user's inputted keywords
  getJSON(`http://api.tvmaze.com/singlesearch/shows?q=${searchQuery}`)
  .then(json => {
    showId = json.id;
    // Make a variable for the show name, genre, status, official site, schedule (day + time), rating, image, and summary
    // Asign a JSON value to each variable
    let showName = json.name;
    let showGenre = json.genres;
    let showStatus = json.status;
    let showSite = json.url;
    let showDay = json.schedule.days;
    let showTime = timeTo12Hr(json.schedule.time);
    let showRating = json.rating.average;
    let showImg = json.image.original;
    let showDesc = json.summary;
    console.log('show id:', showId);
    console.log('show name:', showName);
    console.log('show genre:', showGenre); console.log('status:', showStatus);
    console.log('show url:', showSite);
    console.log('show day:', showDay);
    console.log('show time:', showTime);
    console.log('show rating:', showRating);
    console.log('show img:', showImg);
    console.log('show desc:', showDesc);
  })
}
getShow(searchQuery);


// Get a tv show's episodes by show id
const getEpisodes = (showId) => {
  console.log('inside of getEpisodes showId:', showId);
  // Make an API request with show id
  getJSON(`http://api.tvmaze.com/shows/${showId}/episodes`)
  .then(json => {
    episodeId = json[0].id;
    // Make a variable for the total number of episodes
    let totalEpisodeCount = json.length;
    console.log('first episode id:', episodeId);
    console.log('episode count:', totalEpisodeCount);
  })
}
getEpisodes(showId);


// Get a specific tv show episode by episode id
const getEpisode = episodeId => {
  // Make an API request with the episode id
  getJSON(`http://api.tvmaze.com/episodes/${episodeId}`)
  .then(json => {
    // Make a variable for episodeName, episodeNumber, seasonNumber, episodeAirdate, episodeDesc
    let episodeName = json.name;
    let episodeNumber = json.number;
    let seasonNumber = json.season;
    let episodeAirdate = json.airdate;
    let episodeDesc = json.summary;
    console.log('episode name:', episodeName);
    console.log('episode number: ', episodeNumber);
    console.log('episode season:', seasonNumber);
    console.log('episode airdate:', episodeAirdate);
    console.log('episode desc:', episodeDesc);
  })
}
getEpisode(episodeId);


// Get tv show's seasons by show id
// count total to get number of seasons or season number
const getSeasons = showId => {
  getJSON(`http://api.tvmaze.com/shows/${showId}/seasons`)
  .then(json => {
    // Make a variable for the number of seasons, and number of number of episodes in a season
    let seasonCount = json.length;
    // For only the first season...
    let seasonEpisodeCount = json[0].episodeOrder;
    console.log('season count:', seasonCount);
    console.log('episodes in a season:', seasonEpisodeCount);
  })
}
getSeasons(showId);


// TMDB API
// Get show content rating by ID `https://api.themoviedb.org/3/tv/${showId}/content_ratings?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
const getShowRating = () => {

}
getShowRating();


// Get show recommendations by ID `https://api.themoviedb.org/3/tv/${showId}/recommendations?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
const getRecommendations = () => {

}
getRecommendations();


// Get most popular shows `https://api.themoviedb.org/3/tv/popular?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
const getPopular = () => {

}
getPopular();


// Get top rated shows `https://api.themoviedb.org/3/tv/top_rated?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
const getTopRated = () => {

}
getTopRated();


// Get shows airing today `https://api.themoviedb.org/3/tv/airing_today?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
const getAiring = () => {

}
getAiring();
