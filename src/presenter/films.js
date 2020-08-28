import FilmsSectionView from "../view/films-section.js";
import FilmsListView from "../view/films-list.js";
import NoFilmsView from "../view/no-films.js";
import SortView from "../view/sorting-list.js";
import FilmsListContainerView from "../view/films-list-container.js";
import FilmElementPresenter from "./film-element.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import PopupPresenter from "./popup.js";
import {updateItem, updatePopup} from "../utils/common.js";
import {FILM_COUNT_PER_STEP} from "../constants.js";
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
    this._filmPopupInfo = {};

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
    this._onPopupChange = this._onPopupChange.bind(this);

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
    this._filmCards[updatedFilm.id].init(updatedFilm);
  }
  _onPopupChange(updatedPopup) {
    this._currentFilm = updatePopup(this._currentFilm, updatedPopup);
    this._filmPopupInfo[updatedPopup.id].open(updatedPopup);
    this._filmCards[updatedPopup.id].init(this._currentFilm);
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
  _renderFilm(filmListElement, film) {
    // текущая функция renderFilm
    this._filmElementPresenter = new FilmElementPresenter(filmListElement, this._onFilmChange);
    this._filmElementPresenter.init(film);
    this._filmCards[film.id] = this._filmElementPresenter;
  }
  _renderMainFilms(from, to) {
    this._filmElements
      .slice(from, to)
      .forEach((film) => this._renderFilm(this._filmsListContainerComponent, film));
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
      this._filmElementPresenter.renderFilms(this._filmsContainer, this._filmsSectionComponent, this._filmElements);
    }
    this._renderSort();

    if (filmsElementsLength > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }
  _cardFilmClickHandler(evt) {

    const findCard = (id) => {
      this._filmPopup = this._filmElements.find((film) => film.id === Number(id));
      return this._filmPopup;
    };

    if (evt.target.classList.contains(`film-card__poster`) || evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__comments`)) {
      this._popupId = event.target.parentNode.dataset.id;
      this._currentFilm = findCard(this._popupId);
      this._renderPopupFilm();
    }
  }
  _renderPopupFilm() {
    const popupPresenter = new PopupPresenter(this._bodyTag, this._onPopupChange);
    popupPresenter.open(this._currentFilm);
    this._filmPopupInfo[this._currentFilm.id] = popupPresenter;
  }
  _renderFooter() {
    this._siteFooterStatistics = this._siteFooter.querySelector(`.footer__statistics`);

    render(this._siteFooterStatistics, new FilmsStatisticsView(this._filmElements), RenderPosition.BEFOREEND);
  }
}
