import {createElement} from "../utils.js";

const createSiteFilmsListTemplate = () => {
  return `<section class="films-list"></section>`;
};

export default class FilmsList {
  constructor() {
    this._element = null;
  }
  getTemplate() {
    return createSiteFilmsListTemplate();
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }
}
