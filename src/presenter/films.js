import FilmsSectionView from "../view/films-section.js";
import FilmsListView from "../view/films-list.js";
import NoFilmsView from "../view/no-films.js";
import SortView from "../view/sorting-list.js";
import FilmsListContainerView from "../view/films-list-container.js";
import FilmElementPresenter from "./film-element.js";
import FilmsExtraListView from "../view/extra-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import PopupPresenter from "./popup.js";
// import PopupModel from "./model/popup.js";
// import CommentsModel from "./model/comments.js";
import {TOP_RATED, MOST_COMMENTED, FILM_COUNT_PER_STEP} from "../constants.js";
import FilmsStatisticsView from "../view/films-statistics.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {sortFilmDateUp, sortFilmRatingUp} from "../utils/film.js";
import {countWatchlist, filter} from "../utils/filter.js";
import {SortType, UserAction, UpdateType} from "../constants.js";

export default class MovieList {
  constructor(filmsContainer, moviesModel, filterModel) {
    this._filmsContainer = filmsContainer;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._renderTemplateedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmCards = {};
    this._filmCardsExtra = {};
    this._filmPopupCurrent = null;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._noFilmsList = new NoFilmsView();
    this._bodyTag = document.querySelector(`body`);
    this._siteFooter = document.querySelector(`.footer`);

    this._cardFilmClickHandler = this._cardFilmClickHandler.bind(this);
    this._filmsSectionComponent.onFilmsSectionClick(this._cardFilmClickHandler);
    // this._onFilmChange = this._onFilmChange.bind(this);
    this._onViewAction = this._onViewAction.bind(this);
    this._onModelEvent = this._onModelEvent.bind(this);
    this.close = this.close.bind(this);

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onSortTypeChangeClick = this._onSortTypeChangeClick.bind(this);

    this._moviesModel.addObserver(this._onModelEvent);
    this._filterModel.addObserver(this._onModelEvent);
    // this._popupModel.addObserver(this._onModelEvent);
  }
  init() {
    render(this._filmsContainer, this._filmsSectionComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

    this._renderMainFilmsSection();
    this._renderExtraFilms();
    this._renderFooter();
  }
  // init(filmsElements) {
  //   this._filmElements = filmsElements.slice();
  //   this._initFilmElements = filmsElements.slice();
  //
  //   render(this._filmsContainer, this._filmsSectionComponent, RenderPosition.BEFOREEND);
  //   render(this._filmsSectionComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
  //   render(this._filmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);
  //
  //   this._renderFilmsSection();
  //   this._renderFooter();
  // }
  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const films = this._moviesModel.getFilms();
    const filteredMovies = filter[filterType](films);
    console.log(filteredMovies);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort(sortFilmDateUp);
      case SortType.RATING:
        return filteredMovies.sort(sortFilmRatingUp);
      // case SortType.DATE:
      //   return this._moviesModel.getFilms().slice().sort(sortFilmDateUp);
      // case SortType.RATING:
      //   return this._moviesModel.getFilms().slice().sort(sortFilmRatingUp);
    }
    // return this._moviesModel.getFilms();
    return filteredMovies;
  }
  _onViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM_INFO:
        this._moviesModel.updateFilm(updateType, update);
        break;
      // case UserAction.DELETE_COMMENT:
      //   this._popupModel.deleteComment(updateType, update);
      //   break;
    }
  }
  _onModelEvent(updateType, data) {

    switch (updateType) {
      case UpdateType.MINOR:
        if (this._filmCards[data.id]) {
          this._filmCards[data.id].init(data);
        }
        if (this._filmCardsExtra[data.id]) {
          this._filmCardsExtra[data.id].init(data);
        }
        if (this._filmPopupCurrent) {
          this._filmPopupCurrent.init(data);
        }
        this._clearFilmsSection();
        this._renderMainFilmsSection();
        break;
      case UpdateType.MAJOR:
        // обновление при сортировке
        this._clearFilmsSection({resetRenderedFilmCount: true, resetSortType: true});
        this._renderMainFilmsSection();
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
    // - Сортируем задачи
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    // - Очищаем список
    this._clearFilmsSection({resetRenderedFilmCount: true});
    // - Рендерим список заново
    this._renderMainFilmsSection();
  }
  destroy() {
    remove(this._filmComponent);
  }
  _renderSort() {
    // метод рендеринга для будущей сортировки
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
    // текущая функция renderFilm
    this._filmElementPresenter = new FilmElementPresenter(filmListElement, this._onViewAction);
    this._filmElementPresenter.init(film);
    cardsList[film.id] = this._filmElementPresenter;
  }
  _renderMainFilms(films) {
    films.forEach((film) => this._renderFilm(this._filmsListContainerComponent, film));
  }
  // _renderMainFilms(from, to) {
  //   this._filmElements
  //     .slice(from, to)
  //     .forEach((film) => this._renderFilm(this._filmsListContainerComponent, film));
  // }
  _renderExtraFilms() {
    // по идее renderContent
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
  _renderNoFilms() {
    // рендеринг заглушки
    render(this._filmsListComponent, this._noFilmsList, RenderPosition.BEFOREEND);
  }
  _onShowMoreButtonClick() {
    // this._filmElements
    // .slice(this._renderTemplateedFilmCount, this._renderTemplateedFilmCount + FILM_COUNT_PER_STEP)
    // .forEach((film) => this._renderFilm(this._filmsListContainerComponent, film));
    //
    // this._renderTemplateedFilmCount += FILM_COUNT_PER_STEP;
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
    // отрисовка и функции кнопки показа
    // render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
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
  // _renderFilmsSection() {
  //   // const filmsElementsLength = this._filmElements.length;
  //   const moviesCount = this._getMovies().length;
  //   const movies = this._getMovies().slice(0, Math.min(moviesCount, FILM_COUNT_PER_STEP));
  //
  //   if (moviesCount <= 0) {
  //     this._renderNoFilms();
  //   } else {
  //     this._renderMainFilms(movies);
  //     this._renderExtraFilms();
  //   }
  //   this._renderSort();
  //
  //   if (moviesCount > FILM_COUNT_PER_STEP) {
  //     this._renderShowMoreButton();
  //   }
  // }
  _renderMainFilmsSection() {
    const moviesCount = this._getMovies().length;
    const movies = this._getMovies().slice(0, Math.min(moviesCount, FILM_COUNT_PER_STEP));

    if (moviesCount === 0) {
      this._renderNoFilms();
      return;
    }
    this._renderSort();
    this._renderMainFilms(movies);
    if (moviesCount > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }
  _findElement(id) {
    const moviesList = this._getMovies().slice();
    this._filmPopup = moviesList.find((film) => film.id === Number(id));
    return this._filmPopup;
  }
  _cardFilmClickHandler(evt) {

    if (evt.target.classList.contains(`film-card__poster`) || evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__comments`)) {
      this._popupId = event.target.parentNode.dataset.id;
      this._currentFilm = this._findElement(this._popupId);
      this._renderPopupFilm();
    }
  }
  _renderPopupFilm() {
    this.close();

    // const popupModel = new PopupModel();
    // popupModel.setPopup(this._currentFilm);
    // const commentsModel = new CommentsModel();
    // commentsModel.setComments(this._currentFilm);

    const popupPresenter = new PopupPresenter(this._bodyTag, this._onViewAction, this.close);
    popupPresenter.init(this._currentFilm);
    this._filmPopupCurrent = popupPresenter;
  }
  _renderFooter() {
    const moviesList = this._getMovies().slice();
    this._siteFooterStatistics = this._siteFooter.querySelector(`.footer__statistics`);

    render(this._siteFooterStatistics, new FilmsStatisticsView(moviesList), RenderPosition.BEFOREEND);
  }
}
