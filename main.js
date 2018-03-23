console.log('main.js is connected!');


// Make a variable to store the user's input
let searchQuery = '';

// Make a variable to store the show id and episode id
let showId = 1100;
// let episodeId = 1;

// Just hard coding a show name for now! One with lots of spaces to make sure the format is converted correctly
const userInput = 'How I Met Your Mother';


// Make a function that grabs the user's input, corrects the format, and stores it in the searchQuery variable
const getSearchQuery = () => {
  // Select the user's search input
  // let userInput = document.querySelector('');
  // Replace spaces with % and changes to lower case
  searchQuery = userInput.split(' ').join('%20').toLowerCase();
  console.log(searchQuery);
}
getSearchQuery();


// Make a function that creates an API request and returns a response in JSON
const getJSON = url => fetch(url).then(response => response.json())


// TMDB API
// Get tv show's id by keyword
const getShow = (searchQuery) => {
  // Make an API request with the user's inputted keywords
  getJSON(`https://api.themoviedb.org/3/search/tv?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US&query=${searchQuery}`)
  .then(json => {
    // Assign the found show id to the showId variable
    showId = json.results[0].id;
    console.log('show id:', showId);
  })
}
getShow(searchQuery);


// Get tv show details by show id
const getShowInfo = (showId) => {
  // Make an API request with the found show id
  getJSON(`https://api.themoviedb.org/3/tv/${showId}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
  .then(json => {
    // Make a variable for the show title, show genre, show status, official site, show image, show desc, show rating, number of episodes, number of seasons
    // Asign a JSON value to each variable
    const showTitle = json.name;
    const showGenre = json.genres[0].name;
    const showStatus = json.status;
    const showSite = json.homepage;
    const showImg = json.backdrop_path;
    const showDesc = json.overview;
    const showRating = json.vote_average;
    const numberOfEpisodes = json.number_of_episodes;
    const numberOfSeasons = json.number_of_seasons;
    console.log('show name:', showTitle);
    console.log('show genre:', showGenre);
    console.log('show status:', showStatus);
    console.log('show url:', showSite);
    console.log('show img:', showImg);
    console.log('show desc:', showDesc);
    console.log('show rating:', showRating);
    console.log('episodes:', numberOfEpisodes);
    console.log('seasons:', numberOfSeasons);
  })
}
getShowInfo(showId);


// Get all episodes from a season with show id and season number
const getSeason = (showId, seasonNumber) => {
  // Make an API request with the show id and season number
  getJSON(`https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`)
  .then(json => {
    // Make a variable for all the episodes (get access to episode airdate, episode number, episode title, episode description, season number)
    for (let i = 0; i < json.episodes.length; i++) {
      const dates = json.episodes[i].air_date.split('-');
      const episodeAirdate = `${dates[1]}/${dates[2]}/${dates[0]}`;
      const episodeNumber = json.episodes[i].episode_number;
      const episodeTitle = json.episodes[i].name;
      const episodeDesc = json.episodes[i].overview;
      const seasonNumber = json.episodes[i].season_number;
      console.log('episode aired:', episodeAirdate);
      console.log('episode:', episodeNumber);
      console.log('episode title:', episodeTitle);
      console.log('episode desc:', episodeDesc);
      console.log('season:', seasonNumber);
    }
  })
}
getSeason(showId, 6)


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
