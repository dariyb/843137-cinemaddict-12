import FilmsListElementView from "../view/films-list-element.js";
import FilmsExtraListView from "../view/extra-list.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";
import {TOP_RATED, MOST_COMMENTED, DOUBLE_SECTION} from "../constants.js";

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
    if (this._container.getElement().contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }
    remove(prevFilmComponent);
  }
  destroy() {
    remove(this._filmComponent);
  }
  renderFilms(mainContainer, sectionContainer, films) {
    // по идее renderContent
    this._mainContainer = mainContainer;
    this._sectionContainer = sectionContainer;
    this._films = films;

    for (let i = 0; i < DOUBLE_SECTION; i++) {
      const title = [`Top rated`, `Most commented`];
      render(this._sectionContainer, new FilmsExtraListView(title[i]), RenderPosition.BEFOREEND);
    }

    this._siteExtraTopFilms = this._mainContainer.querySelector(`.films-list--extra`);
    this._siteExtraListContainer = this._siteExtraTopFilms.querySelector(`.films-list__container`);

    const getTopRatedFilms = (elem) => {
      return elem
      .slice()
      .sort((a, b) => a.rating > b.rating ? -1 : 1)
      .slice(0, TOP_RATED);
    };

    for (const item of getTopRatedFilms(this._films)) {
      render(this._siteExtraListContainer, new FilmsListElementView(item), RenderPosition.BEFOREEND);
    }

    this._siteExtraMostFilms = this._mainContainer.querySelector(`.films-list--extra:last-child`);
    this._extraFilmsContainer = this._siteExtraMostFilms.querySelector(`.films-list__container`);

    const getMostCommentedFilms = (elem) => {
      return elem
      .slice()
      .sort((a, b) => a.comments.length > b.comments.length ? -1 : 1)
      .slice(0, MOST_COMMENTED);
    };

    for (const item of getMostCommentedFilms(this._films)) {
      render(this._extraFilmsContainer, new FilmsListElementView(item), RenderPosition.BEFOREEND);
    }
  }
  _onFavoriteClick() {
    this._changeData(
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
