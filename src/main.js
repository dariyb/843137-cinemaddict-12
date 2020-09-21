import UserAccount from "./view/user-account.js";
import {RenderPosition, render} from "./utils/render.js";
import MovieListPresenter from "./presenter/films.js";
import FilterPresenter from "./presenter/filter.js";
import StatsPresenter from "./presenter/stats.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import CommentsModel from "./model/popup-comments.js";
import {UpdateType} from "./constants.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic er883jdzbdw`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const siteHeaderElement = document.querySelector(`.header`);

const siteMainElement = document.querySelector(`.main`);

const api = new Api(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();
const commentsModel = new CommentsModel();

const statisticsPresenter = new StatsPresenter(siteMainElement, moviesModel);

const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel, api, commentsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel, statisticsPresenter, movieListPresenter);

render(siteHeaderElement, new UserAccount(moviesModel), RenderPosition.BEFOREEND);

filterPresenter.init();
movieListPresenter.init();

api.getMovies()
.then((films) => {
  moviesModel.setFilms(UpdateType.INIT, films);
  return films;
})
.then((films) => {
  return Promise.all(films.map((item) => {
    return api.getComments(item.id);
  }));
})
.then((comments) => {
  commentsModel.setComments(UpdateType.INIT, comments);
})
.catch(() => {
  moviesModel.setFilms(UpdateType.INIT, []);
});
