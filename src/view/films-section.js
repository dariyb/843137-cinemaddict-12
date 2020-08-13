import {createElement} from "../utils.js";

const createSiteFilmsSectionTemplate = () => {
  return (
    `<section class="films">
      <section class="films-list">
       <div class="films-list__container"></div>
      </section>
    </section>`
  );
};

export default class FilmsSection {
  constructor() {
    this._element = null;
  }
  getTemplate() {
    return createSiteFilmsSectionTemplate();
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
