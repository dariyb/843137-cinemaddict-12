import moment from "moment";

const DatePlace = {
  POPUP_DATE: `film release`,
  COMMENT_DATE: `comment date`,
  RUNNING_TIME: `running-time`
};

const convertDate = (date, place) => {
  switch (place) {
    case DatePlace.POPUP_DATE:
      return moment(date).format(`DD MMMM YYYY`);
    case DatePlace.COMMENT_DATE:
      return moment(date).format(`YYYY/MM/DD HH:mm`);
  }
  throw new Error(`This is not the right format`);
};

const sortFilmDateUp = (filmA, filmB) => {
  return filmB.releaseDate - filmA.releaseDate;
};

const sortFilmRatingUp = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};

export {DatePlace, convertDate, sortFilmDateUp, sortFilmRatingUp};
