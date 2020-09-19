import he from "he";
import AbstractView from "./abstract.js";
import {convertDate} from "../utils/film.js";

const createFilmCommentTemplate = (film) => {
  const {comment, author, date, emotion, id} = film;
  console.log(film);

  const humDate = date !== null
    ? convertDate(date, `comment date`)
    : ` `;


  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${he.encode(comment)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${humDate}</span>
      <button class="film-details__comment-delete" data-id="${id}">Delete</button>
    </p>
  </div>
</li>`;
};

export default class FilmComment extends AbstractView {
  constructor(comment) {
    super();
    this._comment = comment;
  }
  getTemplate() {
    return createFilmCommentTemplate(this._comment);
  }
}
