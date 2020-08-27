import FilmPopupView from "../view/film-details.js";
import FilmCommentView from "../view/popup-comments.js";
import FilmGenreView from "../view/genre.js";
import {ESC_KEYCODE} from "../constants.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";

export default class Popup {
  constructor(filmPopupContainer) {
    this._filmPopupContainer = filmPopupContainer;

    this._filmPopupComponent = null;

    // this._onFavoriteClick = this._onFavoriteClick.bind(this);
    // this._onWatchListClick = this._onWatchListClick.bind(this);
    // this._onHistoryClick = this._onHistoryClick.bind(this);


    this._onEscPress = this._onEscPress.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }
  open(currentFilm) {
    this._currentFilm = currentFilm;

    const prevFilmComponent = this._filmPopupComponent;

    this._filmPopupComponent = new FilmPopupView(currentFilm);

    // this._filmPopupContainer.appendChild(this._filmPopupComponent.getElement());

    this._filmGenreTable = this._filmPopupComponent.getElement().querySelector(`.film-details__table tbody`);
    this._filmTableRows = this._filmGenreTable.querySelectorAll(`.film-details__row`);
    this._filmGenreRow = this._filmTableRows[this._filmTableRows.length - 1];

    currentFilm.genre.genres.forEach((film) => render(this._filmGenreRow.querySelector(`.film-details__cell`), new FilmGenreView(film), RenderPosition.BEFOREEND));

    this._filmPopupCommentList = this._filmPopupComponent.getElement().querySelector(`.film-details__comments-list`);

    currentFilm.comments.forEach((film) => render(this._filmPopupCommentList, new FilmCommentView(film), RenderPosition.BEFOREEND));

    if (prevFilmComponent === null) {
      this._filmPopupContainer.appendChild(this._filmPopupComponent.getElement());
      return;
    }
    if (this._filmPopupContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmPopupComponent, prevFilmComponent);
    }

    // this._filmPopupComponent.onFavoritePopupClick(this._onFavoriteClick);
    // this._filmPopupComponent.onWatchListPopupClick(this._onWatchListClick);
    // this._filmPopupComponent.onHistoryPopupClick(this._onHistoryClick);

    document.addEventListener(`keydown`, this._onEscPress);
    document.addEventListener(`click`, this._onCloseButtonClick);
  }
  destroy() {
    remove(this._filmPopupComponent);
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
    this._popup = document.querySelector(`.film-details`);
    if (this._popup) {
      this._filmPopupContainer.removeChild(this._popup);
    }

    document.removeEventListener(`keydown`, this._onEscPress);
    document.removeEventListener(`click`, this._onCloseButtonClick);
  }
  // _onFavoriteClick() {
  //   this._changeData(
  //       Object.assign(
  //           {},
  //           this._currentFilm,
  //           {
  //             isFavorite: !this._currentFilm.isFavorite
  //           }
  //       )
  //   );
  // }
  // _onWatchListClick() {
  //   this._changeData(
  //       Object.assign(
  //           {},
  //           this._currentFilm,
  //           {
  //             isWatchlist: !this._currentFilm.isWatchlist
  //           }
  //       )
  //   );
  // }
  // _onHistoryClick() {
  //   this._changeData(
  //       Object.assign(
  //           {},
  //           this._currentFilm,
  //           {
  //             isHistory: !this._currentFilm.isHistory
  //           }
  //       )
  //   );
  // }
}
