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
import {FILM_COUNT, TOP_RATED, MOST_COMMENTED, DOUBLE_SECTION, ESC_KEYCODE, FILM_COUNT_PER_STEP} from "./utils.js";
import {createFilmCommentTemplate} from "./view/comments.js";
import {createFilmGenres} from "./view/genres.js";
import {getFilmGenre} from "./view/genre.js";

const films = new Array(FILM_COUNT).fill().map(generateFilmInfo);
const extraTitlesList = [`<h2 class="films-list__title">Top rated</h2>`, `<h2 class="films-list__title">Most commented</h2>`];

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createUserAccountTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);

render(siteMainElement, createSiteNavigationTemplate(), `afterbegin`);
render(siteMainElement, createSiteSortingListTemplate(), `beforeend`);
render(siteMainElement, createSiteFilmsSectionTemplate(), `beforeend`);

const siteFilmsElement = siteMainElement.querySelector(`.films`);
for (let i = 0; i < DOUBLE_SECTION; i++) {
  render(siteFilmsElement, createFilmsExtraList(), `beforeend`);
}

const siteFilmsListContainer = siteMainElement.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  render(siteFilmsListContainer, createSiteFilmsListElementTemplate(films[i]), `beforeend`);
}

const siteFilmsList = siteMainElement.querySelector(`.films-list`);

const siteExtraTopFilms = siteMainElement.querySelector(`.films-list--extra`);
const extraFilmsList = siteMainElement.querySelectorAll(`.films-list--extra`);

extraFilmsList.forEach((item, index) => {
  render(item, extraTitlesList[index], `afterbegin`);
});

const siteExtraFilmsContainer = siteExtraTopFilms.querySelector(`.films-list__container`);

films.slice().sort((a, b) => a.rating > b.rating ? -1 : 1).filter((item, index) => index < TOP_RATED).forEach((item) => render(siteExtraFilmsContainer, createSiteFilmsListElementTemplate(item), `beforeend`));

const siteExtraMostFilms = siteMainElement.querySelector(`.films-list--extra:last-child`);
const extraFilmsContainer = siteExtraMostFilms.querySelector(`.films-list__container`);

films.slice().sort((a, b) => a.comments.length > b.comments.length ? -1 : 1).filter((item, index) => index < MOST_COMMENTED).forEach((item) => render(extraFilmsContainer, createSiteFilmsListElementTemplate(item), `beforeend`));

const siteFooter = document.querySelector(`.footer`);
const siteFooterStatistics = siteFooter.querySelector(`.footer__statistics`);

render(siteFooterStatistics, createFilmsStatisticsTemplate(films), `beforeend`);

const filmCard = siteMainElement.querySelectorAll(`.film-card`);
const filmPoster = siteMainElement.querySelectorAll(`.film-card__poster`);
const filmTitle = siteMainElement.querySelectorAll(`.film-card__title`);
const filmComments = siteMainElement.querySelectorAll(`.film-card__comments`);

const filmCardList = Array.from(filmCard);

const getPopup = () => document.querySelector(`.film-details`);

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(siteFilmsList, createShowMoreFilmsTemplate(), `beforeend`);

  const showMoreButton = siteMainElement.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
    .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
    .forEach((film) => render(siteFilmsListContainer, createSiteFilmsListElementTemplate(film), `beforeend`));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

const onEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

const onCloseButtonClick = (evt) => {
  const closeButton = getPopup().querySelector(`.film-details__close-btn`);

  if (evt.target === closeButton) {
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

  currentFilm.comments.forEach((film) => render(filmPopupCommentList, createFilmCommentTemplate(film), `beforeend`));

  render(filmGenreTable, createFilmGenres(currentFilm), `beforeend`);

  const filmTableRows = filmGenreTable.querySelectorAll(`.film-details__row`);
  const filmGenreRow = filmTableRows[filmTableRows.length - 1];

  currentFilm.genre.genres.forEach((film) => render(filmGenreRow.querySelector(`.film-details__cell`), getFilmGenre(film), `beforeend`));

  document.addEventListener(`keydown`, onEscPress);
  document.addEventListener(`click`, onCloseButtonClick);
};

for (let i = 0; i < filmCardList.length; i++) {
  const cardFilmClickHandler = (evt) => {
    if (evt.target === filmPoster[i] || evt.target === filmTitle[i] || evt.target === filmComments[i]) {
      closePopup();
      openPopup(films[i]);
    }
  };

  filmCardList[i].addEventListener(`click`, cardFilmClickHandler);

}
