import {createElement} from "../utils.js";

const createFilmGenres = (film) => {
  const {genre} = film;
  return `<td class="film-details__term">${genre.title}</td>
    <td class="film-details__cell"></td>`;
};

export default class FilmGenres {
  constructor(film) {
    this._film = film;
    this._element = null;
  }
  getTemplate() {
    return createFilmGenres(this._film);
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
