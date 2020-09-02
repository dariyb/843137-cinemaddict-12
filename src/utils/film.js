import moment from "moment";

export const DatePlace = {
  POPUPDATE: `film release`,
  COMMENTDATE: `comment date`
};
export const convertDate = (date, place) => {
  switch (place) {
    case DatePlace.POPUPDATE:
      return moment(date).format(`DD MMMM YYYY`);
    case DatePlace.COMMENTDATE:
      return moment(date).format(`YYYY/MM/DD HH:mm`);
  }
  throw new Error(`This is not the right format`);
};

export const sortFilmDateUp = (filmA, filmB) => {
  return filmB.releaseDate - filmA.releaseDate;
};

export const sortFilmRatingUp = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};
