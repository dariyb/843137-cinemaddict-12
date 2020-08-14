import UserAccount from "./view/user-account.js";
import NavigationView from "./view/navigation.js";
import SortView from "./view/sorting-list.js";
import FilmsSectionView from "./view/films-section.js";
import FilmsListView from "./view/films-list.js";
import NoFilmsView from "./view/no-films.js";
import FilmsListContainerView from "./view/films-list-container.js";
import FilmsListElementView from "./view/films-list-element.js";
import FilmsExtraListView from "./view/extra-list.js";
import ShowMoreButtonView from "./view/show-more-button.js";
import FilmsStatisticsView from "./view/films-statistics.js";
import FilmPopupView from "./view/film-details.js";
import {generateFilmInfo} from "./mock/film.js";
import {FILM_COUNT, TOP_RATED, MOST_COMMENTED, DOUBLE_SECTION, ESC_KEYCODE, FILM_COUNT_PER_STEP} from "./constants.js";
import FilmCommentView from "./view/popup-comments.js";
import FilmGenreView from "./view/genre.js";
import {RenderPosition, render} from "./utils.js";

const films = new Array(FILM_COUNT).fill().map(generateFilmInfo);

const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, new UserAccount().getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

const countWatchlist = (added) => {
  const filmListNew = {
    watchlist: added.filter((index) => index.isWatchlist === true),
    favorite: added.filter((index) => index.isFavorite === true),
    history: added.filter((index) => index.isHistory === true),
  };
  return filmListNew;
};

const filmsSectionComponent = new FilmsSectionView();
const filmsListComponent = new FilmsListView();
const filmsListContainerComponent = new FilmsListContainerView();
const noFilmsList = new NoFilmsView();

render(siteMainElement, new NavigationView(countWatchlist(films)).getElement(), RenderPosition.AFTERBEGIN);
render(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, filmsSectionComponent.getElement(), RenderPosition.BEFOREEND);
render(filmsSectionComponent.getElement(), filmsListComponent.getElement(), RenderPosition.BEFOREEND);
render(filmsListComponent.getElement(), filmsListContainerComponent.getElement(), RenderPosition.BEFOREEND);

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmsListElementView(film);

  render(filmListElement, filmComponent.getElement(), RenderPosition.BEFOREEND);

};

const renderContent = () => {
  for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
    renderFilm(filmsListContainerComponent.getElement(), films[i]);
  }
  for (let i = 0; i < DOUBLE_SECTION; i++) {
    const title = [`Top rated`, `Most commented`];
    render(filmsSectionComponent.getElement(), new FilmsExtraListView(title[i]).getElement(), RenderPosition.BEFOREEND);
  }

  const siteExtraTopFilms = siteMainElement.querySelector(`.films-list--extra`);
  const siteExtraListContainer = siteExtraTopFilms.querySelector(`.films-list__container`);

  const getTopRatedFilms = (elem) => {
    return elem
    .slice()
    .sort((a, b) => a.rating > b.rating ? -1 : 1)
    .slice(0, TOP_RATED);
  };

  for (const item of getTopRatedFilms(films)) {
    render(siteExtraListContainer, new FilmsListElementView(item).getElement(), RenderPosition.BEFOREEND);
  }

  const siteExtraMostFilms = filmsSectionComponent.getElement().querySelector(`.films-list--extra:last-child`);
  const extraFilmsContainer = siteExtraMostFilms.querySelector(`.films-list__container`);

  const getMostCommentedFilms = (elem) => {
    return elem
    .slice()
    .sort((a, b) => a.comments.length > b.comments.length ? -1 : 1)
    .slice(0, MOST_COMMENTED);
  };

  for (const item of getMostCommentedFilms(films)) {
    render(extraFilmsContainer, new FilmsListElementView(item).getElement(), RenderPosition.BEFOREEND);
  }
};

if (FILM_COUNT <= 0) {
  render(filmsListComponent.getElement(), noFilmsList.getElement(), RenderPosition.BEFOREEND);
} else {
  renderContent();
}

const siteFooter = document.querySelector(`.footer`);
const siteFooterStatistics = siteFooter.querySelector(`.footer__statistics`);

render(siteFooterStatistics, new FilmsStatisticsView(films).getElement(), RenderPosition.BEFOREEND);

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

const bodyTag = document.querySelector(`body`);

const closePopup = function () {

  const popup = document.querySelector(`.film-details`);
  if (popup) {
    bodyTag.removeChild(popup);
  }

  document.removeEventListener(`keydown`, onEscPress);
  document.removeEventListener(`click`, onCloseButtonClick);
};

const openPopup = (currentFilm) => {

  const filmPopupComponent = new FilmPopupView(currentFilm);

  bodyTag.appendChild(filmPopupComponent.getElement());

  const filmGenreTable = filmPopupComponent.getElement().querySelector(`.film-details__table tbody`);
  const filmTableRows = filmGenreTable.querySelectorAll(`.film-details__row`);
  const filmGenreRow = filmTableRows[filmTableRows.length - 1];

  currentFilm.genre.genres.forEach((film) => render(filmGenreRow.querySelector(`.film-details__cell`), new FilmGenreView(film).getElement(), RenderPosition.BEFOREEND));

  const filmPopupCommentList = filmPopupComponent.getElement().querySelector(`.film-details__comments-list`);

  currentFilm.comments.forEach((film) => render(filmPopupCommentList, new FilmCommentView(film).getElement(), RenderPosition.BEFOREEND));

  document.addEventListener(`keydown`, onEscPress);
  document.addEventListener(`click`, onCloseButtonClick);
};

const findCard = (id) => {
  const filmPopup = films.find((film) => film.id === Number(id));
  return filmPopup;
};

const cardFilmClickHandler = (evt) => {

  if (evt.target.classList.contains(`film-card__poster`) || evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__comments`)) {
    const popupId = event.target.parentNode.dataset.id;
    const currentFilm = findCard(popupId);
    openPopup(currentFilm);
  }
};


filmsSectionComponent.getElement().addEventListener(`click`, cardFilmClickHandler);

if (films.length > FILM_COUNT_PER_STEP) {
  let renderTemplateedFilmCount = FILM_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();

  render(filmsListComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
    .slice(renderTemplateedFilmCount, renderTemplateedFilmCount + FILM_COUNT_PER_STEP)
    .forEach((film) => renderFilm(filmsListContainerComponent.getElement(), film));

    renderTemplateedFilmCount += FILM_COUNT_PER_STEP;

    if (renderTemplateedFilmCount >= films.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}
