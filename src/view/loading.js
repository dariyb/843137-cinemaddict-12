import AbstractView from "./abstract.js";

const createLoadingTemplate = () => {
  return `<h2 class="films-list__title">Loading...</h2>`;
};

class Loading extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}

export default Loading;
