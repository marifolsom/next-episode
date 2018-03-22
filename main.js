console.log('main.js is connected!');


// Make a variable to store the user's input
let searchQuery = '';

// Just hard coding a show name for now! One with lots of spaces to make sure the format is converted correctly
let userInput = 'How I Met Your Mother';

// Make a function that grabs the user's input, corrects the format, and stores it in the searchQuery variable
const getSearchQuery = () => {
  // Select the user's search input
  // let userInput = document.querySelector('');
  // Replace spaces with %
  searchQuery = userInput.split(' ').join('%');
  console.log(searchQuery);
}
getSearchQuery();


// Make a function that creates an API request and returns a response in JSON
const getJSON = url => {
  return fetch(url).then(response => response.json());
}


// Make a function that converts 24 hour time to 12 hour
const convertTime = () => {

}


// Make a variable for the show id, name, genre, status, official site, schedule, rating, image, summary
let showId, showName, showGenre, showStatus, showSite, showDay, showTime, showRating, showImg, showDesc;

// TV MAZE API
// Get tv show by keyword
const getShow = (searchQuery) => {
  // Make an API request with the user's inputted keywords
  getJSON(`http://api.tvmaze.com/singlesearch/shows?q=${searchQuery}`)
  .then(json => {
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


// Make a variable for the episode name, season, episode number, airdate, summary, count total number of episodes
let totalEpisodeCount, episodeId;

// Get a tv show's episodes by show id
const getEpisodes = showId => {
  // Make an API request with show id
  getJSON(`http://api.tvmaze.com/shows/${showId}/episodes`)
  .then(json => {
    totalEpisodeCount = json.length;
    console.log('episode count:', totalEpisodeCount);
  })
}
getEpisodes(171);


// Make a variable for episodeName, episodeNumber, seasonNumber, episodeAirdate, episodeDesc
let episodeName, episodeNumber, seasonNumber, episodeAirdate, episodeDesc;

// Get a specific tv show episode by episode id
const getEpisode = episodeId => {
  // Make an API request with the episode id
  getJSON(`http://api.tvmaze.com/episodes/${episodeId}`)
  .then(json => {
    episodeName = json.name;
    episodeNumber = json.number;
    seasonNumber = json.season;
    episodeAirdate = json.airdate;
    episodeDesc = json.summary;
    console.log('episode name:', episodeName);
    console.log('episode number: ', episodeNumber);
    console.log('episode season:', seasonNumber);
    console.log('episode airdate:', episodeAirdate);
    console.log('episode desc:', episodeDesc);
  })
}
getEpisode(12485);


// Make a variable for the number of seasons, and number of number of episodes in a season;
let seasonCount, seasonEpisodeCount;

// Get tv show's seasons by show id
// count total to get number of seasons or season number
const getSeasons = showId => {
  getJSON(`http://api.tvmaze.com/shows/${showId}/seasons`)
  .then(json => {
    seasonCount = json.length;
    // For only the first season...
    seasonEpisodeCount = json[0].episodeOrder;
    console.log('season count:', seasonCount);
    console.log('episodes in a season:', seasonEpisodeCount);
  })
}
getSeasons(171)


// TMDB API
// Get show content rating by ID `https://api.themoviedb.org/3/tv/${showId}/content_ratings?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`

// Get show recommendations by ID `https://api.themoviedb.org/3/tv/${showId}/recommendations?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`

// Get most popular shows `https://api.themoviedb.org/3/tv/popular?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`

// Get top rated shows `https://api.themoviedb.org/3/tv/top_rated?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`

// Get shows airing today `https://api.themoviedb.org/3/tv/airing_today?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
