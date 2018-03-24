console.log('main.js is connected!');

// // Make a variable to store the user's input
// let searchQuery = '';
//
// // Make a variable to store the show id
// let showId = 1100;
// // let episodeId = 1;
//
// // Just hard coding a show name for now! One with lots of spaces to make sure the format is converted correctly
// const userInput = 'How I Met Your Mother';


// // Make a function that grabs the user's input, corrects the format, and stores it in the searchQuery variable
// const getSearchQuery = () => {
//   // Select the user's search input
//   // let userInput = document.querySelector('');
//   // Replace spaces with % and changes to lower case
//   searchQuery = userInput.split(' ').join('%20').toLowerCase();
//   console.log(searchQuery);
// };
// getSearchQuery();


// // Make a function that creates an API request and returns a response in JSON
// const getJSON = url => fetch(url).then(response => response.json());


// // TMDB API
// // Get tv show's id by keyword
// const getShowId = searchQuery => {
//   // Make an API request with the user's inputted keywords
//   getJSON(
//     `https://api.themoviedb.org/3/search/tv?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US&query=${searchQuery}`
//   ).then(showData => {
//     // Assign the found show id to the showId variable
//     showId = showData.results[0].id;
//     console.log('show id:', showId);
//   });
// };
// getShowId(searchQuery);


// // Get tv show details by show id
// const getShowInfo = showId => {
//   // Make an API request with the found show id
//   getJSON(
//     `https://api.themoviedb.org/3/tv/${showId}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
//   ).then(showData => {
//     // Make a variable for the show title, show genre, show status, official site, show image, show desc, show rating, number of episodes, number of seasons
//     // Asign a JSON value to each variable
//     const showTitle = showData.name;
//     const dates = showData.first_air_date.split('-');
//     const showAirdate = `${dates[1]}/${dates[2]}/${dates[0]}`;
//     const showDesc = showData.overview;
//     const showGenre = showData.genres[0].name;
//     const numberOfSeasons = showData.number_of_seasons;
//     const numberOfEpisodes = showData.number_of_episodes;
//     const showRating = showData.vote_average;
//     const showPopularity = showData.popularity;
//     const showStatus = showData.status;
//     const showSite = showData.homepage;
//     const showImg = showData.poster_path;
//     console.log('show title:', showTitle);
//     console.log('airdate:', showAirdate);
//     console.log('show desc:', showDesc);
//     console.log('show genre:', showGenre);
//     console.log('seasons:', numberOfSeasons);
//     console.log('episodes:', numberOfEpisodes);
//     console.log('show rating:', showRating);
//     console.log('show popularity:', showPopularity);
//     console.log('show status:', showStatus);
//     console.log('show url:', showSite);
//     console.log('show img:', showImg);
//     console.log('-------------------------------');
//     for (let i = 0; i < showData.seasons.length; i++) {
//       const seasonNumber = showData.seasons[i].season_number;
//       const seasonTitle = showData.seasons[i].name;
//       const dates = showData.seasons[i].air_date.split('-');
//       const seasonAirdate = `${dates[1]}/${dates[2]}/${dates[0]}`;
//       const episodeCount = showData.seasons[i].episode_count;
//       const seasonImg = showData.seasons[i].poster_path;
//       const seasonLink = `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`;
//       console.log('season title:', seasonTitle);
//       console.log('season aired:', seasonAirdate);
//       console.log('episode count:', episodeCount);
//       console.log('season img:', seasonImg);
//       console.log('season link:', seasonLink);
//       console.log('-------------------------------');
//     }
//   });
// };
// getShowInfo(showId);


// // Get all episodes from a season with show id and season number
// const getSeason = (showId, seasonNumber) => {
//   // Make an API request with the show id and season number
//   getJSON(
//     `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
//   ).then(seasonData => {
//     // Make a variable for all the episodes (get access to episode airdate, episode number, episode title, episode description, season number)
//     for (let i = 0; i < seasonData.episodes.length; i++) {
//       const episodeTitle = seasonData.episodes[i].name;
//       const episodeDesc = seasonData.episodes[i].overview;
//       const dates = seasonData.episodes[i].air_date.split('-');
//       const episodeAirdate = `${dates[1]}/${dates[2]}/${dates[0]}`;
//       const seasonNumber = seasonData.episodes[i].season_number;
//       const episodeNumber = seasonData.episodes[i].episode_number;
//       console.log('episode title:', episodeTitle);
//       console.log('episode desc:', episodeDesc);
//       console.log('episode aired:', episodeAirdate);
//       console.log('season:', seasonNumber);
//       console.log('episode:', episodeNumber);
//       console.log('-------------------------------');
//     }
//   });
// };
// getSeason(showId, 3);


// Get show recommendations by ID
const getRecs = showId => {
  // Make an API request with a show id
  getJSON(
    `https://api.themoviedb.org/3/tv/${showId}/recommendations?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
  ).then(recsData => {
    for (let i = 0; i < recsData.results.length; i++) {
      const recId = recsData.results[i].id;
      const recTitle = recsData.results[i].name;
      const recDesc = recsData.results[i].overview;
      const rating = recsData.results[i].vote_average;
      const recImg = recsData.results[i].poster_path;
      const recLink = `https://api.themoviedb.org/3/tv/${recId}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`;
      console.log('rec title:', recTitle);
      console.log('rec desc:', recDesc);
      console.log('rec rating:', rating);
      console.log('rec img:', recImg);
      console.log('rec link:', recLink);
      console.log('-------------------------------');
    }
  });
};
getRecs(showId);


// Get most popular shows
const getPopular = () => {
  // Make API request
  getJSON(
    `https://api.themoviedb.org/3/tv/popular?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
  ).then(popularData => {
    for (let i = 0; i < popularData.results.length; i++) {
      const popId = popularData.results[i].id;
      const popTitle = popularData.results[i].name;
      const popDesc = popularData.results[i].overview;
      const rating = popularData.results[i].vote_average;
      const popularity = popularData.results[i].popularity;
      const popImg = popularData.results[i].poster_path;
      const popLink = `https://api.themoviedb.org/3/tv/${popId}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`;
      console.log('pop title:', popTitle);
      console.log('pop desc:', popDesc);
      console.log('rating:', rating);
      console.log('popularity:', popularity);
      console.log('pop img:', popImg);
      console.log('pop link:', popLink);
      console.log('-------------------------------');
    }
  });
};
getPopular();


// Get top rated shows
const getTopRated = () => {
  // Make API request
  getJSON(
    `https://api.themoviedb.org/3/tv/top_rated?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
  ).then(topRatedData => {
    for (let i = 0; i < topRatedData.results.length; i++) {
      const topId = topRatedData.results[i].id;
      const topTitle = topRatedData.results[i].name;
      const topDesc = topRatedData.results[i].overview;
      const rating = topRatedData.results[i].vote_average;
      const popularity = topRatedData.results[i].popularity;
      const topImg = topRatedData.results[i].poster_path;
      const topLink = `https://api.themoviedb.org/3/tv/${topId}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`;
      console.log('top title:', topTitle);
      console.log('top desc:', topDesc);
      console.log('rating:', rating);
      console.log('popularity:', popularity);
      console.log('top img:', topImg);
      console.log('top link:', topLink);
      console.log('-------------------------------');
    }
  });
};
getTopRated();


// Get shows airing today
const getAiring = () => {
  // Make API request
  getJSON(
    `https://api.themoviedb.org/3/tv/airing_today?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`
  ).then(airingData => {
    for (let i = 0; i < airingData.results.length; i++) {
      const airingId = airingData.results[i].id;
      const airingTitle = airingData.results[i].name;
      const airingDesc = airingData.results[i].overview;
      const rating = airingData.results[i].vote_average;
      const popularity = airingData.results[i].popularity;
      const airingImg = airingData.results[i].poster_path;
      const airingLink = `https://api.themoviedb.org/3/tv/${airingId}?api_key=085991675705d18c9d1f19c89cae4e50&language=en-US`;
      console.log('airing title:', airingTitle);
      console.log('airing desc:', airingDesc);
      console.log('rating:', rating);
      console.log('popularity:', popularity);
      console.log('airing img:', airingImg);
      console.log('airing link:', airingLink);
      console.log('-------------------------------');
    }
  });
};
getAiring();
