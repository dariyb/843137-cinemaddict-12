import Observer from "../utils/observer.js";

export default class Popup extends Observer {
  constructor() {
    super();
    this._popup = [];
  }
  setPopup(popup) {
    this._popup = popup.slice();
  }
  getPopup() {
    return this._popup;
  }
  updatePopup(updateType, update) {
    const index = this._popup.findIndex((popup) => popup.id === update.id);

    if (index === -1) {
      throw new Error(`Cannot update unexisting popup`);
    }
    this._popup = [
      ...this._popup.slice(0, index),
      update,
      ...this._popup.slice(index + 1)
    ];
    this._notify(updateType, update);
  }
  deleteComment(updateType, update) {
    const index = this._popup.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error(`Cannot update unexisting popup`);
    }
    this._popup = [
      ...this._popup.slice(0, index),
      update,
      ...this._popup.slice(index + 1)
    ];
    this._notify(updateType);
  }
}
