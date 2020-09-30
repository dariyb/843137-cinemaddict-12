import UserAccount from "./view/user-account.js";
import {RenderPosition, render} from "./utils/render.js";
import MovieListPresenter from "./presenter/films.js";
import FilterPresenter from "./presenter/filter.js";
import StatsPresenter from "./presenter/stats.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import CommentsModel from "./model/popup-comments.js";
import {UpdateType, AUTHORIZATION, END_POINT, STORE_NAME} from "./constants.js";
import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const siteHeaderElement = document.querySelector(`.header`);

const siteMainElement = document.querySelector(`.main`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();
const commentsModel = new CommentsModel();

const statisticsPresenter = new StatsPresenter(siteMainElement, moviesModel);

const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel, apiWithProvider, commentsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel, statisticsPresenter, movieListPresenter);

render(siteHeaderElement, new UserAccount(moviesModel), RenderPosition.BEFOREEND);

filterPresenter.init();
movieListPresenter.init();

apiWithProvider.getMovies()
.then((films) => {
  moviesModel.setFilms(UpdateType.INIT, films);
  return films;
})
.then((films) => {
  return Promise.all(films.map((item) => {
    return apiWithProvider.getComments(item.id);
  }));
})
.then((comments) => {
  commentsModel.setComments(UpdateType.INIT, comments);
})
.catch(() => {
  moviesModel.setFilms(UpdateType.INIT, []);
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {})
    .catch(() => {});

  if (!window.navigator.onLine) {
    document.title += ` [offline]`;
  }
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
