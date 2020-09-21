import AbstractView from "./abstract.js";

const createFilmsExtraListContainer = () => {
  return (
    `<section class="films-list--extra">
     </section>`
  );
};

export default class FilmsExtraListContainer extends AbstractView {
  getTemplate() {
    return createFilmsExtraListContainer();
  }
}
