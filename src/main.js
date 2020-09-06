import UserAccount from "./view/user-account.js";
import {generateFilmInfo} from "./mock/film.js";
import {FILM_COUNT} from "./constants.js";
import {RenderPosition, render} from "./utils/render.js";
import MovieListPresenter from "./presenter/films.js";
import FilterPresenter from "./presenter/filter.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";

const films = new Array(FILM_COUNT).fill().map(generateFilmInfo);

const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, new UserAccount(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

const moviesModel = new MoviesModel();
moviesModel.setFilms(films);
const filterModel = new FilterModel();

const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);

filterPresenter.init();
movieListPresenter.init();
