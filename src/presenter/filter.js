import NavigationView from "../view/navigation.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {FilterType, UpdateType} from "../constants.js";

export default class Filter {
  constructor(filterContainer, filterModel, moviesModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._onModelEvent = this._onModelEvent.bind(this);
    this._onFilterChangeType = this._onFilterChangeType.bind(this);

    this._moviesModel.addObserver(this._onModelEvent);
    this._filterModel.addObserver(this._onModelEvent);
  }
  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new NavigationView(filters, this._currentFilter);
    this._filterComponent.onFilterTypeChange(this._onFilterChangeType);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }
  _onModelEvent() {
    this.init();
  }
  _onFilterChangeType(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
  _getFilters() {
    const films = this._moviesModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: `All Movies`,
        count: 0
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
