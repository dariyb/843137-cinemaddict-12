import UserAccount from "./view/user-account.js";
import NavigationView from "./view/navigation.js";
import {generateFilmInfo} from "./mock/film.js";
import {FILM_COUNT} from "./constants.js";
import {RenderPosition, render} from "./utils/render.js";
import MovieListPresenter from "./presenter/films.js";

const films = new Array(FILM_COUNT).fill().map(generateFilmInfo);

const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, new UserAccount(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

const countWatchlist = (added) => {
  const filmListNew = {
    watchlist: added.filter((index) => index.isWatchlist === true),
    favorite: added.filter((index) => index.isFavorite === true),
    history: added.filter((index) => index.isHistory === true),
  };
  return filmListNew;
};
render(siteMainElement, new NavigationView(countWatchlist(films)), RenderPosition.AFTERBEGIN);

const movieListPresenter = new MovieListPresenter(siteMainElement);

movieListPresenter.init(films);
