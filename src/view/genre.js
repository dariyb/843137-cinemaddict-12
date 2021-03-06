import AbstractView from "./abstract.js";

const getFilmGenre = (genres) => {
  return `<span class="film-details__genre">${genres}</span>`;
};

class FilmGenre extends AbstractView {
  constructor(genres) {
    super();
    this._genres = genres;
  }

  getTemplate() {
    return getFilmGenre(this._genres);
  }

}

export default FilmGenre;
