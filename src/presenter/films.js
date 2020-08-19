import FilmsSectionView from "../view/films-section.js";
import FilmsListView from "../view/films-list.js";
import NoFilmsView from "../view/no-films.js";
import SortView from "../view/sorting-list.js";
import FilmsListContainerView from "../view/films-list-container.js";
import FilmsListElementView from "../view/films-list-element.js";
import FilmsExtraListView from "../view/extra-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
// import FilmPopupView from "../view/film-details.js";
import {FILM_COUNT, TOP_RATED, MOST_COMMENTED, DOUBLE_SECTION, FILM_COUNT_PER_STEP} from "../constants.js";
// import FilmCommentView from "../view/popup-comments.js";
// import FilmGenreView from "../view/genre.js";
import {RenderPosition, render, remove} from "../utils/render.js";

export default class Films {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderTemplateedFilmCount = FILM_COUNT_PER_STEP;

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._noFilmsList = new NoFilmsView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
  }
  init(filmsElements) {
    this._filmElements = filmsElements.slice();

    render(this._filmsContainer, this._filmsSectionComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

    this._renderFilmsSection();
  }
  _renderSort() {
    // метод рендеринга для будущей сортировки
    render(this._filmsSectionComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
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
  _renderShowMoreButton() {
    // отрисовка и функции кнопки показа
    // let renderTemplateedFilmCount = FILM_COUNT_PER_STEP;
    //
    // const showMoreButtonComponent = new ShowMoreButtonView();
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.onButtonClick(() => {
      this._filmElements
      .slice(this._renderTemplateedFilmCount, this._renderTemplateedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this._renderFilm(this._filmsListContainerComponent, film));

      this._renderTemplateedFilmCount += FILM_COUNT_PER_STEP;

      if (this._renderTemplateedFilmCount >= this._filmElements.length) {
        remove(this._showMoreButtonComponent);
      }
    });
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
}
