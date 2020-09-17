import Observer from "../utils/observer.js";
import {FilterType} from "../constants.js";

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }
  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }
  getFilter() {
    if (this._activeFilter === `stats`) {
      this._activeFilter = FilterType.ALL;
    }
    return this._activeFilter;
  }
}
