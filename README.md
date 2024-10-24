# MovieInfoPage

>드디어 첫번째 과제를 받게 되었다. 세계적인 영화 데이터베이스인 TMDB의 API를 사용해서, 진짜 영화 검색 사이트를 만들어보는 것!대대표적으로 구현되어야 할 기능은 검색, 모달, 북마크 기능이었다. 

이번 프로젝트의 목표는

- **진짜 영화 정보**를 제공하는 검색 사이트 만들기
- **HTML**, **CSS**, **JavaScript**만으로 API와 소통하며 웹 애플리케이션 만들기
- 영화 팬들을 위한 **멋진 UI**로, 데이터를 시각적으로 표현하기
- 🦸‍♂️ API 마스터: 개발자가 되는 첫 걸음으로 실시간 데이터를 사용하는 법 익히기!

일단 나는 [집중반]이었기때문에 북마크를 구현하지 않아도 됐지만, 
시도는 해본 좋은 프로젝트 였다. 일단 진행과정을 보여주자면

## Day 1: TMDB API 연동 및 데이터 가져오기

```javascript
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
```
일단 TMDB의 API를 가져오는게 우선이었는데 
나는 API를 처음 가져와보는 입장이라 모든게 검색 검색이었다!
회원 가입을 하고, 사이트에서 오픈 API key를 받아왔다.

가장 먼저 `async`를 사용해서 함수가 비동기적으로 동작하게 만들어줬다. 그렇게 되면 API 호출과 같은 시간이 걸리는 작업을 처리할 수 있다. 그리고 TMDB API의 엔드포인트 URL을 설정을 해주고 언어는 한국어, 첫번째 페이지 결과를 요청했다.`fetch`를 사용하여 API에 `GET 요청`을 보냅니다 인증을 위한 헤더를 포함시킨다. `await`는 응답을 받을 때까지 기다린다.응답을 `JSON` 형태로 변환하고 ! 결과를 allMovies 배열로 저장했다.`displayMovies` 함수를 호출하여 영화 목록을 화면에 표시했다. 그리고 `catch`로 API 호출 중 발생할 수 있는 오류를 처리했다.

## Day 2: 영화 카드 리스트 UI 구현

```javascript
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
```
그리고 영화들을 화면에 보여주는 함수를 만들었다. 일단 걷기반에서 배운대로 ` movieContainer.innerHTML = "";`빈 html을 주고(데이터가 중복 표시되는걸 막기위해!) 배열의 각 영화 객체에 반복 작업을 `forEach`로 주었다.`const movieElement = document.createElement("div");`로 각 영화를 위한 새로운 div를 생성한다. "movie"클래슬르 추가하고 영화의 고유 ID를 데이터 속성에 저장했다. 그리고 영화 카드의 구조는 영화 이미지, 영화 제목, 영화 평점이 나타날 수 있게 했다. 여기에서 평점이 소수점 4자리까지 나오는 구조여서 `toFixed(1)`로 한자리수만 나오게 만들어 주었다. 이제 이 만든 영화 카드들을 `movieContainer.appendChild(movieElement);` 추가해주고 함수를 호출해준다.

```javascript
┌─────────┐
│    [포스터]    │
│               │
│   영화 제목    │
│   ⭐ 평점/10  │
└─────────┘
```
이런 구조의 영화 카드가 만들어진다 !!!! 😂

## Day 3: 영화 검색 기능 구현

검색 기능 구현의 조건이 있었다 바로 아래처럼 !
- 검색창을 만들고, 사용자가 입력한 키워드에 맞춰 **영화 리스트를 필터링**하세요.
- **검색 버튼을 클릭**하거나 **Enter 키를 입력**하면 해당 키워드를 포함한 영화들만 리스트에 나타나게 합니다.
- 혹은, 검색창에 입력에 따라 실시간으로 영화 검색이 되도록 구현해주셔도 괜찮습니다.
- **중요 포인트**: 영문으로 진행 할 경우, 대소문자 구분 없이 검색할 수 있게 하세요.

```javascript
// 검색 폼과 검색 입력창 요소를 가져와주고,
const searchForm = document.querySelector(".search-box");
const searchInput = document.querySelector(".search-txt");

//검색 함수를 정의해주고 API 호출을 한다 -> 그 결과 처리는 이렇게
fetch(url)
  .then((response) => response.json())
  .then((data) => {
  
  //검색 결과의 조건은
  if (data.results.length > 0) {
  allMovies = data.results;
  displayMovies(allMovies);
} else {
  movieContainer.innerHTML = "<p>검색 결과가 없어요 ㅠㅠ</p>";
}
  
  //에러는 마찬가치로 catch !
  .catch((error) => {
  console.log("에러 발생:", error);
  movieContainer.innerHTML = "<p>에러가 발생했습니다. 다시 시도해 주세요!</p>";
});
  ```
  
 검색 결과가 있으면 `allMovies` 배열에 저장하고 `displayMovies` 함수를 호출해서 화면에 표시한다. 없다면 화면에 검색 결과가 없어요 ㅠㅠ
 
 여기까지는 그냥 저냥 괜찮았다. 그런데 실시간으로 영화 검색이 구현되게 만들고 싶었다
 마치 ㅇ 하나치면 ㅇ이들어간 영화들이 밑에 따라오는 (>) 
 
 여기서부터 악몽의 시작이었지.............😥
 ```javascript
 searchInput.addEventListener("input", function() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    searchMovies(searchTerm);
  } else {
    getMovieData();
  }
});
```
이벤트 리스너를 `input`으로 주어서 실시간으로 입력창의 값이 변경될때마다 이벤트가 발생하게 한다. 그리고 `trim()`으로 공백까지 지워주고 `searchMovies`함수를 호출해서 검색하게 만들었다. 

하지만 여기서 문제가 발생했다. 검색은 되는데 검색창에 검색어를 비워도 원래의 화면으로 돌아가지 않는 다는 점,,,_(ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ)_
그래서 뒤에 `else {getMovieData();}`로 검색어가 비면 `getMovieData`함수를 호출했다 해결 !!!!!!!!!!


## Day 4: 영화 상세 페이지 구현

이 부분은 팀 소개 미니 프로젝트에서 모달을 한 번 봤었다. 그래서 모달을 주면 될 거 라는 생각을 하고 있었는데 마침 조건도 !
4. **Day 4: 영화 상세 페이지 구현**
    - 각 영화 카드를 클릭했을 때, 영화의 **상세 정보**(예: 줄거리, 감독, 개봉일 등)를 API에서 추가로 받아와 화면에 표시하세요.
    - 상세 정보는 **새로운 페이지** 또는 **모달 창**으로 보여주면 됩니다.
    - **중요 포인트**: 클릭된 영화의 **ID**를 활용하여 TMDB API로부터 해당 영화의 상세 정보를 요청해야 합니다.
    
```javascript
//일단 위에서 모달과 관련된 html 요소들을 전부 변수 선언 해주었고, 

function openModal(movie) {
  modalPoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  modalTitle.textContent = movie.title;
  modalTitle.setAttribute("data-movie-id", movie.id);
  modalOverview.textContent = movie.overview || "개요 정보가 없습니당";
  modalRating.textContent = `⭐ ${movie.vote_average.toFixed(1)} / 10`;
  modalReleaseDate.textContent = `개봉일: ${movie.release_date || "정보 없음"}`;
  updateBookmarkButtons(movie.id);
}

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
```
영화 객체를 받아서 모달 내용을 채워줬다. 정보가 없다면 ||연산자를 사용해서 대체 텍스트가 나올 수 있게 만들어 줬고 북마크 상태도 업데이트 할 수 있게 했다. 

그리고 여기에서 내가 모르던 개념이 나오는데 이벤트 위임이라는 개념이다.`const clickedCard = e.target.closest(".movie");` 이 부분은`closet메서드`를 사용해서 클릭된 요소의 가장 가까운 `.movie`요소를 가진 조상 요소를 찾게 한다. 

클릭 된 영화 정보 카드가 존재하면 data-movie-id를 가져온다!`parseInt()`를 사용하여 문자열 ID를 숫자로 변환해주었다. `find()` 메서드를 사용하여 `allMovies` 배열에서 클릭된 영화를 찾아준다. (하나만 찾아줘야하니까 !) 영화 ID를 기준으로 매칭된다. 

그렇게 영화를 찾으면 ? `openModal()` 함수를 호출 ===> 모달을 화면에 표시 !😊


```javascript
const closeModal = () => {
  modal.style.display = "none";
};
```
이것도 걷기반 수업에서 배운 내용 그대로 모달 닫는 함수에 적용을 해주었고,
```javascript
modalCloseBtn.addEventListener("click", closeModal);
window.addEventListener("click", (event) => {
  const modal = document.getElementById("movie-modal");
  if (event.target === modal) {
    closeModal();
  }
});
```
모달을 닫는 방법을 나는 두가지를 구현했는데
+ 닫기 버튼을 눌렀을 때
+ 모달 바깥 영역을 클릭 할 때

이렇게 표현을 하고 나니까 닫기 버튼의 가시성과 상관없이 사용자가 아무데나 클릭해도 모달이 닫혀서 사용성이 편리 할 거라고 판단했다 🤔❗

## Day 5: 메인 페이지로 돌아오기 및 코드 정리

- 영화 상세 페이지나 모달에서 다시 메인 페이지로 돌아가는 **"뒤로 가기"** 또는 **"닫기"** 버튼을 구현하세요.
- 상세 페이지에서 메인 페이지로 돌아갈 때, **원래의 영화 리스트 상태를 유지**하도록 구현합니다.
```javascript
let bookmarkPageState = false;

bookmarkReverseBtn.addEventListener("click", (e) => {
  bookmarkPageState = false;
  displayMovies(allMovies);
  bookmarkBtn.style.display = "block";
  bookmarkReverseBtn.style.display = "none";
});
```
사실 북마크 부분 부터는 다른분이나 구글링의 도움을 너무 절실히 받았다. 북마크 삭제 버튼을 누르게되면 `bookmarkPageState = false;`를 만들어준다. 전체 영화 볼 수 있게 !
그리고 ` displayMovies(allMovies);`로 allmovies에 있는 영화 목록을 다시 표시하게 해줬다. 그 뒤에 버튼을 다시 북마크 삭제 버튼을 감추고 추가 버튼이 보일 수 있게 해주었다.

## Day 6: 모듈화 및 코드 분리

사실 모듈화가 정확히 무지 나는 너무 어렵고 코드는 분리를 최대한 해줬다.
모달, 검색, api, 북마크 js 를 따로 해주었고, css도 마찬가지로 따로 분리해서 작성했다.


## Day 7: 디버깅 및 최종 제출 준비

디버깅이 정확히 뭔지 이해하기 어려웠지만 콘솔창에 내가 가져온 영화들의 목록이 뜨고,
에러가 나는 부분도 없었다.

그래서 최종 구현 화면을 보여주자면,

![업로드중..](blob:https://velog.io/8b28ef47-08ee-4b43-9996-c07916f092a7)

<hr>

😖개인과제를 진행하면서 아쉬웠던 점
+ 북마크 부분을 내 힘으로 스스로 구현 한 느낌이 아니라 구글링과 도움을 받아 구현 한 것 같단 점
+ UI를 좀 더 사용자가 편하게 볼 수 있도록 구현하지 못한 점
(장르별로 나눈다던가 슬라이더를 만든다던가 하는 점)
+ 인기 영화 목록 부분을 눌렀을 때 홈으로 돌아가게하는걸 할 걸 그랬다 싶은 점

😊개인 과제를 진행하면서 잘했다고 생각한 점
+ 검색 부분을 구현에 성공했다는 점
+ 모달을 잘 띄웠다는 점


# MovieIntroducePage
# MovieInfoPage
