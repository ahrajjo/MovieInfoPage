const modal = document.getElementById("movie-modal");
const modalPoster = document.getElementById("modal-poster");
const modalTitle = document.getElementById("modal-title");
const modalOverview = document.getElementById("modal-overview");
const modalRating = document.getElementById("modal-rating");
const modalReleaseDate = document.getElementById("modal-release-date");
const modalCloseBtn = document.querySelector(".close-btn");

//이제 여기서부터는 걷기반에서 배운걸 사용했다.
// 모달 창 열기
function openModal(movie) {
  // 영화 정보
  modalPoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  modalTitle.textContent = movie.title;
  modalTitle.setAttribute("data-movie-id", movie.id);
  modalOverview.textContent = movie.overview || "개요 정보가 없습니당";
  modalRating.textContent = `⭐ ${movie.vote_average.toFixed(1)} / 10`;
  modalReleaseDate.textContent = `개봉일: ${movie.release_date || "정보 없음"}`;
  updateBookmarkButtons(movie.id);
}

// 모달 창 닫기
const closeModal = () => {
  modal.style.display = "none";
};

//그리고 닫기 버튼이 생각보다 가시성이 좋지않은데, 변경하기엔 어울리지않아서
//다른 부분을 눌러도 모달창이 닫혔으면 좋겠다.
// 닫기버튼 아니어도 닫히게 윈도우에도 이벤트 리스너 넣어줌
modalCloseBtn.addEventListener("click", closeModal);
window.addEventListener("click", (event) => {
  const modal = document.getElementById("movie-modal");
  if (event.target === modal) {
    closeModal();
  }
});
