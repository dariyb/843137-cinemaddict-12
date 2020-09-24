import AbstractView from "./abstract.js";
import {SortType} from "../constants.js";

const createSiteSortingListTemplate = (currentSortType) => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? `sort__button--active` : ``}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? `sort__button--active` : ``}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${currentSortType === SortType.RATING ? `sort__button--active` : ``}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>`
  );
};

class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeClick = this._sortTypeChangeClick.bind(this);
  }

  getTemplate() {
    return createSiteSortingListTemplate(this._currentSortType);
  }

  _sortTypeChangeClick(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  onSortTypeClick(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeClick);
  }

}

export default Sort;
