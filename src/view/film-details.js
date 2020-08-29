import AbstractView from "./abstract.js";
import FilmCommentView from "../view/popup-comments.js";
import FilmGenreView from "../view/genre.js";
import {RenderPosition, render, createElement} from "../utils/render.js";

const createFilmDetailsTemplate = (film) => {
  const {poster, name, rating, releaseDate, runningTime, description, comments, director, actors, writers, country, genre, isWatchlist, isHistory, isFavorite, id} = film;

  const watchlistClassName = isWatchlist
    ? `checked`
    : ``;

  const watchedClassName = isHistory
    ? `checked`
    : ``;

  const favoriteClassName = isFavorite
    ? `checked`
    : ``;

  return `<section class="film-details" data-id="${id}">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${genre.age}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${name}</h3>
                <p class="film-details__title-original">Original: ${name}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${runningTime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genre.title}</td>
                <td class="film-details__cell"></td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistClassName}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedClassName}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoriteClassName}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list"></ul>

          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmPopup extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._onFavoritePopupButton = this._onFavoritePopupButton.bind(this);
    this._onWatchlistPopupButton = this._onWatchlistPopupButton.bind(this);
    this._onHistoryPopupButton = this._onHistoryPopupButton.bind(this);
  }
  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._renderGenre(this._element);
      this._renderComments(this._element);
    }
    return this._element;
  }
  _renderGenre(element) {
    this._filmGenreTable = element.querySelector(`.film-details__table tbody`);
    this._filmTableRows = this._filmGenreTable.querySelectorAll(`.film-details__row`);
    this._filmGenreRow = this._filmTableRows[this._filmTableRows.length - 1];

    this._film.genre.genres.forEach((genre) => render(this._filmGenreRow.querySelector(`.film-details__cell`), new FilmGenreView(genre), RenderPosition.BEFOREEND));
  }
  _renderComments(element) {
    this._filmPopupCommentList = element.querySelector(`.film-details__comments-list`);

    this._film.comments.forEach((comment) => render(this._filmPopupCommentList, new FilmCommentView(comment), RenderPosition.BEFOREEND));
  }
  _onFavoritePopupButton(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
  _onWatchlistPopupButton(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }
  _onHistoryPopupButton(evt) {
    evt.preventDefault();
    this._callback.historyClick();
  }
  onFavoritePopupClick(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._onFavoritePopupButton);
  }
  onWatchlistPopupClick(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._onWatchlistPopupButton);
  }
  onHistoryPopupClick(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._onHistoryPopupButton);
  }
}
