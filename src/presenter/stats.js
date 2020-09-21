import StatisticsView from "../view/statistics.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {StatsFilter} from "../constants.js";
import moment from 'moment';

export default class Stats {
  constructor(elContainer, moviesModel) {
    this._elementContainer = elContainer;
    this._moviesModel = moviesModel;
    this._statsElement = null;
    this._currentStatsFilter = StatsFilter.ALL_TIME;

    this._inputStat = this._inputStat.bind(this);
  }
  init() {
    this._statsElement = new StatisticsView(this._getStatsInfo(this._moviesModel.getFilms(), this._currentStatsFilter), this._moviesModel);
    render(this._elementContainer, this._statsElement, RenderPosition.BEFOREEND);

    this._statsElement.onStatsFilterClick(this._inputStat);
  }
  removeSection() {
    remove(this._statsElement);
  }
  _inputStat(value) {
    remove(this._statsElement);
    this._currentStatsFilter = value;
    this.init();
  }
  _getStatsInfo(films, statsFilter) {
    const data = {
      watchedFilmsCount: null,
      totalDuration: null,
      topGenre: null,
      genreCount: null,
      filter: statsFilter
    };
    const allGenres = [];
    const currentDate = moment();
    const weekDate = moment().subtract(7, `days`);
    const monthDate = moment().subtract(1, `month`);
    const yearDate = moment().subtract(1, `year`);
    let historyFilms = null;
    switch (statsFilter) {
      case StatsFilter.ALL_TIME:
        historyFilms = films.filter((film) => film.isHistory === true);
        data.watchedFilmsCount = historyFilms.length;
        break;
      case StatsFilter.TODAY:
        historyFilms = films.filter((film) => {
          if (film.isHistory && moment(film.watchingDate).isSame(currentDate)) {
            return film;
          }
          return false;
        });
        data.watchedFilmsCount = historyFilms.length;
        break;
      case StatsFilter.WEEK:
        historyFilms = films.filter((film) => {
          if (film.isHistory && moment(film.watchingDate).isBetween(weekDate, currentDate)) {
            return film;
          }
          return false;
        });
        data.watchedFilmsCount = historyFilms.length;
        break;
      case StatsFilter.MONTH:
        historyFilms = films.filter((film) => {
          if (film.isHistory && moment(film.watchingDate).isBetween(monthDate, currentDate)) {
            return film;
          }
          return false;
        });
        data.watchedFilmsCount = historyFilms.length;
        break;
      case StatsFilter.YEAR:
        historyFilms = films.filter((film) => {
          if (film.isHistory && moment(film.watchingDate).isBetween(yearDate, currentDate)) {
            return film;
          }
          return false;
        });
        data.watchedFilmsCount = historyFilms.length;
        break;
    }
    data.totalDuration = historyFilms.reduce((count, {runningTime}) => count + runningTime, 0);

    historyFilms.forEach(({genre}) => {
      if (genre.length > 0) {
        allGenres.push(...genre);
      }
      return genre;
    });
    if (allGenres.length > 0) {
      data.genreCount = allGenres.reduce((genreCount, element) => {
        if (!genreCount[element]) {
          genreCount[element] = 0;
        }
        genreCount[element]++;
        return genreCount;
      }, {});

      data.topGenre = Object.keys(data.genreCount).reduce((currentFilm, nextFilm) => data.genreCount[currentFilm] > data.genreCount[nextFilm] ? currentFilm : nextFilm);
    }
    return data;
  }
}
