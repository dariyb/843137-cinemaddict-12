import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();
    this._films = [];

    this.getIsHistoryMovies = this.getIsHistoryMovies.bind(this);
  }
  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
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
  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
        {},
        {
          poster: movie.film_info.poster,
          name: movie.film_info.title,
          alternativeName: movie.film_info.alternative_title,
          rating: movie.film_info.total_rating,
          ageRating: movie.film_info.age_rating,
          releaseDate: movie.film_info.release.date !== null ? new Date(movie.film_info.release.date) : movie.film_info.release.date,
          runningTime: movie.film_info.runtime,
          genre: movie.film_info.genre,
          description: movie.film_info.description,
          comments: movie.comments,
          director: movie.film_info.director,
          writers: movie.film_info.writers,
          actors: movie.film_info.actors,
          country: movie.film_info.release.release_country,
          isWatchlist: movie.user_details.watchlist,
          isHistory: movie.user_details.already_watched,
          isFavorite: movie.user_details.favorite,
          watchingDate: movie.user_details.wathing_date !== null ? new Date(movie.user_details.watching_date) : movie.user_details.watching_date,
          id: movie.id
        }
    );
    return adaptedMovie;
  }
  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
        {},
        {
          "film_info": {
            "poster": movie.poster,
            "title": movie.name,
            "alternative_title": movie.alternativeName,
            "total_rating": movie.rating,
            "director": movie.director,
            "writers": movie.writers,
            "actors": movie.actors,
            "age_rating": movie.ageRating,
            "description": movie.description,
            "release": {
              "date": movie.releaseDate,
              "release_country": movie.country,
            },
            "runtime": movie.runningTime,
            "genre": movie.genre,
          },
          "comments": movie.comments,
          "user_details": {
            "already_watched": movie.isHistory,
            "watchlist": movie.isWatchlist,
            "favorite": movie.isFavorite,
            "watching_date": movie.watchingDate,
          },
          "id": movie.id
        }
    );

    return adaptedMovie;
  }
}
