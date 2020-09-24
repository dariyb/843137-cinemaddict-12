import AbstractView from "./abstract.js";
import {MenuItem, FilterType} from "../constants.js";

const createSiteNavigationItemTemplate = (films, currentType, menuItem) => {
  const {type, name, count} = films;

  return (
    `<a href="#${type}" class="main-navigation__item ${type === currentType && menuItem !== MenuItem.STATS ? `main-navigation__item--active` : ``}" data-id="${type}">${name} <span class="main-navigation__item-count ${type === FilterType.ALL ? `visually-hidden` : ``}">${count}</span></a>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType, menuItem) => {
  const filterItemsTemplate = filterItems
  .map((filter) => createSiteNavigationItemTemplate(filter, currentFilterType, menuItem))
  .join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
    ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional ${menuItem === MenuItem.STATS ? `main-navigation__additional--active` : ``}" data-id="stats">Stats</a>
  </nav>`;
};

class Navigation extends AbstractView {
  constructor(filters, currentFilterType, menuItem) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._menuItem = menuItem;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onStatsClick = this._onStatsClick.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter, this._menuItem);
  }

  _onFilterChange(evt) {
    evt.preventDefault();
    if (evt.target.dataset.id) {
      this._callback.filterTypeChange(evt.target.dataset.id);
    }
  }

  _onStatsClick(evt) {
    evt.preventDefault();
    this._callback.statsClick(evt.target.dataset.id);
  }

  onFilterTypeChange(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._onFilterChange);
  }

  onStatisticsClick(callback) {
    this._callback.statsClick = callback;
    this.getElement().querySelector(`[data-id='stats']`).addEventListener(`click`, this._onStatsClick);
  }

}

export default Navigation;
