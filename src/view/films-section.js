import AbstractView from "./abstract.js";


const createSiteFilmsSectionTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class FilmsSection extends AbstractView {
  constructor() {
    super();
    this._onFilmsSection = this._onFilmsSection.bind(this);
  }
  getTemplate() {
    return createSiteFilmsSectionTemplate();
  }
  _onFilmsSection(evt) {
    this._callback.filmsSectionClick(evt);
  }
  onFilmsSectionClick(callback) {
    this._callback.filmsSectionClick = callback;
    this.getElement().addEventListener(`click`, this._onFilmsSection);
  }
}
