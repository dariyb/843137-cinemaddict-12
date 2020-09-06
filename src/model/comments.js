import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }
  getComments(comments) {
    this._comments = comments.slice();
  }
  setComments() {
    return this._comments;
  }
  addComment(updateType, update) {
    this._comments = [
      update,
      ...this._comments
    ];
    this._notify(updateType, update);
  }
  // deleteComment(updateType, update) {
  //   const index = this._comments.findIndex((comment) => comment.id === update.id);
  //
  //   if (index === -1) {
  //     throw new Error(`Cannot update unexisting popup`);
  //   }
  //   this._comments = [
  //     ...this._comments.slice(0, index),
  //     update,
  //     ...this._comments.slice(index + 1)
  //   ];
  //   this._notify(updateType);
  // }
}