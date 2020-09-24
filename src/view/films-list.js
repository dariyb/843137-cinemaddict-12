import AbstractView from "./abstract.js";

const createFilmsListTemplate = () => {
  return `<section class="films-list"></section>`;
};

class FilmsList extends AbstractView {
  getTemplate() {
    return createFilmsListTemplate();
  }
}

export default FilmsList;
