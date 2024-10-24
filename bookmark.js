const bookmarkBtn = document.querySelector("#bookmark-btn");
const bookmarkReverseBtn = document.querySelector("#bookmark-reverse");
const bookmarkAddBtn = document.querySelector(".bookmark-add");
const bookmarkRemoveBtn = document.querySelector(".bookmark-remove");
const modalMovieTitle = document.querySelector("#modal-title");

let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
let bookmarkPageState = false;

// 북마크 저장함수
function saveBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function addBookmark(movie) {
  if (!bookmarks.some((bookmark) => bookmark.id === movie.id)) {
    bookmarks.push(movie);
    saveBookmarks();
    updateBookmarkButtons(movie.id);
  }
}

function removeBookmark(movieId) {
  bookmarks = bookmarks.filter((bookmark) => bookmark.id !== movieId);
  saveBookmarks();
  updateBookmarkButtons(movieId);
  if (bookmarkPageState) {
    displayMovies(bookmarks);
  }
}

function updateBookmarkButtons(movieId) {
  const isBookmarked = bookmarks.some((bookmark) => bookmark.id === movieId);
  if (isBookmarked) {
    bookmarkAddBtn.style.display = "none";
    bookmarkRemoveBtn.style.display = "inline";
  } else {
    bookmarkAddBtn.style.display = "inline";
    bookmarkRemoveBtn.style.display = "none";
  }
}

// 북마크 보기 버튼
bookmarkBtn.addEventListener("click", (e) => {
  bookmarkPageState = true;
  displayMovies(bookmarks);
  bookmarkBtn.style.display = "none";
  bookmarkReverseBtn.style.display = "block";
});

// 돌아가기 버튼
bookmarkReverseBtn.addEventListener("click", (e) => {
  bookmarkPageState = false;
  displayMovies(allMovies);
  bookmarkBtn.style.display = "block";
  bookmarkReverseBtn.style.display = "none";
});

// 북마크 추가버튼
bookmarkAddBtn.addEventListener("click", () => {
  const movieId = parseInt(modalMovieTitle.getAttribute("data-movie-id"));
  const movie = allMovies.find((movie) => movie.id === movieId);
  if (movie) {
    addBookmark(movie);
  }
  alert("북마크에 추가되었습니다.");
});

// 북마크 제거버튼
bookmarkRemoveBtn.addEventListener("click", () => {
  const movieId = parseInt(modalMovieTitle.getAttribute("data-movie-id"));
  removeBookmark(movieId);
  alert("북마크에서 제거되었습니다.");
});

// 브라우저 실행시 북마크 로드.
window.addEventListener("load", () => {
  bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
});
