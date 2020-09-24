import StatisticsView from "../view/statistics.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {StatsFilter} from "../constants.js";
import moment from 'moment';

class Stats {
  constructor(elContainer, moviesModel) {
    this._elementContainer = elContainer;
    this._moviesModel = moviesModel;
    this._statsElement = null;
    this._historyFilms = null;
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
    const filmInfo = {
      watchedFilmsCount: null,
      totalDuration: null,
      topGenre: null,
      genreCount: null,
      filter: statsFilter
    };
    const allGenres = [];
    this._statsFilterFilms(statsFilter, films, filmInfo);

    filmInfo.totalDuration = this._historyFilms.reduce((count, {runningTime}) => count + runningTime, 0);

    this._historyFilms.forEach(({genre}) => {
      if (genre.length > 0) {
        allGenres.push(...genre);
      }
      return genre;
    });
    if (allGenres.length > 0) {
      filmInfo.genreCount = allGenres.reduce((genreCount, element) => {
        if (!genreCount[element]) {
          genreCount[element] = 0;
        }
        genreCount[element]++;
        return genreCount;
      }, {});

      filmInfo.topGenre = Object.keys(filmInfo.genreCount).reduce((currentFilm, nextFilm) => filmInfo.genreCount[currentFilm] > filmInfo.genreCount[nextFilm] ? currentFilm : nextFilm);
    }
    return filmInfo;
  }

  _statsFilterFilms(statsFilter, films, filmInfo) {
    const currentDate = moment();
    const weekDate = moment().subtract(7, `days`);
    const monthDate = moment().subtract(1, `month`);
    const yearDate = moment().subtract(1, `year`);
    switch (statsFilter) {
      case StatsFilter.ALL_TIME:
        this._historyFilms = films.filter((film) => film.isHistory === true);
        filmInfo.watchedFilmsCount = this._historyFilms.length;
        break;
      case StatsFilter.TODAY:
        this._historyFilms = films.filter((film) => {
          if (film.isHistory && moment(film.watchingDate).isSame(currentDate)) {
            return film;
          }
          return false;
        });
        filmInfo.watchedFilmsCount = this._historyFilms.length;
        break;
      case StatsFilter.WEEK:
        this._historyFilms = films.filter((film) => {
          if (film.isHistory && moment(film.watchingDate).isBetween(weekDate, currentDate)) {
            return film;
          }
          return false;
        });
        filmInfo.watchedFilmsCount = this._historyFilms.length;
        break;
      case StatsFilter.MONTH:
        this._historyFilms = films.filter((film) => {
          if (film.isHistory && moment(film.watchingDate).isBetween(monthDate, currentDate)) {
            return film;
          }
          return false;
        });
        filmInfo.watchedFilmsCount = this._historyFilms.length;
        break;
      case StatsFilter.YEAR:
        this._historyFilms = films.filter((film) => {
          if (film.isHistory && moment(film.watchingDate).isBetween(yearDate, currentDate)) {
            return film;
          }
          return false;
        });
        filmInfo.watchedFilmsCount = this._historyFilms.length;
        break;
    }
  }

}

export default Stats;
