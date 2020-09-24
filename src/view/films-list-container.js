import AbstractView from "./abstract.js";


const createFilmsListContainer = () => {
  return `<div class="films-list__container"></div>`;
};

class FilmsListContainer extends AbstractView {
  getTemplate() {
    return createFilmsListContainer();
  }
}

export default FilmsListContainer;
