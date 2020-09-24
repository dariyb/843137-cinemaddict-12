import AbstractView from "./abstract.js";


const createShowMoreFilmsTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

class ShowMoreButton extends AbstractView {
  constructor() {
    super();
    this._onShowMoreClick = this._onShowMoreClick.bind(this);
  }

  getTemplate() {
    return createShowMoreFilmsTemplate();
  }

  _onShowMoreClick(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  onButtonClick(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._onShowMoreClick);
  }

}

export default ShowMoreButton;
