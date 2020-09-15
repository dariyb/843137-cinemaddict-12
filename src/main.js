import UserAccount from "./view/user-account.js";
import {generateFilmInfo} from "./mock/film.js";
import {FILM_COUNT} from "./constants.js";
import {RenderPosition, render} from "./utils/render.js";
import MovieListPresenter from "./presenter/films.js";
import FilterPresenter from "./presenter/filter.js";
import StatsPresenter from "./presenter/stats.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";

const films = new Array(FILM_COUNT).fill().map(generateFilmInfo);

const siteHeaderElement = document.querySelector(`.header`);

const siteMainElement = document.querySelector(`.main`);

const moviesModel = new MoviesModel();
moviesModel.setFilms(films);
const filterModel = new FilterModel();

render(siteHeaderElement, new UserAccount(moviesModel), RenderPosition.BEFOREEND);

const statisticsPresenter = new StatsPresenter(siteMainElement, moviesModel);

const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel, statisticsPresenter, movieListPresenter);

filterPresenter.init();
movieListPresenter.init();
