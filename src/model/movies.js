import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();
    this._films = [];

    this.getIsHistoryMovies = this.getIsHistoryMovies.bind(this);
  }
  setFilms(films) {
    this._films = films.slice();
  }
  getFilms() {
    return this._films;
  }
  getIsHistoryMovies() {
    return this._films.filter((film) => film.isHistory).length;
  }
  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }
    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];
    this._notify(updateType, update);
  }
  addComment(updateType, update) {
    this._films = [
      update,
      ...this._films
    ];
    this._notify(updateType, update);
  }
  deleteComment(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }
    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];
    this._notify(updateType, update);
  }
}
