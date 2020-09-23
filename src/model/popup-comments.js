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
  updateFilm(updateType, update, updateComment) {
    const arrComm = [];
    this._comments[update.id].forEach((comment) => arrComm.push(comment));
    // console.log(arrComm);
    // console.log(update.id);
    // const index = this._comments[filmId].findIndex((film) => film === update.comments);
    const index = update.id;
    arrComm.push(updateComment.comments);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }
    this._comments = [
      ...this._comments.slice(0, index),
      arrComm,
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
