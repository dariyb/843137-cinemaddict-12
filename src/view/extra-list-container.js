import AbstractView from "./abstract.js";

const createFilmsExtraListContainer = () => {
  return (
    `<section class="films-list--extra">
     </section>`
  );
};

class FilmsExtraListContainer extends AbstractView {
  getTemplate() {
    return createFilmsExtraListContainer();
  }
}

export default FilmsExtraListContainer;
