import AbstractView from "./abstract.js";

const createFilmsExtraList = (title) => {
  return (
    `<section class="films-list--extra">
       <h2 class="films-list__title">${title}</h2>
       <div class="films-list__container"></div>
     </section>`
  );
};

class FilmsExtraList extends AbstractView {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return createFilmsExtraList(this._title);
  }

}

export default FilmsExtraList;
