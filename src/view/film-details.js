import SmartView from "./smart.js";
import FilmCommentView from "../view/popup-comments.js";
import FilmGenreView from "../view/genre.js";
import {EMOJIES} from "../constants.js";
import {RenderPosition, render, createElement} from "../utils/render.js";
import {convertDate} from "../utils/film.js";

const getEmoji = (currentEmoji) => {
  return EMOJIES.map((emoji) =>`<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji.split(`.`)[0]}" value="${emoji.split(`.`)[0]}" ${emoji.split(`.`)[0] === currentEmoji ? `checked` : ``}>
  <label class="film-details__emoji-label" for="emoji-${emoji.split(`.`)[0]}">
    <img src="./images/emoji/${emoji}" width="30" height="30" alt="emoji" data-emoji="${emoji.split(`.`)[0]}">
  </label>
  `).join(``);
};

const insertChosenEmoji = (chosenEmoji) => {
  return `<img src="./images/emoji/${chosenEmoji}.png" width="55" height="55" alt="emoji-${chosenEmoji}">`;
};

const createFilmDetailsTemplate = (data, api, emoji, message) => {
  const {poster, name, alternativeName, rating, ageRating, releaseDate, runningTime, description, comments, director, actors, writers, country, genre, isWatchlist, isHistory, isFavorite, id} = data;

  const emojiTemplate = getEmoji(emoji);

  const fullReleaseDate = releaseDate !== null
    ? convertDate(releaseDate, `film release`)
    : ` `;

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
            <p class="film-details__age">${ageRating ? `18+` : ``}</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${name}</h3>
                <p class="film-details__title-original">Original: ${alternativeName}</p>
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
                <td class="film-details__cell">${fullReleaseDate}</td>
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
                <td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
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
            <div for="add-emoji" class="film-details__add-emoji-label">
            ${emoji ? `${insertChosenEmoji(emoji)}` : ``}
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${message ? message : ``}</textarea>
            </label>
            <div class="film-details__emoji-list">
            ${emojiTemplate}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmPopup extends SmartView {
  constructor(data, api) {
    super();
    this._data = data;
    this._api = api;
    this._emoji = null;
    this._comment = null;
    this._userMessage = null;

    this._onFavoritePopupButton = this._onFavoritePopupButton.bind(this);
    this._onWatchlistPopupButton = this._onWatchlistPopupButton.bind(this);
    this._onHistoryPopupButton = this._onHistoryPopupButton.bind(this);
    this._onEmojiClick = this._onEmojiClick.bind(this);

    this._onTextInput = this._onTextInput.bind(this);

    this._onDeleteButton = this._onDeleteButton.bind(this);

    this._onInnerButtonsClick();

  }
  getTemplate() {
    return createFilmDetailsTemplate(this._data, this._api, this._emoji, this._userMessage);
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._renderGenre(this._element);
      this._renderComments(this._element);
    }
    return this._element;
  }
  removeElement() {
    super.removeElement();
  }
  reset() {
    // здесь возможно будет сброс текста комментариев и эмодзи в будущем~
  }
  getMessage() {
    this._userMessage = this.getElement()
    .querySelector(`.film-details__comment-input`).value;
    return this._userMessage ? this._userMessage : ``;
  }
  _onInnerButtonsClick() {
    this.getElement()
    .querySelectorAll(`.film-details__emoji-label`)
    .forEach((emoji) => emoji.addEventListener(`click`, this._onEmojiClick));
    this.getElement()
    .querySelector(`.film-details__comment-input`)
    .addEventListener(`input`, this._onTextInput);
  }
  onRestore() {
    this._onInnerButtonsClick();
    this.onFavoritePopupClick(this._callback.favoriteClick);
    this.onWatchlistPopupClick(this._callback.watchlistClick);
    this.onHistoryPopupClick(this._callback.historyClick);
  }
  _renderGenre(element) {
    this._filmGenreTable = element.querySelector(`.film-details__table tbody`);
    this._filmTableRows = this._filmGenreTable.querySelectorAll(`.film-details__row`);
    this._filmGenreRow = this._filmTableRows[this._filmTableRows.length - 1];

    this._data.genre.forEach((genre) => render(this._filmGenreRow.querySelector(`.film-details__cell`), new FilmGenreView(genre), RenderPosition.BEFOREEND));
  }
  _renderComments(element) {
    this._filmPopupCommentList = element.querySelector(`.film-details__comments-list`);

    this._api.getComments(this._data.id)
    .then((comments) => {
      this._commentsArr = comments.slice();
      this._commentsArr.forEach((comment) => render(this._filmPopupCommentList, new FilmCommentView(comment), RenderPosition.BEFOREEND));
    });
  }
  _chosenEmoji(emoji) {
    this._emoji = emoji;
  }
  _onEmojiClick(evt) {
    evt.preventDefault();
    this._chosenEmoji(evt.target.dataset.emoji);
    this.updateElement();
  }
  _chosenComment(comment) {
    this._comment = comment;
  }
  onDeleteButtonClick(callback) {
    this._callback.deleteButtonClick = callback;
    this.getElement()
      .querySelectorAll(`.film-details__comment-delete`)
      .forEach((element) => element.addEventListener(`click`, this._onDeleteButton));
  }
  _onDeleteButton(evt) {
    evt.preventDefault();
    this._callback.deleteButtonClick(evt.target.dataset.id);
  }
  _onTextInput(evt) {
    evt.preventDefault();
    this._userMessage = evt.target.value;
  }
  onSendKeysPress(callback) {
    this._callback.savePress = callback;
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
