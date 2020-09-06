import AbstractView from "./abstract.js";

const createSiteNavigationTemplate = (films, currentType) => {
  // const {watchlist, favorite, history} = films;
  const {type, name, count} = films;

  return (
    `<a href="#${type}" class="main-navigation__item ${type === currentType ? `main-navigation__item--active` : ``}" data-id="${type}">${name} <span class="main-navigation__item-count ${count === 0 ? `visually-hidden` : ``}">${count}</span></a>`
  );
};

export const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
  .map((filter) => createSiteNavigationTemplate(filter, currentFilterType))
  .join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
    ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
  // return (
  //   `<nav class="main-navigation">
  //     <div class="main-navigation__items">
  //       <a href="#all" class="main-navigation__item ${type === currentType ? `main-navigation__item--active` : ``}" data-id="${type}">All movies</a>
  //       <a href="#watchlist" class="main-navigation__item ${type === currentType ? `main-navigation__item--active` : ``}" data-id="${type}">Watchlist <span class="main-navigation__item-count">${watchlist.length}</span></a>
  //       <a href="#history" class="main-navigation__item ${type === currentType ? `main-navigation__item--active` : ``}" data-id="${type}">History <span class="main-navigation__item-count">${history.length}</span></a>
  //       <a href="#favorites" class="main-navigation__item ${type === currentType ? `main-navigation__item--active` : ``}" data-id="${type}">Favorites <span class="main-navigation__item-count">${favorite.length}</span></a>
  //     </div>
  //     <a href="#stats" class="main-navigation__additional">Stats</a>
  //   </nav>`
  // );

export default class Navigation extends AbstractView {
  constructor(films, currentFilterType) {
    super();
    this._films = films;
    this._currentFilter = currentFilterType;

    this._onFilterChange = this._onFilterChange.bind(this);
  }
  getTemplate() {
    return createFilterTemplate(this._films, this._currentFilter);
  }
  _onFilterChange(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.id);
  }
  onFilterTypeChange(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._onFilterChange);
  }
}
