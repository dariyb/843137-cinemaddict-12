import FilmsListElementView from "../view/films-list-element.js";
import Abstract from "../view/abstract.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";
import {UserAction, UpdateType} from "../constants.js";

export default class FilmElement {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;
    this._filmComponent = null;

    this._onFavoriteClick = this._onFavoriteClick.bind(this);
    this._onWatchlistClick = this._onWatchlistClick.bind(this);
    this._onHistoryClick = this._onHistoryClick.bind(this);
  }
  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;

    this._filmComponent = new FilmsListElementView(film);

    this._filmComponent.onClickFavorite(this._onFavoriteClick);
    this._filmComponent.onClickWatchlist(this._onWatchlistClick);
    this._filmComponent.onClickHistory(this._onHistoryClick);

    if (prevFilmComponent === null) {
      render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._container instanceof Abstract) {
      this._container = this._container.getElement();
    }
    if (this._container.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }
    remove(prevFilmComponent);
  }
  destroy() {
    remove(this._filmComponent);
  }
  _onFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM_INFO,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }
  _onWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM_INFO,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isWatchlist: !this._film.isWatchlist
            }
        )
    );
  }
  _onHistoryClick() {
    this._changeData(
        UserAction.UPDATE_FILM_INFO,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isHistory: !this._film.isHistory
            }
        )
    );
  }
}
