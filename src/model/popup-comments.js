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
  addComment(updateType, update) {
    const index = update.movie.id;

    this._comments = [
      ...this._comments.slice(0, index),
      update.comments,
      ...this._comments.slice(index + 1)
    ];
    this._notify(updateType, update);
  }
  deleteComment(updateType, update) {
    const missingComment = this._comments[update.id].filter((comment) => comment.id !== update.deletedIdComment);

    const index = update.id;

    this._comments = [
      ...this._comments.slice(0, index),
      missingComment,
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType, update);
  }
}
