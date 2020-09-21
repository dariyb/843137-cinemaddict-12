import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }
  setComments(updateType, comments) {
    this._comments = comments.slice();

    this._notify(updateType);
  }
  getComments(filmId) {
    return this._comments[filmId];
  }
}
