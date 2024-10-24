const searchForm = document.querySelector(".search-box");
const searchInput = document.querySelector(".search-txt");

//fetch(url): 위에서 생성한 URL을 사용하여 API를 호출해서
function searchMovies(query) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&language=ko-KR`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      //검색을했을때, 검색 결과가 있으면
      if (data.results.length > 0) {
        //영화를 화면에 표시했고,
        allMovies = data.results;
        displayMovies(allMovies);
      } else {
        //검색 결과가 없을 경우, 사용자에게 "검색 결과가 없어요 ㅠㅠ"라는 메시지를 보여주게 했다.
        movieContainer.innerHTML = "<p>검색 결과가 없어요 ㅠㅠ</p>";
      }
    })
    .catch((error) => {
      console.log("에러 발생:", error);
      movieContainer.innerHTML =
        "<p>에러가 발생했습니다. 다시 시도해 주세요!</p>";
    });
}

// 검색 입력 실시간으로 (감격)
searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    searchMovies(searchTerm);
  } else {
    // 검색어가 비어있으면 돌아가기
    getMovieData();
  }
});
