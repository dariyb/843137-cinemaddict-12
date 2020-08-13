import {createElement} from "../utils.js";

const createSiteFilmsListElementTemplate = (film) => {
  const MAX_DESCRIPTION_LENGTH = 140;
  const {poster, name, rating, releaseDate, runningTime, genre, description, comments, isWatchlist, isHistory, isFavorite} = film;

  const reduction = (descText, maxLength) => {
    if (descText.length > maxLength) {
      return descText.slice(0, maxLength - 1) + `...`;
    }
    return descText;
  };

  const watchlistClassName = isWatchlist
    ? `film-card__controls-item--active`
    : ``;

  const watchedClassName = isHistory
    ? `film-card__controls-item--active`
    : ``;

  const favoriteClassName = isFavorite
    ? `film-card__controls-item--active`
    : ``;


  return `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate}</span>
        <span class="film-card__duration">${runningTime}</span>
        <span class="film-card__genre">${genre.genres[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${reduction(description, MAX_DESCRIPTION_LENGTH)}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClassName}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}">Mark as favorite</button>
      </form>
    </article>`
  ;
};

export default class FilmsListElement {
  constructor(film) {
    this._film = film;
    this._element = null;
  }
  getTemplate() {
    return createSiteFilmsListElementTemplate(this._film);
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }
}
