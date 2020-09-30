import MoviesModel from "../model/movies.js";

const getSyncedFilms = (films) => {

  return films.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

const createStoreStructure = (films) => {
  return films.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (Provider.isOnline()) {
      return this._api.getMovies()
        .then((films) => {
          const items = createStoreStructure(films.map(MoviesModel.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(MoviesModel.adaptToClient));
  }

  getComments(filmId) {
    if (Provider.isOnline()) {
      return this._api.getComments(filmId);
    }
    return Promise.resolve([]);
  }

  updateFilm(film) {
    if (Provider.isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, MoviesModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._store.setItem(film.id, MoviesModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  addComment(popup) {
    return this._api.addComment(popup);
  }

  deleteComment(commentId) {
    return this._api.deleteComment(commentId);
  }

  sync() {
    if (Provider.isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);
          const items = createStoreStructure([...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}

export default Provider;
