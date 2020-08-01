import {createUserAccountTemplate} from "./view/user-account.js";
import {createSiteNavigationTemplate} from "./view/navigation.js";
import {createSiteSortingListTemplate} from "./view/sorting-list.js";
import {createSiteFilmsSectionTemplate} from "./view/films-section.js";
import {createSiteFilmsListElementTemplate} from "./view/films-list.js";
import {createFilmsExtraList} from "./view/extra-list.js";
import {createShowMoreFilmsTemplate} from "./view/show-more-button.js";
import {createFilmsStatisticsTemplate} from "./view/films-statistics.js";

const FILM_COUNT = 5;
const TOP_RATED = 2;
const MOST_COMMENTED = 2;
const DOUBLE_SECTION = 2;

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

for (let i = 0; i < FILM_COUNT; i++) {
  render(siteFilmsListContainer, createSiteFilmsListElementTemplate(), `beforeend`);
}

const siteFilmsList = siteMainElement.querySelector(`.films-list`);

render(siteFilmsList, createShowMoreFilmsTemplate(), `beforeend`);

const siteExtraTopFilms = siteMainElement.querySelector(`.films-list--extra`);
const siteExtraFilmsContainer = siteExtraTopFilms.querySelector(`.films-list__container`);

for (let i = 0; i < TOP_RATED; i++) {
  render(siteExtraFilmsContainer, createSiteFilmsListElementTemplate(), `beforeend`);
}

const siteExtraMostFilms = siteMainElement.querySelector(`.films-list--extra:last-child`);
const extraFilmsContainer = siteExtraMostFilms.querySelector(`.films-list__container`);

for (let i = 0; i < MOST_COMMENTED; i++) {
  render(extraFilmsContainer, createSiteFilmsListElementTemplate(), `beforeend`);
}

const siteFooterStatistics = document.querySelector(`.footer__statistics`);

render(siteFooterStatistics, createFilmsStatisticsTemplate(), `beforeend`);
