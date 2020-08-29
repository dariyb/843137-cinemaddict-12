import FilmsSectionView from "../view/films-section.js";
import FilmsListView from "../view/films-list.js";
import NoFilmsView from "../view/no-films.js";
import SortView from "../view/sorting-list.js";
import FilmsListContainerView from "../view/films-list-container.js";
import FilmElementPresenter from "./film-element.js";
import FilmsExtraListView from "../view/extra-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import PopupPresenter from "./popup.js";
import {updateItem} from "../utils/common.js";
import {TOP_RATED, MOST_COMMENTED, FILM_COUNT_PER_STEP} from "../constants.js";
import FilmsStatisticsView from "../view/films-statistics.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {sortFilmDateUp, sortFilmRatingUp} from "../utils/film.js";
import {SortType} from "../constants.js";

export default class MovieList {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderTemplateedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmCards = {};
    this._filmCardsExtra = {};
    this._filmPopupCurrent = null;

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._filmElementPresenter = new FilmElementPresenter();
    this._noFilmsList = new NoFilmsView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._bodyTag = document.querySelector(`body`);
    this._siteFooter = document.querySelector(`.footer`);

    this._cardFilmClickHandler = this._cardFilmClickHandler.bind(this);
    this._filmsSectionComponent.onFilmsSectionClick(this._cardFilmClickHandler);
    this._onFilmChange = this._onFilmChange.bind(this);
    this.close = this.close.bind(this);

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onSortTypeChangeClick = this._onSortTypeChangeClick.bind(this);
  }
  init(filmsElements) {
    this._filmElements = filmsElements.slice();
    this._initFilmElements = filmsElements.slice();

    render(this._filmsContainer, this._filmsSectionComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

    this._renderFilmsSection();
    this._renderFooter();
  }
  _onFilmChange(updatedFilm) {
    this._filmElements = updateItem(this._filmElements, updatedFilm);
    this._initFilmElements = updateItem(this._initFilmElements, updatedFilm);

    if (this._filmCards[updatedFilm.id]) {
      this._filmCards[updatedFilm.id].init(updatedFilm);
    } else {
      this._filmCardsExtra[updatedFilm.id].init(updatedFilm);
    }
    // this._filmCards[updatedFilm.id].init(updatedFilm);
    // this._filmCardsExtra[updatedFilm.id].init(updatedFilm);

    if (this._filmPopupCurrent) {
      this._filmPopupCurrent.init(updatedFilm);
    }
  }
  close() {
    if (!this._filmPopupCurrent) {
      return;
    }
    this._filmPopupCurrent.removePopup();
    this._filmPopupCurrent = null;
  }
  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._filmElements.sort(sortFilmDateUp);
        break;
      case SortType.RATING:
        this._filmElements.sort(sortFilmRatingUp);
        break;
      default:
        this._filmElements = this._initFilmElements.slice();
    }
    this._currentSortType = sortType;
  }
  _onSortTypeChangeClick(sortType) {
    // - Сортируем задачи
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortFilms(sortType);
    // - Очищаем список
    this._clearFilmList();
    // - Рендерим список заново
    this._renderMainFilms(0, Math.min(this._filmElements.length, FILM_COUNT_PER_STEP));
    this._renderShowMoreButton();
  }
  destroy() {
    remove(this._filmComponent);
  }
  _renderSort() {
    // метод рендеринга для будущей сортировки
    render(this._filmsSectionComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
    this._sortComponent.onSortTypeClick(this._onSortTypeChangeClick);
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
  _renderFilm(filmListElement, film) {
    // текущая функция renderFilm
    this._filmElementPresenter = new FilmElementPresenter(filmListElement, this._onFilmChange);
    this._filmElementPresenter.init(film);
    this._filmCards[film.id] = this._filmElementPresenter;
    console.log(this._filmCards[film.id]);
    console.log(Object.assign(this._filmCards));

    // if (Array.from(this._filmCards[film.id])) {
    //   // this._filmCards[film.id] = this._filmElementPresenter;
    //   this._filmCardsExtra[film.id] = this._filmElementPresenter;
    //   console.log(this._filmCardsExtra[film.id] = this._filmElementPresenter);
    // }
    // this._filmCards[film.id] = this._filmElementPresenter;
  }
  // _renderExtra(filmListExtraElement, filmExtra) {
  //   this._filmElementPresenter = new FilmElementPresenter(filmListExtraElement, this._onFilmChange);
  //   this._filmElementPresenter.init(filmExtra);
  //   this._filmCardsExtra[filmExtra.id] = this._filmElementPresenter;
  // }
  _renderMainFilms(from, to) {
    this._filmElements
      .slice(from, to)
      .forEach((film) => this._renderFilm(this._filmsListContainerComponent, film));
  }
  _renderExtraFilms() {
    // по идее renderContent
    const titleExtraList = [`Top rated`, `Most commented`];

    titleExtraList.forEach((title) => render(this._filmsSectionComponent, new FilmsExtraListView(title), RenderPosition.BEFOREEND));

    this._siteExtraTopFilms = this._filmsContainer.querySelector(`.films-list--extra`);
    this._siteExtraListContainer = this._siteExtraTopFilms.querySelector(`.films-list__container`);

    this._getTopRatedFilms(this._filmElements)
      .slice()
      .forEach((film) => this._renderFilm(this._siteExtraListContainer, film));

    this._siteExtraMostFilms = this._filmsContainer.querySelector(`.films-list--extra:last-child`);
    this._extraFilmsContainer = this._siteExtraMostFilms.querySelector(`.films-list__container`);

    this._getMostCommentedFilms(this._filmElements)
      .slice()
      .forEach((film) => this._renderFilm(this._extraFilmsContainer, film));
  }
  _renderNoFilms() {
    // рендеринг заглушки
    render(this._filmsListComponent, this._noFilmsList, RenderPosition.BEFOREEND);
  }
  _onShowMoreButtonClick() {
    this._filmElements
    .slice(this._renderTemplateedFilmCount, this._renderTemplateedFilmCount + FILM_COUNT_PER_STEP)
    .forEach((film) => this._renderFilm(this._filmsListContainerComponent, film));

    this._renderTemplateedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderTemplateedFilmCount >= this._filmElements.length) {
      remove(this._showMoreButtonComponent);
    }
  }
  _renderShowMoreButton() {
    // отрисовка и функции кнопки показа
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.onButtonClick(this._onShowMoreButtonClick);
  }
  _clearFilmList() {
    Object
      .values(this._filmCards)
      .forEach((film) => film.destroy());
    this._filmCards = {};

    this._renderTemplateedFilmCount = FILM_COUNT_PER_STEP;
  }
  _renderFilmsSection() {
    const filmsElementsLength = this._filmElements.length;

    if (filmsElementsLength <= 0) {
      this._renderNoFilms();
    } else {
      this._renderMainFilms(0, Math.min(this._filmElements.length, FILM_COUNT_PER_STEP));
      this._renderExtraFilms();
    }
    this._renderSort();

    if (filmsElementsLength > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }
  _findElement(id) {
    this._filmPopup = this._filmElements.find((film) => film.id === Number(id));
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
    const popupPresenter = new PopupPresenter(this._bodyTag, this._onFilmChange, this.close);
    popupPresenter.init(this._currentFilm);
    this._filmPopupCurrent = popupPresenter;
  }
  _renderFooter() {
    this._siteFooterStatistics = this._siteFooter.querySelector(`.footer__statistics`);

    render(this._siteFooterStatistics, new FilmsStatisticsView(this._filmElements), RenderPosition.BEFOREEND);
  }
}
