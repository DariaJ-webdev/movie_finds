// OMDb API Configuration
const API_KEY = "f58252f"; 
const BASE_URL = "https://www.omdbapi.com/";

// Placeholder image because they charge for posters
const UNDRAW_MOVIE_WATCHING_IMAGE = "./undraw_movie.svg"; //


// 1. Grabbing the DOM elements
const movieSearchInput = document.getElementById("movie-search-input"); 
const searchButton = document.getElementById("search-button"); 
const resetButton = document.getElementById("reset-button"); 
const movieCardsWrapper = document.getElementById("movie-cards-wrapper"); 

// 2. Fetch movie data
async function fetchMovieData(searchTerm) {
    // 3. Capture the user's input (and check if empty)
    if (!searchTerm.trim()) {
        movieCardsWrapper.innerHTML = `<p class="initial-message">Please enter a movie title to search.</p>`;
        return; // Exit if input is empty
    }

    // Clear previous results and show a loading message
    movieCardsWrapper.innerHTML = `<p class="initial-message">Loading movies for "${searchTerm}"...</p>`;

    // 4. Fetch data using API call
    // Construct the URL using the standard format: ?s=TERM&apikey=KEY
    const url = `${BASE_URL}?s=${encodeURIComponent(searchTerm.trim())}&apikey=${API_KEY}`; //
    console.log("Fetching from URL:", url); 

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText || 'Unknown Error'}`);
        }
        const data = await response.json();
        console.log("API Response:", data); 

        if (data.Response === "True") {
            displayMovieResults(data.Search);
        } else {
            // Error handling for API response - use UNDRAW_MOVIE_WATCHING_IMAGE directly here
            movieCardsWrapper.innerHTML = `
                <p class="initial-message">No results found for "${searchTerm}". Please try a different title.</p>
                <img src="${UNDRAW_MOVIE_WATCHING_IMAGE}" alt="People watching movies" class="movie-card-image">
            `;
        }
    } catch (error) {
        console.error("Error fetching movie data:", error);
        // Error handling for fetch issues - use UNDRAW_MOVIE_WATCHING_IMAGE directly here again because why not
        movieCardsWrapper.innerHTML = `
            <p class="initial-message">An error occurred while fetching movie data: ${error.message}. Please try again later.</p>
            <img src="${UNDRAW_MOVIE_WATCHING_IMAGE}" alt="People watching movies" class="movie-card-image">
        `;
    }
}

// Function to display movie results
function displayMovieResults(movies) {
    movieCardsWrapper.innerHTML = ''; //reset

    if (movies && movies.length > 0) {
        // Limit the results to the first 6 movies - moved outside forEach loop
        const limitedMovies = movies.slice(0, 6); 

        limitedMovies.forEach(movie => { // Iterate over limitedMovies
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card'); 
            
            const displayImage = UNDRAW_MOVIE_WATCHING_IMAGE; 
            
            movieCard.innerHTML = `
                <img src="${displayImage}" alt="${movie.Title} Movie Image" class="movie-card-image"> 
                <div class="movie-card-info">
                    <h3>${movie.Title}</h3>
                    <p>Year: ${movie.Year}</p>
                    </div>
            `;
            movieCardsWrapper.appendChild(movieCard); //
        });
    } else {
       
        movieCardsWrapper.innerHTML = `
            <p class="initial-message">No movies found. Try a different search term.</p>
            <img src="${UNDRAW_MOVIE_WATCHING_IMAGE}" alt="People watching movies" class="movie-card-image">
        `;
    }
}

function resetSearch() { 
    movieSearchInput.value = ''; 
    movieCardsWrapper.innerHTML = `<p class="initial-message">Search for a movie to see results!</p>`; // Reset content
}

// 5. Listen for user interaction...Event listener for the search button click
searchButton.addEventListener("click", () => {
    const searchTerm = movieSearchInput.value;
    fetchMovieData(searchTerm);
});

// Event listener for pressing Enter in the input field
movieSearchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); 
        const searchTerm = movieSearchInput.value;
        fetchMovieData(searchTerm);
    }
});

resetButton.addEventListener("click", resetSearch)

document.addEventListener('DOMContentLoaded', () => {
    movieCardsWrapper.innerHTML = `<p class="initial-message">Search for a movie to see results!</p>`;
});
