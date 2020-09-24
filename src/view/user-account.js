import AbstractView from "./abstract.js";
import {getUserStatus} from "../utils/stats.js";


const createUserAccountTemplate = (userStatus) => {
  return `<section class="header__profile profile">
      <p class="profile__rating">${userStatus !== null ? userStatus : ``}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};

class UserAccount extends AbstractView {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
    this.getUsersStatus = this.getUsersStatus.bind(this);
    this._moviesModel.addObserver(this.getUsersStatus);
  }

  getTemplate() {
    return createUserAccountTemplate(getUserStatus(this._moviesModel.getIsHistoryMovies()));
  }

  getUsersStatus() {
    document.querySelector(`.profile__rating`).textContent = getUserStatus(this._moviesModel.getIsHistoryMovies());
  }

}

export default UserAccount;
