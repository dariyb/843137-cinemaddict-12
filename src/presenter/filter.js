import NavigationView from "../view/navigation.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {FilterType, UpdateType, MenuItem} from "../constants.js";

class Filter {
  constructor(filterContainer, filterModel, moviesModel, statisticsPresenter, movieListPresenter) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._statisticsPresenter = statisticsPresenter;
    this._movieListPresenter = movieListPresenter;
    this._currentFilter = null;

    this._filterComponent = null;

    this._statisticMode = MenuItem.DEFAULT;

    this._onModelEvent = this._onModelEvent.bind(this);
    this._onFilterChangeType = this._onFilterChangeType.bind(this);
    this._openStatistics = this._openStatistics.bind(this);

    this._moviesModel.addObserver(this._onModelEvent);
    this._filterModel.addObserver(this._onModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new NavigationView(filters, this._currentFilter, this._statisticMode);
    this._filterComponent.onFilterTypeChange(this._onFilterChangeType);
    this._filterComponent.onStatisticsClick(this._openStatistics);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _openStatistics() {
    if (this._statisticMode === MenuItem.DEFAULT) {
      this._statisticMode = MenuItem.STATS;
      this._movieListPresenter.hideFilmsSection();
      this._statisticsPresenter.init();
    }
  }

  _onModelEvent() {
    this.init();
  }

  _onFilterChangeType(filterType) {
    this._currentFilter = null;
    if (this._currentFilter === filterType) {
      return;
    }
    if (filterType !== `stats`) {
      this._statisticMode = MenuItem.DEFAULT;
      this._statisticsPresenter.removeSection();
      this._movieListPresenter.showFilmsSection();
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._moviesModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: `All Movies`,
        count: filter[FilterType.ALL](films).length
      },
      {
        type: FilterType.WATCHLIST,
        name: `Watchlist`,
        count: filter[FilterType.WATCHLIST](films).length
      },
      {
        type: FilterType.HISTORY,
        name: `History`,
        count: filter[FilterType.HISTORY](films).length
      },
      {
        type: FilterType.FAVORITES,
        name: `Favorites`,
        count: filter[FilterType.FAVORITES](films).length
      },
    ];
  }

}

export default Filter;
