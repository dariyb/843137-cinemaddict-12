import FilmPopupView from "../view/film-details.js";
import {ESC_KEYCODE, ENTR_KEYCODE, CTRL_KEYCODE} from "../constants.js";
import {uniqueNumber} from "../utils/common.js";
import {remove, replace} from "../utils/render.js";
import {UserAction, UpdateType} from "../constants.js";

export default class Popup {
  constructor(filmPopupContainer, changePopupData, close) {
    this._filmPopupContainer = filmPopupContainer;
    this._changePopupData = changePopupData;
    this.close = close;

    this._filmPopupComponent = null;

    this._onFavoritePopup = this._onFavoritePopup.bind(this);
    this._onWatchlistPopup = this._onWatchlistPopup.bind(this);
    this._onHistoryPopup = this._onHistoryPopup.bind(this);

    this._onDeleteComment = this._onDeleteComment.bind(this);
    this._onSendPress = this._onSendPress.bind(this);

    this._onEscPress = this._onEscPress.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._closePopup = this._closePopup.bind(this);

  }
  init(currentFilm) {

    document.addEventListener(`keydown`, this._onEscPress);
    document.addEventListener(`click`, this._onCloseButtonClick);
    document.addEventListener(`keydown`, this._onSendPress);

    this._currentFilm = currentFilm;

    const prevFilmComponent = this._filmPopupComponent;

    this._filmPopupComponent = new FilmPopupView(currentFilm);

    this._filmPopupComponent.onFavoritePopupClick(this._onFavoritePopup);
    this._filmPopupComponent.onWatchlistPopupClick(this._onWatchlistPopup);
    this._filmPopupComponent.onHistoryPopupClick(this._onHistoryPopup);
    this._filmPopupComponent.onDeleteButtonClick(this._onDeleteComment);
    this._filmPopupComponent.onSendKeysPress(this._onSendPress);

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
    document.removeEventListener(`keydown`, this._onSendPress);
  }
  _onFavoritePopup() {
    this._changePopupData(
        UserAction.UPDATE_FILM_INFO,
        UpdateType.PATCH,
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
        UserAction.UPDATE_FILM_INFO,
        UpdateType.PATCH,
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
        UserAction.UPDATE_FILM_INFO,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._currentFilm,
            {
              isHistory: !this._currentFilm.isHistory
            }
        )
    );
  }
  _onDeleteComment(commentId) {
    const newComments = this._currentFilm.comments.filter((comment) => comment.id !== parseInt(commentId, 10));
    this._changePopupData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._currentFilm,
            {
              comments: newComments.slice()
            }
        )
    );
  }
  _onSendPress(evt) {
    if (evt.keyCode === ENTR_KEYCODE && CTRL_KEYCODE) {
      const insertedText = this._filmPopupComponent.getMessage();
      const chosenEmoji = this._filmPopupComponent.getElement().querySelector(`input[type='radio']:checked`).value;

      if (chosenEmoji && insertedText) {
        const newUserComment = {
          id: uniqueNumber(),
          text: insertedText,
          emoji: `./images/emoji/${chosenEmoji}.png`,
          author: `RandomPerson`,
          date: new Date(),
        };
        const newComments = this._currentFilm.comments.slice();
        newComments.push(newUserComment);
        this._changePopupData(
            UserAction.ADD_COMMENT,
            UpdateType.PATCH,
            Object.assign(
                {},
                this._currentFilm,
                {
                  comments: newComments
                }
            )
        );
      }
    }
  }
}
