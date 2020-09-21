import AbstractView from "./abstract.js";

const createSiteFilmsListElementTemplate = (film) => {
  const MAX_DESCRIPTION_LENGTH = 140;
  const {poster, name, rating, releaseDate, runningTime, genre, description, comments, isWatchlist, isHistory, isFavorite, id} = film;

  const runningFilmTime = (runnTime) => {
    if (runnTime > 60) {
      let hour = Math.floor((runnTime / 60));
      let minutes = Math.floor(runnTime - (hour * 60));
      if (minutes > 60) {
        hour = Math.floor(hour + (minutes / 60));
        minutes = Math.floor(minutes - (minutes / 60));
      }
      if (minutes < 60) {
        minutes = Math.floor(minutes);
      }
      return hour + `h` + ` ` + minutes + `m`;
    } else if (runnTime < 60) {
      return runnTime + `m`;
    }
    return runnTime + `h`;
  };

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


  return `<article class="film-card" data-id="${id}">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.getFullYear()}</span>
        <span class="film-card__duration">${runningFilmTime(runningTime)}</span>
        <span class="film-card__genre">${genre.length === 0 ? `` : genre[0]}</span>
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

export default class FilmsListElement extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._onFavoriteButton = this._onFavoriteButton.bind(this);
    this._onWatchlistButton = this._onWatchlistButton.bind(this);
    this._onHistoryButton = this._onHistoryButton.bind(this);
  }
  getTemplate() {
    return createSiteFilmsListElementTemplate(this._film);
  }
  _onFavoriteButton(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
  _onWatchlistButton(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }
  _onHistoryButton(evt) {
    evt.preventDefault();
    this._callback.historyClick();
  }
  onClickFavorite(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._onFavoriteButton);
  }
  onClickWatchlist(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._onWatchlistButton);
  }
  onClickHistory(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._onHistoryButton);
  }
}
