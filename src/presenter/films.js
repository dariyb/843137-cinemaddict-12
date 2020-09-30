import FilmsSectionView from "../view/films-section.js";
import FilmsListView from "../view/films-list.js";
import LoadingView from "../view/loading.js";
import NoFilmsView from "../view/no-films.js";
import SortView from "../view/sorting-list.js";
import FilmsListContainerView from "../view/films-list-container.js";
import FilmElementPresenter from "./film-element.js";
import FilmsExtraListView from "../view/extra-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import PopupPresenter from "./popup.js";
import {TOP_RATED, MOST_COMMENTED, FILM_COUNT_PER_STEP} from "../constants.js";
import FilmsStatisticsView from "../view/films-statistics.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";
import {sortFilmDateUp, sortFilmRatingUp} from "../utils/film.js";
import {filter} from "../utils/filter.js";
import {SortType, UserAction, UpdateType, DELETE} from "../constants.js";
import MoviesModel from "../model/movies.js";

class MovieList {
  constructor(filmsContainer, moviesModel, filterModel, api, commentsModel) {
    this._filmsContainer = filmsContainer;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._renderTemplateedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmCards = {};
    this._filmCardsExtra = {};
    this._filmPopupCurrent = null;
    this._isLoading = true;
    this._api = api;
    this._filmsComments = commentsModel;

    this._footerStats = null;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._noFilmsList = new NoFilmsView();
    this._loadingComponent = new LoadingView();
    this._bodyTag = document.querySelector(`body`);
    this._siteFooter = document.querySelector(`.footer`);

    this._cardFilmClickHandler = this._cardFilmClickHandler.bind(this);

    this._onViewAction = this._onViewAction.bind(this);
    this._onModelEvent = this._onModelEvent.bind(this);

    this.close = this.close.bind(this);

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onSortTypeChangeClick = this._onSortTypeChangeClick.bind(this);

  }

  init() {
    render(this._filmsContainer, this._filmsSectionComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

    this._filmsSectionComponent.onFilmsSectionClick(this._cardFilmClickHandler);

    this._moviesModel.addObserver(this._onModelEvent);
    this._filterModel.addObserver(this._onModelEvent);

    this._renderMainFilmsSection();

    if (this._getMovies().length !== 0) {
      this._renderExtraFilms();
    }
  }

  hideFilmsSection() {
    this._clearFilmsSection({resetRenderedFilmCount: true, resetSortType: true});
    this._filmsSectionComponent.getElement().classList.add(`visually-hidden`);
    this._moviesModel.removeObserver(this._onModelEvent);
    this._filterModel.removeObserver(this._onModelEvent);
  }
  showFilmsSection() {
    this._filmsSectionComponent.getElement().classList.remove(`visually-hidden`);
    this._moviesModel.addObserver(this._onModelEvent);
    this._filterModel.addObserver(this._onModelEvent);
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const films = this._moviesModel.getFilms().slice();
    const filteredMovies = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort(sortFilmDateUp);
      case SortType.RATING:
        return filteredMovies.sort(sortFilmRatingUp);
    }
    return filteredMovies;
  }

  _onViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM_INFO:
        this._api.updateFilm(update).then((response) => {
          this._moviesModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        const commentInput = document.querySelector(`.film-details__comment-input`);
        commentInput.setAttribute(`disabled`, true);
        this._api.addComment(update).then((response) => {
          this._filmsComments.addComment(updateType, response);
          this._moviesModel.updateFilm(updateType, MoviesModel.adaptToClient(response.movie));
        })
        .catch(() => {
          commentInput.removeAttribute(`disabled`);
          document.querySelector(`.film-details__new-comment`).classList.add(`shake`);
          setTimeout(() => document.querySelector(`.film-details__new-comment`).classList.remove(`shake`), 1000);
        });
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update.deletedIdComment).then(() => {
          this._filmsComments.deleteComment(updateType, update);
          this._moviesModel.updateFilm(updateType, update);
        })
        .catch(() => {
          const deleteButton = document.querySelector(`.film-details__comment-delete[data-id="${update.deletedIdComment}"]`);
          deleteButton.removeAttribute(`disabled`);
          deleteButton.textContent = DELETE;
          deleteButton.classList.add(`shake`);
        });
        break;
    }
  }

  _onModelEvent(updateType, film) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._filmCards[film.id]) {
          this._filmCards[film.id].init(film);
        }
        if (this._filmCardsExtra[film.id]) {
          this._filmCardsExtra[film.id].init(film);
        }
        if (this._filmPopupCurrent) {
          this._filmPopupCurrent.init(film);
        }
        break;
      case UpdateType.MINOR:
        if (this._filmCards[film.id]) {
          this._filmCards[film.id].init(film);
        }
        if (this._filmCardsExtra[film.id]) {
          this._filmCardsExtra[film.id].init(film);
        }
        if (this._filmPopupCurrent) {
          this._filmPopupCurrent.init(film);
        }
        this._clearFilmsSection();
        this._renderMainFilmsSection();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsSection({resetRenderedFilmCount: true, resetSortType: true});
        this._renderMainFilmsSection();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderMainFilmsSection();
        if (this._getMovies().length !== 0) {
          this._renderExtraFilms();
        }
        this._renderFooter();
        break;
    }
  }

  close() {
    if (!this._filmPopupCurrent) {
      return;
    }
    this._filmPopupCurrent.removePopup();
    this._filmPopupCurrent = null;
  }

  _onSortTypeChangeClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmsSection({resetRenderedFilmCount: true});
    this._renderMainFilmsSection();
  }

  destroy() {
    remove(this._filmComponent);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.onSortTypeClick(this._onSortTypeChangeClick);

    render(this._filmsSectionComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _getTopRatedFilms(elem) {
    return elem
    .slice()
    .sort((a, b) => a.rating > b.rating ? -1 : 1)
    .slice(0, TOP_RATED);
  }

  _getMostCommentedFilms(elem) {
    return elem
    .slice()
    .sort((a, b) => a.comments.length > b.comments.length ? -1 : 1)
    .slice(0, MOST_COMMENTED);
  }

  _renderFilm(filmListElement, film, cardsList = this._filmCards) {
    this._filmElementPresenter = new FilmElementPresenter(filmListElement, this._onViewAction);
    this._filmElementPresenter.init(film);
    cardsList[film.id] = this._filmElementPresenter;
  }

  _renderMainFilms(films) {
    films.forEach((film) => this._renderFilm(this._filmsListContainerComponent, film));
  }

  _renderExtraFilms() {
    const titleExtraList = [`Top rated`, `Most commented`];
    const moviesList = this._getMovies().slice();

    titleExtraList.forEach((title) => render(this._filmsSectionComponent, new FilmsExtraListView(title), RenderPosition.BEFOREEND));

    this._siteExtraTopFilms = this._filmsContainer.querySelector(`.films-list--extra`);
    this._siteExtraListContainer = this._siteExtraTopFilms.querySelector(`.films-list__container`);

    this._getTopRatedFilms(moviesList)
      .slice()
      .forEach((film) => this._renderFilm(this._siteExtraListContainer, film, this._filmCardsExtra));

    this._siteExtraMostFilms = this._filmsContainer.querySelector(`.films-list--extra:last-child`);
    this._extraFilmsContainer = this._siteExtraMostFilms.querySelector(`.films-list__container`);

    this._getMostCommentedFilms(moviesList)
      .slice()
      .forEach((film) => this._renderFilm(this._extraFilmsContainer, film, this._filmCardsExtra));
  }

  _renderLoading() {
    render(this._filmsListComponent, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderNoFilms() {
    render(this._filmsListComponent, this._noFilmsList, RenderPosition.BEFOREEND);
  }

  _onShowMoreButtonClick() {
    const moviesCount = this._getMovies().length;
    const newRenderedMoviesCount = Math.min(moviesCount, this._renderTemplateedFilmCount + FILM_COUNT_PER_STEP);
    const movies = this._getMovies().slice(this._renderTemplateedFilmCount, newRenderedMoviesCount);

    this._renderMainFilms(movies);
    this._renderTemplateedFilmCount = newRenderedMoviesCount;

    if (this._renderTemplateedFilmCount >= moviesCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.onButtonClick(this._onShowMoreButtonClick);

    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _clearFilmsSection({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const moviesCount = this._getMovies().length;

    Object
      .values(this._filmCards)
      .forEach((film) => film.destroy());
    this._filmCards = {};

    remove(this._sortComponent);
    remove(this._noFilmsList);
    remove(this._loadingComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this._renderTemplateedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderTemplateedFilmCount = Math.min(moviesCount, this._renderTemplateedFilmCount);
    }
    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderMainFilmsSection() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const movies = this._getMovies();
    const moviesCount = movies.length;

    if (moviesCount === 0) {
      this._renderNoFilms();
      return;
    }
    this._renderSort();
    this._renderMainFilms(movies.slice(0, Math.min(moviesCount, this._renderTemplateedFilmCount)));
    if (moviesCount > this._renderTemplateedFilmCount) {
      this._renderShowMoreButton();
    }
  }

  _findElement(id) {
    const moviesList = this._getMovies().slice();
    this._filmPopup = moviesList.find((film) => film.id === id);
    return this._filmPopup;
  }

  _cardFilmClickHandler(evt) {
    if (evt.target.classList.contains(`film-card__poster`) || evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__comments`)) {
      this._popupId = evt.target.parentNode.dataset.id;
      this._currentFilm = this._findElement(this._popupId);
      this._renderPopupFilm();
    }
  }

  _renderPopupFilm() {
    this.close();

    const popupPresenter = new PopupPresenter(this._bodyTag, this._onViewAction, this.close, this._api, this._filmsComments);
    popupPresenter.init(this._currentFilm);
    this._filmPopupCurrent = popupPresenter;
  }

  _renderFooter() {
    const moviesList = this._getMovies().slice();
    this._siteFooterStatistics = this._siteFooter.querySelector(`.footer__statistics`);

    const prevFooterEl = this._footerStats;
    this._footerStats = new FilmsStatisticsView(moviesList);

    if (prevFooterEl === null) {
      render(this._siteFooterStatistics, this._footerStats, RenderPosition.BEFOREEND);
      return;
    }
    if (this._siteFooterStatistics.contains(prevFooterEl.getElement())) {
      replace(this._footerStats, prevFooterEl);
    }
    remove(prevFooterEl);
  }

}
export default MovieList;
