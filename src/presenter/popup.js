import FilmPopupView from "../view/film-details.js";
import {ESC_KEYCODE} from "../constants.js";
import {remove, replace} from "../utils/render.js";

export default class Popup {
  constructor(filmPopupContainer, changePopupData, close) {
    this._filmPopupContainer = filmPopupContainer;
    this._changePopupData = changePopupData;
    this.close = close;

    this._filmPopupComponent = null;

    this._onFavoritePopup = this._onFavoritePopup.bind(this);
    this._onWatchlistPopup = this._onWatchlistPopup.bind(this);
    this._onHistoryPopup = this._onHistoryPopup.bind(this);

    this._onEscPress = this._onEscPress.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._closePopup = this._closePopup.bind(this);

  }
  init(currentFilm) {
    document.addEventListener(`keydown`, this._onEscPress);
    document.addEventListener(`click`, this._onCloseButtonClick);

    this._currentFilm = currentFilm;

    const prevFilmComponent = this._filmPopupComponent;

    this._filmPopupComponent = new FilmPopupView(currentFilm);

    this._filmPopupComponent.onFavoritePopupClick(this._onFavoritePopup);
    this._filmPopupComponent.onWatchlistPopupClick(this._onWatchlistPopup);
    this._filmPopupComponent.onHistoryPopupClick(this._onHistoryPopup);
    // this._filmPopupComponent.onEmojiPopupClick();

    if (prevFilmComponent === null) {
      this._filmPopupContainer.appendChild(this._filmPopupComponent.getElement());
      return;
    }
    if (this._filmPopupContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmPopupComponent, prevFilmComponent);
    }
    remove(prevFilmComponent);
  }
  _onEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      this._closePopup();
    }
  }
  _onCloseButtonClick(evt) {
    if (evt.target.classList.contains(`film-details__close-btn`)) {
      this._closePopup();
    }
  }
  _closePopup() {
    this.close();
  }
  removePopup() {
    this._popup = document.querySelector(`.film-details`);
    if (this._popup) {
      this._filmPopupContainer.removeChild(this._popup);
    }

    document.removeEventListener(`keydown`, this._onEscPress);
    document.removeEventListener(`click`, this._onCloseButtonClick);
  }
  _onFavoritePopup() {
    this._changePopupData(
        Object.assign(
            {},
            this._currentFilm,
            {
              isFavorite: !this._currentFilm.isFavorite
            }
        )
    );
  }
  _onWatchlistPopup() {
    this._changePopupData(
        Object.assign(
            {},
            this._currentFilm,
            {
              isWatchlist: !this._currentFilm.isWatchlist
            }
        )
    );
  }
  _onHistoryPopup() {
    this._changePopupData(
        Object.assign(
            {},
            this._currentFilm,
            {
              isHistory: !this._currentFilm.isHistory
            }
        )
    );
  }
}
