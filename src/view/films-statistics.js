import AbstractView from "./abstract.js";

const createFilmsStatisticsTemplate = (films) => {
  return `<p>${films.length} movies inside</p>`
  ;
};

class FilmsStatistics extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFilmsStatisticsTemplate(this._films);
  }

}

export default FilmsStatistics;
