import FilmsSectionView from "../view/films-section.js";
import FilmsListView from "../view/films-list.js";
import NoFilmsView from "../view/no-films.js";
import SortView from "../view/sorting-list.js";
import FilmsListContainerView from "../view/films-list-container.js";
import FilmsListElementView from "../view/films-list-element.js";
import FilmsExtraListView from "../view/extra-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import PopupPresenter from "./popup.js";
import {updateItem} from "../utils/common.js";
import {TOP_RATED, MOST_COMMENTED, DOUBLE_SECTION, FILM_COUNT_PER_STEP} from "../constants.js";
import FilmsStatisticsView from "../view/films-statistics.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {sortFilmDateUp, sortFilmRatingUp} from "../utils/film.js";
import {SortType} from "../constants.js";

export default class MovieList {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderTemplateedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._popupPresenter = {};

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._noFilmsList = new NoFilmsView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._siteFooter = document.querySelector(`.footer`);

    this._onFilmChange = this._onFilmChange.bind(this);
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
    this._renderPopupFilm();
    this._renderFooter();
  }
  _onFilmChange(updatedFilm) {
    this._filmElements = updateItem(this._filmElements, updatedFilm);
    this._initFilmElements = updateItem(this._initFilmElements, updatedFilm);
    this._popupPresenter[updatedFilm.id].open(updatedFilm);
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
    this._renderMainFilms();
    this._renderShowMoreButton();
  }
  _renderSort() {
    // метод рендеринга для будущей сортировки
    render(this._filmsSectionComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
    this._sortComponent.onSortTypeClick(this._onSortTypeChangeClick);
  }
  _renderFilm(filmListElement, film) {
    // текущая функция renderFilm
    this._filmComponent = new FilmsListElementView(film);

    // this._onFavoriteClick = this._onFavoriteClick.bind(this);
    // this._onWatchListClick = this._onWatchListClick.bind(this);
    // this._onHistoryClick = this._onHistoryClick.bind(this);

    render(filmListElement, this._filmComponent, RenderPosition.BEFOREEND);

    // this._filmComponent.onFavoriteButtonClick(this._onFavoriteClick);
    // this._filmComponent.onWatchListButtonClick(this._onWatchListClick);
    // this._filmComponent.onHistoryButtonClick(this._onHistoryClick);
  }
  _renderMainFilms() {
    for (let i = 0; i < Math.min(this._filmElements.length, FILM_COUNT_PER_STEP); i++) {
      this._renderFilm(this._filmsListContainerComponent, this._filmElements[i]);
    }
  }
  _renderFilms() {
    // по идее renderContent
    for (let i = 0; i < DOUBLE_SECTION; i++) {
      const title = [`Top rated`, `Most commented`];
      render(this._filmsSectionComponent, new FilmsExtraListView(title[i]), RenderPosition.BEFOREEND);
    }

    this._siteExtraTopFilms = this._filmsContainer.querySelector(`.films-list--extra`);
    this._siteExtraListContainer = this._siteExtraTopFilms.querySelector(`.films-list__container`);

    const getTopRatedFilms = (elem) => {
      return elem
      .slice()
      .sort((a, b) => a.rating > b.rating ? -1 : 1)
      .slice(0, TOP_RATED);
    };

    for (const item of getTopRatedFilms(this._filmElements)) {
      render(this._siteExtraListContainer, new FilmsListElementView(item), RenderPosition.BEFOREEND);
    }

    this._siteExtraMostFilms = this._filmsContainer.querySelector(`.films-list--extra:last-child`);
    this._extraFilmsContainer = this._siteExtraMostFilms.querySelector(`.films-list__container`);

    const getMostCommentedFilms = (elem) => {
      return elem
      .slice()
      .sort((a, b) => a.comments.length > b.comments.length ? -1 : 1)
      .slice(0, MOST_COMMENTED);
    };

    for (const item of getMostCommentedFilms(this._filmElements)) {
      render(this._extraFilmsContainer, new FilmsListElementView(item), RenderPosition.BEFOREEND);
    }
  }
  _onFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._currentFilm,
            {
              isFavorite: !this._currentFilm.isFavorite
            }
        )
    );
  }
  _onWatchListClick() {
    this._changeData(
        Object.assign(
            {},
            this._currentFilm,
            {
              isWatchlist: !this._currentFilm.isWatchlist
            }
        )
    );
  }
  _onHistoryClick() {
    this._changeData(
        Object.assign(
            {},
            this._currentFilm,
            {
              isHistory: !this._currentFilm.isHistory
            }
        )
    );
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
      .values(this._popupPresenter)
      .forEach((presenter) => presenter.destroy());
    this._popupPresenter = {};
    this._renderTemplateedFilmCount = FILM_COUNT_PER_STEP;
  }
  _renderFilmsSection() {
    const filmsElementsLength = this._filmElements.length;

    if (filmsElementsLength <= 0) {
      this._renderNoFilms();
    } else {
      this._renderMainFilms();
      this._renderFilms();
    }
    this._renderSort();

    if (filmsElementsLength > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }
  _renderPopupFilm() {

    const findCard = (id) => {
      this._filmPopup = this._filmElements.find((film) => film.id === Number(id));
      return this._filmPopup;
    };

    const popupPresenter = new PopupPresenter();

    const cardFilmClickHandler = (evt) => {
      if (evt.target.classList.contains(`film-card__poster`) || evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__comments`)) {
        this._popupId = event.target.parentNode.dataset.id;
        this._currentFilm = findCard(this._popupId);
        popupPresenter.open(this._currentFilm);
        this._popupPresenter[this._currentFilm.id] = popupPresenter;
      }
    };

    this._filmsSectionComponent.onFilmsSectionClick(cardFilmClickHandler);
  }
  _renderFooter() {
    this._siteFooterStatistics = this._siteFooter.querySelector(`.footer__statistics`);

    render(this._siteFooterStatistics, new FilmsStatisticsView(this._filmElements), RenderPosition.BEFOREEND);
  }
}
