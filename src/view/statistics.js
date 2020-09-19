import SmartView from './smart.js';
import {StatsFilter} from "../constants.js";
import {getUserStatus} from "../utils/stats.js";
import moment from "moment";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 50;

const generateChart = (statisticCtx, genres, genresCount) => {
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: genresCount,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const generateStatsDuration = (minutes) => {
  if (minutes > 0) {
    const duration = moment.duration(minutes, `minutes`);
    const time = duration.asHours().toFixed(2).split(`.`);
    return `${time[0]}<span class="statistic__item-description">h</span> ${time[1]}<span class="statistic__item-description">m</span>`;
  } else {
    return `0<span class="statistic__item-description">h</span> 0<span class="statistic__item-description">m</span>`;
  }
};

const createStatisticsTemplate = ({filter, watchedFilmsCount, totalDuration, topGenre}, userStatus) => {

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label ${userStatus === null ? `visually-hidden` : ``}">${userStatus}</span>
    </p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${filter === StatsFilter.ALL_TIME ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${filter === StatsFilter.TODAY ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${filter === StatsFilter.WEEK ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${filter === StatsFilter.MONTH ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${filter === StatsFilter.YEAR ? `checked` : ``}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount ? watchedFilmsCount : `0`} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${generateStatsDuration(totalDuration)}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre ? topGenre : ``}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;
};

export default class Statistics extends SmartView {
  constructor(statsData, moviesModel) {
    super();

    this._onChosenStats = this._onChosenStats.bind(this);
    this._statsData = statsData;
    this._moviesModel = moviesModel;
    this._chart = null;

    this._setChart();
  }
  getTemplate() {
    return createStatisticsTemplate(this._statsData, getUserStatus(this._moviesModel.getIsHistoryMovies()));
  }
  _onChosenStats(evt) {
    evt.preventDefault();
    this._callback.statsValue(evt.target.value);
  }
  onStatsFilterClick(callback) {
    this._callback.statsValue = callback;
    this.getElement().querySelectorAll(`.statistic__filters-input`).forEach((filter) => filter.addEventListener(`click`, this._onChosenStats));
  }
  _setChart() {
    const genres = Object.keys(this._statsData.genreCount);
    const genresCount = Object.values(this._statsData.genreCount);
    const genresLength = genres.length;

    if (genresLength) {
      const statisticCtx = this.getElement().querySelector(`.statistic__chart`);
      statisticCtx.height = BAR_HEIGHT * genresLength;
      this._chart = generateChart(statisticCtx, genres, genresCount);
    }
  }
}
