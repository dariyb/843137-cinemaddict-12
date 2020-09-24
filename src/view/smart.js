import AbstractView from "./abstract.js";

class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;

    this.onRestore();
  }

  onRestore() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}

export default Smart;
