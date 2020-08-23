export const humanizeCommentDate = (dueDate) => {
  return dueDate.toLocaleString(`en-US`, {year: `numeric`, month: `numeric`, day: `numeric`, hour: `numeric`, minute: `numeric`, hour12: false});
};

export const sortFilmDateUp = (filmA, filmB) => {
  return filmB.releaseDate - filmA.releaseDate;
};

export const sortFilmRatingUp = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};
