import FilmsSectionView from "../view/films-section.js";
import FilmsListView from "../view/films-list.js";
import NoFilmsView from "../view/no-films.js";
import SortView from "../view/sorting-list.js";
import FilmsListContainerView from "../view/films-list-container.js";
import FilmsListElementView from "../view/films-list-element.js";
import FilmsExtraListView from "../view/extra-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import FilmPopupView from "../view/film-details.js";
import {FILM_COUNT, TOP_RATED, MOST_COMMENTED, DOUBLE_SECTION, FILM_COUNT_PER_STEP, ESC_KEYCODE} from "../constants.js";
import FilmCommentView from "../view/popup-comments.js";
import FilmGenreView from "../view/genre.js";
import FilmsStatisticsView from "../view/films-statistics.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {sortFilmDateUp, sortFilmRatingUp} from "../utils/film.js";
import {SortType} from "../constants.js";

export default class MovieList {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderTemplateedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._noFilmsList = new NoFilmsView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._siteFooter = document.querySelector(`.footer`);

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
    this._renderFilms();
  }
  _renderSort() {
    // метод рендеринга для будущей сортировки
    render(this._filmsSectionComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
    this._sortComponent.onSortTypeClick(this._onSortTypeChangeClick);
  }
  _renderFilm(filmListElement, film) {
    // текущая функция renderFilm
    this._filmComponent = new FilmsListElementView(film);

    render(filmListElement, this._filmComponent, RenderPosition.BEFOREEND);
  }
  _renderFilms() {
    // по идее renderContent
    for (let i = 0; i < Math.min(this._filmElements.length, FILM_COUNT_PER_STEP); i++) {
      this._renderFilm(this._filmsListContainerComponent, this._filmElements[i]);
    }
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

    // this._showMoreButtonComponent.onButtonClick(() => {
    //   this._filmElements
    //   .slice(this._renderTemplateedFilmCount, this._renderTemplateedFilmCount + FILM_COUNT_PER_STEP)
    //   .forEach((film) => this._renderFilm(this._filmsListContainerComponent, film));
    //
    //   this._renderTemplateedFilmCount += FILM_COUNT_PER_STEP;
    //
    //   if (this._renderTemplateedFilmCount >= this._filmElements.length) {
    //     remove(this._showMoreButtonComponent);
    //   }
    // });
  }
  _clearFilmList() {
    this._filmsListContainerComponent.getElement().innerHTML = ``;
    this._renderTemplateedFilmCount = FILM_COUNT_PER_STEP;
  }
  _renderFilmsSection() {
    if (FILM_COUNT <= 0) {
      this._renderNoFilms();
    } else {
      this._renderFilms();
    }
    this._renderSort();

    if (this._filmElements.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }
  _renderPopupFilm() {
    const onEscPress = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closePopup();
      }
    };

    const onCloseButtonClick = (evt) => {
      if (evt.target.classList.contains(`film-details__close-btn`)) {
        closePopup();
      }
    };

    this._bodyTag = document.querySelector(`body`);

    const closePopup = () => {

      this._popup = document.querySelector(`.film-details`);
      if (this._popup) {
        this._bodyTag.removeChild(this._popup);
      }

      document.removeEventListener(`keydown`, onEscPress);
      document.removeEventListener(`click`, onCloseButtonClick);
    };

    const openPopup = (currentFilm) => {

      this._filmPopupComponent = new FilmPopupView(currentFilm);

      this._bodyTag.appendChild(this._filmPopupComponent.getElement());

      this._filmGenreTable = this._filmPopupComponent.getElement().querySelector(`.film-details__table tbody`);
      this._filmTableRows = this._filmGenreTable.querySelectorAll(`.film-details__row`);
      this._filmGenreRow = this._filmTableRows[this._filmTableRows.length - 1];

      currentFilm.genre.genres.forEach((film) => render(this._filmGenreRow.querySelector(`.film-details__cell`), new FilmGenreView(film), RenderPosition.BEFOREEND));

      this._filmPopupCommentList = this._filmPopupComponent.getElement().querySelector(`.film-details__comments-list`);

      currentFilm.comments.forEach((film) => render(this._filmPopupCommentList, new FilmCommentView(film), RenderPosition.BEFOREEND));

      document.addEventListener(`keydown`, onEscPress);
      document.addEventListener(`click`, onCloseButtonClick);
    };

    const findCard = (id) => {
      this._filmPopup = this._filmElements.find((film) => film.id === Number(id));
      return this._filmPopup;
    };

    const cardFilmClickHandler = (evt) => {

      if (evt.target.classList.contains(`film-card__poster`) || evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__comments`)) {
        this._popupId = event.target.parentNode.dataset.id;
        this._currentFilm = findCard(this._popupId);
        openPopup(this._currentFilm);
      }
    };

    this._filmsSectionComponent.onFilmsSectionClick(cardFilmClickHandler);
  }
  _renderFooter() {
    this._siteFooterStatistics = this._siteFooter.querySelector(`.footer__statistics`);

    render(this._siteFooterStatistics, new FilmsStatisticsView(this._filmElements), RenderPosition.BEFOREEND);
  }
}
