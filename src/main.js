import {createUserAccountTemplate} from "./view/user-account.js";
import {createSiteNavigationTemplate} from "./view/navigation.js";
import {createSiteSortingListTemplate} from "./view/sorting-list.js";
import {createSiteFilmsSectionTemplate} from "./view/films-section.js";
import {createSiteFilmsListElementTemplate} from "./view/films-list.js";
import {createFilmsExtraList} from "./view/extra-list.js";
import {createShowMoreFilmsTemplate} from "./view/show-more-button.js";
import {createFilmsStatisticsTemplate} from "./view/films-statistics.js";
import {createFilmDetailsTemplate} from "./view/film-details.js";
import {generateFilmInfo} from "./mock/film.js";
import {FILM_COUNT, TOP_RATED, MOST_COMMENTED, DOUBLE_SECTION, ESC_KEYCODE, FILM_COUNT_PER_STEP} from "./constants.js";
import {createFilmCommentTemplate} from "./view/popup-comments.js";
import {createFilmGenres} from "./view/genres.js";
import {getFilmGenre} from "./view/genre.js";

const films = new Array(FILM_COUNT).fill().map(generateFilmInfo);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createUserAccountTemplate());

const siteMainElement = document.querySelector(`.main`);

const countWatchlist = (added) => {
  const filmListNew = {
    watchlist: added.filter((index) => index.isWatchlist === true),
    favorite: added.filter((index) => index.isFavorite === true),
    history: added.filter((index) => index.isHistory === true),
  };
  return filmListNew;
};

render(siteMainElement, createSiteNavigationTemplate(countWatchlist(films)), `afterbegin`);
render(siteMainElement, createSiteSortingListTemplate());
render(siteMainElement, createSiteFilmsSectionTemplate());

const siteFilmsElement = siteMainElement.querySelector(`.films`);
for (let i = 0; i < DOUBLE_SECTION; i++) {
  const title = [`Top rated`, `Most commented`];
  render(siteFilmsElement, createFilmsExtraList(title[i]));
}

const siteFilmsListContainer = siteMainElement.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  render(siteFilmsListContainer, createSiteFilmsListElementTemplate(films[i]));
}

const siteFilmsList = siteMainElement.querySelector(`.films-list`);

const siteExtraTopFilms = siteMainElement.querySelector(`.films-list--extra`);

const siteExtraFilmsContainer = siteExtraTopFilms.querySelector(`.films-list__container`);

const getTopRatedFilms = (elem) => {
  return elem
  .slice()
  .sort((a, b) => a.rating > b.rating ? -1 : 1)
  .slice(0, TOP_RATED);
};

for (const item of getTopRatedFilms(films)) {
  render(siteExtraFilmsContainer, createSiteFilmsListElementTemplate(item));
}

const siteExtraMostFilms = siteMainElement.querySelector(`.films-list--extra:last-child`);
const extraFilmsContainer = siteExtraMostFilms.querySelector(`.films-list__container`);

const getMostCommentedFilms = (elem) => {
  return elem
  .slice()
  .sort((a, b) => a.comments.length > b.comments.length ? -1 : 1)
  .slice(0, MOST_COMMENTED);
};

for (const item of getMostCommentedFilms(films)) {
  render(extraFilmsContainer, createSiteFilmsListElementTemplate(item));
}

const siteFooter = document.querySelector(`.footer`);
const siteFooterStatistics = siteFooter.querySelector(`.footer__statistics`);

render(siteFooterStatistics, createFilmsStatisticsTemplate(films));

const getPopup = () => document.querySelector(`.film-details`);

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

const closePopup = function () {
  if (getPopup()) {
    getPopup().remove();
  }

  document.removeEventListener(`keydown`, onEscPress);
  document.removeEventListener(`click`, onCloseButtonClick);
};

const openPopup = (currentFilm) => {
  render(siteFooter, createFilmDetailsTemplate(currentFilm), `afterend`);

  const filmPopupCommentList = document.querySelector(`.film-details__comments-list`);
  const filmGenreTable = document.querySelector(`.film-details__table`);

  currentFilm.comments.forEach((film) => render(filmPopupCommentList, createFilmCommentTemplate(film)));

  render(filmGenreTable, createFilmGenres(currentFilm));

  const filmTableRows = filmGenreTable.querySelectorAll(`.film-details__row`);
  const filmGenreRow = filmTableRows[filmTableRows.length - 1];

  currentFilm.genre.genres.forEach((film) => render(filmGenreRow.querySelector(`.film-details__cell`), getFilmGenre(film)));

  document.addEventListener(`keydown`, onEscPress);
  document.addEventListener(`click`, onCloseButtonClick);
};

const cardFilmClickHandler = (evt) => {
  if (evt.target.classList.contains(`film-card__poster`) || evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__comments`)) {
    closePopup();
    openPopup(films[0]);
  }
};

siteFilmsElement.addEventListener(`click`, cardFilmClickHandler);

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(siteFilmsList, createShowMoreFilmsTemplate());

  const showMoreButton = siteMainElement.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
    .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
    .forEach((film) => render(siteFilmsListContainer, createSiteFilmsListElementTemplate(film)));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

// проверить туда ли рендериться!!
