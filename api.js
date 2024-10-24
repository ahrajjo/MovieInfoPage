const TMDB_API_KEY = "1a301a22645f05bf2de9f28d42f878c8";
const movieContainer = document.getElementById("movie-container");

let allMovies = [];

async function getMovieData() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=ko-KR&page=1`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });
    const data = await response.json();
    allMovies = data.results;
    displayMovies(allMovies);
    return data;
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
}
function displayMovies(movies) {
  movieContainer.innerHTML = "";
  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");
    movieElement.setAttribute("data-movie-id", movie.id);
    movieElement.innerHTML = `
            <div id="card">
                <img src="https://image.tmdb.org/t/p/w500${
                  movie.poster_path
                }" alt="${movie.title}" class="movie-poster">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-rating">⭐  ${parseInt(movie.vote_average).toFixed(
                  1
                )} / 10</p>
            </div>
        `;
    movieContainer.appendChild(movieElement);
  });
}

getMovieData();

movieContainer.addEventListener("click", (e) => {
  const clickedCard = e.target.closest(".movie");
  if (clickedCard) {
    const clickedMovieId = parseInt(clickedCard.getAttribute("data-movie-id"));
    const selectedMovie = allMovies.find(
      (movie) => movie.id === clickedMovieId
    );
    if (selectedMovie) {
      openModal(selectedMovie);
      modal.style.display = "block";
    }
  }
});
