import {humanizeCommentDate} from "../utils.js";
export const createFilmCommentTemplate = (film) => {
  const {text, author, date, emoji} = film;

  const humDate = date !== null
    ? humanizeCommentDate(date)
    : ` `;

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="${emoji}" width="55" height="55" alt="emoji-smile">
  </span>
  <div>
    <p class="film-details__comment-text">${text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${humDate}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`;
};
